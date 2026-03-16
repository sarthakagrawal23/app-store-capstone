import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, ArrowRight } from 'lucide-react'
import { downloadsAPI, appsAPI } from '../../api/services'
import AppIcon from '../../components/common/AppIcon'
import Spinner from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'

export default function DownloadsPage() {
  const navigate = useNavigate()
  const [downloads, setDownloads] = useState([])
  const [appDetails, setAppDetails]   = useState({})
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await downloadsAPI.getMy()
        setDownloads(res.data)

        // Fetch app details for each unique appId to get icon + color
        const uniqueIds = [...new Set(res.data.map(d => d.appId))]
        const details = {}
        await Promise.all(
          uniqueIds.map(async (appId) => {
            try {
              const r = await appsAPI.getById(appId)
              details[appId] = r.data
            } catch {}
          })
        )
        setAppDetails(details)
      } catch {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 36, paddingBottom: 60 }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.03em', marginBottom: 4 }}>
            My Downloads
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
            {downloads.length} app{downloads.length !== 1 ? 's' : ''} installed
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <Spinner size={28} />
          </div>
        ) : downloads.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Nothing here yet"
            subtitle="Browse the store and install your first app"
            action={
              <button
                onClick={() => navigate('/')}
                className="btn btn-primary"
                style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                Browse Store <ArrowRight size={14} />
              </button>
            }
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {downloads.map(d => {
              const app = appDetails[d.appId]
              return (
                <div
                  key={d.id}
                  onClick={() => navigate(`/app/${d.appId}`)}
                  className="card card-hover"
                  style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
                >
                  {/* Real app icon if loaded, fallback to Package */}
                  {app ? (
                    <AppIcon
                      emoji={app.iconEmoji || '📱'}
                      size={44}
                      bg={app.iconColor || '#F1F2F6'}
                      radius={11}
                    />
                  ) : (
                    <div style={{ width: 44, height: 44, borderRadius: 11, background: '#F1F2F6',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Package size={20} style={{ color: '#9CA3AF' }} />
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em', marginBottom: 3 }}>
                      {d.appName}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                      {app?.genre || app?.category?.name || ''}
                      {app && d.downloadedAt ? ' · ' : ''}
                      {d.downloadedAt
                        ? new Date(d.downloadedAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })
                        : ''}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--green)',
                                   background: 'var(--green-lt)', border: '1px solid rgba(22,163,74,0.2)',
                                   borderRadius: 20, padding: '3px 10px' }}>
                      Installed
                    </span>
                    <ArrowRight size={14} style={{ color: 'var(--text-3)' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}