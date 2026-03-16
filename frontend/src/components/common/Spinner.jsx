export default function Spinner({ size = 18, color = 'currentColor' }) {
  return (
    <svg className="spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeOpacity=".2" strokeWidth="2.5"/>
      <path d="M21 12a9 9 0 00-9-9" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}
