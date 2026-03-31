import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useStore } from '../store'
import { CharacterSVG } from './CharacterSVG'
import type { Character, SkinColor } from '../types'

const SKIN_COLORS: SkinColor[] = ['#FFECD2', '#FDDBB4', '#F0C27F', '#C68642', '#8D5524']
const HAIR_COLORS = ['#1a0800', '#3d1c00', '#6b3a2a', '#a0522d', '#c8a56b', '#f5d06e', '#e8b4b8', '#c47ac0', '#5b8fe8', '#4caf93', '#e84c4c', '#ffffff']
const EYE_COLORS = ['#2c1810', '#3d2b1f', '#5c3d2e', '#7b5e3d', '#5c8a5c', '#4a7ab5', '#7a5cb5', '#333333']
const OUTFIT_COLORS = ['#3a5a8c', '#8c3a3a', '#3a8c5a', '#8c7a3a', '#7a3a8c', '#555555', '#e8b4b8', '#4a90d9', '#f5a623', '#ffffff']

const defaultChar: Omit<Character, 'id' | 'createdAt'> = {
  name: '新しいキャラ',
  skinColor: '#FDDBB4',
  hairColor: '#1a0800',
  eyeColor: '#2c1810',
  hairStyle: 'short',
  outfitColor: '#3a5a8c',
  outfitStyle: 'casual',
}

export function CharacterEditor() {
  const { characters, addCharacter, updateCharacter, deleteCharacter } = useStore()
  const [editing, setEditing] = useState<Character | Omit<Character, 'id' | 'createdAt'> | null>(null)
  const [isNew, setIsNew] = useState(false)

  const startNew = () => {
    setEditing({ ...defaultChar })
    setIsNew(true)
  }

  const startEdit = (c: Character) => {
    setEditing({ ...c })
    setIsNew(false)
  }

  const save = () => {
    if (!editing) return
    if (isNew) {
      addCharacter(editing as Omit<Character, 'id' | 'createdAt'>)
    } else {
      const c = editing as Character
      updateCharacter(c.id, c)
    }
    setEditing(null)
  }

  const previewChar: Character = editing
    ? { id: 'preview', createdAt: 0, ...(editing as Omit<Character, 'id' | 'createdAt'>) }
    : ({ id: 'preview', createdAt: 0, ...defaultChar } as Character)

  return (
    <div className="character-editor">
      <div className="section-header">
        <h2>キャラクター管理</h2>
        <button className="btn-primary" onClick={startNew}>＋ 新規作成</button>
      </div>

      {editing && (
        <div className="edit-panel">
          <div className="edit-preview">
            <CharacterSVG character={previewChar} expression="normal" width={160} height={240} />
          </div>
          <div className="edit-form">
            <label>
              名前
              <input
                type="text"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </label>

            <label>
              肌の色
              <div className="color-swatches">
                {SKIN_COLORS.map((c) => (
                  <button
                    key={c}
                    className={`swatch ${editing.skinColor === c ? 'selected' : ''}`}
                    style={{ background: c }}
                    onClick={() => setEditing({ ...editing, skinColor: c })}
                  />
                ))}
              </div>
            </label>

            <label>
              髪の色
              <div className="color-swatches">
                {HAIR_COLORS.map((c) => (
                  <button
                    key={c}
                    className={`swatch ${editing.hairColor === c ? 'selected' : ''}`}
                    style={{ background: c, border: c === '#ffffff' ? '2px solid #ccc' : undefined }}
                    onClick={() => setEditing({ ...editing, hairColor: c })}
                  />
                ))}
              </div>
            </label>

            <label>
              髪型
              <select
                value={editing.hairStyle}
                onChange={(e) => setEditing({ ...editing, hairStyle: e.target.value as Character['hairStyle'] })}
              >
                <option value="short">ショート</option>
                <option value="long">ロング</option>
                <option value="bun">お団子</option>
                <option value="spiky">ツンツン</option>
              </select>
            </label>

            <label>
              瞳の色
              <div className="color-swatches">
                {EYE_COLORS.map((c) => (
                  <button
                    key={c}
                    className={`swatch ${editing.eyeColor === c ? 'selected' : ''}`}
                    style={{ background: c }}
                    onClick={() => setEditing({ ...editing, eyeColor: c })}
                  />
                ))}
              </div>
            </label>

            <label>
              服の色
              <div className="color-swatches">
                {OUTFIT_COLORS.map((c) => (
                  <button
                    key={c}
                    className={`swatch ${editing.outfitColor === c ? 'selected' : ''}`}
                    style={{ background: c, border: c === '#ffffff' ? '2px solid #ccc' : undefined }}
                    onClick={() => setEditing({ ...editing, outfitColor: c })}
                  />
                ))}
              </div>
            </label>

            <label>
              服のスタイル
              <select
                value={editing.outfitStyle}
                onChange={(e) => setEditing({ ...editing, outfitStyle: e.target.value as Character['outfitStyle'] })}
              >
                <option value="casual">カジュアル</option>
                <option value="formal">フォーマル</option>
                <option value="uniform">制服</option>
              </select>
            </label>

            <div className="edit-actions">
              <button className="btn-primary" onClick={save}>保存</button>
              <button className="btn-secondary" onClick={() => setEditing(null)}>キャンセル</button>
            </div>
          </div>
        </div>
      )}

      <div className="character-grid">
        {characters.map((c) => (
          <div key={c.id} className="character-card">
            <CharacterSVG character={c} expression="happy" width={100} height={150} />
            <div className="character-name">{c.name}</div>
            <div className="card-actions">
              <button className="btn-small" onClick={() => startEdit(c)}>編集</button>
              <button className="btn-small btn-danger" onClick={() => deleteCharacter(c.id)}>削除</button>
            </div>
          </div>
        ))}
        {characters.length === 0 && !editing && (
          <p className="empty-hint">キャラクターがまだいません。「新規作成」から追加しましょう。</p>
        )}
      </div>
    </div>
  )
}
