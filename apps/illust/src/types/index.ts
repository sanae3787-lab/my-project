export type SkinColor = '#FDDBB4' | '#F0C27F' | '#C68642' | '#8D5524' | '#FFECD2'
export type HairColor = string
export type EyeColor = string

export type CharacterExpression = 'normal' | 'happy' | 'surprised' | 'sad' | 'angry' | 'thinking'

export interface Character {
  id: string
  name: string
  skinColor: SkinColor
  hairColor: HairColor
  eyeColor: EyeColor
  hairStyle: 'short' | 'long' | 'bun' | 'spiky'
  outfitColor: string
  outfitStyle: 'casual' | 'formal' | 'uniform'
  createdAt: number
}

export type BubbleStyle = 'speech' | 'thought' | 'shout' | 'none'
export type BackgroundStyle = 'white' | 'classroom' | 'office' | 'outdoor' | 'grid' | 'dots'

export interface SceneCharacter {
  characterId: string
  x: number
  y: number
  scale: number
  expression: CharacterExpression
  flipX: boolean
  bubbleText: string
  bubbleStyle: BubbleStyle
}

export interface Scene {
  id: string
  name: string
  width: number
  height: number
  background: BackgroundStyle
  backgroundColor: string
  characters: SceneCharacter[]
  texts: SceneText[]
  createdAt: number
}

export interface SceneText {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  color: string
  bold: boolean
}

// Diagram types
export type DiagramNodeShape = 'rect' | 'rounded' | 'diamond' | 'circle' | 'parallelogram'

export interface DiagramNode {
  id: string
  label: string
  x: number
  y: number
  width: number
  height: number
  shape: DiagramNodeShape
  fillColor: string
  textColor: string
  borderColor: string
}

export interface DiagramEdge {
  id: string
  fromId: string
  toId: string
  label: string
  style: 'solid' | 'dashed'
  arrowEnd: boolean
  arrowStart: boolean
}

export interface Diagram {
  id: string
  name: string
  width: number
  height: number
  backgroundColor: string
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  createdAt: number
}
