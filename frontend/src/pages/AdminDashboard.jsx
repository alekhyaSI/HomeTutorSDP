import { useEffect, useState } from 'react'
import { api } from '../api/index'
import DashboardLayout from '../layout/DashboardLayout'

export default function AdminDashboard() {
  const [pending, setPending] = useState([])
  const [users, setUsers] = useState([])
  const [summary, setSummary] = useState(null)

  const load = async () => {
    const p = await api.get('/api/admin/pending').then(r => r.data)
    const u = await api.get('/api/admin/users').then(r => r.data)
    const s = await api.get('/api/admin/dashboard').then(r => r.data)

    setPending(p)
    setUsers(u)
    setSummary(s)
  }

  useEffect(() => { load() }, [])

  const act = async (path) => {
    await api.put(path)
    load()
  }

  const del = async (id) => {
    await api.delete('/api/admin/users/' + id)
    load()
  }

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">

        {summary && (
          <div className="grid grid-cols-4 gap-4">
            <div className="card p-4 text-center">
              <div className="text-sm text-neutral-500">Users</div>
              <div className="text-2xl font-bold">{summary.totalUsers}</div>
            </div>

            <div className="card p-4 text-center">
              <div className="text-sm text-neutral-500">Pending Approvals</div>
              <div className="text-2xl font-bold">{summary.pendingApprovals}</div>
            </div>

            <div className="card p-4 text-center">
              <div className="text-sm text-neutral-500">Tutors</div>
              <div className="text-2xl font-bold">{summary.totalTutors}</div>
            </div>

            <div className="card p-4 text-center">
              <div className="text-sm text-neutral-500">Bookings</div>
              <div className="text-2xl font-bold">{summary.totalBookings}</div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">

          {/* Pending Approvals */}
          <section className="card">
            <h3 className="text-xl font-semibold mb-2">Pending Approvals</h3>

            <table className="table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {pending.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center text-gray-500">
                      No pending approvals
                    </td>
                  </tr>
                ) : (
                  pending.map(u => (
                    <tr key={u.id}>
                      <td>{u.email}</td>
                      <td><span className="badge">{u.role}</span></td>
                      <td className="flex gap-2">
                        <button
                          className="btn btn-primary"
                          onClick={() => act('/api/admin/approve/' + u.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => act('/api/admin/reject/' + u.id)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>

          {/* All Users */}
          <section className="card">
            <h3 className="text-xl font-semibold mb-2">All Users</h3>

            <table className="table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id}>
                      <td>{u.email}</td>
                      <td><span className="badge">{u.role}</span></td>
                      <td>{u.status}</td>
                      <td>
                        <button
                          className="btn btn-secondary"
                          onClick={() => del(u.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>

        </div>
      </div>
    </DashboardLayout>
  )
}
