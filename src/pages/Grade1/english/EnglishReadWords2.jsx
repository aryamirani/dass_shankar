import React from 'react'

export default function EnglishReadWords2({ onBack, onNextExercise }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 20, position: 'relative' }}>


      <div style={{ width: '100%', maxWidth: 900, background: 'rgba(255,255,255,0.95)', padding: 'clamp(20px, 4vw, 40px)', borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>

        <div style={{ fontSize: '40px', fontWeight: 700, color: '#333', textAlign: 'center', marginBottom: 30 }}>
          Read the following phrases and sentences
        </div>

        <div style={{ fontSize: '30px', fontWeight: 600, color: '#333', lineHeight: 1.8, textAlign: 'center' }}>
          <div>A <span style={{ color: '#ff0000' }}>fat man can pat</span> a <span style={{ color: '#ff0000' }}>fat cat</span>.</div>
          <div><span style={{ color: '#ff0000' }}>Sad Sam sat</span> in a <span style={{ color: '#ff0000' }}>van</span>.</div>
          <div><span style={{ color: '#ff0000' }}>Ram had cap</span> and a <span style={{ color: '#ff0000' }}>hat</span>.</div>
          <div><span style={{ color: '#ff0000' }}>Pam had jam</span> and <span style={{ color: '#ff0000' }}>ham</span>.</div>
          <div><span style={{ color: '#ff0000' }}>Dad had</span> a <span style={{ color: '#ff0000' }}>pad</span>.</div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
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
      </div>
    </div>
  )
}
