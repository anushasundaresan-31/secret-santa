import { supabase } from './supabaseClient'

// ============ Auth & Session ============
export async function signUp(email, password, fullName){
  if(!supabase) throw new Error('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env')
  const { data, error } = await supabase.auth.signUp({ email, password })
  if(error) throw error
  const userId = data.user.id
  const { error: profileErr } = await supabase.from('profiles').insert({ id: userId, full_name: fullName })
  if(profileErr) throw profileErr
  return { user: data.user, profile: { id: userId, full_name: fullName } }
}

export async function signIn(email, password){
  if(!supabase) throw new Error('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if(error) throw error
  return data
}

export async function signOut(){
  if(!supabase) return
  const { error } = await supabase.auth.signOut()
  if(error) throw error
}

export async function getCurrentUserAuth(){
  if(!supabase) return null
  try{
    const { data: { user }, error } = await supabase.auth.getUser()
    if(error) return null
    return user
  }catch(e){ return null }
}

export async function getProfile(userId){
  if(!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if(error) throw error
  return data
}

// ============ Children ============
export async function addChild(parentId, name, age){
  if(!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.from('children').insert({ parent_id: parentId, name, age })
  if(error) throw error
  return data[0]
}

export async function getChildrenByParent(parentId){
  if(!supabase) return []
  const { data, error } = await supabase.from('children').select('*').eq('parent_id', parentId)
  if(error) return []
  return data || []
}

export async function updateChild(childId, updates){
  if(!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.from('children').update(updates).eq('id', childId)
  if(error) throw error
  return data[0]
}

export async function deleteChild(childId){
  if(!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.from('children').delete().eq('id', childId)
  if(error) throw error
}

// ============ Assignments (Secret Santa Draw) ============
export async function createAssignment(giverParentId, receiverChildId){
  if(!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.from('assignments').insert({ giver_parent_id: giverParentId, receiver_child_id: receiverChildId })
  if(error) throw error
  return data[0]
}

export async function clearAssignments(){
  if(!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.from('assignments').delete().gt('id', '00000000-0000-0000-0000-000000000000')
  if(error) throw error
}

export async function getAllAssignments(){
  if(!supabase) return []
  const { data, error } = await supabase.from('assignments').select('*')
  if(error) return []
  return data || []
}

export async function getAssignmentForParent(parentId){
  if(!supabase) return null
  try{
    const { data, error } = await supabase.from('assignments').select('*').eq('giver_parent_id', parentId).single()
    if(error && error.code !== 'PGRST116') return null
    return data || null
  }catch(e){ return null }
}

export async function getAllProfilesAndChildren(){
  if(!supabase) return { profiles: [], children: [] }
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('*')
  if(pErr) return { profiles: [], children: [] }
  const { data: children, error: cErr } = await supabase.from('children').select('*')
  if(cErr) return { profiles: profiles || [], children: [] }
  return { profiles: profiles || [], children: children || [] }
}

// ============ Tasks ============
export async function createTask(creatorParentId, targetChildId, title, description, dueDate){
  if(!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.from('tasks').insert({
    creator_parent_id: creatorParentId,
    target_child_id: targetChildId,
    title,
    description,
    due_date: dueDate
  })
  if(error) throw error
  return data[0]
}

export async function getTasksForChild(childId){
  if(!supabase) return []
  const { data, error } = await supabase.from('tasks').select('*').eq('target_child_id', childId)
  if(error) return []
  return data || []
}

export async function updateTask(taskId, updates){
  if(!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.from('tasks').update(updates).eq('id', taskId)
  if(error) throw error
  return data[0]
}

export async function deleteTask(taskId){
  if(!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.from('tasks').delete().eq('id', taskId)
  if(error) throw error
}

