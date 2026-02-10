import React from 'react'

export default function EVSMap({ onBack, onNextExercise }) {
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
            src="/Grade1/evs/Map/map_india.png"
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

      <div style={{ textAlign: 'center', marginTop: 30 }}>
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

  )
}
