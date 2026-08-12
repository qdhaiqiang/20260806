import { expect, test } from '@playwright/test'

type State = { description: boolean; confirmation: boolean; elimination: boolean; requests: Record<string, unknown>[] }

function apiState(state: State) {
  return async (route: import('@playwright/test').Route, request: import('@playwright/test').Request) => {
    const url = new URL(request.url())
    if (url.pathname === '/api/login') return route.fulfill({ json: { code: 0, data: { token: 'test-token' } } })
    if (url.pathname === '/api/supervise/risk/page') return route.fulfill({ json: { code: 0, data: { total: 30, list: [
      { id: 'risk-description', enterpriseName: '页面测试-情况描述', riskIndicator: '测试指标', riskContent: '测试内容', riskLevel: '2', operationStatus: state.description ? 0 : 7, indicatorSource: 0 },
      { id: 'risk-confirmation', enterpriseName: '页面测试-风险确认', riskIndicator: '测试指标', riskContent: '测试内容', riskLevel: '2', operationStatus: state.confirmation ? 4 : 0, indicatorSource: 0 },
      { id: 'risk-elimination', enterpriseName: '页面测试-风险消除', riskIndicator: '测试指标', riskContent: '测试内容', riskLevel: '2', operationStatus: state.elimination ? 6 : 1, planStepState: 4, indicatorSource: 0 },
    ] } } })
    if (url.pathname.includes('OperationLog') || url.pathname.includes('disposalplanstep')) return route.fulfill({ json: { code: 0, data: { list: [] } } })
    if (url.pathname.endsWith('/description') || url.pathname.endsWith('/confirm') || url.pathname.endsWith('/elimination')) {
      state.requests.push(JSON.parse(request.postData() || '{}'))
      if (url.pathname.endsWith('/description')) state.description = true
      if (url.pathname.endsWith('/elimination')) state.elimination = true
      if (url.pathname.endsWith('/confirm')) state.confirmation = true
      return route.fulfill({ json: { code: 0, msg: 'success', data: null } })
    }
    return route.fulfill({ json: { code: 0, data: {} } })
  }
}

test.beforeEach(async ({ page }) => {
  const state: State = { description: false, confirmation: false, elimination: false, requests: [] }
  await page.addInitScript(() => localStorage.setItem('risk-monitor-logged-in', '1'))
  await page.route('**/api/**', apiState(state))
  await page.goto('/#/riskMonitor/info')
  await expect(page.getByText('页面测试-情况描述')).toBeVisible()
  await page.evaluate((value) => { (window as Window & { __riskTestState?: unknown }).__riskTestState = value }, state)
})

test('情况描述：准备待描述风险后，通过页面填写并提交', async ({ page }) => {
  const row = page.locator('tr', { hasText: '页面测试-情况描述' })
  await row.locator('a', { hasText: '情况描述' }).click()
  await page.getByPlaceholder('请输入发生原因').fill('页面填写的发生原因')
  await page.getByText('是', { exact: true }).last().click()
  await page.getByPlaceholder('请输入报备内容').fill('已报备集团')
  const request = page.waitForRequest('**/api/supervise/risk/risk-description/description')
  await page.getByRole('button', { name: '提交' }).click()
  await expect(JSON.parse((await request).postData() || '{}')).toMatchObject({ occurrenceReason: '页面填写的发生原因', reportedToGroup: 1, reportContent: '已报备集团' })
  await expect(page.getByText('情况描述', { exact: true })).toHaveCount(0)
})

test('风险确认：准备未确认风险后，通过页面确认是风险', async ({ page }) => {
  const row = page.locator('tr', { hasText: '页面测试-风险确认' })
  await row.locator('a', { hasText: '风险确认' }).click()
  await page.getByPlaceholder('补充说明').fill('页面确认风险')
  const request = page.waitForRequest('**/api/supervise/risk/risk-confirmation/confirm')
  await page.getByRole('button', { name: '提交' }).click()
  await expect(JSON.parse((await request).postData() || '{}')).toMatchObject({ isRisk: true, remark: '页面确认风险' })
  await expect(page.getByText('确认待审核', { exact: true })).toBeVisible()
})

test('风险消除：准备已确认且处置完成的风险后，通过页面提交消除', async ({ page }) => {
  const row = page.locator('tr', { hasText: '页面测试-风险消除' })
  await row.locator('a', { hasText: '风险消除' }).click()
  await page.getByPlaceholder('请输入理由').fill('处置已完成，申请消除')
  const request = page.waitForRequest('**/api/supervise/risk/risk-elimination/elimination')
  await page.getByRole('button', { name: '提交' }).click()
  await expect(JSON.parse((await request).postData() || '{}')).toMatchObject({ reason: '处置已完成，申请消除' })
  await expect(page.getByText('消除待审核', { exact: true })).toBeVisible()
})

test('情况描述：未填写发生原因时阻止提交并显示校验提示', async ({ page }) => {
  const row = page.locator('tr', { hasText: '页面测试-情况描述' })
  await row.locator('a', { hasText: '情况描述' }).click()
  await page.getByRole('button', { name: '提交' }).click()
  await expect(page.getByText('请填写发生原因')).toBeVisible()
})

test('筛选和重置：企业名称作为查询条件发送，并可清空表单', async ({ page }) => {
  const input = page.getByPlaceholder('请输入企业名称').last()
  await input.fill('筛选企业')
  const request = page.waitForRequest(request => request.url().includes('/api/supervise/risk/page') && request.url().includes('enterpriseName=%E7%AD%9B%E9%80%89%E4%BC%81%E4%B8%9A'))
  await page.getByRole('button', { name: '查询', exact: true }).click()
  await request
  await page.getByRole('button', { name: '重置', exact: true }).click()
  await expect(input).toHaveValue('')
})

test('分页：点击第二页后按 pageNum=2 重新查询', async ({ page }) => {
  const request = page.waitForRequest(request => request.url().includes('/api/supervise/risk/page') && request.url().includes('pageNum=2'))
  await page.getByRole('button', { name: '2', exact: true }).click()
  await request
  await expect(page.getByRole('button', { name: '2', exact: true })).toHaveClass(/page-current/)
})

test('详情与取消：弹窗展示风险内容和操作记录，取消不提交数据', async ({ page }) => {
  const row = page.locator('tr', { hasText: '页面测试-情况描述' })
  await row.locator('a', { hasText: '详情' }).click()
  const dialog = page.getByRole('dialog', { name: '风险详情' })
  await expect(dialog.getByText('页面测试-情况描述')).toBeVisible()
  await expect(dialog.getByText('测试内容')).toBeVisible()
  await expect(dialog.getByText('暂无数据')).toBeVisible()
  await dialog.getByRole('button', { name: '确定' }).click()
  await expect(dialog).toHaveCount(0)
  await row.locator('a', { hasText: '情况描述' }).click()
  await page.getByRole('button', { name: '取消' }).click()
  await expect(page.getByRole('dialog', { name: '情况描述' })).toHaveCount(0)
})

test('新增风险：企业名称支持中文输入法最终值', async ({ page }) => {
  await page.getByRole('button', { name: '＋ 新增' }).click()
  const dialog = page.getByRole('dialog', { name: '新增风险信息' })
  const enterpriseInput = dialog.getByPlaceholder('请输入企业名称')
  await enterpriseInput.click()
  await enterpriseInput.pressSequentially('青岛华通测试企业有限公司')
  await expect(enterpriseInput).toHaveValue('青岛华通测试企业有限公司')
})

test('风险信息检索：企业名称支持逐字中文输入并传给查询接口', async ({ page }) => {
  const input = page.getByPlaceholder('请输入企业名称').last()
  await input.click()
  await input.pressSequentially('青岛华通测试企业有限公司')
  await expect(input).toHaveValue('青岛华通测试企业有限公司')
  const request = page.waitForRequest(request => request.url().includes('/api/supervise/risk/page') && request.url().includes('enterpriseName=%E9%9D%92%E5%B2%9B%E5%8D%8E%E9%80%9A'))
  await page.getByRole('button', { name: '查询', exact: true }).click()
  await request
})

test('处置计划：保存时调用计划创建接口', async ({ page }) => {
  const row = page.locator('tr', { hasText: '页面测试-风险消除' })
  await row.locator('a', { hasText: '处置计划' }).click()
  const dialog = page.getByRole('dialog', { name: '制定处置计划' })
  await dialog.getByPlaceholder('请输入计划总目标').fill('完成测试处置')
  await dialog.locator('input[type="date"]').first().fill('2026-08-31')
  await dialog.getByPlaceholder('请输入内容').fill('完成第一步')
  await dialog.locator('input[type="date"]').last().fill('2026-08-24')
  const request = page.waitForRequest('**/api/supervise/risk/risk-elimination/disposal-plans')
  await dialog.getByRole('button', { name: '保存' }).click()
  await expect(JSON.parse((await request).postData() || '{}')).toMatchObject({ target: '完成测试处置', deadline: '2026-08-31', steps: [{ content: '完成第一步', plannedAt: '2026-08-24' }] })
})
