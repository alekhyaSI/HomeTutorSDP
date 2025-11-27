import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/index'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Login(){
  const [form, setForm] = useState({ email: '', password: '' })
  const [selectedRole, setSelectedRole] = useState('STUDENT')   // UI only
  const [res, setRes] = useState(null)

  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()

    const payload = { ...form }   // DO NOT send role, backend decides role

    const r = await api.post('/api/auth/login', payload).catch(err => err.response)
    const data = r?.data || { error: 'Network error' }

    setRes(data)

    if (!data.error && data.userId) {
      const backendRole = data.role   // Role from backend: STUDENT / ADMIN / TUTOR

      // 🔥 REQUIRED FIX: Save token separately so axios can read it
      localStorage.setItem("token", data.token)

      // Save full user object
      localStorage.setItem('user', JSON.stringify({
        userId: data.userId,
        role: backendRole,
        token: data.token
      }))

      // Redirect to dashboard by backend role
      navigate('/' + backendRole.toLowerCase() + '/dashboard')
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold">Sign in</h2>
      <form className="mt-4 space-y-4" onSubmit={submit}>

        <div>
          <label className="label">Login as (UI only)</label>
          <select className="input"
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}>
            <option value="STUDENT">Student</option>
            <option value="TUTOR">Tutor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <Input label="Email"
               value={form.email}
               onChange={e => setForm({ ...form, email: e.target.value })} />

        <Input label="Password"
               type="password"
               value={form.password}
               onChange={e => setForm({ ...form, password: e.target.value })} />

        <div className="pt-2">
          <Button variant="primary" className="w-full">Login</Button>
        </div>
      </form>

      {res && (
        <div className="mt-4 text-sm p-2 bg-neutral-50 rounded">
          {res.error ? res.error : JSON.stringify(res)}
        </div>
      )}
    </Card>
  )
}
