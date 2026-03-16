import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, TrendingUp, Zap } from 'lucide-react'
import { appsAPI } from '../../api/services'
import { useCategories } from '../../hooks/useCategories'
import AppCard from '../../components/common/AppCard'
import AppIcon from '../../components/common/AppIcon'
import Stars from '../../components/common/Stars'
import Spinner from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'

function fmt(n) {
  if (!n) return '0'
  if (n >= 1e6) return (n/1e6).toFixed(1)+'M'
  if (n >= 1000) return (n/1000).toFixed(0)+'K'
  return String(n)
}


export default function HomePage() {
  const navigate = useNavigate()
  const { categories: apiCats } = useCategories()
  const [apps, setApps]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [activeCat, setActiveCat] = useState(null)
  const [minRating, setMinRating] = useState(0)
  const [sort, setSort]           = useState('downloads')
  const db = useRef(null)
const cats = apiCats
  const fetchApps = useCallback((p) => {
    setLoading(true)
    
  appsAPI.getAll(p)
  .then(r => setApps(r.data))
  .catch(() => setApps([]))
  .finally(() => setLoading(false))}, [])

  useEffect(() => {
    clearTimeout(db.current)
    db.current = setTimeout(() => fetchApps({
      search: search||undefined, categoryId: activeCat||undefined,
      minRating: minRating>0?minRating:undefined, sort,
    }), 320)
    return () => clearTimeout(db.current)
  }, [search, activeCat, minRating, sort, fetchApps])

  const display = (() => {
    let list = apps
    if (search) list = list.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.genre||'').toLowerCase().includes(search.toLowerCase()))
    if (activeCat) {
      const name = cats.find(c=>c.id===activeCat)?.name
      if (name) list = list.filter(a => a.category?.name === name)
    }
    if (minRating>0) list = list.filter(a => (a.rating||0) >= minRating)
    if (sort==='rating') list = [...list].sort((a,b) => (b.rating||0)-(a.rating||0))
    else list = [...list].sort((a,b) => (b.downloadCount||0)-(a.downloadCount||0))
    return list
  })()

  const featured = apps.filter(a=>(a.rating||0)>=4.5).slice(0,6)
  const trending = [...apps].sort((a,b)=>(b.downloadCount||0)-(a.downloadCount||0)).slice(0,3)

  return (
    <div className="page">
      {/* ── Hero ── */}
      <div style={{ background:'var(--surface)', borderBottom:'1px solid var(--border)', paddingTop:52, paddingBottom:52 }}>
        <div className="container">
          <div style={{ maxWidth:520 }}>
            
            <h1 style={{ fontSize:36, fontWeight:600, letterSpacing:'-0.04em', lineHeight:1.18, color:'var(--text-1)', marginBottom:14 }}>
              The apps professionals<br/>actually use.
            </h1>
            
            {/* Search */}
            <div style={{ position:'relative', maxWidth:460 }}>
              <Search size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }}/>
              <input className="inp" style={{ paddingLeft:40, height:46, fontSize:14, borderRadius:'var(--r-lg)', boxShadow:'var(--sh-sm)' }}
                placeholder="Search apps by name, category or keyword…"
                value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop:40, paddingBottom:60 }}>

        {/* ── Trending strip ── */}
        {trending.length > 0 && (
          <div style={{ marginBottom:40 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <TrendingUp size={15} style={{ color:'var(--text-2)' }}/>
              <span className="sh">Trending</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:12 }}>
              {trending.map((app, i) => (
                <div key={app.id} className="card card-hover" style={{ padding:'14px 16px', display:'flex', gap:14, alignItems:'center' }}
                  onClick={() => navigate(`/app/${app.id}`)}>
                  <span style={{ fontSize:13, fontWeight:600, color:'var(--text-3)', minWidth:20 }}>#{i+1}</span>
                  <AppIcon emoji={app.iconEmoji||'🚀'} size={40} bg={app.iconColor||'#F1F2F6'} radius={10}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontWeight:600, fontSize:13.5, letterSpacing:'-0.01em', marginBottom:2 }} className="truncate">{app.name}</p>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <Stars rating={app.rating||0} size={10}/>
                      <span style={{ fontSize:11.5, color:'var(--text-2)' }}>{app.rating?.toFixed(1)||'–'}</span>
                      <span style={{ fontSize:11, color:'var(--text-3)' }}>· {fmt(app.downloadCount)} installs</span>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm">Get</button>
                </div>
              ))}
            </div>
          </div>
        )}

        

        {/* ── Filters ── */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, alignItems:'center', marginBottom:20, paddingBottom:20, borderBottom:'1px solid var(--border)' }}>
          {[{id:null,name:'All'}, ...cats].map(c => (
            <button key={c.id??'all'}
              onClick={() => setActiveCat(c.id??null)}
              style={{
                padding:'5px 14px', borderRadius:20, border:'1px solid', cursor:'pointer',
                fontSize:13, fontWeight:500, transition:'all 0.14s ease',
                borderColor: activeCat===(c.id??null) ? 'var(--accent)' : 'var(--border-md)',
                background: activeCat===(c.id??null) ? 'var(--accent-lt)' : 'var(--surface)',
                color: activeCat===(c.id??null) ? 'var(--accent)' : 'var(--text-2)',
              }}>
              {c.name}
            </button>
          ))}
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:12.5, color:'var(--text-3)' }}>Min</span>
              <Stars rating={minRating} interactive onRate={r=>setMinRating(r===minRating?0:r)} size={13}/>
            </div>
            <select className="inp" style={{ width:'auto', fontSize:12.5, padding:'5px 10px', cursor:'pointer' }}
              value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="downloads">Most Installed</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* ── Grid ── */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
          <span className="sh">All Apps</span>
          <span style={{ fontSize:12.5, color:'var(--text-3)' }}>({display.length})</span>
        </div>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'80px 0' }}><Spinner size={28}/></div>
        ) : display.length === 0 ? (
          <EmptyState icon={Search} title="No apps found" subtitle="Try a different search term or category"/>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:14 }}>
            {display.map(app => <AppCard key={app.id} app={app}/>)}
          </div>
        )}
      </div>
    </div>
  )
}
