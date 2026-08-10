-- :name count-risks :? :1
SELECT count(*) AS total FROM supervise_risk r
WHERE coalesce(r.delete_or_not, 0) = 0
  AND (:enterprise_name IS NULL OR r.enterprise_name LIKE '%' || :enterprise_name || '%')
  AND (:risk_level IS NULL OR instr(',' || :risk_level || ',', ',' || r.risk_level || ',') > 0)
  AND (:enterprise_group IS NULL OR instr(',' || :enterprise_group || ',', ',' || r.enterprise_group || ',') > 0)
  AND (:risk_type IS NULL OR instr(',' || :risk_type || ',', ',' || r.risk_type || ',') > 0)
  AND (:operation_status IS NULL OR instr(',' || :operation_status || ',', ',' || r.operation_status || ',') > 0)
  AND (:manage_dept_id IS NULL OR instr(',' || :manage_dept_id || ',', ',' || r.dept_id || ',') > 0)
  AND (:belonging_plate_id IS NULL OR instr(',' || :belonging_plate_id || ',', ',' || r.belonging_plate_id || ',') > 0)
  AND (:indicator_source IS NULL OR instr(',' || :indicator_source || ',', ',' || r.indicator_source || ',') > 0)
  AND (:start_date IS NULL OR date(r.occur_time) >= date(:start_date))
  AND (:end_date IS NULL OR date(r.occur_time) <= date(:end_date));

-- :name list-risks :? :*
SELECT r.id, r.image, r.metrics_name AS metrics_name, r.risk_indicator, r.risk_content,
       r.risk_level, r.risk_type, risk_type_data.dict_label AS risk_type_name,
       r.risk_main_type, category_data.dict_label AS risk_main_type_name, r.enterprise_name, r.enterprise_group,
       r.occur_time, r.operation_status, r.send, r.tag, r.risk_review_status, r.reviewer,
       r.metrics_alias_code, r.qcc_id, r.credit_code, r.belonging_plate_id, r.dept_id AS manage_dept_id, r.full_name,
       r.company_type, r.shareholding_ratio, r.investment_amount, r.plan_step_state,
       r.indicator_source, r.new_risk_level
FROM supervise_risk r
LEFT JOIN sys_dict_type category_type ON category_type.dict_type = 'supv_risk_category'
LEFT JOIN sys_dict_data category_data ON category_data.dict_type_id = category_type.id AND category_data.dict_value = r.risk_main_type
LEFT JOIN sys_dict_type risk_type ON risk_type.dict_type = r.risk_main_type
LEFT JOIN sys_dict_data risk_type_data ON risk_type_data.dict_type_id = risk_type.id AND risk_type_data.dict_value = r.risk_type
WHERE coalesce(r.delete_or_not, 0) = 0
  AND (:enterprise_name IS NULL OR r.enterprise_name LIKE '%' || :enterprise_name || '%')
  AND (:risk_level IS NULL OR instr(',' || :risk_level || ',', ',' || r.risk_level || ',') > 0)
  AND (:enterprise_group IS NULL OR instr(',' || :enterprise_group || ',', ',' || r.enterprise_group || ',') > 0)
  AND (:risk_type IS NULL OR instr(',' || :risk_type || ',', ',' || r.risk_type || ',') > 0)
  AND (:operation_status IS NULL OR instr(',' || :operation_status || ',', ',' || r.operation_status || ',') > 0)
  AND (:manage_dept_id IS NULL OR instr(',' || :manage_dept_id || ',', ',' || r.dept_id || ',') > 0)
  AND (:belonging_plate_id IS NULL OR instr(',' || :belonging_plate_id || ',', ',' || r.belonging_plate_id || ',') > 0)
  AND (:indicator_source IS NULL OR instr(',' || :indicator_source || ',', ',' || r.indicator_source || ',') > 0)
  AND (:start_date IS NULL OR date(r.occur_time) >= date(:start_date))
  AND (:end_date IS NULL OR date(r.occur_time) <= date(:end_date))
ORDER BY r.occur_time DESC, r.id DESC LIMIT :limit OFFSET :offset;

-- :name count-enterprises :? :1
SELECT count(*) AS total FROM supervise_enterprise e
WHERE coalesce(e.deleted, 0) = 0
  AND (:enterprise_name IS NULL OR e.enterprise_name LIKE '%' || :enterprise_name || '%');

-- :name list-enterprises :? :*
SELECT e.id, e.image, e.enterprise_name, e.parent_enterprise, e.credit_code,
       e.enterprise_group,
       (SELECT d.dict_label FROM sys_dict_data d WHERE d.dict_value = e.enterprise_group LIMIT 1) AS enterprise_group_name,
       e.supervision_department, e.enterprise_coding, e.origin_name,
       e.qcc_id, e.publish_date, e.remark, e.create_time, e.update_time, e.company_type,
       e.manage_enterprice_ids, e.parent_enterprise_code, e.full_name, e.full_name2,
       e.belonging_plate_id,
       (SELECT d.dict_label FROM sys_dict_type t JOIN sys_dict_data d ON d.dict_type_id = t.id WHERE t.dict_type = 'industrialModule' AND d.dict_value = e.belonging_plate_id LIMIT 1) AS belonging_plate_name,
       e.shareholding_ratio, e."investment_amount​" AS investment_amount
FROM supervise_enterprise e
WHERE coalesce(e.deleted, 0) = 0
  AND (:enterprise_name IS NULL OR e.enterprise_name LIKE '%' || :enterprise_name || '%')
ORDER BY e.id DESC LIMIT :limit OFFSET :offset;

-- :name count-indicators :? :1
SELECT count(*) AS total FROM supervise_index i
WHERE (:indicator_name IS NULL OR i.indicator_name LIKE '%' || :indicator_name || '%');

-- :name list-departments :? :*
-- The original department selector reads the existing organization table.
SELECT id, pid, pids, name, sort
FROM sys_dept
WHERE coalesce(deleted, 0) = 0
ORDER BY sort, name, id;

-- :name list-indicators :? :*
SELECT i.id, i.indicator_name, i.indicator_source, i.risk_level, i.indicator_category1,
       category_data.dict_label AS indicator_category1_name, i.indicator_category2,
       type_data.dict_label AS indicator_category2_name, i.indicator_status, i.associated_department, i.score,
       i.qcc_code, i.qcc_name, i.confirm_by_client, i.important_matter, i.remark,
       i.create_time, i.update_time, i.manage_dept_id, i.risk_level AS risk_level_name
FROM supervise_index i
LEFT JOIN sys_dict_type category_type ON category_type.dict_type = 'supv_risk_category'
LEFT JOIN sys_dict_data category_data ON category_data.dict_type_id = category_type.id AND category_data.dict_value = i.indicator_category1
LEFT JOIN sys_dict_type indicator_type ON indicator_type.dict_type = i.indicator_category1
LEFT JOIN sys_dict_data type_data ON type_data.dict_type_id = indicator_type.id AND type_data.dict_value = i.indicator_category2
WHERE (:indicator_name IS NULL OR i.indicator_name LIKE '%' || :indicator_name || '%')
ORDER BY i.id DESC LIMIT :limit OFFSET :offset;

-- :name find-risk-by-id :? :1
SELECT * FROM supervise_risk WHERE id = :id AND coalesce(delete_or_not, 0) = 0;

-- :name update-risk-status! :! :n
UPDATE supervise_risk SET operation_status = :operation_status, update_time = datetime('now')
WHERE id = :id;

-- :name find-enterprise-by-id :? :1
SELECT * FROM supervise_enterprise WHERE id = :id AND coalesce(deleted, 0) = 0;

-- :name create-enterprise! :! :1
INSERT INTO supervise_enterprise (id, image, enterprise_name, parent_enterprise, credit_code, enterprise_group, belonging_plate_id, shareholding_ratio, "investment_amount​", remark, create_time, update_time, deleted)
VALUES (abs(random()), :image, :enterprise_name, :parent_enterprise, :credit_code, :enterprise_group, :belonging_plate_id, :shareholding_ratio, :investment_amount, :remark, datetime('now'), datetime('now'), 0);

-- :name update-enterprise! :! :n
UPDATE supervise_enterprise SET enterprise_name=:enterprise_name, parent_enterprise=:parent_enterprise,
credit_code=:credit_code, enterprise_group=:enterprise_group, belonging_plate_id=:belonging_plate_id,
shareholding_ratio=:shareholding_ratio, "investment_amount​"=:investment_amount, image=:image, remark=:remark, update_time=datetime('now') WHERE id=:id AND coalesce(deleted, 0)=0;

-- :name list-enterprise-options :? :*
SELECT id, enterprise_name, credit_code, belonging_plate_id FROM supervise_enterprise WHERE coalesce(deleted, 0)=0 ORDER BY enterprise_name;

-- :name list-equity-enterprises :? :*
-- 只读取原始企业层级字段；pids 是参考系统组织树的父级 ID 链。
SELECT e.id, e.pids, e.enterprise_name, e.credit_code, e.qcc_id,
       e.parent_enterprise, e.parent_enterprise_code, e.enterprise_coding,
       e.full_name, e.full_name2
FROM supervise_enterprise e
WHERE coalesce(e.deleted, 0) = 0
  AND (
    :parent_credit_code IS NULL
    OR e.id = (SELECT root.id FROM supervise_enterprise root WHERE root.credit_code = :parent_credit_code LIMIT 1)
    OR instr(',' || coalesce(e.pids, '') || ',', ',' || (SELECT root.id FROM supervise_enterprise root WHERE root.credit_code = :parent_credit_code LIMIT 1) || ',') > 0
  )
ORDER BY length(coalesce(e.pids, '')), e.pids, e.id;

-- :name delete-enterprise! :! :n
UPDATE supervise_enterprise SET deleted=1, update_time=datetime('now') WHERE id=:id AND coalesce(deleted, 0)=0;

-- :name find-indicator-by-id :? :1
SELECT * FROM supervise_index WHERE id = :id;

-- :name create-indicator! :! :1
INSERT INTO supervise_index (id, indicator_name, indicator_source, risk_level, indicator_category1, indicator_category2, indicator_status, associated_department, score, qcc_code, qcc_name, remark, create_time, update_time, confirm_by_client, important_matter, manage_dept_id)
VALUES (abs(random()), :indicator_name, :indicator_source, :risk_level, :indicator_category1, :indicator_category2, :indicator_status, :associated_department, :score, :qcc_code, :qcc_name, :remark, datetime('now'), datetime('now'), :confirm_by_client, :important_matter, :manage_dept_id);

-- :name update-indicator! :! :n
UPDATE supervise_index SET indicator_name=:indicator_name, indicator_source=:indicator_source, risk_level=:risk_level,
indicator_category1=:indicator_category1, indicator_category2=:indicator_category2, indicator_status=:indicator_status,
associated_department=:associated_department, score=:score, qcc_code=:qcc_code, qcc_name=:qcc_name,
remark=:remark, update_time=datetime('now'), confirm_by_client=:confirm_by_client,
important_matter=:important_matter, manage_dept_id=:manage_dept_id WHERE id=:id;

-- :name delete-indicator! :! :n
DELETE FROM supervise_index WHERE id=:id;

-- :name find-indicator-risk-setting :? :1
SELECT * FROM supervise_index_risk_relationship WHERE index_id=:index_id ORDER BY id DESC LIMIT 1;

-- :name list-indicator-risk-settings :? :*
SELECT * FROM supervise_index_risk_relationship WHERE index_id=:index_id ORDER BY risk_level DESC, enterprise_type;

-- :name delete-indicator-risk-setting! :! :n
DELETE FROM supervise_index_risk_relationship WHERE index_id=:index_id;

-- :name save-indicator-risk-setting! :! :1
INSERT INTO supervise_index_risk_relationship (id, index_id, risk_level, enterprise_type, important_matter, create_time, update_time)
VALUES (abs(random()), :index_id, :risk_level, :enterprise_type, :important_matter, datetime('now'), datetime('now'));
