import { useEffect, useState } from 'react'
import { api } from '../api/index'
import DashboardLayout from '../layout/DashboardLayout'

export default function StudentProfile(){
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [photoFile, setPhotoFile] = useState(null)

  useEffect(()=>{
    const user = (()=>{ try{ return JSON.parse(localStorage.getItem('user')) }catch(e){return null} })()
    if(user?.userId && user.role==='STUDENT'){
      api.get('/api/student/profile/by-user/'+user.userId).then(r=>{
        const p = r.data
        if(p){
          // normalize fields for the form
          setProfile({
            id: p.id,
            phone: p.phone || '',
            fullName: p.fullName || p.user?.name || '',
            fatherName: p.fatherName || '',
            dob: p.dob || '',
            address: p.address || '',
            city: p.city || '',
            school: p.school || '',
            grade: p.grade || '',
            photoUrl: p.photoUrl || '',
            userId: p.user?.id
          })
        } else {
          setProfile(null)
        }
      }).catch(()=>setProfile(null))
    }
  }, [])

  const save = async ()=>{
    if(!profile) return
    const user = JSON.parse(localStorage.getItem('user'))
    const payload = {
      phone: profile.phone,
      fullName: profile.fullName,
      fatherName: profile.fatherName,
      dob: profile.dob,
      address: profile.address,
      city: profile.city,
      school: profile.school,
      grade: profile.grade,
      name: profile.fullName // also send to update linked User.name
    }
    // if user uploaded a file, convert to base64 and send as photoBase64
    if(photoFile){
      const toBase64 = (file) => new Promise((res, rej)=>{
        const reader = new FileReader(); reader.onload = () => res(reader.result); reader.onerror = rej; reader.readAsDataURL(file);
      })
      try{
        const dataUrl = await toBase64(photoFile)
        payload.photoBase64 = dataUrl
      }catch(e){ console.error(e) }
    } else if(profile.photoUrl){
      payload.photoUrl = profile.photoUrl
    }
      if(profile.id){
      await api.put('/api/student/profile/'+profile.id, payload)
      // also update user via /api/user if needed
      if(profile.userId){
        await api.put('/api/user/'+profile.userId, { name: profile.fullName, phone: profile.phone }).catch(()=>{})
      }
      alert('Saved')
      setEditing(false)
    } else {
      await api.post('/api/student/profile', { ...payload, userId: user.userId })
      alert('Profile created')
      setEditing(false)
      // refresh to get id
      api.get('/api/student/profile/by-user/'+user.userId).then(r=>setProfile(r.data)).catch(()=>{})
    }
  }

  if(profile==null) return (
    <DashboardLayout title="Student Profile">
      <div className="card max-w-3xl">
        <h3 className="text-xl font-semibold">Student Profile</h3>
        <div className="mt-3">No profile found. You can create one now.</div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="col-span-1">
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <span className="text-sm text-gray-500">No photo</span>
            </div>
            <div className="mt-2">
              <input type="file" accept="image/*" onChange={e=>setPhotoFile(e.target.files?.[0]||null)} />
            </div>
            <div className="mt-2">
              <input className="input" placeholder="Or image URL" onChange={e=>setProfile(prev=>({...prev,photoUrl:e.target.value}))} />
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-1 gap-3">
            <input className="input" placeholder="Full name" onChange={e=>setProfile({fullName:e.target.value})} />
            <input className="input" placeholder="Phone" onChange={e=>setProfile(prev=>({...prev,phone:e.target.value}))} />
            <input className="input" placeholder="Father / Guardian name" onChange={e=>setProfile(prev=>({...prev,fatherName:e.target.value}))} />
            <input className="input" type="date" placeholder="Date of birth" onChange={e=>setProfile(prev=>({...prev,dob:e.target.value}))} />
            <input className="input" placeholder="School" onChange={e=>setProfile(prev=>({...prev,school:e.target.value}))} />
            <input className="input" placeholder="Grade / Class" onChange={e=>setProfile(prev=>({...prev,grade:e.target.value}))} />
            <input className="input" placeholder="Address" onChange={e=>setProfile(prev=>({...prev,address:e.target.value}))} />
            <input className="input" placeholder="City" onChange={e=>setProfile(prev=>({...prev,city:e.target.value}))} />
            <button className="btn btn-primary mt-3" onClick={save}>Create Profile</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout title="Student Profile">
      <div className="card max-w-4xl">
        <h3 className="text-xl font-semibold">Student Profile</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="w-full h-56 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt="photo" className="object-cover w-full h-full" />
              ) : (
                <span className="text-gray-400">No photo</span>
              )}
            </div>
            <div className="mt-3">
              <input type="file" accept="image/*" onChange={e=>setPhotoFile(e.target.files?.[0]||null)} disabled={!editing} />
            </div>
            <div className="mt-2">
              <label className="label">Or image URL</label>
              <input className="input" value={profile.photoUrl||''} onChange={e=>setProfile({...profile,photoUrl:e.target.value})} disabled={!editing} />
            </div>
          </div>

          <div className="col-span-2 grid grid-cols-1 gap-3">
            <div>
              <label className="label">Full name</label>
              <input className="input" value={profile.fullName || ''} onChange={e=>setProfile({...profile,fullName:e.target.value})} disabled={!editing}/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Father / Guardian name</label>
                <input className="input" value={profile.fatherName || ''} onChange={e=>setProfile({...profile,fatherName:e.target.value})} disabled={!editing}/>
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" value={profile.phone || ''} onChange={e=>setProfile({...profile,phone:e.target.value})} disabled={!editing}/>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label">Date of birth</label>
                <input className="input" type="date" value={profile.dob || ''} onChange={e=>setProfile({...profile,dob:e.target.value})} disabled={!editing}/>
              </div>
              <div>
                <label className="label">School</label>
                <input className="input" value={profile.school || ''} onChange={e=>setProfile({...profile,school:e.target.value})} disabled={!editing}/>
              </div>
              <div>
                <label className="label">Grade / Class</label>
                <input className="input" value={profile.grade || ''} onChange={e=>setProfile({...profile,grade:e.target.value})} disabled={!editing}/>
              </div>
            </div>

            <div>
              <label className="label">Address</label>
              <input className="input" value={profile.address || ''} onChange={e=>setProfile({...profile,address:e.target.value})} disabled={!editing}/>
            </div>
            <div>
              <label className="label">City</label>
              <input className="input" value={profile.city || ''} onChange={e=>setProfile({...profile,city:e.target.value})} disabled={!editing}/>
            </div>

            <div className="mt-3 flex gap-2">
              {!editing && <button className="btn btn-primary" onClick={()=>setEditing(true)}>Edit</button>}
              {editing && <button className="btn btn-primary" onClick={save}>Save</button>}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
