import { Route, Routes, useNavigate } from 'react-router-dom'
import Error from './pages/error/Error'
import SignIn from './pages/auth/SignIn'
import Home from './pages/Home'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './providers/guards/ProtectedRoute'
import AdminHome from './pages/admin/AdminHome'
import AgentHome from './pages/agent/AgentHome'
import RecentCalls from './pages/agent/RecentCalls'
import SetupHome from './setup/SetupHome'
import SetUp from './pages/admin/SetUp'
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react'
import { JWTTokenTypes } from './providers/types/jwttypes'
import Agents from './pages/admin/components/Agents'
import SipProviderComponent from './pages/admin/components/SipProviderComponent'

function App() {
  const [userRole, setUserRole] = useState("admin");
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/")
    }
    const payload: JWTTokenTypes = jwtDecode(token);
    setUserRole("admin")

  }, [])

  return (
    <div>
      <Routes>
        <Route path="setup" element={<SetupHome />} />
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<DashboardLayout userRole={userRole} />} >
          <Route path='manage' element={<ProtectedRoute role={userRole} allowedRoles={['admin']} />} >
            <Route index element={<AdminHome />} />
            <Route path='set-up' element={<SetUp />} />
            <Route path="agents" element={<Agents />} />
            <Route path="sip-provider" element={<SipProviderComponent />} />
          </Route>
          <Route path='agent' element={<ProtectedRoute role={userRole} allowedRoles={['admin', 'supervisor', 'agent']} />} >
            <Route index element={<AgentHome />} />
            <Route path='recentcalls' element={<RecentCalls />} />
          </Route>
        </Route>
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </div>
  )
}

export default App
