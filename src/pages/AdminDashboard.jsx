import React, { useContext, useEffect, useState } from 'react';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { assets } from '../assets/assets';

// Configure axios defaults for all requests
axios.defaults.withCredentials = true;

const AdminDashboard = () => {
  const { backendUrl, userData, isLoggedin, getUserData, isLoading } = useContext(AppContent);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication and admin status
  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoggedin) {
        // If not logged in, redirect
        navigate('/login');
        return;
      }

      if (!userData) {
        // If logged in but no user data, fetch it
        try {
          await getUserData();
        } catch (error) {
          console.error('Failed to get user data:', error);
          setIsCheckingAuth(false);
        }
        return;
      }

      if (userData.role !== 'Admin') {
        toast.error('Admin access required');
        navigate('/');
        return;
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [userData, isLoggedin, navigate, getUserData]);

  const handleAuthError = (error) => {
    if (error?.response?.status === 401) {
      // Unauthorized - redirect to login
      toast.error('Session expired. Please login again.');
      navigate('/login');
      return true;
    }
    return false;
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const endpoint = {
        pending: '/api/admin/reports/pending',
        inProcess: '/api/admin/reports/in-process',
        resolved: '/api/admin/reports/resolved'
      }[activeTab];

      const { data } = await axios.get(`${backendUrl}${endpoint}`);

      if (data.success) {
        // Set reports to empty array if no reports are found
        setReports(data.reports || data.data || []);
      } else {
        // Only show error if it's not a "no reports" situation
        const isNoReportsMessage = data.message?.toLowerCase().includes('no reports') || 
                                 data.message?.toLowerCase().includes('not found');
        if (!isNoReportsMessage) {
          toast.error(data.message || 'Failed to fetch reports');
        }
        setReports([]);
      }
    } catch (error) {
      if (!handleAuthError(error)) {
        // Only show error for actual errors, not for missing reports
        const errorMessage = error.response?.data?.error || error.message;
        const isNoReportsError = errorMessage?.toLowerCase().includes('no reports') || 
                                errorMessage?.toLowerCase().includes('not found');
        if (!isNoReportsError) {
          toast.error(errorMessage || 'Failed to fetch reports');
        }
      }
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isCheckingAuth) {
      fetchReports();
    }
  }, [activeTab, isCheckingAuth]);

  const handleClaim = async (reportId) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/admin/reports/claim/${reportId}`,
        {}
      );
      
      if (data.success) {
        toast.success(data.message || 'Report claimed successfully');
        fetchReports();
      } else {
        toast.error(data.message || 'Failed to claim report');
      }
    } catch (error) {
      if (!handleAuthError(error)) {
        toast.error(error.response?.data?.error || 'Failed to claim report');
      }
    }
  };

  const handleResolve = async (reportId, action) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/reports/resolve/${reportId}`,
        {
          action,
          adminNotes: action === 'Content Deleted' 
            ? 'Content was found to violate community guidelines and has been removed.'
            : 'Content was reviewed and found to be within community guidelines.'
        }
      );

      if (data.success) {
        toast.success(data.message || 'Report resolved successfully');
        fetchReports();
      } else {
        toast.error(data.message || 'Failed to resolve report');
      }
    } catch (error) {
      if (!handleAuthError(error)) {
        toast.error(error.response?.data?.error || 'Failed to resolve report');
      }
    }
  };

  const renderReportCard = (report) => (
    <div key={report._id} className="bg-slate-900 p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-indigo-300">Reported By:</span>
            <span className="text-sm text-indigo-200">{report.reportedBy.name}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-indigo-300">Content Type:</span>
            <span className="text-sm text-indigo-200">{report.contentType}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-indigo-300">Reason:</span>
            <span className="text-sm text-indigo-200">{report.reason}</span>
          </div>
          <p className="text-sm text-indigo-300 mt-2">{report.description}</p>
          {report.status === 'Resolved' && (
            <div className="mt-2 p-2 bg-slate-800 rounded">
              <p className="text-sm text-indigo-300">Action Taken: {report.actionTaken}</p>
              <p className="text-sm text-indigo-300">Admin Notes: {report.adminNotes}</p>
              <p className="text-sm text-indigo-300">Resolved At: {new Date(report.resolvedAt).toLocaleString()}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {report.status === 'Pending' && (
            <button
              onClick={() => handleClaim(report.contentId)}
              className="bg-indigo-600 text-indigo-200 px-4 py-2 rounded text-sm hover:bg-indigo-700 transition-colors"
            >
              Claim Report
            </button>
          )}
          {report.status === 'In Progress' && (
            <>
              <button
                onClick={() => handleResolve(report._id, 'Content Deleted')}
                className="bg-red-600 text-indigo-200 px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Delete Content
              </button>
              <button
                onClick={() => handleResolve(report._id, 'No Action Needed')}
                className="bg-green-600 text-indigo-200 px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors"
              >
                Mark Safe
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
        <Header />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-300 mx-auto"></div>
            <p className="mt-4 text-indigo-300">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-300">Admin Dashboard</h1>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-slate-800 text-indigo-300 px-4 py-2 rounded hover:bg-slate-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Go to Home
          </button>
        </div>
        
        {/* Tab Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex-1 ${
              activeTab === 'pending'
                ? 'bg-slate-800 text-indigo-300'
                : 'bg-slate-900 text-indigo-300 hover:bg-slate-800'
            }`}
          >
            Pending Reports
          </button>
          <button
            onClick={() => setActiveTab('inProcess')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex-1 ${
              activeTab === 'inProcess'
                ? 'bg-slate-800 text-indigo-300'
                : 'bg-slate-900 text-indigo-300 hover:bg-slate-800'
            }`}
          >
            In Process Reports
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex-1 ${
              activeTab === 'resolved'
                ? 'bg-slate-800 text-indigo-300'
                : 'bg-slate-900 text-indigo-300 hover:bg-slate-800'
            }`}
          >
            Resolved Reports
          </button>
        </div>

        {/* Reports Display */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 bg-slate-900 rounded-lg shadow-md">
              <p className="text-indigo-300">No {activeTab.replace(/([A-Z])/g, ' $1').toLowerCase()} reports found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map(report => renderReportCard(report))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;