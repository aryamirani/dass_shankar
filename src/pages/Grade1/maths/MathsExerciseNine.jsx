// Word Problems 1
import React, { useState, useEffect, useRef, useMemo } from 'react'

const POSITIVE = [
  '👍 Good', '✅ Yes', '🌟 Nice', '🎉 Great', '😃 Yay', '👌 Ok'
]

const GENTLE = [
  '👎 Retry', '☹️ Try again', '❌ Wrong'
]

export default function MathsExerciseNine({ onBack, onComplete, onNextExercise, mode = 'learn' }) {
  const bagsToTakeOut = useMemo(() => Math.floor(Math.random() * 1), []) // 0-4

  const [userAnswer, setUserAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(null)
  const [userAnswerLeft, setUserAnswerLeft] = useState('')
  const [checkedLeft, setCheckedLeft] = useState(false)
  const [correctLeft, setCorrectLeft] = useState(null)
  const [message, setMessage] = useState(null)
  const successRef = useRef(null)

  const correctAnswer = 2
  const correctLeftAnswer = 2 - bagsToTakeOut

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 1500)
      return () => clearTimeout(t)
    }
  }, [message])

  useEffect(() => {
    if (checked && correct && checkedLeft && correctLeft && successRef.current) {
      successRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [checked, correct, checkedLeft, correctLeft])

  function handleInputChange(value) {
    // allow only numbers
    const val = value.replace(/[^0-9]/g, '')
    setUserAnswer(val)
    setChecked(false)
    setCorrect(null)
  }

  function handleInputLeftChange(value) {
    const val = value.replace(/[^0-9]/g, '')
    setUserAnswerLeft(val)
    setCheckedLeft(false)
    setCorrectLeft(null)
  }

  function handleCheck() {
    if (!userAnswer || checked) return

    const userNum = parseInt(userAnswer, 10)
    const isCorrect = userNum === correctAnswer

    if (mode === 'test') {
      // In test mode, we just mark as "done" locally for the UI flow
      setChecked(true)
      setCorrect(null) // Don't reveal correctness
    } else {
      setChecked(true)
      setCorrect(isCorrect)
      if (isCorrect) {
        setMessage({ type: 'success', text: POSITIVE[Math.floor(Math.random() * POSITIVE.length)] })
      } else {
        setMessage({ type: 'error', text: GENTLE[Math.floor(Math.random() * GENTLE.length)] })
      }
    }
  }

  function handleCheckLeft() {
    if (!userAnswerLeft || checkedLeft) return

    const userNum = parseInt(userAnswerLeft, 10)
    const isCorrect = userNum === correctLeftAnswer

    if (mode === 'test') {
      setCheckedLeft(true)
      setCorrectLeft(null)
      // Send results to handler
      if (onComplete) {
        onComplete({
          score: (parseInt(userAnswer) === correctAnswer ? 50 : 0) + (userNum === correctLeftAnswer ? 50 : 0),
          answers: [
            { question: 'How many bags total?', user: userAnswer, correct: correctAnswer, status: parseInt(userAnswer) === correctAnswer ? 'correct' : 'wrong' },
            { question: 'How many bags left?', user: userAnswerLeft, correct: correctLeftAnswer, status: userNum === correctLeftAnswer ? 'correct' : 'wrong' }
          ]
        })
      }
    } else {
      setCheckedLeft(true)
      setCorrectLeft(isCorrect)
      if (isCorrect) {
        setMessage({ type: 'success', text: POSITIVE[Math.floor(Math.random() * POSITIVE.length)] })
        if (onComplete) onComplete()
      } else {
        setMessage({ type: 'error', text: GENTLE[Math.floor(Math.random() * GENTLE.length)] })
      }
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 20, position: 'relative' }}>

      <div style={{ width: '100%', maxWidth: 900, background: 'rgba(255,255,255,0.95)', padding: 'clamp(20px, 4vw, 40px)', borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize: 'clamp(28px, 6vw, 42px)', textAlign: 'center', marginBottom: 32, fontWeight: 900, color: '#333' }}>Word Problems</h2>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
          {/* Image */}
          <img
            src="/Grade1/maths/ExerciseNine/bags2.png"
            alt="bags"
            style={{
              width: '100%',
              maxWidth: 500,
              height: 'auto',
              borderRadius: 12,
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
            }}
          />

          <div style={{
            fontSize: 'clamp(20px, 5vw, 28px)',
            fontWeight: 700,
            color: '#333',
            textAlign: 'center',
            marginBottom: 10
          }}>
            How many bags are there?
          </div>

          {/* Input and Check Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: 'clamp(12px, 3vw, 20px)',
            background: checked
              ? (correct ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)')
              : 'white',
            border: checked
              ? (correct ? '2px solid #4CAF50' : '2px solid #F44336')
              : '2px solid #ddd',
            borderRadius: 12,
            transition: 'all 0.3s ease'
          }}>
            <input
              type="text"
              inputMode="numeric"
              value={userAnswer}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleCheck()
              }}
              disabled={checked && correct}
              placeholder="#"
              style={{
                width: 'clamp(60px, 15vw, 80px)',
                fontSize: 'clamp(20px, 5vw, 28px)',
                padding: '12px',
                textAlign: 'center',
                border: '2px solid #999',
                borderRadius: 8,
                outline: 'none',
                background: (checked && correct) ? '#f1f8f1' : 'white',
                fontFamily: 'inherit',
                fontWeight: 700
              }}
            />

            <button
              onClick={handleCheck}
              disabled={!userAnswer || (checked && (mode === 'test' || correct))}
              style={{
                padding: '12px 24px',
                fontSize: 'clamp(14px, 4vw, 18px)',
                fontWeight: 700,
                background: mode === 'test'
                  ? (checked ? '#94a3b8' : '#667eea')
                  : checked
                    ? (correct ? '#4CAF50' : '#F44336')
                    : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: (!userAnswer || (checked && (mode === 'test' || correct))) ? 'not-allowed' : 'pointer',
                opacity: (!userAnswer || (checked && (mode === 'test' || correct))) ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
            >
              {mode === 'test'
                ? (checked ? 'Saved' : 'Submit')
                : checked
                  ? (correct ? '✓' : '✗')
                  : 'Check'}
            </button>
          </div>

          <div style={{
            fontSize: 'clamp(18px, 4.5vw, 24px)',
            fontWeight: 700,
            color: '#333',
            textAlign: 'center'
          }}>
            Take out {bagsToTakeOut} {bagsToTakeOut === 1 ? 'bag' : 'bags'}
          </div>

          <div style={{
            fontSize: 'clamp(20px, 5vw, 28px)',
            fontWeight: 700,
            color: '#333',
            textAlign: 'center',
            marginBottom: 10
          }}>
            How many bags are left?
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: 'clamp(12px, 3vw, 20px)',
            background: checkedLeft
              ? (correctLeft ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)')
              : 'white',
            border: checkedLeft
              ? (correctLeft ? '2px solid #4CAF50' : '2px solid #F44336')
              : '2px solid #ddd',
            borderRadius: 12,
            transition: 'all 0.3s ease'
          }}>
            <input
              type="text"
              inputMode="numeric"
              value={userAnswerLeft}
              onChange={(e) => handleInputLeftChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleCheckLeft()
              }}
              disabled={checkedLeft && correctLeft}
              placeholder="#"
              style={{
                width: 'clamp(60px, 15vw, 80px)',
                fontSize: 'clamp(20px, 5vw, 28px)',
                padding: '12px',
                textAlign: 'center',
                border: '2px solid #999',
                borderRadius: 8,
                outline: 'none',
                background: (checkedLeft && correctLeft) ? '#f1f8f1' : 'white',
                fontFamily: 'inherit',
                fontWeight: 700
              }}
            />

            <button
              onClick={handleCheckLeft}
              disabled={!userAnswerLeft || (checkedLeft && (mode === 'test' || correctLeft))}
              style={{
                padding: '12px 24px',
                fontSize: 'clamp(14px, 4vw, 18px)',
                fontWeight: 700,
                background: mode === 'test'
                  ? (checkedLeft ? '#94a3b8' : '#667eea')
                  : checkedLeft
                    ? (correctLeft ? '#4CAF50' : '#F44336')
                    : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: (!userAnswerLeft || (checkedLeft && (mode === 'test' || correctLeft))) ? 'not-allowed' : 'pointer',
                opacity: (!userAnswerLeft || (checkedLeft && (mode === 'test' || correctLeft))) ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
            >
              {mode === 'test'
                ? (checkedLeft ? 'Saved' : 'Submit')
                : checkedLeft
                  ? (correctLeft ? '✓' : '✗')
                  : 'Check'}
            </button>
          </div>

          {(mode === 'test' ? (checked && checkedLeft) : (checked && correct && checkedLeft && correctLeft)) && (
            <div ref={successRef} style={{ textAlign: 'center', marginTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
              <div style={{ fontSize: 'clamp(24px, 6vw, 36px)', fontWeight: 900, color: '#4CAF50', animation: 'popIn 600ms cubic-bezier(.2,.9,.2,1) both' }}>
                {mode === 'test' ? '🎉 Question Complete! 🎉' : '🎉 Excellent work! 🎉'}
              </div>
              {onNextExercise && (
                <button
                  onClick={onNextExercise}
                  style={{
                    padding: '12px 28px',
                    fontSize: 'clamp(16px, 4vw, 20px)',
                    fontWeight: 700,
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    animation: 'popIn 600ms cubic-bezier(.2,.9,.2,1) 300ms both'
                  }}
                  onMouseEnter={(e) => { e.target.style.background = '#764ba2' }}
                  onMouseLeave={(e) => { e.target.style.background = '#667eea' }}
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </div>
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
