import { useEffect, useRef, useState, type FormEvent } from "react";
import "./App.css";
import "./risk-confirm.css";
import "./risk-entry.css";

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
  onLogout,
}: {
  active: string;
  setActive: (v: string) => void;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="brand">
        <i className="brand-logo" />
        <b>穿透式监管平台</b>
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
            <button onClick={onLogout}>↪　退出登录</button>
          </div>
        )}
      </div>
    </header>
  );
}
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const submit = (event: FormEvent) => { event.preventDefault(); onLogin(); };
  return <main className="login-page"><section className="login-panel"><h1>华企通穿透式监管平台</h1><h2>欢迎使用</h2><form onSubmit={submit}><label>用户名<input value={username} onChange={event => setUsername(event.target.value)} placeholder="请输入用户名" autoFocus /></label><label>密码<input value={password} onChange={event => setPassword(event.target.value)} type="password" placeholder="请输入密码" /></label><button type="submit">登录</button></form></section></main>;
}

function Home() {
  const [company, setCompany] = useState("");
  return (
    <main className="home">
      <section className="hero">
        <h1>穿透式监管平台，精准洞察企业风险</h1>
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

type EquityEnterprise = { id: string; pids?: string | null; enterpriseName: string; creditCode?: string | null; qccId?: string | null; children?: EquityEnterprise[] };

function Equity() {
  const [items, setItems] = useState<EquityEnterprise[]>([]);
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState<EquityEnterprise | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const result = await fetch('/api/enterprise/alls?parentCreditCode=913702006752725144').then(response => response.json());
        if (active && result.code === 0) setItems(buildEquityTree(result.data || []));
      } finally { if (active) setLoading(false); }
    };
    void load();
    return () => { active = false; };
  }, []);
  const matches = (node: EquityEnterprise): boolean => node.enterpriseName.includes(keyword) || Boolean(node.children?.some(matches));
  return <main className="equity-page">
    <section className="equity-panel">
      <div className="equity-title">组织架构</div>
      <label className="equity-search"><input value={keyword} onChange={event => setKeyword(event.target.value)} placeholder="请输入企业名称搜索" /><span>⌕</span></label>
      <div className="equity-tree-wrap">{loading ? <p>加载中…</p> : items.filter(matches).map(item => <EquityTreeNode key={item.id} item={item} keyword={keyword} selected={selected?.id} onSelect={setSelected} />)}</div>
    </section>
    <section className="equity-frame"><iframe title="股权结构图" src={selected?.qccId ? `https://pro-plugin.qcc.com/charts/stockstructure?keyNo=${encodeURIComponent(selected.qccId)}` : 'about:blank'} /></section>
  </main>;
}

function buildEquityTree(rows: EquityEnterprise[]) {
  const nodes = new Map(rows.map(row => [String(row.id), { ...row, children: [] as EquityEnterprise[] }]));
  const roots: EquityEnterprise[] = [];
  for (const row of rows) {
    const node = nodes.get(String(row.id))!;
    const ids = String(row.pids || '').split(',').filter(Boolean);
    const parent = ids.length ? nodes.get(ids[ids.length - 1]) : undefined;
    if (parent) parent.children?.push(node); else roots.push(node);
  }
  return roots;
}

function EquityTreeNode({ item, keyword, selected, onSelect }: { item: EquityEnterprise; keyword: string; selected?: string; onSelect: (item: EquityEnterprise) => void }) {
  const [open, setOpen] = useState(true);
  const containsKeyword = (node: EquityEnterprise): boolean => node.enterpriseName.includes(keyword) || Boolean(node.children?.some(containsKeyword));
  const children = (item.children || []).filter(containsKeyword);
  const branch = children.length > 0;
  return <div className="equity-node"><button className={selected === item.id ? 'selected' : ''} onClick={() => { onSelect(item); if (branch) setOpen(!open); }}><i className={branch && open ? 'open' : ''}>{branch ? '›' : ''}</i><span>{item.enterpriseName}</span></button>{branch && open && <div className="equity-children">{children.map(child => <EquityTreeNode key={child.id} item={child} keyword={keyword} selected={selected} onSelect={onSelect} />)}</div>}</div>;
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
function PendingCascader({ placeholder, value, items, onChange }: { placeholder: string; value: string[]; items: CascadeItem[]; onChange: (value: string[]) => void }) {
  const [open, setOpen] = useState(false); const [active, setActive] = useState(0); const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (active >= items.length) setActive(0);
  }, [active, items.length]);
  const current = items[active] ?? items[0];
  const toggle = (next: string) => onChange(value.includes(next) ? value.filter(item => item !== next) : [...value, next]);
  useEffect(() => {
    const closeOnOutsidePointer = (event: PointerEvent) => { if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, []);
  const selectedText = value.join('、');
  return <div ref={rootRef} className="pending-cascader"><button type="button" className={open ? 'open' : ''} onClick={() => setOpen(!open)}><span className="pending-cascader-label" title={selectedText}>{selectedText || placeholder}</span><span className="pending-cascader-arrow">{open ? '⌃' : '⌄'}</span></button>{open && <div className={`cascade-menu ${current?.children ? 'two-col' : ''}`}>{items.length ? <><div className="cascade-parent">{items.map((item, index) => <button key={item.label} className={index === active ? 'active' : ''} onMouseEnter={() => setActive(index)} onClick={() => toggle(item.label)}><i className={value.includes(item.label) ? 'checked' : ''}>✓</i>{item.label}{item.children && <b>›</b>}</button>)}</div>{current?.children && <div className="cascade-child">{current.children.map(item => <button key={item} onClick={() => toggle(item)}><i className={value.includes(item) ? 'checked' : ''}>✓</i>{item}</button>)}</div>}</> : <div className="cascade-empty">暂无数据</div>}</div>}</div>
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
  image?: string;
  enterpriseName?: string;
  enterpriseGroup?: string;
  belongingPlateId?: string;
  riskIndicator?: string;
  riskContent?: string;
  riskLevel?: string;
  riskType?: string;
  riskMainType?: string;
  riskTypeName?: string;
  operationStatus?: number;
  planStepState?: number | null;
  manageDeptId?: string | null;
  manageDeptName?: string | null;
  realName?: string | null;
  indicatorSource?: number | string | null;
  metricsAliasCode?: string | null;
  creditCode?: string | null;
  qccId?: string | null;
  shareholdingRatio?: string | null;
  investmentAmount?: string | null;
  fullName2?: string | null;
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
const riskTypes: Record<string, string> = {
  supv_risk_type_entities_control: "工商主体基础管控",
  supv_risk_type_shareholders: "股东/投资人核心管控",
  supv_risk_type_equity_structure: "股权结构管控",
  supv_risk_type_core_person: "核心人员管控",
  supv_risk_type_personnel: "人事合规管控",
  supv_risk_type_judicial_litigation: "司法涉诉",
  supv_risk_type_shareholders_litigation: "股东/实控企业涉诉",
  supv_risk_type_legal_dispute: "法律纠纷",
  supv_risk_type_administrative_penalties: "行政机关处罚",
  supv_risk_type_industry_compliance: "行业合规惩戒",
  supv_risk_type_license: "资质许可管控",
  supv_risk_type_business_compliance: "经营基础合规",
  supv_risk_type_bidding_control: "招投标管控",
  supv_risk_type_transaction_control: "关联交易管控",
  supv_risk_type_external_investment: "对外投资管控",
  supv_risk_type_capital_change: "资本变动管控",
  supv_risk_type_fund_control: "基金/SPV管控",
  supv_risk_type_financial_data: "财务数据管控",
  supv_risk_type_debt_risk: "债务风险管控",
  supv_risk_type_capital_flow: "资金流转管控",
  supv_risk_type_asset_control: "资产实物管控",
  supv_risk_type_intellectual_property: "知识产权管控",
  supv_risk_type_environmental_control: "环保管控",
  supv_risk_type_safety_production: "安全生产管控",
  supv_risk_type_employment_compliance: "劳动用工合规",
  supv_risk_type_overseas_compliance: "境外业务合规",
  supv_risk_type_overseas_risk: "境外风险管控",
  supv_risk_type_related_relationship: "关联关系管控",
  supv_risk_type_public_opinion: "舆情风险管控",
  supv_risk_type_special_compliance: "专项合规管控",
};
const riskManagers: Record<string, string> = {
  groupHeadquarters: "集团本部",
  huatongChuangtou: "华通创投",
  huatongJinkong: "华通金控",
  cityIndustrialPark: "都市产业园",
  dataGroup: "数据集团",
};
const riskStates: Record<number, string> = {
  0: "未确认",
  1: "已确认",
  2: "已消除",
  3: "已关闭",
  4: "确认待审核",
  5: "关闭待审核",
  6: "消除待审核",
  7: "情况描述",
  8: "已确认",
};
const riskStatusColors: Record<number, string> = {
  0: "#f26e10",
  1: "#52c41a",
  2: "#1890ff",
  3: "#bbb",
  4: "#faad14",
  5: "#faad14",
  6: "#faad14",
  7: "#faad14",
  8: "#52c41a",
};
const planStepStates: Record<number, { label: string; color: string }> = {
  0: { label: "未开始", color: "#bbb" },
  1: { label: "进行中", color: "#1890ff" },
  2: { label: "已延期", color: "#f26e10" },
  3: { label: "完成待审核", color: "#faad14" },
  4: { label: "已完成", color: "#52c41a" },
};
const monitorGroups = [
  { label: '全资企业', value: 'supv_enterprise_type_wholly', tabs: ['全资企业', '集团直管'] },
  { label: '控股企业', value: 'supv_enterprise_type_holding', tabs: ['控股企业', '控股不控权企业', '控股不控权关联企业', '控股企业其他股东'] },
  { label: '参股企业', value: 'supv_enterprise_type_participation', tabs: ['参股企业', '参股企业实际控制人', '参股企业关联企业'] },
  { label: '主动管理型基金', value: 'supv_enterprise_type_participation_comp', tabs: ['主动管理型基金', '主动管理型基金控股企业', '主动管理型基金参股企业', '主动管理型基金投资的子基金', '主动管理型基金参股企业的实际控制人', '基金执行事务合伙人/基金管理人', '主动管理型基金投资的子基金的参股企业'] },
  { label: '集团本部', value: 'groupHeadquarters', tabs: ['集团本部'] },
];
const enterpriseGroupCodes: Record<string, string> = {
  '全资企业': 'supv_enterprise_type_wholly', '集团直管': 'supv_enterprise_type_manage',
  '控股企业': 'supv_enterprise_type_holding', '控股不控权企业': 'supv_enterprise_type_controll', '控股不控权关联企业': 'supv_enterprise_type_controll_affiliate', '控股企业其他股东': 'supv_enterprise_type_holding_other_shareholder',
  '参股企业': 'supv_enterprise_type_participation', '参股企业实际控制人': 'supv_enterprise_type_participation_controll', '参股企业关联企业': 'supv_enterprise_type_participation_related',
  '主动管理型基金': 'supv_enterprise_type_manage_fund', '参与基金': 'supv_enterprise_type_participate_fund', '集团本部': 'groupHeadquarters',
};
type RiskActionKind = "detail" | "panorama" | "plan" | "confirm" | "eliminate" | "situation";
function RiskInfoView() {
  const [rows, setRows] = useState<RiskRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [departmentNames, setDepartmentNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [enterpriseName, setEnterpriseName] = useState("");
  const enterpriseSearchRef = useRef<HTMLInputElement>(null);
  const [level, setLevel] = useState<string[]>([]);
  const [enterpriseGroup, setEnterpriseGroup] = useState<string[]>([]);
  const [riskType, setRiskType] = useState<string[]>([]);
  const [operationStatus, setOperationStatus] = useState<string[]>([]);
  const [department, setDepartment] = useState<string[]>([]);
  const [manager, setManager] = useState<string[]>([]);
  const [source, setSource] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monitorGroup, setMonitorGroup] = useState('风险信息');
  const [groupTab, setGroupTab] = useState('');
  const [page, setPage] = useState(1);
  const [jump, setJump] = useState("1");
  const [actionModal, setActionModal] = useState<{ kind: RiskActionKind; row: RiskRecord } | null>(null);
  const [entryOpen, setEntryOpen] = useState(false);
  const load = async (nextPage = page, groupOverride = enterpriseGroup, enterpriseNameOverride = enterpriseName) => {
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
      if (enterpriseNameOverride.trim())
        params.set("enterpriseName", enterpriseNameOverride.trim());
      if (level.length) params.set("riskLevel", level.join(','));
      if (groupOverride.length) params.set("enterpriseGroup", groupOverride.join(','));
      if (riskType.length) params.set("riskType", riskType.join(','));
      if (operationStatus.length) params.set("operationStatus", operationStatus.join(','));
      if (department.length) params.set("manageDeptId", department.join(','));
      if (manager.length) params.set("belongingPlateId", manager.join(','));
      if (source.length) params.set("indicatorSource", source.join(','));
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      const [result, departments] = await Promise.all([
        fetch(`/api/supervise/risk/page?${params}`, {
          headers: { Authorization: `Bearer ${token}`, token },
        }).then((r) => r.json()),
        fetch("/api/sys/dept/list", {
          headers: { Authorization: `Bearer ${token}`, token },
        }).then((r) => r.json()),
      ]);
      if (result.code !== 0) throw new Error(result.msg || "读取失败");
      setRows(result.data?.list || []);
      setTotal(Number(result.data?.total || 0));
      if (departments?.code === 0 && Array.isArray(departments.data)) {
        setDepartmentNames(
          Object.fromEntries(
            departments.data
              .filter((item: { id?: string; name?: string }) => item.id && item.name)
              .map((item: { id: string; name: string }) => [item.id, item.name]),
          ),
        );
      }
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
    if (enterpriseSearchRef.current) enterpriseSearchRef.current.value = '';
    setLevel([]);
    setEnterpriseGroup([]); setRiskType([]); setOperationStatus([]); setDepartment([]); setManager([]); setSource([]); setStartDate(""); setEndDate("");
    setPage(1);
    setJump("1");
    setTimeout(() => void load(1, enterpriseGroup, ''), 0);
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
        <button className={`side-heading risk-info-link ${monitorGroup === '风险信息' ? 'selected' : ''}`} onClick={() => { setMonitorGroup('风险信息'); setEnterpriseGroup([]); setGroupTab(''); void load(1, []); }}>▣　风险信息</button>
        {monitorGroups.map((item) => <button className={`side-item ${monitorGroup === item.label ? 'selected' : ''}`} key={item.value} onClick={() => { setMonitorGroup(item.label); setEnterpriseGroup([item.value]); setGroupTab(item.tabs[0]); void load(1, [item.value]); }}>{item.label}</button>)}
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
          {monitorGroup !== '风险信息' && <div className="monitor-group-tabs">{monitorGroups.find(x => x.label === monitorGroup)?.tabs.map(item => <button key={item} className={groupTab === item ? 'active' : ''} onClick={() => { setGroupTab(item); void load(1, enterpriseGroup); }}>{item}</button>)}</div>}
          <input
            ref={enterpriseSearchRef}
            defaultValue=""
            placeholder="请输入企业名称"
          />
          <PendingCascader placeholder="请选择企业分组" value={enterpriseGroup.map(code => Object.entries(enterpriseGroupCodes).find(([, value]) => value === code)?.[0] || code)} onChange={v => setEnterpriseGroup(v.map(label => enterpriseGroupCodes[label] || label))} items={[{ label: '全资企业', children: ['全资企业', '集团直管'] }, { label: '控股企业', children: ['控股企业', '控股不控权企业', '控股不控权关联企业', '控股企业其他股东'] }, { label: '参股企业', children: ['参股企业', '参股企业实际控制人', '参股企业关联企业'] }, { label: '主动管理型基金', children: ['主动管理型基金'] }, { label: '参与基金', children: ['参与基金'] }, { label: '集团本部', children: ['集团本部'] }]} />
          <PendingCascader placeholder="请选择风险类型" value={riskType.map(code => riskTypes[code] || code)} onChange={v => setRiskType(v.map(label => Object.entries(riskTypes).find(([, text]) => text === label)?.[0] || label))} items={[{ label: '主体资质与工商管控风险', children: ['工商主体基础管控'] }, { label: '股权穿透与股东管控风险', children: ['股东/投资人核心管控', '股权结构管控'] }, { label: '治理与人员管控风险', children: ['治理与人员管控'] }, { label: '法律与司法涉诉风险', children: ['法律与司法涉诉'] }, { label: '行政处罚与合规惩戒风险', children: ['行政机关处罚'] }, { label: '经营运营与资质合规风险', children: ['经营基础合规'] }]} />
          <PendingCascader placeholder="请选择风险级别" value={level.map(code => riskLevels[code] || code)} onChange={v => setLevel(v.map(label => Object.entries(riskLevels).find(([, text]) => text === label)?.[0] || label))} items={[{ label: '高风险' }, { label: '中风险' }, { label: '低风险' }]} />
          <PendingCascader placeholder="请选择状态" value={operationStatus.map(code => riskStates[Number(code)] || code)} onChange={v => setOperationStatus(v.map(label => String(Object.entries(riskStates).find(([, text]) => text === label)?.[0] || label)))} items={['未确认', '已确认', '已消除', '已关闭', '确认待审核', '关闭待审核', '消除待审核', '情况描述'].map(label => ({ label }))} />
          <PendingCascader placeholder="请选择主管部门" value={department.map(code => departmentNames[code] || code)} onChange={v => setDepartment(v.map(label => Object.entries(departmentNames).find(([, text]) => text === label)?.[0] || label))} items={Object.values(departmentNames).map(label => ({ label }))} />
          <PendingCascader placeholder="请选择管理主体" value={manager.map(code => riskManagers[code] || code)} onChange={v => setManager(v.map(label => Object.entries(riskManagers).find(([, text]) => text === label)?.[0] || label))} items={Object.values(riskManagers).map(label => ({ label }))} />
          <PendingCascader placeholder="请选择风险来源" value={source.map(code => code === '0' ? '企查查' : code === '1' ? '运营平台' : code === '2' ? '金企通' : code)} onChange={v => setSource(v.map(label => label === '企查查' ? '0' : label === '运营平台' ? '1' : '2'))} items={['企查查', '运营平台', '金企通'].map(label => ({ label }))} />
          <div className="risk-date-range"><input value={startDate} onChange={e => setStartDate(e.target.value)} type="date" aria-label="开始日期" /><span>至</span><input value={endDate} onChange={e => setEndDate(e.target.value)} type="date" aria-label="结束日期" /></div>
          <div className="risk-filter-actions"><button onClick={() => setEntryOpen(true)}>＋ 新增</button><button className="primary" onClick={() => { const keyword = enterpriseSearchRef.current?.value || ''; setEnterpriseName(keyword); void load(1, enterpriseGroup, keyword); }}>查询</button><button onClick={reset}>重置</button><button onClick={() => void exportRisks()}>⇩ 导出</button></div>
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
                    <span className={`risk-level-tag level-${row.riskLevel ?? "none"}`}>
                      {riskLevels[row.riskLevel || ""] || row.riskLevel || "--"}
                    </span>
                  </td>
                  <td>{row.riskTypeName || riskTypes[row.riskType || ""] || row.riskType || "--"}</td>
                  <td>
                    <span className="risk-status-tag">
                      <i style={{ background: riskStatusColors[row.operationStatus ?? -1] || "#bbb" }} />
                      {riskStates[row.operationStatus ?? -1] || "--"}
                    </span>
                  </td>
                  <td>{String(row.indicatorSource) === "0" ? "企查查" : String(row.indicatorSource) === "1" ? "运营平台" : String(row.indicatorSource) === "2" ? "金企通" : "--"}</td>
                  <td>{[row.manageDeptName, departmentNames[row.manageDeptId || ""], row.manageDeptId].filter(Boolean).join(" - ") || row.realName || "--"}</td>
                  <td>
                    {row.planStepState === null || row.planStepState === undefined ? "--" : (
                      <span className="risk-status-tag">
                        <i style={{ background: planStepStates[row.planStepState]?.color || "#bbb" }} />
                        {planStepStates[row.planStepState]?.label || "--"}
                      </span>
                    )}
                  </td>
                  <td>{row.occurTime || "--"}</td>
                  <td className="actions">
                    <a onClick={() => setActionModal({ kind: "detail", row })}>详情</a>
                    <a onClick={() => setActionModal({ kind: "panorama", row })}>指标全景</a>
                    {row.operationStatus === 0 && <a className="danger-link" onClick={() => setActionModal({ kind: "confirm", row })}>风险确认</a>}
                    {row.operationStatus === 1 && row.planStepState === 4 && <a onClick={() => setActionModal({ kind: "eliminate", row })}>申请风险消除</a>}
                    {row.operationStatus === 1 && row.planStepState !== 2 && <a onClick={() => setActionModal({ kind: "plan", row })}>处置计划</a>}
                    {row.operationStatus === 7 && <a className="danger-link" onClick={() => setActionModal({ kind: "situation", row })}>情况描述</a>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      {actionModal && <RiskActionDialog modal={actionModal} onClose={() => setActionModal(null)} onChanged={() => { void load(page); }} />}
      {entryOpen && <RiskEntryDialog departmentNames={departmentNames} onClose={() => setEntryOpen(false)} onSave={() => { setEntryOpen(false); void load(1); }} />}
      </section>
    </main>
  );
}
type RiskIndicatorOption = {
  id?: string;
  indicatorName?: string;
  indicatorCategory1?: string;
  indicatorCategory2?: string;
  riskLevel?: string | number;
  manageDeptId?: string;
};

function RiskEntryDialog({ departmentNames, onClose, onSave }: { departmentNames: Record<string, string>; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState<Record<string, string>>({ riskLevel: '1', indicatorSource: '0', occurTime: new Date().toISOString().slice(0, 16) });
  const [indicators, setIndicators] = useState<RiskIndicatorOption[]>([]);
  const [indicatorLoading, setIndicatorLoading] = useState(true);
  const [imageName, setImageName] = useState('');
  const enterpriseInputRef = useRef<HTMLInputElement>(null);
  const set = (key: string, value: string) => setForm(current => ({ ...current, [key]: value }));

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const token = await riskSessionToken();
        const result = await fetch('/api/supervise/index/page?pageNum=1&pageSize=500', { headers: { Authorization: `Bearer ${token}`, token } }).then(response => response.json());
        if (active && result.code === 0) setIndicators(Array.isArray(result.data?.list) ? result.data.list : []);
      } finally {
        if (active) setIndicatorLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const selectIndicator = (indicatorId: string) => {
    const indicator = indicators.find(item => String(item.id) === indicatorId);
    if (!indicator) return;
    setForm(current => ({
      ...current,
      indicatorId,
      riskIndicator: indicator.indicatorName || '',
      riskMainType: indicator.indicatorCategory1 || current.riskMainType || '',
      riskType: indicator.indicatorCategory2 || current.riskType || '',
      riskLevel: String(indicator.riskLevel ?? current.riskLevel ?? ''),
      manageDeptId: indicator.manageDeptId || current.manageDeptId || '',
    }));
  };

  const selectImage = (file?: File) => {
    if (!file) return;
    setImageName(file.name);
    set('image', URL.createObjectURL(file));
  };

  const save = async () => {
    const enterpriseName = enterpriseInputRef.current?.value.trim() || '';
    if (!enterpriseName || !form.riskIndicator?.trim() || !form.riskContent?.trim() || !form.riskType || !form.enterpriseGroup) { window.alert('请完整填写必填项'); return; }
    try {
      const token = await riskSessionToken();
      const result = await fetch('/api/supervise/risk/manual', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, token }, body: JSON.stringify({ ...form, enterpriseName, riskIndicator: form.riskIndicator.trim(), riskContent: form.riskContent.trim(), occurTime: form.occurTime?.replace('T', ' ') || '', operator: '管理员' }) }).then(response => response.json());
      if (result.code !== 0) throw new Error(result.msg || '保存失败');
      onSave();
    } catch (error) { window.alert(error instanceof Error ? error.message : '保存失败'); }
  };
  const select = (label: string, key: string, options: Array<[string, string]>) => <label className="risk-entry-field"><span>{label}</span><select value={form[key] || ''} onChange={event => set(key, event.target.value)}><option value="">请选择</option>{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>;
  return <div className="dialog-mask risk-entry-mask" role="dialog" aria-modal="true" aria-label="新增风险信息"><section className="risk-entry-dialog"><button className="dialog-close" onClick={onClose}>×</button><h3>新增风险信息</h3><p className="risk-entry-hint">模拟企查查 / 运营平台风险数据；带 <b>*</b> 的字段为必填项。</p><div className="risk-entry-grid"><label className="risk-entry-field required"><span>企业名称</span><input ref={enterpriseInputRef} defaultValue="" placeholder="请输入企业名称" /></label>{select('企业分组', 'enterpriseGroup', Object.entries(enterpriseGroupCodes).map(([text, value]) => [value, text]))}{select('管理主体', 'belongingPlateId', Object.entries(riskManagers))}{select('主管部门', 'manageDeptId', Object.entries(departmentNames))}<label className="risk-entry-field required"><span>风险指标</span><select value={form.indicatorId || ''} onChange={event => selectIndicator(event.target.value)} disabled={indicatorLoading}><option value="">{indicatorLoading ? '加载指标中…' : '请选择指标管理中的指标'}</option>{indicators.map(item => <option key={item.id} value={item.id}>{item.indicatorName || '--'}</option>)}</select></label>{select('风险主类', 'riskMainType', [['supv_risk_cat_main', '主体资质与工商管控风险'], ['supv_risk_cat_stock', '股权穿透与股东管控风险'], ['supv_risk_cat_governance', '治理与人员管控风险'], ['supv_risk_cat_law', '法律与司法涉诉风险'], ['supv_risk_cat_business', '经营运营与资质合规风险'], ['supv_risk_cat_financial', '财务与资金管控风险']])}{select('风险类型', 'riskType', Object.entries(riskTypes))}{select('风险级别', 'riskLevel', Object.entries(riskLevels))}<label className="risk-entry-field"><span>风险状态</span><input className="risk-entry-readonly" value="未确认" readOnly /></label>{select('风险来源', 'indicatorSource', [['0', '企查查'], ['1', '运营平台'], ['2', '金企通']])}<label className="risk-entry-field"><span>发生日期</span><input type="datetime-local" value={form.occurTime || ''} onChange={event => set('occurTime', event.target.value)} /></label><label className="risk-entry-field"><span>持股比例</span><input value={form.shareholdingRatio || ''} onChange={event => set('shareholdingRatio', event.target.value)} placeholder="例如：0.55%" /></label><label className="risk-entry-field"><span>投资金额</span><input value={form.investmentAmount || ''} onChange={event => set('investmentAmount', event.target.value)} placeholder="请输入投资金额" /></label><label className="risk-entry-field"><span>企业信用代码</span><input value={form.creditCode || ''} onChange={event => set('creditCode', event.target.value)} placeholder="请输入统一社会信用代码" /></label><label className="risk-entry-field"><span>企查查 ID</span><input value={form.qccId || ''} onChange={event => set('qccId', event.target.value)} placeholder="请输入企查查 ID" /></label><label className="risk-entry-field"><span>指标别名编码</span><input value={form.metricsAliasCode || ''} onChange={event => set('metricsAliasCode', event.target.value)} placeholder="请输入指标别名编码" /></label><label className="risk-entry-field risk-entry-upload"><span>股权结构图</span><div><input type="file" accept="image/*" onChange={event => selectImage(event.target.files?.[0])} /><small>{imageName || '请选择图片附件'}</small>{form.image && <img src={form.image} alt="股权结构图预览" />}</div></label><label className="risk-entry-field risk-entry-content required"><span>风险内容</span><textarea value={form.riskContent || ''} onChange={event => set('riskContent', event.target.value)} placeholder="请输入风险内容" /></label></div><footer className="dialog-actions"><button className="primary" onClick={save}>保存</button><button onClick={onClose}>取消</button></footer></section></div>;
}
type RiskLog = { id?: string; operatorName?: string; operator?: string; operatorTime?: string; operatoCategory?: string; remark?: string; handleReason?: string };
type PlanStep = { id?: string; step?: string; stepContent?: string; responsiblePersonName?: string; planFinishDate?: string; actualFinishDate?: string; state?: number; planTarget?: string; planDeadline?: string; url?: string; urlName?: string };
type PlanProgress = { id?: string; progressStepContent?: string; state?: number; createTime?: string };

async function riskSessionToken() {
  const login = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uuid: crypto.randomUUID(), username: 'admin', password: 'admin' }) }).then(response => response.json());
  const token = login?.data?.token;
  if (!token) throw new Error(login?.msg || '登录失败');
  return token as string;
}

function RiskActionDialog({ modal, onClose, onChanged }: { modal: { kind: RiskActionKind; row: RiskRecord }; onClose: () => void; onChanged: (patch?: Partial<RiskRecord>) => void }) {
  const { kind, row } = modal;
  const [tab, setTab] = useState<'log' | 'plan'>('log');
  const [logs, setLogs] = useState<RiskLog[]>([]);
  const [steps, setSteps] = useState<PlanStep[]>([]);
  const [panorama, setPanorama] = useState<RiskRecord[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmRisk, setConfirmRisk] = useState(1);
  const [reason, setReason] = useState('');
  const [policyMaking, setPolicyMaking] = useState('');
  const [reportOrNot, setReportOrNot] = useState(0);
  const [reportContent, setReportContent] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    const headers = (token: string) => ({ Authorization: `Bearer ${token}`, token });
    const read = async () => {
      setBusy(true); setLoaded(false); setMessage('');
      try {
        const token = await riskSessionToken();
        const tasks: Promise<void>[] = [];
        if (kind !== 'panorama') tasks.push(fetch(`/api/supervise/risk/superviseRiskOperationLog/getLogByRiskId?riskId=${encodeURIComponent(row.id)}`, { headers: headers(token) }).then(response => response.json()).then(data => { if (active && data.code === 0) setLogs(Array.isArray(data.data) ? data.data : []); }));
        if (kind === 'detail' || kind === 'plan') tasks.push(fetch(`/api/demo/superviseriskdisposalplanstep/page?pageNum=1&pageSize=50&riskId=${encodeURIComponent(row.id)}`, { headers: headers(token) }).then(response => response.json()).then(data => { if (active && data.code === 0) setSteps(data.data?.list || []); }));
        if (kind === 'panorama') tasks.push(fetch(`/api/supervise/risk/page?pageNum=1&pageSize=30&enterpriseName=${encodeURIComponent(row.enterpriseName || '')}`, { headers: headers(token) }).then(response => response.json()).then(data => { if (active && data.code === 0) setPanorama(data.data?.list || []); }));
        await Promise.all(tasks);
      } catch (error) { if (active) setMessage(error instanceof Error ? error.message : '读取失败'); }
      finally { if (active) { setBusy(false); setLoaded(true); } }
    };
    void read();
    return () => { active = false; };
  }, [kind, row.id, row.enterpriseName]);
  const submit = async () => {
    if ((kind === 'confirm' && confirmRisk === 0 && !reason.trim()) || ((kind === 'eliminate' || kind === 'situation') && !reason.trim())) { setMessage('请填写发生原因'); return; }
    setBusy(true); setMessage('');
    try {
      if (row.id.startsWith('qcc-')) {
        const patch: Partial<RiskRecord> = kind === 'confirm'
          ? { operationStatus: confirmRisk === 1 ? 4 : 5 }
          : kind === 'eliminate'
            ? { operationStatus: 6 }
            : { operationStatus: 7 };
        onChanged(patch);
        onClose();
        return;
      }
      const token = await riskSessionToken();
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, token };
      let url = ''; let body: Record<string, unknown> = {};
      if (kind === 'confirm') { url = `/api/supervise/risk/${row.id}/confirm`; body = { isRisk: confirmRisk === 1, remark: reason.trim(), operator: '管理员' }; }
      if (kind === 'eliminate') { url = `/api/supervise/risk/${row.id}/elimination`; body = { operator: '管理员', reason: reason.trim() }; }
      if (kind === 'situation') { url = `/api/supervise/risk/${row.id}/description`; body = { occurrenceReason: reason.trim(), decisionBody: policyMaking.trim(), reportedToGroup: reportOrNot, reportContent: reportContent.trim(), attachments: attachment?.name || '', operator: '管理员' }; }
      const result = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) }).then(response => response.json());
      if (result.code !== 0) throw new Error(result.msg || '提交失败');
      onChanged(); onClose();
    } catch (error) { setMessage(error instanceof Error ? error.message : '提交失败'); }
    finally { setBusy(false); }
  };
  const title: Record<RiskActionKind, string> = { detail: '风险详情', panorama: '指标全景', plan: '处置计划', confirm: '风险确认', eliminate: '风险消除', situation: '情况描述' };
  const status = riskStates[row.operationStatus ?? -1] || '--';
  if (kind === 'plan' && loaded && steps.length === 0) return <div className="dialog-mask risk-action-mask" role="dialog" aria-modal="true" aria-label="制定处置计划"><DisposalPlanDialog row={row} steps={steps} standalone onClose={onClose} onSaved={onChanged} /></div>;
  return <div className="dialog-mask risk-action-mask" role="dialog" aria-modal="true" aria-label={title[kind]}>
    <div className={`risk-action-dialog ${kind === 'panorama' ? 'panorama-dialog' : ''} ${kind === 'plan' ? 'disposal-plan-dialog' : ''} ${kind === 'confirm' ? 'confirm-dialog' : ''}`}>
      <button className="dialog-close" onClick={onClose}>×</button><h3>{title[kind]}</h3>
      {busy && <div className="risk-action-loading">加载中…</div>}
      {message && <p className="risk-action-message">{message}</p>}
      {kind === 'detail' && <>
        <div className="risk-detail-grid"><label>风险级别</label><span><i className={`risk-level-tag level-${row.riskLevel ?? 'none'}`}>{riskLevels[row.riskLevel || ''] || '--'}</i></span><label>企业名称</label><span>{row.enterpriseName || '--'}</span><label>风险指标</label><span>{row.riskIndicator || '--'}</span><label>风险类型</label><span>{riskTypes[row.riskType || ''] || row.riskType || '--'}</span><label>企业分组</label><span>{riskGroups[row.enterpriseGroup || ''] || row.enterpriseGroup || '--'}</span><label>持股比例</label><span>{row.shareholdingRatio || '--'}</span><label>投资金额</label><span>{row.investmentAmount || '--'}</span><label>管理主体</label><span>{riskManagers[row.belongingPlateId || ''] || row.belongingPlateId || '--'}</span><label>审核状态</label><span>{status}</span><label>发生时间</label><span>{row.occurTime || '--'}</span><label>风险内容</label><span>{row.riskContent || '--'}</span></div>
        <div className="risk-detail-tabs"><button className={tab === 'log' ? 'active' : ''} onClick={() => setTab('log')}>操作记录</button><button className={tab === 'plan' ? 'active' : ''} onClick={() => setTab('plan')}>处置计划完成情况</button></div>
        {tab === 'log' ? <RiskLogTable rows={logs} /> : <PlanStepTable rows={steps} />}
      </>}
      {kind === 'panorama' && <table className="panorama-table"><thead><tr><th>序号</th><th>企业名称</th><th>风险指标</th><th>风险内容</th><th>风险级别</th><th>风险类型</th><th>企业分组</th><th>管理主体</th><th>发生日期</th></tr></thead><tbody>{panorama.map((item, index) => <tr key={item.id}><td>{index + 1}</td><td>{item.enterpriseName}</td><td>{item.riskIndicator}</td><td>{item.riskContent}</td><td>{riskLevels[item.riskLevel || ''] || '--'}</td><td>{riskTypes[item.riskType || ''] || item.riskType}</td><td>{riskGroups[item.enterpriseGroup || ''] || item.enterpriseGroup}</td><td>{riskManagers[item.belongingPlateId || ''] || item.belongingPlateId}</td><td>{item.occurTime}</td></tr>)}</tbody></table>}
      {kind === 'plan' && <DisposalPlanDialog row={row} steps={steps} onSaved={onChanged} />}
      {kind === 'confirm' && <div className="risk-form confirm-form"><label>是否为风险</label><div><label><input type="radio" checked={confirmRisk === 1} onChange={() => setConfirmRisk(1)} /> 是风险</label><label><input type="radio" checked={confirmRisk === 0} onChange={() => setConfirmRisk(0)} /> 不是风险</label></div><label>发生原因</label><textarea value={reason} onChange={event => setReason(event.target.value)} placeholder="补充说明" rows={6} /></div>}
      {kind === 'eliminate' && <div className="risk-form"><label>原因</label><textarea value={reason} onChange={event => setReason(event.target.value)} placeholder="请输入理由" rows={4} /></div>}
      {kind === 'situation' && <div className="risk-form"><label>发生原因</label><textarea value={reason} onChange={event => setReason(event.target.value)} placeholder="请输入发生原因" rows={6} /><label>决策机构</label><textarea value={policyMaking} onChange={event => setPolicyMaking(event.target.value)} placeholder="请输入决策机构和会议类型" rows={6} /><label>上传附件</label><input type="file" onChange={event => setAttachment(event.target.files?.[0] || null)} /><label>是否报备集团</label><div><label><input type="radio" checked={reportOrNot === 1} onChange={() => setReportOrNot(1)} /> 是</label><label><input type="radio" checked={reportOrNot === 0} onChange={() => setReportOrNot(0)} /> 否</label></div>{reportOrNot === 1 && <><label>报备内容</label><textarea value={reportContent} onChange={event => setReportContent(event.target.value)} placeholder="请输入报备内容" rows={3} /></>}</div>}
      {(kind === 'confirm' || kind === 'eliminate' || kind === 'situation') && <div className="dialog-actions"><button className="primary" disabled={busy} onClick={() => void submit()}>提交</button><button onClick={onClose}>取消</button></div>}
      {(kind === 'detail' || kind === 'panorama') && <div className="dialog-actions"><button className="primary" onClick={onClose}>确定</button></div>}
    </div>
  </div>;
}

function DisposalPlanDialog({ row, steps, standalone = false, onClose, onSaved }: { row: RiskRecord; steps: PlanStep[]; standalone?: boolean; onClose?: () => void; onSaved?: () => void }) {
  const [planSteps, setPlanSteps] = useState<PlanStep[]>(() => steps.length ? steps : [{ id: `local-${Date.now()}`, step: '1', stepContent: '', planFinishDate: '', state: 0 }]);
  const [progressStep, setProgressStep] = useState<PlanStep | null>(null);
  const [progressRows, setProgressRows] = useState<PlanProgress[]>([]);
  const [updateStep, setUpdateStep] = useState<PlanStep | null>(null);
  const [progressContent, setProgressContent] = useState('');
  const [progressComplete, setProgressComplete] = useState(false);
  const [progressSaving, setProgressSaving] = useState(false);
  const [editingPlan, setEditingPlan] = useState(() => steps.length === 0);
  const [target, setTarget] = useState('');
  const [deadlineInput, setDeadlineInput] = useState('');
  const [notice, setNotice] = useState('');
  const [uploadStepId, setUploadStepId] = useState<string | undefined>();
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [planSaved, setPlanSaved] = useState(steps.length > 0);
  useEffect(() => { if (steps.length > 0) { setPlanSteps(steps); setTarget(steps[0]?.planTarget || ''); setDeadlineInput((steps[0]?.planDeadline || steps[0]?.planFinishDate || '').slice(0, 10)); setPlanSaved(true); setEditingPlan(false); } }, [steps]);
  const step = planSteps[0];
  const completeCount = planSteps.filter(item => item.state === 2 || item.state === 3 || item.state === 4).length;
  const total = planSteps.length;
  const deadline = step?.planDeadline || step?.planFinishDate;
  const hasPlan = planSaved;
  const openProgress = async (item: PlanStep) => {
    setProgressStep(item); setProgressRows([]); setNotice('');
    try { const token = await riskSessionToken(); const data = await fetch(`/api/supervise/disposal-steps/${encodeURIComponent(item.id || '')}/progress`, { headers: { Authorization: `Bearer ${token}`, token } }).then(response => response.json()); if (data.code === 0) setProgressRows(Array.isArray(data.data) ? data.data : []); else setNotice(data.msg || '读取进度失败'); } catch { setNotice('读取进度失败'); }
  };
  const saveProgress = async () => {
    if (!updateStep || !progressContent.trim()) { setNotice('请填写相关进度内容'); return; }
    if (!updateStep.id || updateStep.id.startsWith('local-')) { setNotice('请先保存处置计划，再维护执行进度'); return; }
    setProgressSaving(true); setNotice('');
    try {
      const token = await riskSessionToken();
      const result = await fetch(`/api/supervise/disposal-steps/${encodeURIComponent(updateStep.id)}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, token },
        body: JSON.stringify({ content: progressContent.trim(), completed: progressComplete, operator: '管理员' }),
      }).then(response => response.json());
      if (result.code !== 0) throw new Error(result.msg || '进度保存失败');
      const allStepsCompleted = progressComplete && planSteps.every(item => item.id === updateStep.id || item.state === 2 || item.state === 3 || item.state === 4);
      let completionSubmitted = false;
      if (allStepsCompleted) {
        const completion = await fetch(`/api/supervise/risk/${encodeURIComponent(row.id)}/disposal-complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, token },
          body: JSON.stringify({ operator: '管理员' }),
        }).then(response => response.json());
        if (completion.code !== 0) throw new Error(completion.msg || '处置步骤已完成，但自动提交完成审核失败');
        completionSubmitted = true;
      }
      const entry = { progressStepContent: progressContent.trim(), state: progressComplete ? 1 : 0, createTime: new Date().toLocaleString('sv-SE') };
      if (progressStep?.id === updateStep.id) setProgressRows(rows => [...rows, entry]);
      setPlanSteps(items => items.map(item => item.id === updateStep.id ? { ...item, state: progressComplete ? 2 : 1, actualFinishDate: progressComplete ? new Date().toLocaleDateString('sv-SE') : item.actualFinishDate } : item));
      setUpdateStep(null); setProgressContent(''); setNotice(completionSubmitted ? '全部步骤已完成，已自动提交处置完成审核' : progressComplete ? '完成进度已保存' : '执行进度已保存'); onSaved?.();
    } catch (error) { setNotice(error instanceof Error ? error.message : '进度保存失败'); }
    finally { setProgressSaving(false); }
  };
  const savePlan = async () => {
    if (!target.trim() || !deadlineInput || !planSteps.length || planSteps.some(item => !item.stepContent?.trim() || !item.planFinishDate)) { setNotice('请填写计划目标、截止日期和至少一个完整步骤'); return; }
    setNotice('正在保存处置计划…');
    try {
      const token = await riskSessionToken();
      const result = await fetch(`/api/supervise/risk/${encodeURIComponent(row.id)}/disposal-plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, token },
        body: JSON.stringify({ target: target.trim(), deadline: deadlineInput, operator: '管理员', steps: planSteps.map(item => ({ content: item.stepContent?.trim(), plannedAt: item.planFinishDate, responsiblePerson: item.responsiblePersonName || '', responsibleDepartment: '', responsibleDepartmentId: '', attachments: item.url || '', attachmentName: item.urlName || '' })) }),
      }).then(response => response.json());
      if (result.code !== 0) throw new Error(result.msg || '处置计划保存失败');
      setPlanSteps(items => items.map((item, index) => ({ ...item, step: String(index + 1), planTarget: target.trim(), planDeadline: deadlineInput })));
      setPlanSaved(true); setEditingPlan(false); setNotice(hasPlan ? '处置计划已更新' : '处置计划已制定'); onSaved?.(); if (standalone) onClose?.();
    } catch (error) { setNotice(error instanceof Error ? error.message : '处置计划保存失败'); }
  };
  const uploadAttachment = (file: File | undefined) => {
    if (!file || !uploadStepId) return;
    const url = URL.createObjectURL(file);
    setPlanSteps(items => items.map(item => item.id === uploadStepId ? { ...item, url, urlName: file.name } : item));
    setNotice(`已添加附件：${file.name}`); setUploadStepId(undefined);
  };
  if (standalone) return <div className="plan-subdialog edit-plan create-plan-dialog"><button className="dialog-close" onClick={onClose}>×</button><h3>制定处置计划</h3>{notice && <p className="plan-notice">{notice}</p>}<p><b>主责企业：</b>{row.enterpriseName || '--'}</p><h4 className="plan-risk-title">风险内容</h4><div className="plan-risk-content">{row.riskContent || '--'}</div><label>计划总目标<textarea value={target} onChange={event => setTarget(event.target.value)} placeholder="请输入计划总目标" /></label><label>计划截止日期<input type="date" value={deadlineInput} onChange={event => setDeadlineInput(event.target.value)} /></label><table className="action-data-table"><thead><tr><th>步骤</th><th>内容</th><th>计划完成时间</th><th>操作</th></tr></thead><tbody>{planSteps.map((item, index) => <tr key={item.id || index}><td>{index + 1}</td><td><input value={item.stepContent || ''} placeholder="请输入内容" onChange={event => setPlanSteps(items => items.map((x, i) => i === index ? { ...x, stepContent: event.target.value } : x))} /></td><td><input type="date" value={(item.planFinishDate || '').slice(0, 10)} onChange={event => setPlanSteps(items => items.map((x, i) => i === index ? { ...x, planFinishDate: event.target.value } : x))} /></td><td><button className="text-danger" onClick={() => setPlanSteps(items => items.filter((_, i) => i !== index))}>删除</button></td></tr>)}</tbody></table><button className="add-step" onClick={() => setPlanSteps(items => [...items, { id: `local-${Date.now()}`, step: String(items.length + 1), stepContent: '', planFinishDate: deadlineInput, state: 0 }])}>⊕ 添加步骤</button><div className="dialog-actions"><button className="primary" onClick={() => void savePlan()}>保存</button><button onClick={onClose}>取消</button></div></div>;
  return <section className="disposal-plan-content">
    {notice && <p className="plan-notice">{notice}</p>}
    {!hasPlan && <div className="plan-empty-state">尚未制定处置计划，正在打开“制定处置计划”窗口。</div>}
    {hasPlan && <><div className="disposal-completion-banner"><span>申请完成状态：</span><b><i>✓</i>{completeCount === total ? '全部完成' : '进行中'}</b><span>申请完成：{completeCount} 步 / 共 {total} 步</span></div>
    <div className="disposal-target-card">
      <div className="disposal-target-main"><div className="disposal-target-heading"><i>◎</i><b>总目标</b></div><p>{step?.planTarget || '--'}</p><small>主责企业：{row.enterpriseName || '--'}<em>|</em>计划完成时间：{deadline ? deadline.slice(0, 10) : '--'}</small></div>
      <button type="button" className="disposal-edit" onClick={() => setEditingPlan(true)}>♢ <span>修改处置计划</span></button>
    </div>
    <table className="disposal-step-table"><thead><tr><th>步骤</th><th>内容</th><th>责任人</th><th>计划完成时间</th><th>实际完成时间</th><th>状态</th><th>操作</th></tr></thead><tbody>{planSteps.map((item, index) => <tr key={item.id || index}><td>{item.step || index + 1}</td><td>{item.stepContent || '--'}</td><td>{item.responsiblePersonName || '--'}</td><td>{item.planFinishDate ? item.planFinishDate.slice(0, 10) : '--'}</td><td>{item.actualFinishDate ? item.actualFinishDate.slice(0, 10) : '--'}</td><td><span className={`plan-state plan-state-${item.state ?? -1}`}>{item.state === 2 ? '申请完成' : planStepStates[item.state ?? -1]?.label || '--'}</span></td><td>{item.state === 0 ? <button type="button" onClick={() => { setUpdateStep(item); setProgressContent(''); setProgressComplete(false); }}>开始执行</button> : <><button type="button" onClick={() => void openProgress(item)}>查看</button>{item.state === 1 && <button type="button" onClick={() => { setUpdateStep(item); setProgressContent(''); setProgressComplete(false); }}>更新进度</button>}</>} {item.url && <button type="button" className="plan-download" title={item.urlName || '下载附件'} onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}>↓</button>}<button type="button" className="plan-upload" title="上传附件" onClick={() => { setUploadStepId(item.id); uploadInputRef.current?.click(); }}>↑</button></td></tr>)}</tbody></table>
    <footer className="disposal-plan-pager"><span>共 {total} 条</span><button type="button">10条/页 <i>⌄</i></button><button type="button" disabled>‹</button><b>1</b><button type="button" disabled>›</button><span>前往</span><input value="1" readOnly aria-label="前往页码" /><span>页</span></footer>
    </>}
    <input ref={uploadInputRef} className="plan-file-input" type="file" onChange={event => uploadAttachment(event.target.files?.[0])} />
    {progressStep && <div className="plan-layer"><div className="plan-subdialog progress-view"><button className="dialog-close" onClick={() => setProgressStep(null)}>×</button><h3>查看计划进度</h3><div className="progress-current"><b>▣ 当前计划步骤</b><p>{progressStep.stepContent || '--'}</p><small>负责人：{progressStep.responsiblePersonName || '--'}　计划完成时间：{(progressStep.planFinishDate || '--').slice(0, 10)}</small></div><table className="action-data-table"><thead><tr><th>序号</th><th>内容</th><th>状态</th><th>时间</th><th>操作</th></tr></thead><tbody>{progressRows.length ? progressRows.map((item, index) => <tr key={item.id || index}><td>{index + 1}</td><td>{item.progressStepContent || '--'}</td><td><span className={`plan-state plan-state-${item.state === 1 ? 2 : 1}`}>{item.state === 1 ? '申请完成' : '进行中'}</span></td><td>{item.createTime || '--'}</td><td><button className="text-danger" onClick={() => setProgressRows(rows => rows.filter((_, i) => i !== index))}>删除</button></td></tr>) : <tr><td colSpan={5}>暂无数据</td></tr>}</tbody></table><div className="dialog-actions"><button onClick={() => { setUpdateStep(progressStep); setProgressContent(''); setProgressComplete(false); }}>⟳ 更新进度</button></div></div></div>}
    {updateStep && <div className="plan-layer"><div className="plan-subdialog update-progress"><button className="dialog-close" disabled={progressSaving} onClick={() => setUpdateStep(null)}>×</button><h3>更新进度</h3><label>状态 <input type="radio" checked={!progressComplete} onChange={() => setProgressComplete(false)} /> 进行中　<input type="radio" checked={progressComplete} onChange={() => setProgressComplete(true)} /> 申请完成</label><label>内容<textarea value={progressContent} onChange={event => setProgressContent(event.target.value)} placeholder="请输入相关进度内容" /></label><div className="dialog-actions"><button className="primary" disabled={progressSaving} onClick={() => void saveProgress()}>{progressSaving ? '保存中…' : '保存'}</button><button disabled={progressSaving} onClick={() => setUpdateStep(null)}>取消</button></div></div></div>}
    {editingPlan && <div className="plan-layer"><div className="plan-subdialog edit-plan"><button className="dialog-close" onClick={() => setEditingPlan(false)}>×</button><h3>{hasPlan ? '修改处置计划' : '制定处置计划'}</h3><p><b>主责企业：</b>{row.enterpriseName || '--'}</p><label>计划总目标<textarea value={target} onChange={event => setTarget(event.target.value)} /></label><label>计划截止日期<input type="date" value={deadlineInput} onChange={event => setDeadlineInput(event.target.value)} /></label><table className="action-data-table"><thead><tr><th>步骤</th><th>内容</th><th>计划完成时间</th><th>操作</th></tr></thead><tbody>{planSteps.map((item, index) => <tr key={item.id || index}><td>{index + 1}</td><td><input value={item.stepContent || ''} onChange={event => setPlanSteps(items => items.map((x, i) => i === index ? { ...x, stepContent: event.target.value } : x))} /></td><td><input type="date" value={(item.planFinishDate || '').slice(0, 10)} onChange={event => setPlanSteps(items => items.map((x, i) => i === index ? { ...x, planFinishDate: event.target.value } : x))} /></td><td><button className="text-danger" onClick={() => setPlanSteps(items => items.filter((_, i) => i !== index))}>删除</button></td></tr>)}</tbody></table><button className="add-step" onClick={() => setPlanSteps(items => [...items, { id: `local-${Date.now()}`, step: String(items.length + 1), stepContent: '', planFinishDate: deadlineInput, state: 0 }])}>⊕ 添加步骤</button><div className="dialog-actions"><button className="primary" onClick={() => void savePlan()}>{hasPlan ? '修改' : '保存'}</button><button onClick={() => setEditingPlan(false)}>取消</button></div></div></div>}
  </section>;
}

function RiskLogTable({ rows }: { rows: RiskLog[] }) { return <table className="action-data-table"><thead><tr><th>序号</th><th>审批人</th><th>操作时间</th><th>操作</th><th>理由</th></tr></thead><tbody>{rows.length ? rows.map((item, index) => <tr key={item.id || index}><td>{index + 1}</td><td>{item.operatorName || item.operator || '--'}</td><td>{item.operatorTime || '--'}</td><td>{item.operatoCategory || '--'}</td><td>{item.remark || item.handleReason || '--'}</td></tr>) : <tr><td colSpan={5}>暂无数据</td></tr>}</tbody></table>; }
function PlanStepTable({ rows }: { rows: PlanStep[] }) { return <table className="action-data-table"><thead><tr><th>步骤</th><th>内容</th><th>责任人</th><th>计划完成时间</th><th>实际完成时间</th><th>状态</th></tr></thead><tbody>{rows.length ? rows.map((item, index) => <tr key={item.id || index}><td>{item.step || index + 1}</td><td>{item.stepContent || '--'}</td><td>{item.responsiblePersonName || '--'}</td><td>{item.planFinishDate ? item.planFinishDate.slice(0, 10) : '--'}</td><td>{item.actualFinishDate ? item.actualFinishDate.slice(0, 10) : '--'}</td><td>{item.state === 2 ? '已完成' : planStepStates[item.state ?? -1]?.label || '--'}</td></tr>) : <tr><td colSpan={6}>暂无数据</td></tr>}</tbody></table>; }

type SystemRow = Record<string, unknown>;
const companyGroups: Record<string, string> = {
  supv_enterprise_type_wholly: "全资企业",
  supv_enterprise_type_holding: "控股企业",
  supv_enterprise_type_participation: "参股企业",
  supv_enterprise_type_controll: "控股不控权企业",
  supv_enterprise_type_controll_affiliate: "控股不控权关联企业",
  supv_enterprise_type_holding_other_shareholder: "控股企业其他股东",
  supv_enterprise_type_participation_controll: "参股企业实际控制人",
  supv_enterprise_type_participation_related: "参股企业关联企业",
  supv_enterprise_type_manage_fund: "主动管理型基金",
  supv_enterprise_type_holding_comp: "主动管理型基金控股企业",
  supv_enterprise_type_participation_comp: "主动管理型基金参股企业",
  supv_enterprise_type_invest_sub: "主动管理型基金投资的子基金",
  supv_enterprise_type_invest_comp_controll: "主动管理型基金参股企业的实际控制人",
  supv_enterprise_type_manage_fund_manager: "基金执行事务合伙人/基金管理人",
  supv_enterprise_type_invest_sub_participation_comp: "主动管理型基金投资的子基金的参股企业",
  supv_enterprise_type_participate_fund: "参与基金",
  supv_enterprise_type_participate_fund_invest_comp: "参与基金投资企业",
  supv_enterprise_type_manage: "集团直管",
};
const plates: Record<string, string> = {
  groupHeadquarters: "集团本部",
  huatongChuangtou: "华通创投",
  huatongJinkong: "华通金控",
  cityIndustrialPark: "都市产业园",
  staticTraffic: "静态交通",
  groupDirectManagement: "集团直管",
  assetCompany: "华通资产",
  dataGroup: "数据集团",
  careCentre: "托管中心",
  kWQingdao: "KW青岛",
  hisenseGroup: "海信集团",
  qingshiStock: "青食股份",
  jointNavigation: "联合通航",
  haiyiPlasticIndustry: "海益塑业",
  huaTongZhiDian: "华通智电",
};
const categoryOne: Record<string, string> = {
  supv_risk_cat_main: "主体资质与工商管控风险",
  supv_risk_cat_stock: "股权穿透与股东管控风险",
  supv_risk_cat_governance: "治理与人员管控风险",
  supv_risk_cat_law: "法律与司法涉诉风险",
  supv_risk_cat_penalty: "行政处罚与合规惩戒风险",
  supv_risk_cat_business: "经营运营与资质合规风险",
  supv_risk_cat_bidding: "招投标与关联交易管控风险",
  supv_risk_cat_capital: "投资与资本运作管控风险",
  supv_risk_cat_financial: "财务与资金管控风险",
  supv_risk_cat_asset: "资产与知识产权管控风险",
  supv_risk_cat_safety: "安全环保与特殊行业管控风险",
  supv_risk_cat_sentiment: "关联与舆情穿透管控风险",
  supv_risk_cat_finance: "财务与资金管控风险",
};
const categoryTwo: Record<string, string> = {
  supv_risk_type_equity_structure: "股权结构管控",
  ...riskTypes,
  supv_risk_type_financial: "财务数据管控",
};
const enterpriseTypeOptions = [
  ["supv_enterprise_type_wholly", "全资企业"], ["supv_enterprise_type_manage", "集团直管"], ["supv_enterprise_type_holding", "控股企业"], ["supv_enterprise_type_controll", "控股不控权企业"], ["supv_enterprise_type_controll_affiliate", "控股不控权关联企业"], ["supv_enterprise_type_holding_other_shareholder", "控股企业其他股东"], ["supv_enterprise_type_participation", "参股企业"], ["supv_enterprise_type_participation_controll", "参股企业实际控制人"], ["supv_enterprise_type_participation_related", "参股企业关联企业"], ["supv_enterprise_type_manage_fund", "主动管理型基金"], ["supv_enterprise_type_holding_comp", "主动管理型基金控股企业"], ["supv_enterprise_type_participation_comp", "主动管理型基金参股企业"], ["supv_enterprise_type_invest_sub", "主动管理型基金投资的子基金"], ["supv_enterprise_type_invest_comp_controll", "主动管理型基金参股企业的实际控制人"], ["supv_enterprise_type_manage_fund_manager", "基金执行事务合伙人/基金管理人"], ["supv_enterprise_type_invest_sub_participation_comp", "主动管理型基金投资的子基金的参股企业"], ["supv_enterprise_type_participate_fund", "参与基金"], ["supv_enterprise_type_participate_fund_invest_comp", "参与基金投资企业"],
] as const;
function SystemDataView({ kind }: { kind: "company" | "indicator" }) {
  const isCompany = kind === "company";
  const [rows, setRows] = useState<SystemRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [jump, setJump] = useState("1");
  const [editor, setEditor] = useState<"create" | "edit" | "risk" | null>(null);
  const [selected, setSelected] = useState<SystemRow | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [riskByEnterprise, setRiskByEnterprise] = useState<Record<string, string>>({});
  const [importantEnterprises, setImportantEnterprises] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
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
  useEffect(() => {
    if (editor !== "risk" || !selected?.id) return;
    void fetch(`/api/supervise/index/risk?indexId=${selected.id}`).then((response) => response.json()).then((result) => {
      const settings = result.data || [];
      if (!Array.isArray(settings) || settings.length === 0) return;
      setRiskByEnterprise(Object.fromEntries(settings.map((setting) => [String(setting.enterpriseType), String(setting.riskLevel)])));
      setImportantEnterprises(settings.filter((setting) => Number(setting.importantMatter) === 1).map((setting) => String(setting.enterpriseType)));
    }).catch(() => undefined);
  }, [editor, selected?.id]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2200);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const maxPage = Math.max(1, Math.ceil(total / 10));
  const pageItems = [1, 2, 3, 4, 5, 6, "…", maxPage].filter(
    (x, i, a) => a.indexOf(x) === i,
  );
  const go = (value: number) => {
    const next = Math.max(1, Math.min(maxPage, value));
    setJump(String(next));
    void load(next);
  };
  const setField = (name: string, value: string) => setForm((current) => ({ ...current, [name]: value }));
  const openEditor = (mode: "create" | "edit" | "risk", row: SystemRow | null = null) => {
    setSelected(row);
    setForm(mode === "create" ? {} : Object.fromEntries(Object.entries(row || {}).map(([key, value]) => [key, value == null ? "" : String(value)])));
    if (mode === "risk") {
      setRiskByEnterprise(Object.fromEntries(enterpriseTypeOptions.map(([code]) => [code, String(row?.riskLevel ?? "1")] )));
      setImportantEnterprises([]);
    }
    setEditor(mode);
  };
  const save = async () => {
    const base = `/api/supervise/${isCompany ? "enterprise" : "index"}`;
    const id = selected?.id;
    const url = editor === "create" ? base : editor === "risk" ? `${base}/risk` : base;
    const method = editor === "create" || editor === "risk" ? "POST" : "PUT";
    const payload = editor === "risk" ? {
      indexId: id,
      riskLevelList: ["2", "1", "0"].map((riskLevel) => ({ riskLevel, enterpriseTypeList: enterpriseTypeOptions.filter(([code]) => riskByEnterprise[code] === riskLevel).map(([code]) => code) })),
      importantMatterList: ["0", "1"].map((importantMatter) => ({ importantMatter, enterpriseTypeList: enterpriseTypeOptions.filter(([code]) => importantEnterprises.includes(code) === (importantMatter === "1")).map(([code]) => code) })),
    } : { ...form, ...(editor === "edit" ? { id } : {}) };
    try {
      const result = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).then((response) => response.json());
      if (result.code !== 0) throw new Error(result.msg || "保存失败");
      setEditor(null); setNotice(editor === "create" ? "新增成功" : "修改成功"); await load(page);
    } catch (error) { window.alert(error instanceof Error ? error.message : "保存失败"); }
  };
  const remove = async (row: SystemRow) => {
    if (!window.confirm(`确认删除“${String(row[isCompany ? "enterpriseName" : "indicatorName"])}”吗？`)) return;
    try {
      const result = await fetch(`/api/supervise/${isCompany ? "enterprise" : "index"}/${row.id}`, { method: "DELETE" }).then((response) => response.json());
      if (result.code !== 0) throw new Error(result.msg || "删除失败");
      setNotice("删除成功");
      await load(rows.length === 1 && page > 1 ? page - 1 : page);
    } catch (error) { window.alert(error instanceof Error ? error.message : "删除失败"); }
  };
  return (
    <main className={`module-page system-data-page ${isCompany ? 'company-data-page' : 'indicator-data-page'}`}>
      {notice && <div className="operation-notice" role="status"><i>✓</i>{notice}</div>}
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
          <button className="primary" onClick={() => openEditor("create")}>
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
                      {String(row.enterpriseGroupName || companyGroups[String(row.enterpriseGroup)] ||
                        String(row.enterpriseGroup || "--"))}
                    </td>
                    <td>
                      {String(row.belongingPlateName || plates[String(row.belongingPlateId)] ||
                        String(row.belongingPlateId || "--"))}
                    </td>
                    <td>{String(row.updateTime || row.createTime || "--")}</td>
                    <td className="actions">
                      <a onClick={() => openEditor("edit", row)}>编辑</a>
                      <a className="danger" onClick={() => void remove(row)}>删除</a>
                    </td>
                  </tr>
                ) : (
                  <tr key={String(row.id)}>
                    <td>{(page - 1) * 10 + index + 1}</td>
                    <td>{String(row.indicatorName || "--")}</td>
                    <td>
                      {String(row.indicatorCategory1Name || categoryOne[String(row.indicatorCategory1)] ||
                        String(row.indicatorCategory1 || "--"))}
                    </td>
                    <td>
                      {String(row.indicatorCategory2Name || categoryTwo[String(row.indicatorCategory2)] ||
                        String(row.indicatorCategory2 || "--"))}
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
                      <a className="danger" onClick={() => void remove(row)}>删除</a>
                      <a onClick={() => openEditor("edit", row)}>编辑</a>
                      <a onClick={() => openEditor("risk", row)}>风险级别设置</a>
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
      {editor && <div className="dialog-mask" role="dialog" aria-modal="true">
        <div className="review-dialog edit-dialog">
          <button className="dialog-close" onClick={() => setEditor(null)}>×</button>
          <h3>{editor === "risk" ? "风险级别设置" : `${editor === "create" ? "新增" : "修改"}${isCompany ? "企业" : "指标"}`}</h3>
          {editor === "risk" ? <div className="risk-setting-dialog">
            <p><b>指标名称：</b>{String(selected?.indicatorName || "--")}</p>
            {[['2', '高风险'], ['1', '中风险'], ['0', '低风险']].map(([level, title]) => {
              const selectedTypes = enterpriseTypeOptions.filter(([code]) => riskByEnterprise[code] === level).map(([code]) => code);
              const allSelected = selectedTypes.length === enterpriseTypeOptions.length;
              return <section className="risk-setting-group" key={level}>
                <h4>风险等级： <b>{title}</b><label><input type="checkbox" checked={allSelected} onChange={(event) => setRiskByEnterprise((current) => ({ ...current, ...Object.fromEntries(enterpriseTypeOptions.map(([code]) => [code, event.target.checked ? level : ""])) }))} /> 全选</label></h4>
                <div className="risk-setting-grid">{enterpriseTypeOptions.map(([code, label]) => <label key={code}><input type="checkbox" checked={riskByEnterprise[code] === level} onChange={(event) => setRiskByEnterprise((current) => ({ ...current, [code]: event.target.checked ? level : "" }))} /> {label}</label>)}</div>
              </section>;
            })}
            <section className="risk-setting-group important-setting"><h4>是否重大事项：<label><input type="checkbox" checked={importantEnterprises.length === enterpriseTypeOptions.length} onChange={(event) => setImportantEnterprises(event.target.checked ? enterpriseTypeOptions.map(([code]) => code) : [])} /> 全选</label></h4><div className="risk-setting-grid">{enterpriseTypeOptions.map(([code, label]) => <label key={code}><input type="checkbox" checked={importantEnterprises.includes(code)} onChange={(event) => setImportantEnterprises((current) => event.target.checked ? [...current, code] : current.filter((value) => value !== code))} /> {label}</label>)}</div></section>
          </div> : isCompany ? <div className="company-form">
            <label className="form-label required">企业名称<input value={form.enterpriseName || ""} onChange={(event) => setField("enterpriseName", event.target.value)} placeholder="请输入企业名称" /></label>
            <label className="form-label required">上级企业<select value={form.parentEnterprise || ""} onChange={(event) => setField("parentEnterprise", event.target.value)}><option value="">请选择上级企业</option>{rows.filter((row) => row.id !== selected?.id).map((row) => <option key={String(row.id)} value={String(row.enterpriseName)}>{String(row.enterpriseName)}</option>)}</select></label>
            <label className="form-label required">管理主体<select value={form.belongingPlateId || ""} onChange={(event) => setField("belongingPlateId", event.target.value)}><option value="">请选择管理主体</option>{Object.entries(plates).map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label>
            <label className="form-label">统一社会信用代码<input readOnly={editor === "edit"} value={form.creditCode || ""} onChange={(event) => setField("creditCode", event.target.value)} placeholder="请输入统一社会信用代码" /></label>
            <label className="form-label required">企业分组<select value={form.enterpriseGroup || ""} onChange={(event) => setField("enterpriseGroup", event.target.value)}><option value="">请选择企业分组</option>{Object.entries(companyGroups).map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label>
            <label className="form-label">持股比例<input value={form.shareholdingRatio || ""} onChange={(event) => setField("shareholdingRatio", event.target.value)} placeholder="请输入持股比例" /></label>
            <label className="form-label">投资金额<input value={form.investmentAmount || ""} onChange={(event) => setField("investmentAmount", event.target.value)} placeholder="请输入投资金额" /></label>
            <label className="form-label">图片上传<input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = () => setField("image", String(reader.result || "")); reader.readAsDataURL(file); } }} /></label>
            {form.image && <img className="company-preview" src={form.image} alt="企业图片预览" />}
            <label className="form-label form-textarea">备注<textarea value={form.remark || ""} onChange={(event) => setField("remark", event.target.value)} placeholder="请输入备注" /></label>
          </div>
          : <>
            <label className="form-label">指标名称<input value={form.indicatorName || ""} onChange={(event) => setField("indicatorName", event.target.value)} placeholder="请输入指标名称" /></label>
            <label className="form-label">指标大类<select value={form.indicatorCategory1 || ""} onChange={(event) => setField("indicatorCategory1", event.target.value)}><option value="">请选择指标大类</option>{Object.entries(categoryOne).filter(([code]) => code !== "supv_risk_cat_finance").map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label>
            <label className="form-label">指标子类<select value={form.indicatorCategory2 || ""} onChange={(event) => setField("indicatorCategory2", event.target.value)}><option value="">请选择指标子类</option>{Object.entries(categoryTwo).filter(([code]) => code !== "supv_risk_type_financial").map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label>
            <label className="form-label">指标状态<select value={form.indicatorStatus || "1"} onChange={(event) => setField("indicatorStatus", event.target.value)}><option value="1">启用</option><option value="0">停用</option></select></label>
            <label className="form-label">指标来源<select value={form.indicatorSource || "1"} onChange={(event) => setField("indicatorSource", event.target.value)}><option value="0">企查查</option><option value="1">运营平台</option><option value="2">金企通</option></select></label>
            <label className="form-label">主管部门<input value={form.manageDeptId || ""} onChange={(event) => setField("manageDeptId", event.target.value)} placeholder="请输入主管部门" /></label>
            <label className="form-label">关联部门<input value={form.associatedDepartment || ""} onChange={(event) => setField("associatedDepartment", event.target.value)} placeholder="请输入关联部门" /></label>
            <label className="form-label">是否人工确认<select value={form.confirmByClient || "0"} onChange={(event) => setField("confirmByClient", event.target.value)}><option value="0">否</option><option value="1">是</option></select></label>
            <label className="form-label">分值<input type="number" value={form.score || "0"} onChange={(event) => setField("score", event.target.value)} /></label>
            <label className="form-label">企查查指标名称<input value={form.qccName || ""} onChange={(event) => setField("qccName", event.target.value)} placeholder="请输入企查查指标名称" /></label>
            <label className="form-label">指标定义备注<textarea value={form.remark || ""} onChange={(event) => setField("remark", event.target.value)} placeholder="请输入备注" /></label>
          </>}
          <div className="dialog-actions"><button onClick={() => setEditor(null)}>取消</button><button className="primary" onClick={() => void save()}>确认</button></div>
        </div>
      </div>}
    </main>
  );
}
type ReviewRow = {
  id: number | string;
  enterprise: string;
  indicator: string;
  content: string;
  level: string;
  type: string;
  status: string;
  operator: string;
  time: string;
  progress?: string;
  reviewType?: 'CONFIRMATION' | 'ELIMINATION' | 'DISPOSAL' | 'LEVEL_CHANGE';
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
  const [reviewMode, setReviewMode] = useState<'pending' | 'reviewed'>('pending');
  const [modal, setModal] = useState<{ kind: string; row: ReviewRow } | null>(
    null,
  );
  const [opinion, setOpinion] = useState("同意");
  const [reason, setReason] = useState("");
  const [auditMessage, setAuditMessage] = useState("");
  const [auditLogs, setAuditLogs] = useState<RiskLog[]>([]);
  const [reviewed, setReviewed] = useState<(number | string)[]>([]);
  const [remoteRows, setRemoteRows] = useState<ReviewRow[]>([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [selected, setSelected] = useState<(number | string)[]>([]);
  const [filters, setFilters] = useState({ status: '', group: '', type: '', level: '', enterprise: '', start: '', end: '' });
  useEffect(() => { if (!modal) { setAuditLogs([]); return; } void riskSessionToken().then(token => fetch(`/api/supervise/risk/superviseRiskOperationLog/getLogByRiskId?riskId=${encodeURIComponent(String(modal.row.id))}`, { headers: { Authorization: `Bearer ${token}`, token } }).then(response => response.json())).then(result => setAuditLogs(result?.code === 0 && Array.isArray(result.data) ? result.data : [])).catch(() => setAuditLogs([])); }, [modal]);
  const riskTab = reviewMode === 'reviewed' || tab !== "动态调整审核";
  const plan = tab === "处置计划完成审核";
  useEffect(() => { setReviewPage(1); void riskSessionToken().then(token => fetch(`/api/supervise/risk/${reviewMode === 'pending' ? 'pending-reviews' : 'reviewed-reviews'}`, { headers: { Authorization: `Bearer ${token}`, token } }).then(r => r.json())).then(result => { if (result?.code !== 0) { setRemoteRows([]); return; } setRemoteRows((result.data || []).map((item: Record<string, string | number>) => ({ id: item.riskId, enterprise: String(item.enterpriseName || '--'), indicator: String(item.riskIndicator || '--'), content: String(item.riskContent || '--'), level: riskLevels[String(item.riskLevel)] || String(item.riskLevel || '--'), type: riskTypes[String(item.riskType)] || String(item.riskType || '--'), status: reviewMode === 'reviewed' ? '已审核' : item.reviewType === 'DISPOSAL' ? '完成待审核' : riskStates[Number(item.operationStatus)] || '等级变动待审核', operator: String(item.reviewer || '管理员'), time: String(item.reviewedAt || item.occurTime || '--'), reviewType: item.reviewType as ReviewRow['reviewType'] }))); }).catch(() => setRemoteRows([])); }, [reviewMode]);
  const reviewTypesForTab: Record<string, ReviewRow['reviewType'][]> = {
    '风险状态审核': ['CONFIRMATION', 'ELIMINATION'],
    '风险等级变化审核': ['LEVEL_CHANGE'],
    '处置计划完成审核': ['DISPOSAL'],
  };
  const tabReviews = reviewMode === 'reviewed' ? remoteRows : remoteRows.filter(row => reviewTypesForTab[tab]?.includes(row.reviewType));
  const filteredReviews = tabReviews.filter((row) => (!filters.status || row.status.includes(filters.status)) && (!filters.type || row.type === filters.type) && (!filters.level || row.level === filters.level) && (!filters.enterprise || row.enterprise.includes(filters.enterprise)) && (!filters.start || row.time.slice(0, 10) >= filters.start) && (!filters.end || row.time.slice(0, 10) <= filters.end));
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
    setAuditMessage('');
    try {
      const login = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uuid: crypto.randomUUID(), username: 'admin', password: 'admin' }) }).then(r => r.json());
      const token = login?.data?.token;
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, token };
      const approved = opinion === '同意';
      const type = modal.row.reviewType;
      const url = type === 'CONFIRMATION' ? `/api/supervise/risk/${modal.row.id}/confirmation-audit` : type === 'ELIMINATION' ? `/api/supervise/risk/${modal.row.id}/elimination-audit` : type === 'DISPOSAL' ? `/api/supervise/risk/${modal.row.id}/disposal-audit` : `/api/supervise/risk/${modal.row.id}/level-change-audit`;
      const body = type === 'CONFIRMATION' ? { auditStatus: approved ? 0 : 1, handleReason: reason.trim(), operator: '管理员' } : { approved, opinion: reason.trim(), operator: '管理员' };
      const result = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) }).then(r => r.json());
      if (result.code !== 0) throw new Error(result.msg || '审核失败');
    } catch (error) { const message = error instanceof Error ? error.message : '审核提交失败'; console.error('风险审核提交失败', error); setAuditMessage(message); return; }
    setReviewed([...reviewed, modal.row.id]);
    if (reviewMode === 'pending') setRemoteRows(current => current.filter(row => row.id !== modal.row.id));
    setModal(null);
    setReason('');
  };
  return (
    <main className="module-page pending-page">
      <aside className="side-menu pending-side">
        <div className="side-heading">◉ 风险推送</div>
        <div className="side-heading">♟ 我的审核</div>
        <button className={`side-item ${reviewMode === 'pending' ? 'selected' : ''}`} onClick={() => setReviewMode('pending')}>待审核</button>
        <button className={`side-item ${reviewMode === 'reviewed' ? 'selected' : ''}`} onClick={() => setReviewMode('reviewed')}>已审核</button>
        <div className="side-heading">▧ 风险统计提醒</div>
      </aside>
      <section className="pending-content">
        <h2>{reviewMode === 'pending' ? '待审核' : '已审核'}</h2>
        <div className="pending-card">
          {reviewMode === 'pending' && <div className="review-tabs">
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
          </div>}
          {riskTab ? (
            <>
              <div className="review-filter">
                <PendingCascader placeholder="请选择类型" value={filters.status ? filters.status.split(',').map(item => item === '确认' ? '风险确认' : '风险消除') : []} onChange={v => updateFilter('status', v.map(item => item === '风险确认' ? '确认' : '消除').join(','))} items={[{ label: '风险确认' }, { label: '风险消除' }]} />
                <PendingCascader placeholder="请选择企业分组" value={filters.group ? filters.group.split(',') : []} onChange={v => updateFilter('group', v.join(','))} items={[{ label: '全资企业', children: ['全资企业'] }, { label: '控股企业', children: ['控股企业', '控股不控权企业', '控股不控权关联企业', '控股企业其他股东'] }, { label: '参股企业', children: ['参股企业'] }, { label: '主动管理型基金', children: ['主动管理型基金'] }, { label: '参与基金', children: ['参与基金'] }, { label: '集团本部', children: ['集团本部'] }]} />
                <PendingCascader placeholder="请选择风险类型" value={filters.type ? filters.type.split(',') : []} onChange={v => updateFilter('type', v.join(','))} items={[{ label: '主体资质与工商管控风险', children: ['工商主体基础管控'] }, { label: '股权穿透与股东管控风险', children: ['股东/投资人核心管控', '股权结构管控'] }, { label: '治理与人员管控风险', children: ['治理与人员管控'] }, { label: '法律与司法涉诉风险', children: ['法律与司法涉诉'] }, { label: '行政处罚与合规惩戒风险', children: ['行政处罚与合规惩戒'] }, { label: '经营运营与资质合规风险', children: ['经营运营与资质合规'] }]} />
                <select value={filters.level} onChange={e => updateFilter('level', e.target.value)}>
                  <option value="">请选择风险级别</option><option>高风险</option><option>中风险</option><option>低风险</option>
                </select>
                <input value={filters.enterprise} onChange={e => updateFilter('enterprise', e.target.value)} placeholder="请输入企业名称" />
                <input value={filters.start} onChange={e => updateFilter('start', e.target.value)} type="date" aria-label="开始日期" />
                <span>至</span>
                <input value={filters.end} onChange={e => updateFilter('end', e.target.value)} type="date" aria-label="结束日期" />
                <button className="primary" onClick={() => setReviewPage(1)}>查询</button>
                <button onClick={resetFilters}>重置</button>
                {reviewMode === 'pending' && <button disabled={!selected.length} onClick={() => { const row = rows.find(r => r.id === selected[0]); if (row) setModal({ kind: '审核', row }); }}>批量审核</button>}
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
                          {reviewMode === 'pending' && <a onClick={() => setModal({ kind: "审核", row: r })}>审核</a>}
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
            <span>共 {riskTab ? filteredReviews.length : 3} 条</span>
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
          <div className={`review-dialog ${modal.kind === "审核" ? "risk-review-modal" : ""} ${modal.kind === "指标全景" ? "panorama-dialog" : ""}`}>
            <button className="dialog-close" type="button" aria-label="关闭" onClick={() => setModal(null)}>×</button>
            <h3>{modal.kind === "审核" ? "风险审核" : modal.kind === "详情" ? "风险详情" : modal.kind}</h3>
            {modal.kind === "审核" ? (
              <>
                {auditMessage && <p className="risk-action-message">{auditMessage}</p>}
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
                <RiskLogTable rows={auditLogs} />
                <div className="dialog-actions">
                  <button className="primary" onClick={approve}>
                    确定
                  </button>
                  <button onClick={() => setModal(null)}>取消</button>
                </div>
              </>
            ) : modal.kind === "指标全景" ? (
              <PendingRiskPanorama enterpriseName={modal.row.enterprise} />
            ) : (
              <>
                <div className="detail-grid"><label>风险级别</label><span>{modal.row.level}</span><label>企业名称</label><span>{modal.row.enterprise}</span><label>风险指标</label><span>{modal.row.indicator}</span><label>风险类型</label><span>{modal.row.type}</span><label>审核状态</label><span>{modal.row.status}</span><label>发生时间</label><span>{modal.row.time}</span><label>风险内容</label><span>{modal.row.content}</span></div>
                <div className="audit-log-title">操作记录</div><RiskLogTable rows={auditLogs} />
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
function PendingRiskPanorama({ enterpriseName }: { enterpriseName: string }) {
  const [rows, setRows] = useState<RiskRecord[]>([]);
  useEffect(() => { void riskSessionToken().then(token => fetch(`/api/supervise/risk/page?pageNum=1&pageSize=30&enterpriseName=${encodeURIComponent(enterpriseName)}`, { headers: { Authorization: `Bearer ${token}`, token } }).then(response => response.json())).then(result => { if (result?.code === 0) setRows(result.data?.list || []); }).catch(() => setRows([])); }, [enterpriseName]);
  return <table className="panorama-table"><thead><tr><th>序号</th><th>企业名称</th><th>风险指标</th><th>风险内容</th><th>风险级别</th><th>风险类型</th><th>企业分组</th><th>管理主体</th><th>发生日期</th></tr></thead><tbody>{rows.length ? rows.map((item, index) => <tr key={item.id}><td>{index + 1}</td><td>{item.enterpriseName}</td><td>{item.riskIndicator}</td><td>{item.riskContent}</td><td>{riskLevels[item.riskLevel || ''] || item.riskLevel || '--'}</td><td>{riskTypes[item.riskType || ''] || item.riskType || '--'}</td><td>{riskGroups[item.enterpriseGroup || ''] || item.enterpriseGroup || '--'}</td><td>{riskManagers[item.belongingPlateId || ''] || item.belongingPlateId || '--'}</td><td>{item.occurTime || '--'}</td></tr>) : <tr><td colSpan={9}>暂无数据</td></tr>}</tbody></table>;
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
  const [loggedIn, setLoggedIn] = useState(() => window.location.hash !== '#/login' && localStorage.getItem('risk-monitor-logged-in') === '1');
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
  const login = () => { localStorage.setItem('risk-monitor-logged-in', '1'); setLoggedIn(true); window.location.hash = '#/index'; };
  const logout = () => { localStorage.removeItem('risk-monitor-logged-in'); setLoggedIn(false); window.location.hash = '#/login'; };
  if (!loggedIn) return <LoginPage onLogin={login} />;
  return (
    <>
      <Header active={active} setActive={navigate} onLogout={logout} />
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
