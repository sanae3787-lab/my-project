import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useStore } from '../store'
import { SceneCanvas } from './SceneCanvas'
import type { Scene, SceneCharacter, SceneText, CharacterExpression, BubbleStyle } from '../types'

const EXPRESSIONS: CharacterExpression[] = ['normal', 'happy', 'surprised', 'sad', 'angry', 'thinking']
const EXPRESSION_LABELS: Record<CharacterExpression, string> = {
  normal: '普通', happy: '笑顔', surprised: 'びっくり', sad: '悲しい', angry: '怒り', thinking: '考え中'
}
const BUBBLE_STYLES: BubbleStyle[] = ['speech', 'thought', 'shout', 'none']
const BUBBLE_LABELS: Record<BubbleStyle, string> = {
  speech: '吹き出し', thought: '考え泡', shout: '叫び', none: 'なし'
}
const BACKGROUNDS: Scene['background'][] = ['white', 'grid', 'dots', 'classroom', 'office', 'outdoor']
const BG_LABELS: Record<Scene['background'], string> = {
  white: '白', grid: 'グリッド', dots: 'ドット', classroom: '教室', office: 'オフィス', outdoor: '屋外'
}

const defaultScene: Omit<Scene, 'id' | 'createdAt'> = {
  name: '新しいシーン',
  width: 600,
  height: 400,
  background: 'white',
  backgroundColor: '#ffffff',
  characters: [],
  texts: [],
}

export function SceneEditor() {
  const { scenes, characters, addScene, updateScene, deleteScene,
    addCharacterToScene, updateSceneCharacter, removeCharacterFromScene,
    addTextToScene, updateSceneText, removeTextFromScene } = useStore()

  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null)
  const [selectedCharIdx, setSelectedCharIdx] = useState<number | null>(null)
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null)
  const [tab, setTab] = useState<'characters' | 'texts' | 'settings'>('characters')

  const selectedScene = scenes.find((s) => s.id === selectedSceneId) ?? null
  const selectedChar = selectedScene && selectedCharIdx !== null
    ? selectedScene.characters[selectedCharIdx] : null
  const selectedText = selectedScene && selectedTextId
    ? selectedScene.texts.find((t) => t.id === selectedTextId) : null

  const createScene = () => {
    const id = addScene({ ...defaultScene })
    setSelectedSceneId(id)
  }

  const addChar = (charId: string) => {
    if (!selectedSceneId || !selectedScene) return
    const sc: SceneCharacter = {
      characterId: charId,
      x: 80,
      y: 180,
      scale: 1,
      expression: 'normal',
      flipX: false,
      bubbleText: '',
      bubbleStyle: 'speech',
    }
    addCharacterToScene(selectedScene.id, sc)
  }

  const addText = () => {
    if (!selectedSceneId || !selectedScene) return
    const text: SceneText = {
      id: uuidv4(),
      text: 'テキスト',
      x: 50,
      y: 50,
      fontSize: 20,
      color: '#333333',
      bold: false,
    }
    addTextToScene(selectedScene.id, text)
  }

  return (
    <div className="scene-editor">
      <div className="section-header">
        <h2>シーン作成</h2>
        <button className="btn-primary" onClick={createScene}>＋ 新規シーン</button>
      </div>

      <div className="scene-layout">
        {/* Scene list */}
        <div className="scene-list">
          {scenes.map((s) => (
            <div
              key={s.id}
              className={`scene-item ${s.id === selectedSceneId ? 'selected' : ''}`}
              onClick={() => { setSelectedSceneId(s.id); setSelectedCharIdx(null); setSelectedTextId(null) }}
            >
              <span>{s.name}</span>
              <button className="btn-small btn-danger" onClick={(e) => { e.stopPropagation(); deleteScene(s.id); if (selectedSceneId === s.id) setSelectedSceneId(null) }}>削除</button>
            </div>
          ))}
          {scenes.length === 0 && <p className="empty-hint">シーンがありません</p>}
        </div>

        {selectedScene && (
          <div className="scene-main">
            {/* Canvas */}
            <div className="canvas-wrapper">
              <SceneCanvas scene={selectedScene} />
            </div>

            {/* Controls */}
            <div className="scene-controls">
              <div className="tab-bar">
                {(['characters', 'texts', 'settings'] as const).map((t) => (
                  <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                    {t === 'characters' ? 'キャラ' : t === 'texts' ? 'テキスト' : '設定'}
                  </button>
                ))}
              </div>

              {tab === 'characters' && (
                <div className="tab-content">
                  <div className="control-row">
                    <span>キャラを追加:</span>
                    <select onChange={(e) => { if (e.target.value) addChar(e.target.value); e.target.value = '' }} defaultValue="">
                      <option value="">選択...</option>
                      {characters.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="placed-chars">
                    {selectedScene.characters.map((sc, i) => {
                      const char = characters.find((c) => c.id === sc.characterId)
                      return (
                        <div key={i} className={`placed-char ${selectedCharIdx === i ? 'selected' : ''}`} onClick={() => setSelectedCharIdx(i)}>
                          <span>{char?.name ?? '?'}</span>
                          <button className="btn-small btn-danger" onClick={(e) => { e.stopPropagation(); removeCharacterFromScene(selectedScene.id, i); if (selectedCharIdx === i) setSelectedCharIdx(null) }}>✕</button>
                        </div>
                      )
                    })}
                  </div>

                  {selectedChar !== null && selectedCharIdx !== null && (
                    <div className="char-props">
                      <label>
                        X位置
                        <input type="range" min="0" max={selectedScene.width - 120} value={selectedChar.x}
                          onChange={(e) => updateSceneCharacter(selectedScene.id, selectedCharIdx, { x: +e.target.value })} />
                        <span>{selectedChar.x}</span>
                      </label>
                      <label>
                        Y位置
                        <input type="range" min="0" max={selectedScene.height - 180} value={selectedChar.y}
                          onChange={(e) => updateSceneCharacter(selectedScene.id, selectedCharIdx, { y: +e.target.value })} />
                        <span>{selectedChar.y}</span>
                      </label>
                      <label>
                        大きさ
                        <input type="range" min="0.5" max="2" step="0.1" value={selectedChar.scale}
                          onChange={(e) => updateSceneCharacter(selectedScene.id, selectedCharIdx, { scale: +e.target.value })} />
                        <span>{selectedChar.scale.toFixed(1)}</span>
                      </label>
                      <label>
                        表情
                        <select value={selectedChar.expression}
                          onChange={(e) => updateSceneCharacter(selectedScene.id, selectedCharIdx, { expression: e.target.value as CharacterExpression })}>
                          {EXPRESSIONS.map((ex) => <option key={ex} value={ex}>{EXPRESSION_LABELS[ex]}</option>)}
                        </select>
                      </label>
                      <label>
                        <input type="checkbox" checked={selectedChar.flipX}
                          onChange={(e) => updateSceneCharacter(selectedScene.id, selectedCharIdx, { flipX: e.target.checked })} />
                        左右反転
                      </label>
                      <label>
                        吹き出しスタイル
                        <select value={selectedChar.bubbleStyle}
                          onChange={(e) => updateSceneCharacter(selectedScene.id, selectedCharIdx, { bubbleStyle: e.target.value as BubbleStyle })}>
                          {BUBBLE_STYLES.map((bs) => <option key={bs} value={bs}>{BUBBLE_LABELS[bs]}</option>)}
                        </select>
                      </label>
                      <label>
                        セリフ
                        <textarea rows={2} value={selectedChar.bubbleText}
                          onChange={(e) => updateSceneCharacter(selectedScene.id, selectedCharIdx, { bubbleText: e.target.value })}
                          placeholder="セリフを入力..." />
                      </label>
                    </div>
                  )}
                </div>
              )}

              {tab === 'texts' && (
                <div className="tab-content">
                  <button className="btn-primary" onClick={addText}>＋ テキスト追加</button>
                  <div className="placed-chars">
                    {selectedScene.texts.map((t) => (
                      <div key={t.id} className={`placed-char ${selectedTextId === t.id ? 'selected' : ''}`} onClick={() => setSelectedTextId(t.id)}>
                        <span>{t.text.slice(0, 20)}</span>
                        <button className="btn-small btn-danger" onClick={(e) => { e.stopPropagation(); removeTextFromScene(selectedScene.id, t.id); if (selectedTextId === t.id) setSelectedTextId(null) }}>✕</button>
                      </div>
                    ))}
                  </div>

                  {selectedText && selectedTextId && (
                    <div className="char-props">
                      <label>
                        テキスト
                        <input type="text" value={selectedText.text}
                          onChange={(e) => updateSceneText(selectedScene.id, selectedTextId, { text: e.target.value })} />
                      </label>
                      <label>
                        X位置
                        <input type="range" min="0" max={selectedScene.width} value={selectedText.x}
                          onChange={(e) => updateSceneText(selectedScene.id, selectedTextId, { x: +e.target.value })} />
                        <span>{selectedText.x}</span>
                      </label>
                      <label>
                        Y位置
                        <input type="range" min="0" max={selectedScene.height} value={selectedText.y}
                          onChange={(e) => updateSceneText(selectedScene.id, selectedTextId, { y: +e.target.value })} />
                        <span>{selectedText.y}</span>
                      </label>
                      <label>
                        文字サイズ
                        <input type="range" min="10" max="60" value={selectedText.fontSize}
                          onChange={(e) => updateSceneText(selectedScene.id, selectedTextId, { fontSize: +e.target.value })} />
                        <span>{selectedText.fontSize}px</span>
                      </label>
                      <label>
                        色
                        <input type="color" value={selectedText.color}
                          onChange={(e) => updateSceneText(selectedScene.id, selectedTextId, { color: e.target.value })} />
                      </label>
                      <label>
                        <input type="checkbox" checked={selectedText.bold}
                          onChange={(e) => updateSceneText(selectedScene.id, selectedTextId, { bold: e.target.checked })} />
                        太字
                      </label>
                    </div>
                  )}
                </div>
              )}

              {tab === 'settings' && (
                <div className="tab-content">
                  <label>
                    シーン名
                    <input type="text" value={selectedScene.name}
                      onChange={(e) => updateScene(selectedScene.id, { name: e.target.value })} />
                  </label>
                  <label>
                    幅
                    <input type="number" value={selectedScene.width} min={200} max={1200} step={50}
                      onChange={(e) => updateScene(selectedScene.id, { width: +e.target.value })} />
                  </label>
                  <label>
                    高さ
                    <input type="number" value={selectedScene.height} min={150} max={900} step={50}
                      onChange={(e) => updateScene(selectedScene.id, { height: +e.target.value })} />
                  </label>
                  <label>
                    背景
                    <select value={selectedScene.background}
                      onChange={(e) => updateScene(selectedScene.id, { background: e.target.value as Scene['background'] })}>
                      {BACKGROUNDS.map((bg) => <option key={bg} value={bg}>{BG_LABELS[bg]}</option>)}
                    </select>
                  </label>
                  <label>
                    背景色
                    <input type="color" value={selectedScene.backgroundColor}
                      onChange={(e) => updateScene(selectedScene.id, { backgroundColor: e.target.value })} />
                  </label>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
