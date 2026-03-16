import { useState } from 'react'
import { User, Bell, Edit3, Lock, Trash2, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={onChange}/>
      <span className="toggle-track"/>
      <span className="toggle-thumb"/>
    </label>
  )
}

export default function ProfilePage() {
  const { user } = useAuth()
  const toast = useToast()
  const [prefs, setPrefs] = useState({ updates:true, arrivals:true, replies:true })
  const toggle = k => { setPrefs(p=>({...p,[k]:!p[k]})); toast('Preference saved','info') }

  return (
    <div className="page">
      <div className="container" style={{ paddingTop:36, paddingBottom:60, maxWidth:760 }}>
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:22, fontWeight:600, letterSpacing:'-0.03em', marginBottom:4 }}>Profile</h1>
          <p style={{ fontSize:13.5, color:'var(--text-2)' }}>Manage your account settings and preferences</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:18, alignItems:'start' }}>
          {/* Avatar card */}
          <div className="card" style={{ padding:'24px 20px', textAlign:'center' }}>
            <div style={{ width:60, height:60, borderRadius:16, background:'var(--accent-lt)', border:'1px solid var(--accent-bd)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontSize:22, fontWeight:700, color:'var(--accent)' }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <p style={{ fontWeight:600, fontSize:14, letterSpacing:'-0.01em', marginBottom:3 }}>{user.name}</p>
            <p style={{ fontSize:12.5, color:'var(--text-3)', marginBottom:12, wordBreak:'break-all' }}>{user.email}</p>
            <span className={`badge ${user.role==='OWNER'?'badge-blue':'badge-green'}`} style={{ gap:4 }}>
              <ShieldCheck size={10}/>{user.role==='OWNER'?'Developer':'User'}
            </span>
          </div>

          {/* Right */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {/* Notifications */}
            <div className="card" style={{ padding:'20px 22px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
                <Bell size={14} style={{ color:'var(--text-2)' }}/>
                <p style={{ fontWeight:600, fontSize:13.5 }}>Notification preferences</p>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {[
                  ['updates',  'App update alerts',     'When installed apps release new versions'],
                  ['arrivals', 'New app discoveries',   'Personalized recommendations based on activity'],
                  ['replies',  'Review reply alerts',   'When a developer responds to your review'],
                ].map(([k,l,s]) => (
                  <div key={k} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid var(--border)' }}
                    className="last:border-0">
                    <div>
                      <p style={{ fontSize:13.5, fontWeight:500, color:'var(--text-1)', marginBottom:2 }}>{l}</p>
                      <p style={{ fontSize:12.5, color:'var(--text-3)' }}>{s}</p>
                    </div>
                    <Toggle checked={prefs[k]} onChange={()=>toggle(k)}/>
                  </div>
                ))}
              </div>
            </div>

            {/* Account */}
            <div className="card" style={{ padding:'20px 22px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <User size={14} style={{ color:'var(--text-2)' }}/>
                <p style={{ fontWeight:600, fontSize:13.5 }}>Account actions</p>
              </div>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                <button className="btn btn-secondary btn-sm" style={{ gap:6 }}>
                  <Edit3 size={13}/> Edit Profile
                </button>
                <button className="btn btn-secondary btn-sm" style={{ gap:6 }}>
                  <Lock size={13}/> Change Password
                </button>
                <button className="btn btn-danger btn-sm" style={{ gap:6 }}>
                  <Trash2 size={13}/> Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
