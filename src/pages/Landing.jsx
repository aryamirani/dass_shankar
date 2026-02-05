import React, { useState } from 'react'

export default function Landing({ onVocabulary, onHealth, onMaths, onEnglish, onScience, onComputer, onEVS }) {
  const [selectedGrade, setSelectedGrade] = useState(null)

  return (
    <div id="landing" className="landing-root" role="main">
      <div className="landing-inner" style={{ padding: 'clamp(20px, 4vw, 40px)', width: '100%' }}>
        <h1 style={{ fontSize: 'clamp(32px, 8vw, 64px)', lineHeight: 1.1, margin: 8, fontWeight: 900, wordBreak: 'break-word' }}>WELCOME TO S-LEARN</h1>
        <h1 style={{ fontSize: 'clamp(24px, 6vw, 64px)', lineHeight: 1.1, margin: 8, fontWeight: 900, wordBreak: 'break-word' }}>BY SHANKAR FOUNDATION</h1>
        
        {!selectedGrade ? (
          <>
            <h2 style={{ fontSize: 'clamp(18px, 4vw, 24px)', color: '#444', marginTop: 12 }}>Choose a grade</h2>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}>
              <button className="action-btn" onClick={() => setSelectedGrade('X')} style={{ padding: '18px 28px', fontSize: 20 }}>Grade X</button>
              <button className="action-btn" onClick={() => setSelectedGrade('X2')} style={{ padding: '18px 28px', fontSize: 20 }}>Grade X2</button>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 'clamp(18px, 4vw, 24px)', color: '#444', marginTop: 12 }}>
              Choose a subject for Grade {selectedGrade}
              <button 
                onClick={() => setSelectedGrade(null)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#666',  
                  textDecoration: 'underline', 
                  cursor: 'pointer', 
                  marginLeft: 10,
                  fontSize: '0.8em' 
                }}>
                (Change)
              </button>
            </h2>

            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}>
              {selectedGrade === 'X' && (
                <>
                  <button className="action-btn" onClick={onVocabulary} style={{ padding: '18px 28px', fontSize: 20 }}>Vocabulary</button>
                  <button className="action-btn" onClick={onMaths} style={{ padding: '18px 28px', fontSize: 20 }}>Maths</button>
                  <button className="action-btn" onClick={onComputer} style={{ padding: '14px 24px', fontSize: 'clamp(16px, 4vw, 20px)', flex: '1 1 auto', minWidth: '140px', maxWidth: '300px' }}>Computer</button>
                  <button className="action-btn" onClick={onEVS} style={{ padding: '18px 28px', fontSize: 20 }}>EVS</button>
                </>
              )}
              
              {selectedGrade === 'X2' && (
                <>
                  <button className="action-btn" onClick={onHealth} style={{ padding: '18px 28px', fontSize: 20 }}>Health Problems</button>
                  <button className="action-btn" onClick={onEnglish} style={{ padding: '18px 28px', fontSize: 20 }}>English</button>
                  <button className="action-btn" onClick={onScience} style={{ padding: '18px 28px', fontSize: 20 }}>Science</button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

