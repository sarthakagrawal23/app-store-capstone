export default function EmptyState({ icon: Icon, iconSize = 22, title, subtitle, action }) {
  return (
    <div className="empty fade-up">
      {Icon && (
        <div className="empty-icon">
          <Icon size={iconSize} style={{ color: 'var(--text-3)' }} />
        </div>
      )}
      {title && <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-1)', marginBottom: 6 }}>{title}</p>}
      {subtitle && <p style={{ fontSize: 13.5, color: 'var(--text-2)', maxWidth: 280, lineHeight: 1.6 }}>{subtitle}</p>}
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  )
}
