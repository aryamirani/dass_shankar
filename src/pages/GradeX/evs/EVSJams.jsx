import React, { useState, useMemo } from 'react'

const JAMS = [
  { id: 'mango', jamImg: '/GradeX/evs/Jams/mango_jam.jpg', fruitImg: '/GradeX/evs/Jams/mango.png', fruit: 'mango' },
  { id: 'apple', jamImg: '/GradeX/evs/Jams/apple_jam.webp', fruitImg: '/GradeX/evs/Jams/apple.png', fruit: 'apple' },
  { id: 'orange', jamImg: '/GradeX/evs/Jams/orange_jam.png', fruitImg: '/GradeX/evs/Jams/orange.png', fruit: 'orange' }
]

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function EVSJams({ onBack }) {
  const shuffledFruits = useMemo(() => shuffle(JAMS), [])
  const [matches, setMatches] = useState({})
  const [draggedFruit, setDraggedFruit] = useState(null)

  function handleDragStart(fruit) {
    setDraggedFruit(fruit)
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleDrop(e, jamId) {
    e.preventDefault()
    if (draggedFruit && draggedFruit === jamId && !matches[jamId]) {
      setMatches(prev => ({ ...prev, [jamId]: draggedFruit }))
    }
    setDraggedFruit(null)
  }

  const totalMatches = JAMS.length
  const correctMatches = Object.keys(matches).length

  return (
    <div style={{ minHeight: '100vh', padding: '20px 24px 60px', position: 'relative', color: '#fff' }}>


      <style>{`
        .jam-container {
          max-width: 1100px;
          margin: 0 auto;
        }
        .jam-columns {
          display: flex;
          justify-content: center;
          gap: 50px;
          margin-top: 30px;
          align-items: flex-start;
        }
        .jam-column {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        .jam-item {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
          width: 350px;
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }
        .jam-item-inner {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          position: relative;
        }
        .jam-item img {
          max-width: 100%;
          max-height: 180px;
          object-fit: contain;
          display: block;
        }
        .jam-drop-zone {
          border: 4px dashed #999;
          cursor: pointer;
        }
        .jam-drop-zone.matched {
          border: 4px solid #4caf50;
          background: #e8f5e9;
        }
        .jam-drop-zone.drag-over {
          border: 4px solid #1976d2;
          background: #e3f2fd;
          transform: scale(1.03);
        }
        .fruit-item {
          cursor: grab;
          border: 4px solid transparent;
        }
        .fruit-item:active {
          cursor: grabbing;
        }
        .fruit-item.matched {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .match-label {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          font-size: 22px;
          font-weight: 800;
          color: #2e7d32;
          background: white;
          padding: 4px 12px;
          border-radius: 8px;
        }
        @media (max-width: 900px) {
          .jam-columns {
            flex-direction: column;
            align-items: center;
            gap: 40px;
          }
          .jam-column {
            width: 100%;
            align-items: center;
          }
          .jam-item {
            width: 90%;
            max-width: 400px;
          }
        }
      `}</style>

      <div className="jam-container">
        <div style={{ textAlign: 'center', marginBottom: 25 }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(38px, 5.5vw, 56px)', fontWeight: 900, color: '#fff', textShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
            Read Labels
          </h1>
          <div style={{ marginTop: 8, fontSize: 18, opacity: 0.95 }}>
            Match the jam bottles and fruits as per the label
          </div>
          <div style={{ marginTop: 15, fontSize: 22, fontWeight: 700, color: '#fff', textShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            Matched: {correctMatches} / {totalMatches}
          </div>
        </div>

        {correctMatches === totalMatches ? (
          <div style={{ textAlign: 'center', marginTop: 60, background: 'rgba(255,255,255,0.1)', padding: 40, borderRadius: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🎉</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 20 }}>
              Perfect Match!
            </h2>
            <p style={{ fontSize: 24, color: '#fff', marginBottom: 30, opacity: 0.9 }}>
              You matched all the jams correctly!
            </p>
            <button 
              className="action-btn"
              onClick={() => setMatches({})}
              style={{ padding: '15px 40px', fontSize: 20, fontWeight: 800 }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="jam-columns">
            {/* Jam Bottles Column */}
            <div className="jam-column">
              {JAMS.map(jam => (
                <div
                  key={jam.id}
                  className={`jam-item jam-drop-zone ${matches[jam.id] ? 'matched' : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, jam.id)}
                  onDragEnter={(e) => {
                    if (!matches[jam.id]) {
                      e.currentTarget.classList.add('drag-over')
                    }
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('drag-over')
                  }}
                >
                  <div className="jam-item-inner">
                    <img src={jam.jamImg} alt={`${jam.fruit} jam`} />
                    {matches[jam.id] && (
                      <div className="match-label">✓ {jam.fruit}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Fruits Column */}
            <div className="jam-column">
              {shuffledFruits.map(jam => (
                <div
                  key={jam.fruit}
                  className={`jam-item fruit-item ${matches[jam.id] ? 'matched' : ''}`}
                  draggable={!matches[jam.id]}
                  onDragStart={() => handleDragStart(jam.id)}
                  onDragEnd={() => setDraggedFruit(null)}
                >
                  <div className="jam-item-inner">
                    <img src={jam.fruitImg} alt={jam.fruit} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
