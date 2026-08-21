# C4 代码级文档：docs/research/components

## 1. 概述

- **名称**：组件研究规格
- **描述**：从原系统提取的单个风险相关 UI 组件（确认对话框、处置计划对话框、录入对话框、操作链接）的详细规格。
- **位置**：`docs/research/components/`
- **语言**：Markdown
- **用途**：定义前端克隆的组件行为、布局与状态。

## 2. 文件

- `risk-confirm-dialog.spec.md`
- `risk-disposal-plan-dialog.spec.md`
- `risk-entry-dialog.spec.md`
- `risk-info-actions.spec.md`

## 3. 代码元素

无可执行代码。仅 Markdown 规格文件。

## 4. 依赖

- **内部依赖**：无
- **外部依赖**：无

## 5. 关系

这些规格指导 `frontend/src/App.tsx` 与 `frontend/src/App.css` 的实现。
