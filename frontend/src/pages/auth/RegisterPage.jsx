import { Link, useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Store, Mail, Lock, User, Briefcase, ArrowRight } from 'lucide-react'
import { authAPI } from '../../api/services'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import FieldErr from '../../components/common/FieldErr'
import Spinner from '../../components/common/Spinner'

const schema = Yup.object({
  name:            Yup.string().min(2,'Min 2 chars').required('Required'),
  email:           Yup.string().email('Invalid email').required('Required'),
  password:        Yup.string().min(6,'Min 6 characters').required('Required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')],'Passwords must match').required('Required'),
  role:            Yup.string().oneOf(['USER','OWNER']).required(),
})

function parseError(err) {
  const d = err.response?.data
  if (!d) return 'Registration failed'
  if (typeof d === 'string') return d
  if (d.message) return d.message
  return Object.values(d)[0] || 'Registration failed'
}

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 24px' }}>
      <div style={{ width:'100%', maxWidth:400 }} className="fade-up">
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:36 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(37,99,235,0.28)' }}>
            <Store size={15} color="#fff"/>
          </div>
          <span style={{ fontWeight:600, fontSize:15, letterSpacing:'-0.02em' }}>App Store</span>
        </div>

        <h1 style={{ fontSize:22, fontWeight:600, letterSpacing:'-0.03em', marginBottom:4 }}>Create an account</h1>
        <p style={{ fontSize:13.5, color:'var(--text-2)', marginBottom:28 }}>Join App Store today</p>

        <Formik
          initialValues={{ name:'', email:'', password:'', confirmPassword:'', role:'USER' }}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting, setStatus, setFieldError }) => {
            try {
              const res = await authAPI.register({ name:values.name.trim(), email:values.email.trim().toLowerCase(), password:values.password, role:values.role })
              const { token, ...u } = res.data
              login(u, token)
              toast(`Welcome to App Store, ${u.name}!`)
              navigate(u.role === 'OWNER' ? '/owner/apps' : '/')
            } catch(err) {
              const msg = parseError(err)
              setStatus({ error: msg })
              if (msg.toLowerCase().includes('email')) setFieldError('email', msg)
            }
            finally { setSubmitting(false) }
          }}>
          {({ isSubmitting, errors, touched, values, setFieldValue, status }) => (
            <Form noValidate style={{ display:'flex', flexDirection:'column', gap:15 }}>
              {status?.error && (
                <div style={{ background:'var(--red-lt)', border:'1px solid rgba(220,38,38,0.2)', borderRadius:'var(--r-md)', padding:'10px 14px', fontSize:13, color:'var(--red)' }}>
                  {status.error}
                </div>
              )}

              {/* Role selector */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, padding:4, background:'var(--bg2)', borderRadius:'var(--r-lg)', border:'1px solid var(--border)' }}>
                {[{v:'USER',label:'User',Icon:User},{v:'OWNER',label:'Developer',Icon:Briefcase}].map(({v,label,Icon})=>(
                  <button key={v} type="button" onClick={() => setFieldValue('role',v)}
                    style={{
                      display:'flex', alignItems:'center', justifyContent:'center', gap:7,
                      padding:'9px 12px', borderRadius:'var(--r-md)', border:'none', cursor:'pointer',
                      fontSize:13.5, fontWeight:500, transition:'all 0.14s ease',
                      background: values.role===v ? 'var(--surface)' : 'transparent',
                      color: values.role===v ? 'var(--text-1)' : 'var(--text-2)',
                      boxShadow: values.role===v ? 'var(--sh-sm)' : 'none',
                    }}>
                    <Icon size={13} strokeWidth={values.role===v?2.2:1.8}/>
                    {label}
                  </button>
                ))}
              </div>

              {[
                { name:'name',     type:'text',     label:'Full name',      Icon:User, ph:'Your name'        },
                { name:'email',    type:'email',    label:'Email address',  Icon:Mail, ph:'you@example.com'  },
                { name:'password', type:'password', label:'Password',       Icon:Lock, ph:'Min 6 characters' },
                { name:'confirmPassword', type:'password', label:'Confirm password', Icon:Lock, ph:'Repeat password' },
              ].map(({ name, type, label, Icon, ph }) => (
                <div key={name}>
                  <label className="lbl">{label}</label>
                  <div style={{ position:'relative' }}>
                    <Icon size={14} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }}/>
                    <Field name={name} type={type} placeholder={ph}
                      className={`inp ${errors[name]&&touched[name]?'inp-err':''}`}
                      style={{ paddingLeft:33 }}/>
                  </div>
                  <FieldErr name={name}/>
                </div>
              ))}

              <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop:4, width:'100%' }} disabled={isSubmitting}>
                {isSubmitting ? <Spinner size={16} color="#fff"/> : <><span>Create account</span><ArrowRight size={15}/></>}
              </button>
            </Form>
          )}
        </Formik>

        <p style={{ marginTop:24, fontSize:13, color:'var(--text-2)', textAlign:'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'var(--accent)', fontWeight:500, textDecoration:'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
