import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUp } from '../utils/storage'

export default function Signup(){
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState(null)
  const nav = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    try{
      await signUp(email, password, name)
      nav('/onboarding')
    }catch(err){
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Sign Up</h2>
        {error && <div style={{color:'crimson',marginBottom:12}}>{error}</div>}
        <form onSubmit={handleSubmit} style={{display:'grid',gap:8,maxWidth:420}}>
          <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
          <input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
          <button className="btn">Create account</button>
        </form>
      </div>
    </div>
  )
}
