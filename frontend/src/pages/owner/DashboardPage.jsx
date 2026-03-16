import { useEffect, useState } from 'react'
import { TrendingUp, Package, Star, ArrowDownToLine, Send, BarChart2 } from 'lucide-react'
import { appsAPI } from '../../api/services'
import Spinner from '../../components/common/Spinner'
import Stars from '../../components/common/Stars'
import AppIcon from '../../components/common/AppIcon'
import { useToast } from '../../context/ToastContext'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card stat-card">
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <div style={{ width:30, height:30, borderRadius:8, background:color+'22', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon size={14} style={{ color }}/>
        </div>
        <span style={{ fontSize:12.5, color:'var(--text-2)', fontWeight:500 }}>{label}</span>
      </div>
      <p className="stat-num" style={{ color }}>{value}</p>
    </div>
  )
}

export default function DashboardPage() {
  const toast = useToast()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [ann, setAnn] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    appsAPI.getMyApps().then(r=>setApps(r.data)).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  const total = apps.reduce((s,a)=>s+(a.downloadCount||0),0)
  const live  = apps.filter(a=>a.visible).length
  const avg   = apps.length ? (apps.reduce((s,a)=>s+(a.rating||0),0)/apps.length).toFixed(1) : '–'
  const maxDl = Math.max(...apps.map(a=>a.downloadCount||0), 1)

  const send = async () => {
    if (!ann.trim()) return
    setSending(true); await new Promise(r=>setTimeout(r,800))
    toast('Announcement sent!'); setAnn(''); setSending(false)
  }

  return (
    <div className="page">
      <div className="container" style={{ paddingTop:36, paddingBottom:60 }}>
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:22, fontWeight:600, letterSpacing:'-0.03em', marginBottom:4 }}>Dashboard</h1>
          <p style={{ fontSize:13.5, color:'var(--text-2)' }}>Overview of your published applications</p>
        </div>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'80px 0' }}><Spinner size={28}/></div>
        ) : (
          <>
            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:12, marginBottom:24 }}>
              <StatCard icon={ArrowDownToLine} label="Total installs" value={total.toLocaleString()} color="var(--accent)"/>
              <StatCard icon={Package}    label="Live apps"    value={live}   color="var(--green)"/>
              <StatCard icon={Star}       label="Avg rating"   value={avg}    color="var(--amber)"/>
              <StatCard icon={TrendingUp} label="Total apps"   value={apps.length} color="var(--text-2)"/>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:16, alignItems:'start' }}>
              {/* Downloads bar chart */}
              <div className="card" style={{ padding:'22px 24px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
                  <BarChart2 size={14} style={{ color:'var(--text-2)' }}/>
                  <p style={{ fontWeight:600, fontSize:13.5 }}>Installs by app</p>
                </div>
                {apps.length === 0 ? (
                  <p style={{ fontSize:13.5, color:'var(--text-3)' }}>No apps published yet.</p>
                ) : apps.map(app => (
                  <div key={app.id} style={{ marginBottom:16 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:7 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <AppIcon emoji={app.iconEmoji||'🚀'} size={24} bg={app.iconColor||'#F1F2F6'} radius={6}/>
                        <span style={{ fontSize:13.5, fontWeight:500 }}>{app.name}</span>
                      </div>
                      <span style={{ fontSize:12.5, color:'var(--text-2)', fontWeight:500 }}>{(app.downloadCount||0).toLocaleString()}</span>
                    </div>
                    <div className="prog">
                      <div className="prog-fill" style={{ width:`${((app.downloadCount||0)/maxDl)*100}%` }}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right column */}
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {/* Status table */}
                <div className="card" style={{ padding:'18px 20px' }}>
                  <p style={{ fontWeight:600, fontSize:13.5, marginBottom:14 }}>App status</p>
                  {apps.map(a => (
                    <div key={a.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 0', borderTop:'1px solid var(--border)' }}>
                      <span style={{ fontSize:13.5, fontWeight:500, flex:1, marginRight:8 }} className="truncate">{a.name}</span>
                      <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                        <Stars rating={a.rating||0} size={9}/>
                        <span className={`badge ${a.visible?'badge-green':'badge-neutral'}`}>{a.visible?'Live':'Hidden'}</span>
                      </div>
                    </div>
                  ))}
                  {apps.length === 0 && <p style={{ fontSize:13, color:'var(--text-3)' }}>No apps yet.</p>}
                </div>

                {/* Announce */}
                <div className="card" style={{ padding:'18px 20px' }}>
                  <p style={{ fontWeight:600, fontSize:13.5, marginBottom:12 }}>Announce update</p>
                  <textarea className="inp" rows={3} style={{ resize:'vertical', marginBottom:10 }}
                    placeholder="Announce a new version or feature to your users…"
                    value={ann} onChange={e=>setAnn(e.target.value)}/>
                  <button className="btn btn-primary" style={{ width:'100%', gap:7 }} onClick={send} disabled={!ann.trim()||sending}>
                    {sending?<Spinner size={14} color="#fff"/>:<><Send size={13}/>Send to users</>}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
