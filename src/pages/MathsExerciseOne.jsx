import React, { useState, useMemo, useEffect } from 'react'

const POSITIVE = [
  '👍 Good', '✅ Yes', '🌟 Nice', '🎉 Great', '😃 Yay', '👌 Ok'
]

const GENTLE = [
  '👎 Retry', '☹️ Try again', '❌ Wrong'
]
const OBJECTS = ['🍎', '🍌', '🥕', '⭐️', '🎈', '🐶', '🍕', '⚽️']

export default function MathsExerciseOne({ onBack, onNextExercise }) {
  // Generate 5 questions asking to count objects (1-10)
  const questions = useMemo(() => {
    const qs = []
    for (let i = 0; i < 5; i++) {
      const count = Math.floor(Math.random() * 10) + 1 // 1 to 10
      const obj = OBJECTS[Math.floor(Math.random() * OBJECTS.length)]
      qs.push({
        id: i,
        count,
        object: obj,
        userAnswer: '',
        checked: false,
        correct: null
      })
    }
    return qs
  }, [])

  const [items, setItems] = useState(questions)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 1500)
      return () => clearTimeout(t)
    }
  }, [message])

  function handleInputChange(id, value) {
    // allow only numbers
    const val = value.replace(/[^0-9]/g, '')
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, userAnswer: val, checked: false, correct: null } : item
    ))
  }

  function handleCheck(id) {
    const item = items.find(i => i.id === id)
    if (!item || item.checked) return

    const userNum = parseInt(item.userAnswer, 10)
    const isCorrect = userNum === item.count

    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, checked: true, correct: isCorrect } : i
    ))

    if (isCorrect) {
      setMessage({ type: 'success', text: POSITIVE[Math.floor(Math.random() * POSITIVE.length)] })
    } else {
      setMessage({ type: 'error', text: GENTLE[Math.floor(Math.random() * GENTLE.length)] })
    }
  }

  const completedCount = items.filter(i => i.checked && i.correct).length
  const totalCount = items.length

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 20, position: 'relative' }}>
      <div style={{ position: 'absolute', left: 20, top: 20 }}>
        <button className="back-btn" onClick={onBack}>←</button>
      </div>


      <div style={{ width: '100%', maxWidth: 900, background: 'rgba(255,255,255,0.95)', padding: 'clamp(20px, 4vw, 40px)', borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize: 'clamp(28px, 6vw, 42px)', textAlign: 'center', marginBottom: 8, fontWeight: 900, color: '#333' }}>Count the objects</h2>
        <div style={{ textAlign: 'center', marginBottom: 24, fontSize: 'clamp(16px, 4vw, 20px)', color: '#555' }}>
          Correct: {completedCount} / {totalCount}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {items.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              padding: 'clamp(12px, 3vw, 20px)',
              background: item.checked
                ? (item.correct ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)')
                : 'white',
              border: item.checked
                ? (item.correct ? '2px solid #4CAF50' : '2px solid #F44336')
                : '2px solid #ddd',
              borderRadius: 12,
              transition: 'all 0.3s ease',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {/* Objects display */}
              <div style={{ flex: '1 1 100%', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
                {Array.from({ length: item.count }).map((_, idx) => (
                  <span key={idx} style={{ fontSize: 'clamp(28px, 6vw, 40px)', userSelect: 'none', animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) both', animationDelay: `${idx * 50}ms` }}>{item.object}</span>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '0 0 auto', justifyContent: 'center', width: 'auto' }}>
                <input
                  type="text"
                  inputMode="numeric"
                  value={item.userAnswer}
                  onChange={(e) => handleInputChange(item.id, e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleCheck(item.id)
                  }}
                  disabled={item.checked && item.correct}
                  placeholder="#"
                  style={{
                    width: 'clamp(60px, 15vw, 80px)',
                    fontSize: 'clamp(20px, 5vw, 28px)',
                    padding: '12px',
                    textAlign: 'center',
                    border: '2px solid #999',
                    borderRadius: 8,
                    outline: 'none',
                    background: (item.checked && item.correct) ? '#f1f8f1' : 'white',
                    fontFamily: 'inherit',
                    fontWeight: 700
                  }}
                />

                <button
                  onClick={() => handleCheck(item.id)}
                  disabled={!item.userAnswer || (item.checked && item.correct)}
                  style={{
                    padding: '12px 24px',
                    fontSize: 'clamp(14px, 4vw, 18px)',
                    fontWeight: 700,
                    background: item.checked
                      ? (item.correct ? '#4CAF50' : '#F44336')
                      : '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: (!item.userAnswer || (item.checked && item.correct)) ? 'not-allowed' : 'pointer',
                    opacity: (!item.userAnswer || (item.checked && item.correct)) ? 0.5 : 1,
                    transition: 'all 0.2s'
                  }}
                >
                  {item.checked
                    ? (item.correct ? '✓' : '✗')
                    : 'Check'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {completedCount === totalCount && (
          <div style={{ textAlign: 'center', marginTop: 30, fontSize: 'clamp(24px, 6vw, 36px)', fontWeight: 900, color: '#4CAF50', animation: 'popIn 600ms cubic-bezier(.2,.9,.2,1) both' }}>
            🎉 All done — Excellent work! 🎉
          </div>
        )}
      </div>

      {message && (
        <div style={{
          position: 'fixed',
          top: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '14px 30px',
          fontSize: message.type === 'success' ? 32 : 26,
          fontWeight: 800,
          color: message.type === 'success' ? '#155724' : '#856404',
          background: message.type === 'success' ? 'rgba(212,237,218,0.98)' : 'rgba(255,243,205,0.95)',
          borderRadius: 14,
          boxShadow: '0 8px 22px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}>
          {message.text}
        </div>
      )}

      <style>{`
        @keyframes popIn { 
          0% { opacity: 0; transform: translateY(30px) scale(0.98); } 
          60% { transform: translateY(-8px) scale(1.02); opacity: 1; } 
          100% { transform: translateY(0) scale(1); } 
        }
      `}</style>
    </div>
  )
}
