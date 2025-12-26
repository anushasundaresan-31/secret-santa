import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import AdminDraw from './pages/AdminDraw'
import Dashboard from './pages/Dashboard'

export default function App(){
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Landing/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/onboarding' element={<Onboarding/>} />
        <Route path='/admin/draw' element={<AdminDraw/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
      </Routes>
    </div>
  )
}
