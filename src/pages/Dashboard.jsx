import React from 'react'
import { getCurrentUser, getPairs, getUsers } from '../utils/storage'

export default function Dashboard(){
  const user = getCurrentUser()
  const pairs = getPairs()
  const users = getUsers()

  if(!user) return <div className="container"><div className="card">Please login or signup first.</div></div>

  const myId = user.id
  const receiverId = pairs[myId]
  const receiver = users.find(u=>u.id===receiverId)

  return (
    <div className="container">
      <div className="card">
        <h2>Dashboard</h2>
        <p>Hello, {user.name}</p>
        <div style={{marginTop:12}}>
          <h3>Your assigned giftee</h3>
          {!receiver && <p className="muted">The admin hasn't run the draw yet.</p>}
          {receiver && (
            <div>
              <strong>{receiver.name}</strong>
              <p className="muted">Email: {receiver.email}</p>
              <h4>Wishlist</h4>
              <ul>
                {receiver.wishlist && receiver.wishlist.length>0 ? receiver.wishlist.map((w,i)=><li key={i}>{w}</li>) : <li className="muted">No items provided</li>}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
