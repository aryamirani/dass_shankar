import React, { useMemo, useState } from 'react'

const SECTIONS = [
  {
    id: 'animals',
    title: 'Learn to identify and name different animals',
    items: [
      { id: 'animal-cat', label: 'cat', imageSrc: '/assets/cat.png' },
      { id: 'animal-dog', label: 'dog', imageSrc: '/assets/dog.png' },
      { id: 'animal-pig', label: 'pig', imageSrc: '/assets/pig.png' },
      { id: 'animal-cow', label: 'cow', imageSrc: '/assets/cow.png' },
      { id: 'animal-goat', label: 'goat', imageSrc: '/assets/goat.png' },
      { id: 'animal-buffalo', label: 'buffalo', imageSrc: '/assets/buffalo.png' },
      { id: 'animal-donkey', label: 'donkey', imageSrc: '/assets/donkey.png' },
      { id: 'animal-horse', label: 'horse', imageSrc: '/assets/horse.png' },
      { id: 'animal-camel', label: 'camel', imageSrc: '/assets/camel.png' }
    ]
  },
  {
    id: 'vehicles',
    title: 'Learn to identify and name different vehicles',
    items: [
      { id: 'vehicle-van', label: 'van', imageSrc: '/assets/van.png' },
      { id: 'vehicle-car', label: 'car', imageSrc: '/assets/car.png' },
      { id: 'vehicle-bus', label: 'bus', imageSrc: '/assets/bus.png' },
      { id: 'vehicle-auto', label: 'auto', imageSrc: '/assets/auto.png' },
      { id: 'vehicle-bike', label: 'bike', imageSrc: '/assets/bike.png' },
      { id: 'vehicle-cycle', label: 'cycle', imageSrc: '/assets/cycle.png' },
      { id: 'vehicle-train', label: 'train', imageSrc: '/assets/train.png' },
      { id: 'vehicle-airplane', label: 'airplane', imageSrc: '/assets/airplane.png' },
      { id: 'vehicle-truck', label: 'truck', imageSrc: '/assets/truck.png' }
    ]
  },
  {
    id: 'household',
    title: 'Learn to identify and name different household objects',
    items: [
      { id: 'home-fan', label: 'fan', imageSrc: '/assets/fan.png' },
      { id: 'home-tv', label: 'TV', imageSrc: '/assets/tv.png' },
      { id: 'home-fridge', label: 'fridge', imageSrc: '/assets/fridge.png' },
      { id: 'home-telephone', label: 'tele phone', imageSrc: '/assets/telephone.ong' },
      { id: 'home-cellphone', label: 'cell phone', imageSrc: '/assets/cellphone.png' },
      { id: 'home-iron', label: 'iron box', imageSrc: '/assets/iron.png' },
      { id: 'home-ac', label: 'AC', imageSrc: '/assets/ac.png' },
      { id: 'home-computer', label: 'computer', imageSrc: '/assets/computer.png' },
      { id: 'home-geyser', label: 'geyser', imageSrc: '/assets/geyser.png' }
    ]
  }
]

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = copy[i]
    copy[i] = copy[j]
    copy[j] = temp
  }
  return copy
}

function pickRandom(arr, count) {
  const shuffled = shuffle(arr)
  return shuffled.slice(0, count)
}

export default function EVSIdentify({ onBack }) {
  const optionMap = useMemo(() => {
    const map = {}
    SECTIONS.forEach(section => {
      const labels = section.items.map(item => item.label)
      section.items.forEach(item => {
        const distractors = pickRandom(labels.filter(label => label !== item.label), 2)
        map[item.id] = shuffle([item.label, ...distractors])
      })
    })
    return map
  }, [])

  const [answers, setAnswers] = useState({})

  const totalItems = SECTIONS.reduce((acc, section) => acc + section.items.length, 0)
  const correctCount = Object.keys(answers).filter(id => {
    const matchItem = SECTIONS.flatMap(s => s.items).find(i => i.id === id)
    return matchItem && answers[id] === matchItem.label
  }).length

  function handleSelect(item, choice) {
    setAnswers(prev => ({ ...prev, [item.id]: choice }))
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 24px 80px', position: 'relative', color: '#fff' }}>
      <div style={{ position: 'absolute', left: 20, top: 20, zIndex: 2 }}>
        <button className="back-btn" onClick={onBack}>←</button>
      </div>

      <style>{`
        .evs-section {
          margin: 40px auto 60px;
          max-width: 1200px;
          background: rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 28px 28px 36px;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 16px 40px rgba(0,0,0,0.2);
        }
        .evs-title {
          text-align: center;
          font-size: 26px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 26px;
          text-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .evs-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(200px, 1fr));
          gap: 26px;
          justify-items: center;
        }
        .evs-card {
          width: 100%;
          max-width: 240px;
          background: #fff;
          border: 3px solid #6f6f6f;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 10px 22px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: #333;
        }
        .evs-photo {
          width: 160px;
          height: 120px;
          border: 3px solid #6f6f6f;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f6f6f6;
          box-shadow: inset 0 2px 8px rgba(0,0,0,0.08);
          position: relative;
          overflow: hidden;
        }
        .evs-photo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .evs-photo-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #555;
          font-weight: 700;
          font-size: 12px;
          text-align: center;
          padding: 8px;
          gap: 6px;
        }
        .evs-photo-placeholder span {
          font-size: 26px;
        }
        .evs-label {
          font-size: 20px;
          font-weight: 800;
          color: #111;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .evs-tick {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: #22c55e;
          color: #fff;
          font-size: 14px;
          font-weight: 900;
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        .evs-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          width: 100%;
        }
        .evs-option-btn {
          border: none;
          border-radius: 8px;
          padding: 8px 6px;
          font-weight: 700;
          cursor: pointer;
          background: #ffe3e8;
          color: #8a1c3e;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .evs-option-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
        .evs-option-btn.correct {
          background: #dcfce7;
          color: #166534;
        }
        .evs-option-btn.wrong {
          background: #ffe4e6;
          color: #b91c1c;
        }
        .evs-progress {
          text-align: center;
          font-size: 20px;
          font-weight: 700;
          margin: 30px 0 20px;
          color: #fff;
          text-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        @media (max-width: 900px) {
          .evs-grid { grid-template-columns: repeat(2, minmax(200px, 1fr)); }
        }
        @media (max-width: 600px) {
          .evs-grid { grid-template-columns: 1fr; }
          .evs-card { max-width: 320px; }
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, color: '#fff', textShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>EVS: Identify the Object</h1>
        <div style={{ marginTop: 8, fontSize: 18, opacity: 0.95 }}>Tap the correct name for each picture.</div>
      </div>

      <div className="evs-progress">Correct: {correctCount} / {totalItems}</div>

      {SECTIONS.map(section => (
        <div key={section.id} className="evs-section">
          <div className="evs-title">{section.title}</div>
          <div className="evs-grid">
            {section.items.map(item => {
              const selected = answers[item.id]
              const isCorrect = selected === item.label

              return (
                <div key={item.id} className="evs-card">
                  <div className="evs-photo" aria-label={item.label}>
                    {item.imageSrc ? (
                      <img src={item.imageSrc} alt={item.label} />
                    ) : (
                      <div className="evs-photo-placeholder">
                        <span role="img" aria-label="photo">🖼️</span>
                        Add photo for {item.label}
                      </div>
                    )}
                  </div>

                  {isCorrect ? (
                    <div className="evs-label">
                      <span>{item.label}</span>
                      <span className="evs-tick" aria-hidden="true">✓</span>
                    </div>
                  ) : (
                    <div className="evs-options">
                      {optionMap[item.id].map(option => {
                        const isWrong = selected === option && option !== item.label
                        return (
                          <button
                            key={option}
                            className={`evs-option-btn ${option === item.label && isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                            onClick={() => handleSelect(item, option)}
                          >
                            {option}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {selected && !isCorrect && (
                    <div style={{ fontSize: 12, color: '#b91c1c', fontWeight: 700 }}>Try again</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
