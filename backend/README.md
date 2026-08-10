# 风险监管本地 API

本服务读取仓库根目录的 `test1.sqlite`，用于替换原 `172.16.40.152:8101` 的前端调用。

```sh
cd backend
clojure -M:run
```

默认监听 `http://localhost:8101`。可用 `PORT` 覆盖端口，使用 `RISK_API_DB` 覆盖 SQLite 路径：

```sh
PORT=8102 RISK_API_DB=/absolute/path/test1.sqlite clojure -M:run
```

服务只使用 `test1.sqlite` 中既有表，不执行建表、迁移或任何 DDL。接口契约见 `docs/API兼容与风险闭环接口.md`。
