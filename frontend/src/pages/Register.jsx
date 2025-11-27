import { useState } from 'react'
import { api } from '../api/index'

export default function Register(){
  const [form,setForm] = useState({email:'',password:'',role:'STUDENT'})
  const [res,setRes] = useState(null)

  const submit = async (e)=>{
    e.preventDefault()
    const r = await api.post('/api/auth/register', form).catch(err=>err.response)
    setRes(r?.data || {error:'Network error'})
  }

  return (
    <div className="card max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold">Create Account</h2>
      <form className="mt-4 space-y-3" onSubmit={submit}>
        <div>
          <label className="label">Email</label>
          <input className="input" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
        </div>
        <div>
          <label className="label">Role</label>
          <select className="input" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
            <option value="STUDENT">Student</option>
            <option value="TUTOR">Tutor</option>
          </select>
        </div>
        <button className="btn btn-primary w-full">Register</button>
      </form>
      {res && <pre className="mt-4 text-xs whitespace-pre-wrap">{JSON.stringify(res,null,2)}</pre>}
    </div>
  )
}