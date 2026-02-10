import React, { useState } from 'react'

export default function Landing({ onVocabulary, onHealth, onMaths, onEnglish, onScience, onComputer, onEVS }) {
  const [selectedGrade, setSelectedGrade] = useState(null)

  return (
    <div id="landing" className="landing-root" role="main" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9' }}>
      <div className="landing-inner" style={{ padding: 'clamp(20px, 4vw, 40px)', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(32px, 8vw, 64px)', lineHeight: 1.1, margin: 8, fontWeight: 900, wordBreak: 'break-word', color: '#f1f5f9' }}>WELCOME TO S-LEARN</h1>
        <h1 style={{ fontSize: 'clamp(24px, 6vw, 64px)', lineHeight: 1.1, margin: 8, fontWeight: 900, wordBreak: 'break-word', color: '#667eea' }}>BY SHANKAR FOUNDATION</h1>

        {!selectedGrade ? (
          <>
            <h2 style={{ fontSize: 'clamp(18px, 4vw, 24px)', color: '#94a3b8', marginTop: 12 }}>Choose a grade</h2>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}>
              <button
                className="action-btn"
                onClick={() => setSelectedGrade('1')}
                style={{
                  padding: '18px 28px',
                  fontSize: 20,
                  background: '#1e293b',
                  color: '#f1f5f9',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#334155'
                  e.target.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#1e293b'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                Grade 1
              </button>
              <button
                className="action-btn"
                onClick={() => setSelectedGrade('2')}
                style={{
                  padding: '18px 28px',
                  fontSize: 20,
                  background: '#1e293b',
                  color: '#f1f5f9',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#334155'
                  e.target.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#1e293b'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                Grade 2
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 'clamp(18px, 4vw, 24px)', color: '#94a3b8', marginTop: 12 }}>
              Choose a subject for Grade {selectedGrade}
              <button
                onClick={() => setSelectedGrade(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  marginLeft: 10,
                  fontSize: '0.8em'
                }}>
                (Change)
              </button>
            </h2>

            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}>
              {selectedGrade === '1' && (
                <>
                  <button className="action-btn" onClick={onVocabulary} style={{ padding: '18px 28px', fontSize: 20, background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '12px', cursor: 'pointer' }}>Vocabulary</button>
                  <button className="action-btn" onClick={onMaths} style={{ padding: '18px 28px', fontSize: 20, background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '12px', cursor: 'pointer' }}>Maths</button>
                  <button className="action-btn" onClick={onComputer} style={{ padding: '14px 24px', fontSize: 'clamp(16px, 4vw, 20px)', flex: '1 1 auto', minWidth: '140px', maxWidth: '300px', background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '12px', cursor: 'pointer' }}>Computer</button>
                  <button className="action-btn" onClick={onEVS} style={{ padding: '18px 28px', fontSize: 20, background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '12px', cursor: 'pointer' }}>EVS</button>
                </>
              )}

              {selectedGrade === '2' && (
                <>
                  <button className="action-btn" onClick={onHealth} style={{ padding: '18px 28px', fontSize: 20, background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '12px', cursor: 'pointer' }}>Health Problems</button>
                  <button className="action-btn" onClick={onEnglish} style={{ padding: '18px 28px', fontSize: 20, background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '12px', cursor: 'pointer' }}>English</button>
                  <button className="action-btn" onClick={onScience} style={{ padding: '18px 28px', fontSize: 20, background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '12px', cursor: 'pointer' }}>Science</button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

