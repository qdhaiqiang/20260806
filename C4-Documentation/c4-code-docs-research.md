# C4 代码级文档：docs/research

## 1. 概述

- **名称**：研究文档
- **描述**：从原系统提取的组件级研究规格，包括对话框与操作规格。
- **位置**：`docs/research/`
- **语言**：Markdown
- **用途**：为 1:1 克隆实现捕获 UI/UX 细节。

## 2. 文件 / 目录

- `components/`
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

研究文档为 `frontend/src/App.tsx` 与 `frontend/src/App.css` 提供输入。
