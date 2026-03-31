import { useRef } from 'react'
import { toPng, toSvg } from 'html-to-image'
import { useStore } from '../store'
import { SceneCanvas } from './SceneCanvas'
import { DiagramCanvas } from './DiagramCanvas'

export function ExportPanel() {
  const { scenes, diagrams } = useStore()
  const canvasRef = useRef<HTMLDivElement>(null)

  const [selectedType, setSelectedType] = useStateLocal<'scene' | 'diagram'>('scene')
  const [selectedId, setSelectedId] = useStateLocal<string>('')

  const selectedScene = scenes.find((s) => s.id === selectedId)
  const selectedDiag = diagrams.find((d) => d.id === selectedId)

  const exportAs = async (format: 'png' | 'svg') => {
    const el = canvasRef.current
    if (!el) return
    const name = selectedScene?.name ?? selectedDiag?.name ?? 'export'
    try {
      const dataUrl = format === 'png'
        ? await toPng(el, { pixelRatio: 2, backgroundColor: '#ffffff' })
        : await toSvg(el)
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `${name}.${format}`
      a.click()
    } catch (e) {
      alert('書き出しに失敗しました')
      console.error(e)
    }
  }

  return (
    <div className="export-panel">
      <div className="section-header">
        <h2>書き出し</h2>
      </div>

      <div className="export-controls">
        <label>
          種類
          <select value={selectedType} onChange={(e) => { setSelectedType(e.target.value as 'scene' | 'diagram'); setSelectedId('') }}>
            <option value="scene">シーン（挿絵）</option>
            <option value="diagram">図解</option>
          </select>
        </label>

        <label>
          {selectedType === 'scene' ? 'シーン' : '図'}を選択
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            <option value="">選択してください...</option>
            {selectedType === 'scene'
              ? scenes.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)
              : diagrams.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)
            }
          </select>
        </label>

        {selectedId && (
          <div className="export-actions">
            <button className="btn-export" onClick={() => exportAs('png')}>PNG書き出し（note推奨）</button>
            <button className="btn-export btn-export-svg" onClick={() => exportAs('svg')}>SVG書き出し</button>
          </div>
        )}
      </div>

      {selectedId && (
        <div className="export-preview">
          <p className="hint">プレビュー（このまま書き出されます）</p>
          <div ref={canvasRef} style={{ display: 'inline-block' }}>
            {selectedScene && <SceneCanvas scene={selectedScene} />}
            {selectedDiag && <DiagramCanvas diagram={selectedDiag} />}
          </div>
        </div>
      )}

      {!selectedId && (
        <p className="empty-hint">書き出したいシーンまたは図を選択してください。<br />「シーン作成」「図解作成」タブで作成できます。</p>
      )}
    </div>
  )
}

// Simple local state helper inline
import { useState } from 'react'
function useStateLocal<T>(initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  return useState<T>(initial)
}
