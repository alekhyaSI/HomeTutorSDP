import { useEffect, useState } from 'react'
import { api } from '../api/index'
import DashboardLayout from '../layout/DashboardLayout'
import { useNavigate } from 'react-router-dom'

export default function TutorDashboard(){
  const [summary, setSummary] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const user = (() => { try { return JSON.parse(localStorage.getItem('user')) } catch (e) { return null } })()
    if (user?.userId && user.role === 'TUTOR') {
      const id = user.userId
      api.get('/api/tutor/dashboard/' + id).then(r => setSummary(r.data)).catch(()=>{})
    }
  }, [])

  return (
    <DashboardLayout title="Tutor Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4 text-center">
            <div className="text-sm text-neutral-500">Students</div>
            <div className="text-2xl font-bold">{summary?.totalStudents ?? '-'}</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-sm text-neutral-500">Active Requests</div>
            <div className="text-2xl font-bold">{summary?.pendingRequests ?? '-'}</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-sm text-neutral-500">Approved</div>
            <div className="text-2xl font-bold">{summary?.approvedRequests ?? '-'}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-4">
            <h4 className="font-semibold mb-2">Student Distribution</h4>
            <div className="h-48 flex items-center justify-center text-gray-400">[pie chart placeholder]</div>
          </div>
          <div className="card p-4">
            <h4 className="font-semibold mb-2">Attendance / Activity</h4>
            <div className="h-48 flex items-center justify-center text-gray-400">[chart placeholder]</div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="btn btn-primary" onClick={() => navigate('/tutor/manage')}>Manage Bookings & Profile</button>
        </div>
      </div>
    </DashboardLayout>
  )
}
