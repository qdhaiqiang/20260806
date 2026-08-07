(ns risk-api.domain.workflow
  "风险闭环领域服务，封装状态机、审核和处置规则。"
  (:require [risk-api.infra.database :as db]))

(defn- error
  "构造兼容接口的失败响应。参数为消息，返回 code 非零的响应体。"
  [message]
  {:code 500 :msg message})

(defn- success
  "构造兼容接口的成功响应。参数为数据，返回 code 为零的响应体。"
  [data]
  {:code 0 :msg "success" :data data})

(defn- valid-state?
  "判断风险当前状态是否允许操作。参数为风险行和允许状态集合，返回布尔值。"
  [risk states]
  (contains? states (:operation_status risk)))

(defn- append-log!
  "写入不可变风险操作日志。参数为数据源、风险 ID、类别、说明和操作者。"
  [datasource risk-id category remark operator]
  (db/create-operation-log! datasource {:risk_id risk-id :category category :remark remark :operator_name operator}))

(defn submit-description!
  "保存并提交情况描述；仅允许待描述或未确认风险，提交后转未确认。"
  [datasource risk-id body]
  (let [risk (db/find-risk-by-id datasource {:id risk-id})]
    (if-not (and risk (valid-state? risk #{0 7}))
      (error "当前风险不允许提交情况描述")
      (do (db/create-description! datasource (assoc body :risk_id risk-id))
          (db/update-risk-status! datasource {:id risk-id :operation_status 0})
          (append-log! datasource risk-id "DESCRIPTION_SUBMITTED" "已提交情况描述" (:submitter body))
          (success {:riskId (str risk-id) :operationStatus 0})))))

(defn submit-confirmation!
  "提交主责部门风险结论；是风险转确认待审核，否则转关闭待审核。"
  [datasource risk-id body]
  (let [risk (db/find-risk-by-id datasource {:id risk-id})
        is-risk (boolean (:isRisk body))]
    (if-not (and risk (valid-state? risk #{0}))
      (error "当前风险不允许确认")
      (let [status (if is-risk 4 5)]
        (db/create-confirmation! datasource {:risk_id risk-id :is_risk (if is-risk 1 0) :remark (:remark body) :submitted_by (:operator body)})
        (db/update-risk-status! datasource {:id risk-id :operation_status status})
        (append-log! datasource risk-id "CONFIRMATION_SUBMITTED" (:remark body) (:operator body))
        (success {:riskId (str risk-id) :operationStatus status})))))

(defn audit-confirmation!
  "审核风险确认结论，按确认矩阵更新为已确认或已关闭。"
  [datasource risk-id body]
  (let [risk (db/find-risk-by-id datasource {:id risk-id})
        confirmation (db/latest-confirmation datasource {:risk_id risk-id})
        approved? (zero? (long (or (:auditStatus body) 1)))]
    (if-not (and risk confirmation (valid-state? risk #{4 5}))
      (error "当前风险不存在待审核确认")
      (let [is-risk? (= 1 (:is_risk confirmation))
            status (if (= is-risk? approved?) 1 3)]
        (db/audit-confirmation! datasource {:id (:id confirmation) :audit_status (if approved? 0 1) :audit_opinion (:handleReason body) :audited_by (:operator body)})
        (db/update-risk-status! datasource {:id risk-id :operation_status status})
        (append-log! datasource risk-id "CONFIRMATION_AUDITED" (:handleReason body) (:operator body))
        (success {:riskId (str risk-id) :operationStatus status})))))

(defn risk-review!
  "兼容旧版 riskReview 请求，委托确认审核状态机。"
  [datasource body]
  (audit-confirmation! datasource (:riskId body) body))

(defn create-plan!
  "为已确认风险创建处置计划和步骤，返回计划 ID。"
  [datasource risk-id body]
  (let [risk (db/find-risk-by-id datasource {:id risk-id})]
    (if-not (and risk (valid-state? risk #{1}))
      (error "仅已确认风险可制定处置计划")
      (let [result (db/create-disposal-plan! datasource {:risk_id risk-id :target (:target body) :deadline (:deadline body) :submitted_by (:operator body)})
            plan-id (:last_insert_rowid result)]
        (doseq [[ordinal step] (map-indexed vector (:steps body))]
          (db/create-disposal-step! datasource {:plan_id plan-id :content (:content step) :responsible_department (:responsibleDepartment step) :responsible_person (:responsiblePerson step) :planned_at (:plannedAt step) :ordinal ordinal}))
        (append-log! datasource risk-id "DISPOSAL_PLAN_CREATED" "已创建处置计划" (:operator body))
        (success {:planId (str plan-id) :disposalStatus "NOT_STARTED"})))))

(defn complete-plan!
  "提交处置完成审核，将计划转完成待审核。"
  [datasource plan-id body]
  (let [plan (db/find-disposal-plan datasource {:risk_id (:riskId body)})]
    (if-not (and plan (= plan-id (:id plan)))
      (error "处置计划不存在")
      (do (db/update-plan-status! datasource {:id plan-id :disposal_status "COMPLETION_PENDING" :audit_opinion nil})
          (success {:planId (str plan-id) :disposalStatus "COMPLETION_PENDING"})))))
