import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { RiArrowLeftLine, RiSaveLine, RiBriefcaseLine } from 'react-icons/ri';
import useApplications from '../../hooks/useApplications.js';
import { STATUS_OPTIONS, PLATFORM_OPTIONS, LOCATION_OPTIONS } from '../../utils/helpers.js';
import './AddApplication.css';

const schema = yup.object({
  company:       yup.string().required('Company name is required').trim(),
  role:          yup.string().required('Job role is required').trim(),
  appliedDate:   yup.string().required('Applied date is required'),
  location:      yup.string().default('Remote'),
  salary:        yup
    .number()
    .typeError('Must be a valid number')
    .min(0, 'Salary must be positive')
    .nullable()
    .transform(v => (isNaN(v) ? null : v)),
  platform:      yup.string().default('LinkedIn'),
  status:        yup.string().default('Applied'),
  interviewDate: yup.string().nullable().default(''),
  notes:         yup.string().nullable().default(''),
});

const today = new Date().toISOString().split('T')[0];

function Field({ label, error, required, children }) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label} {required && <span className="required-star">*</span>}
      </label>
      {children}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

function AddApplication() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { addApplication, updateApplication, getApplication } = useApplications();
  const isEdit       = Boolean(id);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status:      'Applied',
      platform:    'LinkedIn',
      location:    'Remote',
      appliedDate: today,
      interviewDate: '',
      notes:       '',
      salary:      '',
    },
  });

  /* Pre-fill form for edit mode */
  useEffect(() => {
    if (isEdit && id) {
      const app = getApplication(id);
      if (app) {
        reset({ ...app, salary: app.salary || '' });
      } else {
        toast.error('Application not found');
        navigate('/applications');
      }
    }
  }, [id, isEdit]); // eslint-disable-line

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (isEdit) {
        updateApplication(id, data);
        toast.success('Application updated successfully!');
      } else {
        addApplication(data);
        toast.success('Application added successfully!');
      }
      navigate('/applications');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div className="add-page-title-row">
          <Link to="/applications" className="btn btn-ghost btn-icon back-btn">
            <RiArrowLeftLine size={18} />
          </Link>
          <div>
            <h1 className="page-title">
              {isEdit ? 'Edit Application' : 'Add New Job'}
            </h1>
            <p className="page-subtitle">
              {isEdit ? 'Update your application details' : 'Track a new job application'}
            </p>
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="add-form-layout">
        <form onSubmit={handleSubmit(onSubmit)} className="add-form-main" noValidate>

          {/* ── Job Details ── */}
          <div className="form-card card">
            <div className="form-section-header">
              <div className="form-section-icon">
                <RiBriefcaseLine size={16} />
              </div>
              <h3 className="form-section-title">Job Details</h3>
            </div>

            <div className="form-grid-2">
              <Field label="Company Name" required error={errors.company?.message}>
                <input
                  {...register('company')}
                  className={`form-control ${errors.company ? 'error' : ''}`}
                  placeholder="e.g. Google, Stripe, Notion"
                />
              </Field>

              <Field label="Job Role" required error={errors.role?.message}>
                <input
                  {...register('role')}
                  className={`form-control ${errors.role ? 'error' : ''}`}
                  placeholder="e.g. Senior Frontend Engineer"
                />
              </Field>

              <Field label="Location Type" error={errors.location?.message}>
                <select {...register('location')} className="form-control">
                  {LOCATION_OPTIONS.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </Field>

              <Field label="Annual Salary (USD)" error={errors.salary?.message}>
                <input
                  {...register('salary')}
                  type="number"
                  className={`form-control ${errors.salary ? 'error' : ''}`}
                  placeholder="e.g. 120000"
                  min="0"
                />
              </Field>
            </div>
          </div>

          {/* ── Application Info ── */}
          <div className="form-card card">
            <div className="form-section-header">
              <div className="form-section-icon" style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}>
                <RiBriefcaseLine size={16} />
              </div>
              <h3 className="form-section-title">Application Info</h3>
            </div>

            <div className="form-grid-2">
              <Field label="Platform" error={errors.platform?.message}>
                <select {...register('platform')} className="form-control">
                  {PLATFORM_OPTIONS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </Field>

              <Field label="Status" error={errors.status?.message}>
                <select {...register('status')} className="form-control">
                  {STATUS_OPTIONS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </Field>

              <Field label="Applied Date" required error={errors.appliedDate?.message}>
                <input
                  {...register('appliedDate')}
                  type="date"
                  className={`form-control ${errors.appliedDate ? 'error' : ''}`}
                />
              </Field>

              <Field label="Interview Date" error={errors.interviewDate?.message}>
                <input
                  {...register('interviewDate')}
                  type="date"
                  className="form-control"
                />
              </Field>
            </div>
          </div>

          {/* ── Notes ── */}
          <div className="form-card card">
            <div className="form-section-header">
              <div className="form-section-icon" style={{ background: 'var(--purple-dim)', color: 'var(--purple)' }}>
                <RiBriefcaseLine size={16} />
              </div>
              <h3 className="form-section-title">Notes & Reminders</h3>
            </div>

            <Field label="Notes" error={errors.notes?.message}>
              <textarea
                {...register('notes')}
                className="form-control"
                placeholder="Add any notes, contact info, follow-up reminders, or anything helpful…"
                rows={5}
              />
            </Field>
          </div>

          {/* Actions */}
          <div className="form-actions-bar">
            <Link to="/applications" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving
                ? <span className="spinner" />
                : <RiSaveLine size={16} />
              }
              {isEdit ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>

        {/* Sidebar tips */}
        <aside className="add-form-sidebar">
          <div className="card tips-card">
            <h4 className="tips-title">💡 Tips</h4>
            <ul className="tips-list">
              <li>Add the company domain name correctly for automatic logo fetching.</li>
              <li>Set an interview date to see it on the Dashboard countdown.</li>
              <li>Use Notes to track recruiter names, links, and follow-up dates.</li>
              <li>Bookmark high-priority applications to keep them in view.</li>
              <li>Update the status after every stage change to keep analytics accurate.</li>
            </ul>
          </div>

          <div className="card status-guide-card">
            <h4 className="tips-title">📊 Status Guide</h4>
            <div className="status-guide-list">
              {STATUS_OPTIONS.map(s => (
                <div key={s.value} className="status-guide-item">
                  <span className={`badge badge-${s.value.toLowerCase()}`}>{s.label}</span>
                  <span className="status-guide-desc">
                    {s.value === 'Applied'      && 'Application submitted'}
                    {s.value === 'Interviewing' && 'In interview rounds'}
                    {s.value === 'Offer'        && 'Offer in hand 🎉'}
                    {s.value === 'Rejected'     && 'Not selected this time'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AddApplication;
