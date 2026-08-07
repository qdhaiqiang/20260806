-- :name create-raw! :! :n
INSERT INTO supervise_risk_raw (source, source_key, payload, received_at, parse_status)
VALUES (:source, :source_key, :payload, datetime('now'), 'RECEIVED');
-- :name find-raw-by-source-key :? :1
SELECT * FROM supervise_risk_raw WHERE source_key = :source_key;
-- :name create-description! :! :n
INSERT INTO supervise_risk_description (risk_id, occurrence_reason, decision_body, reported_to_group, report_content, attachments, submitter, submitted_at, due_at)
VALUES (:risk_id, :occurrence_reason, :decision_body, :reported_to_group, :report_content, :attachments, :submitter, datetime('now'), :due_at)
ON CONFLICT(risk_id) DO UPDATE SET occurrence_reason=excluded.occurrence_reason, decision_body=excluded.decision_body, reported_to_group=excluded.reported_to_group, report_content=excluded.report_content, attachments=excluded.attachments, submitter=excluded.submitter, submitted_at=excluded.submitted_at;
-- :name create-confirmation! :! :n
INSERT INTO supervise_risk_confirmation (risk_id, is_risk, remark, submitted_by, submitted_at)
VALUES (:risk_id, :is_risk, :remark, :submitted_by, datetime('now'));
-- :name latest-confirmation :? :1
SELECT * FROM supervise_risk_confirmation WHERE risk_id=:risk_id ORDER BY id DESC LIMIT 1;
-- :name audit-confirmation! :! :n
UPDATE supervise_risk_confirmation SET audit_status=:audit_status, audit_opinion=:audit_opinion, audited_by=:audited_by, audited_at=datetime('now') WHERE id=:id;
-- :name create-disposal-plan! :! :1
INSERT INTO supervise_disposal_plan (risk_id,target,deadline,disposal_status,submitted_by) VALUES (:risk_id,:target,:deadline,'NOT_STARTED',:submitted_by);
-- :name find-disposal-plan :? :1
SELECT * FROM supervise_disposal_plan WHERE risk_id=:risk_id ORDER BY id DESC LIMIT 1;
-- :name create-disposal-step! :! :n
INSERT INTO supervise_disposal_step (plan_id,content,responsible_department,responsible_person,planned_at,ordinal) VALUES (:plan_id,:content,:responsible_department,:responsible_person,:planned_at,:ordinal);
-- :name create-progress! :! :n
INSERT INTO supervise_disposal_progress (plan_id,step_id,content,progress_at,reporter,attachments,completed) VALUES (:plan_id,:step_id,:content,datetime('now'),:reporter,:attachments,:completed);
-- :name update-plan-status! :! :n
UPDATE supervise_disposal_plan SET disposal_status=:disposal_status, completion_submitted_at=CASE WHEN :disposal_status='COMPLETION_PENDING' THEN datetime('now') ELSE completion_submitted_at END, audit_opinion=:audit_opinion WHERE id=:id;
-- :name create-level-change! :! :n
INSERT INTO supervise_risk_level_change (risk_id,before_level,requested_level,change_type,reason,applicant,applied_at) VALUES (:risk_id,:before_level,:requested_level,:change_type,:reason,:applicant,datetime('now'));
-- :name latest-level-change :? :1
SELECT * FROM supervise_risk_level_change WHERE risk_id=:risk_id ORDER BY id DESC LIMIT 1;
-- :name audit-level-change! :! :n
UPDATE supervise_risk_level_change SET audit_status=:audit_status,audit_opinion=:audit_opinion,auditor=:auditor,audited_at=datetime('now') WHERE id=:id;
-- :name update-risk-level! :! :n
UPDATE supervise_risk SET risk_level=:risk_level, new_risk_level=:risk_level, update_time=datetime('now') WHERE id=:id;
-- :name create-operation-log! :! :n
INSERT INTO supervise_risk_operation_log (risk_id,operato_category,remark,operator_name,operator_time) VALUES (:risk_id,:category,:remark,:operator_name,datetime('now'));
