import { useState } from 'react'

export default function Stars({ rating = 0, interactive = false, onRate, size = 13 }) {
  const [hover, setHover] = useState(0)
  return (
    <span style={{ display:'inline-flex', gap: 1 }}>
      {[1,2,3,4,5].map(i => {
        const lit = interactive ? (hover || rating) >= i : rating >= i - 0.3
        return (
          <button key={i} type="button" style={{
            background:'none', border:'none', padding:'1px',
            cursor: interactive ? 'pointer' : 'default',
            transition: 'transform 0.1s ease',
            fontSize: size,
          }}
            onMouseEnter={interactive ? () => setHover(i) : undefined}
            onMouseLeave={interactive ? () => setHover(0) : undefined}
            onClick={interactive && onRate ? () => onRate(i) : undefined}
          >
            <svg width={size} height={size} viewBox="0 0 16 16">
              <path d="M8 1.5l1.72 3.49 3.85.56-2.79 2.71.66 3.83L8 10.27l-3.44 1.82.66-3.83L2.43 5.55l3.85-.56z"
                fill={lit ? '#F59E0B' : 'var(--border-md)'}
                stroke={lit ? '#F59E0B' : 'var(--border-md)'}
                strokeWidth="0.5" strokeLinejoin="round"
              />
            </svg>
          </button>
        )
      })}
    </span>
  )
}
