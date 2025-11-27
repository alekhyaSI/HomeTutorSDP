import { useEffect, useState } from 'react'
import { api } from '../api/index'
import DashboardLayout from '../layout/DashboardLayout'

export default function TutorManage() {

  const [profile, setProfile] = useState({
    subjects: [],
    availableDays: [],
    timeSlots: [],
    phone: '',
    ratePerHour: '',
    fullName: '',
    qualifications: '',
    bio: '',
    city: '',
    address: '',
    experienceYears: ''
  })

  const [newSubject, setNewSubject] = useState('')
  const [newDay, setNewDay] = useState('')
  const [newTimeStart, setNewTimeStart] = useState('')
  const [newTimeEnd, setNewTimeEnd] = useState('')

  const [tutorId, setTutorId] = useState('')
  const [requests, setRequests] = useState([])
  const [summary, setSummary] = useState(null)
  const [slots, setSlots] = useState([])

  const [slotDate, setSlotDate] = useState('')
  const [slotStart, setSlotStart] = useState('')
  const [slotEnd, setSlotEnd] = useState('')

  // ------------------------- ADD / REMOVE -------------------------
  const pushSubject = () => {
    if (!newSubject) return
    setProfile(p => ({ ...p, subjects: [...p.subjects, newSubject] }))
    setNewSubject('')
  }

  const removeSubject = i =>
    setProfile(p => ({ ...p, subjects: p.subjects.filter((_, x) => x !== i) }))

  const pushDay = () => {
    if (!newDay) return
    setProfile(p => ({ ...p, availableDays: [...p.availableDays, newDay] }))
    setNewDay('')
  }

  const removeDay = i =>
    setProfile(p => ({ ...p, availableDays: p.availableDays.filter((_, x) => x !== i) }))

  const addTimeSlot = () => {
    if (!newTimeStart || !newTimeEnd) return
    setProfile(p => ({
      ...p,
      timeSlots: [...p.timeSlots, { start: newTimeStart, end: newTimeEnd }]
    }))
    setNewTimeStart('')
    setNewTimeEnd('')
  }

  const removeTimeSlot = i =>
    setProfile(p => ({ ...p, timeSlots: p.timeSlots.filter((_, x) => x !== i) }))

  // ------------------------- SAVE PROFILE -------------------------
  const saveProfile = async (e) => {
    e && e.preventDefault()

    const user = (() => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } })()
    if (!user?.userId) return alert("You must be logged in")

    try {
      const res = await api.post("/api/tutor/profile", { ...profile, userId: user.userId })
      const profileId = res.data.id

      setTutorId(String(profileId))
      localStorage.setItem("tutorProfileId", profileId)

      const fresh = await api.get(`/api/tutor/profile/for-user/${user.userId}`).then(r => r.data)

      setProfile({
        subjects: fresh.subjects || [],
        availableDays: fresh.availableDays || [],
        timeSlots: fresh.timeSlots || [],
        phone: fresh.phone || '',
        ratePerHour: fresh.ratePerHour || '',
        fullName: fresh.fullName || '',
        qualifications: fresh.qualifications || '',
        bio: fresh.bio || '',
        city: fresh.city || '',
        address: fresh.address || '',
        experienceYears: fresh.experienceYears || ''
      })

      await loadDashboard(profileId)
      alert("Profile saved successfully")

    } catch (err) {
      console.error(err)
      alert("Error saving profile")
    }
  }

  // ------------------------- LOADERS -------------------------
  const loadRequests = async (id = tutorId) => {
    if (!id) return
    try {
      const r = await api.get(`/api/tutor/requests/${id}`).then(x => x.data)
      setRequests(r)
    } catch (e) { console.error(e) }
  }

  const loadSlots = async (id = tutorId) => {
    if (!id) return
    try {
      const s = await api.get(`/api/tutor/slots/${id}`).then(x => x.data)
      setSlots(s || [])
    } catch (e) { console.error(e) }
  }

  const loadDashboard = async (id = tutorId) => {
    if (!id) return
    try {
      const s = await api.get(`/api/tutor/dashboard/${id}`).then(x => x.data)
      setSummary(s)
      await loadRequests(id)
      await loadSlots(id)
    } catch (e) { console.error(e) }
  }

  // ------------------------- AUTO LOAD -------------------------
  useEffect(() => {
    const user = (() => { try { return JSON.parse(localStorage.getItem("user")) } catch { return null } })()

    if (user?.userId && user.role === "TUTOR") {

      api.get(`/api/tutor/profile/for-user/${user.userId}`)
        .then(res => {
          const p = res.data
          if (!p) return

          setProfile({
            subjects: p.subjects || [],
            availableDays: p.availableDays || [],
            timeSlots: p.timeSlots || [],
            phone: p.phone || "",
            ratePerHour: p.ratePerHour || "",
            fullName: p.fullName || '',
            qualifications: p.qualifications || '',
            bio: p.bio || '',
            city: p.city || '',
            address: p.address || '',
            experienceYears: p.experienceYears || ''
          })

          const profileId = p.id
          setTutorId(String(profileId))
          localStorage.setItem("tutorProfileId", profileId)

          loadDashboard(profileId)
        })
        .catch(err => console.error(err))
    }
  }, [])

  // ------------------------- ACTIONS -------------------------
  const approve = async (id) => {
    try {
      await api.put(`/api/tutor/requests/${id}/approve`)
      await loadRequests()
      await loadSlots()
    } catch (e) { console.error(e) }
  }

  const reject = async (id) => {
    try {
      await api.put(`/api/tutor/requests/${id}/reject`)
      await loadRequests()
      await loadSlots()
    } catch (e) { console.error(e) }
  }

  const createSlot = async (slot) => {
    try {
      const res = await api.post("/api/tutor/slots", { ...slot, tutorId })
      setSlots(s => [...s, res.data])
    } catch (e) { console.error(e) }
  }

  const toggleSlot = async (id) => {
    try {
      await api.put(`/api/tutor/slots/${id}/toggle`)
      setSlots(s => s.map(x => x.id === id ? { ...x, open: !x.open } : x))
    } catch (e) { console.error(e) }
  }

  const deleteSlot = async (id) => {
    try {
      await api.delete(`/api/tutor/slots/${id}`)
      setSlots(s => s.filter(x => x.id !== id))
    } catch (e) { console.error(e) }
  }

  // ------------------------- UI -------------------------
  return (
    <DashboardLayout title="Tutor Manage">
      <div className="space-y-6">

        {/* ================= SUMMARY ================= */}
        {summary && (
          <div className="grid grid-cols-3 gap-4">
            <div className="card p-4 text-center">
              <div className="text-sm text-neutral-500">Requests</div>
              <div className="text-2xl font-bold">{summary.totalRequests}</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-sm text-neutral-500">Pending</div>
              <div className="text-2xl font-bold">{summary.pendingRequests}</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-sm text-neutral-500">Approved</div>
              <div className="text-2xl font-bold">{summary.approvedRequests}</div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ================= PROFILE ================= */}
          <section className="card p-4 min-w-0">
            <h3 className="text-xl font-semibold">My Profile</h3>

            <form className="mt-3 space-y-3" onSubmit={saveProfile}>

              <div>
                <label className="label">Phone</label>
                <input className="input" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
              </div>

              <div>
                <label className="label">Rate Per Hour</label>
                <input type="number" className="input" value={profile.ratePerHour} onChange={e => setProfile({ ...profile, ratePerHour: e.target.value })} />
              </div>

              <div>
                <label className="label">Full Name</label>
                <input className="input" value={profile.fullName} onChange={e => setProfile({ ...profile, fullName: e.target.value })} />
              </div>

              <div>
                <label className="label">Qualifications</label>
                <textarea className="input h-24" value={profile.qualifications} onChange={e => setProfile({ ...profile, qualifications: e.target.value })} />
              </div>

              <div>
                <label className="label">Short Bio</label>
                <textarea className="input h-24" value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">City</label>
                  <input className="input" value={profile.city} onChange={e => setProfile({ ...profile, city: e.target.value })} />
                </div>
                <div>
                  <label className="label">Experience (years)</label>
                  <input type="number" className="input" value={profile.experienceYears} onChange={e => setProfile({ ...profile, experienceYears: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="label">Address</label>
                <input className="input" value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} />
              </div>

              {/* SUBJECTS */}
              <div>
                <label className="label">Subjects</label>
                <div className="flex gap-2">
                  <input className="input" value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Math" />
                  <button type="button" className="btn btn-primary" onClick={pushSubject}>Add</button>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.subjects.map((s, i) => (
                    <div key={i} className="badge badge-outline flex items-center gap-2 max-w-xs break-words">
                      <div className="truncate">{s}</div>
                      <button className="btn btn-ghost btn-sm" onClick={() => removeSubject(i)}>x</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* DAYS */}
              <div>
                <label className="label">Available Days</label>
                <div className="flex gap-2">
                  <input className="input" value={newDay} onChange={e => setNewDay(e.target.value)} placeholder="Monday" />
                  <button type="button" className="btn btn-primary" onClick={pushDay}>Add</button>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.availableDays.map((d, i) => (
                    <div key={i} className="badge badge-outline flex items-center gap-2 max-w-xs break-words">
                      <div className="truncate">{d}</div>
                      <button className="btn btn-ghost btn-sm" onClick={() => removeDay(i)}>x</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* TIME SLOTS */}
              <div>
                <label className="label">Time Slots</label>
                <div className="flex gap-2">
                  <input type="time" className="input" value={newTimeStart} onChange={e => setNewTimeStart(e.target.value)} />
                  <input type="time" className="input" value={newTimeEnd} onChange={e => setNewTimeEnd(e.target.value)} />
                  <button type="button" className="btn btn-primary" onClick={addTimeSlot}>Add</button>
                </div>

                <div className="mt-2 space-y-2">
                  {profile.timeSlots.map((t, i) => (
                    <div key={i} className="flex justify-between items-center min-w-0">
                      <div className="max-w-xs break-words">{t.start} - {t.end}</div>
                      <button className="btn btn-ghost btn-sm" onClick={() => removeTimeSlot(i)}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">Save Profile</button>
              </div>

            </form>

            <div className="mt-4">
              <label className="label">Tutor Profile ID</label>
              <input className="input" value={tutorId} onChange={e => setTutorId(e.target.value)} />
              <button className="btn btn-secondary mt-2" onClick={() => loadDashboard(tutorId)}>
                Refresh Dashboard
              </button>
            </div>
          </section>

          {/* ================= SLOTS ================= */}
          <section className="card p-4 min-w-0">
            <h3 className="text-xl font-semibold">Manage Booking Slots</h3>

            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <input type="date" className="input" value={slotDate} onChange={e => setSlotDate(e.target.value)} />
                <input type="time" className="input" value={slotStart} onChange={e => setSlotStart(e.target.value)} />
                <input type="time" className="input" value={slotEnd} onChange={e => setSlotEnd(e.target.value)} />
              </div>

              <button className="btn btn-primary"
                onClick={() => {
                  if (!slotDate || !slotStart || !slotEnd) return alert("Fill all fields")
                  if (!tutorId) return alert("Save profile first")
                  createSlot({ date: slotDate, start: slotStart, end: slotEnd, open: true })
                }}>
                Create Slot
              </button>

              <button className="btn btn-secondary" onClick={() => loadSlots(tutorId)}>
                Refresh Slots
              </button>

              <div className="mt-3 space-y-3">
                {slots.length === 0 ? (
                  <div className="text-center text-gray-500">No slots yet</div>
                ) : (
                  slots.map(s => (
                    <div key={s.id} className="flex items-center justify-between gap-4 border rounded p-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">{s.date}</div>
                        <div className="text-sm text-gray-600">{s.start} - {s.end}</div>
                      </div>
                      <div className="text-sm w-24 text-center">
                        <span className={`px-2 py-1 rounded ${s.open ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{s.open ? 'Open' : 'Closed'}</span>
                      </div>
                      <div className="flex-shrink-0 flex gap-2">
                        <button className="btn btn-primary btn-sm" onClick={() => toggleSlot(s.id)}>
                          {s.open ? 'Close' : 'Open'}
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => deleteSlot(s.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* ================= REQUESTS ================= */}
          <section className="card p-4 min-w-0">
            <h3 className="text-xl font-semibold">Student Requests</h3>

            <button className="btn btn-secondary mb-3" onClick={() => loadRequests(tutorId)}>
              Refresh
            </button>

            <div className="mt-3 space-y-3">
              {requests.length === 0 ? (
                <div className="text-center text-gray-500">No requests yet.</div>
              ) : (
                requests.map(r => (
                  <div key={r.id} className="flex items-start justify-between gap-4 border rounded p-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{r.student?.name || r.student?.id}</div>
                      <div className="text-sm text-gray-600">{r.subject}</div>
                      <div className="text-sm text-gray-600 mt-1">{r.requestedSlot}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm"><span className={`px-2 py-1 rounded ${r.status==='APPROVED' ? 'bg-green-100 text-green-800' : r.status==='PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}>{r.status}</span></div>
                      <div className="flex gap-2">
                        <button className="btn btn-primary btn-sm" onClick={() => approve(r.id)}>Approve</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => reject(r.id)}>Reject</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </DashboardLayout>
  )
}
