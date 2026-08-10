(ns risk-api.infra.database
  "SQLite 数据库组件，负责数据源、迁移和历史表查询。"
  (:require [hugsql.core :as hugsql]
            [hugsql.adapter.next-jdbc :as hugsql-next]
            [integrant.core :as ig]
            [next.jdbc :as jdbc]
            [next.jdbc.result-set :as rs]))

(hugsql/set-adapter! (hugsql-next/hugsql-adapter-next-jdbc))

(hugsql/def-db-fns "sql/legacy.sql")
(hugsql/def-db-fns "sql/workflow.sql")

(defmethod ig/init-key :risk-api/database
  [_ {:keys [jdbc-url] :as options}]
  (let [datasource (jdbc/get-datasource {:jdbcUrl jdbc-url})]
    (assoc options :datasource datasource)))

(defmethod ig/halt-key! :risk-api/database
  [_ _database]
  nil)

(defn query-opts
  "提供统一的小写非限定列名映射选项。"
  []
  {:builder-fn rs/as-unqualified-lower-maps})

(defn transaction!
  "在一个 SQLite 事务中执行领域状态变更。"
  [datasource f]
  (jdbc/with-transaction [tx datasource] (f tx)))
