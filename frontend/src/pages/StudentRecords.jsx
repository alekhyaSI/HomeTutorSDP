import { useEffect, useState } from 'react'
import { api } from '../api/index'
import DashboardLayout from '../layout/DashboardLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import Avatar from '../components/Avatar'

export default function StudentRecords(){
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const safeUser = () => { try{ return JSON.parse(localStorage.getItem('user')) }catch(e){return null} }
  const showToast = (t) => { setToast(t); setTimeout(()=>setToast(null), 3500) }

  const load = async () => {
    const user = safeUser()
    if(!user || !user.userId) return
    setLoading(true)
    try{
      const r = await api.get('/api/student/requests/'+user.userId).then(x=>x.data)
      setRequests(r || [])
    }catch(e){ console.error(e); showToast({type:'error', message:'Failed to load requests'}) }
    setLoading(false)
  }

  useEffect(()=>{ load() }, [])

  return (
    <>
      <DashboardLayout title="Records">
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">My Booking Requests</h3>
              <div><Button onClick={load}>Refresh</Button></div>
            </div>
          </Card>

          <Card>
            {loading && <div className="p-6 text-center muted">Loading...</div>}
            {!loading && requests.length===0 && <div className="p-6 muted">No booking requests found.</div>}
            {!loading && requests.length>0 && (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Tutor</th>
                      <th>Subject</th>
                      <th>Slot</th>
                      <th>Status</th>
                      <th>Requested At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(r => (
                      <tr key={r.id}>
                        <td className="align-top">
                          <div className="flex items-center gap-3">
                            <Avatar name={r.tutor?.fullName || ''} size={40} src={r.tutor?.photoUrl} />
                            <div>
                              <div className="font-semibold">{r.tutor?.fullName || r.tutor?.user?.email || r.tutor?.id}</div>
                              <div className="text-xs muted">{r.tutor?.city || ''}</div>
                            </div>
                          </div>
                        </td>
                        <td>{r.subject}</td>
                        <td>{r.requestedSlot || '—'}</td>
                        <td><span className={`badge ${r.status==='APPROVED' ? 'bg-primary-100 text-primary-700' : r.status==='PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-neutral-100 text-neutral-700'}`}>{r.status}</span></td>
                        <td>{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </DashboardLayout>
    </>
  )
}
