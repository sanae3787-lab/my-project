'use client'

import { useState, useEffect, useCallback } from 'react'

interface Pokemon {
  id: number
  name: string
  jaName: string
  sprite: string
}

const POKEMON_LIST: { id: number; ja: string }[] = [
  { id: 1, ja: 'フシギダネ' },
  { id: 4, ja: 'ヒトカゲ' },
  { id: 7, ja: 'ゼニガメ' },
  { id: 25, ja: 'ピカチュウ' },
  { id: 39, ja: 'プリン' },
  { id: 52, ja: 'ニャース' },
  { id: 54, ja: 'コダック' },
  { id: 63, ja: 'ケーシィ' },
  { id: 79, ja: 'ヤドン' },
  { id: 94, ja: 'ゲンガー' },
  { id: 113, ja: 'ラッキー' },
  { id: 132, ja: 'メタモン' },
  { id: 133, ja: 'イーブイ' },
  { id: 143, ja: 'カビゴン' },
  { id: 150, ja: 'ミュウツー' },
  { id: 151, ja: 'ミュウ' },
  { id: 152, ja: 'チコリータ' },
  { id: 155, ja: 'ヒノアラシ' },
  { id: 158, ja: 'ワニノコ' },
  { id: 175, ja: 'トゲピー' },
  { id: 196, ja: 'エーフィ' },
  { id: 197, ja: 'ブラッキー' },
  { id: 249, ja: 'ルギア' },
  { id: 250, ja: 'ホウオウ' },
  { id: 252, ja: 'キモリ' },
  { id: 255, ja: 'アチャモ' },
  { id: 258, ja: 'ミズゴロウ' },
  { id: 300, ja: 'エネコ' },
  { id: 349, ja: 'ナマズン' },
  { id: 385, ja: 'ジラーチ' },
  { id: 387, ja: 'ナエトル' },
  { id: 390, ja: 'ヒコザル' },
  { id: 393, ja: 'ポッチャマ' },
  { id: 440, ja: 'ピンプク' },
  { id: 447, ja: 'リオル' },
  { id: 448, ja: 'ルカリオ' },
  { id: 470, ja: 'リーフィア' },
  { id: 471, ja: 'グレイシア' },
  { id: 490, ja: 'マナフィ' },
  { id: 495, ja: 'ツタージャ' },
  { id: 498, ja: 'ポカブ' },
  { id: 501, ja: 'ミジュマル' },
  { id: 570, ja: 'zorua' },
  { id: 648, ja: 'メロエッタ' },
  { id: 658, ja: 'ゲッコウガ' },
  { id: 700, ja: 'ニンフィア' },
  { id: 718, ja: 'ジガルデ' },
  { id: 722, ja: 'モクロー' },
  { id: 725, ja: 'ニャビー' },
  { id: 728, ja: 'アシマリ' },
]

const DIFFICULTIES = [
  { label: 'かんたん', max: 20, label_en: 'easy' },
  { label: 'ふつう', max: 50, label_en: 'normal' },
  { label: 'むずかしい', max: 151, label_en: 'hard' },
]

function getSprite(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateQuestion(maxNum: number): { a: Pokemon; b: Pokemon } {
  const eligible = POKEMON_LIST.filter((p) => p.id <= maxNum)
  const pool = eligible.length >= 2 ? eligible : POKEMON_LIST.slice(0, 2)
  let aEntry = pickRandom(pool)
  let bEntry = pickRandom(pool)
  while (bEntry.id === aEntry.id) bEntry = pickRandom(pool)
  return {
    a: { id: aEntry.id, name: '', jaName: aEntry.ja, sprite: getSprite(aEntry.id) },
    b: { id: bEntry.id, name: '', jaName: bEntry.ja, sprite: getSprite(bEntry.id) },
  }
}

type Phase = 'start' | 'playing' | 'result'

export default function PokemonAdditionGame() {
  const [difficulty, setDifficulty] = useState(0)
  const [phase, setPhase] = useState<Phase>('start')
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [total] = useState(10)
  const [pokemonA, setPokemonA] = useState<Pokemon | null>(null)
  const [pokemonB, setPokemonB] = useState<Pokemon | null>(null)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const nextQuestion = useCallback(
    (diffIdx?: number) => {
      const d = diffIdx !== undefined ? diffIdx : difficulty
      const { a, b } = generateQuestion(DIFFICULTIES[d].max)
      setPokemonA(a)
      setPokemonB(b)
      setAnswer('')
      setFeedback(null)
    },
    [difficulty],
  )

  const startGame = (diffIdx: number) => {
    setDifficulty(diffIdx)
    setScore(0)
    setRound(1)
    setPhase('playing')
    nextQuestion(diffIdx)
  }

  const submitAnswer = () => {
    if (!pokemonA || !pokemonB || answer === '' || isAnimating) return
    const correct = pokemonA.id + pokemonB.id
    const isCorrect = parseInt(answer, 10) === correct
    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore((s) => s + 1)
    setIsAnimating(true)
    setTimeout(() => {
      setIsAnimating(false)
      if (round >= total) {
        setPhase('result')
      } else {
        setRound((r) => r + 1)
        nextQuestion()
      }
    }, 1200)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submitAnswer()
  }

  useEffect(() => {
    if (phase === 'playing' && pokemonA === null) nextQuestion()
  }, [phase, pokemonA, nextQuestion])

  if (phase === 'start') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-8">
        <div className="text-center">
          <div className="text-6xl mb-4">⚡</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ポケモン 足し算ゲーム</h1>
          <p className="text-gray-500">2匹のポケモンの図鑑番号を足してみよう！</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 w-full max-w-sm">
          <p className="text-sm font-semibold text-gray-700 mb-4 text-center">難しさを選んでね</p>
          <div className="flex flex-col gap-3">
            {DIFFICULTIES.map((d, i) => (
              <button
                key={d.label_en}
                onClick={() => startGame(i)}
                className="w-full py-3 px-6 rounded-xl font-bold text-white transition-transform hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: i === 0 ? '#22c55e' : i === 1 ? '#3b82f6' : '#ef4444',
                }}
              >
                {d.label}（図鑑No.1〜{d.max}）
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'result') {
    const pct = Math.round((score / total) * 100)
    const msg =
      pct === 100
        ? '完璧！全問正解だ！すごい！'
        : pct >= 80
          ? 'すごい！よくできました！'
          : pct >= 50
            ? 'なかなかいい感じ！もう一度チャレンジしよう！'
            : '次はもっとできるよ！がんばれ！'
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-10 text-center max-w-sm w-full">
          <div className="text-5xl mb-4">{pct === 100 ? '🏆' : pct >= 80 ? '🌟' : pct >= 50 ? '😊' : '💪'}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ゲームクリア！</h2>
          <p className="text-5xl font-bold text-blue-600 mb-1">
            {score} / {total}
          </p>
          <p className="text-gray-500 text-sm mb-4">（正解率 {pct}%）</p>
          <p className="text-gray-700 font-medium mb-6">{msg}</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => startGame(difficulty)}
              className="w-full py-3 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              もう一度あそぶ
            </button>
            <button
              onClick={() => setPhase('start')}
              className="w-full py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              難しさを変える
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between">
        <button
          onClick={() => setPhase('start')}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← もどる
        </button>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">
            {round} / {total} 問
          </span>
          <span className="font-bold text-blue-600">スコア: {score}</span>
        </div>
        <span
          className="text-xs font-bold px-3 py-1 rounded-full text-white"
          style={{
            backgroundColor:
              difficulty === 0 ? '#22c55e' : difficulty === 1 ? '#3b82f6' : '#ef4444',
          }}
        >
          {DIFFICULTIES[difficulty].label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-lg h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${((round - 1) / total) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <div
        className={`bg-white rounded-2xl shadow-md border-2 p-6 w-full max-w-lg transition-all duration-300 ${
          feedback === 'correct'
            ? 'border-green-400 bg-green-50'
            : feedback === 'wrong'
              ? 'border-red-400 bg-red-50'
              : 'border-gray-200'
        }`}
      >
        <p className="text-center text-sm text-gray-500 mb-4">2匹の図鑑番号を足すといくつ？</p>

        <div className="flex items-center justify-center gap-6">
          {/* Pokemon A */}
          {pokemonA && (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pokemonA.sprite}
                  alt={pokemonA.jaName}
                  className="w-20 h-20 object-contain pixelated"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">{pokemonA.jaName}</p>
              <p className="text-2xl font-bold text-gray-800">No.{pokemonA.id}</p>
            </div>
          )}

          <div className="text-3xl font-bold text-gray-400">+</div>

          {/* Pokemon B */}
          {pokemonB && (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pokemonB.sprite}
                  alt={pokemonB.jaName}
                  className="w-20 h-20 object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">{pokemonB.jaName}</p>
              <p className="text-2xl font-bold text-gray-800">No.{pokemonB.id}</p>
            </div>
          )}

          <div className="text-3xl font-bold text-gray-400">=</div>

          <div className="text-4xl font-bold text-gray-300">?</div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`text-center mt-4 font-bold text-lg ${
              feedback === 'correct' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {feedback === 'correct'
              ? `⭕ せいかい！ ${(pokemonA?.id ?? 0) + (pokemonB?.id ?? 0)} だよ！`
              : `❌ ざんねん！ こたえは ${(pokemonA?.id ?? 0) + (pokemonB?.id ?? 0)} だよ`}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="w-full max-w-lg flex gap-3">
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={feedback !== null}
          placeholder="こたえを入力"
          className="flex-1 px-4 py-3 text-xl font-bold text-center rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none disabled:opacity-50"
          autoFocus
        />
        <button
          onClick={submitAnswer}
          disabled={answer === '' || feedback !== null}
          className="px-8 py-3 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          こたえる
        </button>
      </div>

      <p className="text-xs text-gray-400">Enterキーでも回答できます</p>
    </div>
  )
}
