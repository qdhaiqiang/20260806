from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak,
    KeepTogether,
)

ROOT = Path('/Users/mahaiqiang/git/redcreation/20260807')
OUT = ROOT / 'output/pdf/progress-report-20260807.pdf'
ASSETS = ROOT / 'docs/progress-assets'

pdfmetrics.registerFont(TTFont('PDF-CN', str(ROOT / 'tmp/pdfs/STHeitiSC.ttf')))

NAVY = colors.HexColor('#16233B')
BLUE = colors.HexColor('#1976D2')
PALE_BLUE = colors.HexColor('#EAF3FF')
MUTED = colors.HexColor('#65738B')
LINE = colors.HexColor('#E6EBF3')
GREEN = colors.HexColor('#107153')
AMBER = colors.HexColor('#9B5C00')

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='TitleCN', fontName='PDF-CN', fontSize=25, leading=34, textColor=colors.white, spaceAfter=8))
styles.add(ParagraphStyle(name='HeroText', fontName='PDF-CN', fontSize=10.5, leading=17, textColor=colors.white))
styles.add(ParagraphStyle(name='H2CN', fontName='PDF-CN', fontSize=16, leading=24, textColor=NAVY, spaceBefore=5, spaceAfter=12))
styles.add(ParagraphStyle(name='H3CN', fontName='PDF-CN', fontSize=11.5, leading=18, textColor=NAVY, spaceAfter=4))
styles.add(ParagraphStyle(name='BodyCN', fontName='PDF-CN', fontSize=9.3, leading=16, textColor=NAVY))
styles.add(ParagraphStyle(name='SmallCN', fontName='PDF-CN', fontSize=8, leading=12, textColor=MUTED))
styles.add(ParagraphStyle(name='Metric', fontName='Helvetica-Bold', fontSize=22, leading=26, textColor=BLUE, alignment=TA_CENTER))
styles.add(ParagraphStyle(name='MetricLabel', fontName='PDF-CN', fontSize=8.2, leading=12, textColor=MUTED, alignment=TA_CENTER))
styles.add(ParagraphStyle(name='FooterCN', fontName='PDF-CN', fontSize=7.5, leading=10, textColor=MUTED, alignment=TA_CENTER))


def p(text, style='BodyCN'):
    return Paragraph(text, styles[style])


def bullet(text):
    return Paragraph(f'• {text}', styles['BodyCN'])


def page_number(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.line(18 * mm, 13 * mm, A4[0] - 18 * mm, 13 * mm)
    canvas.setFont('PDF-CN', 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawCentredString(A4[0] / 2, 8 * mm, f'穿透式监管平台 - 2026-08-07 进度汇报 - 第 {doc.page} 页')
    canvas.restoreState()


def metric(value, label):
    return [p(value, 'Metric'), p(label, 'MetricLabel')]


def screenshot_block(filename, caption):
    image = Image(str(ASSETS / filename), width=170 * mm, height=106.25 * mm)
    image.hAlign = 'CENTER'
    table = Table([[image], [p(caption, 'SmallCN')]], colWidths=[174 * mm])
    table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.5, LINE),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#FBFCFE')),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    return table


story = []

hero = Table([[
    [p('DAILY DELIVERY UPDATE · 2026 / 08 / 07', 'HeroText'),
     p('穿透式监管平台｜当日进度汇报', 'TitleCN'),
     p('统计口径：今日 09:00 至 15:00。当前已形成可启动的本地前端、风险信息业务界面及本地 API 兼容实现。', 'HeroText'),
     Spacer(1, 6),
     p('报告生成：2026-08-07 15:00　｜　前端：React + Vite　｜　后端：Clojure + SQLite', 'HeroText')]
]], colWidths=[174 * mm])
hero.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#1976D2')),
    ('LEFTPADDING', (0, 0), (-1, -1), 14 * mm),
    ('RIGHTPADDING', (0, 0), (-1, -1), 14 * mm),
    ('TOPPADDING', (0, 0), (-1, -1), 12 * mm),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 12 * mm),
]))
story.extend([hero, Spacer(1, 10 * mm)])

metrics = [
    metric('5,867', '前端有效代码'), metric('690', '后端代码行数'), metric('9', '本次开发页面（独立路由）'),
    metric('14', '本次开发的业务弹窗类型'), metric('32', '本地 API 接口（方法 + 路径）'), metric('6', '报告收录的本地运行截图'),
]
metric_rows = [[metrics[0], metrics[1], metrics[2]], [metrics[3], metrics[4], metrics[5]]]
metric_table = Table(metric_rows, colWidths=[58 * mm, 58 * mm, 58 * mm])
metric_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.white),
    ('BOX', (0, 0), (-1, -1), 0.5, LINE),
    ('INNERGRID', (0, 0), (-1, -1), 0.5, LINE),
    ('LEFTPADDING', (0, 0), (-1, -1), 6), ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 9), ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
]))
story.extend([metric_table, Spacer(1, 9 * mm), p('本次开发规模', 'H2CN')])

scale_data = [
    [p('<b>页面：9 个</b><br/>首页、股权结构、风险监控（风险信息）、风险报告、统计分析、系统管理、企业管理、指标管理、待审核。首页 #/ 与 #/index 为同一页面，未重复计数。'),
     p('<b>弹窗：14 类</b><br/>风险监控 6 类；企业/指标维护 5 类；待审核 3 类。')],
    [p('<b>接口：32 个</b><br/>覆盖登录、企业/指标管理、风险查询、导出、审核及风险闭环操作；同一路径不同请求方法分别计数。'),
     p('<b>代码行数</b><br/>前端有效代码 5,867 行；后端代码 690 行。统计排除依赖、构建产物、文档与静态素材。')],
]
scale = Table(scale_data, colWidths=[87 * mm, 87 * mm])
scale.setStyle(TableStyle([
    ('BOX', (0, 0), (-1, -1), 0.5, LINE), ('INNERGRID', (0, 0), (-1, -1), 0.5, LINE),
    ('BACKGROUND', (0, 0), (-1, -1), colors.white),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('LEFTPADDING', (0, 0), (-1, -1), 8), ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8), ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))
story.extend([scale, Spacer(1, 8 * mm), p('本日完成内容', 'H2CN')])

completed = [
    '<b>本地前端骨架与首页：</b>完成平台顶部导航、企业检索入口、风险等级卡片和风险直达入口，并接入本地静态素材。',
    '<b>风险信息核心工作台：</b>完成左侧分类导航、筛选栏、风险列表、分页以及状态化操作入口。',
    '<b>管理与统计页面框架：</b>已落地股权结构、风险报告、统计分析、系统管理及待审核等主菜单/二级菜单对应页面框架和表格展示结构。',
    '<b>本地 API 兼容层：</b>补齐登录、风险分页/导出/审核、企业和指标管理，以及风险描述、确认审核、处置计划等接口路由。',
    '<b>风险闭环规格沉淀：</b>新增风险信息操作列规格，记录详情、指标全景、处置计划、风险确认/消除、情况描述等交互与接口契约。',
]
for item in completed:
    story.extend([bullet(item), Spacer(1, 2.4 * mm)])

story.extend([Spacer(1, 4 * mm), p('下一步主要工作（预计 1 天）', 'H2CN')])
next_steps = [
    '<b>主任务：</b>依据《核心风险处理开发说明》，在“风险监控 → 风险信息”中按风险主状态与处置状态限制可用操作，避免越级操作或终态后仍可继续流转。',
    '覆盖情况描述、风险确认、确认审核、处置计划、处置完成审核、风险消除及风险等级调整等节点；按钮可见性、弹窗提交和接口校验保持一致。',
    '按状态矩阵逐项验证正向、驳回和终态分支，核验状态变化、操作日志及待审核入口是否正确。',
]
for item in next_steps:
    story.extend([bullet(item), Spacer(1, 2.4 * mm)])

story.append(PageBreak())
story.extend([p('运行界面证据', 'H2CN'), p('以下截图均为本地系统实际运行页面，分辨率为 1440 × 900。', 'SmallCN'), Spacer(1, 5 * mm)])

screens = [
    ('homepage-desktop-20260807.png', '图 1：本地首页。可见导航、企业查询、风险等级和风险直达区域。'),
    ('risk-module-desktop-20260807.png', '图 2：本地风险信息工作台。可见分类导航、组合筛选、风险列表、状态化操作入口与分页。'),
    ('enterprise-management-20260807.png', '图 3：企业管理。可见新增企业入口、企业列表、编辑/删除操作与分页。'),
    ('indicator-management-20260807.png', '图 4：指标管理。可见新增指标入口、指标状态、风险级别设置与分页。'),
    ('pending-review-20260807.png', '图 5：待审核（#/sys/pendingReview）。可见风险状态、风险等级变化、处置计划完成和动态调整审核入口。'),
    ('risk-report-20260807.png', '图 6：风险报告（#/riskReport）。可见季度报告筛选、报告列表和查看/编辑操作。'),
]
for index, (filename, caption) in enumerate(screens):
    story.append(screenshot_block(filename, caption))
    if index != len(screens) - 1:
        story.append(PageBreak())

doc = SimpleDocTemplate(
    str(OUT), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
    topMargin=16 * mm, bottomMargin=20 * mm, title='穿透式监管平台 - 2026-08-07 进度汇报',
)
doc.build(story, onFirstPage=page_number, onLaterPages=page_number)
print(OUT)
