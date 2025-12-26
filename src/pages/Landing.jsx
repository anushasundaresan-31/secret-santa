import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing(){
  return (
    <div className="container">
      <div className="card">
        <h1>Welcome to Secret Santa</h1>
        <p className="muted">Organize a friendly gift exchange with ease.</p>
        <p>
          <Link className="btn" to="/signup">Sign Up</Link>
          <span style={{marginLeft:12}}/>
          <Link to="/login">Already have an account? Login</Link>
        </p>
      </div>
    </div>
  )
}
