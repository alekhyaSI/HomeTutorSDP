import { useEffect, useState } from "react";
import { api } from "../api/index";
import DashboardLayout from "../layout/DashboardLayout";

export default function TutorProfile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);

  // -----------------------------
  // Load profile
  // -----------------------------
  useEffect(() => {
    const user = (() => {
      try {
        return JSON.parse(localStorage.getItem("user"));
      } catch (e) {
        return null;
      }
    })();

    if (user?.userId && user.role === "TUTOR") {
      api
        .get("/api/tutor/profile/for-user/" + user.userId)
        .then((r) => {
          const p = r.data;
          if (p) {
            setProfile({
              id: p.id,
              fullName: p.fullName || "",
              subjects: Array.isArray(p.subjects) ? p.subjects.join(", ") : "",
              availableDays: Array.isArray(p.availableDays)
                ? p.availableDays.join(", ")
                : "",
              timeSlots: Array.isArray(p.timeSlots)
                ? p.timeSlots.map((t) => `${t.start}-${t.end}`).join(", ")
                : "",
              phone: p.phone || "",
              ratePerHour: p.ratePerHour || "",
              photoUrl: p.photoUrl || "",
              qualifications: p.qualifications || '',
              bio: p.bio || '',
              city: p.city || '',
              address: p.address || '',
              experienceYears: p.experienceYears || ''
            });
          } else {
            setProfile(null);
          }
        })
        .catch(() => setProfile(null));
    }
  }, []);

  // Convert uploaded file → base64
  const toBase64 = (file) =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

  // -----------------------------
  // Save profile
  // -----------------------------
  const save = async () => {
    if (!profile) return;

    const user = JSON.parse(localStorage.getItem("user"));
    const payload = { ...profile };

    // Convert comma strings to arrays
    payload.subjects = profile.subjects
      ? profile.subjects.split(",").map((s) => s.trim())
      : [];
    payload.availableDays = profile.availableDays
      ? profile.availableDays.split(",").map((d) => d.trim())
      : [];
    payload.timeSlots = profile.timeSlots
      ? profile.timeSlots.split(",").map((t) => {
          const [start, end] = t.split("-");
          return { start: start?.trim(), end: end?.trim() };
        })
      : [];

    if (photoFile) {
      try {
        payload.photoBase64 = await toBase64(photoFile);
      } catch (e) {
        console.error(e);
      }
    }

    try {
      if (profile.id) {
        await api.put("/api/tutor/profile/" + profile.id, payload);
      } else {
        await api.post("/api/tutor/profile", { ...payload, userId: user.userId });
      }

      alert("Profile saved!");
      setEditing(false);

      // reload latest clean format
      api
        .get("/api/tutor/profile/for-user/" + user.userId)
        .then((r) => {
          const p = r.data;
          if (p) {
            setProfile({
              id: p.id,
              subjects: p.subjects.join(", "),
              availableDays: p.availableDays.join(", "),
              timeSlots: p.timeSlots
                .map((t) => `${t.start}-${t.end}`)
                .join(", "),
              phone: p.phone,
              ratePerHour: p.ratePerHour,
              photoUrl: p.photoUrl,
              fullName: p.fullName || '',
              qualifications: p.qualifications || '',
              bio: p.bio || '',
              city: p.city || '',
              address: p.address || '',
              experienceYears: p.experienceYears || ''
            });
          }
        })
        .catch(() => {});
    } catch (err) {
      alert("Error saving profile.");
      console.error(err);
    }
  };

  // -----------------------------
  // No profile UI
  // -----------------------------
  if (profile === null)
    return (
      <DashboardLayout title="Tutor Profile">
        <div className="card max-w-3xl">
          <h3 className="text-xl font-semibold">Tutor Profile</h3>

          <div className="mt-3 text-gray-600">Create your tutor profile.</div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center">
                No photo
              </div>
              <input
                className="mt-2"
                type="file"
                onChange={(e) => setPhotoFile(e.target.files[0])}
              />
              <input
                className="input mt-2"
                placeholder="Image URL"
                onChange={(e) =>
                  setProfile({ ...(profile || {}), photoUrl: e.target.value })
                }
              />
            </div>

            <div className="col-span-2 space-y-2">
              <input
                className="input"
                placeholder="Full name"
                onChange={(e) => setProfile({ ...(profile || {}), fullName: e.target.value })}
              />

              <textarea
                className="input"
                placeholder="Qualifications (short)"
                onChange={(e) => setProfile({ ...(profile || {}), qualifications: e.target.value })}
              />

              <textarea
                className="input"
                placeholder="Short bio"
                onChange={(e) => setProfile({ ...(profile || {}), bio: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-3">
                <input className="input" placeholder="City" onChange={e=>setProfile({...profile, city: e.target.value})} />
                <input className="input" placeholder="Experience (years)" type="number" onChange={e=>setProfile({...profile, experienceYears: e.target.value})} />
              </div>

              <input className="input mt-2" placeholder="Address" onChange={e=>setProfile({...profile, address: e.target.value})} />
              <input
                className="input"
                placeholder="Subjects (comma separated)"
                onChange={(e) =>
                  setProfile({ ...(profile || {}), subjects: e.target.value })
                }
              />
              <input
                className="input"
                placeholder="Available Days"
                onChange={(e) =>
                  setProfile({
                    ...(profile || {}),
                    availableDays: e.target.value,
                  })
                }
              />
              <input
                className="input"
                placeholder="Time Slots (09:00-10:00, ...)"
                onChange={(e) =>
                  setProfile({ ...(profile || {}), timeSlots: e.target.value })
                }
              />
              <input
                className="input"
                placeholder="Phone"
                onChange={(e) =>
                  setProfile({ ...(profile || {}), phone: e.target.value })
                }
              />
              <input
                className="input"
                placeholder="Rate Per Hour"
                type="number"
                onChange={(e) =>
                  setProfile({ ...(profile || {}), ratePerHour: e.target.value })
                }
              />

              <button className="btn btn-primary mt-3" onClick={save}>
                Create Profile
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );

  // -----------------------------
  // Profile Display + Edit
  // -----------------------------
  return (
    <DashboardLayout title="Tutor Profile">
      <div className="card max-w-3xl">
        <h3 className="text-xl font-semibold">Tutor Profile</h3>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Photo */}
          <div>
            <div className="w-full h-56 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-400">No photo</span>
              )}
            </div>
            {editing && (
              <>
                <input
                  type="file"
                  className="mt-3"
                  onChange={(e) => setPhotoFile(e.target.files[0])}
                />
                <input
                  className="input mt-2"
                  value={profile.photoUrl}
                  onChange={(e) =>
                    setProfile({ ...profile, photoUrl: e.target.value })
                  }
                />
              </>
            )}
          </div>

          {/* Fields */}
          <div className="col-span-2 space-y-3">
            <div>
              <label className="label">Full Name</label>
              <input className="input" value={profile.fullName || ''} onChange={e=>setProfile({...profile, fullName: e.target.value})} disabled={!editing} />
            </div>

            <div>
              <label className="label">Qualifications</label>
              <textarea className="input h-24" value={profile.qualifications || ''} onChange={e=>setProfile({...profile, qualifications: e.target.value})} disabled={!editing} />
            </div>

            <div>
              <label className="label">Biography</label>
              <textarea className="input h-24" value={profile.bio || ''} onChange={e=>setProfile({...profile, bio: e.target.value})} disabled={!editing} />
            </div>
            <div>
              <label className="label">Subjects</label>
              <input
                className="input"
                value={profile.subjects}
                onChange={(e) =>
                  setProfile({ ...profile, subjects: e.target.value })
                }
                disabled={!editing}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Available Days</label>
                <input
                  className="input"
                  value={profile.availableDays}
                  onChange={(e) =>
                    setProfile({ ...profile, availableDays: e.target.value })
                  }
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="label">Time Slots</label>
                <input
                  className="input"
                  value={profile.timeSlots}
                  onChange={(e) =>
                    setProfile({ ...profile, timeSlots: e.target.value })
                  }
                  disabled={!editing}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Phone</label>
                <input
                  className="input"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="label">Rate Per Hour</label>
                <input
                  className="input"
                  type="number"
                  value={profile.ratePerHour}
                  onChange={(e) =>
                    setProfile({ ...profile, ratePerHour: e.target.value })
                  }
                  disabled={!editing}
                />
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              {!editing && (
                <button className="btn btn-primary" onClick={() => setEditing(true)}>
                  Edit
                </button>
              )}
              {editing && (
                <button className="btn btn-primary" onClick={save}>
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
