// The Filters component is a reusable, controlled UI component that allows users to filter job applications 
// by status, platform, and location, and also sort them., while keeping state managed outside.
// It receives all state and handlers as props
// The dropdown options are dynamically generated from constants
// It also includes conditional rendering for the reset button based on active filters

import React from 'react';
import { RiFilterLine, RiCloseLine } from 'react-icons/ri';
import { STATUS_OPTIONS, PLATFORM_OPTIONS, LOCATION_OPTIONS, SORT_OPTIONS } from '../../utils/helpers';
import './Filters.css';

// Props
// filters - object storing current filter values
// onFilterChange - function to update filters
// sortKey - current sorting option
// onSortChange - function to update sorting
// onReset - clears all filters
// activeCount - number of filters currently applied
function Filters({ filters, onFilterChange, sortKey, onSortChange, onReset, activeCount }) {
  return (
    <div className="filters-row">
      <div className="filters-group">
        <div className="filter-item">
          <label className="filter-label">Status</label>
          <select
            className="form-control filter-select"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label className="filter-label">Platform</label>
          <select
            className="form-control filter-select"
            value={filters.platform}
            onChange={(e) => onFilterChange('platform', e.target.value)}
          >
            <option value="">All Platforms</option>
            {PLATFORM_OPTIONS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label className="filter-label">Location</label>
          <select
            className="form-control filter-select"
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
          >
            <option value="">All Locations</option>
            {LOCATION_OPTIONS.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label className="filter-label">Sort By</label>
          <select
            className="form-control filter-select"
            value={sortKey}
            onChange={(e) => onSortChange(e.target.value)}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {activeCount > 0 && (
        <button className="btn btn-ghost btn-sm filter-reset" onClick={onReset}>
          <RiCloseLine size={14} />
          Clear ({activeCount})
        </button>
      )}
    </div>
  );
}

export default Filters;