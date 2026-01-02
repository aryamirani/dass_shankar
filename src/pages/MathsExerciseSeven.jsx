import React, {useState, useMemo, useEffect} from 'react'

const POSITIVE = [
  'Great job!', 'Perfect!', 'Excellent!', 'Awesome!', 'Well done!', 'Fantastic!', 'You got it!'
]

const GENTLE = [
  'Not quite! Try again.', 'Almost there! Check your answer.', 'Nice try! Give it another go.'
]

export default function MathsExerciseSeven({onBack, onNextExercise}){
  // Generate 5 random 3-digit numbers (100-999)
  const questions = useMemo(() => {
    const nums = []
    for (let i = 0; i < 5; i++) {
      nums.push(Math.floor(Math.random() * 900) + 100)
    }
    
    return nums.map((num, idx) => {
      const numStr = num.toString()
      return {
        id: idx,
        number: num,
        hundreds: parseInt(numStr[0]),
        tens: parseInt(numStr[1]),
        ones: parseInt(numStr[2]),
        hundredsInput: '',
        tensInput: '',
        onesInput: '',
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

  function handleInputChange(id, field, value) {
    const digit = value.replace(/[^0-9]/g, '').slice(-1)
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: digit, checked: false, correct: null }
      }
      return item
    }))
  }

  function checkAll() {
    let hasErrors = false
    setItems(prev => prev.map(item => {
      if (item.checked && item.correct) return item
      
      const hundredsCorrect = parseInt(item.hundredsInput) === item.hundreds
      const tensCorrect = parseInt(item.tensInput) === item.tens
      const onesCorrect = parseInt(item.onesInput) === item.ones
      const isCorrect = hundredsCorrect && tensCorrect && onesCorrect
      
      if (!isCorrect) hasErrors = true
      return { 
        ...item, 
        checked: true, 
        correct: isCorrect,
        hundredsInput: isCorrect ? item.hundredsInput : '',
        tensInput: isCorrect ? item.tensInput : '',
        onesInput: isCorrect ? item.onesInput : ''
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
  const allFilled = items.every(item => item.hundredsInput && item.tensInput && item.onesInput)

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',padding:20,position:'relative',background:'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'}}>
      <div style={{position:'absolute',left:20,top:20}}>
        <button className="action-btn" onClick={onBack} style={{padding:'8px 12px'}}>Back</button>
      </div>
      <div style={{position:'absolute',right:20,top:20}}>
        <button className="action-btn secondary" onClick={onNextExercise} style={{padding:'8px 12px'}}>Skip to next assessment</button>
      </div>

      <div style={{width:'100%',maxWidth:900,background:'rgba(255,255,255,0.95)',padding:40,borderRadius:20,boxShadow:'0 10px 40px rgba(0,0,0,0.2)'}}>
        <h2 style={{fontSize:42,textAlign:'center',marginBottom:8,fontWeight:900,color:'#333'}}>Value Chart</h2>
        <p style={{textAlign:'center',fontSize:18,color:'#666',marginBottom:24}}>Fill in the place values for each number</p>
        <div style={{textAlign:'center',marginBottom:24,fontSize:20,color:'#555'}}>
          Correct: {completedCount} / {totalCount}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {items.map(item => (
            <div key={item.id} style={{
              padding:24,
              background: item.checked 
                ? (item.correct ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)')
                : 'white',
              border: item.checked 
                ? (item.correct ? '2px solid #4CAF50' : '2px solid #F44336')
                : '2px solid #ddd',
              borderRadius:12,
              transition: 'all 0.3s ease'
            }}>
              <div style={{display:'flex',alignItems:'center',gap:20,flexWrap:'wrap'}}>
                {/* Number */}
                <div style={{
                  fontSize:40,
                  fontWeight:900,
                  color:'#333',
                  minWidth:100
                }}>
                  {item.number} =
                </div>

                {/* Hundreds */}
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={item.hundredsInput}
                    onChange={(e) => handleInputChange(item.id, 'hundredsInput', e.target.value)}
                    disabled={item.checked && item.correct}
                    style={{
                      width:50,
                      height:60,
                      fontSize:28,
                      fontWeight:700,
                      border:'2px solid #666',
                      borderRadius:8,
                      outline:'none',
                      textAlign:'center',
                      background: (item.checked && item.correct) ? '#f1f8f1' : 'white',
                      fontFamily: 'inherit'
                    }}
                  />
                  <span style={{fontSize:22,fontWeight:600,color:'#444'}}>hundred</span>
                </div>

                {/* Tens */}
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={item.tensInput}
                    onChange={(e) => handleInputChange(item.id, 'tensInput', e.target.value)}
                    disabled={item.checked && item.correct}
                    style={{
                      width:50,
                      height:60,
                      fontSize:28,
                      fontWeight:700,
                      border:'2px solid #666',
                      borderRadius:8,
                      outline:'none',
                      textAlign:'center',
                      background: (item.checked && item.correct) ? '#f1f8f1' : 'white',
                      fontFamily: 'inherit'
                    }}
                  />
                  <span style={{fontSize:22,fontWeight:600,color:'#444'}}>tens</span>
                </div>

                {/* Ones */}
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={item.onesInput}
                    onChange={(e) => handleInputChange(item.id, 'onesInput', e.target.value)}
                    disabled={item.checked && item.correct}
                    style={{
                      width:50,
                      height:60,
                      fontSize:28,
                      fontWeight:700,
                      border:'2px solid #666',
                      borderRadius:8,
                      outline:'none',
                      textAlign:'center',
                      background: (item.checked && item.correct) ? '#f1f8f1' : 'white',
                      fontFamily: 'inherit'
                    }}
                  />
                  <span style={{fontSize:22,fontWeight:600,color:'#444'}}>ones</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{textAlign:'center',marginTop:30}}>
          <button
            onClick={checkAll}
            disabled={!allFilled}
            style={{
              padding:'16px 40px',
              fontSize:22,
              fontWeight:700,
              background: !allFilled ? '#ccc' : '#ff9a9e',
              color:'white',
              border:'none',
              borderRadius:12,
              cursor: !allFilled ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s'
            }}
          >
            Check All Answers
          </button>
        </div>

        {completedCount === totalCount && (
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
