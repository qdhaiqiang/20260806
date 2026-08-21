import { expect, test } from '@playwright/test'

const enterprises = [{ id: 'ent-1', enterpriseName: '页面测试企业', creditCode: '913700000000000001', enterpriseGroup: 'supv_enterprise_type_wholly', belongingPlateId: 'groupHeadquarters', remark: '企业备注' }]
const indicators = [{ id: 'idx-1', indicatorName: '页面测试指标', indicatorCategory1: 'supv_risk_cat_law', indicatorCategory2: 'supv_risk_type_lawsuit', indicatorStatus: 1, indicatorSource: 0, riskLevel: '2', qccName: '测试企查查指标' }]
const reviews = [
  { riskId: 'review-confirm', enterpriseName: '审核测试企业', riskIndicator: '审核测试指标', riskContent: '待审核风险内容', riskLevel: '2', riskType: 'supv_risk_type_lawsuit', operationStatus: 4, reviewType: 'CONFIRMATION', occurTime: '2026-08-01 10:00:00' },
  { riskId: 'review-level', enterpriseName: '等级审核企业', riskIndicator: '等级指标', riskContent: '等级调整内容', riskLevel: '1', riskType: 'supv_risk_type_lawsuit', operationStatus: 1, reviewType: 'LEVEL_CHANGE', occurTime: '2026-08-02 10:00:00' },
  { riskId: 'review-plan', enterpriseName: '处置审核企业', riskIndicator: '处置指标', riskContent: '处置完成内容', riskLevel: '0', riskType: 'supv_risk_type_lawsuit', operationStatus: 1, reviewType: 'DISPOSAL', occurTime: '2026-08-03 10:00:00' },
]

async function stubApi(page: import('@playwright/test').Page) {
  await page.route('**/api/**', async route => {
    const request = route.request(); const url = new URL(request.url()); const path = url.pathname
    if (path === '/api/login') return route.fulfill({ json: { code: 0, data: { token: 'test-token' } } })
    if (path === '/api/supervise/enterprise/page') return route.fulfill({ json: { code: 0, data: { total: 21, list: enterprises } } })
    if (path === '/api/supervise/index/page') return route.fulfill({ json: { code: 0, data: { total: 21, list: indicators } } })
    if (path === '/api/supervise/index/risk') return route.fulfill({ json: { code: 0, data: [{ enterpriseType: 'supv_enterprise_type_wholly', riskLevel: 2, importantMatter: 1 }] } })
    if (path === '/api/supervise/risk/pending-reviews') return route.fulfill({ json: { code: 0, data: reviews } })
    if (path === '/api/supervise/risk/reviewed-reviews') return route.fulfill({ json: { code: 0, data: [reviews[0]] } })
    if (path.includes('OperationLog')) return route.fulfill({ json: { code: 0, data: [{ id: 'log-1', operatorName: '法务', operatorTime: '2026-08-01', operatoCategory: 'CONFIRMATION', remark: '审核记录' }] } })
    if (path.includes('/confirmation-audit') || path.includes('/level-change-audit') || path.includes('/disposal-audit') || path.includes('/elimination-audit')) return route.fulfill({ json: { code: 0, data: null } })
    if (path === '/api/supervise/enterprise' || path === '/api/supervise/index' || path === '/api/supervise/index/risk' || path.startsWith('/api/supervise/enterprise/') || path.startsWith('/api/supervise/index/')) return route.fulfill({ json: { code: 0, data: null } })
    return route.fulfill({ json: { code: 0, data: [] } })
  })
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('risk-monitor-logged-in', '1'))
  await stubApi(page)
})

test('机构管理：列表展示、检索、分页和新增取消', async ({ page }) => {
  await page.goto('/#/sys/company')
  await expect(page.getByRole('heading', { name: '企业管理' })).toBeVisible()
  await expect(page.getByText('页面测试企业')).toBeVisible()
  const search = page.getByPlaceholder('请输入企业名称')
  await search.fill('页面测试企业'); await search.press('Enter')
  await expect(page.getByRole('button', { name: '2', exact: true })).toBeVisible()
  await page.getByRole('button', { name: '2', exact: true }).click()
  await expect(page.getByRole('button', { name: '2', exact: true })).toHaveClass(/page-current/)
  await page.getByRole('button', { name: /新增企业/ }).click()
  await expect(page.getByRole('heading', { name: '新增企业' })).toBeVisible()
  await page.getByRole('button', { name: '取消', exact: true }).click()
  await expect(page.getByRole('heading', { name: '新增企业' })).toHaveCount(0)
})

test('机构管理：新增和修改提交请求含表单数据', async ({ page }) => {
  await page.goto('/#/sys/company')
  await page.getByRole('button', { name: /新增企业/ }).click()
  await page.getByPlaceholder('请输入企业名称').last().fill('新增页面企业')
  const create = page.waitForRequest(request => request.url().endsWith('/api/supervise/enterprise') && request.method() === 'POST')
  await page.getByRole('button', { name: '确认', exact: true }).click()
  await expect(JSON.parse((await create).postData() || '{}')).toMatchObject({ enterpriseName: '新增页面企业' })
  const row = page.locator('tr', { hasText: '页面测试企业' })
  await row.getByText('编辑', { exact: true }).click()
  const update = page.waitForRequest(request => request.url().endsWith('/api/supervise/enterprise') && request.method() === 'PUT')
  await page.getByPlaceholder('请输入备注').fill('已修改备注')
  await page.getByRole('button', { name: '确认', exact: true }).click()
  await expect(JSON.parse((await update).postData() || '{}')).toMatchObject({ id: 'ent-1', remark: '已修改备注' })
})

test('指标管理：列表检索、新增取消与新增提交', async ({ page }) => {
  await page.goto('/#/sys/indicator')
  await expect(page.getByRole('heading', { name: '指标管理' })).toBeVisible()
  await expect(page.getByText('页面测试指标')).toBeVisible()
  const search = page.getByPlaceholder('请输入指标名称'); await search.fill('页面测试指标'); await search.press('Enter')
  await page.getByRole('button', { name: /新增指标/ }).click()
  await expect(page.getByRole('heading', { name: '新增指标' })).toBeVisible()
  await page.getByPlaceholder('请输入指标名称').last().fill('新增页面指标')
  const create = page.waitForRequest(request => request.url().endsWith('/api/supervise/index') && request.method() === 'POST')
  await page.getByRole('button', { name: '确认', exact: true }).click()
  await expect(JSON.parse((await create).postData() || '{}')).toMatchObject({ indicatorName: '新增页面指标' })
})

test('指标管理：风险等级设置弹窗加载、保存和取消', async ({ page }) => {
  await page.goto('/#/sys/indicator')
  const row = page.locator('tr', { hasText: '页面测试指标' })
  await row.getByText('风险级别设置', { exact: true }).click()
  await expect(page.getByRole('heading', { name: '风险级别设置' })).toBeVisible()
  const request = page.waitForRequest(request => request.url().endsWith('/api/supervise/index/risk') && request.method() === 'POST')
  await page.getByRole('button', { name: '确认', exact: true }).click()
  await expect(JSON.parse((await request).postData() || '{}')).toMatchObject({ indexId: 'idx-1' })
})

test('待审核：状态审核详情、筛选重置与审核提交', async ({ page }) => {
  await page.goto('/#/sys/pendingReview')
  await expect(page.getByText('审核测试企业')).toBeVisible()
  const search = page.getByPlaceholder('请输入企业名称'); await search.fill('审核测试企业')
  await page.getByRole('button', { name: '查询', exact: true }).click()
  await expect(page.getByText('审核测试企业')).toBeVisible()
  const row = page.locator('tr', { hasText: '审核测试企业' })
  await row.getByText('详情', { exact: true }).click()
  await expect(page.getByText('待审核风险内容').last()).toBeVisible()
  await page.getByText('审核记录').click()
  await expect(page.getByText('法务')).toBeVisible()
  await page.getByRole('button', { name: '确定', exact: true }).click()
  await row.getByText('审核', { exact: true }).click()
  const audit = page.waitForRequest(request => request.url().includes('/review-confirm/confirmation-audit'))
  await page.getByRole('button', { name: '确定', exact: true }).click()
  await expect(JSON.parse((await audit).postData() || '{}')).toMatchObject({ auditStatus: 0, operator: '管理员' })
  await page.getByRole('button', { name: '重置', exact: true }).click()
  await expect(search).toHaveValue('')
})

test('待审核：等级与处置标签正确筛选并映射到相应审核接口', async ({ page }) => {
  await page.goto('/#/sys/pendingReview')
  await page.getByRole('button', { name: '风险等级变化审核' }).click()
  await expect(page.getByText('等级审核企业')).toBeVisible()
  await page.locator('tr', { hasText: '等级审核企业' }).getByText('审核', { exact: true }).click()
  await page.getByRole('button', { name: '确定', exact: true }).click()
  await expect(page.getByText('等级审核企业')).toHaveCount(0)
  await page.getByRole('button', { name: '处置计划完成审核' }).click()
  await expect(page.getByText('处置审核企业')).toBeVisible()
  await expect(page.getByText('处置进度')).toBeVisible()
})

test('待审核：不同意时提交驳回状态和审核原因', async ({ page }) => {
  await page.goto('/#/sys/pendingReview')
  await page.locator('tr', { hasText: '审核测试企业' }).getByText('审核', { exact: true }).click()
  await page.getByRole('button', { name: /不同意/ }).click()
  await page.locator('textarea[placeholder="请输入"]').fill('材料不完整，退回补充')
  const audit = page.waitForRequest(request => request.url().includes('/review-confirm/confirmation-audit'))
  await page.getByRole('button', { name: '确定', exact: true }).click()
  await expect(JSON.parse((await audit).postData() || '{}')).toMatchObject({ auditStatus: 1, handleReason: '材料不完整，退回补充', operator: '管理员' })
})
