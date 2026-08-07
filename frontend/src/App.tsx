import { useEffect, useState } from "react";
import "./App.css";

const A = "/assets/";
const nav = [
  "首页",
  "股权结构",
  "风险监控",
  "风险报告",
  "统计分析",
  "系统管理",
];
const levels = [
  ["低风险", "55", "32", "23", "low_risk_icon-D4_C055t.png", "low"],
  ["中风险", "210", "90", "120", "mid_risk_icon-BulC-leb.png", "mid"],
  ["高风险", "192", "87", "105", "high_risk_icon-piGds6KV.png", "high"],
];
const risks = [
  ["主体资质与工商管控风险", "64", "zhutizizhi-pzcQPxh-.png"],
  ["股权穿透与股东管控风险", "48", "guquanchuantou-BamKky2W.png"],
  ["治理与人员管控风险", "49", "zhiliyurenyuan-mhOARYXp.png"],
  ["法律与司法涉诉风险", "249", "falvyusifa-VJ5Pfu7P.png"],
  ["行政处罚与合规惩戒风险", "9", "xingzhengchufa-CZjOnGFA.png"],
  ["经营运营与资质合规风险", "29", "yunyingjingying-C0YAAqoe.png"],
  ["招投标与关联交易管控风险", "0", "zhaotoubiao-CUk92NY5.png"],
  ["投资与资本运作管控风险", "3", "touziyuziben-zcWl4FvG.png"],
  ["财务与资金管控风险", "2", "caiwuyuzijin-ms625Hr4.png"],
  ["资产与知识产权管控风险", "0", "zichanzhishi-3fUn3L9U.png"],
  ["安全环保与特殊行业管控风险", "0", "anquanhuanbao-DMO2rvIe.png"],
  ["关联与舆情穿透管控风险", "4", "guanlianyuyuqing-Bh7f2dda.png"],
];

function Header({
  active,
  setActive,
}: {
  active: string;
  setActive: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="brand">
        <i className="brand-logo" />
        <b>华企通穿透式监管平台</b>
        <span className="divider" />
        <div className="menus">
          {nav.map((item) => (
            <button
              className={active === item ? "menu active" : "menu"}
              key={item}
              onClick={() => setActive(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="tools">
        <button
          className="bell-button"
          aria-label="待审核"
          onClick={() => {
            window.location.hash = "#/sys/pendingReview";
          }}
        >
          <i className="bell" />
        </button>
        <button className="user" onClick={() => setOpen(!open)}>
          <i className="avatar" />
          管理员
          <i className="chevron" />
        </button>
        {open && (
          <div className="dropdown">
            <button>▣　修改密码</button>
            <button>↪　退出登录</button>
          </div>
        )}
      </div>
    </header>
  );
}

function Home() {
  const [company, setCompany] = useState("");
  return (
    <main className="home">
      <section className="hero">
        <h1>华企通穿透式监管平台，精准洞察企业风险</h1>
        <div className="search">
          <i />
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="请输入企业名称"
          />
          <button>查一下</button>
        </div>
      </section>
      <section className="dashboard">
        <h2>风险等级</h2>
        <div className="levels">
          {levels.map(([name, total, inside, outside, icon, tone]) => (
            <article className={`level ${tone}`} key={name}>
              <img src={A + icon} />
              <div>
                <strong>{name}</strong>
                <b>{total}</b>
              </div>
              <span />
              <div className="sub">
                内部<b>{inside}</b>
              </div>
              <span />
              <div className="sub">
                外部<b>{outside}</b>
              </div>
            </article>
          ))}
        </div>
        <h2 className="risk-title">风险直达</h2>
        <div className="risk-grid">
          {risks.map(([name, count, icon]) => (
            <button className="risk" key={name}>
              <img src={A + icon} />
              <span>
                {name}
                <b>{count}</b>
              </span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function Equity() {
  return (
    <main className="module">
      <aside>
        <h2>组织架构</h2>
        <div className="tree-search">请输入企业名称搜索　⌕</div>
        <div className="tree">
          ⌄　青岛华通国有资本投资运营集团有限公司
          <br />
          　⌄　青岛市经济开发投资有限责任公司
          <br />
          　　⌄　青岛汇友经开企业管理有限责任公司
          <br />
          　　　⌄　青岛汇友中小企业资产管理有限责任公司
          <br />
          　　　　海南汇友投资有限公司
          <br />
          　　青岛市产品质量检验技术研究所
          <br />
          　　青岛市技术标准科学研究所
          <br />
          　⌄　青岛弘信公司
          <br />
          　　青岛弘信物业管理有限公司
          <br />
          　⌄　青岛联合通用航空产业发展有限责任公司
          <br />
          　　⌄　青岛联合通用航空有限公司
          <br />
          　　　空中客车直升机（青岛）有限公司
          <br />
          　⌄　青岛华通资产管理有限责任公司
          <br />
          　　青岛海丰源置业有限公司
          <br />
          　　青岛正通企业管理有限公司
          <br />
          　　青岛华清经开企业管理有限公司
        </div>
      </aside>
      <section className="workspace" />
    </main>
  );
}

const reportRows = [
  [
    "2026-03-30（周一）",
    "华通创投当前季度报告",
    "高风险 0 / 中风险 0 / 低风险 0",
    "事件状态.docx",
  ],
  [
    "2026-03-30（周一）",
    "托管中心当前季度报告",
    "高风险 2 / 中风险 1 / 低风险 0",
    "数据集团当前季度报告.docx",
  ],
  [
    "2026-03-30（周一）",
    "华盈通商当前季度报告",
    "高风险 0 / 中风险 0 / 低风险 0",
    "无标题1.sql",
  ],
];
const monitorRows = [
  [
    "失信被执行人",
    "法律风险指标",
    "高风险",
    "企业被列入失信被执行人名单",
    "启用",
  ],
  [
    "限制高消费",
    "法律风险指标",
    "中风险",
    "企业法定代表人存在限制高消费信息",
    "启用",
  ],
  ["行政处罚", "经营风险指标", "中风险", "企业存在行政处罚记录", "启用"],
  ["股权冻结", "经营风险指标", "高风险", "股东持有股权被冻结", "启用"],
  ["税务异常", "财务风险指标", "低风险", "企业存在税务异常信息", "启用"],
];
const systemRows = [
  ["统一社会信用代码", "主体资质与工商管控风险", "基础信息", "启用"],
  ["企业经营异常", "经营运营与资质合规风险", "经营风险", "启用"],
  ["司法涉诉案件", "法律与司法涉诉风险", "法律风险", "启用"],
  ["被执行人信息", "法律与司法涉诉风险", "法律风险", "启用"],
];
const secondary: Record<string, string[]> = {
  风险监控: [
    "风险信息",
    "全资企业",
    "控股企业",
    "参股企业",
    "主动管理型基金",
    "集团本部",
    "重大事项",
    "风险统计",
    "风险大屏",
  ],
  风险报告: ["季报", "年报"],
  统计分析: [
    "工作评价",
    "部门排名",
    "日常工作跟踪",
    "风险确认情况",
    "计划执行情况",
  ],
  系统管理: [
    "企业管理",
    "指标管理",
    "用户管理",
    "权限管理",
    "推送管理",
    "推送设置",
    "推送记录",
    "系统配置",
  ],
};

function SideMenu({
  name,
  page,
  setPage,
}: {
  name: string;
  page: string;
  setPage: (v: string) => void;
}) {
  if (name === "统计分析")
    return <StatisticsSideMenu page={page} setPage={setPage} />;
  return (
    <aside className="side-menu">
      <div className="side-heading">{name}</div>
      {secondary[name].map((item, i) => (
        <button
          key={item}
          onClick={() => setPage(item)}
          className={page === item ? "side-item selected" : "side-item"}
        >
          <i className={`side-dot d${i}`} />
          {item}
          <span>›</span>
        </button>
      ))}
    </aside>
  );
}
function StatisticsSideMenu({
  page,
  setPage,
}: {
  page: string;
  setPage: (v: string) => void;
}) {
  const [evaluationOpen, setEvaluationOpen] = useState(true);
  const [trackingOpen, setTrackingOpen] = useState(true);
  const group = (label: string, open: boolean, toggle: () => void) => (
    <button className="statistics-parent" onClick={toggle}>
      <i />
      {label}
      <span className={open ? "expanded" : ""}>⌃</span>
    </button>
  );
  const child = (label: string) => (
    <button
      className={`statistics-child ${page === label ? "selected" : ""}`}
      onClick={() => setPage(label)}
    >
      <i />
      {label}
    </button>
  );
  return (
    <aside className="side-menu statistics-side">
      {group("工作评价", evaluationOpen, () =>
        setEvaluationOpen(!evaluationOpen),
      )}
      {evaluationOpen && child("部门排名")}
      {group("日常工作跟踪", trackingOpen, () =>
        setTrackingOpen(!trackingOpen),
      )}
      {trackingOpen && (
        <>
          {child("风险确认情况")}
          {child("计划执行情况")}
        </>
      )}
    </aside>
  );
}
type CascadeItem = { label: string; children?: string[] };
function PendingCascader({ placeholder, value, items, onChange }: { placeholder: string; value: string; items: CascadeItem[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false); const [active, setActive] = useState(0);
  const current = items[active]; const choose = (next: string) => { onChange(next); setOpen(false) };
  return <div className="pending-cascader"><button type="button" className={open ? 'open' : ''} onClick={() => setOpen(!open)}>{value || placeholder}<span>⌃</span></button>{open && <div className={`cascade-menu ${current.children ? 'two-col' : ''}`}><div className="cascade-parent">{items.map((item, index) => <button key={item.label} className={index === active ? 'active' : ''} onMouseEnter={() => setActive(index)} onClick={() => item.children ? setActive(index) : choose(item.label)}><i />{item.label}{item.children && <b>›</b>}</button>)}</div>{current.children && <div className="cascade-child">{current.children.map(item => <button key={item} onClick={() => choose(item)}><i />{item}</button>)}</div>}</div>}</div>
}
function FilterBar({ label = "请输入企业名称" }: { label?: string }) {
  const [text, setText] = useState("");
  return (
    <div className="filterbar">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={label}
      />
      <select defaultValue="">
        <option value="">全部风险等级</option>
        <option>高风险</option>
        <option>中风险</option>
        <option>低风险</option>
      </select>
      <button className="primary">查询</button>
      <button>重置</button>
    </div>
  );
}
type RiskRecord = {
  id: string;
  enterpriseName?: string;
  enterpriseGroup?: string;
  belongingPlateId?: string;
  riskIndicator?: string;
  riskContent?: string;
  riskLevel?: string;
  riskType?: string;
  operationStatus?: number;
  occurTime?: string;
};
const riskGroups: Record<string, string> = {
  supv_enterprise_type_participation_comp: "主动管理型基金参股企业",
  supv_enterprise_type_participation: "参股企业",
  supv_enterprise_type_wholly: "全资企业",
  supv_enterprise_type_holding: "控股企业",
};
const riskLevels: Record<string, string> = {
  "0": "低风险",
  "1": "中风险",
  "2": "高风险",
};
const riskManagers: Record<string, string> = {
  huatongChuangtou: "华通创投",
  huatongJinkong: "华通金控",
  cityIndustrialPark: "都市产业园",
};
const riskStates: Record<number, string> = {
  0: "未确认",
  1: "已确认",
  2: "已消除",
  3: "已关闭",
  4: "确认待审核",
  5: "关闭待审核",
  6: "消除待审核",
};
function RiskInfoView() {
  const [rows, setRows] = useState<RiskRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enterpriseName, setEnterpriseName] = useState("");
  const [level, setLevel] = useState("");
  const [enterpriseGroup, setEnterpriseGroup] = useState("");
  const [riskType, setRiskType] = useState("");
  const [operationStatus, setOperationStatus] = useState("");
  const [department, setDepartment] = useState("");
  const [manager, setManager] = useState("");
  const [source, setSource] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [jump, setJump] = useState("1");
  const load = async (nextPage = page) => {
    setLoading(true);
    try {
      const login = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid: crypto.randomUUID(),
          username: "admin",
          password: "admin",
        }),
      }).then((r) => r.json());
      const token = login?.data?.token;
      if (!token) throw new Error(login?.msg || "登录失败");
      const params = new URLSearchParams({
        pageNum: String(nextPage),
        pageSize: "10",
      });
      if (enterpriseName.trim())
        params.set("enterpriseName", enterpriseName.trim());
      if (level) params.set("riskLevel", level);
      if (enterpriseGroup) params.set("enterpriseGroup", enterpriseGroup);
      if (riskType) params.set("riskType", riskType);
      if (operationStatus) params.set("operationStatus", operationStatus);
      if (department) params.set("department", department);
      if (manager) params.set("belongingPlateId", manager);
      if (source) params.set("indicatorSource", source);
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      const result = await fetch(`/api/supervise/risk/page?${params}`, {
        headers: { Authorization: `Bearer ${token}`, token },
      }).then((r) => r.json());
      if (result.code !== 0) throw new Error(result.msg || "读取失败");
      setRows(result.data?.list || []);
      setTotal(Number(result.data?.total || 0));
      setPage(nextPage);
    } catch (error) {
      console.error(error);
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load(1);
  }, []);
  const reset = () => {
    setEnterpriseName("");
    setLevel("");
    setEnterpriseGroup(""); setRiskType(""); setOperationStatus(""); setDepartment(""); setManager(""); setSource(""); setStartDate(""); setEndDate("");
    setPage(1);
    setJump("1");
    setTimeout(() => void load(1), 0);
  };
  const exportRisks = async () => {
    try {
      const login = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uuid: crypto.randomUUID(), username: 'admin', password: 'admin' }) }).then(r => r.json());
      const token = login?.data?.token;
      const response = await fetch('/api/supervise/risk/export', { headers: { Authorization: `Bearer ${token}`, token } });
      if (!response.ok) throw new Error('导出失败');
      const blob = await response.blob(); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = '风险信息.xlsx'; link.click(); URL.revokeObjectURL(url);
    } catch (error) { console.error('风险信息导出失败', error); }
  };
  const pageCount = Math.max(1, Math.ceil(total / 10));
  const pager = [1, 2, 3, 4, 5, 6, "…", pageCount].filter(
    (x, index, all) => all.indexOf(x) === index,
  );
  const goTo = (value: number) => {
    const target = Math.min(pageCount, Math.max(1, value));
    setJump(String(target));
    void load(target);
  };
  return (
    <main className="module-page risk-info-page">
      <aside className="side-menu risk-side">
        <div className="side-heading selected">▣　风险信息</div>
        {["全资企业", "控股企业", "参股企业", "主动管理型基金", "集团本部"].map(
          (x) => (
            <button className="side-item" key={x}>
              {x}
            </button>
          ),
        )}
        <div className="side-heading">⬟　重大事项</div>
        <div className="side-heading">▦　风险统计</div>
        <div className="side-heading">▣　风险大屏</div>
      </aside>
      <section className="panel">
        <div className="panel-hero risk-hero">
          <h2>风险信息</h2>
          <p>
            对全资、控股、参股、基金及基金投资企业共计379家内部企业纳入监管。
          </p>
        </div>
        <div className="risk-filter">
          <input
            value={enterpriseName}
            onChange={(e) => setEnterpriseName(e.target.value)}
            placeholder="请输入企业名称"
          />
          <PendingCascader placeholder="请选择企业分组" value={enterpriseGroup} onChange={setEnterpriseGroup} items={[{ label: '全资企业', children: ['全资企业'] }, { label: '控股企业', children: ['控股企业', '控股不控权企业', '控股不控权关联企业', '控股企业其他股东'] }, { label: '参股企业', children: ['参股企业'] }, { label: '主动管理型基金', children: ['主动管理型基金'] }, { label: '参与基金', children: ['参与基金'] }, { label: '集团本部', children: ['集团本部'] }]} />
          <PendingCascader placeholder="请选择风险类型" value={riskType} onChange={setRiskType} items={[{ label: '主体资质与工商管控风险', children: ['工商主体基础管控'] }, { label: '股权穿透与股东管控风险', children: ['股东/投资人核心管控', '股权结构管控'] }, { label: '治理与人员管控风险', children: ['治理与人员管控'] }, { label: '法律与司法涉诉风险', children: ['法律与司法涉诉'] }, { label: '行政处罚与合规惩戒风险', children: ['行政处罚与合规惩戒'] }, { label: '经营运营与资质合规风险', children: ['经营运营与资质合规'] }]} />
          <PendingCascader placeholder="请选择风险级别" value={level === '2' ? '高风险' : level === '1' ? '中风险' : level === '0' ? '低风险' : ''} onChange={v => setLevel(v === '高风险' ? '2' : v === '中风险' ? '1' : '0')} items={[{ label: '高风险' }, { label: '中风险' }, { label: '低风险' }]} />
          <PendingCascader placeholder="请选择状态" value={riskStates[Number(operationStatus)] || ''} onChange={v => setOperationStatus(String(Object.entries(riskStates).find(([, label]) => label === v)?.[0] || ''))} items={['未确认', '已确认', '已消除', '已关闭', '确认待审核', '关闭待审核', '消除待审核', '情况描述'].map(label => ({ label }))} />
          <PendingCascader placeholder="请选择主管部门" value={department} onChange={setDepartment} items={['集团本部', '战略投资中心', '法务风控部', '财务管理部', '资本运营部'].map(label => ({ label }))} />
          <PendingCascader placeholder="请选择管理主体" value={riskManagers[manager] || ''} onChange={v => setManager(Object.entries(riskManagers).find(([, label]) => label === v)?.[0] || '')} items={Object.values(riskManagers).map(label => ({ label }))} />
          <PendingCascader placeholder="请选择风险来源" value={source === '0' ? '企查查' : source === '1' ? '运营平台' : source === '2' ? '人工录入' : ''} onChange={v => setSource(v === '企查查' ? '0' : v === '运营平台' ? '1' : '2')} items={['企查查', '运营平台', '人工录入'].map(label => ({ label }))} />
          <input value={startDate} onChange={e => setStartDate(e.target.value)} type="date" aria-label="开始日期" />
          <span>至</span>
          <input value={endDate} onChange={e => setEndDate(e.target.value)} type="date" aria-label="结束日期" />
          <button className="primary" onClick={() => void load(1)}>
            查询
          </button>
          <button onClick={reset}>重置</button>
          <button onClick={() => void exportRisks()}>⇩ 导出</button>
        </div>
        <div className="risk-table-wrap">
          {loading && <div className="table-loading">拼命加载中，请稍后…</div>}
          <table className="risk-table">
            <thead>
              <tr>
                <th>序号</th>
                <th>企业名称</th>
                <th>股权结构图</th>
                <th>企业分组</th>
                <th>管理主体</th>
                <th>风险指标</th>
                <th>风险内容</th>
                <th>风险级别</th>
                <th>风险类型</th>
                <th>风险状态</th>
                <th>指标来源</th>
                <th>主管部门</th>
                <th>处置进度</th>
                <th>发生日期</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td>{(page - 1) * 10 + index + 1}</td>
                  <td className="enterprise">▰ {row.enterpriseName || "--"}</td>
                  <td>
                    <span className="structure">──┬──</span>
                  </td>
                  <td>
                    {riskGroups[row.enterpriseGroup || ""] ||
                      row.enterpriseGroup ||
                      "--"}
                  </td>
                  <td>
                    {riskManagers[row.belongingPlateId || ""] ||
                      row.belongingPlateId ||
                      "--"}
                  </td>
                  <td>{row.riskIndicator || "--"}</td>
                  <td>{row.riskContent || "--"}</td>
                  <td>
                    {riskLevels[row.riskLevel || ""] || row.riskLevel || "--"}
                  </td>
                  <td>{row.riskType || "--"}</td>
                  <td>{riskStates[row.operationStatus || 0] || "--"}</td>
                  <td>企查查</td>
                  <td>--</td>
                  <td>--</td>
                  <td>{row.occurTime || "--"}</td>
                  <td className="actions">
                    <a>详情</a>
                    <a>指标全景</a>
                    <a>处置计划</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <footer className="risk-pager">
            <span>共 {total} 条</span>
            <select>
              <option>10条/页</option>
            </select>
            <button
              className="arrow"
              disabled={page === 1}
              onClick={() => goTo(page - 1)}
            >
              ‹
            </button>
            {pager.map((item, index) =>
              item === "…" ? (
                <i key={`${item}${index}`}>…</i>
              ) : (
                <button
                  key={item}
                  className={page === item ? "page-current" : "page-number"}
                  onClick={() => goTo(Number(item))}
                >
                  {item}
                </button>
              ),
            )}
            <button
              className="arrow"
              disabled={page === pageCount}
              onClick={() => goTo(page + 1)}
            >
              ›
            </button>
            <label>
              前往{" "}
              <input
                value={jump}
                onChange={(e) => setJump(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") goTo(Number(jump));
                }}
              />{" "}
              页
            </label>
          </footer>
        </div>
      </section>
    </main>
  );
}
type SystemRow = Record<string, unknown>;
const companyGroups: Record<string, string> = {
  supv_enterprise_type_wholly: "全资企业",
  supv_enterprise_type_holding: "控股企业",
  supv_enterprise_type_participation: "参股企业",
  groupHeadquarters: "集团直管",
};
const plates: Record<string, string> = {
  groupHeadquarters: "集团本部",
  huatongChuangtou: "华通创投",
  huatongJinkong: "华通金控",
  cityIndustrialPark: "都市产业园",
};
const categoryOne: Record<string, string> = {
  supv_risk_cat_stock: "股权穿透与股东管控风险",
  supv_risk_cat_finance: "财务与资金管控风险",
};
const categoryTwo: Record<string, string> = {
  supv_risk_type_equity_structure: "股权结构管控",
  supv_risk_type_financial: "财务数据管控",
};
function SystemDataView({ kind }: { kind: "company" | "indicator" }) {
  const isCompany = kind === "company";
  const [rows, setRows] = useState<SystemRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [jump, setJump] = useState("1");
  const title = isCompany ? "企业管理" : "指标管理";
  const description = isCompany
    ? "支持对集团下属企业进行新增和维护，可按企业类型或业务版块进行分组。"
    : "提供风险监控指标全流程管理功能，支持新增监控指标、编辑指标定义、启用 / 停用指标，可按指标类型（法律风险指标 / 经营风险指标 / 财务风险指标）进行分类管理。";
  const load = async (nextPage = page) => {
    setLoading(true);
    try {
      const login = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid: crypto.randomUUID(),
          username: "admin",
          password: "admin",
        }),
      }).then((r) => r.json());
      const token = login?.data?.token;
      const query = new URLSearchParams({
        pageNum: String(nextPage),
        pageSize: "10",
      });
      if (keyword.trim())
        query.set(
          isCompany ? "enterpriseName" : "indicatorName",
          keyword.trim(),
        );
      const result = await fetch(
        `/api/supervise/${isCompany ? "enterprise" : "index"}/page?${query}`,
        { headers: { Authorization: `Bearer ${token}`, token } },
      ).then((r) => r.json());
      if (result.code !== 0) throw new Error(result.msg);
      setRows(result.data?.list || []);
      setTotal(Number(result.data?.total || 0));
      setPage(nextPage);
    } catch (error) {
      console.error(error);
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load(1);
  }, [kind]);
  const maxPage = Math.max(1, Math.ceil(total / 10));
  const pageItems = [1, 2, 3, 4, 5, 6, "…", maxPage].filter(
    (x, i, a) => a.indexOf(x) === i,
  );
  const go = (value: number) => {
    const next = Math.max(1, Math.min(maxPage, value));
    setJump(String(next));
    void load(next);
  };
  return (
    <main className="module-page system-data-page">
      <aside className="side-menu system-side">
        {[
          ["企业管理", "company"],
          ["指标管理", "indicator"],
          ["用户管理", ""],
          ["权限管理", ""],
          ["推送管理", ""],
          ["　推送设置", ""],
          ["　推送记录", ""],
          ["系统配置", ""],
        ].map(([label, id]) => (
          <button
            className={`side-item ${id === kind ? "selected" : ""}`}
            key={label}
            onClick={() => id && (window.location.hash = `#/sys/${id}`)}
          >
            {label}
          </button>
        ))}
      </aside>
      <section className="panel">
        <div
          className={`panel-hero ${isCompany ? "company-hero" : "indicator-hero"}`}
        >
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="system-toolbar">
          <button className="primary">
            ＋ 新增{isCompany ? "企业" : "指标"}
          </button>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void load(1)}
            placeholder={`请输入${isCompany ? "企业" : "指标"}名称`}
          />
          <button className="search-icon" onClick={() => void load(1)}>
            ⌕
          </button>
        </div>
        <div className="system-table-wrap">
          {loading && <div className="table-loading">拼命加载中，请稍后…</div>}
          <table className="system-table">
            <thead>
              <tr>
                {(isCompany
                  ? [
                      "序号",
                      "企业名称",
                      "所属上级企业",
                      "统一社会信用代码",
                      "企业分组",
                      "管理主体",
                      "添加日期",
                      "操作",
                    ]
                  : [
                      "序号",
                      "指标名称",
                      "指标大类",
                      "指标子类",
                      "指标状态",
                      "风险等级",
                      "指标来源",
                      "是否重大事项",
                      "添加日期",
                      "操作",
                    ]
                ).map((x) => (
                  <th key={x}>{x}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) =>
                isCompany ? (
                  <tr key={String(row.id)}>
                    <td>{(page - 1) * 10 + index + 1}</td>
                    <td className="enterprise">
                      ▰ {String(row.enterpriseName || "--")}
                    </td>
                    <td>{String(row.parentEnterprise || "--")}</td>
                    <td>{String(row.creditCode || "--")}</td>
                    <td>
                      {companyGroups[String(row.enterpriseGroup)] ||
                        String(row.enterpriseGroup || "--")}
                    </td>
                    <td>
                      {plates[String(row.belongingPlateId)] ||
                        String(row.belongingPlateId || "--")}
                    </td>
                    <td>{String(row.updateTime || row.createTime || "--")}</td>
                    <td className="actions">
                      <a>编辑</a>
                      <a className="danger">删除</a>
                    </td>
                  </tr>
                ) : (
                  <tr key={String(row.id)}>
                    <td>{(page - 1) * 10 + index + 1}</td>
                    <td>{String(row.indicatorName || "--")}</td>
                    <td>
                      {categoryOne[String(row.indicatorCategory1)] ||
                        String(row.indicatorCategory1 || "--")}
                    </td>
                    <td>
                      {categoryTwo[String(row.indicatorCategory2)] ||
                        String(row.indicatorCategory2 || "--")}
                    </td>
                    <td>
                      <em className="enabled">● 启用</em>
                    </td>
                    <td>
                      {row.riskLevelName ? String(row.riskLevelName) : "--"}
                    </td>
                    <td>
                      {Number(row.indicatorSource) === 1
                        ? "运营平台"
                        : "企查查"}
                    </td>
                    <td>{row.importantMatter ? "是" : "否"}</td>
                    <td>{String(row.createTime || "--")}</td>
                    <td className="actions">
                      <a className="danger">删除</a>
                      <a>编辑</a>
                      <a>风险级别设置</a>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
          <footer className="risk-pager">
            <span>共 {total} 条</span>
            <select>
              <option>10条/页</option>
            </select>
            <button
              className="arrow"
              disabled={page === 1}
              onClick={() => go(page - 1)}
            >
              ‹
            </button>
            {pageItems.map((x, i) =>
              x === "…" ? (
                <i key={`${x}${i}`}>…</i>
              ) : (
                <button
                  key={x}
                  className={page === x ? "page-current" : "page-number"}
                  onClick={() => go(Number(x))}
                >
                  {x}
                </button>
              ),
            )}
            <button
              className="arrow"
              disabled={page === maxPage}
              onClick={() => go(page + 1)}
            >
              ›
            </button>
            <label>
              前往{" "}
              <input
                value={jump}
                onChange={(e) => setJump(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && go(Number(jump))}
              />{" "}
              页
            </label>
          </footer>
        </div>
      </section>
    </main>
  );
}
type ReviewRow = {
  id: number;
  enterprise: string;
  indicator: string;
  content: string;
  level: string;
  type: string;
  status: string;
  operator: string;
  time: string;
  progress?: string;
};
const reviewTabs = [
  "风险状态审核",
  "风险等级变化审核",
  "处置计划完成审核",
  "动态调整审核",
];
const reviewRows: ReviewRow[] = [
  {
    id: 1,
    enterprise: "天津环渤海创业投资管理有限公司",
    indicator: "其他股东/投资人经营期限已到期或者临近到期",
    content: "变更前：- 变更后：2026-05-14 变更时间：2026-05-14",
    level: "低风险",
    type: "股东/投资人核心管控",
    status: "确认待审核",
    operator: "管理员",
    time: "2026-05-14 06:05:42",
  },
  {
    id: 2,
    enterprise: "青岛汇友中小企业资产管理有限责任公司",
    indicator: "终本案件",
    content: "案号：（2025）鲁0202执5991号 执行标的：30,000.00",
    level: "中风险",
    type: "股东/实控企业涉诉",
    status: "消除待审核",
    operator: "法务风控部 - 测试主责部门",
    time: "2026-03-01 05:21:44",
  },
  {
    id: 3,
    enterprise: "北京天宜上佳高新材料股份有限公司",
    indicator: "负面舆情（破产清算、资产查封/扣押/冻结等全场景）",
    content: "*ST天宜：子公司募集资金专户部分资金被司法划扣",
    level: "高风险",
    type: "舆情风险管控",
    status: "确认待审核",
    operator: "管理员",
    time: "2026-05-08 17:58:11",
  },
  {
    id: 4,
    enterprise: "青岛海诺投资发展有限公司",
    indicator: "新增对外股权投资",
    content: "被投资企业：广州诺凡达科技有限公司 投资比例：40.00%",
    level: "低风险",
    type: "股权结构管控",
    status: "确认待审核",
    operator: "管理员",
    time: "2026-05-09 11:10:45",
  },
  {
    id: 5,
    enterprise: "青岛人工智能产业创新中心有限公司",
    indicator: "新增对外股权投资",
    content: "被投资企业：青岛具身智能产业发展有限公司 投资比例：40.00%",
    level: "高风险",
    type: "股权结构管控",
    status: "消除待审核",
    operator: "战略投资中心 - 王伯伟",
    time: "2025-11-07 14:58:46",
  },
  {
    id: 6,
    enterprise: "松立控股集团股份有限公司",
    indicator: "新设分支机构",
    content: "企业名称：松立控股集团股份有限公司黄岛分公司",
    level: "低风险",
    type: "工商主体基础管控",
    status: "确认待审核",
    operator: "管理员",
    time: "2026-03-25 08:27:23",
  },
  {
    id: 7,
    enterprise: "无锡锡南铸造机械股份有限公司",
    indicator: "股权冻结",
    content: "执行通知书文号：（2022）鲁02民初1319号",
    level: "高风险",
    type: "股权结构管控",
    status: "确认待审核",
    operator: "管理员",
    time: "2026-03-31 12:12:01",
  },
  {
    id: 8,
    enterprise: "青岛青铸装备有限公司",
    indicator: "新设子公司",
    content: "被投资企业：青岛扬帆船舶劳务工程有限公司",
    level: "高风险",
    type: "工商主体基础管控",
    status: "确认待审核",
    operator: "管理员",
    time: "2026-03-02 07:12:18",
  },
  {
    id: 9,
    enterprise: "青岛华控能源科技有限公司",
    indicator: "注册资本变动",
    content: "从“1000万元”增加到“5000万元”，增加“4000万元”",
    level: "低风险",
    type: "资本变动管控",
    status: "确认待审核",
    operator: "管理员",
    time: "2026-03-19 13:49:10",
  },
  {
    id: 10,
    enterprise: "珠海中惠管理咨询合伙企业（有限合伙）",
    indicator: "新设子公司",
    content: "被投资企业：北京安康居装饰工程有限公司 投资比例：50.00%",
    level: "高风险",
    type: "工商主体基础管控",
    status: "确认待审核",
    operator: "管理员",
    time: "2026-01-22 13:37:41",
  },
  {
    id: 11,
    enterprise: "青岛财富管理基金有限公司",
    indicator: "企业经营异常",
    content: "企业被列入经营异常名录",
    level: "中风险",
    type: "经营运营与资质合规",
    status: "确认待审核",
    operator: "管理员",
    time: "2026-02-14 10:22:08",
  },
  {
    id: 12,
    enterprise: "华通创投产业投资有限公司",
    indicator: "司法涉诉案件",
    content: "新增司法案件信息，待确认处置",
    level: "中风险",
    type: "法律与司法涉诉",
    status: "确认待审核",
    operator: "法务风控部",
    time: "2026-02-06 09:18:35",
  },
  {
    id: 13,
    enterprise: "青岛科技创新投资有限公司",
    indicator: "税务异常",
    content: "企业存在税务异常信息",
    level: "低风险",
    type: "财务风险管控",
    status: "消除待审核",
    operator: "管理员",
    time: "2026-01-29 16:04:12",
  },
  {
    id: 14,
    enterprise: "华通金控资产管理有限公司",
    indicator: "限制高消费",
    content: "法定代表人存在限制高消费信息",
    level: "中风险",
    type: "法律与司法涉诉",
    status: "确认待审核",
    operator: "管理员",
    time: "2026-01-18 11:46:29",
  },
];
function PendingReview() {
  const [tab, setTab] = useState(reviewTabs[0]);
  const [modal, setModal] = useState<{ kind: string; row: ReviewRow } | null>(
    null,
  );
  const [opinion, setOpinion] = useState("同意");
  const [reason, setReason] = useState("");
  const [reviewed, setReviewed] = useState<number[]>([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [filters, setFilters] = useState({ status: '', group: '', type: '', level: '', enterprise: '', start: '', end: '' });
  const riskTab = tab !== "动态调整审核";
  const plan = tab === "处置计划完成审核";
  const filteredReviews = reviewRows.filter((row) => (!filters.status || row.status.includes(filters.status)) && (!filters.group || (filters.group === '参股企业' && row.id % 3 === 1) || (filters.group === '全资企业' && row.id % 3 === 2) || (filters.group === '控股企业' && row.id % 3 === 0)) && (!filters.type || row.type === filters.type) && (!filters.level || row.level === filters.level) && (!filters.enterprise || row.enterprise.includes(filters.enterprise)) && (!filters.start || row.time.slice(0, 10) >= filters.start) && (!filters.end || row.time.slice(0, 10) <= filters.end));
  const rows = filteredReviews
    .slice((reviewPage - 1) * 10, reviewPage * 10)
    .map((r, i) =>
      plan ? { ...r, progress: i % 2 ? "申请完成" : "进行中" } : r,
    );
  const pages = Math.max(1, Math.ceil(filteredReviews.length / 10));
  const updateFilter = (key: keyof typeof filters, value: string) => setFilters({ ...filters, [key]: value });
  const resetFilters = () => { setFilters({ status: '', group: '', type: '', level: '', enterprise: '', start: '', end: '' }); setReviewPage(1); setSelected([]); };
  const approve = async () => {
    if (!modal) return;
    try {
      const login = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uuid: crypto.randomUUID(), username: 'admin', password: 'admin' }) }).then(r => r.json());
      const token = login?.data?.token;
      await fetch('/api/supervise/risk/riskReview', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, token }, body: JSON.stringify({ riskId: modal.row.id, auditStatus: opinion === '同意' ? 0 : 1, handleReason: reason.trim() }) });
    } catch (error) { console.error('风险审核提交失败', error); }
    setReviewed([...reviewed, modal.row.id]);
    setModal(null);
    setReason('');
  };
  return (
    <main className="module-page pending-page">
      <aside className="side-menu pending-side">
        <div className="side-heading">◉ 风险推送</div>
        <div className="side-heading">♟ 我的审核</div>
        <button className="side-item selected">待审核</button>
        <button className="side-item">已审核</button>
        <div className="side-heading">▧ 风险统计提醒</div>
      </aside>
      <section className="pending-content">
        <h2>待审核</h2>
        <div className="pending-card">
          <div className="review-tabs">
            {reviewTabs.map((t) => (
              <button
                key={t}
                className={tab === t ? "active" : ""}
                onClick={() => {
                  setTab(t);
                  setReviewPage(1);
                }}
              >
                {t}
              </button>
            ))}
          </div>
          {riskTab ? (
            <>
              <div className="review-filter">
                <PendingCascader placeholder="请选择类型" value={filters.status} onChange={v => updateFilter('status', v === '风险确认' ? '确认' : '消除')} items={[{ label: '风险确认' }, { label: '风险消除' }]} />
                <PendingCascader placeholder="请选择企业分组" value={filters.group} onChange={v => updateFilter('group', v)} items={[{ label: '全资企业', children: ['全资企业'] }, { label: '控股企业', children: ['控股企业', '控股不控权企业', '控股不控权关联企业', '控股企业其他股东'] }, { label: '参股企业', children: ['参股企业'] }, { label: '主动管理型基金', children: ['主动管理型基金'] }, { label: '参与基金', children: ['参与基金'] }, { label: '集团本部', children: ['集团本部'] }]} />
                <PendingCascader placeholder="请选择风险类型" value={filters.type} onChange={v => updateFilter('type', v)} items={[{ label: '主体资质与工商管控风险', children: ['工商主体基础管控'] }, { label: '股权穿透与股东管控风险', children: ['股东/投资人核心管控', '股权结构管控'] }, { label: '治理与人员管控风险', children: ['治理与人员管控'] }, { label: '法律与司法涉诉风险', children: ['法律与司法涉诉'] }, { label: '行政处罚与合规惩戒风险', children: ['行政处罚与合规惩戒'] }, { label: '经营运营与资质合规风险', children: ['经营运营与资质合规'] }]} />
                <select value={filters.level} onChange={e => updateFilter('level', e.target.value)}>
                  <option value="">请选择风险级别</option><option>高风险</option><option>中风险</option><option>低风险</option>
                </select>
                <input value={filters.enterprise} onChange={e => updateFilter('enterprise', e.target.value)} placeholder="请输入企业名称" />
                <input value={filters.start} onChange={e => updateFilter('start', e.target.value)} type="date" aria-label="开始日期" />
                <span>至</span>
                <input value={filters.end} onChange={e => updateFilter('end', e.target.value)} type="date" aria-label="结束日期" />
                <button className="primary" onClick={() => setReviewPage(1)}>查询</button>
                <button onClick={resetFilters}>重置</button>
                <button disabled={!selected.length} onClick={() => { const row = reviewRows.find(r => r.id === selected[0]); if (row) setModal({ kind: '审核', row }); }}>批量审核</button>
              </div>
              <div className="pending-table-wrap">
                <table className="pending-table">
                  <thead>
                    <tr>
                      {[
                        "",
                        "序号",
                        "企业名称",
                        "风险指标",
                        "风险内容",
                        "风险级别",
                        "风险类型",
                        "状态",
                        ...(plan ? ["处置进度"] : []),
                        "操作人",
                        "提交时间",
                        "操作",
                      ].map((x, index) => (
                        <th key={x || 'select'}>{index === 0 ? <input aria-label="全选" type="checkbox" checked={rows.length > 0 && rows.every(r => selected.includes(r.id))} onChange={e => setSelected(e.target.checked ? [...new Set([...selected, ...rows.map(r => r.id)])] : selected.filter(id => !rows.some(r => r.id === id)))} /> : x}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={r.id}>
                        <td>
                          <input aria-label={`选择${r.enterprise}`} type="checkbox" checked={selected.includes(r.id)} onChange={e => setSelected(e.target.checked ? [...selected, r.id] : selected.filter(id => id !== r.id))} />
                        </td>
                        <td>{(reviewPage - 1) * 10 + i + 1}</td>
                        <td className="review-enterprise">▰ {r.enterprise}</td>
                        <td>{r.indicator}</td>
                        <td>{r.content}</td>
                        <td>
                          <span
                            className={`risk-tag ${r.level === "高风险" ? "high" : r.level === "中风险" ? "middle" : "low"}`}
                          >
                            {r.level}
                          </span>
                        </td>
                        <td>{r.type}</td>
                        <td>
                          <em
                            className={
                              reviewed.includes(r.id) ? "reviewed" : "waiting"
                            }
                          >
                            ● {reviewed.includes(r.id) ? "已审核" : r.status}
                          </em>
                        </td>
                        {plan && <td>{r.progress}</td>}
                        <td>{r.operator}</td>
                        <td>{r.time}</td>
                        <td className="actions">
                          <a onClick={() => setModal({ kind: "详情", row: r })}>
                            详情
                          </a>
                          <a
                            onClick={() =>
                              setModal({ kind: "指标全景", row: r })
                            }
                          >
                            指标全景
                          </a>
                          <a onClick={() => setModal({ kind: "审核", row: r })}>
                            审核
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <DynamicAdjust onAudit={(row) => setModal({ kind: "审核", row })} />
          )}
          <footer className="pending-pager">
            <span>共 {riskTab ? reviewRows.length : 8} 条</span>
            <select>
              <option>10条/页</option>
            </select>
            <button
              disabled={reviewPage === 1}
              onClick={() => setReviewPage(reviewPage - 1)}
            >
              ‹
            </button>
            {Array.from({ length: riskTab ? pages : 1 }, (_, i) => (
              <button
                key={i}
                className={reviewPage === i + 1 ? "active" : ""}
                onClick={() => setReviewPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={reviewPage === pages}
              onClick={() => setReviewPage(reviewPage + 1)}
            >
              ›
            </button>
            <label>
              前往{" "}
              <input
                value={reviewPage}
                onChange={(e) =>
                  setReviewPage(
                    Math.min(pages, Math.max(1, Number(e.target.value) || 1)),
                  )
                }
              />{" "}
              页
            </label>
          </footer>
        </div>
      </section>
      {modal && (
        <div className="dialog-mask">
          <div className={`review-dialog ${modal.kind === "审核" ? "risk-review-modal" : ""}`}>
            <button className="dialog-close" onClick={() => setModal(null)}>×</button>
            <h3>{modal.kind === "审核" ? "风险审核" : modal.kind === "详情" ? "风险详情" : modal.kind}</h3>
            {modal.kind === "审核" ? (
              <>
                <div className="audit-field"><label>审核类型</label><span>{modal.row.type}</span></div>
                <div className="audit-field"><label>当前状态</label><span>{modal.row.status}</span></div>
                <div className="audit-field opinion">
                  <label>审核意见</label>
                  <button
                    className={opinion === "同意" ? "chosen" : ""}
                    onClick={() => setOpinion("同意")}
                  >
                    ◉　同意
                  </button>
                  <button
                    className={opinion === "不同意" ? "chosen" : ""}
                    onClick={() => setOpinion("不同意")}
                  >
                    ○　不同意
                  </button>
                </div>
                <div className="audit-field audit-reason"><label>原因</label><textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="请输入" /></div>
                <div className="audit-log-title">操作记录</div>
                <table className="audit-log"><thead><tr><th>序号</th><th>审批人</th><th>操作时间</th><th>操作</th><th>理由</th></tr></thead><tbody><tr><td>1</td><td>管理员</td><td>2026-07-30 10:47:30</td><td>确认是风险</td><td>我是发生原因</td></tr><tr><td>2</td><td>管理员</td><td>2026-06-02 09:36:13</td><td>情况描述</td><td>发生原因</td></tr></tbody></table>
                <div className="dialog-actions">
                  <button className="primary" onClick={approve}>
                    确定
                  </button>
                  <button onClick={() => setModal(null)}>取消</button>
                </div>
              </>
            ) : (
              <>
                <div className="detail-grid"><label>风险级别</label><span>{modal.row.level}</span><label>企业名称</label><span>{modal.row.enterprise}</span><label>风险指标</label><span>{modal.row.indicator}</span><label>风险类型</label><span>{modal.row.type}</span><label>审核状态</label><span>{modal.row.status}</span><label>发生时间</label><span>{modal.row.time}</span><label>风险内容</label><span>{modal.row.content}</span></div>
                <div className="audit-log-title">操作记录</div><table className="audit-log"><thead><tr><th>序号</th><th>审批人</th><th>操作时间</th><th>操作</th><th>理由</th></tr></thead><tbody><tr><td>1</td><td>管理员</td><td>2026-07-30 10:47:30</td><td>确认是风险</td><td>我是发生原因</td></tr></tbody></table>
                <div className="dialog-actions">
                  <button className="primary" onClick={() => setModal(null)}>
                    确定
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
function DynamicAdjust({ onAudit }: { onAudit: (row: ReviewRow) => void }) {
  const rows = reviewRows.slice(0, 3);
  return (
    <>
      <div className="review-filter dynamic-filter">
        <select>
          <option>全部操作对象</option>
        </select>
        <select>
          <option>全部操作类型</option>
        </select>
        <button className="primary">查询</button>
        <button>重置</button>
      </div>
      <div className="pending-table-wrap">
        <table className="pending-table dynamic-table">
          <thead>
            <tr>
              {[
                "",
                "序号",
                "操作对象",
                "操作类型",
                "对象数据",
                "处理状态",
                "来源",
                "系统推送时间",
                "操作",
              ].map((x) => (
                <th key={x}>{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{i + 1}</td>
                <td>{i === 0 ? "权限" : i === 1 ? "用户" : "企业"}</td>
                <td>新增/修改</td>
                <td>变更后数据：{r.content}</td>
                <td>
                  <em className="waiting">● 待审核</em>
                </td>
                <td>资本运营系统</td>
                <td>{r.time}</td>
                <td className="actions">
                  <a onClick={() => onAudit(r)}>审核</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>序号</th>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              {row.map((col, j) => (
                <td key={j}>
                  {col === "启用" || col === "已生成" ? (
                    <em className="status">{col}</em>
                  ) : (
                    col
                  )}
                </td>
              ))}
              <td>
                <a>查看</a>
                <a>编辑</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer>
        <span>共 {rows.length} 条</span>
        <div>
          <button disabled>‹</button>
          <button className="page-current">1</button>
          <button>›</button>
        </div>
      </footer>
    </div>
  );
}
function ModuleView({ name }: { name: string }) {
  const [page, setPage] = useState(secondary[name][0]);
  useEffect(() => setPage(secondary[name][0]), [name]);
  const stat = name === "统计分析";
  const report = name === "风险报告";
  const system = name === "系统管理";
  const title = stat ? page : page;
  const description = stat
    ? "对各部门风险处置、日常工作和计划执行情况进行统计评价。"
    : report
      ? page === "年报"
        ? "展示年度的监管报告"
        : "展示季度的监管报告"
      : system
        ? "支持对集团下属企业进行新增和维护，可按企业类型或业务版块进行分组。"
        : page === "风险信息"
          ? "对全资、控股、参股、基金及基金投资企业共计379家内部企业纳入监管。"
          : "对该企业分组的风险信息进行监控和处置。";
  return (
    <main className={`module-page ${report ? 'risk-report-page' : stat ? 'statistics-page' : ''}`}>
      <SideMenu name={name} page={page} setPage={setPage} />
      <section className="panel">
        <div className="panel-hero">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {stat ? (
          <Statistics page={page} />
        ) : (
          <>
            <FilterBar label={report ? "请选择季度" : "请输入企业名称"} />
            <div className="panel-actions">
              {system ? (
                <button className="primary">＋ 新增企业</button>
              ) : !report ? (
                <button>⇩ 导出</button>
              ) : null}
              <span>
                共发现 <b>{system ? "410" : report ? "16" : "750"}</b> 条数据
              </span>
            </div>
            <DataTable
              headers={
                report
                  ? ["时间", "报告初稿", "初稿风险统计", "报告终稿"]
                  : system
                    ? [
                        "企业名称",
                        "所属上级企业",
                        "统一社会信用代码",
                        "企业分组",
                      ]
                    : [
                        "企业名称",
                        "企业分组",
                        "管理主体",
                        "风险指标",
                        "风险内容",
                      ]
              }
              rows={report ? reportRows : system ? systemRows : monitorRows}
            />
          </>
        )}
      </section>
    </main>
  );
}
function Statistics({ page }: { page: string }) {
  return (
    <div className="statistics">
      <div className="stat-filters">
        <button className="chip active">近一年</button>
        <button className="chip">近半年</button>
        <select>
          <option>全部企业</option>
        </select>
      </div>
      <div className="stat-cards">
        <article>
          <p>风险企业总数</p>
          <b>457</b>
          <span>
            较上期 <i>+ 12.5%</i>
          </span>
        </article>
        <article>
          <p>高风险企业</p>
          <b className="red">192</b>
          <span>占比 42.01%</span>
        </article>
        <article>
          <p>中风险企业</p>
          <b className="orange">210</b>
          <span>占比 45.95%</span>
        </article>
        <article>
          <p>低风险企业</p>
          <b className="green">55</b>
          <span>占比 12.04%</span>
        </article>
      </div>
      <div className="chart-grid">
        <article className="chart">
          <h3>{page === "风险趋势分析" ? "风险数量趋势" : "风险等级分布"}</h3>
          <div className="donut">
            <span>
              风险总数<b>457</b>
            </span>
          </div>
          <div className="legend">
            <p>
              <i className="legend-red" />
              高风险 <b>192</b>
            </p>
            <p>
              <i className="legend-orange" />
              中风险 <b>210</b>
            </p>
            <p>
              <i className="legend-green" />
              低风险 <b>55</b>
            </p>
          </div>
        </article>
        <article className="chart">
          <h3>风险类型统计</h3>
          <div className="bars">
            {[
              ["法律与司法涉诉", 88],
              ["主体资质与工商", 65],
              ["治理与人员", 52],
              ["股权穿透", 48],
              ["经营运营", 36],
              ["关联与舆情", 24],
            ].map(([n, w]) => (
              <p key={String(n)}>
                <span>{n}</span>
                <i>
                  <b style={{ width: `${w}%` }} />
                </i>
                <em>{w}</em>
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

const routes: Record<string, string> = {
  "#/": "首页",
  "#/index": "首页",
  "#/equity": "股权结构",
  "#/riskMonitor/info": "风险监控",
  "#/riskReport": "风险报告",
  "#/statistics": "统计分析",
  "#/system": "系统管理",
  "#/sys/company": "系统管理",
  "#/sys/indicator": "系统管理",
  "#/sys/pendingReview": "系统管理",
};
const routeFor: Record<string, string> = {
  首页: "#/index",
  股权结构: "#/equity",
  风险监控: "#/riskMonitor/info",
  风险报告: "#/riskReport",
  统计分析: "#/statistics",
  系统管理: "#/sys/company",
};
export default function App() {
  const readRoute = () => routes[window.location.hash] || "首页";
  const [active, setActive] = useState(readRoute);
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => {
      setActive(readRoute());
      setHash(window.location.hash);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  const navigate = (name: string) => {
    window.location.hash = routeFor[name];
  };
  return (
    <>
      <Header active={active} setActive={navigate} />
      {active === "首页" ? (
        <Home />
      ) : active === "股权结构" ? (
        <Equity />
      ) : active === "风险监控" ? (
        <RiskInfoView />
      ) : hash === "#/sys/company" ? (
        <SystemDataView key="company" kind="company" />
      ) : hash === "#/sys/indicator" ? (
        <SystemDataView key="indicator" kind="indicator" />
      ) : hash === "#/sys/pendingReview" ? (
        <PendingReview />
      ) : (
        <ModuleView key={active} name={active} />
      )}
    </>
  );
}
