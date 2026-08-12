(ns risk-api.web.routes
  "Reitit 路由表，挂载旧版兼容 API 与风险闭环 API。"
  (:require [jsonista.core :as json]
            [reitit.ring :as ring]
            [ring.middleware.params :refer [wrap-params]]
            [risk-api.web.controller :as controller]))

(defn- wrap-json-body
  "解析 application/json 请求体，并在异常时返回安全错误。"
  [handler]
  (fn [request]
    (try (handler (if (and (= "application/json" (some-> (get-in request [:headers "content-type"]) (clojure.string/split #";") first))
                           (:body request))
                    (assoc request :body-params (json/read-value (:body request) json/keyword-keys-object-mapper))
                    request))
         (catch Exception _ (controller/response 400 {:code 400 :msg "请求数据格式错误"})))))

(defn- wrap-cors
  "为本地 Vite 前端添加最小 CORS 响应头。"
  [handler]
  (fn [request]
    (let [response (if (= :options (:request-method request)) {:status 204 :body ""} (handler request))]
      (update response :headers merge {"Access-Control-Allow-Origin" "http://localhost:5173" "Access-Control-Allow-Headers" "Content-Type, Authorization, token" "Access-Control-Allow-Methods" "GET, POST, OPTIONS"}))))

(defn app
  "构建携带数据源依赖的 Ring 应用。"
  [datasource]
  (-> (ring/ring-handler
       (ring/router
         [["/api/login" {:post {:handler controller/login}}]
         ["/api/sys/dept/list" {:get {:handler (partial controller/department-list datasource)}}]
         ["/api/enterprise/alls" {:get {:handler (partial controller/equity-enterprises datasource)}}]
         ["/api/supervise/risk/page" {:get {:handler (partial controller/risk-page datasource)}}]
         ["/api/supervise/risk/pending-reviews" {:get {:handler (partial controller/pending-reviews datasource)}}]
         ["/api/supervise/risk/reviewed-reviews" {:get {:handler (partial controller/reviewed-reviews datasource)}}]
         ["/api/supervise/risk/riskHandle" {:post {:handler (partial controller/risk-handle datasource)}}]
         ["/api/supervise/risk/riskSituation" {:post {:handler (partial controller/risk-situation datasource)}}]
         ["/api/supervise/risk/superviseRiskOperationLog/getLogByRiskId" {:get {:handler (partial controller/risk-operation-logs datasource)}}]
         ["/api/demo/superviseriskdisposalplanstep/page" {:get {:handler (partial controller/disposal-step-page datasource)}}]
         ["/api/supervise/enterprise" {:post {:handler (partial controller/create-enterprise datasource)} :put {:handler (partial controller/update-enterprise datasource)}}]
         ["/api/supervise/enterprise/:id" {:get {:handler (partial controller/enterprise-get datasource)} :post {:handler (partial controller/enterprise-post datasource)} :delete {:handler (partial controller/delete-enterprise datasource)}}]
         ["/api/supervise/index" {:post {:handler (partial controller/create-indicator datasource)} :put {:handler (partial controller/update-indicator datasource)}}]
         ["/api/supervise/index/:id" {:get {:handler (partial controller/index-get datasource)} :post {:handler (partial controller/index-post datasource)} :delete {:handler (partial controller/delete-indicator datasource)}}]
         ["/api/supervise/risk/export" {:get {:handler (partial controller/export-risks datasource)}}]
         ["/api/supervise/risk/manual" {:post {:handler (partial controller/manual-risk datasource)}}]
         ["/api/supervise/risk/riskReview" {:post {:handler (partial controller/risk-review datasource)}}]
         ["/api/supervise/risk/:id/description" {:post {:handler (partial controller/description datasource)}}]
         ["/api/supervise/risk/:id/confirm" {:post {:handler (partial controller/confirmation datasource)}}]
         ["/api/supervise/risk/:id/confirmation-audit" {:post {:handler (partial controller/confirmation-audit datasource)}}]
         ["/api/supervise/risk/dynamics/process" {:post {:handler (partial controller/process-persisted-dynamics datasource)}}]
         ["/api/supervise/risk/jobs/description-timeout" {:post {:handler (partial controller/timeout-descriptions datasource)}}]
         ["/api/supervise/disposal-steps/:id/progress" {:get {:handler (partial controller/disposal-progress-page datasource)} :post {:handler (partial controller/disposal-progress datasource)}}]
         ["/api/supervise/risk/:id/disposal-complete" {:post {:handler (partial controller/disposal-complete datasource)}}]
         ["/api/supervise/risk/jobs/disposal-overdue" {:post {:handler (partial controller/refresh-overdue-plans datasource)}}]
         ["/api/supervise/risk/:id/disposal-audit" {:post {:handler (partial controller/disposal-audit datasource)}}]
         ["/api/supervise/risk/:id/elimination" {:post {:handler (partial controller/elimination datasource)}}]
         ["/api/supervise/risk/:id/elimination-audit" {:post {:handler (partial controller/elimination-audit datasource)}}]
         ["/api/supervise/risk/:id/level-changes" {:post {:handler (partial controller/level-change datasource)}}]
         ["/api/supervise/risk/:id/level-change-audit" {:post {:handler (partial controller/level-change-audit datasource)}}]
         ["/api/supervise/risk/:id/disposal-plans" {:post {:handler (partial controller/disposal-plan datasource)}}]]
        {:data {:middleware [wrap-params]}})
       (ring/create-default-handler {:not-found (constantly (controller/response 404 {:code 404 :msg "接口不存在"}))}))
      wrap-json-body wrap-cors))
