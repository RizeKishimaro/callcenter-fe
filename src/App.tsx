import { Route, Routes, useNavigate } from 'react-router-dom'
import Error from './pages/error/Error'
import SignIn from './pages/auth/SignIn'
import Home from './pages/Home'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './providers/guards/ProtectedRoute'
import AdminHome from './pages/admin/AdminHome'
import AgentHome from './pages/agent/AgentHome'
import RecentCalls from './pages/agent/RecentCalls'
import SetUp from './pages/admin/SetUp'
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react'
import { JWTTokenTypes } from './providers/types/jwttypes'
import { Toaster } from './components/ui/toaster'
import Agents from './pages/admin/agent/Agents'
import User from './pages/admin/user/User'
import Campaign from './pages/admin/campaign/Campaign'

function App() {
  const [userRole, setUserRole] = useState("admin");
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("access_token") || "";
    if (!token) {
      navigate("/")
    }
    // const payload: JWTTokenTypes = jwtDecode(token) || "";
    setUserRole("admin")

  }, [])

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        {/* <Route path='/setup' element={<Home />} /> */}
        <Route path='/dashboard' element={<DashboardLayout userRole={userRole} />} >
          <Route path='manage' element={<ProtectedRoute role={userRole} allowedRoles={['admin', 'supervisor']} />} >
            <Route index element={<AdminHome />} />
            <Route path='set-up' element={<SetUp />} />
            {/* both supervisor and admin can access this route"agent" how can I do? */}
            <Route path='agent' element={<Agents />} />
            <Route path='admin' element={<ProtectedRoute role={userRole} allowedRoles={['admin', 'supervisor']} />}>
              <Route index element={<User />} />
              <Route path='campaign' element={<Campaign />} />
            </Route>
          </Route>
          <Route path='agent' element={<ProtectedRoute role={userRole} allowedRoles={['admin', 'supervisor', 'agent']} />} >
            <Route index element={<AgentHome />} />
            <Route path='recentcalls' element={<RecentCalls />} />
          </Route>
        </Route>
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='*' element={<Error />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
