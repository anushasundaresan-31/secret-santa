import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUserAuth, getProfile, getChildrenByParent, addChild, deleteChild } from '../utils/storage'

export default function Onboarding(){
  const nav = useNavigate()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [children, setChildren] = useState([])
  const [childName, setChildName] = useState('')
  const [childAge, setChildAge] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted = true
    async function load(){
      try{
        const authUser = await getCurrentUserAuth()
        if(!authUser){ nav('/login'); return }
        const prof = await getProfile(authUser.id)
        const kids = await getChildrenByParent(authUser.id)
        if(!mounted) return
        setUser(authUser)
        setProfile(prof)
        setChildren(kids)
      }catch(err){ setError(err.message) }
      setLoading(false)
    }
    load()
    return ()=>{ mounted = false }
  }, [])

  async function handleAddChild(e){
    e.preventDefault()
    if(!childName.trim()){ setError('Child name required'); return }
    try{
      const newChild = await addChild(user.id, childName, childAge ? parseInt(childAge) : null)
      setChildren([...children, newChild])
      setChildName('')
      setChildAge('')
      setError(null)
    }catch(err){ setError(err.message) }
  }

  async function handleRemoveChild(childId){
    try{
      await deleteChild(childId)
      setChildren(children.filter(c=>c.id !== childId))
    }catch(err){ setError(err.message) }
  }

  function handleContinue(){
    if(children.length === 0){ setError('Please add at least one child'); return }
    nav('/dashboard')
  }

  if(loading) return <div className="container"><div className="card">Loading...</div></div>
  if(!user) return <div className="container"><div className="card">Please login first.</div></div>

  return (
    <div className="container">
      <div className="card">
        <h2>Onboarding — {profile?.full_name}</h2>
        <p className="muted">Add children to your Secret Santa event.</p>
        {error && <div style={{color:'crimson',marginBottom:12}}>{error}</div>}

        <form onSubmit={handleAddChild} style={{display:'grid',gap:8,maxWidth:420,marginBottom:20}}>
          <input placeholder="Child's name" value={childName} onChange={e=>setChildName(e.target.value)} required />
          <input placeholder="Age (optional)" type="number" value={childAge} onChange={e=>setChildAge(e.target.value)} />
          <button className="btn">Add Child</button>
        </form>

        <div>
          <h3>Children</h3>
          <ul>
            {children.length === 0 && <li className="muted">No children added yet</li>}
            {children.map(c=>(
              <li key={c.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:8}}>
                <div>{c.name} {c.age && `(age ${c.age})`}</div>
                <button className="btn" style={{padding:'4px 8px',fontSize:'12px'}} onClick={()=>handleRemoveChild(c.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>

        <button className="btn" style={{marginTop:20}} onClick={handleContinue}>Continue to Dashboard</button>
      </div>
    </div>
  )
}
