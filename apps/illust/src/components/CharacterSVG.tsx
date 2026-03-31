import type { Character, CharacterExpression } from '../types'

interface Props {
  character: Character
  expression: CharacterExpression
  width?: number
  height?: number
  flipX?: boolean
}

function getEyeShape(expression: CharacterExpression, cx: number, cy: number, eyeColor: string) {
  switch (expression) {
    case 'happy':
      return (
        <path
          d={`M${cx - 6},${cy} Q${cx},${cy - 8} ${cx + 6},${cy}`}
          stroke={eyeColor}
          strokeWidth="2"
          fill="none"
        />
      )
    case 'sad':
      return (
        <path
          d={`M${cx - 6},${cy - 4} Q${cx},${cy + 2} ${cx + 6},${cy - 4}`}
          stroke={eyeColor}
          strokeWidth="2"
          fill="none"
        />
      )
    case 'surprised':
      return <ellipse cx={cx} cy={cy} rx={6} ry={7} fill={eyeColor} />
    case 'angry':
      return (
        <>
          <ellipse cx={cx} cy={cy} rx={5} ry={4} fill={eyeColor} />
          <line x1={cx - 7} y1={cy - 7} x2={cx + 5} y2={cy - 2} stroke="#333" strokeWidth="2" />
        </>
      )
    case 'thinking':
      return (
        <>
          <ellipse cx={cx} cy={cy} rx={5} ry={4} fill={eyeColor} />
          <ellipse cx={cx + 1} cy={cy - 1} rx={2} ry={1.5} fill="white" />
        </>
      )
    default:
      return <ellipse cx={cx} cy={cy} rx={5} ry={5} fill={eyeColor} />
  }
}

function getMouthShape(expression: CharacterExpression, cx: number, cy: number) {
  switch (expression) {
    case 'happy':
      return (
        <path
          d={`M${cx - 10},${cy} Q${cx},${cy + 12} ${cx + 10},${cy}`}
          stroke="#c0605a"
          strokeWidth="2"
          fill="#f88a84"
        />
      )
    case 'sad':
      return (
        <path
          d={`M${cx - 10},${cy + 6} Q${cx},${cy - 4} ${cx + 10},${cy + 6}`}
          stroke="#c0605a"
          strokeWidth="2"
          fill="#f88a84"
        />
      )
    case 'surprised':
      return <ellipse cx={cx} cy={cy + 4} rx={8} ry={10} fill="#c0605a" />
    case 'angry':
      return (
        <path
          d={`M${cx - 10},${cy + 4} Q${cx},${cy - 4} ${cx + 10},${cy + 4}`}
          stroke="#c0605a"
          strokeWidth="2"
          fill="#f88a84"
        />
      )
    case 'thinking':
      return (
        <path
          d={`M${cx - 6},${cy + 2} Q${cx + 2},${cy} ${cx + 8},${cy + 4}`}
          stroke="#c0605a"
          strokeWidth="2"
          fill="none"
        />
      )
    default:
      return (
        <path
          d={`M${cx - 8},${cy} Q${cx},${cy + 6} ${cx + 8},${cy}`}
          stroke="#c0605a"
          strokeWidth="2"
          fill="#f88a84"
        />
      )
  }
}

function getHair(style: Character['hairStyle'], hairColor: string) {
  switch (style) {
    case 'long':
      return (
        <>
          <ellipse cx="100" cy="68" rx="52" ry="44" fill={hairColor} />
          <rect x="48" y="80" width="20" height="100" rx="10" fill={hairColor} />
          <rect x="132" y="80" width="20" height="100" rx="10" fill={hairColor} />
        </>
      )
    case 'bun':
      return (
        <>
          <ellipse cx="100" cy="68" rx="52" ry="44" fill={hairColor} />
          <circle cx="100" cy="32" r="18" fill={hairColor} />
          <circle cx="100" cy="30" r="14" fill={hairColor} />
        </>
      )
    case 'spiky':
      return (
        <>
          <ellipse cx="100" cy="68" rx="52" ry="44" fill={hairColor} />
          <polygon points="65,55 58,20 75,45" fill={hairColor} />
          <polygon points="80,45 78,10 92,40" fill={hairColor} />
          <polygon points="100,42 100,5 113,40" fill={hairColor} />
          <polygon points="120,45 122,10 135,43" fill={hairColor} />
          <polygon points="135,55 142,20 148,50" fill={hairColor} />
        </>
      )
    default: // short
      return (
        <>
          <ellipse cx="100" cy="68" rx="52" ry="44" fill={hairColor} />
          <rect x="48" y="68" width="20" height="30" rx="10" fill={hairColor} />
          <rect x="132" y="68" width="20" height="30" rx="10" fill={hairColor} />
        </>
      )
  }
}

function getOutfit(style: Character['outfitStyle'], color: string) {
  switch (style) {
    case 'formal':
      return (
        <>
          <path d="M60,185 L40,280 L160,280 L140,185" fill={color} />
          <path d="M85,185 L100,220 L115,185" fill="white" />
          <line x1="100" y1="220" x2="100" y2="280" stroke="#666" strokeWidth="2" />
          <rect x="90" y="225" width="20" height="8" rx="2" fill="#cc4444" />
        </>
      )
    case 'uniform':
      return (
        <>
          <path d="M60,185 L40,280 L160,280 L140,185" fill={color} />
          <rect x="75" y="185" width="50" height="10" fill="white" />
          <line x1="60" y1="195" x2="140" y2="195" stroke="white" strokeWidth="2" />
        </>
      )
    default: // casual
      return <path d="M60,185 L40,280 L160,280 L140,185" fill={color} />
  }
}

export function CharacterSVG({ character, expression, width = 200, height = 300, flipX = false }: Props) {
  const transform = flipX ? `scale(-1,1) translate(-200,0)` : undefined

  return (
    <svg
      viewBox="0 0 200 300"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform={transform}>
        {/* Body */}
        <ellipse cx="100" cy="240" rx="50" ry="40" fill={character.skinColor} />
        {getOutfit(character.outfitStyle, character.outfitColor)}

        {/* Neck */}
        <rect x="88" y="160" width="24" height="30" rx="5" fill={character.skinColor} />

        {/* Hair back */}
        {getHair(character.hairStyle, character.hairColor)}

        {/* Face */}
        <ellipse cx="100" cy="105" rx="48" ry="52" fill={character.skinColor} />

        {/* Ears */}
        <ellipse cx="52" cy="110" rx="10" ry="13" fill={character.skinColor} />
        <ellipse cx="148" cy="110" rx="10" ry="13" fill={character.skinColor} />

        {/* Eyes */}
        {getEyeShape(expression, 80, 105, character.eyeColor)}
        {getEyeShape(expression, 120, 105, character.eyeColor)}

        {/* Eye whites for default/thinking/surprised */}
        {(expression === 'normal' || expression === 'thinking') && (
          <>
            <ellipse cx="80" cy="103" rx="2" ry="2.5" fill="white" />
            <ellipse cx="120" cy="103" rx="2" ry="2.5" fill="white" />
          </>
        )}

        {/* Nose */}
        <path
          d="M97,120 Q100,128 103,120"
          stroke="#c4906a"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Blush */}
        {(expression === 'happy' || expression === 'surprised') && (
          <>
            <ellipse cx="68" cy="118" rx="10" ry="6" fill="#ffb3b3" opacity="0.5" />
            <ellipse cx="132" cy="118" rx="10" ry="6" fill="#ffb3b3" opacity="0.5" />
          </>
        )}

        {/* Mouth */}
        {getMouthShape(expression, 100, 135)}

        {/* Arms */}
        <ellipse cx="45" cy="215" rx="14" ry="35" fill={character.outfitColor} transform="rotate(-15,45,215)" />
        <ellipse cx="155" cy="215" rx="14" ry="35" fill={character.outfitColor} transform="rotate(15,155,215)" />

        {/* Hands */}
        <circle cx="38" cy="248" r="12" fill={character.skinColor} />
        <circle cx="162" cy="248" r="12" fill={character.skinColor} />

        {/* Legs */}
        <rect x="72" y="270" width="22" height="28" rx="8" fill="#555" />
        <rect x="106" y="270" width="22" height="28" rx="8" fill="#555" />
      </g>
    </svg>
  )
}
