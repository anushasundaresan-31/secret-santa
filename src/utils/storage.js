export function getUsers(){
  try{
    return JSON.parse(localStorage.getItem('ss_users')||'[]')
  }catch(e){return []}
}

export function saveUsers(users){
  localStorage.setItem('ss_users', JSON.stringify(users))
}

export function addUser(user){
  const users = getUsers()
  users.push(user)
  saveUsers(users)
}

export function findUserByEmail(email){
  return getUsers().find(u=>u.email===email)
}

export function setCurrentUser(email){
  localStorage.setItem('ss_current', email)
}

export function getCurrentUser(){
  const e = localStorage.getItem('ss_current')
  if(!e) return null
  return findUserByEmail(e)
}

export function savePairs(pairs){
  localStorage.setItem('ss_pairs', JSON.stringify(pairs))
}

export function getPairs(){
  try{return JSON.parse(localStorage.getItem('ss_pairs')||'{}')}catch(e){return {}}
}
