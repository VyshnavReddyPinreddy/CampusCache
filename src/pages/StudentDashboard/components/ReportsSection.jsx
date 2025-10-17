import React, { useState, useEffect, useContext } from 'react';
import { AppContent } from '../../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReportsSection = () => {
  const { backendUrl, userData } = useContext(AppContent);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/report/user/${userData?._id}`);
        if (data.success) {
          setReports(data.reports || []);
        } else {
          toast.error(data.message || 'Failed to fetch reports');
        }
      } catch (error) {
        toast.error('Error fetching reports');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyReports();
  }, [backendUrl, userData]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading reports...</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No reports found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <div key={report._id} className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-600">Content Type:</span>
            <span className="text-sm text-gray-800">{report.contentType}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-600">Status:</span>
            <span className={`text-sm ${
              report.status === 'Pending' ? 'text-yellow-600' :
              report.status === 'In Progress' ? 'text-blue-600' :
              'text-green-600'
            }`}>{report.status}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-600">Reasons:</span>
            <span className="text-sm text-gray-800">{report.reasons.join(', ')}</span>
          </div>
          <p className="text-sm text-gray-700 mt-2">{report.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ReportsSection;