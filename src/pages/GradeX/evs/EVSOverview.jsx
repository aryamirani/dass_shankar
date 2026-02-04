import React from 'react'

export default function EVSOverview({ onStart, onBack }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <style>{`
        @keyframes popIn { 0% { opacity: 0; transform: translateY(30px) scale(0.98); } 60% { transform: translateY(-8px) scale(1.02); opacity: 1; } 100% { transform: translateY(0) scale(1); } }
        @keyframes floatB { 0%{transform:translateY(0)}50%{transform:translateY(-6px)}100%{transform:translateY(0)} }
      `}</style>
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <button className="back-btn" onClick={onBack}>←</button>
      </div>
      <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.0)', padding: 20 }}>
        <h1 style={{ fontSize: 'clamp(48px, 12vw, 120px)', letterSpacing: 4, margin: 0, fontWeight: 900, display: 'inline-block', lineHeight: 1, color: 'white', textShadow: '0 4px 12px rgba(0,0,0,0.1)', animation: 'popIn 700ms cubic-bezier(.2,.9,.2,1) both' }}>
          EVS
        </h1>
        <div style={{ height: 12 }} />
        <div style={{ fontSize: 20, color: 'white', opacity: 0.95, marginTop: 6, fontWeight: 600, animation: 'popIn 700ms cubic-bezier(.2,.9,.2,1) 120ms both' }}>
          Learn about nature and everyday objects
        </div>
        <div style={{ height: 24 }} />
        <button
          className="action-btn"
          onClick={onStart}
          style={{ padding: '14px 30px', fontSize: 20, animation: 'popIn 700ms cubic-bezier(.2,.9,.2,1) 260ms both', transformOrigin: 'center', background: 'white', color: '#ff512f', border: 'none' }}
          onMouseEnter={e => { e.currentTarget.style.animation = 'floatB 900ms ease-in-out infinite'; e.currentTarget.style.transform = 'scale(1.05)' }}
          onMouseLeave={e => { e.currentTarget.style.animation = 'popIn 700ms cubic-bezier(.2,.9,.2,1) 260ms both'; e.currentTarget.style.transform = 'scale(1)' }}
        >
          Start now
        </button>
      </div>
    </div>
  )
}
