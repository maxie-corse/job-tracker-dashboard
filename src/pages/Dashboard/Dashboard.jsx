import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  RiBriefcaseLine, RiCalendarCheckLine, RiTrophyLine,
  RiCloseCircleLine, RiAddCircleLine, RiArrowRightLine,
} from 'react-icons/ri';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import useApplications from '../../hooks/useApplications.js';
import { formatDate, getStatusBadgeClass, formatSalary, getPipelineData, getMonthlyData } from '../../utils/helpers';
import { CompanyLogo } from '../../components/JobCard/JobCard.jsx';
import './Dashboard.css';

const STAT_CARDS = [
  { key: 'total',        label: 'Total Applications',  icon: RiBriefcaseLine,     color: 'accent' },
  { key: 'interviewing', label: 'Interviews Active',    icon: RiCalendarCheckLine, color: 'amber'  },
  { key: 'offers',       label: 'Offers Received',      icon: RiTrophyLine,        color: 'green'  },
  { key: 'rejected',     label: 'Rejected',             icon: RiCloseCircleLine,   color: 'red'    },
];

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip-name" style={{ color: payload[0].payload?.color || 'var(--accent)' }}>
        {payload[0].name}
      </span>
      <span className="chart-tooltip-val">{payload[0].value} applications</span>
    </div>
  );
};

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip-name">{label}</span>
      <span className="chart-tooltip-val">{payload[0].value} applied</span>
    </div>
  );
};

function StatCard({ stat, value }) {
  const Icon = stat.icon;
  return (
    <div className={`stat-card stat-card-${stat.color}`}>
      <div className={`stat-icon-wrap stat-icon-${stat.color}`}>
        <Icon size={20} />
      </div>
      <div className="stat-body">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{stat.label}</div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { applications, stats } = useApplications();

  const pieData     = useMemo(() => getPipelineData(applications), [applications]);
  const monthlyData = useMemo(() => getMonthlyData(applications),  [applications]);

  const recent = useMemo(
    () => [...applications].sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)).slice(0, 5),
    [applications],
  );

  const upcoming = useMemo(
    () =>
      applications
        .filter(a => a.interviewDate && new Date(a.interviewDate) >= new Date())
        .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
        .slice(0, 4),
    [applications],
  );

  return (
    <div className="page-wrapper">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Your job search at a glance</p>
        </div>
        <Link to="/applications/new" className="btn btn-primary">
          <RiAddCircleLine size={16} /> Add Job
        </Link>
      </div>

      {/* ── Stat cards ── */}
      <div className="stat-grid">
        {STAT_CARDS.map(s => <StatCard key={s.key} stat={s} value={stats[s.key]} />)}
      </div>

      {/* ── Charts ── */}
      <div className="charts-row">
        {/* Donut */}
        <div className="card chart-card">
          <h3 className="card-title">Pipeline Overview</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie
                    data={pieData} cx="50%" cy="50%"
                    innerRadius={52} outerRadius={82}
                    paddingAngle={3} dataKey="value"
                  >
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {pieData.map(d => (
                  <div key={d.name} className="legend-item">
                    <span className="legend-dot" style={{ background: d.color }} />
                    <span>{d.name}</span>
                    <span className="legend-val">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ padding: '40px 0' }}><p>No data yet</p></div>
          )}
        </div>

        {/* Bar */}
        <div className="card chart-card chart-card-wide">
          <h3 className="card-title">Monthly Applications</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<BarTooltip />} cursor={{ fill: 'var(--accent-dim)' }} />
                <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '40px 0' }}><p>No monthly data yet</p></div>
          )}
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="bottom-row">
        {/* Recent */}
        <div className="card">
          <div className="card-header-row">
            <h3 className="card-title" style={{ marginBottom: 0 }}>Recent Applications</h3>
            <Link to="/applications" className="card-link">View all <RiArrowRightLine size={13} /></Link>
          </div>
          <div className="recent-list">
            {recent.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px 0' }}>
                <div className="empty-state-icon">📋</div>
                <p>No applications yet</p>
              </div>
            ) : recent.map(app => (
              <div key={app.id} className="recent-item">
                <CompanyLogo company={app.company} />
                <div className="recent-info">
                  <div className="recent-company">{app.company}</div>
                  <div className="recent-role">{app.role}</div>
                </div>
                <div className="recent-right">
                  <span className={`badge ${getStatusBadgeClass(app.status)}`}>{app.status}</span>
                  <span className="recent-date">{formatDate(app.appliedDate)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming interviews */}
        <div className="card">
          <div className="card-header-row">
            <h3 className="card-title" style={{ marginBottom: 0 }}>Upcoming Interviews</h3>
            <RiCalendarCheckLine size={16} style={{ color: 'var(--amber)' }} />
          </div>
          {upcoming.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <div className="empty-state-icon">📅</div>
              <h3>No upcoming interviews</h3>
              <p>Add interview dates to your applications</p>
            </div>
          ) : (
            <div className="upcoming-list">
              {upcoming.map(app => {
                const d = new Date(app.interviewDate);
                return (
                  <div key={app.id} className="upcoming-item">
                    <div className="upcoming-date-box">
                      <span className="upcoming-month">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="upcoming-day">{d.getDate()}</span>
                    </div>
                    <div className="upcoming-details">
                      <div className="upcoming-company">{app.company}</div>
                      <div className="upcoming-role">{app.role}</div>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(app.status)}`}>{app.status}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
