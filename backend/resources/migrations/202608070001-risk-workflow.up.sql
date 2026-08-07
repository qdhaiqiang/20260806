CREATE TABLE IF NOT EXISTS supervise_risk_raw (
  id INTEGER PRIMARY KEY, source TEXT NOT NULL, source_key TEXT NOT NULL UNIQUE,
  payload TEXT NOT NULL, received_at TEXT NOT NULL, parse_status TEXT NOT NULL,
  parse_error TEXT, risk_id INTEGER
);
CREATE TABLE IF NOT EXISTS supervise_risk_description (
  id INTEGER PRIMARY KEY, risk_id INTEGER NOT NULL UNIQUE, occurrence_reason TEXT,
  decision_body TEXT, reported_to_group INTEGER, report_content TEXT, attachments TEXT,
  submitter TEXT, submitted_at TEXT, due_at TEXT, auto_submitted INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS supervise_risk_confirmation (
  id INTEGER PRIMARY KEY, risk_id INTEGER NOT NULL, is_risk INTEGER NOT NULL,
  remark TEXT, submitted_by TEXT, submitted_at TEXT, audit_status INTEGER,
  audit_opinion TEXT, audited_by TEXT, audited_at TEXT
);
CREATE TABLE IF NOT EXISTS supervise_disposal_plan (
  id INTEGER PRIMARY KEY, risk_id INTEGER NOT NULL, target TEXT NOT NULL,
  deadline TEXT NOT NULL, disposal_status TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1,
  submitted_by TEXT, completion_submitted_at TEXT, audit_opinion TEXT
);
CREATE TABLE IF NOT EXISTS supervise_disposal_step (
  id INTEGER PRIMARY KEY, plan_id INTEGER NOT NULL, content TEXT NOT NULL,
  responsible_department TEXT, responsible_person TEXT, planned_at TEXT, ordinal INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS supervise_disposal_progress (
  id INTEGER PRIMARY KEY, plan_id INTEGER NOT NULL, step_id INTEGER, content TEXT NOT NULL,
  progress_at TEXT NOT NULL, reporter TEXT, attachments TEXT, completed INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS supervise_risk_level_change (
  id INTEGER PRIMARY KEY, risk_id INTEGER NOT NULL, before_level TEXT NOT NULL,
  requested_level TEXT NOT NULL, change_type TEXT NOT NULL, reason TEXT NOT NULL,
  applicant TEXT, applied_at TEXT NOT NULL, audit_status INTEGER, audit_opinion TEXT,
  auditor TEXT, audited_at TEXT
);
CREATE TABLE IF NOT EXISTS supervise_message_record (
  id INTEGER PRIMARY KEY, business_type TEXT NOT NULL, business_id TEXT NOT NULL,
  channel TEXT NOT NULL, recipient TEXT, send_status TEXT NOT NULL, retry_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_risk_raw_risk_id ON supervise_risk_raw(risk_id);
CREATE INDEX IF NOT EXISTS idx_risk_description_risk_id ON supervise_risk_description(risk_id);
CREATE INDEX IF NOT EXISTS idx_disposal_plan_risk_id ON supervise_disposal_plan(risk_id);
