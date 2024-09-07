// src/components/ProtectedRoute.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  role: string;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, allowedRoles }) => {
  console.log(role, allowedRoles.includes(role))
  return allowedRoles.includes(role) ? <Outlet /> : <>You Are Not Authorized To Perform this action</>;
};

export default ProtectedRoute;
