-- Existing-table workflow queries only.  This file intentionally contains no DDL.

-- :name find-risk-by-source-key :? :1
SELECT * FROM supervise_risk WHERE unique_hashkey=:source_key AND coalesce(delete_or_not,0)=0;

-- :name create-manual-risk! :! :1
INSERT INTO supervise_risk
  (id,image,metrics_name,risk_indicator,risk_content,risk_level,risk_main_type,risk_type,
   enterprise_name,enterprise_group,occur_time,operation_status,create_time,update_time,
   dept_id,metrics_alias_code,delete_or_not,qcc_id,credit_code,belonging_plate_id,
   shareholding_ratio,investment_amount,plan_step_state,indicator_source)
VALUES
  (:id,:image,:metrics_name,:risk_indicator,:risk_content,:risk_level,:risk_main_type,:risk_type,
   :enterprise_name,:enterprise_group,:occur_time,0,datetime('now'),datetime('now'),
   :dept_id,:metrics_alias_code,0,:qcc_id,:credit_code,:belonging_plate_id,
   :shareholding_ratio,:investment_amount,0,:indicator_source);

-- :name transition-risk-status! :! :n
UPDATE supervise_risk
SET operation_status=:next_status, update_time=datetime('now')
WHERE id=:id AND operation_status IN (:v*:allowed_statuses) AND coalesce(delete_or_not,0)=0;

-- :name create-description-draft! :! :n
INSERT INTO supervise_risk_description
  (risk_id,occurrence_reason,decision_body,reported_to_group,report_content,attachments,submitter,submitted_at,due_at,auto_submitted)
VALUES
  (:risk_id,:occurrence_reason,:decision_body,:reported_to_group,:report_content,:attachments,:submitter,NULL,:due_at,0)
ON CONFLICT(risk_id) DO UPDATE SET
  occurrence_reason=excluded.occurrence_reason, decision_body=excluded.decision_body,
  reported_to_group=excluded.reported_to_group, report_content=excluded.report_content,
  attachments=excluded.attachments, submitter=excluded.submitter, due_at=excluded.due_at,
  submitted_at=NULL, auto_submitted=0;

-- :name submit-description! :! :n
UPDATE supervise_risk_description
SET occurrence_reason=:occurrence_reason, decision_body=:decision_body,
    reported_to_group=:reported_to_group, report_content=:report_content,
    attachments=:attachments, submitter=:submitter, submitted_at=datetime('now'), auto_submitted=0
WHERE risk_id=:risk_id;

-- :name latest-description :? :1
SELECT * FROM supervise_risk_description WHERE risk_id=:risk_id;

-- :name due-descriptions :? :*
SELECT r.* FROM supervise_risk r JOIN supervise_risk_description d ON d.risk_id=r.id
WHERE r.operation_status=7 AND d.submitted_at IS NULL AND datetime(d.due_at)<=datetime('now');

-- :name auto-submit-description! :! :n
UPDATE supervise_risk_description SET submitted_at=datetime('now'), auto_submitted=1
WHERE risk_id=:risk_id AND submitted_at IS NULL;

-- :name create-confirmation! :! :1
INSERT INTO supervise_risk_confirmation (risk_id,is_risk,remark,submitted_by,submitted_at)
VALUES (:risk_id,:is_risk,:remark,:submitted_by,datetime('now'));

-- :name latest-confirmation :? :1
SELECT * FROM supervise_risk_confirmation WHERE risk_id=:risk_id ORDER BY id DESC LIMIT 1;

-- :name audit-confirmation! :! :n
UPDATE supervise_risk_confirmation
SET audit_status=:audit_status,audit_opinion=:audit_opinion,audited_by=:audited_by,audited_at=datetime('now')
WHERE id=:id AND audit_status IS NULL;

-- :name create-legacy-plan-step! :! :1
INSERT INTO supervise_risk_disposal_plan_step
  (id,plan_no,risk_id,plan_target,step,step_content,plan_deadline,plan_finish_date,department,department_id,responsible_person_name,state,create_time,update_time,deleted,url,url_name)
VALUES
  (:id,:plan_no,:risk_id,:plan_target,:step,:step_content,:plan_deadline,:planned_at,:department,:department_id,:responsible_person_name,0,datetime('now'),datetime('now'),0,:url,:url_name);

-- :name current-plan-steps :? :*
SELECT * FROM supervise_risk_disposal_plan_step
WHERE risk_id=:risk_id AND coalesce(deleted,0)=0
  AND plan_no=(SELECT plan_no FROM supervise_risk_disposal_plan_step WHERE risk_id=:risk_id AND coalesce(deleted,0)=0 ORDER BY create_time DESC,id DESC LIMIT 1)
ORDER BY step,id;

-- :name find-plan-step :? :1
SELECT * FROM supervise_risk_disposal_plan_step WHERE id=:id AND coalesce(deleted,0)=0;

-- :name latest-plan-step :? :1
SELECT * FROM supervise_risk_disposal_plan_step
WHERE risk_id=:risk_id AND coalesce(deleted,0)=0 ORDER BY create_time DESC,id DESC LIMIT 1;

-- :name update-plan-step-state! :! :n
UPDATE supervise_risk_disposal_plan_step
SET state=:state, actual_finish_date=:actual_finish_date, update_time=datetime('now')
WHERE id=:id AND coalesce(deleted,0)=0;

-- :name create-legacy-progress! :! :1
INSERT INTO supervise_risk_disposal_plan_step_detail
  (id,progress_step,progress_step_content,state,plan_step_id,create_time,update_time,deleted)
VALUES (:id,:progress_step,:progress_step_content,:state,:plan_step_id,datetime('now'),datetime('now'),0);

-- :name update-legacy-progress! :! :n
UPDATE supervise_risk_disposal_plan_step_detail
SET progress_step_content=:progress_step_content,state=:state,update_time=datetime('now')
WHERE id=:id AND coalesce(deleted,0)=0;

-- :name delete-legacy-progress! :! :n
UPDATE supervise_risk_disposal_plan_step_detail SET deleted=1,update_time=datetime('now') WHERE id=:id;

-- :name list-progresses :? :*
SELECT * FROM supervise_risk_disposal_plan_step_detail WHERE plan_step_id=:step_id AND coalesce(deleted,0)=0 ORDER BY create_time,id;

-- :name set-risk-plan-state! :! :n
UPDATE supervise_risk SET plan_step_state=:plan_step_state,update_time=datetime('now') WHERE id=:id;

-- :name overdue-risk-ids :? :*
SELECT DISTINCT risk_id FROM supervise_risk_disposal_plan_step
WHERE coalesce(deleted,0)=0 AND state NOT IN (4) AND date(plan_deadline)<date('now');

-- :name create-level-change! :! :1
INSERT INTO supervise_risk_level_change
  (risk_id,before_level,requested_level,change_type,reason,applicant,applied_at)
VALUES (:risk_id,:before_level,:requested_level,:change_type,:reason,:applicant,datetime('now'));

-- :name latest-level-change :? :1
SELECT * FROM supervise_risk_level_change WHERE risk_id=:risk_id ORDER BY id DESC LIMIT 1;

-- :name audit-level-change! :! :n
UPDATE supervise_risk_level_change
SET audit_status=:audit_status,audit_opinion=:audit_opinion,auditor=:auditor,audited_at=datetime('now')
WHERE id=:id AND audit_status IS NULL;

-- :name update-risk-level! :! :n
UPDATE supervise_risk SET risk_level=:risk_level,new_risk_level=:risk_level,update_time=datetime('now') WHERE id=:id;

-- :name create-operation-log! :! :1
INSERT INTO supervise_risk_operation_log
  (risk_id,operato_category,remark,operator_name,operator_time,decision_content,new_risk_level)
VALUES (:risk_id,:category,:remark,:operator_name,datetime('now'),:decision_content,:new_risk_level);

-- :name list-operation-logs :? :*
SELECT id,risk_id,operator_name,operator_time,operato_category,remark,decision_content,new_risk_level
FROM supervise_risk_operation_log WHERE risk_id=:risk_id ORDER BY operator_time DESC,id DESC;

-- :name create-message! :! :1
INSERT INTO supervise_message_record (business_type,business_id,channel,recipient,send_status,retry_count,created_at)
VALUES (:business_type,:business_id,:channel,:recipient,'LOGGED',0,datetime('now'));

-- :name list-disposal-steps-by-risk :? :*
SELECT id,risk_id,plan_no,plan_target,step,step_content,plan_deadline,plan_finish_date,actual_finish_date,
       department,department_id,responsible_person_id,responsible_person_name,state,create_time,update_time,url,url_name
FROM supervise_risk_disposal_plan_step
WHERE risk_id=:risk_id AND coalesce(deleted,0)=0 ORDER BY step,create_time,id;

-- :name list-pending-reviews :? :*
SELECT r.id AS risk_id,r.enterprise_name,r.risk_indicator,r.risk_content,r.risk_level,r.risk_type,r.occur_time,
       CASE WHEN r.operation_status IN (4,5) THEN 'CONFIRMATION'
            WHEN r.operation_status=6 THEN 'ELIMINATION'
            WHEN r.plan_step_state=3 THEN 'DISPOSAL'
            ELSE 'LEVEL_CHANGE' END AS review_type,
       r.operation_status,r.plan_step_state,NULL AS level_change_id
FROM supervise_risk r
WHERE coalesce(r.delete_or_not,0)=0
  AND (r.operation_status IN (4,5,6) OR (r.operation_status=1 AND r.plan_step_state=3))
UNION ALL
SELECT r.id AS risk_id,r.enterprise_name,r.risk_indicator,r.risk_content,r.risk_level,r.risk_type,r.occur_time,
       'LEVEL_CHANGE' AS review_type,r.operation_status,r.plan_step_state,c.id AS level_change_id
FROM supervise_risk_level_change c JOIN supervise_risk r ON r.id=c.risk_id
WHERE c.audit_status IS NULL AND coalesce(r.delete_or_not,0)=0
UNION ALL
-- The imported production database also contains legacy pending level-change
-- requests directly on supervise_risk.  They do not have a corresponding row
-- in supervise_risk_level_change, so include them without creating new data.
SELECT r.id AS risk_id,r.enterprise_name,r.risk_indicator,r.risk_content,r.risk_level,r.risk_type,r.occur_time,
       'LEVEL_CHANGE' AS review_type,r.operation_status,r.plan_step_state,NULL AS level_change_id
FROM supervise_risk r
WHERE coalesce(r.delete_or_not,0)=0
  AND trim(coalesce(r.new_risk_level,''))<>''
  AND r.new_risk_level<>r.risk_level
  AND NOT EXISTS (SELECT 1 FROM supervise_risk_level_change c WHERE c.risk_id=r.id)
ORDER BY occur_time DESC;

-- :name list-reviewed-reviews :? :*
SELECT r.id AS risk_id,r.enterprise_name,r.risk_indicator,r.risk_content,r.risk_level,r.risk_type,r.occur_time,
       'CONFIRMATION' AS review_type,r.operation_status,r.plan_step_state,c.audited_at AS reviewed_at,c.audited_by AS reviewer,c.audit_opinion AS opinion
FROM supervise_risk_confirmation c JOIN supervise_risk r ON r.id=c.risk_id
WHERE c.audit_status IS NOT NULL AND coalesce(r.delete_or_not,0)=0
UNION ALL
SELECT r.id,r.enterprise_name,r.risk_indicator,r.risk_content,r.risk_level,r.risk_type,r.occur_time,
       'LEVEL_CHANGE',r.operation_status,r.plan_step_state,c.audited_at,c.auditor,c.audit_opinion
FROM supervise_risk_level_change c JOIN supervise_risk r ON r.id=c.risk_id
WHERE c.audit_status IS NOT NULL AND coalesce(r.delete_or_not,0)=0
UNION ALL
SELECT r.id,r.enterprise_name,r.risk_indicator,r.risk_content,r.risk_level,r.risk_type,r.occur_time,
       CASE WHEN l.operato_category='ELIMINATION_AUDITED' THEN 'ELIMINATION' ELSE 'DISPOSAL' END,r.operation_status,r.plan_step_state,l.operator_time,l.operator_name,l.remark
FROM supervise_risk r JOIN supervise_risk_operation_log l ON l.risk_id=r.id
WHERE l.operato_category IN ('ELIMINATION_AUDITED','DISPOSAL_AUDITED') AND coalesce(r.delete_or_not,0)=0
ORDER BY reviewed_at DESC;
