(ns risk-api.workflow-test
  (:require [clojure.java.io :as io]
            [clojure.test :refer [deftest is]]
            [next.jdbc :as jdbc]
            [risk-api.domain.workflow :as workflow]
            [risk-api.infra.database :as db]))

(defn copied-datasource []
  (let [target (java.io.File/createTempFile "risk-workflow-" ".sqlite")]
    (.deleteOnExit target)
    (with-open [in (io/input-stream "../test1.sqlite") out (io/output-stream target)] (io/copy in out))
    (jdbc/get-datasource {:jdbcUrl (str "jdbc:sqlite:" (.getAbsolutePath target))})))

(defn create-mapped-risk! [ds id]
  (jdbc/execute! ds ["INSERT INTO supervise_risk (id,metrics_name,risk_indicator,risk_content,risk_level,enterprise_name,enterprise_group,belonging_plate_id,dept_id,operation_status,delete_or_not,create_time,update_time,indicator_source,unique_hashkey,new_risk_level) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
                     id "测试指标" "测试指标" "测试风险" "2" "测试二级企业" "supv_enterprise_type_holding" "testPlate" "testDept" 0 0 "2026-08-10" "2026-08-10" 1 (str "test-" id) "2"]
                 (db/query-opts)))

(deftest complete-workflow-test
  (let [ds (copied-datasource) risk-id 990001]
    (create-mapped-risk! ds risk-id)
    (is (= 7 (get-in (workflow/initialize-description! ds risk-id nil) [:data :operationStatus])))
    (is (= 0 (get-in (workflow/submit-description! ds risk-id {:occurrence_reason "原因" :decision_body "机构" :reported_to_group 0 :report_content "" :attachments "" :submitter "管理员"}) [:data :operationStatus])))
    (is (= 4 (get-in (workflow/submit-confirmation! ds risk-id {:isRisk true :remark "确认" :operator "管理员"}) [:data :operationStatus])))
    (is (= 1 (get-in (workflow/audit-confirmation! ds risk-id {:auditStatus 0 :handleReason "通过" :operator "管理员"}) [:data :operationStatus])))
    (is (= 0 (:code (workflow/create-plan! ds risk-id {:target "整改" :deadline "2026-12-31" :operator "管理员" :steps [{:content "步骤一" :responsibleDepartment "部门" :responsiblePerson "人员"}]}))))
    (let [step (:id (first (db/current-plan-steps ds {:risk_id risk-id})))]
      (workflow/submit-progress! ds step {:content "完成" :completed true :operator "管理员"})
      (is (= "COMPLETION_PENDING" (get-in (workflow/submit-plan-completion! ds risk-id {:operator "管理员"}) [:data :disposalStatus])))
      (is (= 6 (get-in (workflow/audit-disposal! ds risk-id {:approved true :opinion "通过" :operator "管理员"}) [:data :operationStatus])))
      (is (= 2 (get-in (workflow/audit-elimination! ds risk-id {:approved true :opinion "通过" :operator "管理员"}) [:data :operationStatus]))))
    (is (pos? (count (db/list-operation-logs ds {:risk_id risk-id}))))
    (is (pos? (count (jdbc/execute! ds ["SELECT * FROM supervise_message_record WHERE business_id=?" (str risk-id)] (db/query-opts)))))))

(deftest description-timeout-test
  (let [ds (copied-datasource) risk-id 990002]
    (create-mapped-risk! ds risk-id)
    (workflow/initialize-description! ds risk-id "2000-01-01 00:00:00")
    (is (= 1 (get-in (workflow/timeout-descriptions! ds {}) [:data :processed])))
    (is (= 0 (:operation_status (db/find-risk-by-id ds {:id risk-id}))))))
