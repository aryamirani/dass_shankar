import React, { useEffect, useMemo, useState } from 'react'

const SECTIONS = [
  {
    id: 'animals',
    title: 'Learn to identify and name different animals',
    items: [
      { id: 'animal-cat', label: 'cat', imageSrc: '/GradeX/evs/Identify/cat.png' },
      { id: 'animal-dog', label: 'dog', imageSrc: '/GradeX/evs/Identify/dog.png' },
      { id: 'animal-pig', label: 'pig', imageSrc: '/GradeX/evs/Identify/pig.png' },
      { id: 'animal-cow', label: 'cow', imageSrc: '/GradeX/evs/Identify/cow.png' },
      { id: 'animal-goat', label: 'goat', imageSrc: '/GradeX/evs/Identify/goat.png' },
      { id: 'animal-buffalo', label: 'buffalo', imageSrc: '/GradeX/evs/Identify/buffalo.png' },
      { id: 'animal-donkey', label: 'donkey', imageSrc: '/GradeX/evs/Identify/donkey.png' },
      { id: 'animal-horse', label: 'horse', imageSrc: '/GradeX/evs/Identify/horse.png' },
      { id: 'animal-camel', label: 'camel', imageSrc: '/GradeX/evs/Identify/camel.png' }
    ]
  },
  {
    id: 'vehicles',
    title: 'Learn to identify and name different vehicles',
    items: [
      { id: 'vehicle-van', label: 'van', imageSrc: '/GradeX/evs/Identify/van.png' },
      { id: 'vehicle-car', label: 'car', imageSrc: '/GradeX/evs/Identify/car.png' },
      { id: 'vehicle-bus', label: 'bus', imageSrc: '/GradeX/evs/Identify/bus.png' },
      { id: 'vehicle-auto', label: 'auto', imageSrc: '/GradeX/evs/Identify/auto.png' },
      { id: 'vehicle-bike', label: 'bike', imageSrc: '/GradeX/evs/Identify/bike.png' },
      { id: 'vehicle-cycle', label: 'cycle', imageSrc: '/GradeX/evs/Identify/cycle.png' },
      { id: 'vehicle-train', label: 'train', imageSrc: '/GradeX/evs/Identify/train.png' },
      { id: 'vehicle-airplane', label: 'airplane', imageSrc: '/GradeX/evs/Identify/airplane.png' },
      { id: 'vehicle-truck', label: 'truck', imageSrc: '/GradeX/evs/Identify/truck.png' }
    ]
  },
  {
    id: 'household',
    title: 'Learn to identify and name different household objects',
    items: [
      { id: 'home-fan', label: 'fan', imageSrc: '/GradeX/evs/Identify/fan.png' },
      { id: 'home-tv', label: 'TV', imageSrc: '/GradeX/evs/Identify/tv.png' },
      { id: 'home-fridge', label: 'fridge', imageSrc: '/GradeX/evs/Identify/fridge.png' },
      { id: 'home-telephone', label: 'tele phone', imageSrc: '/GradeX/evs/Identify/telephone.png' },
      { id: 'home-cellphone', label: 'cell phone', imageSrc: '/GradeX/evs/Identify/cellphone.png' },
      { id: 'home-iron', label: 'iron box', imageSrc: '/GradeX/evs/Identify/iron.png' },
      { id: 'home-ac', label: 'AC', imageSrc: '/GradeX/evs/Identify/ac.png' },
      { id: 'home-computer', label: 'computer', imageSrc: '/GradeX/evs/Identify/computer.png' },
      { id: 'home-geyser', label: 'geyser', imageSrc: '/GradeX/evs/Identify/geyser.png' }
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
  const [sectionIndex, setSectionIndex] = useState(0)
  const [pageIndexBySection, setPageIndexBySection] = useState({})

  const totalItems = SECTIONS.reduce((acc, section) => acc + section.items.length, 0)
  const correctCount = Object.keys(answers).filter(id => {
    const matchItem = SECTIONS.flatMap(s => s.items).find(i => i.id === id)
    return matchItem && answers[id] === matchItem.label
  }).length

  function handleSelect(item, choice) {
    setAnswers(prev => ({ ...prev, [item.id]: choice }))
  }

  const currentSection = SECTIONS[sectionIndex]

  const itemsPerPage = 3
  const currentPageIndex = pageIndexBySection[currentSection.id] ?? 0
  const pageCount = Math.max(1, Math.ceil(currentSection.items.length / itemsPerPage))
  const safePageIndex = Math.min(Math.max(0, currentPageIndex), pageCount - 1)

  const visibleItems = useMemo(() => {
    const start = safePageIndex * itemsPerPage
    return currentSection.items.slice(start, start + itemsPerPage)
  }, [currentSection, safePageIndex])

  function setCurrentPageIndex(nextIndex) {
    setPageIndexBySection(prev => ({ ...prev, [currentSection.id]: nextIndex }))
  }

  function goPrevPage() {
    setCurrentPageIndex((safePageIndex - 1 + pageCount) % pageCount)
  }

  function goNextPage() {
    setCurrentPageIndex((safePageIndex + 1) % pageCount)
  }

  function goPrevSection() {
    setSectionIndex(prev => (prev - 1 + SECTIONS.length) % SECTIONS.length)
  }

  function goNextSection() {
    setSectionIndex(prev => (prev + 1) % SECTIONS.length)
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'ArrowLeft') goPrevPage()
      else if (event.key === 'ArrowRight') goNextPage()
      else if (event.key === 'PageUp') goPrevSection()
      else if (event.key === 'PageDown') goNextSection()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [safePageIndex, pageCount, currentSection.id])

  useEffect(() => {
    // If the section changes and its saved page is out-of-range, clamp it.
    const section = SECTIONS[sectionIndex]
    const maxPages = Math.max(1, Math.ceil(section.items.length / itemsPerPage))
    const stored = pageIndexBySection[section.id] ?? 0
    const clamped = Math.min(Math.max(0, stored), maxPages - 1)
    if (clamped !== stored) {
      setPageIndexBySection(prev => ({ ...prev, [section.id]: clamped }))
    }
  }, [sectionIndex])

  return (
    <div
      style={{
        height: '100vh',
        overflow: 'hidden',
        padding: '24px 18px 18px',
        position: 'relative',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column'
      }}
    >


      <style>{`
        .evs-section {
          margin: 18px auto 0;
          max-width: 1200px;
          background: rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 22px 56px 22px;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 16px 40px rgba(0,0,0,0.2);
          position: relative;
          width: 100%;
        }
        .evs-title {
          text-align: center;
          font-size: 24px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 14px;
          text-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .evs-grid {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          gap: 22px;
          width: 100%;
          overflow: hidden;
        }
        .evs-card {
          width: 100%;
          max-width: 230px;
          height: auto;
          background: #fff;
          border: 3px solid #6f6f6f;
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 10px 22px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: #333;
        }
        .evs-photo {
          width: 150px;
          height: 112px;
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
          font-size: 18px;
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
        .evs-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin: 10px 0 6px;
        }
        .evs-nav-btn {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.9);
          color: #dd2476;
          font-size: 24px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .evs-nav-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(0,0,0,0.25);
        }
        .evs-nav-label {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          text-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .evs-carousel-btn {
          position: absolute;
          top: 55%;
          transform: translateY(-50%);
          width: 52px;
          height: 52px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.35);
          background: rgba(0,0,0,0.35);
          color: #fff;
          font-size: 28px;
          font-weight: 900;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 28px rgba(0,0,0,0.25);
          transition: transform 0.12s ease, background 0.12s ease;
          user-select: none;
        }
        .evs-carousel-btn:hover {
          transform: translateY(-50%) scale(1.03);
          background: rgba(0,0,0,0.45);
        }
        .evs-carousel-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .evs-carousel-btn.left { left: 14px; }
        .evs-carousel-btn.right { right: 14px; }
        .evs-page-indicator {
          text-align: center;
          margin-top: 10px;
          font-size: 14px;
          font-weight: 800;
          opacity: 0.95;
        }
        @media (max-width: 900px) {
          .evs-section { padding: 18px 52px 18px; }
          .evs-card { max-width: 210px; }
          .evs-photo { width: 138px; height: 104px; }
        }
        @media (max-width: 600px) {
          .evs-section { padding: 16px 46px 16px; }
          .evs-grid { gap: 14px; }
          .evs-card { max-width: 180px; padding: 10px; }
          .evs-photo { width: 120px; height: 92px; }
          .evs-option-btn { padding: 7px 6px; font-size: 12px; }
          .evs-carousel-btn { width: 46px; height: 46px; border-radius: 14px; }
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, color: '#fff', textShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>Identify the Object</h1>
        <div style={{ marginTop: 8, fontSize: 18, opacity: 0.95 }}>Tap the correct name for each picture.</div>
      </div>

      <div className="evs-progress">Correct: {correctCount} / {totalItems}</div>

      <div className="evs-nav">
        <button className="evs-nav-btn" onClick={goPrevSection} aria-label="Previous section">←</button>
        <div className="evs-nav-label">Section {sectionIndex + 1} of {SECTIONS.length}</div>
        <button className="evs-nav-btn" onClick={goNextSection} aria-label="Next section">→</button>
      </div>

      <div className="evs-section">
        <div className="evs-title">{currentSection.title}</div>
        <button
          className="evs-carousel-btn left"
          onClick={goPrevPage}
          aria-label="Previous pictures"
          disabled={pageCount <= 1}
        >
          ‹
        </button>
        <button
          className="evs-carousel-btn right"
          onClick={goNextPage}
          aria-label="Next pictures"
          disabled={pageCount <= 1}
        >
          ›
        </button>
        <div className="evs-grid">
          {visibleItems.map(item => {
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
        <div className="evs-page-indicator">Pictures {safePageIndex + 1} / {pageCount}</div>
      </div>
    </div>
  )
}
