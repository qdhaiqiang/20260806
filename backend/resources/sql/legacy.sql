-- :name count-risks :? :1
SELECT count(*) AS total FROM supervise_risk r
WHERE coalesce(r.delete_or_not, 0) = 0
  AND (:enterprise_name IS NULL OR r.enterprise_name LIKE '%' || :enterprise_name || '%')
  AND (:risk_level IS NULL OR r.risk_level = :risk_level)
  AND (:enterprise_group IS NULL OR r.enterprise_group = :enterprise_group)
  AND (:risk_type IS NULL OR r.risk_type = :risk_type)
  AND (:operation_status IS NULL OR r.operation_status = :operation_status)
  AND (:belonging_plate_id IS NULL OR r.belonging_plate_id = :belonging_plate_id)
  AND (:indicator_source IS NULL OR r.indicator_source = :indicator_source)
  AND (:start_date IS NULL OR date(r.occur_time) >= date(:start_date))
  AND (:end_date IS NULL OR date(r.occur_time) <= date(:end_date));

-- :name list-risks :? :*
SELECT r.id, r.image, r.metrics_name AS metrics_name, r.risk_indicator, r.risk_content,
       r.risk_level, r.risk_type, r.risk_main_type, r.enterprise_name, r.enterprise_group,
       r.occur_time, r.operation_status, r.send, r.tag, r.risk_review_status, r.reviewer,
       r.metrics_alias_code, r.qcc_id, r.credit_code, r.belonging_plate_id, r.full_name,
       r.company_type, r.shareholding_ratio, r.investment_amount, r.plan_step_state,
       r.indicator_source, r.new_risk_level
FROM supervise_risk r
WHERE coalesce(r.delete_or_not, 0) = 0
  AND (:enterprise_name IS NULL OR r.enterprise_name LIKE '%' || :enterprise_name || '%')
  AND (:risk_level IS NULL OR r.risk_level = :risk_level)
  AND (:enterprise_group IS NULL OR r.enterprise_group = :enterprise_group)
  AND (:risk_type IS NULL OR r.risk_type = :risk_type)
  AND (:operation_status IS NULL OR r.operation_status = :operation_status)
  AND (:belonging_plate_id IS NULL OR r.belonging_plate_id = :belonging_plate_id)
  AND (:indicator_source IS NULL OR r.indicator_source = :indicator_source)
  AND (:start_date IS NULL OR date(r.occur_time) >= date(:start_date))
  AND (:end_date IS NULL OR date(r.occur_time) <= date(:end_date))
ORDER BY r.occur_time DESC, r.id DESC LIMIT :limit OFFSET :offset;

-- :name count-enterprises :? :1
SELECT count(*) AS total FROM supervise_enterprise e
WHERE coalesce(e.deleted, 0) = 0
  AND (:enterprise_name IS NULL OR e.enterprise_name LIKE '%' || :enterprise_name || '%');

-- :name list-enterprises :? :*
SELECT e.id, e.image, e.enterprise_name, e.parent_enterprise, e.credit_code,
       e.enterprise_group, e.supervision_department, e.enterprise_coding, e.origin_name,
       e.qcc_id, e.publish_date, e.remark, e.create_time, e.update_time, e.company_type,
       e.manage_enterprice_ids, e.parent_enterprise_code, e.full_name, e.full_name2,
       e.belonging_plate_id, e.shareholding_ratio, e.investment_amount
FROM supervise_enterprise e
WHERE coalesce(e.deleted, 0) = 0
  AND (:enterprise_name IS NULL OR e.enterprise_name LIKE '%' || :enterprise_name || '%')
ORDER BY e.id DESC LIMIT :limit OFFSET :offset;

-- :name count-indicators :? :1
SELECT count(*) AS total FROM supervise_index i
WHERE (:indicator_name IS NULL OR i.indicator_name LIKE '%' || :indicator_name || '%');

-- :name list-indicators :? :*
SELECT i.id, i.indicator_name, i.indicator_source, i.risk_level, i.indicator_category1,
       i.indicator_category2, i.indicator_status, i.associated_department, i.score,
       i.qcc_code, i.qcc_name, i.confirm_by_client, i.important_matter, i.remark,
       i.create_time, i.update_time, i.manage_dept_id, i.risk_level AS risk_level_name
FROM supervise_index i
WHERE (:indicator_name IS NULL OR i.indicator_name LIKE '%' || :indicator_name || '%')
ORDER BY i.id DESC LIMIT :limit OFFSET :offset;

-- :name find-risk-by-id :? :1
SELECT * FROM supervise_risk WHERE id = :id AND coalesce(delete_or_not, 0) = 0;

-- :name update-risk-status! :! :n
UPDATE supervise_risk SET operation_status = :operation_status, update_time = datetime('now')
WHERE id = :id;
