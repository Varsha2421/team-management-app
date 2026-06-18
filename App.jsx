import React, { useState, useRef } from 'react';
import {
  LayoutGrid, Users, Briefcase, ClipboardList, MapPin, BarChart3, Award, 
  Settings, LogOut, Search, Bell, HelpCircle, Grid3x3, Mail, Lock, Eye, 
  EyeOff, ArrowRight, Download, Plus, ChevronLeft, ChevronRight, Filter, 
  RefreshCw, Target, AlertTriangle, Calendar, Wallet, CheckCircle2, Clock, 
  TrendingUp, TrendingDown, Minus, MoreVertical, Crosshair
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from 'recharts';

/* ---------------------------------------------------------------------- */
/* Design tokens                                                            */
/* ---------------------------------------------------------------------- */
const C = {
  sidebar: '#1d1b18',
  sidebarBorder: '#2f2c28',
  gold: '#dba23a',
  goldSoft: '#c08a2e',
  page: '#ebe9e3',
  dark: '#262320',
  border: '#e7e4dd',
};

const AVATAR_COLORS = [
  'bg-indigo-100 text-indigo-700',
  'bg-pink-100 text-pink-700',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
];

const BADGE_STYLES = {
  red: 'bg-red-50 text-red-600',
  purple: 'bg-violet-50 text-violet-600',
  green: 'bg-emerald-50 text-emerald-600',
  gray: 'bg-stone-100 text-stone-500',
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-600',
};

const DOT_COLORS = {
  red: 'bg-red-500',
  purple: 'bg-violet-500',
  green: 'bg-emerald-500',
  gray: 'bg-stone-400',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
};

/* ---------------------------------------------------------------------- */
/* Shared bits                                                              */
/* ---------------------------------------------------------------------- */
function Avatar({ initials, idx = 0, size = 'md' }) {
  const sizeCls = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  return (
    <div className={`${sizeCls} rounded-full flex items-center justify-center font-semibold shrink-0 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
      {initials}
    </div>
  );
}

function Badge({ children, type = 'gray', dot }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${BADGE_STYLES[type]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[type]}`} />}
      {children}
    </span>
  );
}

function ProgressBar({ value, color = C.gold, bg = 'bg-stone-100' }) {
  return (
    <div className={`h-1.5 rounded-full ${bg} w-full overflow-hidden`}>
      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, trend, dark, progress }) {
  return (
    <div
      className={`rounded-2xl border p-4 flex flex-col gap-3 ${dark ? 'text-stone-100' : 'bg-white border-stone-200'}`}
      style={dark ? { backgroundColor: C.dark, borderColor: C.dark } : {}}
    >
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${dark ? 'bg-white/10' : 'bg-stone-100'}`}>
          <Icon size={16} className={dark ? 'text-amber-300' : 'text-stone-500'} />
        </div>
        {trend && (
          <span className={`text-xs font-semibold flex items-center gap-1 ${trend.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend.startsWith('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </span>
        )}
      </div>
      <div>
        <div className="text-xs font-medium tracking-wide uppercase text-stone-400">{label}</div>
        <div className="text-2xl font-bold mt-1">{value}</div>
        {sub && <div className="text-xs mt-1 text-stone-400">{sub}</div>}
      </div>
      {progress != null && <ProgressBar value={progress} />}
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white" style={{ backgroundColor: C.dark }}>
        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
        {message}
      </div>
    </div>
  );
}

function Pager({ page, totalPages, onChange }) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);
  return (
    <div className="flex gap-1">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        className="w-8 h-8 rounded-lg border flex items-center justify-center text-stone-400 hover:text-stone-700 disabled:opacity-40"
        style={{ borderColor: C.border }}
        disabled={page === 1}
      >
        <ChevronLeft size={14} />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-8 h-8 rounded-lg text-sm font-semibold flex items-center justify-center ${p === page ? 'text-stone-900' : 'border text-stone-500 hover:bg-stone-50'}`}
          style={p === page ? { backgroundColor: C.gold } : { borderColor: C.border }}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        className="w-8 h-8 rounded-lg border flex items-center justify-center text-stone-400 hover:text-stone-700 disabled:opacity-40"
        style={{ borderColor: C.border }}
        disabled={page === totalPages}
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Sidebar / Top bar / Layout                                               */
/* ---------------------------------------------------------------------- */
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'employee', label: 'Employee', icon: Users },
  { id: 'client', label: 'Client', icon: Briefcase },
  { id: 'task', label: 'Task assigning', icon: ClipboardList },
  { id: 'tracking', label: 'Employee tracking', icon: MapPin },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'incentive', label: 'Incentive', icon: Award },
];

function Sidebar({ active, onChange, onLogout }) {
  return (
    <aside className="w-64 shrink-0 min-h-screen flex flex-col" style={{ backgroundColor: C.sidebar }}>
      <div className="px-6 py-6">
        <div className="text-lg font-bold tracking-wide" style={{ color: C.gold }}>Admin Console</div>
        <div className="text-[11px] text-stone-500 tracking-widest mt-0.5">TEAM LEAD PORTAL</div>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {NAV.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'font-medium' : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'}`}
              style={isActive ? { backgroundColor: 'rgba(219,162,58,0.12)', color: C.gold, borderLeft: `3px solid ${C.gold}`, paddingLeft: '9px' } : {}}
            >
              <item.icon size={17} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t" style={{ borderColor: C.sidebarBorder }}>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-400 hover:text-stone-200 hover:bg-white/5">
          <Settings size={17} /> Settings
        </button>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-white/5">
          <LogOut size={17} /> Logout
        </button>
      </div>
    </aside>
  );
}

function TopBar({ name, role, query, onQuery, placeholder }) {
  return (
    <div className="flex items-center justify-between gap-6 px-8 py-4 bg-white border-b" style={{ borderColor: C.border }}>
      <div className="relative w-full max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-stone-100 text-sm outline-none placeholder-stone-400 focus:ring-2 focus:ring-amber-300"
          placeholder={placeholder}
        />
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <Bell size={18} className="text-stone-400 cursor-pointer hover:text-stone-600" />
        <HelpCircle size={18} className="text-stone-400 cursor-pointer hover:text-stone-600" />
        <Grid3x3 size={18} className="text-stone-400 cursor-pointer hover:text-stone-600" />
        <div className="w-px h-6 bg-stone-200" />
        <div className="text-right">
          <div className="text-sm font-semibold text-stone-800">{name}</div>
          <div className="text-xs text-stone-400">{role}</div>
        </div>
        <Avatar initials={name.split(' ').map((n) => n[0]).join('')} idx={0} />
      </div>
    </div>
  );
}

function Layout({ active, onChange, onLogout, user, role, searchPlaceholder, children }) {
  const [query, setQuery] = useState('');
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: C.page }}>
      <Sidebar active={active} onChange={onChange} onLogout={onLogout} />
      <div className="flex-1 min-w-0">
        <TopBar name={user} role={role} query={query} onQuery={setQuery} placeholder={searchPlaceholder} />
        <main className="p-8 space-y-6">{children}</main>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Login page                                                               */
/* ---------------------------------------------------------------------- */
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('admin@complianceos.com');
  const [password, setPassword] = useState('securepass');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    onLogin();
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#e5e5e2' }}>
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold text-stone-800 mb-8">Welcome Back</h1>

        <div className="mb-5">
          <label className="block text-xs font-semibold tracking-wider text-stone-500 mb-2">EMAIL ADDRESS</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
        </div>

        <div className="mb-2">
          <label className="block text-xs font-semibold tracking-wider text-stone-500 mb-2">PASSWORD</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-amber-300"
            />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
        {!error && <div className="mb-6" />}

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-stone-900 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: C.gold }}
        >
          Sign In to Dashboard <ArrowRight size={16} />
        </button>

        <div className="mt-6 pt-5 border-t border-stone-100 text-center text-xs text-stone-400 space-y-1">
          <p>Secured with enterprise-grade SSL encryption.</p>
          <p>Authorized access only. Unauthorized attempts will be logged.</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Dashboard page                                                           */
/* ---------------------------------------------------------------------- */
function DashboardPage({ notify, onNavigate }) {
  const stats = [
    { icon: Wallet, label: 'TEAM INCENTIVE POOL', value: '$14,250.00', sub: 'Current month forecast', trend: '+12%' },
    { icon: CheckCircle2, label: 'COMPLETION RATE', value: '94.2%', trend: '-2%', progress: 94 },
    { icon: Users, label: 'ACTIVE STAFF', value: '38/42', sub: '4 On-leave, 2 Unassigned' },
    { icon: Clock, label: 'AVG HANDLING TIME', value: '42m 15s', sub: 'Optimized by 4m since last week', dark: true },
  ];

  const [attention, setAttention] = useState([
    { initials: 'JD', idx: 0, name: 'John Doe', role: 'Field Agent • Level 2', status: 'No Task Assigned', type: 'red', last: '14 mins ago', perf: 85, action: 'Assign Now' },
    { initials: 'SM', idx: 1, name: 'Sarah Miller', role: 'Lead Consultant', status: 'Task Completed', type: 'purple', last: 'Just now', perf: 98, action: 'Review Work' },
    { initials: 'RW', idx: 2, name: 'Robert Wilson', role: 'Analyst • Junior', status: 'No Task Assigned', type: 'red', last: '2 hours ago', perf: 72, action: 'Assign Now' },
    { initials: 'AK', idx: 3, name: 'Anita Kumar', role: 'System Admin', status: 'Task Completed', type: 'purple', last: '15 mins ago', perf: 91, action: 'Review Work' },
  ]);

  function handleRowAction(row) {
    if (row.action === 'Assign Now') {
      setAttention((prev) => prev.map((r) => (r.name === row.name ? { ...r, status: 'Task Assigned', type: 'blue', action: 'In Progress' } : r)));
      notify(`Task assigned to ${row.name}`);
    } else {
      notify(`Reviewing ${row.name}'s work`);
    }
  }

  const leaderboard = [
    { name: 'Emily Blunt', amount: '+$450.00', pct: 90 },
    { name: 'Michael Scott', amount: '+$320.00', pct: 65 },
    { name: 'Pam Beesly', amount: '+$290.00', pct: 58 },
  ];

  const activity = [
    { time: '14:15 PM', text: 'Sarah Miller completed task "Client Audit - Reliance Ind."', status: 'Review pending' },
    { time: '13:58 PM', text: 'System flagged Robert Wilson for idle time exceeding 30m.', status: 'Alert sent' },
    { time: '13:30 PM', text: 'Alex Thompson assigned 4 tasks to Night Shift A.', status: 'Processing...' },
    { time: '13:10 PM', text: 'Incentive Pool updated for Q4 2023.', status: 'Policy viewable' },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800">Team Overview</h1>
          <p className="text-sm text-stone-400 mt-1">Real-time performance and operational status of your direct reports.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => notify('Report exported')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90" style={{ backgroundColor: C.dark }}>
            <Download size={14} /> Export Report
          </button>
          <button onClick={() => onNavigate('task')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-stone-900 hover:opacity-90" style={{ backgroundColor: C.gold }}>
            <Plus size={14} /> Assign New Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" />
              <h2 className="font-semibold text-stone-800">Attention Required</h2>
            </div>
            <Badge type="red">{attention.filter((r) => r.action === 'Assign Now').length} Action Items</Badge>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-stone-400 border-b" style={{ borderColor: C.border }}>
                <th className="pb-2 font-medium">EMPLOYEE</th>
                <th className="pb-2 font-medium">CURRENT STATUS</th>
                <th className="pb-2 font-medium">LAST ACTION</th>
                <th className="pb-2 font-medium">PERFORMANCE</th>
                <th className="pb-2 font-medium text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {attention.map((r, i) => (
                <tr key={i} className="border-b last:border-0" style={{ borderColor: C.border }}>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={r.initials} idx={r.idx} size="sm" />
                      <div>
                        <div className="font-medium text-stone-800">{r.name}</div>
                        <div className="text-xs text-stone-400">{r.role}</div>
                      </div>
                    </div>
                  </td>
                  <td><Badge type={r.type}>{r.status}</Badge></td>
                  <td className="text-stone-500">{r.last}</td>
                  <td className="w-32">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={r.perf} />
                      <span className="text-xs text-stone-500 w-9">{r.perf}%</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => handleRowAction(r)}
                      disabled={r.action === 'In Progress'}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-80 disabled:opacity-60"
                      style={{ backgroundColor: '#fdf4e3', color: C.goldSoft }}
                    >
                      {r.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl p-5 text-white" style={{ backgroundColor: C.dark }}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold">Regional Spread</h3>
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />LIVE
              </span>
            </div>
            <p className="text-xs text-stone-400 mb-4">Live tracking of on-field agents</p>
            <button onClick={() => onNavigate('tracking')} className="w-full h-32 rounded-lg bg-stone-800/60 flex items-center justify-center mb-3 hover:bg-stone-800/80">
              <MapPin size={24} className="text-amber-400" />
            </button>
            <div className="flex items-center justify-between bg-stone-800/60 rounded-lg p-3">
              <span className="text-sm">Active Agents</span>
              <span className="text-sm font-semibold text-amber-400">14 Online</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
            <h3 className="font-semibold text-stone-800">Leaderboard</h3>
            <p className="text-xs text-stone-400 mb-4">Incentive projections this week</p>
            <div className="space-y-3">
              {leaderboard.map((l, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-stone-100 text-xs flex items-center justify-center font-semibold">{i + 1}</span>
                      {l.name}
                    </span>
                    <span className="font-semibold text-emerald-600">{l.amount}</span>
                  </div>
                  <ProgressBar value={l.pct} />
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate('incentive')} className="w-full mt-4 text-sm font-medium py-2 rounded-lg hover:opacity-80" style={{ color: C.goldSoft, backgroundColor: '#fdf4e3' }}>
              Full Incentive Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-stone-800">Operational Activity</h3>
          <span className="text-xs text-stone-400">Last updated: 14:22:15</span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {activity.map((a, i) => (
            <div key={i} className="border rounded-xl p-3" style={{ borderColor: C.border }}>
              <div className="text-xs text-stone-400 mb-1">{a.time}</div>
              <div className="text-sm text-stone-700 mb-2">{a.text}</div>
              <div className="text-xs font-medium" style={{ color: C.goldSoft }}>{a.status}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Employee (Team Management) page                                          */
/* ---------------------------------------------------------------------- */
function EmployeePage({ notify }) {
  const stats = [
    { icon: Users, label: 'TOTAL TEAM', value: '24', sub: '+2 this month' },
    { icon: Target, label: 'ON DUTY', value: '18', sub: '75% active now' },
    { icon: Award, label: 'AVG RATING', value: '4.8', sub: 'Across 124 tasks' },
    { icon: Calendar, label: 'PENDING LEAVE', value: '3', sub: 'Needs review' },
  ];

  const allMembers = [
    { initials: 'AS', idx: 0, name: 'Aditi Sharma', id: 'EMP-2024-001', role: 'Senior Field Agent', status: 'On Duty', type: 'green', perf: 94, task: 'Client Site A - Audit' },
    { initials: 'RV', idx: 1, name: 'Rohan Varma', id: 'EMP-2024-042', role: 'Logistics Lead', status: 'In Transit', type: 'blue', perf: 82, task: 'Warehouse Shift 2' },
    { initials: 'PS', idx: 2, name: 'Priya Singh', id: 'EMP-2023-115', role: 'Compliance Officer', status: 'Off Duty', type: 'gray', perf: 98, task: 'None' },
    { initials: 'VM', idx: 3, name: 'Vikram Malhotra', id: 'EMP-2024-088', role: 'Operations Jr.', status: 'Urgent Task', type: 'red', perf: 76, task: 'Incident Report #992' },
  ];

  const [tab, setTab] = useState('all');
  const [highPerfOnly, setHighPerfOnly] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = allMembers.filter((m) => {
    const tabMatch = tab === 'all' || (tab === 'active' && m.status !== 'Off Duty') || (tab === 'inactive' && m.status === 'Off Duty');
    const perfMatch = !highPerfOnly || m.perf >= 90;
    return tabMatch && perfMatch;
  });

  const departments = [
    { name: 'Field', value: 42 },
    { name: 'Logistics', value: 28 },
    { name: 'Legal', value: 18 },
    { name: 'Admin', value: 12 },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800">Team Management</h1>
          <p className="text-sm text-stone-400 mt-1">Monitor, manage, and coordinate your active field team.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => notify('Team list exported')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90" style={{ backgroundColor: C.dark }}>
            <Download size={14} /> Export List
          </button>
          <button onClick={() => notify('Opening onboarding form...')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-stone-900 hover:opacity-90" style={{ backgroundColor: C.gold }}>
            <Plus size={14} /> Onboard New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {[['all', 'All Members'], ['active', 'Active'], ['inactive', 'Inactive']].map(([id, label]) => (
              <button
                key={id}
                onClick={() => { setTab(id); setPage(1); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium ${tab === id ? 'text-white' : 'text-stone-500 border hover:bg-stone-50'}`}
                style={tab === id ? { backgroundColor: C.dark } : { borderColor: C.border }}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => setHighPerfOnly((v) => !v)}
              className={`flex items-center gap-1 px-4 py-1.5 rounded-lg text-sm font-medium border ${highPerfOnly ? '' : 'text-stone-500 hover:bg-stone-50'}`}
              style={highPerfOnly ? { borderColor: C.gold, color: C.goldSoft, backgroundColor: '#fdf4e3' } : { borderColor: C.border }}
            >
              <Filter size={14} /> {highPerfOnly ? 'Filter: ≥90%' : 'Filter'}
            </button>
          </div>
          <div className="text-sm text-stone-400">Sort by: <span className="text-stone-700 font-medium">Performance (High to Low)</span></div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-stone-400 border-b" style={{ borderColor: C.border }}>
              <th className="pb-2 font-medium">MEMBER</th>
              <th className="pb-2 font-medium">ROLE</th>
              <th className="pb-2 font-medium">STATUS</th>
              <th className="pb-2 font-medium">PERFORMANCE</th>
              <th className="pb-2 font-medium">ACTIVE TASK</th>
              <th className="pb-2 font-medium text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-stone-400">No team members match this filter.</td></tr>
            )}
            {filtered.map((m, i) => (
              <tr key={i} className="border-b last:border-0" style={{ borderColor: C.border }}>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <Avatar initials={m.initials} idx={m.idx} />
                    <div>
                      <div className="font-medium text-stone-800">{m.name}</div>
                      <div className="text-xs text-stone-400">ID: {m.id}</div>
                    </div>
                  </div>
                </td>
                <td className="text-stone-600">{m.role}</td>
                <td><Badge type={m.type} dot>{m.status}</Badge></td>
                <td className="w-36">
                  <div className="flex items-center gap-2">
                    <ProgressBar value={m.perf} />
                    <span className="text-xs text-stone-500 w-9">{m.perf}%</span>
                  </div>
                </td>
                <td className="text-stone-600">{m.task}</td>
                <td className="text-right text-stone-400">
                  <div className="flex justify-end gap-3">
                    <Crosshair size={15} className="cursor-pointer hover:text-stone-700" onClick={() => notify(`Locating ${m.name} on map`)} />
                    <Eye size={15} className="cursor-pointer hover:text-stone-700" onClick={() => notify(`Viewing ${m.name}'s profile`)} />
                    <MoreVertical size={15} className="cursor-pointer hover:text-stone-700" onClick={() => notify(`More options for ${m.name}`)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-stone-400">Showing {filtered.length} of 24 team members</span>
          <Pager page={page} totalPages={3} onChange={setPage} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-800">Department Distribution</h3>
            <button onClick={() => notify('Opening department breakdown')} className="text-sm font-medium hover:underline" style={{ color: C.goldSoft }}>Details</button>
          </div>
          <div className="flex items-end justify-around h-40 gap-6">
            {departments.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full rounded-t-lg" style={{ height: `${d.value * 2.4}px`, backgroundColor: i === 0 ? C.gold : '#e7e4dd' }} />
                <span className="text-xs text-stone-400 uppercase font-medium">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl p-5 text-white flex flex-col justify-between" style={{ backgroundColor: C.dark }}>
          <div>
            <h3 className="font-semibold mb-2">Internal Training</h3>
            <p className="text-sm text-stone-400">3 new compliance modules available for your team.</p>
          </div>
          <button onClick={() => notify('Training modules assigned to team')} className="mt-6 w-full py-2.5 rounded-lg font-semibold text-stone-900 hover:opacity-90" style={{ backgroundColor: C.gold }}>Assign Modules</button>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Task assigning page                                                      */
/* ---------------------------------------------------------------------- */
function TaskPage({ notify }) {
  const [queue, setQueue] = useState([
    { title: 'Client Audit & Risk Assessment', client: 'Reliance Industries Ltd', created: 'Created 2h ago', priority: 'HIGH PRIORITY', type: 'red', est: 'Est. 8 Hours' },
    { title: 'Quarterly Tax Compliance Filing', client: 'TATA Group', created: 'Created 4h ago', priority: 'STANDARD', type: 'blue', est: 'Est. 4 Hours' },
    { title: 'Document Verification - New Onboarding', client: 'Adani Enterprises', created: 'Created 6h ago', priority: 'LOW PRIORITY', type: 'gray', est: 'Est. 2 Hours' },
  ]);

  function assignTask(title) {
    setQueue((prev) => prev.filter((q) => q.title !== title));
    notify(`Assigned: ${title}`);
  }

  const stats = [
    { icon: ClipboardList, label: 'UNASSIGNED TASKS', value: String(queue.length).padStart(2, '0'), sub: 'Unassigned Queue', trend: '+12%' },
    { icon: TrendingUp, label: 'IN PROGRESS', value: '142', sub: 'Current Load' },
    { icon: CheckCircle2, label: 'COMPLETED TODAY', value: '56', sub: 'Priority Sort • Target Met' },
    { icon: AlertTriangle, label: 'DELAYED DELIVERIES', value: '04', sub: 'Critical' },
  ];

  const availability = [
    { name: 'Rahul Verma', load: 85, color: '#ef4444' },
    { name: 'Sana K.', load: 20, color: '#10b981' },
    { name: 'David Chen', load: 45, color: '#f59e0b' },
  ];

  const liveActivity = [
    { text: 'Rahul Verma completed Audit Phase 1', time: 'Just now' },
    { text: 'Sana K. started Quarterly Filing', time: '15 mins ago' },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800">Task Management</h1>
          <p className="text-sm text-stone-400 mt-1">Assign workflows and monitor delivery efficiency across teams.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => notify('Progress report exported')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90" style={{ backgroundColor: C.dark }}>
            <Download size={14} /> Export Progress
          </button>
          <button onClick={() => notify('Opening new task form...')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-stone-900 hover:opacity-90" style={{ backgroundColor: C.gold }}>
            <Plus size={14} /> Create New Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-800">Unassigned Queue</h3>
            <button onClick={() => notify('Sorted by priority')} className="text-sm font-medium hover:underline" style={{ color: C.goldSoft }}>Priority Sort</button>
          </div>
          <div className="space-y-3">
            {queue.length === 0 && <p className="text-sm text-stone-400 py-6 text-center">Queue is clear — every task has been assigned.</p>}
            {queue.map((q, i) => (
              <div key={i} className="flex items-center justify-between border rounded-xl p-4" style={{ borderColor: C.border }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-stone-100">
                    <ClipboardList size={16} className="text-stone-400" />
                  </div>
                  <div>
                    <div className="font-medium text-stone-800 text-sm">{q.title}</div>
                    <div className="text-xs text-stone-400">{q.client} • {q.created}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge type={q.type}>{q.priority}</Badge>
                    <div className="text-xs text-stone-400 mt-1">{q.est}</div>
                  </div>
                  <button onClick={() => assignTask(q.title)} className="text-sm font-semibold px-4 py-2 rounded-lg border hover:bg-amber-50" style={{ borderColor: C.gold, color: C.goldSoft }}>Assign</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-stone-800">Employee Availability</h3>
              <Users size={16} className="text-stone-400" />
            </div>
            <div className="space-y-4">
              {availability.map((a, i) => (
                <div key={i} className="border rounded-xl p-3 cursor-pointer hover:bg-stone-50" style={{ borderColor: C.border }} onClick={() => notify(`${a.name} — ${a.load}% current load`)}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar initials={a.name.split(' ').map((n) => n[0]).join('')} idx={i} size="sm" />
                      <span className="text-sm font-medium text-stone-800">{a.name}</span>
                    </div>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <ProgressBar value={a.load} color={a.color} />
                    <span className="text-xs text-stone-500">{a.load}% Load</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => notify('Showing all assignees')} className="w-full mt-4 text-sm font-medium py-2 rounded-lg hover:opacity-80" style={{ color: C.goldSoft, backgroundColor: '#fdf4e3' }}>View All Assignees</button>
          </div>

          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
            <h3 className="font-semibold text-stone-800 mb-4">Live Activity</h3>
            <div className="space-y-4">
              {liveActivity.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: C.gold }} />
                    {i < liveActivity.length - 1 && <span className="w-px flex-1 bg-stone-200 mt-1" />}
                  </div>
                  <div>
                    <div className="text-sm text-stone-700">{a.text}</div>
                    <div className="text-xs text-stone-400">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Client management page                                                   */
/* ---------------------------------------------------------------------- */
function ClientPage({ notify, onNavigate }) {
  const stats = [
    { icon: Briefcase, label: 'TOTAL CLIENTS', value: '1,254', trend: '+8%' },
    { icon: Target, label: 'ACTIVE PROJECTS', value: '42', sub: 'Ongoing' },
    { icon: AlertTriangle, label: 'CRITICAL TASKS', value: '09', sub: 'Require Action' },
    { icon: Wallet, label: 'TOTAL REVENUE', value: '$4.2M', sub: 'Q3-24' },
  ];

  const allClients = [
    { initials: 'RI', name: 'Reliance Industries Ltd.', project: 'Digital Transformation', status: 'Active', type: 'green', lead: 'Sanya Malhotra', progress: 75, due: 'Oct 24, 2024' },
    { initials: 'TC', name: 'Tata Consultancy Services', project: 'Cloud Migration', status: 'On Hold', type: 'amber', lead: 'Amitabh S.', progress: 32, due: 'Nov 12, 2024' },
    { initials: 'HDFC', name: 'HDFC Bank Corp', project: 'Security Audit', status: 'Planning', type: 'blue', lead: 'Vikram Roy', progress: 10, due: 'Dec 05, 2024' },
    { initials: 'AD', name: 'Adani Group', project: 'Infrastructure Monitoring', status: 'Critical', type: 'red', lead: 'Rohan Gupta', progress: 92, due: 'Oct 18, 2024' },
  ];

  const statuses = ['All Statuses', 'Active', 'On Hold', 'Planning', 'Critical'];
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [page, setPage] = useState(1);

  const filtered = statusFilter === 'All Statuses' ? allClients : allClients.filter((c) => c.status === statusFilter);

  function cycleStatus() {
    const idx = statuses.indexOf(statusFilter);
    setStatusFilter(statuses[(idx + 1) % statuses.length]);
    setPage(1);
  }

  const deadlines = [
    { title: 'Security Patch V2', tag: 'CRITICAL', type: 'red', client: 'HDFC Bank Corp', due: 'Due in 4 hours' },
    { title: 'UI Feedback Loop', tag: 'URGENT', type: 'amber', client: 'Reliance Industries', due: 'Due tomorrow' },
    { title: 'Quarterly Report', tag: 'ROUTINE', type: 'gray', client: 'Tata Consultancy', due: 'Due in 3 days' },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800">Client Management</h1>
          <p className="text-sm text-stone-400 mt-1">Oversee active contracts and manage tactical operations.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => notify('Client list exported')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90" style={{ backgroundColor: C.dark }}>
            <Download size={14} /> Export List
          </button>
          <button onClick={() => onNavigate('task')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-stone-900 hover:opacity-90" style={{ backgroundColor: C.gold }}>
            <Plus size={14} /> Add New Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button onClick={() => notify('Advanced filters coming soon')} className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-sm font-medium text-stone-500 border hover:bg-stone-50" style={{ borderColor: C.border }}>
              <Filter size={14} /> Filters
            </button>
            <button onClick={cycleStatus} className="px-4 py-1.5 rounded-lg text-sm font-medium text-stone-500 border hover:bg-stone-50" style={{ borderColor: C.border }}>{statusFilter}</button>
          </div>
          <span className="text-sm text-stone-400">Showing {filtered.length} of 1,254 entries</span>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-stone-400 border-b" style={{ borderColor: C.border }}>
              <th className="pb-2 font-medium">CLIENT NAME</th>
              <th className="pb-2 font-medium">PROJECT STATUS</th>
              <th className="pb-2 font-medium">ASSIGNED LEAD</th>
              <th className="pb-2 font-medium">PROGRESS</th>
              <th className="pb-2 font-medium">DUE DATE</th>
              <th className="pb-2 font-medium text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-stone-400">No clients with this status.</td></tr>
            )}
            {filtered.map((c, i) => (
              <tr key={i} className="border-b last:border-0" style={{ borderColor: C.border }}>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-xs bg-stone-100 text-stone-600">{c.initials}</div>
                    <div>
                      <div className="font-medium text-stone-800">{c.name}</div>
                      <div className="text-xs text-stone-400">{c.project}</div>
                    </div>
                  </div>
                </td>
                <td><Badge type={c.type} dot>{c.status.toUpperCase()}</Badge></td>
                <td className="text-stone-600">{c.lead}</td>
                <td className="w-40">
                  <div className="flex items-center gap-2">
                    <ProgressBar value={c.progress} color={c.type === 'red' ? '#ef4444' : C.gold} />
                    <span className="text-xs text-stone-500 w-10">{c.progress}%</span>
                  </div>
                </td>
                <td className="text-stone-600">{c.due}</td>
                <td className="text-right text-stone-400">
                  <MoreVertical size={15} className="inline cursor-pointer hover:text-stone-700" onClick={() => notify(`More options for ${c.name}`)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-stone-400">Showing {filtered.length} of 1,254</span>
          <Pager page={page} totalPages={3} onChange={setPage} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-800">Client Concentration Map</h3>
            <span className="text-xs text-stone-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: C.gold }} /> Managed Regions
            </span>
          </div>
          <div className="h-48 rounded-xl bg-stone-50 flex items-center justify-center border" style={{ borderColor: C.border }}>
            <MapPin size={28} className="text-stone-300" />
          </div>
        </div>
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <h3 className="font-semibold text-stone-800 mb-4">Upcoming Task Deadlines</h3>
          <div className="space-y-3">
            {deadlines.map((d, i) => (
              <div key={i} className="border-l-4 rounded-r-xl p-3 bg-stone-50 cursor-pointer hover:bg-stone-100" style={{ borderColor: d.type === 'red' ? '#ef4444' : d.type === 'amber' ? '#f59e0b' : '#d1cfc9' }} onClick={() => notify(`Opening "${d.title}"`)}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-stone-800">{d.title}</span>
                  <Badge type={d.type}>{d.tag}</Badge>
                </div>
                <div className="text-xs text-stone-400 mt-1">{d.client}</div>
                <div className="text-xs text-stone-500 mt-1">{d.due}</div>
              </div>
            ))}
          </div>
          <button onClick={() => onNavigate('task')} className="w-full mt-4 text-sm font-medium py-2 rounded-lg hover:opacity-80" style={{ color: C.goldSoft, backgroundColor: '#fdf4e3' }}>View All Tasks</button>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Employee tracking page                                                   */
/* ---------------------------------------------------------------------- */
function TrackingPage({ notify }) {
  const stats = [
    { icon: CheckCircle2, label: 'CHECKED IN', value: '11/12' },
    { icon: AlertTriangle, label: 'LATE ARRIVAL', value: '02' },
    { icon: Target, label: 'ACTIVE ROUTES', value: '08' },
    { icon: TrendingUp, label: 'AVG PRODUCTIVITY', value: '94.2%' },
  ];

  const feed = [
    { initials: 'AS', idx: 0, name: 'Aditi Sharma', id: 'EMP-0921', checkin: '08:45 AM', note: 'On Time', checkout: '--:--', location: 'Cyber City, Hub 4', status: 'On Site', type: 'green' },
    { initials: 'RV', idx: 1, name: 'Rahul Verma', id: 'EMP-0882', checkin: '09:12 AM', note: 'Late (12m)', checkout: '--:--', location: 'En-route Sector 62', status: 'Transit', type: 'amber' },
    { initials: 'MP', idx: 2, name: 'Meera Patel', id: 'EMP-1104', checkin: '08:55 AM', note: 'On Time', checkout: '--:--', location: 'DLF Phase 2', status: 'On Site', type: 'green' },
    { initials: 'SK', idx: 3, name: 'Sanjay Kumar', id: 'EMP-0743', checkin: '--:--', note: '', checkout: '--:--', location: 'Residential Address', status: 'Offline', type: 'gray' },
  ];

  const [page, setPage] = useState(1);
  const [syncing, setSyncing] = useState(false);

  function handleSync() {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      notify('Dashboard synced');
    }, 1100);
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800">Real-time Employee Tracking</h1>
          <p className="text-sm text-stone-400 mt-1">Live operational status of 12 field executives across the city.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => notify('Activity log exported')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90" style={{ backgroundColor: C.dark }}>
            <Download size={14} /> Export Log
          </button>
          <button onClick={handleSync} disabled={syncing} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-stone-900 hover:opacity-90 disabled:opacity-70" style={{ backgroundColor: C.gold }}>
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} /> {syncing ? 'Syncing...' : 'Sync Dashboard'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-stone-800">Executive Status Feed</h3>
          <div className="flex gap-2">
            <Badge type="green" dot>8 Online</Badge>
            <Badge type="amber" dot>3 Offline</Badge>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-stone-400 border-b" style={{ borderColor: C.border }}>
              <th className="pb-2 font-medium">EMPLOYEE</th>
              <th className="pb-2 font-medium">CHECK-IN</th>
              <th className="pb-2 font-medium">CHECK-OUT</th>
              <th className="pb-2 font-medium">LOCATION</th>
              <th className="pb-2 font-medium">STATUS</th>
              <th className="pb-2 font-medium text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {feed.map((f, i) => (
              <tr key={i} className="border-b last:border-0" style={{ borderColor: C.border }}>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <Avatar initials={f.initials} idx={f.idx} size="sm" />
                    <div>
                      <div className="font-medium text-stone-800">{f.name}</div>
                      <div className="text-xs text-stone-400">ID: {f.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-stone-700">{f.checkin}</div>
                  {f.note && <div className={`text-xs ${f.note.includes('Late') ? 'text-red-500' : 'text-emerald-500'}`}>{f.note}</div>}
                </td>
                <td className="text-stone-400">{f.checkout}</td>
                <td className="text-stone-600">
                  <div className="flex items-center gap-1.5"><MapPin size={13} className="text-stone-400" />{f.location}</div>
                </td>
                <td><Badge type={f.type} dot>{f.status.toUpperCase()}</Badge></td>
                <td className="text-right text-stone-400">
                  <ChevronRight size={15} className="inline cursor-pointer hover:text-stone-700" onClick={() => notify(`Opening live location for ${f.name}`)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-stone-400">Showing 4 of 12 employees</span>
          <Pager page={page} totalPages={3} onChange={setPage} />
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Analytics page                                                           */
/* ---------------------------------------------------------------------- */
function AnalyticsPage({ notify }) {
  const stats = [
    { icon: TrendingUp, label: 'EFFICIENCY INDEX', value: '94.2%', trend: '+2.4%', sub: 'vs last week' },
    { icon: Award, label: 'TEAM MILESTONES', value: '28/32', sub: 'Q3 Objectives Status' },
    { icon: Clock, label: 'AVG RESOLUTION TIME', value: '1.4h', trend: '-0.2h', sub: 'optimization needed' },
  ];

  const chartData = [
    { week: 'WK 01', flow: 62, target: 58 },
    { week: 'WK 02', flow: 65, target: 60 },
    { week: 'WK 03', flow: 78, target: 62 },
    { week: 'WK 04', flow: 64, target: 63 },
    { week: 'WK 05', flow: 85, target: 68 },
    { week: 'WK 06', flow: 80, target: 70 },
    { week: 'WK 07', flow: 88, target: 72 },
    { week: 'WK 08', flow: 96, target: 75 },
    { week: 'WK 09', flow: 94, target: 76 },
    { week: 'WK 10', flow: 97, target: 78 },
  ];

  const employees = [
    { initials: 'JD', idx: 0, name: 'Jane Doe', designation: 'Senior', tasks: 142, eff: '98%', up: true },
    { initials: 'RV', idx: 1, name: 'Rahul Verma', designation: 'Mid', tasks: 128, eff: '94%', up: true },
    { initials: 'AS', idx: 2, name: 'Aditi Sharma', designation: 'Senior', tasks: 121, eff: '92%', up: false },
  ];

  const domains = [
    { name: 'Software Development', value: 42 },
    { name: 'Marketing Strategy', value: 28 },
    { name: 'Operations', value: 18 },
    { name: 'Compliance', value: 12 },
  ];

  const [refreshing, setRefreshing] = useState(false);
  function handleUpdate() {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); notify('Analytics data refreshed'); }, 1100);
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800">Team Analytics Overview</h1>
          <p className="text-sm text-stone-400 mt-1">Real-time productivity distribution and operational performance tracking.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => notify('Exporting PDF...')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90" style={{ backgroundColor: C.dark }}>
            <Download size={14} /> Export PDF
          </button>
          <button onClick={handleUpdate} disabled={refreshing} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-stone-900 hover:opacity-90 disabled:opacity-70" style={{ backgroundColor: C.gold }}>
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Updating...' : 'Update Data'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-stone-800">Performance Trends (Operational Flow vs. Target)</h3>
          <div className="flex items-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: C.gold }} />Operational Flow</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-stone-300" />Target Baseline</span>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#f0eee9" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="flow" stroke={C.gold} strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="target" stroke="#d6d3ce" strokeWidth={2} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-800">Top Performing Employees</h3>
            <button onClick={() => notify('Opening full leaderboard')} className="text-sm font-medium hover:underline" style={{ color: C.goldSoft }}>Full Leaderboard</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-stone-400 border-b" style={{ borderColor: C.border }}>
                <th className="pb-2 font-medium">EMPLOYEE</th>
                <th className="pb-2 font-medium">DESIGNATION</th>
                <th className="pb-2 font-medium">TASKS COMPLETED</th>
                <th className="pb-2 font-medium">EFFICIENCY</th>
                <th className="pb-2 font-medium text-right">TREND</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e, i) => (
                <tr key={i} className="border-b last:border-0" style={{ borderColor: C.border }}>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={e.initials} idx={e.idx} size="sm" />
                      <span className="font-medium text-stone-800">{e.name}</span>
                    </div>
                  </td>
                  <td className="text-stone-600">{e.designation}</td>
                  <td className="text-stone-600">{e.tasks}</td>
                  <td><Badge type="green">{e.eff}</Badge></td>
                  <td className="text-right">
                    {e.up ? <TrendingUp size={15} className="inline text-emerald-500" /> : <TrendingDown size={15} className="inline text-red-500" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <h3 className="font-semibold text-stone-800 mb-4">Task Domain Distribution</h3>
          <div className="space-y-4">
            {domains.map((d, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-stone-600">{d.name}</span>
                  <span className="font-semibold text-stone-800">{d.value}%</span>
                </div>
                <ProgressBar value={d.value} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Incentive page                                                           */
/* ---------------------------------------------------------------------- */
function IncentivePage({ notify }) {
  const stats = [
    { icon: Wallet, label: 'TOTAL INCENTIVE POOL', value: '$142,500.00', trend: '+12.5%', sub: 'vs Last Month' },
    { icon: Target, label: 'PAYOUT READINESS', value: '88.4%', progress: 88 },
    { icon: Calendar, label: 'NEXT PAYOUT DATE', value: 'Oct 30, 2023', sub: '12 Days Remaining' },
  ];

  const monthly = [
    { month: 'May', value: 62 },
    { month: 'Jun', value: 70 },
    { month: 'Jul', value: 88 },
    { month: 'Aug', value: 65 },
    { month: 'Sep', value: 84 },
    { month: 'Oct', value: 50 },
  ];

  const allocation = [
    { name: 'Direct Sales', value: 55 },
    { name: 'Upsell Actions', value: 30 },
    { name: 'Retention Bonus', value: 15 },
  ];

  const leaderboard = [
    { rank: 1, initials: 'SJ', idx: 0, name: 'Sarah Jenkins', attainment: '112%', up: true, amount: '$12,450.00' },
    { rank: 2, initials: 'DC', idx: 1, name: 'David Chen', attainment: '105%', up: true, amount: '$10,800.00' },
    { rank: 3, initials: 'MT', idx: 2, name: 'Marcus Thorne', attainment: '98%', up: null, amount: '$9,200.00' },
  ];

  const [pending, setPending] = useState([
    { title: 'Direct Sales Commission - ID #8821', by: 'Emily Watson', amount: '$450.00' },
    { title: 'Upsell Multiplier - ID #8845', by: 'Jordan Lee', amount: '$1,200.00' },
    { title: 'Annual Retention - ID #8790', by: 'Sarah Jenkins', amount: '$3,500.00' },
  ]);

  function approve(item) {
    setPending((prev) => prev.filter((p) => p.title !== item.title));
    notify(`Approved ${item.amount} for ${item.by}`);
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800">Team Incentive Performance</h1>
          <p className="text-sm text-stone-400 mt-1">Real-time tracking of quarterly payouts and individual performance metrics.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => notify('Incentive report exported')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90" style={{ backgroundColor: C.dark }}>
            <Download size={14} /> Export Report
          </button>
          <button onClick={() => notify('Opening manual adjustment panel')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-stone-900 hover:opacity-90" style={{ backgroundColor: C.gold }}>
            <Plus size={14} /> Manual Adjust
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-800">Monthly Incentive Distribution</h3>
            <span className="text-sm text-stone-400">Last 6 Months ▾</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid stroke="#f0eee9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {monthly.map((m, i) => (
                    <Cell key={i} fill={i === monthly.length - 1 ? C.gold : '#3f3a35'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl p-5 text-white" style={{ backgroundColor: C.dark }}>
          <h3 className="font-semibold mb-4" style={{ color: C.gold }}>Pool Allocation</h3>
          <div className="space-y-4">
            {allocation.map((a, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span>{a.name}</span>
                  <span className="font-semibold">{a.value}%</span>
                </div>
                <ProgressBar value={a.value} bg="bg-white/10" />
              </div>
            ))}
          </div>
          <div className="mt-5 text-xs text-stone-400 bg-white/5 rounded-lg p-3 flex gap-2">
            <Target size={14} className="mt-0.5 shrink-0" />
            Allocations are adjusted based on Q4 priority goals for retention.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-800">Team Incentive Leaderboard</h3>
            <button onClick={() => notify('Opening full rank list')} className="text-sm font-medium hover:underline" style={{ color: C.goldSoft }}>View Full Rank</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-stone-400 border-b" style={{ borderColor: C.border }}>
                <th className="pb-2 font-medium">RANK</th>
                <th className="pb-2 font-medium">MEMBER</th>
                <th className="pb-2 font-medium">ATTAINMENT</th>
                <th className="pb-2 font-medium text-right">ESTIMATED INCENTIVE</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((l, i) => (
                <tr key={i} className="border-b last:border-0" style={{ borderColor: C.border }}>
                  <td className="py-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${l.rank === 1 ? 'text-stone-900' : 'text-stone-500 bg-stone-100'}`}
                      style={l.rank === 1 ? { backgroundColor: C.gold } : {}}
                    >
                      {l.rank}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar initials={l.initials} idx={l.idx} size="sm" />
                      <span className="font-medium text-stone-800">{l.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 text-stone-600">
                      {l.attainment}
                      {l.up === true && <TrendingUp size={13} className="text-emerald-500" />}
                      {l.up === false && <TrendingDown size={13} className="text-red-500" />}
                      {l.up === null && <Minus size={13} className="text-stone-400" />}
                    </div>
                  </td>
                  <td className="text-right font-semibold text-stone-800">{l.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-800">Pending Payout Validations</h3>
            <Badge type="red">{pending.length} Required</Badge>
          </div>
          <div className="space-y-3">
            {pending.length === 0 && <p className="text-sm text-stone-400 py-6 text-center">All claims are validated.</p>}
            {pending.map((p, i) => (
              <div key={i} className="border rounded-xl p-3" style={{ borderColor: C.border }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-stone-800">{p.title}</span>
                  <span className="text-sm font-semibold" style={{ color: C.goldSoft }}>{p.amount}</span>
                </div>
                <div className="text-xs text-stone-400 mb-2">Claimed by: {p.by}</div>
                <div className="flex gap-2">
                  <button onClick={() => approve(p)} className="flex-1 text-xs font-semibold py-1.5 rounded-lg text-stone-900 hover:opacity-90" style={{ backgroundColor: C.gold }}>Approve</button>
                  <button onClick={() => notify(`Reviewing claim from ${p.by}`)} className="flex-1 text-xs font-medium py-1.5 rounded-lg border hover:bg-stone-50" style={{ borderColor: C.border }}>Review</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => notify('Showing all pending claims')} className="w-full mt-3 text-sm font-medium py-2 rounded-lg hover:opacity-80" style={{ color: C.goldSoft, backgroundColor: '#fdf4e3' }}>View All Pending Claims</button>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* App                                                                      */
/* ---------------------------------------------------------------------- */
const SEARCH_PLACEHOLDERS = {
  dashboard: 'Search tasks, employees, or metrics...',
  employee: 'Search team members...',
  task: 'Search tasks, employees, or clients...',
  client: 'Search clients, projects, or tasks...',
  tracking: 'Search employees by name or ID...',
  analytics: 'Search analytics, employees, or tasks...',
  incentive: 'Search incentives, claims, or team members...',
};

export default function App() {
  const [page, setPage] = useState('login');
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  function notify(message) {
    setToast(message);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 2200);
  }

  if (page === 'login') {
    return <LoginPage onLogin={() => setPage('dashboard')} />;
  }

  const pages = {
    dashboard: <DashboardPage notify={notify} onNavigate={setPage} />,
    employee: <EmployeePage notify={notify} onNavigate={setPage} />,
    client: <ClientPage notify={notify} onNavigate={setPage} />,
    task: <TaskPage notify={notify} onNavigate={setPage} />,
    tracking: <TrackingPage notify={notify} onNavigate={setPage} />,
    analytics: <AnalyticsPage notify={notify} onNavigate={setPage} />,
    incentive: <IncentivePage notify={notify} onNavigate={setPage} />,
  };

  return (
    <>
      <Layout
        active={page}
        onChange={setPage}
        onLogout={() => setPage('login')}
        user="Alex Thompson"
        role="Team Lead"
        searchPlaceholder={SEARCH_PLACEHOLDERS[page]}
      >
        {pages[page]}
      </Layout>
      <Toast message={toast} />
    </>
  );
}
