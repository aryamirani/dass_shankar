import React, { useState, useMemo, useEffect } from 'react'
import { useSpeech } from '../../../hooks/useSpeech'

const POSITIVE = [
  '👍 Good', '✅ Yes', '🌟 Nice', '🎉 Great', '😃 Yay', '👌 Ok'
]

const GENTLE = [
  '👎 Retry', '☹️ Try again', '❌ Wrong'
]

export default function VocabularyExerciseAg({ onBack, onNextExercise }) {
  const { speak } = useSpeech()
  // generate randomized 4x4 grid (16 items) with 4-6 'ag' targets placed randomly
  const initialData = useMemo(() => {
    const distractors = ['an', 'ab', 'ac', 'ap', 'ad', 'am', 'ag', 'af', 'ar']
    const countAg = Math.floor(Math.random() * 3) + 2 // 2..4
    const arr = []
    for (let i = 0; i < countAg; i++) arr.push('ag')
    while (arr.length < 9) arr.push(distractors[Math.floor(Math.random() * distractors.length)])
    // shuffle Fisher-Yates
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = arr[i]; arr[i] = arr[j]; arr[j] = t }
    return { items: arr.map((w, i) => ({ id: i, word: w, matched: false })), countAg }
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
    if (item.word === 'ag') {
      setItems(prev => prev.map(p => p.id === item.id ? { ...p, matched: true } : p))
      setMessage({ type: 'success', text: POSITIVE[Math.floor(Math.random() * POSITIVE.length)] })
      setCompletedCount(c => c + 1)
      speak('ag')
    } else {
      setMessage({ type: 'error', text: GENTLE[Math.floor(Math.random() * GENTLE.length)] })
    }
  }

  const totalAg = initialData.countAg

  return (
    <div style={{ minHeight: '100vh', maxHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 20, position: 'relative' }}>


      <style>{`
        .vocab-word-btn {
            width: 100%; height: 100%;
            font-size: clamp(24px, 5vw, 42px);
            font-weight: 800;
            border-radius: 20px;
            border: none;
            background: white;
            cursor: pointer;
            box-shadow: 0 8px 0px rgba(0,0,0,0.15), 0 15px 20px rgba(0,0,0,0.1);
            color: #444;
            transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
            padding: 10px;
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

      {message && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', padding: '15px 30px', fontSize: 28, fontWeight: 800, color: message.type === 'success' ? '#155724' : '#856404', background: message.type === 'success' ? 'rgba(212,237,218,0.98)' : 'rgba(255,243,205,0.95)', borderRadius: 15, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 1000, display: 'inline-block' }}>
          {message.text}
        </div>
      )}

      <div style={{ width: '100%', maxWidth: 800, background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '85vh' }}>
        <h2 style={{ fontSize: 'clamp(24px, 5vw, 36px)', textAlign: 'center', marginBottom: 8 }}>Find and tap only the "ag" words</h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 15 }}>
          <button 
            onClick={() => speak('ag')}
            style={{ 
              background: '#1976d2', 
              color: 'white', 
              fontSize: 'clamp(16px, 2.5vw, 22px)', 
              fontWeight: 800, 
              padding: '10px 24px', 
              borderRadius: 50, 
              border: 'none', 
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(25,118,210,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            🔊 Click to Listen
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 12, fontSize: 'clamp(16px, 4vw, 18px)', color: '#333' }}>
          Correct found: {completedCount} / {totalAg}
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(12px, 2vw, 24px)', placeItems: 'center', padding: 10, maxWidth: 600, margin: '0 auto', width: '100%' }}>
          {items.map(item => (
            <div key={item.id} style={{ width: '100%', maxWidth: 140, aspectRatio: '1.4', position: 'relative', borderRadius: 16 }}>
              <button
                className="vocab-word-btn"
                onClick={() => { if (!item.matched) handleClick(item) }}
                disabled={item.matched}
                style={{
                  background: item.matched ? '#dcfce7' : 'white',
                  color: item.matched ? '#166534' : undefined,
                  boxShadow: item.matched ? 'inset 0 4px 10px rgba(0,0,0,0.05)' : undefined,
                  transform: item.matched ? 'scale(0.95)' : undefined,
                  cursor: item.matched ? 'default' : 'pointer',
                }}
              >
                {item.word}
              </button>
              {item.matched && (
                <div style={{ position: 'absolute', right: 5, top: 0, pointerEvents: 'none', fontSize: 22, color: '#2e7d32', fontWeight: 900, background: 'rgba(255,255,255,0.9)', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, boxShadow: '0 4px 8px rgba(0,0,0,0.06)' }}>✓</div>
              )}
            </div>
          ))}
        </div>

        {completedCount === totalAg && (
          <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
            <div style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: '900', color: '#2e7d32' }}>All done — great work!</div>
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
