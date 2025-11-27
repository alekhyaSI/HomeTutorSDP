import { useEffect, useState } from 'react'
import { api } from '../api/index'
import DashboardLayout from '../layout/DashboardLayout'

export default function AdminProfile(){
  const [user, setUser] = useState(null)
  const [editing, setEditing] = useState(false)

  useEffect(()=>{
    const u = (()=>{ try{ return JSON.parse(localStorage.getItem('user')) }catch(e){return null} })()
    if(u?.userId){
      api.get('/api/user/'+u.userId).then(r=>setUser(r.data))
    }
  }, [])

  const save = async ()=>{
    if(!user) return
    await api.put('/api/user/'+user.id, { email: user.email, password: user.password })
    alert('Saved')
    setEditing(false)
  }

  if(!user) return (
    <DashboardLayout title="Admin Profile">
      <div className="card">Loading...</div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout title="Admin Profile">
      <div className="card max-w-lg">
        <h3 className="text-xl font-semibold">Account</h3>
        <div className="mt-3">
          <label className="label">Email</label>
          <input className="input" value={user.email||''} onChange={e=>setUser({...user,email:e.target.value})} disabled={!editing}/>
        </div>
        <div className="mt-3">
          <label className="label">Password</label>
          <input className="input" type="password" onChange={e=>setUser({...user,password:e.target.value})} disabled={!editing}/>
        </div>
        <div className="mt-3">
          {!editing && <button className="btn btn-primary" onClick={()=>setEditing(true)}>Edit</button>}
          {editing && <button className="btn btn-primary" onClick={save}>Save</button>}
        </div>
      </div>
    </DashboardLayout>
  )
}
