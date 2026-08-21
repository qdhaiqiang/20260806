# C4 代码级文档：docs

## 1. 概述

- **名称**：项目文档
- **描述**：包含参考文档、进度截图、原始建设方案以及 UI 组件研究规格。
- **位置**：`docs/`
- **语言**：Markdown、HTML、CSS、JavaScript、images
- **用途**：存放从原系统提取的设计参考、规格说明与进度交付物。

## 2. 关键文件

- `核心风险处理.md` – 核心风险处理规则与状态机。
- `AI-efficiency-report-20260812.md` – AI 效率报告。
- `开发建设方案.docx` – 原始建设方案文档。
- `progress-report-20260807.html` – 进度报告页面。

## 3. 子目录速览

| 目录 | 用途 | 备注 |
|------|------|------|
| `research/` | 组件级研究规格 | 含 `components/` 下的风险对话框/操作规格 |
| `research/components/` | 风险确认、处置计划、录入、操作等 UI 规格 | 详见 `c4-code-docs-research-components.md` |
| `progress-assets/` | 已实现页面截图 | PNG 产物 |
| `design-references/` | 设计参考文件 | 当前为空 |
| `ppt/ai-capability-pitch/` | HTML/CSS/JS 演示文稿及渲染幻灯片 | 与风险监管应用无直接运行时关系 |
| `renren-security.zip` | 外部产物 | 非运行代码 |

## 4. 代码元素

无可执行应用代码。`ppt/ai-capability-pitch/` 目录包含用于演示文稿的静态 HTML/CSS/JS，但不属于风险监管运行系统。

## 5. 依赖

- **内部依赖**：无
- **外部依赖**：无

## 6. 关系

`docs/` 目录供开发者阅读，运行中的应用不会使用它。
