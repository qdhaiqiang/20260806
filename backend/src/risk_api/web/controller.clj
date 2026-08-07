(ns risk-api.web.controller
  "HTTP 控制器，保持旧服务的 JSON 信封与字段命名兼容。"
  (:require [clojure.string :as str]
            [jsonista.core :as json]
            [risk-api.domain.workflow :as workflow]
            [risk-api.infra.database :as db]))

(defn- camel-key
  "把数据库蛇形列名转换为前端使用的驼峰字符串键。"
  [key]
  (let [parts (str/split (name key) #"_")]
    (apply str (first parts) (map str/capitalize (rest parts)))))

(defn- camelize
  "递归转换响应数据的关键字键，返回 JSON 兼容的数据结构。"
  [value]
  (cond (map? value) (into {} (map (fn [[k v]] [(if (keyword? k) (camel-key k) k) (camelize v)])) value)
        (sequential? value) (mapv camelize value)
        :else value))

(defn response
  "将 Clojure 数据编码为兼容服务的 JSON Ring 响应。"
  ([body] (response 200 body))
  ([status body]
   {:status status :headers {"Content-Type" "application/json; charset=utf-8"}
    :body (json/write-value-as-string (camelize body))}))

(defn- parse-int
  "安全解析整数查询参数；缺失或非法时返回默认值。"
  [value default]
  (try (if (some? value) (Integer/parseInt value) default) (catch Exception _ default)))

(defn- optional
  "把空白查询参数规范为 nil。"
  [value]
  (when-not (str/blank? value) value))

(defn- page-params
  "从请求查询参数计算分页限制、偏移量和过滤字段。"
  [request]
  (let [query (:query-params request) page (max 1 (parse-int (get query "pageNum") 1)) size (min 100 (max 1 (parse-int (get query "pageSize") 10)))]
    {:page page :limit size :offset (* (dec page) size)
     :enterprise_name (optional (get query "enterpriseName")) :risk_level (optional (get query "riskLevel"))
     :enterprise_group (optional (get query "enterpriseGroup")) :risk_type (optional (get query "riskType"))
     :operation_status (some-> (optional (get query "operationStatus")) (parse-int nil))
     :belonging_plate_id (optional (get query "belongingPlateId")) :indicator_source (some-> (optional (get query "indicatorSource")) (parse-int nil))
     :start_date (optional (get query "startDate")) :end_date (optional (get query "endDate"))
     :indicator_name (optional (get query "indicatorName"))}))

(defn login
  "处理旧版管理员登录，返回固定格式的本地开发令牌。"
  [_]
  (response {:code 0 :msg "success" :data {:token "local-risk-api-token" :expire 43200}}))

(defn risk-page
  "按旧接口参数查询风险分页列表。"
  [datasource request]
  (let [params (page-params request) total (:total (db/count-risks datasource params)) list (db/list-risks datasource params)]
    (response {:code 0 :msg "success" :data {:total total :list list}})))

(defn enterprise-page
  "按旧接口参数查询企业分页列表。"
  [datasource request]
  (let [params (page-params request) total (:total (db/count-enterprises datasource params)) list (db/list-enterprises datasource params)]
    (response {:code 0 :msg "success" :data {:total total :list list}})))

(defn index-page
  "按旧接口参数查询指标分页列表。"
  [datasource request]
  (let [params (page-params request) total (:total (db/count-indicators datasource params)) list (db/list-indicators datasource params)]
    (response {:code 0 :msg "success" :data {:total total :list list}})))

(defn risk-review
  "兼容旧版风险审核提交接口。"
  [datasource request]
  (response (workflow/risk-review! datasource (:body-params request))))

(defn export-risks
  "导出风险基础字段为 UTF-8 CSV 下载，供浏览器表格软件打开。"
  [datasource _]
  (let [rows (db/list-risks datasource {:enterprise_name nil :risk_level nil :enterprise_group nil :risk_type nil :operation_status nil :belonging_plate_id nil :indicator_source nil :start_date nil :end_date nil :limit 100000 :offset 0})
        line (fn [row] (str/join "," (map #(str "\"" (str/replace (str (or % "")) "\"" "\"\"") "\"") [(:id row) (:enterprise_name row) (:risk_indicator row) (:risk_content row) (:risk_level row) (:risk_type row) (:occur_time row)]))]
    {:status 200 :headers {"Content-Type" "text/csv; charset=utf-8" "Content-Disposition" "attachment; filename=risks.csv"}
     :body (str "\uFEFFid,enterpriseName,riskIndicator,riskContent,riskLevel,riskType,occurTime\n" (str/join "\n" (map line rows)))}))

(defn description
  "提交风险情况描述。"
  [datasource request]
  (response (workflow/submit-description! datasource (get-in request [:path-params :id]) (:body-params request))))

(defn confirmation
  "提交主责部门风险确认结论。"
  [datasource request]
  (response (workflow/submit-confirmation! datasource (get-in request [:path-params :id]) (:body-params request))))

(defn confirmation-audit
  "审核风险确认结论。"
  [datasource request]
  (response (workflow/audit-confirmation! datasource (get-in request [:path-params :id]) (:body-params request))))

(defn disposal-plan
  "创建风险处置计划。"
  [datasource request]
  (response (workflow/create-plan! datasource (get-in request [:path-params :id]) (:body-params request))))
