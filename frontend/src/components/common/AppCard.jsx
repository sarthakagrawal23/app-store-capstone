import { useNavigate } from 'react-router-dom'
import AppIcon from './AppIcon'
import Stars from './Stars'

function fmt(n) {
  if (!n) return '0'
  if (n >= 1e6) return (n/1e6).toFixed(1)+'M'
  if (n >= 1000) return (n/1000).toFixed(0)+'K'
  return String(n)
}

export default function AppCard({ app }) {
  const navigate = useNavigate()
  return (
    <div className="card card-hover" style={{ padding: '18px 20px', display:'flex', flexDirection:'column', gap: 14 }}
      onClick={() => navigate(`/app/${app.id}`)}>
      {/* Top */}
      <div style={{ display:'flex', gap: 13, alignItems:'flex-start' }}>
        <AppIcon emoji={app.iconEmoji||'🚀'} size={46} bg={app.iconColor||'#F1F2F6'} radius={11}/>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontWeight:600, fontSize:14, color:'var(--text-1)', marginBottom:2, letterSpacing:'-0.01em' }} className="truncate">{app.name}</p>
          <p style={{ fontSize:12, color:'var(--text-3)', marginBottom:5 }} className="truncate">{app.developer||app.genre}</p>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Stars rating={app.rating||0} size={11}/>
            <span style={{ fontSize:11.5, color:'var(--text-2)', fontWeight:500 }}>{app.rating?.toFixed(1)||'–'}</span>
          </div>
        </div>
      </div>
      {/* Desc */}
      <p style={{ fontSize:12.5, color:'var(--text-2)', lineHeight:1.65,
        display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', flexGrow:1 }}>
        {app.description||'No description.'}
      </p>
      {/* Footer */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span className="tag">{app.category?.name||'App'}</span>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:11.5, color:'var(--text-3)' }}>{fmt(app.downloadCount)} installs</span>
          <button className="btn btn-primary btn-sm tr"
            onClick={e => { e.stopPropagation(); navigate(`/app/${app.id}`) }}
            style={{ borderRadius: 'var(--r-md)' }}>
            Get
          </button>
        </div>
      </div>
    </div>
  )
}
