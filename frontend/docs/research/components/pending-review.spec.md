# PendingReview Specification

## Overview
- Target: `src/App.tsx` / `src/App.css`
- Interaction model: click-driven tabs, row actions and audit modal.

## Extracted states
- Four tabs: 风险状态审核、风险等级变化审核、处置计划完成审核、动态调整审核.
- First three tabs use risk review columns; the plan-completion tab adds `处置进度`.
- Dynamic adjustment uses: 操作对象、操作类型、对象数据、处理状态、来源、系统推送时间、操作.
- Row operations: 详情、指标全景、审核. `审核` opens a dialog with 同意/不同意, 原因 and 确定/取消.

## Computed style highlights
- Left blue sidebar is 133px wide; selected entry has translucent blue background.
- Content card is white, tabs use 14px text and blue active underline.
- Table header is `#f5f7fa`; action links are `#409eff`; audit status uses yellow dot.
