import React from 'react'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Navbar from './components/Navbar/Navbar'
import Studies from './pages/Studies/Studies'
import Profile from './pages/Profile/Profile'
import Home from './pages/Home/Home'
import Hero from './components/Hero/Hero'
import Category from './components/Category/Category'
import SingleStudy from './components/SingleStudy/SingleStudy'
import SingleBook from './components/SingleBook/SingleBook'
import About from './pages/About/About'
import ForgotPassword from './components/ForgotPassword/ForgotPassword'
import TokenResetPassword from './components/TokenResetPassword/TokenResetPassword'
import UserDashboard from './pages/UserDashboard/UserDashboard'





const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Layout />
    </Router>
  )
}

const Layout = () => {
  const location = useLocation()
  const isHomePage = location.pathname === '/home'

  return (
    <div className="min-h-screen bg-white">
      {isHomePage && (
        <div>
          <Navbar />
          <Hero />
        </div>
      )}
      <div>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/studies" element={<Studies />} />
          <Route path="/study/:id" element={<SingleStudy />} />
          <Route path="/book/:id" element={<SingleBook />} />
          <Route path="/home" element={<Home />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path='/reset-password/:token' element={<TokenResetPassword />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
