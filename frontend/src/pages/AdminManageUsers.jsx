import { useEffect, useState } from 'react'
import { api } from '../api/index'
import DashboardLayout from '../layout/DashboardLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'

export default function AdminManageUsers(){
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({email:'',password:'',role:'STUDENT'})
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (t) => { setToast(t); setTimeout(()=>setToast(null), 3500) }

  const load = async ()=>{
    setLoading(true)
    try{
      const r = await api.get('/api/admin/users').then(x=>x.data)
      setUsers(r || [])
    }catch(e){ console.error(e); showToast({type:'error', message:'Failed to load users'}) }
    setLoading(false)
  }

  useEffect(()=>{ load() }, [])

  const removeUser = async (id)=>{
    if(!confirm('Delete this user?')) return
    try{ await api.delete('/api/admin/users/'+id); showToast({type:'info', message:'User deleted'}); load() }catch(e){ console.error(e); showToast({type:'error', message:'Delete failed'}) }
  }

  const approveUser = async (id)=>{
    try{ await api.put('/api/admin/approve/'+id); showToast({type:'info', message:'User approved'}); load() }catch(e){ console.error(e); showToast({type:'error', message:'Approve failed'}) }
  }

  const rejectUser = async (id)=>{
    try{ await api.put('/api/admin/reject/'+id); showToast({type:'info', message:'User rejected'}); load() }catch(e){ console.error(e); showToast({type:'error', message:'Reject failed'}) }
  }

  const createUser = async ()=>{
    if(!form.email || !form.password) return showToast({type:'error', message:'Email and password required'})
    setSubmitting(true)
    try{
      await api.post('/api/auth/register', form)
      showToast({type:'info', message:'User created (pending)'})
      // optionally auto-approve if admin wants
      load()
    }catch(e){ console.error(e); showToast({type:'error', message:'Create user failed'}) }finally{ setSubmitting(false) }
  }

  return (
    <DashboardLayout title="Manage Users">
      <div className="space-y-4">
        {toast && (<div className={`p-3 rounded ${toast.type==='error' ? 'bg-red-100' : 'bg-green-100'}`}>{toast.message}</div>)}

        <Card>
          <h3 className="text-lg font-semibold">Create User</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <Input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
            <Input placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
            <select className="input" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
              <option value="STUDENT">Student</option>
              <option value="TUTOR">Tutor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="mt-3"><Button variant="primary" onClick={createUser} disabled={submitting}>{submitting ? 'Creating...' : 'Create User'}</Button></div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">All Users</h3>
            <div><Button onClick={load}>Refresh</Button></div>
          </div>
          {loading && <div className="p-6 text-center muted">Loading users...</div>}
          {!loading && users.length===0 && <div className="p-6 muted">No users found.</div>}
          {!loading && users.length>0 && (
            <div className="overflow-x-auto mt-3">
              <table className="table w-full">
                <thead><tr><th>ID</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{u.status}</td>
                      <td className="flex gap-2">
                        {u.status==='PENDING' && <Button onClick={()=>approveUser(u.id)}>Approve</Button>}
                        {u.status==='PENDING' && <Button variant="ghost" onClick={()=>rejectUser(u.id)}>Reject</Button>}
                        <Button variant="danger" onClick={()=>removeUser(u.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
