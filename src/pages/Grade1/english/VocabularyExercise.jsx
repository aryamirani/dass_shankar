import React, { useState, useMemo, useEffect } from 'react'

const POSITIVE = [
  '👍 Good', '✅ Yes', '🌟 Nice', '🎉 Great', '😃 Yay', '👌 Ok'
]

const GENTLE = [
  '👎 Retry', '☹️ Try again', '❌ Wrong'
]

export default function VocabularyExercise({ onBack, onNextExercise }) {
  // generate randomized 4x4 grid (16 items) with 4-6 'at' targets placed randomly
  const initialData = useMemo(() => {
    const distractors = ['an', 'ab', 'ac', 'ap', 'ad', 'am', 'ag', 'af', 'ar']
    const countAt = Math.floor(Math.random() * 3) + 2 // 2..4
    const arr = []
    for (let i = 0; i < countAt; i++) arr.push('at')
    while (arr.length < 9) arr.push(distractors[Math.floor(Math.random() * distractors.length)])
    // shuffle Fisher-Yates
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = arr[i]; arr[i] = arr[j]; arr[j] = t }
    return { items: arr.map((w, i) => ({ id: i, word: w, matched: false })), countAt }
  }, [])

  const [items, setItems] = useState(initialData.items)
  const [message, setMessage] = useState(null)
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 1100)
      return () => clearTimeout(t)
    }
  }, [message])

  function handleClick(item) {
    if (item.word === 'at') {
      setItems(prev => prev.map(p => p.id === item.id ? { ...p, matched: true } : p))
      setMessage({ type: 'success', text: POSITIVE[Math.floor(Math.random() * POSITIVE.length)] })
      setCompletedCount(c => c + 1)
    } else {
      setMessage({ type: 'error', text: GENTLE[Math.floor(Math.random() * GENTLE.length)] })
    }
  }

  const totalAt = initialData.countAt

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 20, position: 'relative' }}>


      <style>{`
        .vocab-word-btn {
            width: 100%; height: 100%;
            font-size: 48px;
            font-weight: 800;
            border-radius: 20px;
            border: none;
            background: white;
            cursor: pointer;
            box-shadow: 0 8px 0px rgba(0,0,0,0.15), 0 15px 20px rgba(0,0,0,0.1);
            color: #444;
            transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
            padding: 20px;
        }
        .vocab-word-btn:hover:not(:disabled) {
            transform: translateY(-4px);
            box-shadow: 0 12px 0px rgba(0,0,0,0.15), 0 20px 30px rgba(0,0,0,0.15);
            background: #fff;
            color: #1976d2;
        }
        .vocab-word-btn:active:not(:disabled) {
            transform: translateY(2px);
            box-shadow: 0 4px 0px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.1);
        }
      `}</style>


      <div style={{ width: '100%', maxWidth: 980, background: 'rgba(255,255,255,0.0)', padding: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 12, minHeight: 56 }}>
          {message && (
            <div style={{ padding: '8px 16px', fontSize: 24, fontWeight: 800, color: message.type === 'success' ? '#155724' : '#856404', background: message.type === 'success' ? 'rgba(212,237,218,0.98)' : 'rgba(255,243,205,0.95)', borderRadius: 14, boxShadow: '0 8px 22px rgba(0,0,0,0.1)', display: 'inline-block' }}>
              {message.text}
            </div>
          )}
        </div>
        <h2 style={{ fontSize: 'clamp(20px, 4vw, 28px)', textAlign: 'center', marginBottom: 8 }}>Find and tap only the "at" words</h2>
        <div style={{ textAlign: 'center', marginBottom: 12, fontSize: '16px', color: '#333' }}>
          Correct found: {completedCount} / {totalAt}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '16px', justifyItems: 'center', alignItems: 'center', padding: 16 }}>
          {items.map(item => (
            <div key={item.id} style={{ width: '100%', maxWidth: 120, aspectRatio: '1.4', position: 'relative', borderRadius: 16 }}>
              <button
                className="vocab-word-btn"
                onClick={() => { if (!item.matched) handleClick(item) }}
                disabled={item.matched}
                style={{
                  background: item.matched ? '#dcfce7' : 'white',
                  color: item.matched ? '#166534' : '#444',
                  boxShadow: item.matched ? 'inset 0 4px 10px rgba(0,0,0,0.05)' : undefined,
                  transform: item.matched ? 'scale(0.95)' : undefined,
                  cursor: item.matched ? 'default' : 'pointer',
                  fontSize: 'clamp(24px, 5vw, 36px)',
                  padding: '8px'
                }}
              >
                {item.word}
              </button>
              {item.matched && (
                <div style={{ position: 'absolute', right: 10, top: 8, pointerEvents: 'none', fontSize: 26, color: '#2e7d32', fontWeight: 900, background: 'rgba(255,255,255,0.9)', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, boxShadow: '0 4px 8px rgba(0,0,0,0.06)' }}>✓</div>
              )}
            </div>
          ))}
        </div>

        {completedCount === totalAt && (
          <div style={{ textAlign: 'center', marginTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: 34, fontWeight: '900', color: '#2e7d32' }}>All done — great work!</div>
            <button
              onClick={onNextExercise}
              style={{
                padding: '16px 32px',
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
                transition: 'transform 0.2s',
                animation: 'popIn 600ms cubic-bezier(.2,.9,.2,1) 200ms both'
              }}
              onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
            >
              Next Exercise →
            </button>
          </div>
        )}
      </div>

    </div>
  )
}
