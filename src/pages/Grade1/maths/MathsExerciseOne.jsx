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
      const count = Math.floor(Math.random() * 9) + 1 // 1 to 9 (single digit only)
      const obj = OBJECTS[Math.floor(Math.random() * OBJECTS.length)]
      const numDigits = count.toString().length
      qs.push({
        id: i,
        count,
        object: obj,
        digits: Array(numDigits).fill(''),
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

  function handleInputChange(id, boxIndex, value) {
    // Only allow single digit
    const digit = value.replace(/[^0-9]/g, '').slice(-1)
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newDigits = [...item.digits]
        newDigits[boxIndex] = digit
        // Auto-focus next box if digit entered and not last box
        if (digit && boxIndex < item.digits.length - 1) {
          setTimeout(() => {
            const nextInput = document.getElementById(`input-${id}-${boxIndex + 1}`)
            if (nextInput) nextInput.focus()
          }, 0)
        }
        return { ...item, digits: newDigits, checked: false, correct: null }
      }
      return item
    }))
  }

  function handleKeyDown(id, boxIndex, e) {
    const item = items.find(i => i.id === id)
    if (e.key === 'Backspace' && item) {
      // If current box is empty, go to previous box
      if (!item.digits[boxIndex] && boxIndex > 0) {
        e.preventDefault()
        const prevInput = document.getElementById(`input-${id}-${boxIndex - 1}`)
        if (prevInput) {
          prevInput.focus()
          // Clear the previous box
          setItems(prev => prev.map(i => {
            if (i.id === id) {
              const newDigits = [...i.digits]
              newDigits[boxIndex - 1] = ''
              return { ...i, digits: newDigits, checked: false, correct: null }
            }
            return i
          }))
        }
      }
    } else if (e.key === 'Enter') {
      handleCheck(id)
    }
  }

  function handleCheck(id) {
    const item = items.find(i => i.id === id)
    if (!item || item.checked) return

    const userAnswer = item.digits.join('')
    const userNum = parseInt(userAnswer, 10) || 0
    const isCorrect = userNum === item.count

    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, checked: true, correct: isCorrect, digits: isCorrect ? i.digits : Array(i.count.toString().length).fill('') } : i
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

      <div style={{ width: '100%', maxWidth: 800, background: 'rgba(255,255,255,0.95)', padding: '24px', borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize: 'clamp(24px, 5vw, 32px)', textAlign: 'center', marginBottom: 8, fontWeight: 900, color: '#333' }}>Count the objects</h2>
        <div style={{ textAlign: 'center', marginBottom: 20, fontSize: '16px', color: '#555' }}>
          Correct: {completedCount} / {totalCount}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              padding: '16px',
              background: item.checked
                ? (item.correct ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)')
                : 'white',
              border: item.checked
                ? (item.correct ? '2px solid #4CAF50' : '2px solid #F44336')
                : '2px solid #ddd',
              borderRadius: 12,
              transition: 'all 0.3s ease',
            }}>
              {/* Objects display */}
              <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-start', alignItems: 'center' }}>
                {Array.from({ length: item.count }).map((_, idx) => (
                  <span key={idx} style={{ fontSize: 'clamp(24px, 5vw, 32px)', userSelect: 'none', animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) both', animationDelay: `${idx * 50}ms` }}>{item.object}</span>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                {item.digits.map((digit, boxIndex) => (
                  <input
                    key={boxIndex}
                    id={`input-${item.id}-${boxIndex}`}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleInputChange(item.id, boxIndex, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(item.id, boxIndex, e)}
                    disabled={item.checked && item.correct}
                    placeholder="#"
                    style={{
                      width: '50px',
                      fontSize: '24px',
                      padding: '8px',
                      textAlign: 'center',
                      border: '2px solid #999',
                      borderRadius: 8,
                      outline: 'none',
                      background: (item.checked && item.correct) ? '#f1f8f1' : 'white',
                      fontFamily: 'inherit',
                      fontWeight: 700
                    }}
                  />
                ))}

                <button
                  onClick={() => handleCheck(item.id)}
                  disabled={item.digits.some(d => !d) || (item.checked && item.correct)}
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
                    cursor: (item.digits.some(d => !d) || (item.checked && item.correct)) ? 'not-allowed' : 'pointer',
                    opacity: (item.digits.some(d => !d) || (item.checked && item.correct)) ? 0.5 : 1,
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
          <div style={{ textAlign: 'center', marginTop: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: 'clamp(24px, 6vw, 36px)', fontWeight: 900, color: '#4CAF50', animation: 'popIn 600ms cubic-bezier(.2,.9,.2,1) both' }}>
              🎉 All done — Excellent work! 🎉
            </div>
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
