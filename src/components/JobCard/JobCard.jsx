import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RiEditLine, RiDeleteBinLine, RiBookmarkLine, RiBookmarkFill,
  RiMapPinLine, RiMoneyDollarCircleLine, RiCalendarLine, RiBriefcaseLine,
  RiExternalLinkLine,
} from 'react-icons/ri';
import { getStatusBadgeClass, formatSalary, formatDate, getLogoUrl } from '../../utils/helpers';
import './JobCard.css';

function CompanyLogo({ company }) {
  const [errored, setErrored] = useState(false);
  const initial = company?.[0]?.toUpperCase() || '?';

  if (errored) {
    return (
      <div className="company-logo company-logo-fallback">
        <span>{initial}</span>
      </div>
    );
  }

  return (
    <img
      src={getLogoUrl(company)}
      alt={company}
      className="company-logo"
      onError={() => setErrored(true)}
    />
  );
}

function JobCard({ application, onDelete, onBookmark }) {
  const { id, company, role, location, salary, platform, status, appliedDate, interviewDate, notes, bookmarked } = application;
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const badgeClass = getStatusBadgeClass(status);

  const handleDelete = () => {
    if (showConfirmDelete) {
      onDelete(id);
    } else {
      setShowConfirmDelete(true);
      setTimeout(() => setShowConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="job-card animate-fadeInUp">
      {/* Card header */}
      <div className="job-card-header">
        <div className="company-info">
          <CompanyLogo company={company} />
          <div className="company-details">
            <h3 className="company-name">{company}</h3>
            <p className="job-role">{role}</p>
          </div>
        </div>
        <div className="card-actions">
          <button
            className={`btn btn-icon btn-ghost bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
            onClick={() => onBookmark(id)}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            {bookmarked ? <RiBookmarkFill size={15} /> : <RiBookmarkLine size={15} />}
          </button>
          <Link to={`/applications/${id}`} className="btn btn-icon btn-ghost" title="Edit">
            <RiEditLine size={15} />
          </Link>
          <button
            className={`btn btn-icon ${showConfirmDelete ? 'btn-danger' : 'btn-ghost'}`}
            onClick={handleDelete}
            title={showConfirmDelete ? 'Click again to confirm' : 'Delete'}
          >
            <RiDeleteBinLine size={15} />
          </button>
        </div>
      </div>

      {/* Status badge */}
      <div className="job-card-status">
        <span className={`badge ${badgeClass}`}>
          <span className="badge-dot" />
          {status}
        </span>
        <span className="job-platform">{platform}</span>
      </div>

      {/* Meta info */}
      <div className="job-card-meta">
        {location && (
          <span className="meta-item">
            <RiMapPinLine size={13} />
            {location}
          </span>
        )}
        {salary > 0 && (
          <span className="meta-item">
            <RiMoneyDollarCircleLine size={13} />
            {formatSalary(salary)}/yr
          </span>
        )}
        <span className="meta-item">
          <RiCalendarLine size={13} />
          {formatDate(appliedDate)}
        </span>
        {interviewDate && (
          <span className="meta-item meta-interview">
            <RiBriefcaseLine size={13} />
            Interview: {formatDate(interviewDate)}
          </span>
        )}
      </div>

      {/* Notes preview */}
      {notes && (
        <p className="job-card-notes">{notes}</p>
      )}

      {/* Footer */}
      <div className="job-card-footer">
        <Link to={`/applications/${id}`} className="btn btn-ghost btn-sm card-view-btn">
          View Details
          <RiExternalLinkLine size={13} />
        </Link>
        {showConfirmDelete && (
          <span className="confirm-msg">Click delete again to confirm</span>
        )}
      </div>
    </div>
  );
}

export default JobCard;
export { CompanyLogo };
