import React, { useEffect, useState } from 'react'
import { getCurrentUserAuth, getProfile, getAssignmentForParent, getTasksForChild, createTask, updateTask } from '../utils/storage'

export default function Dashboard(){
  const [profile, setProfile] = useState(null)
  const [assignment, setAssignment] = useState(null)
  const [assignedChild, setAssignedChild] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [dueDate, setDueDate] = useState('')

  useEffect(()=>{
    let mounted = true
    async function load(){
      try{
        const user = await getCurrentUserAuth()
        if(!user){ setLoading(false); return }
        const prof = await getProfile(user.id)
        const assign = await getAssignmentForParent(user.id)
        if(!mounted) return
        setProfile(prof)
        setAssignment(assign)
        if(assign){
          // In a real app, you'd fetch the child details here
          // For now, we assume child data structure { id, name, parent_id, age }
          setAssignedChild(assign.receiver_child_id)
          const taskList = await getTasksForChild(assign.receiver_child_id)
          setTasks(taskList)
        }
      }catch(e){ setError(e.message) }
      setLoading(false)
    }
    load()
    return ()=>{ mounted = false }
  }, [])

  async function handleAddTask(e){
    e.preventDefault()
    if(!assignedChild || !taskTitle.trim()){ setError('Task title required'); return }
    try{
      const newTask = await createTask(profile.id, assignedChild, taskTitle, taskDesc, dueDate || null)
      setTasks([...tasks, newTask])
      setTaskTitle('')
      setTaskDesc('')
      setDueDate('')
      setError(null)
    }catch(e){ setError(e.message) }
  }

  async function handleToggleTask(taskId, completed){
    try{
      const updated = await updateTask(taskId, { completed: !completed })
      setTasks(tasks.map(t=> t.id === taskId ? updated : t))
    }catch(e){ setError(e.message) }
  }

  if(loading) return <div className="container"><div className="card">Loading...</div></div>
  if(!profile) return <div className="container"><div className="card">Please login first.</div></div>

  return (
    <div className="container">
      <div className="card">
        <h2>Dashboard</h2>
        <p>Hello, {profile?.full_name}</p>
        {error && <div style={{color:'crimson',marginBottom:12}}>{error}</div>}

        <div style={{marginTop:12}}>
          <h3>Your assigned child</h3>
          {!assignment && <p className="muted">The admin hasn't run the draw yet.</p>}
          {assignment && (
            <div>
              <p><strong>Child ID: {assignedChild}</strong></p>
              <p className="muted">You are giving a gift to this child. Add tasks to help you remember what they like!</p>

              <div style={{marginTop:16}}>
                <h4>Tasks / Notes</h4>
                <form onSubmit={handleAddTask} style={{display:'grid',gap:8,maxWidth:420,marginBottom:16}}>
                  <input placeholder="Task (e.g., Buy toy)" value={taskTitle} onChange={e=>setTaskTitle(e.target.value)} required />
                  <textarea placeholder="Description (optional)" value={taskDesc} onChange={e=>setTaskDesc(e.target.value)} rows={2} />
                  <input placeholder="Due date (optional)" type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
                  <button className="btn">Add Task</button>
                </form>

                <ul>
                  {tasks.length === 0 && <li className="muted">No tasks yet</li>}
                  {tasks.map(t=>(
                    <li key={t.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:8,borderBottom:'1px solid #eee'}}>
                      <div style={{textDecoration:t.completed?'line-through':'none'}}>
                        <strong>{t.title}</strong>
                        {t.description && <p style={{marginTop:4,color:'#666'}}>{t.description}</p>}
                        {t.due_date && <p style={{marginTop:4,fontSize:'0.9em',color:'#999'}}>Due: {t.due_date}</p>}
                      </div>
                      <button className="btn" style={{padding:'4px 8px',fontSize:'12px'}} onClick={()=>handleToggleTask(t.id,t.completed)}>
                        {t.completed?'Undo':'Done'}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
