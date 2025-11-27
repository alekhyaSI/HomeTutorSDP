// src/pages/StudentDashboard.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/index';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Avatar from '../components/Avatar';
import DashboardLayout from '../layout/DashboardLayout';

function Toast({ toast, onClose }){
  if(!toast) return null;
  return (
    <div className={`fixed right-4 top-4 z-50 max-w-sm ${toast.type==='error' ? 'bg-red-50' : 'bg-purple-50'} p-4 rounded-xl shadow-lg`}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-800">{toast.title || (toast.type==='error' ? 'Error' : 'Notice')}</div>
          <div className="text-sm text-gray-600">{toast.message}</div>
        </div>
        <button className="text-gray-500" onClick={onClose}>✕</button>
      </div>
    </div>
  )
}

export default function StudentDashboard(){
  // states (kept as your original)
  const [filters, setFilters] = useState({subject:'',day:'',maxCost:''});
  const [tutors, setTutors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [modalTutor, setModalTutor] = useState(null)
  const [modalSlots, setModalSlots] = useState([])
  const [selectedSlotId, setSelectedSlotId] = useState(null)
  const [modalSubject, setModalSubject] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [myRequests, setMyRequests] = useState([]);
  const [summary, setSummary] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const safeUser = () => { try{ return JSON.parse(localStorage.getItem('user')) }catch(e){return null} }

  const showToast = (t) => { setToast(t); setTimeout(()=>setToast(null), 4500) }

  // search function (kept)
  const search = async ()=>{
    setLoading(true);
    try{
      const params = new URLSearchParams();
      if(filters.subject) params.set('subject', filters.subject);
      if(filters.day) params.set('day', filters.day);
      if(filters.maxCost) params.set('maxCost', filters.maxCost);
      const r = await api.get('/api/student/search?'+params.toString()).then(x=>x.data);
      setTutors(r || []);
      // also refresh available slots so UI can show per-tutor open slots
      const slots = await api.get('/api/slot/available').then(x=>x.data).catch(()=>[]);
      setAvailableSlots(slots || []);
      if(!(r||[]).length) showToast({type:'info', message:'No tutors found for that query'});
    }catch(err){
      console.error(err); showToast({type:'error', message:'Search failed'});
    }finally{setLoading(false)}
  }

  // fetch my requests (kept)
  const fetchMine = async (studentId)=>{
    const id = studentId || safeUser()?.userId;
    console.log('Fetching requests for student ID:', id);
    if(!id) return;
    try{
      const r = await api.get('/api/student/requests/'+id).then(x=>x.data);
      setMyRequests(r || []);
    }catch(e){ console.error(e); showToast({type:'error', message:'Failed to load your requests'}) }
  }

  // fetch dashboard summary (kept)
  const fetchDashboard = async (studentId)=>{
    const id = studentId || safeUser()?.userId;
    if(!id) return;
    try{
      const s = await api.get('/api/student/dashboard/'+id).then(x=>x.data);
      setSummary(s);
    }catch(e){ console.error(e); }
  }

  // fetch profile (kept)
  const fetchProfile = async (studentId)=>{
    const id = studentId || safeUser()?.userId;
    if(!id) return;
    try{
      const p = await api.get('/api/student/profile/by-user/'+id).then(x=>x.data);
      setProfileData(p);
    }catch(e){ console.error(e); showToast({type:'error', message:'Failed to load profile'}) }
  }

  useEffect(()=>{
    const user = safeUser()
    if(!user){ navigate('/login'); return }
    if(user?.userId && user.role==='STUDENT'){
      const id = user.userId
      fetchProfile(id)
      fetchDashboard(id)
      fetchMine(id)
      // load available slots
      api.get('/api/slot/available').then(r=>setAvailableSlots(r.data)).catch(()=>{})
      // listen for slot changes from other tabs/pages
      const handler = (e) => { if(e.key==='slots-updated') api.get('/api/slot/available').then(r=>setAvailableSlots(r.data)).catch(()=>{}) }
      window.addEventListener('storage', handler)
      // cleanup
      return () => window.removeEventListener('storage', handler)
    } else {
      if(user?.role) navigate(`/${user.role.toLowerCase()}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Booking modal helpers
  const openBookingModal = (tutor, preselectedSlot) => {
    setModalTutor(tutor)
    // if a preselected slot is provided, prefer that
    if(preselectedSlot){
      setModalSlots([preselectedSlot])
      setSelectedSlotId(preselectedSlot.id)
    } else {
      const slotsForTutor = (availableSlots || []).filter(s => s.tutor && s.tutor.id === tutor.id)
      setModalSlots(slotsForTutor)
      setSelectedSlotId(slotsForTutor.length ? slotsForTutor[0].id : null)
    }
    // set default subject (first subject listed)
    let sub = ''
    if(tutor?.subjects){
      try{ sub = (tutor.subjects || '').split(',')[0].trim() }catch(e){}
    }
    setModalSubject(filters.subject || sub || '')
    setShowBookingModal(true)
  }

  const closeBookingModal = () => {
    setShowBookingModal(false)
    setModalTutor(null)
    setModalSlots([])
    setSelectedSlotId(null)
    setModalSubject('')
    setBookingLoading(false)
  }

  

  const confirmBooking = async () => {
  if(!modalTutor || !selectedSlotId) return showToast({type:'error', message:'Select a slot to book'})
  setBookingLoading(true)
  try{
    const payload = { 
      tutorId: modalTutor.id, 
      slotId: selectedSlotId, 
      subject: modalSubject 
    }

    const user = safeUser();
const profile = await api.get(`/api/student/profile/by-user/${user.userId}`);
if(!profile) {
  showToast({type:'error', message:'Create your student profile first'});
  return;
}
    
    // Make sure the API call is correct
    const response = await api.post('/api/student/request', payload)
    
    showToast({type:'info', message:'Booking request sent successfully'})
    // remove booked slot locally
    setAvailableSlots(prev => prev.filter(x => x.id !== selectedSlotId))
    fetchMine()
    try{ localStorage.setItem('slots-updated', String(Date.now())) }catch(e){}
    closeBookingModal()
  } catch(error) {
    console.error('Booking error:', error)
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 404) {
        showToast({type:'error', message:'Booking endpoint not found. Please check server connection.'})
      } else if (error.response.status === 409) {
        showToast({type:'error', message:'Slot already booked. Please choose another slot.'})
      } else {
        showToast({type:'error', message:`Booking failed: ${error.response.data?.message || 'Server error'}`})
      }
    } else if (error.request) {
      showToast({type:'error', message:'Network error. Please check your connection.'})
    } else {
      showToast({type:'error', message:'Failed to create booking request'})
    }
  } finally { 
    setBookingLoading(false) 
  }
}

  return (
    <>
      <Toast toast={toast} onClose={()=>setToast(null)} />

      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={closeBookingModal} />
          <div className="bg-white rounded-lg p-6 z-60 w-full max-w-lg shadow-lg relative">
            <h3 className="text-lg font-semibold">Book with {modalTutor?.fullName || modalTutor?.user?.email || 'Tutor'}</h3>
            <div className="mt-3">
              <label className="label">Choose Slot</label>
              <select className="input" value={selectedSlotId || ''} onChange={e=>setSelectedSlotId(Number(e.target.value))}>
                {(modalSlots || []).map(s => (
                  <option key={s.id} value={s.id}>{s.date} {s.start}-{s.end}</option>
                ))}
              </select>
            </div>
            <div className="mt-3">
              <label className="label">Subject</label>
              <input className="input" value={modalSubject} onChange={e=>setModalSubject(e.target.value)} placeholder="Subject/topic" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn btn-ghost" onClick={closeBookingModal}>Cancel</button>
              <button className="btn btn-primary" onClick={confirmBooking} disabled={bookingLoading}>{bookingLoading ? 'Booking...' : 'Confirm Booking'}</button>
            </div>
          </div>
        </div>
      )}

      <DashboardLayout
        title="Student Dashboard"
        profileData={profileData}
        searchValue={filters.subject}
        onSearchChange={(e) => setFilters({...filters, subject: e.target.value})}
      >
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-2xl flex items-center justify-between shadow-lg mb-8">
          <div>
            <p className="text-sm opacity-80">{new Date().toDateString()}</p>
            <h2 className="text-2xl font-bold mt-2">Welcome back, {profileData?.fullName?.split(' ')[0] || 'Student'}!</h2>
            <p className="text-sm opacity-80">Explore your dashboard below</p>
          </div>
          <div className="w-32 h-32 rounded-lg overflow-hidden">
            <img
              src={profileData?.photoUrl || 'https://cdn3d.iconscout.com/3d/premium/thumb/student-3d-icon-download-in-png-blend-fbx-gltf-file-formats--graduate-man-avatar-user-education-pack-people-icons-6713024.png'}
              alt="Student"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Summary Section */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="text-center"><div className="text-sm muted">My Requests</div><div className="text-2xl font-bold">{summary.totalRequests}</div></Card>
            <Card className="text-center"><div className="text-sm muted">Pending</div><div className="text-2xl font-bold">{summary.pendingRequests}</div></Card>
            <Card className="text-center"><div className="text-sm muted">Approved</div><div className="text-2xl font-bold">{summary.approvedRequests}</div></Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <aside className="col-span-1">
            <Card>
              <Link to="/student/profile" className="flex items-center gap-4 no-underline">
                <Avatar name={profileData?.fullName || ''} size={64} src={profileData?.photoUrl} />
                <div>
                  <div className="text-lg font-semibold">{profileData?.fullName || 'Student'}</div>
                  <div className="text-sm muted">{profileData?.phone || 'No phone set'}</div>
                  <div className="text-xs muted">{(safeUser()?.userId) ? `User: ${safeUser().userId}` : ''}</div>
                </div>
              </Link>
              <div className="mt-4 flex gap-2">
                <Link to="/student/profile"><Button variant="primary">Edit Profile</Button></Link>
                <Button onClick={()=>{ const id = safeUser()?.userId; fetchProfile(id); fetchDashboard(id); fetchMine(id); }}>Refresh</Button>
              </div>
            </Card>

            <Card className="mt-4">
              <h4 className="text-lg font-semibold">Quick Actions</h4>
              <div className="mt-3 flex flex-col gap-2">
                <Button onClick={() => document.getElementById('filter-subject')?.focus()}>Find Tutors</Button>
                <Button onClick={() => fetchMine()}>View My Requests</Button>
                <Link to="/"><Button variant="ghost">Home</Button></Link>
              </div>
            </Card>
          </aside>

          <main className="col-span-2">
            <Card className="mb-4">
              <h3 className="text-xl font-semibold">Find Tutors</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3 items-end">
                <div>
                  <label className="label">Subject</label>
                  <input id="filter-subject" className="input" placeholder="Subject" value={filters.subject} onChange={e=>setFilters({...filters,subject:e.target.value})}/>
                </div>
                <div>
                  <label className="label">Day</label>
                  <input className="input" placeholder="Day (Mon..)" value={filters.day} onChange={e=>setFilters({...filters,day:e.target.value})}/>
                </div>
                <div>
                  <label className="label">Max Cost</label>
                  <input className="input" type="number" placeholder="Max Cost" value={filters.maxCost} onChange={e=>setFilters({...filters,maxCost:e.target.value})}/>
                </div>
                <div className="text-right">
                  <Button variant="primary" className="w-full" onClick={search}>{loading ? 'Searching...' : 'Search'}</Button>
                </div>
              </div>
            </Card>

            <section className="space-y-3">
              {loading && (<div className="text-center py-6 muted">Searching tutors...</div>)}
              {!loading && tutors.length===0 && (<div className="text-sm muted">No tutors found. Try different filters.</div>)}
              {tutors.map(t => (
                <Card key={t.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <div className="text-lg font-semibold">{t.subjects || 'Tutoring'}</div>
                    <div className="text-sm muted">{t.availableDays ? `Days: ${t.availableDays}` : ''} {t.timeSlots ? `· Slots: ${t.timeSlots}` : ''}</div>
                    <div className="text-sm mt-1">Contact: {t.phone || (t.user?.email) || '—'}</div>
                    <div className="mt-2 text-sm">
                      <div className="text-sm font-semibold">Open Slots:</div>
                      <div className="flex gap-2 flex-wrap mt-2">
                        {(availableSlots || []).filter(s => s.tutor && s.tutor.id === t.id).length === 0 ? (
                          <div className="text-xs text-gray-500">No open slots</div>
                        ) : (
                          (availableSlots || []).filter(s => s.tutor && s.tutor.id === t.id).map(s => (
                            <div key={s.id} className="p-2 border rounded flex items-center justify-between">
                              <div className="text-sm">{s.date} {s.start}-{s.end}</div>
                              <div>
                                <button className="btn btn-primary btn-sm" onClick={()=>openBookingModal(t, s)}>
                                  Book
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 md:mt-0 text-right flex gap-2">
                              <Button variant="primary" onClick={async ()=>{ try{ await api.post('/api/student/request',{ tutorId: t.id, subject: filters.subject || t.subjects }); showToast({type:'info', message:'Request sent'}); fetchMine(); try{ localStorage.setItem('slots-updated', String(Date.now())) }catch(e){} }catch(e){console.error(e); showToast({type:'error', message:'Failed to send request'}) } }}>Request</Button>
                    <Link to={`/tutor/view/${t.id}`}><Button variant="secondary">View</Button></Link>
                  </div>
                </Card>
              ))}
            </section>

            <Card className="mt-6">
              <h3 className="text-xl font-semibold">My Requests</h3>
              <div className="mt-3">
                <table className="table w-full">
                  <thead><tr><th>Tutor</th><th>Subject</th><th>Slot</th><th>Status</th></tr></thead>
                  <tbody>
                    {myRequests.map(r => (
                      <tr key={r.id}>
                        <td>{r.tutor?.phone || r.tutor?.user?.email || r.tutor?.id}</td>
                        <td>{r.subject}</td>
                        <td>{r.requestedSlot}</td>
                        <td><span className={`badge ${r.status==='APPROVED' ? 'bg-primary-100 text-primary-700' : r.status==='PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-neutral-100 text-neutral-700'}`}>{r.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </main>
        </div>
      </DashboardLayout>
    </>
  )
}
