'use client'

import { useState, useEffect, useCallback } from 'react'

type Operator = '+' | '-'

interface Question {
  a: number
  b: number
  operator: Operator
  answer: number
  choices: number[]
}

const EMOJIS = ['⭐', '🌟', '🎉', '🎊', '🏆', '🌈', '🎈', '🦋', '🌸', '🐣']
const CORRECT_MESSAGES = [
  'すごい！', 'やったね！', 'せいかい！', 'かんぺき！', 'すばらしい！', 'よくできました！',
]
const WRONG_MESSAGES = [
  'ざんねん…', 'もういちど！', 'がんばれ！', 'つぎはできるよ！',
]

function generateQuestion(): Question {
  const operator: Operator = Math.random() < 0.6 ? '+' : '-'
  let a: number, b: number, answer: number

  if (operator === '+') {
    a = Math.floor(Math.random() * 10) + 1
    b = Math.floor(Math.random() * (10 - a + 1))
    answer = a + b
  } else {
    a = Math.floor(Math.random() * 10) + 1
    b = Math.floor(Math.random() * a)
    answer = a - b
  }

  const wrongChoices = new Set<number>()
  while (wrongChoices.size < 3) {
    const delta = Math.floor(Math.random() * 4) + 1
    const candidate = Math.random() < 0.5 ? answer + delta : answer - delta
    if (candidate !== answer && candidate >= 0 && candidate <= 20) {
      wrongChoices.add(candidate)
    }
  }

  const choices = [answer, ...Array.from(wrongChoices)]
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[choices[i], choices[j]] = [choices[j], choices[i]]
  }

  return { a, b, operator, answer, choices }
}

export default function MathGamePage() {
  const [question, setQuestion] = useState<Question | null>(null)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [emoji, setEmoji] = useState('')
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [streak, setStreak] = useState(0)

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion())
    setFeedback(null)
    setSelectedChoice(null)
    setFeedbackMessage('')
    setEmoji('')
  }, [])

  const startGame = () => {
    setScore(0)
    setTotal(0)
    setStreak(0)
    setGameStarted(true)
    setQuestion(generateQuestion())
    setFeedback(null)
    setSelectedChoice(null)
  }

  const handleAnswer = (choice: number) => {
    if (feedback !== null || !question) return
    setSelectedChoice(choice)
    setTotal((t) => t + 1)

    if (choice === question.answer) {
      setScore((s) => s + 1)
      setStreak((s) => s + 1)
      const msg = CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)]
      const em = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
      setFeedbackMessage(msg)
      setEmoji(em)
      setFeedback('correct')
    } else {
      setStreak(0)
      const msg = WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)]
      setFeedbackMessage(msg)
      setEmoji('😢')
      setFeedback('wrong')
    }

    setTimeout(() => {
      nextQuestion()
    }, 1500)
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-300 to-blue-500 p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-6 max-w-sm w-full">
          <div className="text-6xl">🧮</div>
          <h1 className="text-3xl font-black text-center text-blue-700 leading-tight">
            さんすう<br />ゲーム
          </h1>
          <p className="text-gray-600 text-center text-base">
            たしざんと ひきざんに<br />チャレンジしよう！
          </p>
          <div className="bg-yellow-50 rounded-2xl p-4 w-full text-sm text-gray-700 text-center">
            <p>もんだいを みて、</p>
            <p>こたえを えらんでね！</p>
          </div>
          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white text-2xl font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
          >
            はじめる！
          </button>
        </div>
      </div>
    )
  }

  if (!question) return null

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-sky-300 to-blue-500 p-4">
      {/* Header */}
      <div className="w-full max-w-sm flex items-center justify-between pt-4 pb-2">
        <div className="bg-white rounded-2xl px-4 py-2 shadow flex items-center gap-2">
          <span className="text-yellow-500 text-xl">⭐</span>
          <span className="text-xl font-black text-gray-800">{score}</span>
          <span className="text-gray-400 text-sm">/ {total}</span>
        </div>
        {streak >= 3 && (
          <div className="bg-orange-400 rounded-2xl px-3 py-2 shadow flex items-center gap-1 animate-bounce">
            <span className="text-white text-sm font-bold">🔥 {streak}れんぞく！</span>
          </div>
        )}
        <button
          onClick={() => setGameStarted(false)}
          className="bg-white rounded-2xl px-3 py-2 shadow text-gray-500 text-sm font-bold"
        >
          やめる
        </button>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-sm mt-4 flex-1 flex flex-col gap-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center gap-4">
          {/* Feedback overlay */}
          {feedback && (
            <div
              className={`text-center animate-bounce ${
                feedback === 'correct' ? 'text-green-500' : 'text-red-400'
              }`}
            >
              <div className="text-5xl">{emoji}</div>
              <div className="text-2xl font-black mt-1">{feedbackMessage}</div>
              {feedback === 'wrong' && question && (
                <div className="text-gray-500 text-base mt-1">
                  こたえは <span className="font-black text-green-600">{question.answer}</span> だよ
                </div>
              )}
            </div>
          )}

          {!feedback && (
            <>
              <p className="text-gray-500 text-base font-bold">もんだい</p>
              <div className="flex items-center gap-4">
                <span className="text-6xl font-black text-gray-800">{question.a}</span>
                <span className="text-5xl font-black text-blue-500">{question.operator}</span>
                <span className="text-6xl font-black text-gray-800">{question.b}</span>
                <span className="text-5xl font-black text-gray-400">=</span>
                <span className="text-6xl font-black text-gray-300">?</span>
              </div>
              <VisualAid a={question.a} b={question.b} operator={question.operator} />
            </>
          )}
        </div>

        {/* Answer Choices */}
        <div className="grid grid-cols-2 gap-3">
          {question.choices.map((choice) => {
            let bg = 'bg-white'
            if (feedback !== null && selectedChoice === choice) {
              bg = feedback === 'correct' ? 'bg-green-400' : 'bg-red-400'
            } else if (feedback !== null && choice === question.answer) {
              bg = 'bg-green-400'
            }
            return (
              <button
                key={choice}
                onClick={() => handleAnswer(choice)}
                disabled={feedback !== null}
                className={`${bg} rounded-2xl shadow-lg py-6 text-4xl font-black text-gray-800 active:scale-95 transition-all disabled:opacity-80`}
              >
                {choice}
              </button>
            )
          })}
        </div>
      </div>

      {/* Footer score message */}
      {total > 0 && (
        <div className="w-full max-w-sm py-4 text-center">
          <p className="text-white text-sm opacity-80">
            せいかいりつ: {Math.round((score / total) * 100)}%
          </p>
        </div>
      )}
    </div>
  )
}

function VisualAid({ a, b, operator }: { a: number; b: number; operator: Operator }) {
  const total = operator === '+' ? a + b : a
  if (total > 10) return null

  const items = operator === '+' ? a + b : a
  return (
    <div className="flex flex-wrap gap-1 justify-center max-w-xs">
      {Array.from({ length: items }).map((_, i) => {
        const isSubtracted = operator === '-' && i >= a - b
        return (
          <span
            key={i}
            className={`text-2xl transition-all ${isSubtracted ? 'opacity-20' : 'opacity-100'}`}
          >
            🍎
          </span>
        )
      })}
    </div>
  )
}
