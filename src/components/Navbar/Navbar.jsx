import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  RiDashboardLine, RiFileList3Line, RiAddCircleLine,
  RiBarChartBoxLine, RiMenuLine, RiCloseLine, RiBriefcaseLine
} from 'react-icons/ri';
import useApplications from '../../hooks/useApplications';
import './Navbar.css';

const NAV_ITEMS = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { to: '/applications', icon: RiFileList3Line, label: 'Applications' },
  { to: '/applications/new', icon: RiAddCircleLine, label: 'Add Job' },
  { to: '/analytics', icon: RiBarChartBoxLine, label: 'Analytics' },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { stats } = useApplications();
  const location = useLocation();

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <RiCloseLine size={22} /> : <RiMenuLine size={22} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div className="nav-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <nav className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <RiBriefcaseLine size={20} />
          </div>
          <div>
            <span className="logo-text">JobLens</span>
            <span className="logo-sub">Job Tracker</span>
          </div>
        </div>

        {/* Stats strip */}
        <div className="sidebar-stats">
          <div className="stat-pill">
            <span className="stat-pill-value">{stats.total}</span>
            <span className="stat-pill-label">Total</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-value text-amber">{stats.interviewing}</span>
            <span className="stat-pill-label">Active</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-value text-green">{stats.offers}</span>
            <span className="stat-pill-label">Offers</span>
          </div>
        </div>

        {/* Nav links */}
        <div className="nav-section">
          <span className="nav-section-label">Navigation</span>
          <ul className="nav-list">
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                  {label === 'Applications' && stats.total > 0 && (
                    <span className="nav-badge">{stats.total}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Pipeline summary */}
        <div className="sidebar-pipeline">
          <span className="nav-section-label">Pipeline</span>
          <div className="pipeline-bars">
            {[
              { label: 'Applied', count: stats.applied, color: 'var(--blue)' },
              { label: 'Interviewing', count: stats.interviewing, color: 'var(--amber)' },
              { label: 'Offers', count: stats.offers, color: 'var(--green)' },
              { label: 'Rejected', count: stats.rejected, color: 'var(--red)' },
            ].map(({ label, count, color }) => (
              <div key={label} className="pipeline-bar-row">
                <span className="pipeline-label">{label}</span>
                <div className="pipeline-track">
                  <div
                    className="pipeline-fill"
                    style={{
                      width: stats.total ? `${(count / stats.total) * 100}%` : '0%',
                      background: color,
                    }}
                  />
                </div>
                <span className="pipeline-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-inner">
            <div className="user-avatar">JS</div>
            <div>
              <div className="user-name">Job Seeker</div>
              <div className="user-role">Active Search</div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
