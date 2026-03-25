import React, { createContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SEED_APPLICATIONS } from '../utils/helpers.js';

export const ApplicationContext = createContext(null);

const STORAGE_KEY = 'joblens_applications';

export function ApplicationProvider({ children }) {
  const [applications, setApplications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : SEED_APPLICATIONS;
    } catch {
      return SEED_APPLICATIONS;
    }
  });

  const [loading, setLoading] = useState(false);

  // Persist to localStorage whenever applications change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (err) {
      console.error('Failed to persist applications:', err);
    }
  }, [applications]);

  const addApplication = useCallback((data) => {
    const newApp = {
      ...data,
      id: uuidv4(),
      bookmarked: false,
      salary: data.salary ? Number(data.salary) : 0,
    };
    setApplications(prev => [newApp, ...prev]);
    return newApp;
  }, []);

  const updateApplication = useCallback((id, data) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === id
          ? { ...app, ...data, salary: data.salary ? Number(data.salary) : app.salary }
          : app
      )
    );
  }, []);

  const deleteApplication = useCallback((id) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  }, []);

  const toggleBookmark = useCallback((id) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === id ? { ...app, bookmarked: !app.bookmarked } : app
      )
    );
  }, []);

  const getApplication = useCallback((id) => {
    return applications.find(app => app.id === id) || null;
  }, [applications]);

  // Analytics derived values
  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'Applied').length,
    interviewing: applications.filter(a => a.status === 'Interviewing').length,
    offers: applications.filter(a => a.status === 'Offer').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
    bookmarked: applications.filter(a => a.bookmarked).length,
  };

  const value = {
    applications,
    loading,
    setLoading,
    addApplication,
    updateApplication,
    deleteApplication,
    toggleBookmark,
    getApplication,
    stats,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
}
