import React, { useState, useEffect } from 'react'
import { getAllProfilesAndChildren, getAllAssignments, clearAssignments, createAssignment } from '../utils/storage'

function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1))
    ;[array[i],array[j]] = [array[j],array[i]]
  }
}

function makeDerangement(parents, children){
  if(parents.length < 2) throw new Error('Need at least 2 parents')
  if(children.length === 0) throw new Error('Need at least one child')
  
  const parentIds = parents.map(p=>p.id)
  let assignedChildren = [...children]
  // shuffle children and assign to parents (one per parent, no self-assignment)
  for(let attempt=0; attempt<1000; attempt++){
    shuffle(assignedChildren)
    let ok = true
    // ensure no parent gets their own child
    for(let i=0;i<parentIds.length;i++){
      const childParentId = assignedChildren[i].parent_id
      if(parentIds[i] === childParentId){ ok = false; break }
    }
    if(ok) return parentIds.map((p,i)=>({ parentId:p, childId:assignedChildren[i].id }))
  }
  throw new Error('Unable to compute draw; try again')
}

export default function AdminDraw(){
  const [profiles, setProfiles] = useState([])
  const [children, setChildren] = useState([])
  const [assignments, setAssignments] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted = true
    async function load(){
      try{
        const { profiles: p, children: c } = await getAllProfilesAndChildren()
        const a = await getAllAssignments()
        if(!mounted) return
        setProfiles(p)
        setChildren(c)
        setAssignments(a)
      }catch(e){ setError(e.message) }
      setLoading(false)
    }
    load()
    return ()=>{ mounted = false }
  }, [])

  async function handleDraw(){
    try{
      const assignments = makeDerangement(profiles, children)
      await clearAssignments()
      for(const a of assignments){
        await createAssignment(a.parentId, a.childId)
      }
      setAssignments(assignments.map(a=>({giver_parent_id:a.parentId, receiver_child_id:a.childId})))
      setError(null)
    }catch(e){ setError(e.message) }
  }

  if(loading) return <div className="container"><div className="card">Loading...</div></div>

  return (
    <div className="container">
      <div className="card">
        <h2>Admin — Draw</h2>
        <p className="muted">Parents: {profiles.length}, Children: {children.length}</p>
        <button className="btn" onClick={handleDraw}>Run Draw</button>
        {error && <div style={{color:'crimson',marginTop:12}}>{error}</div>}

        <div style={{marginTop:18}}>
          <h3>Assignments</h3>
          <ul>
            {assignments.length === 0 && <li className="muted">No assignments yet</li>}
            {assignments.map((a)=>{
              const p = profiles.find(pr=>pr.id===a.giver_parent_id)
              const c = children.find(ch=>ch.id===a.receiver_child_id)
              return <li key={a.id || `${a.giver_parent_id}-${a.receiver_child_id}`}>{p?.full_name || a.giver_parent_id} → {c?.name || a.receiver_child_id}</li>
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
