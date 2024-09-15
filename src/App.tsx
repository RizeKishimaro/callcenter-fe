import { Route, Routes, useNavigate } from 'react-router-dom'
import Error from './pages/error/Error'
import SignIn from './pages/auth/SignIn'
import Home from './pages/Home'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './providers/guards/ProtectedRoute'
import AgentHome from './pages/agent/AgentHome'
import RecentCalls from './pages/agent/RecentCalls'
import SetUp from './pages/manage/SetUp'
import { useEffect } from 'react'
import { Toaster } from './components/ui/toaster'
import Agents from './pages/manage/agent/Agents'
import CreateAgent from './pages/manage/agent/CreateAgent'
import User from './pages/manage/user/User'
import Campaigns from './pages/manage/campaign/Campaign'
import CreateCampaign from './pages/manage/campaign/CreateCampaign'
import SipProviders from './pages/manage/sip-provider/SipProvider'
import CreateSipProvider from './pages/manage/sip-provider/CreateSipProvider'
import AudioStore from './pages/manage/audio-store/AudioStore'
import Ivr from './pages/manage/ivr/Ivr'
import CreateUser from './pages/manage/user/CreateUser'
import CallHistories from './pages/manage/call-history/CallHistory'
import { useSelector } from 'react-redux'
import AdminHome from './pages/manage/AdminHome'
import SipProviderForm from './components/form/SipProviderForm'

function App() {
  const navigate = useNavigate();

  // Use useSelector to get the user's role from the Redux store
  const userRole = useSelector((state: any) => state.auth.role);
  const accessToken = useSelector((state: any) => state.auth.access_token);

  useEffect(() => {
    if (!accessToken) {
      navigate('/sign-in');
    } else {
      console.log("User Role:", userRole); // Debugging output
    }
  }, [accessToken, userRole, navigate]);

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        {/* <Route path='/setup' element={<SipProviderForm />} /> */}
        <Route path='/dashboard' element={<DashboardLayout userRole={userRole} />} >
          <Route path='manage' element={<ProtectedRoute role={userRole} allowedRoles={['admin', 'supervisor']} />} >
            <Route index element={<AdminHome />} />
            <Route path='set-up' element={<SetUp />} />
            <Route path="agent" element={<Agents />} />
            <Route path='call-history' element={<CallHistories />} />
            <Route path='audio-store' element={<AudioStore />} />
            {/* both supervisor and admin can access this route"agent" how can I do? */}
            <Route path='agent' element={<Agents />} />
            <Route path='agent/create' element={<CreateAgent />} />
            <Route path='admin' element={<ProtectedRoute role={userRole} allowedRoles={['admin', 'supervisor']} />}>
              <Route index element={<User />} />
              <Route path='set-up' element={<SetUp />} />
              <Route path='create' element={<CreateUser />} />
              <Route path='ivr' element={<Ivr />} />
              <Route path='campaign' element={<Campaigns />} />
              <Route path='campaign/create' element={<CreateSipProvider />} />
              {/* <Route path='campaign/create' element={<CreateCampaign />} /> */}
              <Route path='sip-provider' element={<SipProviders />} />
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
