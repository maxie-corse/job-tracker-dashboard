import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ApplicationProvider } from './context/ApplicationContext.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Applications from './pages/Applications/Applications.jsx';
import AddApplication from './pages/AddApplication/AddApplication.jsx';
import Analytics from './Analytics.jsx';


function App() {
    return (
      <ApplicationProvider>
        <BrowserRouter>
          <div className="app-layout">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/applications/new" element={<AddApplication />} />
                <Route path="/applications/:id" element={<AddApplication />} />
                <Route path="/analytics" element={<Analytics />} />
              </Routes>
            </main>
          </div>
          <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
        </BrowserRouter>
      </ApplicationProvider>
    );
  }

  export default App;
