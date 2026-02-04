import React from 'react'

export default function EnglishReadWords({ onBack }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 20, position: 'relative' }}>
      <div style={{ position: 'absolute', left: 20, top: 20 }}>
        <button className="back-btn" onClick={onBack}>←</button>
      </div>

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
      </div>
    </div>
  )
}
