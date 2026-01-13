import React, { useState, useMemo, useEffect } from 'react'

const POSITIVE = [
  '🌟 Great job!', '👍 Perfect!', '🤩 Excellent!', '🚀 Awesome!', '🎉 Well done!', '✨ Fantastic!', '🧠 You got it!'
]

const GENTLE = [
  'Not quite! Try again.', 'Almost there! Check your answer.', 'Nice try! Use the calculator to help!'
]

export default function MathsExerciseEight({ onBack, onComplete }) {
  // Generate 5 random math questions (mix of +, -, ×, ÷)
  const questions = useMemo(() => {
    const baseOps = ['+', '-', '×', '÷']
    const randomOp = baseOps[Math.floor(Math.random() * baseOps.length)]
    const finalOps = [...baseOps, randomOp]

    // Shuffle the operations
    for (let i = finalOps.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalOps[i], finalOps[j]] = [finalOps[j], finalOps[i]];
    }

    const qs = []

    for (let i = 0; i < 5; i++) {
      const op = finalOps[i]
      let num1, num2, answer

      if (op === '+') {
        // Addition: both up to 3 digits
        num1 = Math.floor(Math.random() * 900) + 100
        num2 = Math.floor(Math.random() * 900) + 100
        answer = num1 + num2
      } else if (op === '-') {
        // Subtraction: both up to 3 digits, ensure positive result
        num1 = Math.floor(Math.random() * 900) + 100
        num2 = Math.floor(Math.random() * num1)
        answer = num1 - num2
      } else if (op === '×') {
        // Multiplication: one 3-digit, one less than 3 digits
        num1 = Math.floor(Math.random() * 900) + 100
        num2 = Math.floor(Math.random() * 90) + 10
        answer = num1 * num2
      } else { // ÷
        // Division: divisor is smaller, ensure whole number result
        num2 = Math.floor(Math.random() * 90) + 10 // divisor (10-99)
        const quotient = Math.floor(Math.random() * 90) + 10 // result (10-99)
        num1 = num2 * quotient // dividend
        answer = quotient
      }

      qs.push({
        id: i,
        num1,
        num2,
        operation: op,
        answer,
        userAnswer: '',
        checked: false,
        correct: null
      })
    }

    return qs
  }, [])

  const [items, setItems] = useState(questions)
  const [message, setMessage] = useState(null)

  // Calculator state
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 1500)
      return () => clearTimeout(t)
    }
  }, [message])

  // Calculator functions
  function inputDigit(digit) {
    if (waitingForOperand) {
      setDisplay(String(digit))
      setExpression(expression + digit)
      setWaitingForOperand(false)
    } else {
      const newDisplay = display === '0' ? String(digit) : display + digit
      setDisplay(newDisplay)
      if (expression && operation) {
        setExpression(expression + digit)
      } else {
        setExpression(newDisplay)
      }
    }
  }

  function inputDecimal() {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  function clearDisplay() {
    setDisplay('0')
    setExpression('')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  function performOperation(nextOperation) {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
      setExpression(display + ' ' + nextOperation + ' ')
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
      setExpression(String(newValue) + ' ' + nextOperation + ' ')
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  function calculate(firstValue, secondValue, op) {
    switch (op) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return firstValue / secondValue
      default:
        return secondValue
    }
  }

  function handleEquals() {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setExpression(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  // Question handling
  function handleInputChange(id, value) {
    const numericValue = value.replace(/[^0-9]/g, '')
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, userAnswer: numericValue, checked: false, correct: null } : item
    ))
  }

  function checkAll() {
    let hasErrors = false
    setItems(prev => prev.map(item => {
      if (item.checked && item.correct) return item

      const userNum = parseInt(item.userAnswer, 10)
      const isCorrect = userNum === item.answer

      if (!isCorrect) hasErrors = true
      return {
        ...item,
        checked: true,
        correct: isCorrect,
        userAnswer: isCorrect ? item.userAnswer : ''
      }
    }))

    if (!hasErrors) {
      setMessage({ type: 'success', text: POSITIVE[Math.floor(Math.random() * POSITIVE.length)] })
    } else {
      setMessage({ type: 'error', text: 'Some answers are incorrect. Please try again!' })
    }
  }

  const completedCount = items.filter(i => i.checked && i.correct).length
  const totalCount = items.length
  const allFilled = items.every(item => item.userAnswer)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 20, position: 'relative' }}>
      <div style={{ position: 'absolute', left: 20, top: 20 }}>
        <button className="action-btn" onClick={onBack} style={{ padding: '8px 12px' }}>Back</button>
      </div>

      <div style={{ width: '100%', maxWidth: 1200, background: 'rgba(255,255,255,0.95)', padding: 40, borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize: 42, textAlign: 'center', marginBottom: 8, fontWeight: 900, color: '#333' }}>Calculator Practice</h2>
        <p style={{ textAlign: 'center', fontSize: 18, color: '#666', marginBottom: 24 }}>Use the calculator to solve the problems</p>
        <div style={{ textAlign: 'center', marginBottom: 24, fontSize: 20, color: '#555' }}>
          Correct: {completedCount} / {totalCount}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 30 }}>
          {/* Questions Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {items.map(item => (
              <div key={item.id} style={{
                padding: 20,
                background: item.checked
                  ? (item.correct ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)')
                  : 'white',
                border: item.checked
                  ? (item.correct ? '2px solid #4CAF50' : '2px solid #F44336')
                  : '2px solid #ddd',
                borderRadius: 12,
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{
                    fontSize: 32,
                    fontWeight: 900,
                    color: '#333'
                  }}>
                    {item.num1} {item.operation} {item.num2} =
                  </div>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={item.userAnswer}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    disabled={item.checked && item.correct}
                    placeholder="Type your answer here"
                    style={{
                      width: '100%',
                      fontSize: 24,
                      fontWeight: 600,
                      padding: '12px 20px',
                      border: '2px solid #999',
                      borderRadius: 8,
                      outline: 'none',
                      background: (item.checked && item.correct) ? '#f1f8f1' : '#f9f9f9',
                      fontFamily: 'inherit',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
                    }}
                  />
                </div>
              </div>
            ))}

            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <button
                onClick={checkAll}
                disabled={!allFilled}
                style={{
                  padding: '16px 40px',
                  fontSize: 22,
                  fontWeight: 700,
                  background: !allFilled ? '#ccc' : '#8ec5fc',
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
              <div style={{ textAlign: 'center', marginTop: 20, fontSize: 32, fontWeight: 900, color: '#4CAF50', animation: 'popIn 600ms cubic-bezier(.2,.9,.2,1) both' }}>
                🎉 All done — Excellent work! 🎉
                {onComplete && !items.every(i => i.completionTriggered) && (() => {
                  onComplete()
                  // Prevent multiple triggers
                  setItems(prev => prev.map(i => ({ ...i, completionTriggered: true })))
                })()}
              </div>
            )}
          </div>

          {/* Calculator Section */}
          <div style={{
            background: 'linear-gradient(145deg, #2c3e50, #34495e)',
            padding: 20,
            borderRadius: 16,
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            position: 'sticky',
            top: 20,
            alignSelf: 'flex-start'
          }}>
            <div style={{
              background: '#1a1a2e',
              padding: 20,
              borderRadius: 8,
              marginBottom: 16,
              minHeight: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              fontSize: 36,
              fontWeight: 700,
              color: '#fff',
              wordBreak: 'break-all'
            }}>
              {expression || display}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              <button onClick={clearDisplay} style={{ ...calcButtonStyle('#e74c3c', '#c0392b') }}>C</button>
              <button onClick={() => performOperation('÷')} style={{ ...calcButtonStyle('#3498db', '#2980b9') }}>÷</button>
              <button onClick={() => performOperation('×')} style={{ ...calcButtonStyle('#3498db', '#2980b9') }}>×</button>
              <button onClick={() => performOperation('-')} style={{ ...calcButtonStyle('#3498db', '#2980b9') }}>-</button>

              <button onClick={() => inputDigit(7)} style={{ ...calcButtonStyle('#95a5a6', '#7f8c8d') }}>7</button>
              <button onClick={() => inputDigit(8)} style={{ ...calcButtonStyle('#95a5a6', '#7f8c8d') }}>8</button>
              <button onClick={() => inputDigit(9)} style={{ ...calcButtonStyle('#95a5a6', '#7f8c8d') }}>9</button>
              <button onClick={() => performOperation('+')} style={{ ...calcButtonStyle('#3498db', '#2980b9') }}>+</button>

              <button onClick={() => inputDigit(4)} style={{ ...calcButtonStyle('#95a5a6', '#7f8c8d') }}>4</button>
              <button onClick={() => inputDigit(5)} style={{ ...calcButtonStyle('#95a5a6', '#7f8c8d') }}>5</button>
              <button onClick={() => inputDigit(6)} style={{ ...calcButtonStyle('#95a5a6', '#7f8c8d') }}>6</button>
              <button onClick={handleEquals} style={{ ...calcButtonStyle('#2ecc71', '#27ae60'), gridRow: 'span 2' }}>=</button>

              <button onClick={() => inputDigit(1)} style={{ ...calcButtonStyle('#95a5a6', '#7f8c8d') }}>1</button>
              <button onClick={() => inputDigit(2)} style={{ ...calcButtonStyle('#95a5a6', '#7f8c8d') }}>2</button>
              <button onClick={() => inputDigit(3)} style={{ ...calcButtonStyle('#95a5a6', '#7f8c8d') }}>3</button>

              <button onClick={() => inputDigit(0)} style={{ ...calcButtonStyle('#95a5a6', '#7f8c8d'), gridColumn: 'span 2' }}>0</button>
              <button onClick={inputDecimal} style={{ ...calcButtonStyle('#95a5a6', '#7f8c8d') }}>.</button>
            </div>
          </div>
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

function calcButtonStyle(bg, hoverBg) {
  return {
    padding: '20px',
    fontSize: '24px',
    fontWeight: '700',
    background: bg,
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    ':hover': {
      background: hoverBg
    }
  }
}
