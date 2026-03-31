import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { Character, Scene, Diagram, SceneCharacter, SceneText, DiagramNode, DiagramEdge } from '../types'

interface AppStore {
  // Characters
  characters: Character[]
  addCharacter: (char: Omit<Character, 'id' | 'createdAt'>) => string
  updateCharacter: (id: string, char: Partial<Character>) => void
  deleteCharacter: (id: string) => void

  // Scenes
  scenes: Scene[]
  addScene: (scene: Omit<Scene, 'id' | 'createdAt'>) => string
  updateScene: (id: string, scene: Partial<Scene>) => void
  deleteScene: (id: string) => void
  addCharacterToScene: (sceneId: string, sc: SceneCharacter) => void
  updateSceneCharacter: (sceneId: string, index: number, sc: Partial<SceneCharacter>) => void
  removeCharacterFromScene: (sceneId: string, index: number) => void
  addTextToScene: (sceneId: string, text: SceneText) => void
  updateSceneText: (sceneId: string, textId: string, text: Partial<SceneText>) => void
  removeTextFromScene: (sceneId: string, textId: string) => void

  // Diagrams
  diagrams: Diagram[]
  addDiagram: (diag: Omit<Diagram, 'id' | 'createdAt'>) => string
  updateDiagram: (id: string, diag: Partial<Diagram>) => void
  deleteDiagram: (id: string) => void
  addNode: (diagId: string, node: DiagramNode) => void
  updateNode: (diagId: string, nodeId: string, node: Partial<DiagramNode>) => void
  deleteNode: (diagId: string, nodeId: string) => void
  addEdge: (diagId: string, edge: DiagramEdge) => void
  updateEdge: (diagId: string, edgeId: string, edge: Partial<DiagramEdge>) => void
  deleteEdge: (diagId: string, edgeId: string) => void
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      characters: [],
      addCharacter: (char) => {
        const id = uuidv4()
        set((s) => ({ characters: [...s.characters, { ...char, id, createdAt: Date.now() }] }))
        return id
      },
      updateCharacter: (id, char) =>
        set((s) => ({ characters: s.characters.map((c) => (c.id === id ? { ...c, ...char } : c)) })),
      deleteCharacter: (id) =>
        set((s) => ({ characters: s.characters.filter((c) => c.id !== id) })),

      scenes: [],
      addScene: (scene) => {
        const id = uuidv4()
        set((s) => ({ scenes: [...s.scenes, { ...scene, id, createdAt: Date.now() }] }))
        return id
      },
      updateScene: (id, scene) =>
        set((s) => ({ scenes: s.scenes.map((sc) => (sc.id === id ? { ...sc, ...scene } : sc)) })),
      deleteScene: (id) =>
        set((s) => ({ scenes: s.scenes.filter((sc) => sc.id !== id) })),
      addCharacterToScene: (sceneId, sc) =>
        set((s) => ({
          scenes: s.scenes.map((scene) =>
            scene.id === sceneId
              ? { ...scene, characters: [...scene.characters, sc] }
              : scene
          ),
        })),
      updateSceneCharacter: (sceneId, index, sc) =>
        set((s) => ({
          scenes: s.scenes.map((scene) =>
            scene.id === sceneId
              ? {
                  ...scene,
                  characters: scene.characters.map((c, i) =>
                    i === index ? { ...c, ...sc } : c
                  ),
                }
              : scene
          ),
        })),
      removeCharacterFromScene: (sceneId, index) =>
        set((s) => ({
          scenes: s.scenes.map((scene) =>
            scene.id === sceneId
              ? { ...scene, characters: scene.characters.filter((_, i) => i !== index) }
              : scene
          ),
        })),
      addTextToScene: (sceneId, text) =>
        set((s) => ({
          scenes: s.scenes.map((scene) =>
            scene.id === sceneId
              ? { ...scene, texts: [...scene.texts, text] }
              : scene
          ),
        })),
      updateSceneText: (sceneId, textId, text) =>
        set((s) => ({
          scenes: s.scenes.map((scene) =>
            scene.id === sceneId
              ? {
                  ...scene,
                  texts: scene.texts.map((t) => (t.id === textId ? { ...t, ...text } : t)),
                }
              : scene
          ),
        })),
      removeTextFromScene: (sceneId, textId) =>
        set((s) => ({
          scenes: s.scenes.map((scene) =>
            scene.id === sceneId
              ? { ...scene, texts: scene.texts.filter((t) => t.id !== textId) }
              : scene
          ),
        })),

      diagrams: [],
      addDiagram: (diag) => {
        const id = uuidv4()
        set((s) => ({ diagrams: [...s.diagrams, { ...diag, id, createdAt: Date.now() }] }))
        return id
      },
      updateDiagram: (id, diag) =>
        set((s) => ({ diagrams: s.diagrams.map((d) => (d.id === id ? { ...d, ...diag } : d)) })),
      deleteDiagram: (id) =>
        set((s) => ({ diagrams: s.diagrams.filter((d) => d.id !== id) })),
      addNode: (diagId, node) =>
        set((s) => ({
          diagrams: s.diagrams.map((d) =>
            d.id === diagId ? { ...d, nodes: [...d.nodes, node] } : d
          ),
        })),
      updateNode: (diagId, nodeId, node) =>
        set((s) => ({
          diagrams: s.diagrams.map((d) =>
            d.id === diagId
              ? { ...d, nodes: d.nodes.map((n) => (n.id === nodeId ? { ...n, ...node } : n)) }
              : d
          ),
        })),
      deleteNode: (diagId, nodeId) =>
        set((s) => ({
          diagrams: s.diagrams.map((d) =>
            d.id === diagId
              ? {
                  ...d,
                  nodes: d.nodes.filter((n) => n.id !== nodeId),
                  edges: d.edges.filter((e) => e.fromId !== nodeId && e.toId !== nodeId),
                }
              : d
          ),
        })),
      addEdge: (diagId, edge) =>
        set((s) => ({
          diagrams: s.diagrams.map((d) =>
            d.id === diagId ? { ...d, edges: [...d.edges, edge] } : d
          ),
        })),
      updateEdge: (diagId, edgeId, edge) =>
        set((s) => ({
          diagrams: s.diagrams.map((d) =>
            d.id === diagId
              ? { ...d, edges: d.edges.map((e) => (e.id === edgeId ? { ...e, ...edge } : e)) }
              : d
          ),
        })),
      deleteEdge: (diagId, edgeId) =>
        set((s) => ({
          diagrams: s.diagrams.map((d) =>
            d.id === diagId
              ? { ...d, edges: d.edges.filter((e) => e.id !== edgeId) }
              : d
          ),
        })),
    }),
    { name: 'illust-app-store' }
  )
)
