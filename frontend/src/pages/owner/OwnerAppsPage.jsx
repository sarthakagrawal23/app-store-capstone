import { useEffect, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Plus, Eye, EyeOff, Pencil, Trash2, X, Check, Package } from 'lucide-react'
import { appsAPI } from '../../api/services'
import { useCategories } from '../../hooks/useCategories'
import { useToast } from '../../context/ToastContext'
import AppIcon from '../../components/common/AppIcon'
import Spinner from '../../components/common/Spinner'
import FieldErr from '../../components/common/FieldErr'
import EmptyState from '../../components/common/EmptyState'

const ICONS = ['🚀','🎨','💡','🔥','⚡','🎵','📊','🔐','🛠️','🎯','🌐','📱','🎮','📬','📝','🔬']

const schema = Yup.object({
  name:        Yup.string().min(2,'Min 2 chars').required('Required'),
  description: Yup.string().min(10,'Min 10 chars').required('Required'),
  version:     Yup.string().required('Required'),
  genre:       Yup.string().required('Required'),
  fileSize:    Yup.string().required('Required'),
  iconEmoji:   Yup.string().required('Pick an icon'),
  categoryId:  Yup.number().typeError('Required').required('Required'),
})

function FInput({ label, name, type='text', placeholder, errors, touched, ...props }) {
  return (
    <div>
      <label className="lbl">{label}</label>
      <Field name={name} type={type} placeholder={placeholder}
        className={`inp ${errors[name]&&touched[name]?'inp-err':''}`} {...props}/>
      <FieldErr name={name}/>
    </div>
  )
}

export default function OwnerAppsPage() {
  const toast = useToast()
  const { categories } = useCategories()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)

  useEffect(() => {
    appsAPI.getMyApps().then(r=>setApps(r.data)).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  const initVals = editTarget ? {
    name:editTarget.name, description:editTarget.description||'',
    version:editTarget.version||'1.0.0', genre:editTarget.genre||'',
    fileSize:editTarget.fileSize||'', iconEmoji:editTarget.iconEmoji||'🚀',
    categoryId:editTarget.category?.id||'', releaseDate:editTarget.releaseDate||'',
  } : { name:'', description:'', version:'1.0.0', genre:'', fileSize:'', iconEmoji:'🚀', categoryId:'', releaseDate:'' }

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      if (editTarget) {
        const r = await appsAPI.update(editTarget.id, values)
        setApps(a=>a.map(x=>x.id===editTarget.id?r.data:x))
        toast('App updated!')
      } else {
        const r = await appsAPI.create(values)
        setApps(a=>[...a,r.data])
        toast('App published!')
      }
      resetForm(); setShowForm(false); setEditTarget(null)
    } catch(err) { toast(err.response?.data?.message||'Failed','error') }
    finally { setSubmitting(false) }
  }

  const handleToggle = async id => {
    try { await appsAPI.toggleVisibility(id); setApps(a=>a.map(x=>x.id===id?{...x,visible:!x.visible}:x)); toast('Visibility updated','info') }
    catch { toast('Failed','error') }
  }
  const handleDelete = async id => {
    if (!window.confirm('Delete this app?')) return
    try { await appsAPI.delete(id); setApps(a=>a.filter(x=>x.id!==id)); toast('App deleted','info') }
    catch { toast('Failed','error') }
  }

  return (
    <div className="page">
      <div className="container" style={{ paddingTop:36, paddingBottom:60 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32 }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:600, letterSpacing:'-0.03em', marginBottom:4 }}>My Applications</h1>
            <p style={{ fontSize:13.5, color:'var(--text-2)' }}>{apps.length} published</p>
          </div>
          <button className={`btn ${showForm?'btn-secondary':'btn-primary'}`} style={{ gap:6 }}
            onClick={() => { setEditTarget(null); setShowForm(!showForm) }}>
            {showForm ? <><X size={14}/>Cancel</> : <><Plus size={14}/>Publish App</>}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card fade-up" style={{ padding:'24px 28px', marginBottom:20 }}>
            <p style={{ fontWeight:600, fontSize:14, marginBottom:20 }}>{editTarget?'Edit Application':'New Application'}</p>
            <Formik key={editTarget?.id??'new'} initialValues={initVals} validationSchema={schema} onSubmit={handleSubmit}>
              {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                <Form style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14 }}>
                    <div style={{ gridColumn:'span 2' }}><FInput label="App name *" name="name" placeholder="My Amazing App" errors={errors} touched={touched}/></div>
                    <FInput label="Version *" name="version" placeholder="1.0.0" errors={errors} touched={touched}/>
                    <FInput label="File size *" name="fileSize" placeholder="25 MB" errors={errors} touched={touched}/>
                    <FInput label="Genre *" name="genre" placeholder="e.g. Productivity" errors={errors} touched={touched}/>
                    <div>
                      <label className="lbl">Category *</label>
                      <Field as="select" name="categoryId" className={`inp ${errors.categoryId&&touched.categoryId?'inp-err':''}`}>
                        <option value="">Select…</option>
                        {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                      </Field>
                      <FieldErr name="categoryId"/>
                    </div>
                    <FInput label="Release date" name="releaseDate" type="date" errors={errors} touched={touched}/>
                  </div>
                  <div>
                    <label className="lbl">Description *</label>
                    <Field as="textarea" name="description" rows={3}
                      className={`inp ${errors.description&&touched.description?'inp-err':''}`}
                      style={{ resize:'vertical' }} placeholder="Describe your app…"/>
                    <FieldErr name="description"/>
                  </div>
                  <div>
                    <label className="lbl">Icon *</label>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                      {ICONS.map(ic => (
                        <button key={ic} type="button" onClick={()=>setFieldValue('iconEmoji',ic)}
                          style={{ width:38, height:38, borderRadius:10, fontSize:18, border:'1px solid', cursor:'pointer', transition:'all 0.12s ease',
                            borderColor: values.iconEmoji===ic?'var(--accent)':'var(--border-md)',
                            background: values.iconEmoji===ic?'var(--accent-lt)':'var(--surface)',
                            transform: values.iconEmoji===ic?'scale(1.1)':'scale(1)',
                          }}>
                          {ic}
                        </button>
                      ))}
                    </div>
                    <FieldErr name="iconEmoji"/>
                  </div>
                  <div style={{ display:'flex', gap:10, paddingTop:4 }}>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ gap:6 }}>
                      {isSubmitting?<Spinner size={14} color="#fff"/>:<><Check size={14}/>{editTarget?'Save Changes':'Publish'}</>}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={()=>{setShowForm(false);setEditTarget(null)}}>Cancel</button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'80px 0' }}><Spinner size={28}/></div>
        ) : apps.length === 0 ? (
          <EmptyState icon={Package} title="No apps yet" subtitle="Publish your first app to get started"/>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {apps.map(app => (
              <div key={app.id} className="card" style={{ padding:'14px 18px', display:'flex', alignItems:'center', gap:14, transition:'all 0.16s ease' }}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--sh-md)';e.currentTarget.style.borderColor='var(--border-md)'}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--sh-sm)';e.currentTarget.style.borderColor='var(--border)'}}>
                <AppIcon emoji={app.iconEmoji||'🚀'} size={44} bg={app.iconColor||'#F1F2F6'} radius={10}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3, flexWrap:'wrap' }}>
                    <span style={{ fontWeight:600, fontSize:14, letterSpacing:'-0.01em' }}>{app.name}</span>
                    <span className={`badge ${app.visible?'badge-green':'badge-neutral'}`}>{app.visible?'Live':'Hidden'}</span>
                    <span className="badge badge-neutral">v{app.version}</span>
                  </div>
                  <p style={{ fontSize:12.5, color:'var(--text-3)' }}>
                    {app.genre} · {app.category?.name||'–'} · {app.downloadCount||0} installs · {app.rating?app.rating.toFixed(1)+'★':'No ratings'}
                  </p>
                </div>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  {[
                    { Icon:app.visible?EyeOff:Eye, title:app.visible?'Hide':'Show', action:()=>handleToggle(app.id) },
                    { Icon:Pencil, title:'Edit', action:()=>{ setEditTarget(app); setShowForm(true); window.scrollTo({top:0,behavior:'smooth'}) } },
                    { Icon:Trash2, title:'Delete', action:()=>handleDelete(app.id), danger:true },
                  ].map(({Icon,title,action,danger})=>(
                    <button key={title} title={title} className="btn btn-icon" onClick={action}
                      style={{ color: danger?'var(--red)':'var(--text-2)', borderColor: danger?'rgba(220,38,38,0.2)':'var(--border)' }}
                      onMouseEnter={e=>{ e.currentTarget.style.background=danger?'var(--red-lt)':'var(--bg2)' }}
                      onMouseLeave={e=>{ e.currentTarget.style.background='transparent' }}>
                      <Icon size={14}/>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
