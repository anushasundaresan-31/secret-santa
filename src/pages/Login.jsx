import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn } from '../utils/storage'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState(null)
  const nav = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    try{
      await signIn(email, password)
      nav('/dashboard')
    }catch(err){
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>
        {error && <div style={{color:'crimson',marginBottom:12}}>{error}</div>}
        <form onSubmit={handleSubmit} style={{display:'grid',gap:8,maxWidth:420}}>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
          <input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
          <button className="btn">Login</button>
        </form>
      </div>
    </div>
  )
}
