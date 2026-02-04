import React from 'react'


// Since App.jsx uses state-based routing (view.name), we should stick to that pattern.
// Props: onNavigate(viewName)

export default function EnglishBoard({ onNavigate, onBack }) {
  const options = [
    { id: 'theory', title: 'Theory', icon: '🧬', color: '#2ecc71', view: 'englishTheory' },
    { id: 'wordgame', title: 'Word-Surgery', icon: '📚', color: '#3498db', view: 'englishWordGame' },
    { id: 'phonics', title: 'Word Match', icon: '📐', color: '#e74c3c', view: 'englishPhonics' },
    { id: 'fillblanks', title: 'Fill In The Blanks', icon: '🧬', color: '#2ecc71', view: 'englishFillBlanks' },
  ]

  return (
    <div className="landing-root">
      <div className="landing-inner">
        <div style={{ position: 'absolute', left: 20, top: 20, zIndex: 40 }}>
          <button className="action-btn secondary" style={{ padding: '8px 14px', fontSize: 16, minHeight: 40 }} onClick={onBack}>Back</button>
        </div>

        <h1 className="center-title" style={{ marginBottom: 32, fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#333' }}>English</h1>
        <p style={{ fontSize: 'clamp(16px, 4vw, 20px)', color: '#666', marginBottom: 40, marginTop: -20, textAlign: 'center' }}>Select an activity to start Learning</p>

        <div className="health-grid" style={{ maxWidth: 800, width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {options.map((opt, i) => (
            <button
              key={opt.id}
              className="health-grid-item"
              onClick={() => onNavigate(opt.view)}
              style={{
                borderTop: `8px solid ${opt.color}`,
                animation: `popIn 0.5s cubic-bezier(.5,1.8,.5,1) ${(i * 0.1).toFixed(2)}s both`,
                justifyContent: 'center',
                gap: 20,
                width: 'clamp(260px, 40vw, 300px)',
                flex: '1 1 auto'
              }}
            >
              <span style={{ fontSize: 'clamp(40px, 8vw, 60px)', background: '#f9f9f9', width: 'clamp(80px, 15vw, 100px)', height: 'clamp(80px, 15vw, 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                {opt.icon}
              </span>
              <div className="health-label" style={{ fontSize: 'clamp(18px, 4vw, 24px)', color: '#444' }}>{opt.title}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
