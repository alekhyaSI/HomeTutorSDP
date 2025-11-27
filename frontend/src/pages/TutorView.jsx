import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/index'
import Card from '../components/Card'
import Button from '../components/Button'

export default function TutorView(){
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    if(!id) return
    setLoading(true)
    api.get('/api/tutor/profile/by-user/'+id).then(r=>setProfile(r.data)).catch(()=>setProfile(null)).finally(()=>setLoading(false))
  },[id])

  if(loading) return <div className="card max-w-lg">Loading...</div>
  if(!profile) return (
    <div className="card max-w-lg">
      <h3 className="text-xl font-semibold">Tutor</h3>
      <div className="mt-3">No tutor found.</div>
      <div className="mt-3"><Link to="/student/dashboard"><Button>Back</Button></Link></div>
    </div>
  )

  return (
    <Card className="max-w-2xl">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center text-2xl">T</div>
        <div>
          <div className="text-2xl font-semibold">{profile.fullName || ('Tutor #'+profile.id)}</div>
          <div className="text-sm text-neutral-500">{profile.subjects || ''}</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-neutral-500">Available Days</div>
          <div className="font-medium">{profile.availableDays || '—'}</div>
        </div>
        <div>
          <div className="text-sm text-neutral-500">Time Slots</div>
          <div className="font-medium">{profile.timeSlots || '—'}</div>
        </div>
        <div>
          <div className="text-sm text-neutral-500">Phone</div>
          <div className="font-medium">{profile.phone || '—'}</div>
        </div>
        <div>
          <div className="text-sm text-neutral-500">Rate / hour</div>
          <div className="font-medium">{profile.costPerHour ? ('$'+profile.costPerHour) : (profile.ratePerHour ? ('₹'+profile.ratePerHour) : '—')}</div>
        </div>
      </div>
      <div className="mt-4">
        <Link to="/student/dashboard"><Button>Back to Dashboard</Button></Link>
      </div>
    </Card>
  )
}
