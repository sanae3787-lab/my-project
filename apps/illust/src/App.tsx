import { useState } from 'react'
import { CharacterEditor } from './components/CharacterEditor'
import { SceneEditor } from './components/SceneEditor'
import { DiagramEditor } from './components/DiagramEditor'
import { ExportPanel } from './components/ExportPanel'
import './App.css'

type Tab = 'characters' | 'scenes' | 'diagrams' | 'export'

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'characters', label: 'キャラ管理', emoji: '👤' },
  { id: 'scenes', label: 'シーン作成', emoji: '🎨' },
  { id: 'diagrams', label: '図解作成', emoji: '📊' },
  { id: 'export', label: '書き出し', emoji: '💾' },
]

export function App() {
  const [tab, setTab] = useState<Tab>('characters')

  return (
    <div className="app">
      <header className="app-header">
        <h1>キャラ挿絵メーカー</h1>
        <p className="subtitle">noteの記事に使える挿絵・図解を簡単作成</p>
      </header>

      <nav className="app-nav">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`nav-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className="nav-emoji">{t.emoji}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      <main className="app-main">
        {tab === 'characters' && <CharacterEditor />}
        {tab === 'scenes' && <SceneEditor />}
        {tab === 'diagrams' && <DiagramEditor />}
        {tab === 'export' && <ExportPanel />}
      </main>
    </div>
  )
}
