(ns risk-api.web.routes
  "Reitit 路由表，挂载旧版兼容 API 与风险闭环 API。"
  (:require [jsonista.core :as json]
            [reitit.ring :as ring]
            [risk-api.web.controller :as controller]))

(defn- wrap-json-body
  "解析 application/json 请求体，并在异常时返回安全错误。"
  [handler]
  (fn [request]
    (try (handler (if (and (= "application/json" (some-> (get-in request [:headers "content-type"]) (clojure.string/split #";") first))
                           (:body request))
                    (assoc request :body-params (json/read-value (:body request)))
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
         ["/api/supervise/risk/page" {:get {:handler (partial controller/risk-page datasource)}}]
         ["/api/supervise/enterprise/page" {:get {:handler (partial controller/enterprise-page datasource)}}]
         ["/api/supervise/index/page" {:get {:handler (partial controller/index-page datasource)}}]
         ["/api/supervise/risk/export" {:get {:handler (partial controller/export-risks datasource)}}]
         ["/api/supervise/risk/riskReview" {:post {:handler (partial controller/risk-review datasource)}}]
         ["/api/supervise/risk/:id/description" {:post {:handler (partial controller/description datasource)}}]
         ["/api/supervise/risk/:id/confirm" {:post {:handler (partial controller/confirmation datasource)}}]
         ["/api/supervise/risk/:id/confirmation-audit" {:post {:handler (partial controller/confirmation-audit datasource)}}]
         ["/api/supervise/risk/:id/disposal-plans" {:post {:handler (partial controller/disposal-plan datasource)}}]])
       (ring/create-default-handler {:not-found (constantly (controller/response 404 {:code 404 :msg "接口不存在"}))}))
      wrap-json-body wrap-cors))
