# C4 架构文档

本目录包含 1:1 风险监管克隆项目的完整 C4 模型文档集合。

## 结构

```
C4-Documentation/
├── c4-context.md                          # 系统上下文、角色、用户旅程
├── c4-container.md                        # 容器与 API 概览
├── c4-component.md                          # 组件索引
├── c4-component-risk-web-api.md           # Web/API 组件
├── c4-component-risk-workflow-domain.md   # 工作流领域组件
├── c4-component-risk-api-infrastructure.md # 数据库基础设施组件
├── c4-component-risk-frontend-shell.md      # 前端组件
├── c4-code-*.md                           # 代码级文档（已合并为关键目录）
└── apis/
    └── backend-api.yaml                     # 后端 API 的 OpenAPI 3.1 规范
```

## 阅读顺序

1. `c4-context.md` – 了解系统的用途、使用者及外部依赖。
2. `c4-container.md` – 查看运行时容器与部署模型。
3. `c4-component.md` – 浏览逻辑组件及其关系。
4. `c4-code-*.md` – 深入每个关键目录的代码级细节。
5. `apis/backend-api.yaml` – 审阅 REST API 契约。

## 代码级文档说明

第四层代码级文档仅保留包含实际架构价值的目录：根目录、后端、后端核心源码、前端、文档。资源目录、构建产物、空设计参考目录、PPT 演示文稿等仅作为资产/产物，不再单独成文，而是在父目录文档中简要说明。

## 验证

- 前端构建：`cd frontend && npm run build` ✅
- 后端测试：`cd backend && clojure -M:test` ✅
- OpenAPI 规范已通过 YAML 解析器验证 ✅
