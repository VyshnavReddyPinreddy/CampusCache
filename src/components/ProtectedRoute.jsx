import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isLoggedin, userData } = useContext(AppContent);

  if (!isLoggedin) {
    return <Navigate to="/" replace />;
  }

  // If role is specified, check if user has the required role
  if (allowedRole && userData?.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;