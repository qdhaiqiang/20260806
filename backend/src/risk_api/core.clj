(ns risk-api.core
  "风险监管本地 API 服务启动入口。"
  (:gen-class)
  (:require [integrant.core :as ig]
            [ring.adapter.jetty :as jetty]
            [risk-api.infra.database]
            [risk-api.web.routes :as routes]))

(defmethod ig/init-key :risk-api/http-server
  [_ {:keys [port database]}]
  (jetty/run-jetty (routes/app (:datasource database)) {:port port :join? false}))

(defmethod ig/halt-key! :risk-api/http-server
  [_ server]
  (.stop server))

(defn system-config
  "构造本地默认 Integrant 配置；可用 RISK_API_DB 与 PORT 覆盖。"
  []
  {:risk-api/database {:jdbc-url (str "jdbc:sqlite:" (or (System/getenv "RISK_API_DB") "../test1.sqlite"))}
   :risk-api/http-server {:port (Integer/parseInt (or (System/getenv "PORT") "8101")) :database (ig/ref :risk-api/database)}})

(defn -main
  "启动服务主函数。"
  [& _]
  (ig/init (system-config))
  (println "风险 API 已启动，监听 http://localhost:" (or (System/getenv "PORT") "8101")))
