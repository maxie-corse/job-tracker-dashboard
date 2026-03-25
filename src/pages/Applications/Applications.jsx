import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiAddCircleLine, RiLayoutGridLine, RiListCheck, RiBookmarkLine } from 'react-icons/ri';
import useApplications from '../../hooks/useApplications.js';
import useDebounce from '../../hooks/useDebounce.js';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import Filters from '../../components/Filters/Filters.jsx';
import JobCard from '../../components/JobCard/JobCard.jsx';
import { CompanyLogo } from '../../components/JobCard/JobCard.jsx';
import { sortApplications, getStatusBadgeClass, formatDate, formatSalary } from '../../utils/helpers.js';
import './Applications.css';

const TABS = [
  { id: 'All',          label: 'All'         },
  { id: 'Applied',      label: 'Applied'     },
  { id: 'Interviewing', label: 'Interviewing'},
  { id: 'Offer',        label: 'Offer'       },
  { id: 'Rejected',     label: 'Rejected'    },
  { id: 'Bookmarked',   label: 'Bookmarked', icon: RiBookmarkLine },
];

const DEFAULT_FILTERS = { status: '', platform: '', location: '' };

function Applications() {
  const { applications, deleteApplication, toggleBookmark } = useApplications();

  const [search,    setSearch]    = useState('');
  const [filters,   setFilters]   = useState(DEFAULT_FILTERS);
  const [sortKey,   setSortKey]   = useState('appliedDate_desc');
  const [activeTab, setActiveTab] = useState('All');
  const [viewMode,  setViewMode]  = useState('grid');

  const debouncedSearch = useDebounce(search, 400);

  const handleDelete   = (id) => { deleteApplication(id); toast.success('Application removed'); };
  const handleBookmark = (id) => { toggleBookmark(id); };
  const handleFilterChange = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));
  const handleReset = () => { setFilters(DEFAULT_FILTERS); setSearch(''); };

  /* Tab counts */
  const tabCounts = useMemo(() => ({
    All:          applications.length,
    Applied:      applications.filter(a => a.status === 'Applied').length,
    Interviewing: applications.filter(a => a.status === 'Interviewing').length,
    Offer:        applications.filter(a => a.status === 'Offer').length,
    Rejected:     applications.filter(a => a.status === 'Rejected').length,
    Bookmarked:   applications.filter(a => a.bookmarked).length,
  }), [applications]);

  /* Filtered + sorted list */
  const filtered = useMemo(() => {
    let list = [...applications];

    if (activeTab === 'Bookmarked') list = list.filter(a => a.bookmarked);
    else if (activeTab !== 'All')   list = list.filter(a => a.status === activeTab);

    if (filters.status)   list = list.filter(a => a.status   === filters.status);
    if (filters.platform) list = list.filter(a => a.platform === filters.platform);
    if (filters.location) list = list.filter(a => a.location === filters.location);

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(a =>
        a.company?.toLowerCase().includes(q) ||
        a.role?.toLowerCase().includes(q)
      );
    }

    return sortApplications(list, sortKey);
  }, [applications, activeTab, filters, debouncedSearch, sortKey]);

  const activeFilterCount =
    Object.values(filters).filter(Boolean).length + (search ? 1 : 0);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-subtitle">
            {filtered.length} of {applications.length} applications
          </p>
        </div>
        <Link to="/applications/new" className="btn btn-primary">
          <RiAddCircleLine size={16} /> Add Job
        </Link>
      </div>

      {/* Tabs */}
      <div className="tabs-row">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`tab-btn ${activeTab === id ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            {Icon && <Icon size={13} />}
            {label}
            <span className="tab-count">{tabCounts[id]}</span>
          </button>
        ))}
      </div>

      {/* Toolbar: search + view toggle */}
      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} />
        <div className="view-toggle">
          <button
            className={`btn btn-icon btn-ghost ${viewMode === 'grid' ? 'view-active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <RiLayoutGridLine size={16} />
          </button>
          <button
            className={`btn btn-icon btn-ghost ${viewMode === 'table' ? 'view-active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Table view"
          >
            <RiListCheck size={16} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-wrapper">
        <Filters
          filters={filters}
          onFilterChange={handleFilterChange}
          sortKey={sortKey}
          onSortChange={setSortKey}
          onReset={handleReset}
          activeCount={activeFilterCount}
        />
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No applications found</h3>
          <p>Try adjusting your filters or search query</p>
          <Link to="/applications/new" className="btn btn-primary" style={{ marginTop: 12 }}>
            <RiAddCircleLine size={16} /> Add your first application
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="jobs-grid">
          {filtered.map(app => (
            <JobCard
              key={app.id}
              application={app}
              onDelete={handleDelete}
              onBookmark={handleBookmark}
            />
          ))}
        </div>
      ) : (
        /* Table view */
        <div className="card table-card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Salary</th>
                  <th>Applied</th>
                  <th>Interview</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <tr key={app.id}>
                    <td>
                      <div className="table-company-cell">
                        <CompanyLogo company={app.company} />
                        <span className="table-company-name">{app.company}</span>
                      </div>
                    </td>
                    <td className="table-role">{app.role}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="table-meta">{app.location || '—'}</td>
                    <td className="table-meta">{formatSalary(app.salary)}</td>
                    <td className="table-meta">{formatDate(app.appliedDate)}</td>
                    <td className={app.interviewDate ? 'table-interview' : 'table-meta'}>
                      {app.interviewDate ? formatDate(app.interviewDate) : '—'}
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/applications/${app.id}`} className="btn btn-ghost btn-sm">
                          Edit
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(app.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applications;
