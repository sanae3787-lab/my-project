import type { Diagram, DiagramNode, DiagramEdge } from '../types'

interface Props {
  diagram: Diagram
  selectedNodeId?: string | null
  onNodeClick?: (id: string) => void
}

function NodeShape({ node, selected }: { node: DiagramNode; selected: boolean }) {
  const stroke = selected ? '#2563eb' : node.borderColor
  const sw = selected ? 3 : 2

  const cx = node.x + node.width / 2
  const cy = node.y + node.height / 2

  let shape: React.ReactNode
  switch (node.shape) {
    case 'rounded':
      shape = (
        <rect
          x={node.x} y={node.y} width={node.width} height={node.height}
          rx={20} ry={20}
          fill={node.fillColor} stroke={stroke} strokeWidth={sw}
        />
      )
      break
    case 'diamond': {
      const pts = [
        `${cx},${node.y}`,
        `${node.x + node.width},${cy}`,
        `${cx},${node.y + node.height}`,
        `${node.x},${cy}`,
      ].join(' ')
      shape = <polygon points={pts} fill={node.fillColor} stroke={stroke} strokeWidth={sw} />
      break
    }
    case 'circle':
      shape = (
        <ellipse
          cx={cx} cy={cy}
          rx={node.width / 2} ry={node.height / 2}
          fill={node.fillColor} stroke={stroke} strokeWidth={sw}
        />
      )
      break
    case 'parallelogram': {
      const skew = 20
      const pts = [
        `${node.x + skew},${node.y}`,
        `${node.x + node.width},${node.y}`,
        `${node.x + node.width - skew},${node.y + node.height}`,
        `${node.x},${node.y + node.height}`,
      ].join(' ')
      shape = <polygon points={pts} fill={node.fillColor} stroke={stroke} strokeWidth={sw} />
      break
    }
    default:
      shape = (
        <rect
          x={node.x} y={node.y} width={node.width} height={node.height}
          fill={node.fillColor} stroke={stroke} strokeWidth={sw}
        />
      )
  }

  const lines = node.label.split('\n')
  const lineH = 18
  const totalH = lines.length * lineH
  const startY = cy - totalH / 2 + lineH / 2

  return (
    <g style={{ cursor: 'pointer' }}>
      {shape}
      {lines.map((line, i) => (
        <text
          key={i}
          x={cx}
          y={startY + i * lineH}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="13"
          fill={node.textColor}
          fontFamily="sans-serif"
          fontWeight="500"
        >
          {line}
        </text>
      ))}
    </g>
  )
}

function EdgeLine({ edge, nodes }: { edge: DiagramEdge; nodes: DiagramNode[] }) {
  const from = nodes.find((n) => n.id === edge.fromId)
  const to = nodes.find((n) => n.id === edge.toId)
  if (!from || !to) return null

  const x1 = from.x + from.width / 2
  const y1 = from.y + from.height / 2
  const x2 = to.x + to.width / 2
  const y2 = to.y + to.height / 2

  // Clamp to node edges
  const clipToNode = (nx: number, ny: number, nw: number, nh: number, tx: number, ty: number) => {
    const dx = tx - (nx + nw / 2)
    const dy = ty - (ny + nh / 2)
    const scaleX = dx !== 0 ? (nw / 2) / Math.abs(dx) : Infinity
    const scaleY = dy !== 0 ? (nh / 2) / Math.abs(dy) : Infinity
    const scale = Math.min(scaleX, scaleY)
    return { x: nx + nw / 2 + dx * scale, y: ny + nh / 2 + dy * scale }
  }

  const p1 = clipToNode(from.x, from.y, from.width, from.height, x2, y2)
  const p2 = clipToNode(to.x, to.y, to.width, to.height, x1, y1)

  const mx = (p1.x + p2.x) / 2
  const my = (p1.y + p2.y) / 2

  return (
    <g>
      <defs>
        <marker id={`arrow-${edge.id}`} viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="8" markerHeight="8" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#666" />
        </marker>
      </defs>
      <line
        x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
        stroke="#666" strokeWidth="2"
        strokeDasharray={edge.style === 'dashed' ? '6,4' : undefined}
        markerEnd={edge.arrowEnd ? `url(#arrow-${edge.id})` : undefined}
        markerStart={edge.arrowStart ? `url(#arrow-${edge.id})` : undefined}
      />
      {edge.label && (
        <text x={mx} y={my - 8} textAnchor="middle" fontSize="12" fill="#555" fontFamily="sans-serif">
          {edge.label}
        </text>
      )}
    </g>
  )
}

export function DiagramCanvas({ diagram, selectedNodeId, onNodeClick }: Props) {
  return (
    <svg
      viewBox={`0 0 ${diagram.width} ${diagram.height}`}
      width={diagram.width}
      height={diagram.height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <rect width={diagram.width} height={diagram.height} fill={diagram.backgroundColor} />

      {diagram.edges.map((edge) => (
        <EdgeLine key={edge.id} edge={edge} nodes={diagram.nodes} />
      ))}

      {diagram.nodes.map((node) => (
        <g key={node.id} onClick={() => onNodeClick?.(node.id)}>
          <NodeShape node={node} selected={node.id === selectedNodeId} />
        </g>
      ))}
    </svg>
  )
}
