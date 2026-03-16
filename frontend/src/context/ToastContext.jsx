import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const Ctx = createContext(null)

const MAP = {
  success: { Icon: CheckCircle2, color: 'var(--green)',  bg: 'var(--green-lt)',  border: 'rgba(22,163,74,0.18)'  },
  error:   { Icon: XCircle,      color: 'var(--red)',    bg: 'var(--red-lt)',    border: 'rgba(220,38,38,0.18)'  },
  info:    { Icon: Info,         color: 'var(--accent)', bg: 'var(--accent-lt)', border: 'var(--accent-bd)'      },
  warning: { Icon: Info,         color: 'var(--amber)',  bg: 'var(--amber-lt)',  border: 'rgba(217,119,6,0.18)'  },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const add = useCallback((msg, type='success') => {
    const id = Date.now()
    setToasts(t => [...t, {id,msg,type}])
    setTimeout(() => setToasts(t => t.filter(x => x.id!==id)), 4000)
  }, [])

  return (
    <Ctx.Provider value={add}>
      {children}
      <div style={{ position:'fixed', top:72, right:16, zIndex:9999, display:'flex', flexDirection:'column', gap:8, pointerEvents:'none' }}>
        {toasts.map(t => {
          const c = MAP[t.type] || MAP.success
          return (
            <div key={t.id} style={{
              display:'flex', alignItems:'center', gap:10,
              background: c.bg, border: `1px solid ${c.border}`,
              borderRadius: 'var(--r-lg)', padding:'11px 16px',
              boxShadow:'var(--sh-md)', minWidth:240, maxWidth:340,
              pointerEvents:'auto',
              animation:'fadeUp 0.22s ease',
            }}>
              <c.Icon size={15} style={{ color: c.color, flexShrink:0 }}/>
              <span style={{ fontSize:13.5, color:'var(--text-1)', fontWeight:500, flex:1 }}>{t.msg}</span>
              <button onClick={() => setToasts(t2=>t2.filter(x=>x.id!==t.id))}
                style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', padding:2 }}>
                <X size={13}/>
              </button>
            </div>
          )
        })}
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)
