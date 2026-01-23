import React, { useState, useMemo, useEffect } from 'react'

const POSITIVE = [
  '🌟 Great job!', '👍 Perfect!', '🤩 Excellent!', '🚀 Awesome!', '🎉 Well done!', '✨ Fantastic!', '🧠 You got it!'
]

const GENTLE = [
  'Not quite! Try again.', 'Almost there! Check your answer.', 'Nice try! Give it another go.'
]

export default function MathsExerciseFive({ onBack, onNextExercise }) {
  // Generate 5 questions where student finds the middle number
  const questions = useMemo(() => {
    const nums = []
    // Ensure at least one 1-digit (2-8 to allow middle)
    nums.push(Math.floor(Math.random() * 7) + 2)
    // Ensure at least one 2-digit (11-98)
    nums.push(Math.floor(Math.random() * 88) + 11)
    // Ensure at least one 3-digit (101-498)
    nums.push(Math.floor(Math.random() * 398) + 101)
    // Fill remaining with random numbers from 2-498
    for (let i = 0; i < 2; i++) {
      nums.push(Math.floor(Math.random() * 497) + 2)
    }
    // Shuffle the array
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]]
    }

    return nums.map((num, idx) => ({
      id: idx,
      middle: num,
      before: num - 1,
      after: num + 1,
      middleDigits: ['', '', ''],
      checked: false,
      correct: null
    }))
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
    const digit = value.replace(/[^0-9]/g, '').slice(-1)
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newDigits = [...item.middleDigits]
        newDigits[boxIndex] = digit
        return { ...item, middleDigits: newDigits, checked: false, correct: null }
      }
      return item
    }))

    // Auto-focus next box if digit entered and not last box
    if (digit && boxIndex < 2) {
      const nextInput = document.getElementById(`input-${id}-${boxIndex + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  function handleKeyDown(id, boxIndex, e) {
    if (e.key === 'Backspace') {
      const item = items.find(i => i.id === id)
      if (item) {
        if (!item.middleDigits[boxIndex] && boxIndex > 0) {
          e.preventDefault()
          const prevInput = document.getElementById(`input-${id}-${boxIndex - 1}`)
          if (prevInput) {
            prevInput.focus()
            setItems(prev => prev.map(i => {
              if (i.id === id) {
                const newDigits = [...i.middleDigits]
                newDigits[boxIndex - 1] = ''
                return { ...i, middleDigits: newDigits, checked: false, correct: null }
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

      const middleAnswer = item.middleDigits.join('').replace(/^0+/, '') || '0'
      const middleNum = parseInt(middleAnswer, 10)
      const isCorrect = middleNum === item.middle

      if (!isCorrect) hasErrors = true
      return {
        ...item,
        checked: true,
        correct: isCorrect,
        middleDigits: isCorrect ? item.middleDigits : ['', '', '']
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
  const allFilled = items.every(item => item.middleDigits.some(d => d))

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 20, position: 'relative' }}>
      <div style={{ position: 'absolute', left: 20, top: 20 }}>
        <button className="back-btn" onClick={onBack}>←</button>
      </div>


      <div style={{ width: '100%', maxWidth: 900, background: 'rgba(255,255,255,0.95)', padding: 'clamp(20px, 4vw, 40px)', borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize: 'clamp(24px, 6vw, 42px)', textAlign: 'center', marginBottom: 8, fontWeight: 900, color: '#333' }}>Write the number in between</h2>
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
                {/* Before Number */}
                <div style={{
                  fontSize: 'clamp(24px, 8vw, 48px)',
                  fontWeight: 900,
                  color: 'white',
                  padding: '10px 30px',
                  background: 'linear-gradient(135deg, #a8edea 0%, #89c3f5 100%)',
                  borderRadius: 12,
                  minWidth: 'clamp(60px, 15vw, 120px)',
                  textAlign: 'center'
                }}>
                  {item.before}
                </div>

                {/* Middle Input */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#666' }}>?</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[0, 1, 2].map(boxIndex => (
                      <input
                        key={boxIndex}
                        id={`input-${item.id}-${boxIndex}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={item.middleDigits[boxIndex]}
                        onChange={(e) => handleInputChange(item.id, boxIndex, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(item.id, boxIndex, e)}
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

                {/* After Number */}
                <div style={{
                  fontSize: 'clamp(24px, 8vw, 48px)',
                  fontWeight: 900,
                  color: 'white',
                  padding: '10px 30px',
                  background: 'linear-gradient(135deg, #fed6e3 0%, #f5a9c8 100%)',
                  borderRadius: 12,
                  minWidth: 'clamp(60px, 15vw, 120px)',
                  textAlign: 'center'
                }}>
                  {item.after}
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
              background: !allFilled ? '#ccc' : '#fed6e3',
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
          <div style={{ textAlign: 'center', marginTop: 30, fontSize: 36, fontWeight: 900, color: '#4CAF50', animation: 'popIn 600ms cubic-bezier(.2,.9,.2,1) both' }}>
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
