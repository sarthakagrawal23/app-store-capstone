import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Grid2X2, Download, Bell, User,
  LayoutDashboard, Package, LogOut, Store
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout, isOwner } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  if (!user) return null

  const links = isOwner
    ? [
        { to: '/',              Icon: Grid2X2,         label: 'Browse'    },
        { to: '/owner/apps',    Icon: Package,         label: 'My Apps'   },
        { to: '/dashboard',     Icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/notifications', Icon: Bell,            label: 'Alerts'    },
      ]
    : [
        { to: '/',              Icon: Grid2X2,  label: 'Browse'    },
        { to: '/downloads',     Icon: Download, label: 'Downloads' },
        { to: '/notifications', Icon: Bell,     label: 'Alerts'    },
        { to: '/profile',       Icon: User,     label: 'Profile'   },
      ]

  const isActive = (to) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to)

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: 68,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid #EAECF0',
        boxShadow: '0 1px 3px rgba(16,24,40,0.06), 0 1px 2px rgba(16,24,40,0.04)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          height: '100%',
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* ── Logo ── */}
        <Link
          to="/"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(124,58,237,0.35)',
              flexShrink: 0,
            }}
          >
            <Store size={17} color="#fff" />
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: 17,
              color: '#0F172A',
              letterSpacing: '-0.3px',
            }}
          >
            Play Store
          </span>
        </Link>

        {/* ── Nav links ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {links.map(({ to, Icon, label }) => {
            const active = isActive(to)
            return (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '8px 16px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  color: active ? '#7C3AED' : '#4B5563',
                  background: active ? '#F5F3FF' : 'transparent',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = '#F9FAFB'
                    e.currentTarget.style.color = '#1F2937'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#4B5563'
                  }
                }}
              >
                <Icon
                  size={16}
                  style={{ color: active ? '#7C3AED' : 'currentColor', flexShrink: 0 }}
                />
                <span>{label}</span>
                {/* Active underline dot */}
                {active && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 4,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: '#7C3AED',
                    }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* ── Right side ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

          {/* User chip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 12px 5px 6px',
              borderRadius: 100,
              background: '#F8F9FB',
              border: '1px solid #E9EAEC',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {user.name?.[0]?.toUpperCase()}
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: '#374151',
                maxWidth: 96,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user.name}
            </span>
          </div>

          {/* Divider */}
          <div
            style={{ width: 1, height: 22, background: '#E5E7EB', flexShrink: 0 }}
          />

          {/* Sign out */}
          <button
            onClick={() => { logout(); navigate('/login') }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 10,
              border: '1px solid #E5E7EB',
              background: 'transparent',
              fontSize: 13,
              fontWeight: 500,
              color: '#6B7280',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#FEF2F2'
              e.currentTarget.style.borderColor = '#FECACA'
              e.currentTarget.style.color = '#DC2626'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = '#E5E7EB'
              e.currentTarget.style.color = '#6B7280'
            }}
          >
            <LogOut size={15} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  )
}