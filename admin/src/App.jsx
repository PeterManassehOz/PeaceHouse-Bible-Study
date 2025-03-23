import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ChiefAdminSignup from './pages/ChiefAdminSignup/ChiefAdminSignup'
import AdminSignup from './pages/AdminSignup/AdminSignup'
import AdminLogin from './pages/AdminLogin/AdminLogin'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard'
import EditStudy from './components/EditStudy/EditStudy'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {

  return (
    <>
      <Router>
      <ToastContainer />
        <Routes>
          <Route path="/" element={<ChiefAdminSignup />} />
          <Route path="/admin-signup" element={<AdminSignup />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          {<Route path="/edit-study/:id" element={<EditStudy />} />}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
