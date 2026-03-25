import React, { useMemo } from 'react';
import { RiBarChartBoxLine, RiTrophyLine, RiTimeLine, RiPercentLine, RiBookmarkLine } from 'react-icons/ri';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import useApplications from './hooks/useApplications';
import { getPipelineData, getMonthlyData, formatSalary } from './utils/helpers';
import './Analytics.css';

const PLATFORM_COLORS = ['#7c6fff','#38bdf8','#22d3a0','#f59e0b','#f4426c','#c084fc'];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip-box">
      {label && <div className="chart-tooltip-label">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="chart-tooltip-row" style={{ color: p.color || 'var(--text-primary)' }}>
          <span>{p.name || p.dataKey}</span>
          <span className="chart-tooltip-val">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

function KpiCard({ icon: Icon, value, label, color, bg }) {
  return (
    <div className="kpi-card">
      <div className="kpi-icon" style={{ background: bg, color }}>
        <Icon size={20} />
      </div>
      <div>
        <div className="kpi-value">{value}</div>
        <div className="kpi-label">{label}</div>
      </div>
    </div>
  );
}

function Analytics() {
  const { applications, stats } = useApplications();

  const pieData     = useMemo(() => getPipelineData(applications), [applications]);
  const monthlyData = useMemo(() => getMonthlyData(applications),  [applications]);

  const platformData = useMemo(() => {
    const counts = {};
    applications.forEach(a => {
      if (a.platform) counts[a.platform] = (counts[a.platform] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
  }, [applications]);

  const responseRate = stats.total > 0
    ? Math.round(((stats.interviewing + stats.offers) / stats.total) * 100)
    : 0;

  const offerRate = stats.total > 0
    ? Math.round((stats.offers / stats.total) * 100)
    : 0;

  const avgSalary = useMemo(() => {
    const sals = applications.filter(a => a.salary > 0).map(a => Number(a.salary));
    if (!sals.length) return 0;
    return Math.round(sals.reduce((s, v) => s + v, 0) / sals.length);
  }, [applications]);

  const topSalaryApp = useMemo(
    () => applications.filter(a => a.salary > 0).sort((a, b) => b.salary - a.salary)[0],
    [applications],
  );

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Deep dive into your job search metrics</p>
        </div>
      </div>

      {/* KPI row */}
      <div className="kpi-grid">
        <KpiCard
          icon={RiPercentLine}
          value={`${responseRate}%`}
          label="Response Rate"
          color="var(--accent)"
          bg="var(--accent-dim)"
        />
        <KpiCard
          icon={RiTrophyLine}
          value={`${offerRate}%`}
          label="Offer Rate"
          color="var(--green)"
          bg="var(--green-dim)"
        />
        <KpiCard
          icon={RiTimeLine}
          value={avgSalary > 0 ? formatSalary(avgSalary) : '—'}
          label="Avg Target Salary"
          color="var(--blue)"
          bg="var(--blue-dim)"
        />
        <KpiCard
          icon={RiBookmarkLine}
          value={stats.bookmarked}
          label="Bookmarked Jobs"
          color="var(--purple)"
          bg="var(--purple-dim)"
        />
        <KpiCard
          icon={RiBarChartBoxLine}
          value={stats.total}
          label="Total Applications"
          color="var(--amber)"
          bg="var(--amber-dim)"
        />
      </div>

      {/* Charts grid */}
      <div className="analytics-grid">

        {/* Donut: pipeline */}
        <div className="card analytics-chart-card">
          <div className="analytics-chart-header">
            <h3 className="analytics-chart-title">Pipeline Breakdown</h3>
          </div>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((e, i) => (
                      <Cell key={i} fill={e.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-legend">
                {pieData.map(d => (
                  <div key={d.name} className="donut-legend-item">
                    <span className="donut-legend-dot" style={{ background: d.color }} />
                    <span className="donut-legend-name">{d.name}</span>
                    <span className="donut-legend-pct">
                      {Math.round((d.value / stats.total) * 100)}%
                    </span>
                    <span className="donut-legend-count">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <div className="empty-state-icon">📊</div>
              <p>Add applications to see data</p>
            </div>
          )}
        </div>

        {/* Bar: monthly */}
        <div className="card analytics-chart-card">
          <div className="analytics-chart-header">
            <h3 className="analytics-chart-title">Monthly Trend</h3>
          </div>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  axisLine={false} tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: 'var(--accent-dim)' }}
                />
                <Bar
                  dataKey="count"
                  fill="var(--accent)"
                  radius={[4, 4, 0, 0]}
                  name="Applications"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <p>No monthly data yet</p>
            </div>
          )}
        </div>

        {/* Horizontal bar: platform */}
        <div className="card analytics-chart-card analytics-span-2">
          <div className="analytics-chart-header">
            <h3 className="analytics-chart-title">Applications by Platform</h3>
          </div>
          {platformData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={platformData}
                layout="vertical"
                margin={{ top: 0, right: 24, left: 80, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  axisLine={false} tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                  axisLine={false} tickLine={false}
                  width={80}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: 'var(--accent-dim)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Applications">
                  {platformData.map((_, i) => (
                    <Cell key={i} fill={PLATFORM_COLORS[i % PLATFORM_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <p>No platform data yet</p>
            </div>
          )}
        </div>

      </div>

      {/* Summary table */}
      {applications.length > 0 && (
        <div className="card analytics-summary-card">
          <h3 className="analytics-chart-title" style={{ marginBottom: 16 }}>
            Status Summary
          </h3>
          <div className="summary-rows">
            {[
              { label: 'Applied',      count: stats.applied,      color: 'var(--blue)',   bar: 'blue'  },
              { label: 'Interviewing', count: stats.interviewing,  color: 'var(--amber)',  bar: 'amber' },
              { label: 'Offer',        count: stats.offers,        color: 'var(--green)',  bar: 'green' },
              { label: 'Rejected',     count: stats.rejected,      color: 'var(--red)',    bar: 'red'   },
            ].map(row => (
              <div key={row.label} className="summary-row">
                <span className="summary-label" style={{ color: row.color }}>{row.label}</span>
                <div className="summary-track">
                  <div
                    className="summary-fill"
                    style={{
                      width: stats.total ? `${(row.count / stats.total) * 100}%` : '0%',
                      background: row.color,
                    }}
                  />
                </div>
                <span className="summary-pct">
                  {stats.total ? Math.round((row.count / stats.total) * 100) : 0}%
                </span>
                <span className="summary-count">{row.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
