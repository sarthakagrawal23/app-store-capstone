import { Link, useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Store, Mail, Lock, ArrowRight } from 'lucide-react'
import { authAPI } from '../../api/services'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import FieldErr from '../../components/common/FieldErr'
import Spinner from '../../components/common/Spinner'

const schema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Required'),
})

function parseError(err) {
  const d = err.response?.data
  if (!d) return 'Login failed'
  if (typeof d === 'string') return d
  if (d.message) return d.message
  return Object.values(d)[0] || 'Invalid email or password'
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  return (
    <div style={{
      minHeight:'100vh', background:'var(--bg)',
      display:'flex',
    }}>
      {/* Left panel — branding */}
      <div style={{
        width:'42%', background:'var(--accent)', display:'none',
        flexDirection:'column', justifyContent:'space-between',
        padding:'48px', position:'relative', overflow:'hidden',
      }} className="lg-panel">
        {/* Subtle grid texture */}
        <div style={{
          position:'absolute', inset:0, opacity:0.06,
          backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize:'32px 32px',
        }}/>
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Store size={18} color="#fff"/>
            </div>
            <span style={{ color:'#fff', fontWeight:600, fontSize:16 }}>App Store</span>
          </div>
        </div>
        <div style={{ position:'relative', zIndex:1 }}>
          <h2 style={{ color:'#fff', fontSize:28, fontWeight:600, letterSpacing:'-0.03em', lineHeight:1.3, marginBottom:14 }}>
            Discover apps built for professionals.
          </h2>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:14, lineHeight:1.7 }}>
            Over 6 curated applications across productivity, education, music, and more — all in one place.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 24px' }}>
        <div style={{ width:'100%', maxWidth:380 }} className="fade-up">
          {/* Logo (mobile) */}
          <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:40 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(37,99,235,0.28)' }}>
              <Store size={15} color="#fff"/>
            </div>
            <span style={{ fontWeight:600, fontSize:15, letterSpacing:'-0.02em' }}>App Store</span>
          </div>

          <h1 style={{ fontSize:22, fontWeight:600, letterSpacing:'-0.03em', marginBottom:4 }}>Welcome back</h1>
          <p style={{ fontSize:13.5, color:'var(--text-2)', marginBottom:32 }}>Sign in to your account</p>

          <Formik initialValues={{ email:'', password:'' }} validationSchema={schema}
            onSubmit={async (values, { setSubmitting, setStatus }) => {
              try {
                const res = await authAPI.login({ email: values.email.trim().toLowerCase(), password: values.password })
                const { token, ...u } = res.data
                login(u, token)
                toast(`Welcome back, ${u.name}!`)
                navigate(u.role === 'OWNER' ? '/owner/apps' : '/')
              } catch(err) { setStatus({ error: parseError(err) }) }
              finally { setSubmitting(false) }
            }}>
            {({ isSubmitting, errors, touched, status }) => (
              <Form noValidate style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {status?.error && (
                  <div style={{ background:'var(--red-lt)', border:'1px solid rgba(220,38,38,0.2)', borderRadius:'var(--r-md)', padding:'10px 14px', fontSize:13, color:'var(--red)' }}>
                    {status.error}
                  </div>
                )}
                <div>
                  <label className="lbl">Email address</label>
                  <div style={{ position:'relative' }}>
                    <Mail size={14} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }}/>
                    <Field name="email" type="email" placeholder="you@example.com"
                      className={`inp ${errors.email&&touched.email?'inp-err':''}`}
                      style={{ paddingLeft:33 }}/>
                  </div>
                  <FieldErr name="email"/>
                </div>
                <div>
                  <label className="lbl">Password</label>
                  <div style={{ position:'relative' }}>
                    <Lock size={14} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }}/>
                    <Field name="password" type="password" placeholder="••••••••"
                      className={`inp ${errors.password&&touched.password?'inp-err':''}`}
                      style={{ paddingLeft:33 }}/>
                  </div>
                  <FieldErr name="password"/>
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop:4, width:'100%' }} disabled={isSubmitting}>
                  {isSubmitting ? <Spinner size={16} color="#fff"/> : <><span>Sign in</span><ArrowRight size={15}/></>}
                </button>
              </Form>
            )}
          </Formik>

          <p style={{ marginTop:28, fontSize:13, color:'var(--text-2)', textAlign:'center' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color:'var(--accent)', fontWeight:500, textDecoration:'none' }}>Create one</Link>
          </p>
        </div>
      </div>

      <style>{`@media(min-width:900px){.lg-panel{display:flex!important}}`}</style>
    </div>
  )
}
