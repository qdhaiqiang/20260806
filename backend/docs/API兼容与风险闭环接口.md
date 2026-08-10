# API 兼容与风险闭环接口

## 兼容范围

前端源码中实际调用的远端服务已整理如下。所有 JSON 成功响应沿用 `{ "code": 0, "msg": "success", "data": ... }`；列表均为 `data.total` 和 `data.list`。本地服务不校验令牌内容，以保持当前前端每次用 `admin/admin` 登录的行为可用。

| 方法与路径 | 请求参数 | 响应 data | 本地实现 |
| --- | --- | --- | --- |
| `POST /api/login` | JSON：`uuid`、`username`、`password` | `{token:string,expire:number}` | 已实现 |
| `GET /api/supervise/risk/page` | `pageNum`、`pageSize`；可选 `enterpriseName`、`riskLevel`、`enterpriseGroup`、`riskType`、`operationStatus`、`department`、`belongingPlateId`、`indicatorSource`、`startDate`、`endDate` | `{total:number,list:Risk[]}` | 已实现 |
| `GET /api/supervise/risk/export` | 无（携带 token 亦可） | 文件流 | 已实现，UTF-8 CSV 下载 |
| `GET /api/supervise/enterprise/page` | `pageNum`、`pageSize`；可选 `enterpriseName` | `{total:number,list:Enterprise[]}` | 已实现 |
| `GET /api/supervise/index/page` | `pageNum`、`pageSize`；可选 `indicatorName` | `{total:number,list:Indicator[]}` | 已实现 |
| `POST /api/supervise/risk/riskReview` | JSON：`riskId`、`auditStatus`（`0` 同意，`1` 不同意）、`handleReason` | `{riskId,operationStatus}` | 已实现，接入确认审核状态机 |

分页参数默认 `pageNum=1`、`pageSize=10`，最大每页 100。分页查询字段保持 camelCase；SQLite 列名仅在服务内转换。

## 关键返回对象

`Risk` 至少包含：`id`、`image`、`metricsName`、`riskIndicator`、`riskContent`、`riskLevel`、`riskType`、`riskMainType`、`enterpriseName`、`enterpriseGroup`、`occurTime`、`operationStatus`、`send`、`tag`、`riskReviewStatus`、`reviewer`、`metricsAliasCode`、`qccId`、`creditCode`、`belongingPlateId`、`fullName`、`companyType`、`shareholdingRatio`、`investmentAmount`、`planStepState`、`indicatorSource`、`newRiskLevel`。

`Enterprise` 至少包含：`id`、`image`、`enterpriseName`、`parentEnterprise`、`creditCode`、`enterpriseGroup`、`supervisionDepartment`、`enterpriseCoding`、`originName`、`qccId`、`publishDate`、`remark`、`createTime`、`updateTime`、`companyType`、`manageEnterpriceIds`、`parentEnterpriseCode`、`fullName`、`fullName2`、`belongingPlateId`、`shareholdingRatio`、`investmentAmount`。

`Indicator` 至少包含：`id`、`indicatorName`、`indicatorSource`、`riskLevel`、`indicatorCategory1`、`indicatorCategory2`、`indicatorStatus`、`associatedDepartment`、`score`、`qccCode`、`qccName`、`confirmByClient`、`importantMatter`、`remark`、`createTime`、`updateTime`、`manageDeptId`、`riskLevelName`。

## 已落地的风险闭环接口

这些接口使用新的扩展表，所有变更都会写入 `supervise_risk_operation_log`。

| 方法与路径 | 输入 JSON | 状态规则 |
| --- | --- | --- |
| `POST /api/supervise/risk/{id}/description` | `occurrenceReason`、`decisionBody`、`reportedToGroup`、`reportContent`、`attachments`、`submitter`、`dueAt` | `DESCRIPTION_PENDING/UNCONFIRMED -> UNCONFIRMED` |
| `POST /api/supervise/risk/{id}/confirm` | `isRisk:boolean`、`remark`、`operator` | `UNCONFIRMED -> CONFIRM_PENDING/CLOSE_PENDING` |
| `POST /api/supervise/risk/{id}/confirmation-audit` | `auditStatus:0|1`、`handleReason`、`operator` | 按确认矩阵进入 `CONFIRMED/CLOSED` |
| `POST /api/supervise/risk/{id}/disposal-plans` | `target`、`deadline`、`operator`、`steps[]`；步骤含 `content`、`responsibleDepartment`、`responsiblePerson`、`plannedAt` | 仅 `CONFIRMED`，创建后为 `NOT_STARTED` |

风险主状态兼容历史编码：`0` 未确认、`1` 已确认、`2` 已消除、`3` 已关闭、`4` 确认待审核、`5` 关闭待审核、`6` 消除待审核；新“情况描述”建议使用 `7`。处置状态独立保存在 `supervise_disposal_plan.disposal_status`。

## 数据与安全边界

- 服务不执行任何迁移或 DDL；风险闭环仅使用 `test1.sqlite` 已存在的业务表。
- 当前前端兼容登录为开发模式；部署前必须接入真实用户、数据范围、按钮权限与审计身份。
- 外部动态幂等、消息 Outbox/MQ、附件存储和定时任务的表结构边界已预留；在接入真实外部源前需补充消费端与调度器。
