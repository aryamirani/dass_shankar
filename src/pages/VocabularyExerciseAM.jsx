import React, { useState, useMemo, useEffect } from 'react'

const POSITIVE = [
  '👍 Good', '✅ Yes', '🌟 Nice', '🎉 Great', '😃 Yay', '👌 Ok'
]

const GENTLE = [
  '👎 Retry', '☹️ Try again', '❌ Wrong'
]

export default function VocabularyExercise({ onBack }) {
  // Generate randomized grid with 'am' targets
  const initialData = useMemo(() => {
    const distractors = ['an', 'ab', 'ac', 'ap', 'ad', 'at', 'ag', 'af', 'ar']
    const countAm = Math.floor(Math.random() * 3) + 3 // 3..5 targets
    const arr = []
    for (let i = 0; i < countAm; i++) arr.push('am')
    while (arr.length < 9) arr.push(distractors[Math.floor(Math.random() * distractors.length)])
    
    // Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [arr[i], arr[j]] = [arr[j], arr[i]] 
    }
    return { items: arr.map((w, i) => ({ id: i, word: w, matched: false })), countAm }
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
    if (item.word === 'am') {
      setItems(prev => prev.map(p => p.id === item.id ? { ...p, matched: true } : p))
      setMessage({ type: 'success', text: POSITIVE[Math.floor(Math.random() * POSITIVE.length)] })
      setCompletedCount(c => c + 1)
    } else {
      setMessage({ type: 'error', text: GENTLE[Math.floor(Math.random() * GENTLE.length)] })
    }
  }

  const totalAm = initialData.countAm

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 20, position: 'relative' }}>
      <div style={{ position: 'absolute', left: 20, top: 20 }}>
        <button className="back-btn" onClick={onBack}>←</button>
      </div>

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
            <div style={{ padding: '10px 18px', fontSize: 28, fontWeight: 800, color: message.type === 'success' ? '#155724' : '#856404', background: message.type === 'success' ? 'rgba(212,237,218,0.98)' : 'rgba(255,243,205,0.95)', borderRadius: 14, boxShadow: '0 8px 22px rgba(0,0,0,0.1)', display: 'inline-block' }}>
              {message.text}
            </div>
          )}
        </div>
        <h2 style={{ fontSize: 'clamp(24px, 5vw, 36px)', textAlign: 'center', marginBottom: 8, color: '#333' }}>Find and tap only the "am" words</h2>
        <div style={{ textAlign: 'center', marginBottom: 12, fontSize: 'clamp(16px, 4vw, 18px)', color: '#333' }}>
          Correct found: {completedCount} / {totalAm}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 'clamp(16px, 3vw, 24px)', justifyItems: 'center', alignItems: 'center', padding: 20 }}>
          {items.map(item => (
            <div key={item.id} style={{ width: '100%', maxWidth: 140, aspectRatio: '1.4', position: 'relative', borderRadius: 20 }}>
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
                  fontSize: 'clamp(28px, 6vw, 48px)',
                  padding: '10px'
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

        {completedCount === totalAm && (
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 34, fontWeight: '900', color: '#2e7d32' }}>All done — great work!</div>
        )}
      </div>
    </div>
  )
}