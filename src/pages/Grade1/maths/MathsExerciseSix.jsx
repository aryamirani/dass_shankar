import React, { useState, useMemo, useEffect } from 'react'

const POSITIVE = [
  '👍 Good', '✅ Yes', '🌟 Nice', '🎉 Great', '😃 Yay', '👌 Ok'
]

const GENTLE = [
  '👎 Retry', '☹️ Try again', '❌ Wrong'
]
export default function MathsExerciseSix({ onBack, onNextExercise }) {
  // Generate 2 sets of 5 random numbers
  const questions = useMemo(() => {
    const sets = []
    for (let setIdx = 0; setIdx < 2; setIdx++) {
      const nums = []
      // Generate 5 unique random numbers between 1-500
      while (nums.length < 5) {
        const num = Math.floor(Math.random() * 500) + 1
        if (!nums.includes(num)) {
          nums.push(num)
        }
      }

      // Shuffle the numbers
      const shuffled = [...nums]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }

      sets.push({
        id: setIdx,
        numbers: shuffled,
        correctOrder: [...nums].sort((a, b) => a - b),
        checked: false,
        correct: null
      })
    }
    return sets
  }, [])

  const [items, setItems] = useState(questions)
  const [message, setMessage] = useState(null)
  const [draggedItem, setDraggedItem] = useState(null)

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 2000)
      return () => clearTimeout(t)
    }
  }, [message])

  function handleDragStart(setId, index) {
    setDraggedItem({ setId, index })
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleDrop(setId, dropIndex) {
    if (!draggedItem || draggedItem.setId !== setId) return

    const dragIndex = draggedItem.index
    if (dragIndex === dropIndex) return

    setItems(prev => prev.map(item => {
      if (item.id === setId) {
        const newNumbers = [...item.numbers]
        const [draggedNumber] = newNumbers.splice(dragIndex, 1)
        newNumbers.splice(dropIndex, 0, draggedNumber)
        return { ...item, numbers: newNumbers, checked: false, correct: null }
      }
      return item
    }))

    setDraggedItem(null)
  }

  function checkAll() {
    let hasErrors = false
    setItems(prev => prev.map(item => {
      // Always check the current state, don't skip already correct items
      const isCorrect = JSON.stringify(item.numbers) === JSON.stringify(item.correctOrder)
      if (!isCorrect) hasErrors = true

      return { ...item, checked: true, correct: isCorrect }
    }))

    if (!hasErrors) {
      setMessage({ type: 'success', text: POSITIVE[Math.floor(Math.random() * POSITIVE.length)] })
    } else {
      setMessage({ type: 'error', text: 'Some sequences are incorrect. Please rearrange them!' })
    }
  }

  const completedCount = items.filter(i => i.checked && i.correct).length
  const totalCount = items.length

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 20, position: 'relative' }}>

      <div style={{ width: '100%', maxWidth: 1000, background: 'rgba(255,255,255,0.95)', padding: 'clamp(20px, 4vw, 40px)', borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize: 'clamp(24px, 5vw, 42px)', textAlign: 'center', marginBottom: 8, fontWeight: 900, color: '#333' }}>Arrange numbers from smallest to biggest</h2>
        <p style={{ textAlign: 'center', fontSize: 'clamp(16px, 4vw, 18px)', color: '#666', marginBottom: 24 }}>Drag and drop the numbers to arrange them</p>
        <div style={{ textAlign: 'center', marginBottom: 24, fontSize: 'clamp(16px, 4vw, 20px)', color: '#555' }}>
          Correct: {completedCount} / {totalCount}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
          {items.map(item => (
            <div key={item.id} style={{
              padding: 'clamp(16px, 4vw, 30px)',
              background: item.checked
                ? (item.correct ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)')
                : 'white',
              border: item.checked
                ? (item.correct ? '3px solid #4CAF50' : '3px solid #F44336')
                : '3px solid #ddd',
              borderRadius: 16,
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: 'clamp(18px, 4vw, 20px)', fontWeight: 700, color: '#666', marginBottom: 16, textAlign: 'center' }}>
                Set {item.id + 1}
              </div>
              <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 16px)', justifyContent: 'center', flexWrap: 'wrap' }}>
                {item.numbers.map((num, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    draggable={!(item.checked && item.correct)}
                    onDragStart={() => handleDragStart(item.id, index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(item.id, index)}
                    style={{
                      width: 'clamp(60px, 15vw, 100px)',
                      height: 'clamp(60px, 15vw, 100px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'clamp(24px, 5vw, 36px)',
                      fontWeight: 900,
                      background: item.checked && item.correct
                        ? 'linear-gradient(135deg, #4CAF50, #66BB6A)'
                        : 'linear-gradient(135deg, #FF6B6B, #FFE66D)',
                      color: 'white',
                      borderRadius: 12,
                      cursor: (item.checked && item.correct) ? 'default' : 'grab',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      userSelect: 'none'
                    }}
                    onMouseDown={(e) => {
                      if (!(item.checked && item.correct)) {
                        e.currentTarget.style.cursor = 'grabbing'
                      }
                    }}
                    onMouseUp={(e) => {
                      if (!(item.checked && item.correct)) {
                        e.currentTarget.style.cursor = 'grab'
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (!(item.checked && item.correct)) {
                        e.currentTarget.style.transform = 'scale(1.05)'
                        e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.25)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
              {item.checked && item.correct && (
                <div style={{ marginTop: 16, textAlign: 'center', fontSize: 'clamp(16px, 4vw, 18px)', color: '#4CAF50', fontWeight: 700 }}>
                  ✓ Correct: {item.correctOrder.join(' < ')}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <button
            onClick={checkAll}
            style={{
              padding: '16px 40px',
              fontSize: 22,
              fontWeight: 700,
              background: '#fcb69f',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s'
            }}
          >
            Check All Answers
          </button>
        </div>

        {completedCount === totalCount && (
          <div style={{ textAlign: 'center', marginTop: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 900, color: '#4CAF50', animation: 'popIn 600ms cubic-bezier(.2,.9,.2,1) both' }}>
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
