import { Route, Routes, useNavigate } from 'react-router-dom'
import Error from './pages/error/Error'
import SignIn from './pages/auth/SignIn'
import Home from './pages/Home'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './providers/guards/ProtectedRoute'
import AdminHome from './pages/manage/AdminHome'
import AgentHome from './pages/agent/AgentHome'
import RecentCalls from './pages/agent/RecentCalls'
import SetUp from './pages/manage/SetUp'
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react'
import { JWTTokenTypes } from './providers/types/jwttypes'
import { Toaster } from './components/ui/toaster'
import Agents from './pages/manage/agent/Agents'
import CreateAgent from './pages/manage/agent/CreateAgent'
import User from './pages/manage/user/User'
import Campaign from './pages/manage/campaign/Campaign'
import CreateCampaign from './pages/manage/campaign/CreateCampaign'
import SipProvider from './pages/manage/sip-provider/SipProvider'
import CreateSipProvider from './pages/manage/sip-provider/CreateSipProvider'
import AudioStore from './pages/manage/audio-store/AudioStore'
import Ivr from './pages/manage/ivr/Ivr'
import CreateUser from './pages/manage/user/CreateUser'
import CallHistory from './pages/manage/call-history/CallHistory'

function App() {
  const role = localStorage.getItem('role') || '';
  const [userRole, setUserRole] = useState<string>(role);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("access_token") || "";
    if (!token) {
      navigate("/sign-in")
    }
    // const payload: JWTTokenTypes = jwtDecode(token) || "";
    // setUserRole("admin")

  }, [])

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        {/* <Route path='/setup' element={<Home />} /> */}
        <Route path='/dashboard' element={<DashboardLayout userRole={userRole} />} >
          <Route path='manage' element={<ProtectedRoute role={userRole} allowedRoles={['admin', 'supervisor']} />} >
            <Route index element={<AdminHome />} />
            <Route path='call-history' element={<CallHistory />} />
            <Route path='audio-store' element={<AudioStore />} />
            {/* both supervisor and admin can access this route"agent" how can I do? */}
            <Route path='agent' element={<Agents />} />
            <Route path='agent/create' element={<CreateAgent />} />
            <Route path='admin' element={<ProtectedRoute role={userRole} allowedRoles={['admin', 'supervisor']} />}>
              <Route index element={<User />} />
              <Route path='set-up' element={<SetUp />} />
              <Route path='create' element={<CreateUser />} />
              <Route path='ivr' element={<Ivr />} />
              <Route path='campaign' element={<Campaign />} />
              <Route path='campaign/create' element={<CreateCampaign />} />
              <Route path='sip-provider' element={<SipProvider />} />
              <Route path='sip-provider/create' element={<CreateSipProvider />} />
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
