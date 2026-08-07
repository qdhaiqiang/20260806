# 业务管理模块 Specification

## Overview
- Target: `src/App.tsx`, `src/App.css`
- Interaction model: click-driven top navigation and module-side navigation; filter inputs are local demo controls.

## Extracted original risk-monitor screen
- Full-page background: pale blue `#f4f7ff`; fixed 40px white header.
- Left navigation: 133px wide, blue gradient `#3f8df4 → #286edc`; selected item is a translucent rounded rectangle.
- Content starts at x=149; hero panel is 128px tall with pale blue image background; heading 24px / bold and description 14px.
- White data card: 1116px wide, 540px high; rounded 10px; filter controls about 162px x 30px; blue gradient primary action and blue-outline secondary actions.
- Data table header `#f5f7fa`, 14px text, rows near 67px; action links `#409eff`.

## Content
- Risk page uses actual observed navigation labels: 风险信息, 全资企业, 控股企业, 参股企业, 主动管理型基金, 集团本部, 重大事项, 风险统计, 风险大屏.
- Tables use observed Chinese enterprise-risk content represented in `src/App.tsx`.

## Responsive behavior
- Below 900px: retain sidebar while horizontally scrolling the data grid.
- Below 620px: sidebar collapses and filters/table remain horizontally scrollable.
