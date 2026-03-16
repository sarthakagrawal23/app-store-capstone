import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { ArrowLeft, Download, Calendar, HardDrive, Tag, ArrowDownToLine, Trash2, Star } from 'lucide-react'
import { appsAPI, reviewsAPI, downloadsAPI } from '../../api/services'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import AppIcon from '../../components/common/AppIcon'
import Stars from '../../components/common/Stars'
import Spinner from '../../components/common/Spinner'
import FieldErr from '../../components/common/FieldErr'

const schema = Yup.object({
  rating:  Yup.number().min(1,'Select a rating').required('Rating required'),
  comment: Yup.string().min(5,'Min 5 characters').required('Required'),
})

function Stat({ icon:Icon, label, value }) {
  return (
    <div>
      <p style={{ fontSize:11, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:500, marginBottom:4 }}>{label}</p>
      <div style={{ display:'flex', alignItems:'center', gap:5 }}>
        <Icon size={13} style={{ color:'var(--text-3)' }}/>
        <span style={{ fontSize:13.5, fontWeight:600, color:'var(--text-1)', letterSpacing:'-0.01em' }}>{value}</span>
      </div>
    </div>
  )
}

function fmt(n) {
  if (!n) return '0'
  if (n>=1e6) return (n/1e6).toFixed(1)+'M+'
  if (n>=1000) return (n/1000).toFixed(0)+'K+'
  return String(n)
}

export default function AppDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const [app, setApp] = useState(null)
  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [downloaded, setDownloaded] = useState(false)
  const [dlActive, setDlActive] = useState(false)
  const [dlPct, setDlPct] = useState(0)
  const [starPick, setStarPick] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        const [ar, rr, avgr, dr] = await Promise.all([
          appsAPI.getById(id), reviewsAPI.getByApp(id),
          reviewsAPI.getAvg(id), downloadsAPI.check(id),
        ])
        setApp(ar.data); setReviews(rr.data); setAvgRating(avgr.data||0); setDownloaded(dr.data)
      } catch {
      
  toast('App not found', 'error')
  navigate('/')
}
      
      finally { setLoading(false) }
    }
    load()
  }, [id])

  const doDownload = async () => {
    if (downloaded||dlActive) return
    setDlActive(true)
    for (let p=0; p<=100; p+=14) { await new Promise(r=>setTimeout(r,90)); setDlPct(Math.min(p,100)) }
    try {
      await downloadsAPI.record(id, app.name)
      await appsAPI.incrementDownload(id)
    } catch {}
    setDownloaded(true); setDlActive(false)
    setApp(a => ({...a, downloadCount:(a.downloadCount||0)+1}))
    toast(`${app.name} installed!`)
  }
const doReview = async (values, { resetForm, setSubmitting }) => {
  try {
    const res = await reviewsAPI.add(id, { rating:values.rating, comment:values.comment, userName:user.name, userEmail:user.email })
    const updatedReviews = [res.data, ...reviews]
    setReviews(updatedReviews)
    const newAvg = parseFloat((updatedReviews.reduce((sum,r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1))
    setAvgRating(newAvg)
    try { await appsAPI.updateRating(id, newAvg) } catch {}
    setStarPick(0); resetForm(); toast('Review posted!')
  } catch { toast('Failed to post review','error') }
  finally { setSubmitting(false) }
}

  const doDelete = async (rid) => {
    try {
      await reviewsAPI.delete(rid); setReviews(r=>r.filter(x=>x.id!==rid)); toast('Review removed','info')
    } catch { toast('Cannot delete','error') }
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <Spinner size={28}/>
    </div>
  )
  if (!app) return null
  const rating = avgRating>0 ? avgRating : (app.rating||0)

  return (
    <div className="page">
      <div className="container" style={{ paddingTop:32, paddingBottom:60 }}>
        <button className="btn btn-ghost" style={{ gap:6, marginBottom:24, fontSize:13, color:'var(--text-2)', padding:'6px 10px' }}
          onClick={() => navigate(-1)}>
          <ArrowLeft size={14}/> Back
        </button>

        {/* ── Hero card ── */}
        <div className="card" style={{ padding:'28px 32px', marginBottom:20 }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:24, alignItems:'flex-start' }}>
            <AppIcon emoji={app.iconEmoji||'🚀'} size={80} bg={app.iconColor||'#F1F2F6'} radius={20}/>
            <div style={{ flex:1, minWidth:240 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16 }}>
                <div>
                  <h1 style={{ fontSize:24, fontWeight:600, letterSpacing:'-0.03em', marginBottom:3 }}>{app.name}</h1>
                  <p style={{ fontSize:13.5, color:'var(--text-2)', marginBottom:10 }}>{app.developer||app.genre}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <Stars rating={rating} size={13}/>
                    <span style={{ fontSize:14, fontWeight:600, color:'var(--text-1)' }}>{rating?rating.toFixed(1):'–'}</span>
                    <span style={{ fontSize:12.5, color:'var(--text-3)' }}>({reviews.length} reviews)</span>
                  </div>
                </div>
                {/* Install button */}
                {downloaded ? (
                  <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--green-lt)', border:'1px solid rgba(22,163,74,0.2)', borderRadius:'var(--r-md)', padding:'9px 18px', fontSize:13.5, color:'var(--green)', fontWeight:500 }}>
                    <Download size={14}/> Installed
                  </div>
                ) : dlActive ? (
                  <div style={{ minWidth:180 }}>
                    <p style={{ fontSize:12, color:'var(--text-3)', marginBottom:6 }}>Installing… {dlPct}%</p>
                    <div className="prog"><div className="prog-fill" style={{ width:dlPct+'%' }}/></div>
                  </div>
                ) : (
                  <button className="btn btn-primary btn-lg" onClick={doDownload} style={{ gap:8 }}>
                    <Download size={15}/> Install App
                  </button>
                )}
              </div>

              {/* Stats */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:28, marginTop:24, paddingTop:20, borderTop:'1px solid var(--border)' }}>
                <Stat icon={Tag}             label="Version"   value={app.version||'–'}/>
                <Stat icon={Calendar}        label="Released"  value={app.releaseDate||'–'}/>
                <Stat icon={ArrowDownToLine} label="Installs"  value={fmt(app.downloadCount)}/>
                <Stat icon={HardDrive}       label="Size"      value={app.fileSize||'–'}/>
                <div>
                  <p style={{ fontSize:11, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:500, marginBottom:4 }}>Category</p>
                  <span className="badge badge-blue">{app.category?.name||app.genre||'–'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {app.tags?.length > 0 && (
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
            {app.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        )}

        {/* ── Two column ── */}
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,2fr) minmax(0,3fr)', gap:18, alignItems:'start' }}>

          {/* Left */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="card" style={{ padding:24 }}>
              <p style={{ fontSize:13, fontWeight:600, color:'var(--text-1)', marginBottom:12 }}>About</p>
              <p style={{ fontSize:13.5, color:'var(--text-2)', lineHeight:1.75 }}>{app.description||'No description.'}</p>
            </div>

            <div className="card" style={{ padding:24 }}>
              <p style={{ fontSize:13, fontWeight:600, color:'var(--text-1)', marginBottom:16 }}>Write a Review</p>
              <Formik initialValues={{ rating:starPick, comment:'' }} enableReinitialize validationSchema={schema} onSubmit={doReview}>
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form style={{ display:'flex', flexDirection:'column', gap:14 }}>
                    <div>
                      <label className="lbl">Rating</label>
                      <Stars rating={values.rating} interactive size={20}
                        onRate={r=>{ setFieldValue('rating',r); setStarPick(r) }}/>
                      <FieldErr name="rating"/>
                    </div>
                    <div>
                      <label className="lbl">Comment</label>
                      <Field as="textarea" name="comment" rows={3}
                        className="inp" style={{ resize:'vertical' }}
                        placeholder="Share your experience…"/>
                      <FieldErr name="comment"/>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ alignSelf:'flex-start' }} disabled={isSubmitting}>
                      {isSubmitting ? <Spinner size={14} color="#fff"/> : 'Post Review'}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          {/* Right: Reviews */}
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <p style={{ fontWeight:600, fontSize:13, color:'var(--text-1)' }}>
                Reviews <span style={{ color:'var(--text-3)', fontWeight:400 }}>({reviews.length})</span>
              </p>
              {rating > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:6, background:'var(--amber-lt)', border:'1px solid rgba(217,119,6,0.18)', borderRadius:'var(--r-md)', padding:'5px 10px' }}>
                  <Star size={12} fill="#F59E0B" stroke="#F59E0B"/>
                  <span style={{ fontSize:13, fontWeight:600, color:'var(--amber)' }}>{rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="card" style={{ padding:40, textAlign:'center' }}>
                <Star size={22} style={{ color:'var(--border-md)', margin:'0 auto 10px' }}/>
                <p style={{ fontSize:13.5, fontWeight:500, color:'var(--text-1)', marginBottom:4 }}>No reviews yet</p>
                <p style={{ fontSize:12.5, color:'var(--text-3)' }}>Be the first to review this app</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {reviews.map(r => (
                  <div key={r.id} className="card" style={{ padding:'16px 18px' }}>
                    <div style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:10 }}>
                      <div style={{ width:32, height:32, borderRadius:9, background:'var(--accent-lt)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:12.5, fontWeight:600, color:'var(--accent)' }}>
                        {r.userName?.[0]?.toUpperCase()||'?'}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                          <span style={{ fontSize:13, fontWeight:600 }}>{r.userName||'Anonymous'}</span>
                          {user?.email===r.userEmail && (
                            <button className="btn btn-icon btn-sm" onClick={()=>doDelete(r.id)} style={{ border:'none', color:'var(--text-3)' }}>
                              <Trash2 size={13}/>
                            </button>
                          )}
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:2 }}>
                          <Stars rating={r.rating} size={10}/>
                          <span style={{ fontSize:11.5, color:'var(--text-3)' }}>
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize:13.5, color:'var(--text-2)', lineHeight:1.7 }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:680px){.two-col{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
