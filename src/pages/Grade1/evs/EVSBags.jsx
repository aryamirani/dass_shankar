import React, { useState, useMemo } from 'react'

const BAGS = [
  { id: 'lunch', bagImg: '/Grade1/evs/Bags/lunch-bag.png', tagImg: '/Grade1/evs/Bags/lunch-tag.png', label: 'lunch bag' },
  { id: 'books', bagImg: '/Grade1/evs/Bags/books-bag.png', tagImg: '/Grade1/evs/Bags/books-tag.png', label: 'books bag' },
  { id: 'vegetable', bagImg: '/Grade1/evs/Bags/vegetable-bag.png', tagImg: '/Grade1/evs/Bags/vegetable-tag.png', label: 'vegetable bag' }
]

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function EVSBags({ onBack, onNextExercise }) {
  const shuffledTags = useMemo(() => shuffle(BAGS), [])
  const [matches, setMatches] = useState({})
  const [draggedTag, setDraggedTag] = useState(null)

  function handleDragStart(bagId) {
    setDraggedTag(bagId)
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleDrop(e, bagId) {
    e.preventDefault()
    if (draggedTag && draggedTag === bagId && !matches[bagId]) {
      setMatches(prev => ({ ...prev, [bagId]: draggedTag }))
    }
    setDraggedTag(null)
  }

  const totalMatches = BAGS.length
  const correctMatches = Object.keys(matches).length

  return (
    <div style={{ minHeight: '100vh', padding: '20px 24px 60px', position: 'relative', color: '#fff' }}>


      <style>{`
        .bag-container {
          max-width: 1100px;
          margin: 0 auto;
        }
        .bag-columns {
          display: flex;
          justify-content: center;
          gap: 50px;
          margin-top: 30px;
          align-items: flex-start;
        }
        .bag-column {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        .bag-item {
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
        .bag-item-inner {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          position: relative;
        }
        .bag-item img {
          max-width: 100%;
          max-height: 180px;
          object-fit: contain;
          display: block;
        }
        .bag-drop-zone {
          border: 4px dashed #999;
          cursor: pointer;
        }
        .bag-drop-zone.matched {
          border: 4px solid #4caf50;
          background: #e8f5e9;
        }
        .bag-drop-zone.drag-over {
          border: 4px solid #1976d2;
          background: #e3f2fd;
          transform: scale(1.03);
        }
        .tag-item {
          cursor: grab;
          border: 4px solid transparent;
        }
        .tag-item:active {
          cursor: grabbing;
        }
        .tag-item.matched {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .match-label {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          font-size: 18px;
          font-weight: 800;
          color: #2e7d32;
          background: white;
          padding: 4px 12px;
          border-radius: 8px;
        }
        @media (max-width: 900px) {
          .bag-columns {
            flex-direction: column;
            align-items: center;
            gap: 40px;
          }
          .bag-column {
            width: 100%;
            align-items: center;
          }
          .bag-item {
            width: 90%;
            max-width: 400px;
          }
        }
      `}</style>

      <div className="bag-container">
        <div style={{ textAlign: 'center', marginBottom: 25 }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(38px, 5.5vw, 56px)', fontWeight: 900, color: '#fff', textShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
            Types of Bags
          </h1>
          <div style={{ marginTop: 8, fontSize: 18, opacity: 0.95 }}>
            Match the bags and the names on the tags
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
              You matched all the bags correctly!
            </p>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
              <button
                className="action-btn"
                onClick={() => setMatches({})}
                style={{ padding: '15px 40px', fontSize: 20, fontWeight: 800, background: 'rgba(255,255,255,0.2)' }}
              >
                Try Again
              </button>
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
        ) : (
          <div className="bag-columns">
            {/* Bags Column */}
            <div className="bag-column">
              {BAGS.map(bag => (
                <div
                  key={bag.id}
                  className={`bag-item bag-drop-zone ${matches[bag.id] ? 'matched' : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, bag.id)}
                  onDragEnter={(e) => {
                    if (!matches[bag.id]) {
                      e.currentTarget.classList.add('drag-over')
                    }
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('drag-over')
                  }}
                >
                  <div className="bag-item-inner">
                    <img src={bag.bagImg} alt={bag.label} />
                    {matches[bag.id] && (
                      <div className="match-label">✓ {bag.label}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Tags Column */}
            <div className="bag-column">
              {shuffledTags.map(bag => (
                <div
                  key={bag.label}
                  className={`bag-item tag-item ${matches[bag.id] ? 'matched' : ''}`}
                  draggable={!matches[bag.id]}
                  onDragStart={() => handleDragStart(bag.id)}
                  onDragEnd={() => setDraggedTag(null)}
                >
                  <div className="bag-item-inner">
                    <img src={bag.tagImg} alt={bag.label} />
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
