import { Navigate } from "react-router-dom";

export default function Home() {
  const token = localStorage.getItem('access_token') || "";
  if(token) return <Navigate to="/dashboard" replace />
  return <Navigate to="/sign-in" replace />
};
