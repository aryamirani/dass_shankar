import React, {useState, useMemo, useEffect} from 'react'

const POSITIVE = [
  'Great job!', 'Perfect!', 'Excellent!', 'Awesome!', 'Well done!', 'Fantastic!', 'You got it!'
]

const GENTLE = [
  'Not quite! Try again.', 'Almost there! Check your answer.', 'Nice try! Give it another go.'
]

export default function MathsExerciseThree({onBack, onNextExercise}){
  // Generate a sequence of 20 consecutive 3-digit numbers with ~10 pre-filled
  const questions = useMemo(() => {
    const gridSize = 20
    const preFillCount = 10
    
    // Generate a random starting 3-digit number (100-979 to ensure we can have 20 consecutive)
    const startNumber = Math.floor(Math.random() * 880) + 100 // 100-979
    
    // Create sequence of 20 consecutive numbers
    const numbers = Array.from({length: gridSize}, (_, i) => startNumber + i)
    
    // Randomly select which ones to pre-fill
    const indices = Array.from({length: gridSize}, (_, i) => i)
    // Shuffle indices
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]]
    }
    const preFilledIndices = new Set(indices.slice(0, preFillCount))
    
    return numbers.map((num, idx) => ({
      id: idx,
      number: num,
      preFilled: preFilledIndices.has(idx),
      digits: preFilledIndices.has(idx) ? num.toString().split('') : ['', '', ''],
      checked: false,
      correct: null
    }))
  }, [])

  const [items, setItems] = useState(questions)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 2500)
      return () => clearTimeout(t)
    }
  }, [message])

  function handleInputChange(id, boxIndex, value) {
    // Only allow single digit
    const digit = value.replace(/[^0-9]/g, '').slice(-1)
    setItems(prev => prev.map(item => {
      if (item.id === id && !item.preFilled) {
        const newDigits = [...item.digits]
        newDigits[boxIndex] = digit
        return { ...item, digits: newDigits, checked: false, correct: null }
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
      if (item && !item.preFilled) {
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
      }
    }
  }

  function checkAll() {
    let hasErrors = false
    setItems(prev => prev.map(item => {
      if (item.preFilled || (item.checked && item.correct)) {
        return item
      }
      const userAnswer = item.digits.join('')
      const userNum = parseInt(userAnswer, 10) || 0
      const isCorrect = userNum === item.number
      if (!isCorrect) hasErrors = true
      return { ...item, checked: true, correct: isCorrect, digits: isCorrect ? item.digits : ['', '', ''] }
    }))
    
    if (!hasErrors) {
      setMessage({ type: 'success', text: POSITIVE[Math.floor(Math.random() * POSITIVE.length)] })
    } else {
      setMessage({ type: 'error', text: 'Some answers are incorrect. Please fix the highlighted ones!' })
    }
  }

  const completedCount = items.filter(i => (i.preFilled || (i.checked && i.correct))).length
  const totalCount = items.length
  const editableCount = items.filter(i => !i.preFilled).length
  const correctEditableCount = items.filter(i => !i.preFilled && i.checked && i.correct).length

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',padding:20,position:'relative',background:'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
      <div style={{position:'absolute',left:20,top:20}}>
        <button className="action-btn" onClick={onBack} style={{padding:'8px 12px'}}>Back</button>
      </div>
      <div style={{position:'absolute',right:20,top:20}}>
        <button className="action-btn secondary" onClick={onNextExercise} style={{padding:'8px 12px'}}>Skip to next assessment</button>
      </div>

      <div style={{width:'100%',maxWidth:1100,background:'rgba(255,255,255,0.95)',padding:40,borderRadius:20,boxShadow:'0 10px 40px rgba(0,0,0,0.2)'}}>
        <h2 style={{fontSize:42,textAlign:'center',marginBottom:8,fontWeight:900,color:'#333'}}>Fill in the missing numbers</h2>
        <div style={{textAlign:'center',marginBottom:24,fontSize:20,color:'#555'}}>
          Completed: {correctEditableCount} / {editableCount}
        </div>

        <div style={{display:'flex',flexWrap:'wrap',gap:16,justifyContent:'flex-start'}}>
          {items.map(item => (
            <div key={item.id} style={{
              display:'flex',
              alignItems:'center',
              gap:12,
              padding:16,
              background: item.preFilled 
                ? 'rgba(200, 200, 200, 0.15)'
                : (item.checked 
                  ? (item.correct ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)')
                  : 'white'),
              border: item.preFilled
                ? '2px solid #999'
                : (item.checked 
                  ? (item.correct ? '2px solid #4CAF50' : '2px solid #F44336')
                  : '2px solid #ddd'),
              borderRadius:12,
              transition: 'all 0.3s ease',
              minWidth:'fit-content'
            }}>
              <div style={{display:'flex',gap:6,flex:1}}>
                {[0, 1, 2].map(boxIndex => (
                  <input
                    key={boxIndex}
                    id={`input-${item.id}-${boxIndex}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={item.digits[boxIndex]}
                    onChange={(e) => handleInputChange(item.id, boxIndex, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(item.id, boxIndex, e)}
                    disabled={item.preFilled || (item.checked && item.correct)}
                    style={{
                      width:50,
                      height:60,
                      fontSize:28,
                      fontWeight:700,
                      border: item.preFilled ? '2px solid #999' : '2px solid #666',
                      borderRadius:8,
                      outline:'none',
                      textAlign:'center',
                      background: item.preFilled 
                        ? '#e8e8e8'
                        : ((item.checked && item.correct) ? '#f1f8f1' : 'white'),
                      color: item.preFilled ? '#555' : '#000',
                      fontFamily: 'inherit',
                      cursor: item.preFilled ? 'not-allowed' : 'text'
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{textAlign:'center',marginTop:30}}>
          <button
            onClick={checkAll}
            disabled={items.some(item => !item.preFilled && item.digits.some(d => !d))}
            style={{
              padding:'16px 40px',
              fontSize:22,
              fontWeight:700,
              background: items.some(item => !item.preFilled && item.digits.some(d => !d)) ? '#ccc' : '#00f2fe',
              color:'white',
              border:'none',
              borderRadius:12,
              cursor: items.some(item => !item.preFilled && item.digits.some(d => !d)) ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s'
            }}
          >
            Check All Answers
          </button>
        </div>

        {correctEditableCount === editableCount && (
          <div style={{textAlign:'center',marginTop:30,fontSize:36,fontWeight:900,color:'#4CAF50',animation:'popIn 600ms cubic-bezier(.2,.9,.2,1) both'}}>
            🎉 All done — Excellent work! 🎉
          </div>
        )}
      </div>

      {message && (
        <div style={{
          position:'fixed',
          top:40,
          left:'50%',
          transform:'translateX(-50%)',
          padding:'14px 30px',
          fontSize: message.type === 'success' ? 32 : 26,
          fontWeight:800,
          color: message.type === 'success' ? '#155724' : '#856404',
          background: message.type === 'success' ? 'rgba(212,237,218,0.98)' : 'rgba(255,243,205,0.95)',
          borderRadius:14,
          boxShadow:'0 8px 22px rgba(0,0,0,0.2)',
          zIndex:1000
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
