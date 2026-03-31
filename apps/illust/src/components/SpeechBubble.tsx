import type { BubbleStyle } from '../types'

interface Props {
  text: string
  style: BubbleStyle
  x: number
  y: number
  width?: number
  tailSide?: 'left' | 'right' | 'bottom'
}

export function SpeechBubble({ text, style, x, y, width = 160, tailSide = 'bottom' }: Props) {
  if (style === 'none' || !text) return null

  const lines = text.split('\n')
  const lineHeight = 20
  const pad = 14
  const h = lines.length * lineHeight + pad * 2
  const w = width

  const cx = x + w / 2
  const cy = y + h / 2

  if (style === 'thought') {
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={w / 2} ry={h / 2} fill="white" stroke="#aaa" strokeWidth="2" />
        <circle cx={cx - 10} cy={y + h + 12} r={7} fill="white" stroke="#aaa" strokeWidth="2" />
        <circle cx={cx - 18} cy={y + h + 22} r={4} fill="white" stroke="#aaa" strokeWidth="2" />
        {lines.map((line, i) => (
          <text
            key={i}
            x={cx}
            y={y + pad + lineHeight / 2 + i * lineHeight}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fill="#333"
            fontFamily="sans-serif"
          >
            {line}
          </text>
        ))}
      </g>
    )
  }

  if (style === 'shout') {
    const pts = generateSpiky(cx, cy, w / 2 + 8, h / 2 + 8, 12)
    return (
      <g>
        <polygon points={pts} fill="#fff9c4" stroke="#f9a825" strokeWidth="2" />
        {lines.map((line, i) => (
          <text
            key={i}
            x={cx}
            y={y + pad + lineHeight / 2 + i * lineHeight}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#333"
            fontFamily="sans-serif"
          >
            {line}
          </text>
        ))}
      </g>
    )
  }

  // speech (rounded rect with tail)
  const r = 14
  const tailH = 18

  let tailPath = ''
  if (tailSide === 'bottom') {
    tailPath = `M${cx - 10},${y + h} L${cx},${y + h + tailH} L${cx + 10},${y + h}`
  } else if (tailSide === 'left') {
    tailPath = `M${x},${cy - 10} L${x - tailH},${cy} L${x},${cy + 10}`
  } else {
    tailPath = `M${x + w},${cy - 10} L${x + w + tailH},${cy} L${x + w},${cy + 10}`
  }

  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} ry={r} fill="white" stroke="#aaa" strokeWidth="2" />
      <path d={tailPath} fill="white" stroke="#aaa" strokeWidth="2" strokeLinejoin="round" />
      {/* Cover seam */}
      <path
        d={tailSide === 'bottom' ? `M${cx - 9},${y + h} L${cx + 9},${y + h}` : ''}
        stroke="white"
        strokeWidth="3"
      />
      {lines.map((line, i) => (
        <text
          key={i}
          x={cx}
          y={y + pad + lineHeight / 2 + i * lineHeight}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fill="#333"
          fontFamily="sans-serif"
        >
          {line}
        </text>
      ))}
    </g>
  )
}

function generateSpiky(cx: number, cy: number, rx: number, ry: number, points: number): string {
  const pts: string[] = []
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI * 2 * i) / (points * 2) - Math.PI / 2
    const r = i % 2 === 0 ? 1 : 0.65
    const x = cx + rx * r * Math.cos(angle)
    const y = cy + ry * r * Math.sin(angle)
    pts.push(`${x},${y}`)
  }
  return pts.join(' ')
}
