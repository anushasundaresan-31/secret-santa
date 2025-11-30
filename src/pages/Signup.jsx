import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addUser, findUserByEmail, setCurrentUser } from '../utils/storage'

export default function Signup(){
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const nav = useNavigate()

  function handleSubmit(e){
    e.preventDefault()
    if(findUserByEmail(email)){
      alert('User with that email exists')
      return
    }
    const user = {id:Date.now().toString(),name,email,password,wishlist:[]}
    addUser(user)
    setCurrentUser(email)
    nav('/onboarding')
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} style={{display:'grid',gap:8,maxWidth:420}}>
          <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
          <button className="btn">Create account</button>
        </form>
      </div>
    </div>
  )
}
