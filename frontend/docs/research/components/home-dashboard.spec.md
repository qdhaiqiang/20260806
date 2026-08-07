# HomeDashboard Specification

## Overview
- Target: `src/App.tsx`
- Interaction model: click-driven navigation and risk cards.

## Computed styles
- Header: 40px high; white background; menu 16px/24px, padding 24px 34px, active background `rgba(2,144,249,.08)`, radius 6px.
- Hero: `up_back-B_kR-02H.png` at 100% 100%, height 272px after the header.
- Dashboard: 1152px wide, margin-top -77px, background `homepage_back-C4LWuZQX.png`, radius 14px.
- Risk strips: 358px x 68px; radius 8px; green `#ddfaf2 → #f5fffd`, amber `#fff3e3 → #fff8ef`, red `#ffe5e5 → #fff6f6`.
- Direct cards: 269px x 63px desktop, white, radius 12px; grid gap 20px horizontally and 19px vertically.

## Content
- Heading: 华企通穿透式监管平台，精准洞察企业风险
- Levels: 低风险 55 / 内部 32 / 外部 23; 中风险 210 / 内部 90 / 外部 120; 高风险 192 / 内部 87 / 外部 105.
- 12 direct-risk titles and counts are represented verbatim in `src/App.tsx`.

## Responsive behavior
- Desktop uses a 4-column risk grid and 3-column risk strip layout.
- Below 900px risk strips become one column; below 680px cards become one column and header permits horizontal scrolling.
