# 后端测试执行与覆盖核查报告

生成时间：2026-08-12 17:21:14 +0800  
执行目录：`backend/`  
执行命令：`clojure -M:test`

## 执行结果

| 项目 | 实测结果 |
| --- | ---: |
| 测试命名空间 | 1 |
| Test case（`deftest`） | 2 |
| 断言（测试运行器统计） | 12 |
| 失败 | 0 |
| 错误 | 0 |

测试运行器输出：`Ran 2 tests containing 12 assertions. 0 failures, 0 errors.`

测试使用 `test1.sqlite` 的临时副本；运行过程中对临时文件的写入不会修改仓库中的既有数据库。

## 已覆盖内容

现有 `risk-api.workflow-test` 覆盖两条风险处置领域流程：

1. 风险描述、确认、确认审核、处置方案、进度、处置审核、消除审核的正向流转。
2. 风险描述超时处理。

测试直接调用了 10 个领域函数：`initialize-description!`、`submit-description!`、`timeout-descriptions!`、`submit-confirmation!`、`audit-confirmation!`、`create-plan!`、`submit-progress!`、`submit-plan-completion!`、`audit-disposal!`、`audit-elimination!`。

## 接口逻辑覆盖结论

**不包含所有后端接口逻辑。**

当前路由定义有 31 个路径、38 个 HTTP 操作（GET 11、POST 23、PUT 2、DELETE 2），但 `backend/test/` 中没有 controller 或 routes 的测试引用。因此当前 HTTP 接口集成覆盖为 **0 / 38**；现有测试只验证部分领域服务的直接调用。

领域层共有 17 个公开流程函数，至少下列流程尚未被现有测试直接覆盖：手工新增风险、风险复核、申请消除、风险等级变更及审核、逾期处置方案刷新、已持久化动态处理等。企业管理、指标管理、登录、分页查询、字典/下拉数据、删除与导出接口也均无自动化测试。

## 历史报告差异

目录中已有的 `risk-workflow-unit-test-report.md` 标注“10 Test case、84 Assertions”，与当前测试源码及本次真实运行结果不一致；该文件应视为历史报告，不能作为当前覆盖率依据。

## 建议补齐顺序

1. 为全部 38 个 HTTP 操作增加路由级集成测试，验证状态码及与原系统一致的输入、输出结构。
2. 补齐企业和指标的新增、编辑、删除、查询失败分支，以及风险等级设置接口。
3. 补齐领域流程的驳回、重复提交、无权限、数据不存在、超时/逾期等边界场景。
4. 在 CI 中固定执行 `clojure -M:test` 并以本报告中的实测口径统计用例和断言。
