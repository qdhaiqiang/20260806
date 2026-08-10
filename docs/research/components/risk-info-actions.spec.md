# Risk information action column specification

## Target

- Reference: `http://172.16.40.152:8101/#/riskMonitor/info`
- Target files: `frontend/src/App.tsx`, `frontend/src/App.css`
- Interaction model: click-driven dialogs; only a final submit changes data.

## Actions and API contract

- **详情** opens `风险详情`: basic risk fields; `操作记录` and `处置计划完成情况` tabs. Operation records are loaded with `GET /api/supervise/risk/superviseRiskOperationLog/getLogByRiskId`.
- **指标全景** opens the indicator panorama dialog for the row's `metricsAliasCode`.
- **处置计划** opens a disposal-plan dialog. It reads `GET /api/demo/superviseriskdisposalplanstep/page` and step detail records from `GET /api/demo/superviseriskdisposalplanstepdetail/page`; updates use `/batchInsert`, `/updateAndUpdateStatus`, `/saveDetail`, and `/updateFile`.
- **风险确认 / 风险消除** use `POST /api/supervise/risk/riskHandle` after confirmation input.
- **情况描述** is a dialog with `发生原因`, `决策机构`, attachment upload and `是否报备集团`; it submits to `POST /api/supervise/risk/riskSituation`.

## Observed reference details dialog

- Title `风险详情`, white dialog with close button.
- Fields in order: 风险级别、企业名称、风险指标、风险类型、企业分组、持股比例、投资金额、管理主体、审核状态、发生时间、风险内容。
- Tabs: `操作记录` and `处置计划完成情况`.
- The operation record table columns are 序号、审批人、操作时间、操作、理由; each row provides a `详情` action.

## Observed status-dependent action visibility

- `operationStatus === 0`: 风险确认.
- `operationStatus === 1 && planStepState === 2`: 风险消除.
- `operationStatus === 1 && planStepState !== 2`: 处置计划.
- `operationStatus === 7`: 情况描述.
- Every row: 详情、指标全景.
