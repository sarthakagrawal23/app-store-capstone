import { Bell, Download, Star, Zap, Info } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const USER = [
 { Icon:Bell,     color:'var(--accent)', bg:'var(--accent-lt)', border:'var(--accent-bd)', title:'Recommended for you', desc:'Based on your installs: IRCTC: a powerful train ticket booking app.', time:'1d ago' },
  { Icon:Info,     color:'var(--green)',  bg:'var(--green-lt)',  border:'rgba(22,163,74,0.18)', title:'Notion 1.0.2 released', desc:'Enhanced user experience.', time:'2d ago' },
]
const OWNER = [
  { Icon:Download, color:'var(--green)',  bg:'var(--green-lt)',  border:'rgba(22,163,74,0.18)', title:'New installation recorded', desc:'A user just installed your app. Downloads are growing steadily.', time:'2m ago' },
  { Icon:Star,     color:'var(--amber)',  bg:'var(--amber-lt)',  border:'rgba(217,119,6,0.18)', title:'5-star review received', desc:'A user left a glowing review. Check the App Detail page.', time:'1hr ago' },
  { Icon:Zap,      color:'var(--accent)', bg:'var(--accent-lt)', border:'var(--accent-bd)', title:'Milestone reached', desc:'Your app has crossed 1,000 installs!', time:'1d ago' },
  { Icon:Bell,     color:'var(--text-2)', bg:'var(--bg2)',       border:'var(--border-md)', title:'Update reminder', desc:"It's been 90 days since your last release. Keep users engaged.", time:'3d ago' },
]

export default function NotificationsPage() {
  const { isOwner } = useAuth()
  const notifs = isOwner ? OWNER : USER
  return (
    <div className="page">
      <div className="container" style={{ paddingTop:36, paddingBottom:60, maxWidth:680 }}>
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:22, fontWeight:600, letterSpacing:'-0.03em', marginBottom:4 }}>Notifications</h1>
          <p style={{ fontSize:13.5, color:'var(--text-2)' }}>{notifs.length} updates</p>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {notifs.map((n,i) => (
            <div key={i} className="card" style={{ padding:'16px 18px', display:'flex', gap:14, alignItems:'flex-start', borderLeft:`3px solid ${n.border}`, transition:'all 0.16s ease', cursor:'default' }}
              onMouseEnter={e=>e.currentTarget.style.boxShadow='var(--sh-md)'}
              onMouseLeave={e=>e.currentTarget.style.boxShadow='var(--sh-sm)'}>
              <div style={{ width:36, height:36, borderRadius:10, background:n.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <n.Icon size={16} style={{ color:n.color }}/>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:600, fontSize:13.5, color:'var(--text-1)', marginBottom:3 }}>{n.title}</p>
                <p style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.65 }}>{n.desc}</p>
              </div>
              <span style={{ fontSize:11.5, color:'var(--text-3)', flexShrink:0, marginTop:2 }}>{n.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
