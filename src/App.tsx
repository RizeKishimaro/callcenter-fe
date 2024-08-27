import { Route, Routes } from 'react-router-dom'
import Error from './pages/error/Error'
import SignIn from './pages/auth/SignIn'
import Home from './pages/Home'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './providers/guards/ProtectedRoute'
import AdminHome from './pages/admin/AdminHome'
import AgentHome from './pages/agent/AgentHome'
import RecentCalls from './pages/agent/RecentCalls'
import SetUp from './pages/admin/SetUp'

function App() {
  const userRole = 'admin'
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<DashboardLayout userRole={userRole} />} >
          <Route path='manage' element={<ProtectedRoute role={userRole} allowedRoles={['admin']} />} >
            <Route index element={<AdminHome />} />
            <Route path='set-up' element={<SetUp />} />
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
