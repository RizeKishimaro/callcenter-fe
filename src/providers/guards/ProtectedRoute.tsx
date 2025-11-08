import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  role: string | null;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, allowedRoles }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (role && !allowedRoles.includes(role)) {
      navigate('/sign-in'); // Navigate to sign-in if role is not allowed
    }
  }, [role, allowedRoles, navigate]);

  // Render the children (protected component) only if the role is allowed
  return role && allowedRoles.includes(role) ? <Outlet /> : null;
};

export default ProtectedRoute;
