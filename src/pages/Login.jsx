import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { findUserByEmail, setCurrentUser } from '../utils/storage'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const nav = useNavigate()

  function handleSubmit(e){
    e.preventDefault()
    const user = findUserByEmail(email)
    if(!user || user.password !== password){
      alert('Invalid credentials')
      return
    }
    setCurrentUser(email)
    nav('/dashboard')
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} style={{display:'grid',gap:8,maxWidth:420}}>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
          <button className="btn">Login</button>
        </form>
      </div>
    </div>
  )
}
