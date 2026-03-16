export default function AppIcon({ emoji = '🚀', size = 48, bg = '#F1F2F6', radius = 12 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: bg, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0, fontSize: size * 0.46,
      border: '1px solid rgba(0,0,0,0.05)',
    }}>
      {emoji}
    </div>
  )
}
