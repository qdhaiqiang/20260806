(ns risk-api.domain.workflow
  "风险闭环领域服务。所有写操作仅使用导入库中已有的业务表。"
  (:require [clojure.string :as str]
            [risk-api.infra.database :as db]))

(def description-pending 7)
(def unconfirmed 0)
(def confirmed 1)
(def eliminated 2)
(def closed 3)
(def confirm-pending 4)
(def close-pending 5)
(def elimination-pending 6)

(defn- error [message] {:code 500 :msg message})
(defn- success [data] {:code 0 :msg "success" :data data})
(defn- operator [body] (or (:operator body) "管理员"))
(defn- entity-id [] (long (+ 1000000000000000 (rand-int 899999999))))
(defn- bool? [value] (or (true? value) (false? value)))
(defn- special-enterprise? [risk]
  (or (= "supv_enterprise_type_manage" (:enterprise_group risk))
      (= "groupHeadquarters" (:belonging_plate_id risk))))

(declare request-elimination!)

(defn- log! [ds risk-id category remark who & [{:keys [decision-content new-risk-level]}]]
  (db/create-operation-log! ds {:risk_id risk-id :category category :remark (or remark "")
                                 :operator_name who :decision_content decision-content :new_risk_level new-risk-level}))
(defn- todo! [ds kind risk-id recipient]
  ;; 当前阶段以既有消息表记录待办日志，投递通道留待后续接入。
  (db/create-message! ds {:business_type kind :business_id (str risk-id) :channel "TODO_LOG" :recipient (or recipient "管理员")}))
(defn- transition! [ds risk-id allowed next category remark who]
  (if (pos? (db/transition-risk-status! ds {:id risk-id :allowed_statuses allowed :next_status next}))
    (do (log! ds risk-id category remark who {:decision-content (str "状态 " allowed " -> " next)}) true)
    false))

(defn initialize-description! [datasource risk-id due-at]
  "将已按指标映射生成的二级企业风险置为情况描述待办。"
  (db/transaction! datasource
                   (fn [tx]
                     (if-not (transition! tx risk-id [unconfirmed] description-pending "DESCRIPTION_CREATED" "已创建情况描述待办" "系统")
                       (error "当前风险不允许进入情况描述")
                       (do (db/create-description-draft! tx {:risk_id risk-id :occurrence_reason nil :decision_body nil :reported_to_group 0
                                                            :report_content nil :attachments nil :submitter nil
                                                            :due_at (or due-at (str (.plusDays (java.time.LocalDateTime/now) 3)))})
                           (todo! tx "DESCRIPTION" risk-id "管理主体")
                           (success {:riskId (str risk-id) :operationStatus description-pending}))))))

(defn submit-description! [datasource risk-id body]
  (if (str/blank? (str (:occurrence_reason body)))
    (error "请填写发生原因")
    (db/transaction! datasource
                     (fn [tx]
                       (if-not (transition! tx risk-id [description-pending] unconfirmed "DESCRIPTION_SUBMITTED" "已提交情况描述" (operator body))
                         (error "当前风险不允许提交情况描述")
                         (do (db/submit-description! tx (assoc body :risk_id risk-id))
                             (todo! tx "CONFIRMATION" risk-id "主责部门")
                             (success {:riskId (str risk-id) :operationStatus unconfirmed})))))))

(defn timeout-descriptions! [datasource _]
  (let [risks (db/due-descriptions datasource {})]
    (doseq [risk risks]
      (db/transaction! datasource
                       (fn [tx]
                         (when (transition! tx (:id risk) [description-pending] unconfirmed "DESCRIPTION_TIMEOUT" "情况描述到期自动提交" "系统")
                           (db/auto-submit-description! tx {:risk_id (:id risk)})
                           (todo! tx "CONFIRMATION" (:id risk) (:dept_id risk))))))
    (success {:processed (count risks)})))

(defn submit-confirmation! [datasource risk-id body]
  (if-not (bool? (:isRisk body))
    (error "请选择是否为风险")
    (let [status (if (:isRisk body) confirm-pending close-pending)]
      (db/transaction! datasource
                       (fn [tx]
                         (if-not (transition! tx risk-id [unconfirmed] status "CONFIRMATION_SUBMITTED" (:remark body) (operator body))
                           (error "当前风险不允许确认")
                           (do (db/create-confirmation! tx {:risk_id risk-id :is_risk (if (:isRisk body) 1 0)
                                                            :remark (:remark body) :submitted_by (operator body)})
                               (todo! tx "CONFIRMATION_AUDIT" risk-id "法务风控部")
                               (success {:riskId (str risk-id) :operationStatus status}))))))))

(defn audit-confirmation! [datasource risk-id body]
  (let [approved? (zero? (long (or (:auditStatus body) 1)))]
    (db/transaction! datasource
                     (fn [tx]
                       (let [risk (db/find-risk-by-id tx {:id risk-id}) confirmation (db/latest-confirmation tx {:risk_id risk-id})]
                         (if-not (and risk confirmation (contains? #{confirm-pending close-pending} (:operation_status risk)) (nil? (:audit_status confirmation)))
                           (error "当前风险不存在待审核确认")
                           (let [is-risk? (= 1 (:is_risk confirmation)) status (if (= is-risk? approved?) confirmed closed)]
                             (if-not (transition! tx risk-id [(:operation_status risk)] status "CONFIRMATION_AUDITED" (:handleReason body) (operator body))
                               (error "风险状态已变化，请刷新后重试")
                               (do (db/audit-confirmation! tx {:id (:id confirmation) :audit_status (if approved? 0 1)
                                                               :audit_opinion (:handleReason body) :audited_by (operator body)})
                                   (todo! tx (if (= status confirmed) "RISK_CONFIRMED" "RISK_CLOSED") risk-id (:dept_id risk))
                                   (success {:riskId (str risk-id) :operationStatus status}))))))))))

(defn risk-review! [datasource body] (audit-confirmation! datasource (:riskId body) body))

(defn create-plan! [datasource risk-id body]
  (let [steps (:steps body)]
    (if-not (and (seq (str (:target body))) (seq (str (:deadline body))) (seq steps))
      (error "请填写计划目标、截止时间和至少一个处置步骤")
      (db/transaction! datasource
                       (fn [tx]
                         (let [risk (db/find-risk-by-id tx {:id risk-id}) plan-no (str "RISK-" risk-id "-" (System/currentTimeMillis))]
                           (if-not (= confirmed (:operation_status risk))
                             (error "仅已确认风险可制定或变更处置计划")
                             (do (doseq [[ordinal step] (map-indexed vector steps)]
                                   (db/create-legacy-plan-step! tx {:id (entity-id) :plan_no plan-no :risk_id risk-id :plan_target (:target body)
                                                                     :step (inc ordinal) :step_content (:content step) :plan_deadline (:deadline body)
                                                                     :planned_at (:plannedAt step) :department (:responsibleDepartment step)
                                                                     :department_id (:responsibleDepartmentId step) :responsible_person_name (:responsiblePerson step)
                                                                     :url (:attachments step) :url_name (:attachmentName step)}))
                                 (db/set-risk-plan-state! tx {:id risk-id :plan_step_state 0})
                                 (log! tx risk-id "DISPOSAL_PLAN_CREATED" "已制定处置计划" (operator body))
                                 (success {:planNo plan-no :disposalStatus "NOT_STARTED"})))))))))

(defn submit-progress! [datasource step-id body]
  (db/transaction! datasource
                   (fn [tx]
                     (let [step (db/find-plan-step tx {:id step-id})
                           risk (when step (db/find-risk-by-id tx {:id (:risk_id step)}))]
                       (if-not (and step risk (= confirmed (:operation_status risk)) (contains? #{0 1 2} (:state step)))
                         (error "当前处置步骤不允许维护进度")
                         (do (db/create-legacy-progress! tx {:id (entity-id) :progress_step (:step step) :progress_step_content (:content body)
                                                             :state (if (:completed body) 1 0) :plan_step_id step-id})
                             (db/update-plan-step-state! tx {:id step-id :state (if (:completed body) 2 1) :actual_finish_date nil})
                             (db/set-risk-plan-state! tx {:id (:risk_id step) :plan_step_state 1})
                             (log! tx (:risk_id step) "DISPOSAL_PROGRESS" (or (:content body) "已维护处置进度") (operator body))
                             (success {:stepId (str step-id) :disposalStatus "IN_PROGRESS"})))))))

(defn submit-plan-completion! [datasource risk-id body]
  (db/transaction! datasource
                   (fn [tx]
                     (let [actual-risk-id (or (:risk_id (db/find-plan-step tx {:id risk-id})) risk-id)
                           risk (db/find-risk-by-id tx {:id actual-risk-id})
                           steps (db/current-plan-steps tx {:risk_id actual-risk-id})]
                       (if-not (and risk (= confirmed (:operation_status risk)) (seq steps) (every? #(= 2 (:state %)) steps))
                         (error "仅当当前计划全部步骤完成后可提交完成审核")
                         (let [auto? (special-enterprise? risk)]
                           (doseq [step steps] (db/update-plan-step-state! tx {:id (:id step) :state (if auto? 4 3) :actual_finish_date (str (java.time.LocalDateTime/now))}))
                           (db/set-risk-plan-state! tx {:id risk-id :plan_step_state (if auto? 4 3)})
                           (log! tx risk-id "DISPOSAL_COMPLETION_SUBMITTED" "已提交处置完成审核" (operator body))
                           (if auto?
                             (request-elimination! tx risk-id (assoc body :operator (operator body)))
                             (do (todo! tx "DISPOSAL_AUDIT" risk-id (:dept_id risk))
                                 (success {:riskId (str risk-id) :disposalStatus "COMPLETION_PENDING"})))))))))

(defn audit-disposal! [datasource risk-id body]
  (db/transaction! datasource
                   (fn [tx]
                     (let [risk (db/find-risk-by-id tx {:id risk-id}) steps (db/current-plan-steps tx {:risk_id risk-id}) approved? (true? (:approved body))]
                       (if-not (and risk (= 3 (:plan_step_state risk)) (seq steps) (every? #(contains? #{2 3} (:state %)) steps))
                         (error "当前风险不存在完成待审核处置计划")
                         (do (doseq [step steps] (db/update-plan-step-state! tx {:id (:id step) :state (if approved? 4 1) :actual_finish_date nil}))
                             (db/set-risk-plan-state! tx {:id risk-id :plan_step_state (if approved? 4 1)})
                             (log! tx risk-id "DISPOSAL_AUDITED" (:opinion body) (operator body))
                             (if approved?
                               (request-elimination! tx risk-id (assoc body :operator (operator body)))
                               (do (todo! tx "DISPOSAL_REJECTED" risk-id (:dept_id risk))
                                   (success {:riskId (str risk-id) :disposalStatus "IN_PROGRESS"})))))))))

(defn request-elimination! [datasource risk-id body]
  (if (transition! datasource risk-id [confirmed] elimination-pending "ELIMINATION_REQUESTED" "已提交风险消除申请" (operator body))
    (do (todo! datasource "ELIMINATION_AUDIT" risk-id "法务风控部")
        (success {:riskId (str risk-id) :operationStatus elimination-pending}))
    (error "仅已确认风险可申请消除")))

(defn audit-elimination! [datasource risk-id body]
  (let [approved? (true? (:approved body)) status (if approved? eliminated confirmed)]
    (db/transaction! datasource
                     (fn [tx]
                       (let [risk (db/find-risk-by-id tx {:id risk-id})]
                         (if-not (and risk (= elimination-pending (:operation_status risk)))
                           (error "当前风险不存在待审核消除申请")
                           (do (transition! tx risk-id [elimination-pending] status "ELIMINATION_AUDITED" (:opinion body) (operator body))
                               (todo! tx (if approved? "RISK_ELIMINATED" "ELIMINATION_REJECTED") risk-id (:dept_id risk))
                               (success {:riskId (str risk-id) :operationStatus status}))))))))

(defn request-level-change! [datasource risk-id body]
  (let [requested (some-> (:requestedLevel body) str)]
    (if-not (and (seq requested) (seq (str (:reason body))))
      (error "请填写申请等级和调整原因")
      (db/transaction! datasource
                       (fn [tx]
                         (let [risk (db/find-risk-by-id tx {:id risk-id})]
                           (if-not (and risk (= confirmed (:operation_status risk)) (not= requested (:risk_level risk)))
                             (error "仅已确认风险可申请不同等级的调整")
                             (let [before (:risk_level risk) up? (> (Long/parseLong requested) (Long/parseLong (str before)))]
                               (db/create-level-change! tx {:risk_id risk-id :before_level before :requested_level requested
                                                            :change_type (if up? "UP" "DOWN") :reason (:reason body) :applicant (operator body)})
                               (log! tx risk-id "LEVEL_CHANGE_REQUESTED" (:reason body) (operator body) {:new-risk-level requested})
                               (todo! tx "LEVEL_CHANGE_AUDIT" risk-id "法务风控部")
                               (success {:riskId (str risk-id)})))))))))

(defn audit-level-change! [datasource risk-id body]
  (db/transaction! datasource
                   (fn [tx]
                     (let [change (db/latest-level-change tx {:risk_id risk-id}) approved? (true? (:approved body))]
                       (if-not (and change (nil? (:audit_status change)))
                         (error "当前风险不存在待审核等级调整")
                         (do (db/audit-level-change! tx {:id (:id change) :audit_status (if approved? 0 1) :audit_opinion (:opinion body) :auditor (operator body)})
                             (when approved? (db/update-risk-level! tx {:id risk-id :risk_level (:requested_level change)}))
                             (log! tx risk-id "LEVEL_CHANGE_AUDITED" (:opinion body) (operator body) {:new-risk-level (when approved? (:requested_level change))})
                             (success {:riskId (str risk-id) :approved approved?})))))))

(defn refresh-overdue-plans! [datasource _]
  (let [ids (map :risk_id (db/overdue-risk-ids datasource {}))]
    (doseq [risk-id ids]
      (db/set-risk-plan-state! datasource {:id risk-id :plan_step_state 2})
      (log! datasource risk-id "DISPOSAL_OVERDUE" "处置计划已逾期" "系统"))
    (success {:processed (count ids)})))

(defn process-persisted-dynamics! [_ _]
  (error "外部动态接入不在当前验证范围；请从已映射风险开始处理"))
