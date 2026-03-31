import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useStore } from '../store'
import { DiagramCanvas } from './DiagramCanvas'
import type { Diagram, DiagramNode, DiagramEdge } from '../types'

const NODE_SHAPES: DiagramNode['shape'][] = ['rect', 'rounded', 'diamond', 'circle', 'parallelogram']
const SHAPE_LABELS: Record<DiagramNode['shape'], string> = {
  rect: '四角', rounded: '角丸', diamond: 'ひし形', circle: '円', parallelogram: '平行四辺形'
}

const PRESET_COLORS = ['#dbeafe', '#fef9c3', '#dcfce7', '#fee2e2', '#f3e8ff', '#ffedd5', '#e0f2fe', '#ffffff']
const BORDER_COLORS = ['#3b82f6', '#eab308', '#22c55e', '#ef4444', '#a855f7', '#f97316', '#0ea5e9', '#666666']

const defaultDiagram: Omit<Diagram, 'id' | 'createdAt'> = {
  name: '新しい図',
  width: 600,
  height: 400,
  backgroundColor: '#ffffff',
  nodes: [],
  edges: [],
}

function makeNode(x: number, y: number): DiagramNode {
  return {
    id: uuidv4(),
    label: 'ノード',
    x,
    y,
    width: 120,
    height: 60,
    shape: 'rounded',
    fillColor: '#dbeafe',
    textColor: '#1e3a5f',
    borderColor: '#3b82f6',
  }
}

export function DiagramEditor() {
  const { diagrams, addDiagram, updateDiagram, deleteDiagram,
    addNode, updateNode, deleteNode, addEdge, updateEdge, deleteEdge } = useStore()

  const [selectedDiagId, setSelectedDiagId] = useState<string | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)
  const [connectFrom, setConnectFrom] = useState<string | null>(null)
  const [tab, setTab] = useState<'node' | 'edge' | 'settings'>('node')

  const selectedDiag = diagrams.find((d) => d.id === selectedDiagId) ?? null
  const selectedNode = selectedDiag?.nodes.find((n) => n.id === selectedNodeId) ?? null
  const selectedEdge = selectedDiag?.edges.find((e) => e.id === selectedEdgeId) ?? null

  const createDiagram = () => {
    const id = addDiagram({ ...defaultDiagram })
    setSelectedDiagId(id)
  }

  const handleAddNode = () => {
    if (!selectedDiagId) return
    const node = makeNode(60 + Math.random() * 200, 60 + Math.random() * 200)
    addNode(selectedDiagId, node)
    setSelectedNodeId(node.id)
  }

  const handleNodeClick = (id: string) => {
    if (connectFrom !== null) {
      if (connectFrom !== id && selectedDiagId && selectedDiag) {
        const edge: DiagramEdge = {
          id: uuidv4(),
          fromId: connectFrom,
          toId: id,
          label: '',
          style: 'solid',
          arrowEnd: true,
          arrowStart: false,
        }
        addEdge(selectedDiag.id, edge)
        setSelectedEdgeId(edge.id)
      }
      setConnectFrom(null)
    } else {
      setSelectedNodeId(id)
      setSelectedEdgeId(null)
    }
  }

  return (
    <div className="diagram-editor">
      <div className="section-header">
        <h2>図解作成</h2>
        <button className="btn-primary" onClick={createDiagram}>＋ 新規図</button>
      </div>

      <div className="scene-layout">
        <div className="scene-list">
          {diagrams.map((d) => (
            <div
              key={d.id}
              className={`scene-item ${d.id === selectedDiagId ? 'selected' : ''}`}
              onClick={() => { setSelectedDiagId(d.id); setSelectedNodeId(null); setSelectedEdgeId(null) }}
            >
              <span>{d.name}</span>
              <button className="btn-small btn-danger" onClick={(e) => { e.stopPropagation(); deleteDiagram(d.id); if (selectedDiagId === d.id) setSelectedDiagId(null) }}>削除</button>
            </div>
          ))}
          {diagrams.length === 0 && <p className="empty-hint">図がありません</p>}
        </div>

        {selectedDiag && (
          <div className="scene-main">
            <div className="canvas-wrapper">
              <DiagramCanvas
                diagram={selectedDiag}
                selectedNodeId={selectedNodeId}
                onNodeClick={handleNodeClick}
              />
              {connectFrom && (
                <div className="connect-hint">接続先ノードをクリック (ESCでキャンセル)</div>
              )}
            </div>

            <div className="scene-controls">
              <div className="tab-bar">
                {(['node', 'edge', 'settings'] as const).map((t) => (
                  <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                    {t === 'node' ? 'ノード' : t === 'edge' ? '矢印' : '設定'}
                  </button>
                ))}
              </div>

              {tab === 'node' && (
                <div className="tab-content">
                  <div className="control-row">
                    <button className="btn-primary" onClick={handleAddNode}>＋ ノード追加</button>
                    {selectedNodeId && (
                      <button className="btn-secondary"
                        onClick={() => setConnectFrom(connectFrom ? null : selectedNodeId)}
                        style={{ background: connectFrom ? '#fef3c7' : undefined }}>
                        {connectFrom ? '接続中...' : '矢印で接続'}
                      </button>
                    )}
                  </div>

                  <div className="placed-chars">
                    {selectedDiag.nodes.map((n) => (
                      <div key={n.id}
                        className={`placed-char ${selectedNodeId === n.id ? 'selected' : ''}`}
                        onClick={() => { setSelectedNodeId(n.id); setSelectedEdgeId(null) }}>
                        <span>{n.label.replace('\n', ' ').slice(0, 20)}</span>
                        <button className="btn-small btn-danger" onClick={(e) => { e.stopPropagation(); deleteNode(selectedDiag.id, n.id); if (selectedNodeId === n.id) setSelectedNodeId(null) }}>✕</button>
                      </div>
                    ))}
                  </div>

                  {selectedNode && selectedNodeId && (
                    <div className="char-props">
                      <label>
                        ラベル
                        <textarea rows={2} value={selectedNode.label}
                          onChange={(e) => updateNode(selectedDiag.id, selectedNodeId, { label: e.target.value })} />
                      </label>
                      <label>
                        形
                        <select value={selectedNode.shape}
                          onChange={(e) => updateNode(selectedDiag.id, selectedNodeId, { shape: e.target.value as DiagramNode['shape'] })}>
                          {NODE_SHAPES.map((s) => <option key={s} value={s}>{SHAPE_LABELS[s]}</option>)}
                        </select>
                      </label>
                      <label>
                        X位置
                        <input type="range" min="0" max={selectedDiag.width - 120} value={selectedNode.x}
                          onChange={(e) => updateNode(selectedDiag.id, selectedNodeId, { x: +e.target.value })} />
                        <span>{selectedNode.x}</span>
                      </label>
                      <label>
                        Y位置
                        <input type="range" min="0" max={selectedDiag.height - 60} value={selectedNode.y}
                          onChange={(e) => updateNode(selectedDiag.id, selectedNodeId, { y: +e.target.value })} />
                        <span>{selectedNode.y}</span>
                      </label>
                      <label>
                        幅
                        <input type="range" min="60" max="300" value={selectedNode.width}
                          onChange={(e) => updateNode(selectedDiag.id, selectedNodeId, { width: +e.target.value })} />
                        <span>{selectedNode.width}</span>
                      </label>
                      <label>
                        高さ
                        <input type="range" min="40" max="200" value={selectedNode.height}
                          onChange={(e) => updateNode(selectedDiag.id, selectedNodeId, { height: +e.target.value })} />
                        <span>{selectedNode.height}</span>
                      </label>
                      <label>
                        塗り色
                        <div className="color-swatches">
                          {PRESET_COLORS.map((c) => (
                            <button key={c} className={`swatch ${selectedNode.fillColor === c ? 'selected' : ''}`}
                              style={{ background: c, border: '1px solid #ccc' }}
                              onClick={() => updateNode(selectedDiag.id, selectedNodeId, { fillColor: c })} />
                          ))}
                          <input type="color" value={selectedNode.fillColor}
                            onChange={(e) => updateNode(selectedDiag.id, selectedNodeId, { fillColor: e.target.value })} />
                        </div>
                      </label>
                      <label>
                        枠線色
                        <div className="color-swatches">
                          {BORDER_COLORS.map((c) => (
                            <button key={c} className={`swatch ${selectedNode.borderColor === c ? 'selected' : ''}`}
                              style={{ background: c }}
                              onClick={() => updateNode(selectedDiag.id, selectedNodeId, { borderColor: c })} />
                          ))}
                          <input type="color" value={selectedNode.borderColor}
                            onChange={(e) => updateNode(selectedDiag.id, selectedNodeId, { borderColor: e.target.value })} />
                        </div>
                      </label>
                      <label>
                        文字色
                        <input type="color" value={selectedNode.textColor}
                          onChange={(e) => updateNode(selectedDiag.id, selectedNodeId, { textColor: e.target.value })} />
                      </label>
                    </div>
                  )}
                </div>
              )}

              {tab === 'edge' && (
                <div className="tab-content">
                  <div className="placed-chars">
                    {selectedDiag.edges.map((e) => {
                      const from = selectedDiag.nodes.find((n) => n.id === e.fromId)
                      const to = selectedDiag.nodes.find((n) => n.id === e.toId)
                      return (
                        <div key={e.id}
                          className={`placed-char ${selectedEdgeId === e.id ? 'selected' : ''}`}
                          onClick={() => { setSelectedEdgeId(e.id); setSelectedNodeId(null) }}>
                          <span>{from?.label.slice(0, 8)} → {to?.label.slice(0, 8)}</span>
                          <button className="btn-small btn-danger" onClick={(ex) => { ex.stopPropagation(); deleteEdge(selectedDiag.id, e.id); if (selectedEdgeId === e.id) setSelectedEdgeId(null) }}>✕</button>
                        </div>
                      )
                    })}
                    {selectedDiag.edges.length === 0 && <p className="empty-hint">矢印がありません。ノードタブで「矢印で接続」から追加</p>}
                  </div>

                  {selectedEdge && selectedEdgeId && (
                    <div className="char-props">
                      <label>
                        ラベル
                        <input type="text" value={selectedEdge.label}
                          onChange={(e) => updateEdge(selectedDiag.id, selectedEdgeId, { label: e.target.value })} />
                      </label>
                      <label>
                        線のスタイル
                        <select value={selectedEdge.style}
                          onChange={(e) => updateEdge(selectedDiag.id, selectedEdgeId, { style: e.target.value as 'solid' | 'dashed' })}>
                          <option value="solid">実線</option>
                          <option value="dashed">破線</option>
                        </select>
                      </label>
                      <label>
                        <input type="checkbox" checked={selectedEdge.arrowEnd}
                          onChange={(e) => updateEdge(selectedDiag.id, selectedEdgeId, { arrowEnd: e.target.checked })} />
                        終端矢印
                      </label>
                      <label>
                        <input type="checkbox" checked={selectedEdge.arrowStart}
                          onChange={(e) => updateEdge(selectedDiag.id, selectedEdgeId, { arrowStart: e.target.checked })} />
                        始端矢印
                      </label>
                    </div>
                  )}
                </div>
              )}

              {tab === 'settings' && (
                <div className="tab-content">
                  <label>
                    図の名前
                    <input type="text" value={selectedDiag.name}
                      onChange={(e) => updateDiagram(selectedDiag.id, { name: e.target.value })} />
                  </label>
                  <label>
                    幅
                    <input type="number" value={selectedDiag.width} min={200} max={1200} step={50}
                      onChange={(e) => updateDiagram(selectedDiag.id, { width: +e.target.value })} />
                  </label>
                  <label>
                    高さ
                    <input type="number" value={selectedDiag.height} min={150} max={900} step={50}
                      onChange={(e) => updateDiagram(selectedDiag.id, { height: +e.target.value })} />
                  </label>
                  <label>
                    背景色
                    <input type="color" value={selectedDiag.backgroundColor}
                      onChange={(e) => updateDiagram(selectedDiag.id, { backgroundColor: e.target.value })} />
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
