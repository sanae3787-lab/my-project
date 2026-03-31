import type { Scene } from '../types'
import { useStore } from '../store'
import { CharacterSVG } from './CharacterSVG'
import { SpeechBubble } from './SpeechBubble'

interface Props {
  scene: Scene
}

function BackgroundPattern({ bg, width, height, color }: { bg: Scene['background']; width: number; height: number; color: string }) {
  switch (bg) {
    case 'grid':
      return (
        <>
          <rect width={width} height={height} fill={color} />
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#c8d8e8" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width={width} height={height} fill="url(#grid)" />
        </>
      )
    case 'dots':
      return (
        <>
          <rect width={width} height={height} fill={color} />
          <defs>
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="#b0c4d8" />
            </pattern>
          </defs>
          <rect width={width} height={height} fill="url(#dots)" />
        </>
      )
    case 'classroom':
      return (
        <>
          <rect width={width} height={height} fill="#e8f4e8" />
          <rect x="0" y={height * 0.65} width={width} height={height * 0.35} fill="#c8a46e" />
          <rect x="0" y={height * 0.62} width={width} height="8" fill="#a0825a" />
          <rect x="20" y="20" width={width * 0.55} height={height * 0.45} rx="4" fill="#2d6a2d" />
          <rect x="20" y="20" width={width * 0.55} height={height * 0.45} rx="4" fill="none" stroke="#1a4a1a" strokeWidth="4" />
        </>
      )
    case 'office':
      return (
        <>
          <rect width={width} height={height} fill="#f0f0f5" />
          <rect x="0" y={height * 0.7} width={width} height={height * 0.3} fill="#d4c4a8" />
          <rect x="30" y="30" width="80" height="100" rx="2" fill="#c8d8e8" stroke="#a0b0c0" strokeWidth="2" />
          <rect x="130" y="30" width="80" height="100" rx="2" fill="#c8d8e8" stroke="#a0b0c0" strokeWidth="2" />
        </>
      )
    case 'outdoor':
      return (
        <>
          <rect width={width} height={height} fill="#87ceeb" />
          <rect x="0" y={height * 0.6} width={width} height={height * 0.4} fill="#7ec850" />
          <circle cx={width * 0.85} cy="50" r="40" fill="#fff9c4" />
          <ellipse cx="60" cy="60" rx="50" ry="25" fill="white" opacity="0.8" />
          <ellipse cx="200" cy="40" rx="60" ry="22" fill="white" opacity="0.7" />
        </>
      )
    default:
      return <rect width={width} height={height} fill={color} />
  }
}

export function SceneCanvas({ scene }: Props) {
  const { characters } = useStore()

  return (
    <svg
      viewBox={`0 0 ${scene.width} ${scene.height}`}
      width={scene.width}
      height={scene.height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <BackgroundPattern bg={scene.background} width={scene.width} height={scene.height} color={scene.backgroundColor} />

      {scene.characters.map((sc, i) => {
        const char = characters.find((c) => c.id === sc.characterId)
        if (!char) return null
        const charW = 120 * sc.scale
        const charH = 180 * sc.scale

        // Bubble above character
        const bubbleW = 160
        const bubbleH = sc.bubbleText ? Math.max(50, sc.bubbleText.split('\n').length * 20 + 28) : 0
        const bubbleX = sc.x + charW / 2 - bubbleW / 2
        const bubbleY = sc.y - bubbleH - 24

        return (
          <g key={i}>
            {sc.bubbleText && sc.bubbleStyle !== 'none' && (
              <SpeechBubble
                text={sc.bubbleText}
                style={sc.bubbleStyle}
                x={bubbleX}
                y={bubbleY}
                width={bubbleW}
                tailSide="bottom"
              />
            )}
            <g transform={`translate(${sc.x},${sc.y}) scale(${sc.scale})`}>
              <CharacterSVG
                character={char}
                expression={sc.expression}
                width={120}
                height={180}
                flipX={sc.flipX}
              />
            </g>
          </g>
        )
      })}

      {scene.texts.map((t) => (
        <text
          key={t.id}
          x={t.x}
          y={t.y}
          fontSize={t.fontSize}
          fill={t.color}
          fontWeight={t.bold ? 'bold' : 'normal'}
          fontFamily="sans-serif"
        >
          {t.text}
        </text>
      ))}
    </svg>
  )
}
