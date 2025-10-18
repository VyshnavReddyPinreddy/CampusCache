import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isLoggedin, userData, isLoading } = useContext(AppContent);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Only redirect if we're definitely not logged in
  if (!isLoading && !isLoggedin) {
    return <Navigate to="/" replace />;
  }

  // Only check role after we have user data
  if (!isLoading && allowedRole && userData?.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;