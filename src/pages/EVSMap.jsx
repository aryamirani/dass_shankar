import React from 'react'

export default function EVSMap({ onBack }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: 20,
      position: 'relative'
    }}>
      {/* Back Button */}
      <div style={{ position: 'absolute', left: 20, top: 20 }}>
        <button className="back-btn" onClick={onBack}>←</button>
      </div>

      {/* White Box Container */}
      <div style={{
        background: 'white',
        padding: 'clamp(20px, 4vw, 40px)',
        borderRadius: 20,
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        maxWidth: 900,
        width: '100%'
      }}>
        {/* Title */}
        <h2 style={{
          fontSize: 'clamp(24px, 5vw, 32px)',
          textAlign: 'center',
          marginBottom: 30,
          fontWeight: 700,
          color: '#333'
        }}>
          Identify your state and name your city
        </h2>

        {/* Map Image */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}>
          <img
            src="/assets/map_india.png"
            alt="India Map"
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
        </div>
      </div>
    </div>
  )
}
