import React, { useState, useMemo, useEffect } from 'react'

const POSITIVE = [
  '👍 Good', '✅ Yes', '🌟 Nice', '🎉 Great', '😃 Yay', '👌 Ok'
]

const GENTLE = [
  '👎 Retry', '☹️ Try again', '❌ Wrong'
]
export default function MathsExerciseFour({ onBack, onNextExercise }) {
  // Generate 5 random numbers with at least one 1-digit, one 2-digit, and one 3-digit
  const questions = useMemo(() => {
    const nums = []
    // Ensure at least one 1-digit (1-8 to allow before/after)
    nums.push(Math.floor(Math.random() * 8) + 1)
    // Ensure at least one 2-digit (10-98)
    nums.push(Math.floor(Math.random() * 89) + 10)
    // Ensure at least one 3-digit (100-498)
    nums.push(Math.floor(Math.random() * 399) + 100)
    // Fill remaining with random numbers from 1-498
    for (let i = 0; i < 2; i++) {
      nums.push(Math.floor(Math.random() * 498) + 1)
    }
    // Shuffle the array
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]]
    }

    return nums.map((num, idx) => {
      const beforeDigits = (num - 1).toString().length
      const afterDigits = (num + 1).toString().length
      return {
        id: idx,
        number: num,
        before: num - 1,
        after: num + 1,
        beforeDigits: Array(beforeDigits).fill(''),
        afterDigits: Array(afterDigits).fill(''),
        checked: false,
        correct: null
      }
    })
  }, [])

  const [items, setItems] = useState(questions)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 1500)
      return () => clearTimeout(t)
    }
  }, [message])

  function handleInputChange(id, type, boxIndex, value) {
    const digit = value.replace(/[^0-9]/g, '').slice(-1)
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newDigits = type === 'before' ? [...item.beforeDigits] : [...item.afterDigits]
        newDigits[boxIndex] = digit
        // Auto-focus next box if digit entered and not last box
        if (digit && boxIndex < newDigits.length - 1) {
          setTimeout(() => {
            const nextInput = document.getElementById(`input-${id}-${type}-${boxIndex + 1}`)
            if (nextInput) nextInput.focus()
          }, 0)
        }
        return type === 'before'
          ? { ...item, beforeDigits: newDigits, checked: false, correct: null }
          : { ...item, afterDigits: newDigits, checked: false, correct: null }
      }
      return item
    }))
  }

  function handleKeyDown(id, type, boxIndex, e) {
    if (e.key === 'Backspace') {
      const item = items.find(i => i.id === id)
      if (item) {
        const digits = type === 'before' ? item.beforeDigits : item.afterDigits
        if (!digits[boxIndex] && boxIndex > 0) {
          e.preventDefault()
          const prevInput = document.getElementById(`input-${id}-${type}-${boxIndex - 1}`)
          if (prevInput) {
            prevInput.focus()
            setItems(prev => prev.map(i => {
              if (i.id === id) {
                const newDigits = type === 'before' ? [...i.beforeDigits] : [...i.afterDigits]
                newDigits[boxIndex - 1] = ''
                return type === 'before'
                  ? { ...i, beforeDigits: newDigits, checked: false, correct: null }
                  : { ...i, afterDigits: newDigits, checked: false, correct: null }
              }
              return i
            }))
          }
        }
      }
    }
  }

  function checkAll() {
    let hasErrors = false
    setItems(prev => prev.map(item => {
      if (item.checked && item.correct) return item

      const beforeAnswer = item.beforeDigits.join('').replace(/^0+/, '') || '0'
      const afterAnswer = item.afterDigits.join('').replace(/^0+/, '') || '0'
      const beforeNum = parseInt(beforeAnswer, 10)
      const afterNum = parseInt(afterAnswer, 10)
      const isCorrect = beforeNum === item.before && afterNum === item.after

      if (!isCorrect) hasErrors = true
      return {
        ...item,
        checked: true,
        correct: isCorrect,
        beforeDigits: isCorrect ? item.beforeDigits : Array(item.before.toString().length).fill(''),
        afterDigits: isCorrect ? item.afterDigits : Array(item.after.toString().length).fill('')
      }
    }))

    if (!hasErrors) {
      setMessage({ type: 'success', text: POSITIVE[Math.floor(Math.random() * POSITIVE.length)] })
    } else {
      setMessage({ type: 'error', text: 'Some answers are incorrect. Please fix the highlighted ones!' })
    }
  }

  const completedCount = items.filter(i => i.checked && i.correct).length
  const totalCount = items.length
  const allFilled = items.every(item => item.beforeDigits.some(d => d) && item.afterDigits.some(d => d))

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 20, position: 'relative' }}>

      <div style={{ width: '100%', maxWidth: 900, background: 'rgba(255,255,255,0.95)', padding: 'clamp(20px, 4vw, 40px)', borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize: 'clamp(24px, 6vw, 42px)', textAlign: 'center', marginBottom: 8, fontWeight: 900, color: '#333' }}>Write the number before and after</h2>
        <div style={{ textAlign: 'center', marginBottom: 24, fontSize: 'clamp(16px, 4vw, 20px)', color: '#555' }}>
          Correct: {completedCount} / {totalCount}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {items.map(item => (
            <div key={item.id} style={{
              padding: 'clamp(12px, 3vw, 20px)',
              background: item.checked
                ? (item.correct ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)')
                : 'white',
              border: item.checked
                ? (item.correct ? '2px solid #4CAF50' : '2px solid #F44336')
                : '2px solid #ddd',
              borderRadius: 12,
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(10px, 3vw, 20px)', flexWrap: 'wrap' }}>
                {/* Before */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#666' }}>Before</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {item.beforeDigits.map((digit, boxIndex) => (
                      <input
                        key={boxIndex}
                        id={`input-${item.id}-before-${boxIndex}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleInputChange(item.id, 'before', boxIndex, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(item.id, 'before', boxIndex, e)}
                        disabled={item.checked && item.correct}
                        style={{
                          width: 'clamp(30px, 8vw, 50px)',
                          height: 'clamp(40px, 10vw, 60px)',
                          fontSize: 'clamp(20px, 5vw, 28px)',
                          fontWeight: 700,
                          border: '2px solid #666',
                          borderRadius: 8,
                          outline: 'none',
                          textAlign: 'center',
                          background: (item.checked && item.correct) ? '#f1f8f1' : 'white',
                          fontFamily: 'inherit'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Given Number */}
                <div style={{
                  fontSize: 'clamp(24px, 8vw, 48px)',
                  fontWeight: 900,
                  padding: '10px 30px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: 12,
                  minWidth: 'clamp(60px, 15vw, 120px)',
                  textAlign: 'center'
                }}>
                  {item.number}
                </div>

                {/* After */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#666' }}>After</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {item.afterDigits.map((digit, boxIndex) => (
                      <input
                        key={boxIndex}
                        id={`input-${item.id}-after-${boxIndex}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleInputChange(item.id, 'after', boxIndex, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(item.id, 'after', boxIndex, e)}
                        disabled={item.checked && item.correct}
                        style={{
                          width: 'clamp(30px, 8vw, 50px)',
                          height: 'clamp(40px, 10vw, 60px)',
                          fontSize: 'clamp(20px, 5vw, 28px)',
                          fontWeight: 700,
                          border: '2px solid #666',
                          borderRadius: 8,
                          outline: 'none',
                          textAlign: 'center',
                          background: (item.checked && item.correct) ? '#f1f8f1' : 'white',
                          fontFamily: 'inherit'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <button
            onClick={checkAll}
            disabled={!allFilled}
            style={{
              padding: '16px 40px',
              fontSize: 22,
              fontWeight: 700,
              background: !allFilled ? '#ccc' : '#2BD2FF',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              cursor: !allFilled ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s'
            }}
          >
            Check All Answers
          </button>
        </div>

        {completedCount === totalCount && (
          <div style={{ textAlign: 'center', marginTop: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#4CAF50', animation: 'popIn 600ms cubic-bezier(.2,.9,.2,1) both' }}>
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
