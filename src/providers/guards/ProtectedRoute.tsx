// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  role: string;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, allowedRoles }) => {
  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/error" replace />;
};

export default ProtectedRoute;
