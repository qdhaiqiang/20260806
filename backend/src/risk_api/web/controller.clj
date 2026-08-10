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
  (cond (map? value)
        (into {}
              (map (fn [[k v]]
                     (let [encoded-key (if (keyword? k) (camel-key k) k)
                           identifier? (and (string? encoded-key)
                                            (or (= encoded-key "id") (str/ends-with? encoded-key "Id")))]
                       [encoded-key (if (and identifier? (integer? v)) (str v) (camelize v))]))
                   value))
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

(defn- body-value
  "读取 JSON 请求字段，兼容字符串键和关键字键。"
  [body key]
  (or (get body key) (get body (keyword key))))

(defn- integer-value
  "将表单值规范为整数；缺失时使用给定默认值。"
  [value default]
  (cond (number? value) (long value)
        (string? value) (parse-int value default)
        :else default))

(defn- company-command
  "把企业表单请求转换成仓储使用的蛇形参数。"
  [body]
  {:enterprise_name (body-value body "enterpriseName") :parent_enterprise (body-value body "parentEnterprise")
   :credit_code (body-value body "creditCode") :enterprise_group (body-value body "enterpriseGroup")
   :belonging_plate_id (body-value body "belongingPlateId") :shareholding_ratio (body-value body "shareholdingRatio")
   :investment_amount (body-value body "investmentAmount") :image (body-value body "image") :remark (body-value body "remark")})

(defn- indicator-command
  "把指标表单请求转换成仓储使用的蛇形参数。"
  [body]
  {:indicator_name (body-value body "indicatorName") :indicator_source (integer-value (body-value body "indicatorSource") 1)
   :risk_level (body-value body "riskLevel") :indicator_category1 (body-value body "indicatorCategory1")
   :indicator_category2 (body-value body "indicatorCategory2") :indicator_status (integer-value (body-value body "indicatorStatus") 1)
   :associated_department (body-value body "associatedDepartment") :score (integer-value (body-value body "score") 0)
   :qcc_code (body-value body "qccCode") :qcc_name (body-value body "qccName") :remark (body-value body "remark")
   :confirm_by_client (integer-value (body-value body "confirmByClient") 0)
   :important_matter (integer-value (body-value body "importantMatter") 0) :manage_dept_id (body-value body "manageDeptId")})

(defn- page-params
  "从请求查询参数计算分页限制、偏移量和过滤字段。"
  [request]
  (let [query (:query-params request) page (max 1 (parse-int (get query "pageNum") 1)) size (min 100 (max 1 (parse-int (get query "pageSize") 10)))]
    {:page page :limit size :offset (* (dec page) size)
     :enterprise_name (optional (get query "enterpriseName")) :risk_level (optional (get query "riskLevel"))
     :enterprise_group (optional (get query "enterpriseGroup")) :risk_type (optional (get query "riskType"))
     :operation_status (optional (get query "operationStatus"))
     :manage_dept_id (optional (get query "manageDeptId")) :belonging_plate_id (optional (get query "belongingPlateId")) :indicator_source (optional (get query "indicatorSource"))
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

(defn department-list
  "返回风险信息筛选器使用的既有主管部门字典。"
  [datasource _]
  (response {:code 0 :msg "success" :data (db/list-departments datasource {})}))

(defn enterprise-get
  "分发企业 GET 请求，兼容 page 分页路径。"
  [datasource request]
  (case (get-in request [:path-params :id])
    "page" (enterprise-page datasource request)
    "tree" (response {:code 0 :msg "success" :data (db/list-enterprise-options datasource {})})
    (response 404 {:code 404 :msg "接口不存在"})))

(defn enterprise-options
  "返回新增和编辑企业时使用的企业选项。"
  [datasource _]
  (response {:code 0 :msg "success" :data (db/list-enterprise-options datasource {})}))

(defn equity-enterprises
  "兼容原股权结构页 /api/enterprise/alls，返回企业树所需完整原始层级字段。"
  [datasource request]
  (response {:code 0 :msg "success"
             :data (db/list-equity-enterprises datasource
                                                {:parent_credit_code (optional (get-in request [:query-params "parentCreditCode"]))})}))

(defn enterprise-post
  "分发企业 POST 请求，兼容 getAllEnterPrice 选项接口。"
  [datasource request]
  (if (= "getAllEnterPrice" (get-in request [:path-params :id]))
    (enterprise-options datasource request)
    (response 404 {:code 404 :msg "接口不存在"})))

(defn index-page
  "按旧接口参数查询指标分页列表。"
  [datasource request]
  (let [params (page-params request) total (:total (db/count-indicators datasource params)) list (db/list-indicators datasource params)]
    (response {:code 0 :msg "success" :data {:total total :list list}})))

(declare indicator-risk)

(defn index-get
  "分发指标 GET 请求，兼容 page 和风险等级读取路径。"
  [datasource request]
  (let [id (get-in request [:path-params :id])]
    (case id
      "page" (index-page datasource request)
      "risk" (indicator-risk datasource request)
      (response 404 {:code 404 :msg "接口不存在"}))))

(defn index-post
  "分发指标 POST 请求，兼容新增与风险等级设置。"
  [datasource request]
  (if (= "risk" (get-in request [:path-params :id]))
    (indicator-risk datasource request)
    (response 404 {:code 404 :msg "接口不存在"})))

(defn create-enterprise
  "创建企业并返回旧接口兼容成功响应。"
  [datasource request]
  (let [command (company-command (:body-params request))]
    (if (str/blank? (:enterprise_name command))
      (response 400 {:code 400 :msg "企业名称不能为空"})
      (do (db/create-enterprise! datasource command) (response {:code 0 :msg "success" :data nil})))))

(defn update-enterprise
  "更新指定企业的可编辑基础字段。"
  [datasource request]
  (let [id (or (get-in request [:path-params :id]) (body-value (:body-params request) "id")) command (assoc (company-command (:body-params request)) :id id)]
    (if (db/find-enterprise-by-id datasource {:id id})
      (do (db/update-enterprise! datasource command) (response {:code 0 :msg "success" :data nil}))
      (response 404 {:code 404 :msg "企业不存在"}))))

(defn delete-enterprise
  "软删除指定企业，保留历史记录。"
  [datasource request]
  (let [id (get-in request [:path-params :id])]
    (if (db/find-enterprise-by-id datasource {:id id})
      (do (db/delete-enterprise! datasource {:id id}) (response {:code 0 :msg "success" :data nil}))
      (response 404 {:code 404 :msg "企业不存在"}))))

(defn create-indicator
  "创建风险指标。"
  [datasource request]
  (let [command (indicator-command (:body-params request))]
    (if (str/blank? (:indicator_name command))
      (response 400 {:code 400 :msg "指标名称不能为空"})
      (do (db/create-indicator! datasource command) (response {:code 0 :msg "success" :data nil})))))

(defn update-indicator
  "更新指定风险指标。"
  [datasource request]
  (let [id (or (get-in request [:path-params :id]) (body-value (:body-params request) "id")) command (assoc (indicator-command (:body-params request)) :id id)]
    (if (db/find-indicator-by-id datasource {:id id})
      (do (db/update-indicator! datasource command) (response {:code 0 :msg "success" :data nil}))
      (response 404 {:code 404 :msg "指标不存在"}))))

(defn delete-indicator
  "删除指定风险指标及其风险等级配置。"
  [datasource request]
  (let [id (get-in request [:path-params :id])]
    (if (db/find-indicator-by-id datasource {:id id})
      (do (db/delete-indicator-risk-setting! datasource {:index_id id}) (db/delete-indicator! datasource {:id id}) (response {:code 0 :msg "success" :data nil}))
      (response 404 {:code 404 :msg "指标不存在"}))))

(defn indicator-risk
  "读取或保存指标风险等级设置。"
  [datasource request]
  (let [body (:body-params request) id (or (get-in request [:path-params :id]) (get-in request [:query-params "indexId"]) (body-value body "indexId") (body-value body "id"))]
    (if (= :get (:request-method request))
      (response {:code 0 :msg "success" :data (db/list-indicator-risk-settings datasource {:index_id id})})
      (let [risk-level-list (body-value body "riskLevelList")
            important-list (body-value body "importantMatterList")
            important-types (set (mapcat #(or (body-value % "enterpriseTypeList") []) (filter #(= "1" (str (body-value % "importantMatter"))) (or important-list []))))
            assignments (if (seq risk-level-list)
                          (mapcat (fn [item] (map (fn [enterprise-type] {:risk_level (integer-value (body-value item "riskLevel") 0) :enterprise_type enterprise-type}) (or (body-value item "enterpriseTypeList") []))) risk-level-list)
                          [{:risk_level (integer-value (body-value body "riskLevel") 0) :enterprise_type (body-value body "enterpriseType")}])]
        (db/delete-indicator-risk-setting! datasource {:index_id id})
        (doseq [{:keys [risk_level enterprise_type]} assignments]
          (db/save-indicator-risk-setting! datasource {:index_id id :risk_level risk_level :enterprise_type enterprise_type :important_matter (if (contains? important-types enterprise_type) 1 (integer-value (body-value body "importantMatter") 0))}))
        (response {:code 0 :msg "success" :data nil})))))

(defn risk-review
  "兼容旧版风险审核提交接口。"
  [datasource request]
  (response (workflow/risk-review! datasource (:body-params request))))

(defn risk-operation-logs
  "返回风险详情和审核弹窗使用的操作记录。"
  [datasource request]
  (response {:code 0 :msg "success"
             :data (db/list-operation-logs datasource {:risk_id (get-in request [:query-params "riskId"])})}))

(defn disposal-step-page
  "兼容参考系统的处置计划步骤分页读取接口。"
  [datasource request]
  (let [risk-id (get-in request [:query-params "riskId"])
        rows (db/list-disposal-steps-by-risk datasource {:risk_id risk-id})]
    (response {:code 0 :msg "success" :data {:total (count rows) :list rows}})))

(defn risk-handle
  "兼容风险确认、风险消除的 riskHandle 接口。"
  [datasource request]
  (let [body (:body-params request)
        risk-id (body-value body "riskId")
        handle-type (integer-value (body-value body "handleType") -1)
        reason (or (body-value body "handleReason") "")
        operator "管理员"]
    (case handle-type
      0 (response (workflow/submit-confirmation! datasource risk-id {:isRisk true :remark reason :operator operator}))
      2 (response (workflow/submit-confirmation! datasource risk-id {:isRisk false :remark reason :operator operator}))
      1 (response {:code 400 :msg "风险消除必须通过消除申请与法务审核接口完成"})
      (response {:code 400 :msg "不支持的风险操作"}))))

(defn risk-situation
  "兼容参考系统的情况描述提交接口。"
  [datasource request]
  (let [body (:body-params request)
        risk-id (body-value body "riskId")]
    (response
     (workflow/submit-description!
      datasource risk-id
      {:occurrence_reason (or (body-value body "handleReason") "")
       :decision_body (or (body-value body "policyMaking") "")
       :reported_to_group (integer-value (body-value body "reportOrNot") 0)
       :report_content (or (body-value body "reportContent") "")
       :attachments (or (body-value body "url") "")
       :submitter "管理员"}))))

(defn export-risks
  "导出风险基础字段为 UTF-8 CSV 下载，供浏览器表格软件打开。"
  [datasource _]
  (let [rows (db/list-risks datasource {:enterprise_name nil :risk_level nil :enterprise_group nil :risk_type nil :operation_status nil :belonging_plate_id nil :indicator_source nil :start_date nil :end_date nil :limit 100000 :offset 0})
        line (fn [row] (str/join "," (map #(str "\"" (str/replace (str (or % "")) "\"" "\"\"") "\"") [(:id row) (:enterprise_name row) (:risk_indicator row) (:risk_content row) (:risk_level row) (:risk_type row) (:occur_time row)])))]
    {:status 200 :headers {"Content-Type" "text/csv; charset=utf-8" "Content-Disposition" "attachment; filename=risks.csv"}
     :body (str "\uFEFFid,enterpriseName,riskIndicator,riskContent,riskLevel,riskType,occurTime\n" (str/join "\n" (map line rows)))}))

(defn description
  "提交风险情况描述。"
  [datasource request]
  (let [body (:body-params request)]
    (response (workflow/submit-description! datasource (get-in request [:path-params :id])
                                            {:occurrence_reason (body-value body "occurrenceReason")
                                             :decision_body (body-value body "decisionBody")
                                             :reported_to_group (integer-value (body-value body "reportedToGroup") 0)
                                             :report_content (body-value body "reportContent")
                                             :attachments (body-value body "attachments")
                                             :submitter (body-value body "operator")}))))

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

(defn process-persisted-dynamics [datasource request]
  (response (workflow/process-persisted-dynamics! datasource (:body-params request))))
(defn timeout-descriptions [datasource request]
  (response (workflow/timeout-descriptions! datasource (:body-params request))))
(defn disposal-progress [datasource request]
  (response (workflow/submit-progress! datasource (get-in request [:path-params :id]) (:body-params request))))
(defn disposal-complete [datasource request]
  (response (workflow/submit-plan-completion! datasource (get-in request [:path-params :id]) (:body-params request))))
(defn refresh-overdue-plans [datasource request]
  (response (workflow/refresh-overdue-plans! datasource (:body-params request))))
(defn disposal-audit [datasource request]
  (response (workflow/audit-disposal! datasource (get-in request [:path-params :id]) (:body-params request))))
(defn elimination [datasource request]
  (response (workflow/request-elimination! datasource (get-in request [:path-params :id]) (:body-params request))))
(defn elimination-audit [datasource request]
  (response (workflow/audit-elimination! datasource (get-in request [:path-params :id]) (:body-params request))))
(defn level-change [datasource request]
  (response (workflow/request-level-change! datasource (get-in request [:path-params :id]) (:body-params request))))
(defn level-change-audit [datasource request]
  (response (workflow/audit-level-change! datasource (get-in request [:path-params :id]) (:body-params request))))
(defn pending-reviews [datasource _]
  (response {:code 0 :msg "success" :data (db/list-pending-reviews datasource {})}))
(defn reviewed-reviews [datasource _]
  (response {:code 0 :msg "success" :data (db/list-reviewed-reviews datasource {})}))
