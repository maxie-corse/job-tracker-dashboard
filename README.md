# KaamDhanda — Job Tracker Dashboard

A job application tracking dashboard built with React.
Designed to help users efficiently manage job applications, track interview progress, and gain insights through analytics.

---

## Live Demo

https://job-tracker-dashboard-silk.vercel.app/

---

## Problem Statement

Managing multiple job applications across platforms like LinkedIn, referrals, and company websites becomes chaotic.

Common challenges:

* Losing track of applied jobs
* Missing interview schedules
* No centralized view of progress
* Difficulty analyzing job search performance

**JobTrack solves this by providing a centralized, data-driven dashboard.**

---

## Features

### Application Management

* Add, edit, and delete job applications
* Track company, role, salary, platform, and notes
* Bookmark important opportunities

### Smart Search & Filters

* Real-time search (company & role)
* Debounced input for performance optimization
* Filter by:

  * Status (Applied, Interviewing, Offer, Rejected, Wishlist)
  * Platform
  * Location type (Remote / Onsite / Hybrid)

### Dashboard Analytics

* Total applications, interviews, offers, rejections
* Application pipeline visualization
* Monthly application trends
* Weekly activity insights
* Salary analytics by stage

### Job Pipeline Tracking

* Categorize applications by stage:

  * Wishlist → Applied → Interview → Offer → Rejected

### Bookmarks

* Save important jobs
* Dedicated bookmarks view

### Persistence

* Data stored in localStorage
* State persists across refresh

### UI/UX

* Dark-themed modern dashboard
* Responsive layout
* Smooth animations and transitions
* Empty states and visual feedback

---

## Tech Stack

**Frontend**

* React (Vite)
* Context API (global state management)

**Libraries**

* Chart.js (data visualization)
* JavaScript (ES6+)

**Architecture**

* Component-based design
* Custom hooks (useDebounce, useLocalStorage)
* Modular folder structure

---

## Project Structure

```
src/
  components/
    Sidebar.jsx
    JobCard.jsx
    Modals.jsx
  pages/
    Dashboard.jsx
    Applications.jsx
    Analytics.jsx
    Bookmarks.jsx
  context/
    AppContext.jsx
  hooks/
    useDebounce.js
    useLocalStorage.js
  utils/
    helpers.js
  App.jsx
  main.jsx
  index.css
```

---

## Installation & Setup

```bash
git clone https://github.com/your-username/job-tracker-dashboard.git
cd job-tracker
npm install
npm run dev
```

---

## Future Improvements

* Backend integration (Node.js / Firebase)
* User authentication
* Notifications & reminders for interviews
* Email/calendar integration
* Export data (CSV / PDF)
