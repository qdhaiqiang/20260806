(ns risk-api.infra.database
  "SQLite 数据库组件，负责数据源、迁移和历史表查询。"
  (:require [clojure.java.io :as io]
            [clojure.string :as str]
            [hugsql.core :as hugsql]
            [integrant.core :as ig]
            [next.jdbc :as jdbc]
            [next.jdbc.result-set :as rs]))

(hugsql/def-db-fns "sql/legacy.sql")
(hugsql/def-db-fns "sql/workflow.sql")

(defn- execute-script!
  "执行资源中的 SQLite 迁移脚本。参数为数据源和资源路径，返回 nil。"
  [datasource resource-path]
  (let [sql (slurp (io/resource resource-path))]
    (doseq [statement (remove str/blank? (str/split sql #";"))]
      (jdbc/execute! datasource [statement]))))

(defn- migrate!
  "初始化风险闭环扩展表。参数为数据源，返回数据源本身。"
  [datasource]
  (execute-script! datasource "migrations/202608070001-risk-workflow.up.sql")
  datasource)

(defmethod ig/init-key :risk-api/database
  [_ {:keys [jdbc-url] :as options}]
  (let [datasource (jdbc/get-datasource {:jdbcUrl jdbc-url})]
    (migrate! datasource)
    (assoc options :datasource datasource)))

(defmethod ig/halt-key! :risk-api/database
  [_ _database]
  nil)

(defn query-opts
  "提供统一的小写非限定列名映射选项。"
  []
  {:builder-fn rs/as-unqualified-lower-maps})
