import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, saveUsers, getUsers } from '../utils/storage'

export default function Onboarding(){
  const user = getCurrentUser()
  const [wishlist,setWishlist] = useState((user && user.wishlist) ? user.wishlist.join('\n') : '')
  const nav = useNavigate()

  if(!user) return <div className="container"><div className="card">Please login or signup first.</div></div>

  function handleSave(e){
    e.preventDefault()
    const users = getUsers()
    const updated = users.map(u => u.email === user.email ? {...u, wishlist: wishlist.split('\n').map(s=>s.trim()).filter(Boolean)} : u)
    saveUsers(updated)
    nav('/dashboard')
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Onboarding — {user.name}</h2>
        <p className="muted">Add a short wishlist (one item per line).</p>
        <form onSubmit={handleSave} style={{display:'grid',gap:8}}>
          <textarea rows={6} value={wishlist} onChange={e=>setWishlist(e.target.value)} />
          <button className="btn">Save & Continue</button>
        </form>
      </div>
    </div>
  )
}
