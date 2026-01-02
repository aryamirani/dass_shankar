import React, {useState, useMemo, useEffect} from 'react'

// Convert number to words
function numberToWords(num) {
  if (num === 0) return 'zero'
  
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
  
  function convertLessThanThousand(n) {
    if (n === 0) return ''
    
    let result = ''
    
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' hundred'
      n %= 100
      if (n > 0) result += ' '
    }
    
    if (n >= 20) {
      result += tens[Math.floor(n / 10)]
      n %= 10
      if (n > 0) result += ' ' + ones[n]
    } else if (n >= 10) {
      result += teens[n - 10]
    } else if (n > 0) {
      result += ones[n]
    }
    
    return result
  }
  
  if (num < 0) return 'negative ' + numberToWords(-num)
  if (num < 1000) return convertLessThanThousand(num)
  
  return 'number too large'
}

// Normalize string for comparison (lowercase, trim, handle variations)
function normalizeAnswer(str) {
  return str.toLowerCase().trim().replace(/\s+/g, ' ')
}

const POSITIVE = [
  'Great job!', 'Perfect!', 'Excellent!', 'Awesome!', 'Well done!', 'Fantastic!', 'You got it!'
]

const GENTLE = [
  'Not quite! Try again.', 'Almost there! Check your spelling.', 'Nice try! Give it another go.'
]

export default function MathsExerciseOne({onBack, onNextExercise}){
  // Generate 5 random numbers between 0-500 with at least one 1-digit, one 2-digit, and one 3-digit
  const questions = useMemo(() => {
    const nums = []
    // Ensure at least one 1-digit (0-9)
    nums.push(Math.floor(Math.random() * 10))
    // Ensure at least one 2-digit (10-99)
    nums.push(Math.floor(Math.random() * 90) + 10)
    // Ensure at least one 3-digit (100-500)
    nums.push(Math.floor(Math.random() * 401) + 100)
    // Fill remaining with random numbers from 0-500
    for (let i = 0; i < 2; i++) {
      nums.push(Math.floor(Math.random() * 501))
    }
    // Shuffle the array
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]]
    }
    return nums.map((num, idx) => ({
      id: idx,
      number: num,
      answer: numberToWords(num),
      userAnswer: '',
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

  function handleInputChange(id, value) {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, userAnswer: value, checked: false, correct: null } : item
    ))
  }

  function handleCheck(id) {
    const item = items.find(i => i.id === id)
    if (!item || item.checked) return
    
    const userNorm = normalizeAnswer(item.userAnswer)
    const correctNorm = normalizeAnswer(item.answer)
    const isCorrect = userNorm === correctNorm
    
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
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',padding:20,position:'relative',background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div style={{position:'absolute',left:20,top:20}}>
        <button className="action-btn" onClick={onBack} style={{padding:'8px 12px'}}>Back</button>
      </div>
      <div style={{position:'absolute',right:20,top:20}}>
        <button className="action-btn secondary" onClick={onNextExercise} style={{padding:'8px 12px'}}>Skip to next assessment</button>
      </div>

      <div style={{width:'100%',maxWidth:900,background:'rgba(255,255,255,0.95)',padding:40,borderRadius:20,boxShadow:'0 10px 40px rgba(0,0,0,0.2)'}}>
        <h2 style={{fontSize:42,textAlign:'center',marginBottom:8,fontWeight:900,color:'#333'}}>Write the names for the following numbers</h2>
        <div style={{textAlign:'center',marginBottom:24,fontSize:20,color:'#555'}}>
          Correct: {completedCount} / {totalCount}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {items.map(item => (
            <div key={item.id} style={{
              display:'flex',
              alignItems:'center',
              gap:16,
              padding:20,
              background: item.checked 
                ? (item.correct ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)')
                : 'white',
              border: item.checked 
                ? (item.correct ? '2px solid #4CAF50' : '2px solid #F44336')
                : '2px solid #ddd',
              borderRadius:12,
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                fontSize:32,
                fontWeight:900,
                minWidth:80,
                textAlign:'right',
                color:'#333'
              }}>
                {item.number}
              </div>
              
              <div style={{flex:1,height:2,background:'#333',margin:'0 10px'}} />
              
              <input
                type="text"
                value={item.userAnswer}
                onChange={(e) => handleInputChange(item.id, e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleCheck(item.id)
                }}
                disabled={item.checked && item.correct}
                placeholder="Type the number name here"
                style={{
                  flex:2,
                  fontSize:20,
                  padding:'12px 16px',
                  border:'2px solid #999',
                  borderRadius:8,
                  outline:'none',
                  background: (item.checked && item.correct) ? '#f1f8f1' : 'white',
                  fontFamily: 'inherit'
                }}
              />
              
              <button
                onClick={() => handleCheck(item.id)}
                disabled={!item.userAnswer || (item.checked && item.correct)}
                style={{
                  padding:'12px 24px',
                  fontSize:18,
                  fontWeight:700,
                  background: item.checked 
                    ? (item.correct ? '#4CAF50' : '#F44336')
                    : '#667eea',
                  color:'white',
                  border:'none',
                  borderRadius:8,
                  cursor: (!item.userAnswer || (item.checked && item.correct)) ? 'not-allowed' : 'pointer',
                  opacity: (!item.userAnswer || (item.checked && item.correct)) ? 0.5 : 1,
                  transition: 'all 0.2s'
                }}
              >
                {item.checked 
                  ? (item.correct ? '✓ Correct' : '✗ Try Again')
                  : 'Check'}
              </button>
            </div>
          ))}
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
