import React, { useState } from 'react'
import { getUsers, savePairs, getPairs } from '../utils/storage'

function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1))
    ;[array[i],array[j]] = [array[j],array[i]]
  }
}

function makeDerangement(users){
  if(users.length < 2) throw new Error('Need at least 2 participants')
  const ids = users.map(u=>u.id)
  let recipients = [...ids]
  // try until no one maps to themselves
  for(let attempt=0; attempt<1000; attempt++){
    shuffle(recipients)
    let ok = true
    for(let i=0;i<ids.length;i++){
      if(ids[i] === recipients[i]){ ok = false; break }
    }
    if(ok) return ids.reduce((m,k,i)=>{ m[k]=recipients[i]; return m }, {})
  }
  throw new Error('Unable to compute draw; try again')
}

export default function AdminDraw(){
  const users = getUsers()
  const [pairs, setPairs] = useState(getPairs())
  const [error,setError] = useState(null)

  function handleDraw(){
    try{
      const map = makeDerangement(users)
      savePairs(map)
      setPairs(map)
      setError(null)
    }catch(e){
      setError(e.message)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Admin — Draw</h2>
        <p className="muted">Participants: {users.length}</p>
        <button className="btn" onClick={handleDraw}>Run Draw</button>
        {error && <div style={{color:'crimson',marginTop:12}}>{error}</div>}

        <div style={{marginTop:18}}>
          <h3>Results</h3>
          <ul>
            {Object.entries(pairs).length === 0 && <li className="muted">No results yet</li>}
            {Object.entries(pairs).map(([giver,receiver])=>{
              const g = users.find(u=>u.id===giver)
              const r = users.find(u=>u.id===receiver)
              return <li key={giver}>{g? g.name : giver} → {r? r.name : receiver}</li>
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
