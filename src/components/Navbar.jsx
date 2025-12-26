import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUserAuth, signOut } from '../utils/storage'

export default function Navbar(){
  const [user, setUser] = useState(null)
  const nav = useNavigate()

  useEffect(()=>{
    getCurrentUserAuth().then(u=>setUser(u)).catch(()=>setUser(null))
  }, [])

  async function handleLogout(){
    await signOut()
    setUser(null)
    nav('/')
  }

  return (
    <div style={{background:'#fff',padding:'12px 18px',borderBottom:'1px solid #eee'}}>
      <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><Link to="/">Secret Santa</Link></div>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <Link to="/">Home</Link>
          <Link to="/onboarding">Onboarding</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/admin/draw">Admin</Link>
          {user? <button className="btn" style={{padding:'6px 10px'}} onClick={handleLogout}>Logout</button> : <Link to="/login">Login</Link>}
        </div>
      </div>
    </div>
  )
}
