import React from 'react'

export default function EnglishReadWords({ onBack, onNext }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 20, position: 'relative' }}>
      <div style={{ position: 'absolute', left: 20, top: 20 }}>
        <button className="back-btn" onClick={onBack}>←</button>
      </div>

      <div style={{ width: '100%', maxWidth: 900, background: 'rgba(255,255,255,0.95)', padding: 'clamp(20px, 4vw, 40px)', borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: '40px', fontWeight: 700, color: '#333', textAlign: 'center', marginBottom: 30 }}>
          Learn to read the following sight words.
        </div>

        <div style={{ fontSize: '30px', fontWeight: 700, color: '#ff0000', textAlign: 'center', marginBottom: 40 }}>
          a &nbsp;&nbsp; in &nbsp;&nbsp; to &nbsp;&nbsp; the &nbsp;&nbsp; and
        </div>

        <div style={{ fontSize: '40px', fontWeight: 700, color: '#333', textAlign: 'center', marginBottom: 30 }}>
          Learn to read following phrases and sentences
        </div>

        <div style={{ fontSize: '30px', fontWeight: 600, color: '#333', lineHeight: 1.8, textAlign: 'center' }}>
          <div>A <span style={{ color: '#ff0000' }}>cat</span> <span style={{ color: '#ff0000' }}>ran</span> to a <span style={{ color: '#ff0000' }}>rat</span>.</div> 
          <div>The <span style={{ color: '#ff0000' }}>rat</span> <span style={{ color: '#ff0000' }}>ran</span> to a <span style={{ color: '#ff0000' }}>van</span>.</div>
          <div><span style={{ color: '#ff0000' }}>Dad bag</span> <span style={{ color: '#ff0000' }}>had</span> a <span style={{ color: '#ff0000' }}>tag</span>.</div>
        </div>
      </div>
    </div>
  )
}
