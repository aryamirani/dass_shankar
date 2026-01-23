import React, { useState, useRef, useEffect } from 'react'

const POSITIVE_FEEDBACKS = [
  '🌟 Great work!',
  '👍 Good job!',
  '🤩 Answered Correctly!',
  '✨ Amazing!',
  '🚀 Awesome!',
  '🎉 You did it!',
  '🦸 Super!',
  '🪄 Fantastic!',
  '🙂 Nice!',
  '🧠 Brilliant!'
];

const ALL_ITEMS = [
  { id: 'medicine', src: '/images/medicine.png' },
  { id: 'thermometer', src: '/images/thermometer.png' },
  { id: 'firstaid', src: '/images/firstaid.png' },
  { id: 'hotdrink', src: '/images/hotdrink.png' },
  { id: 'food', src: '/images/food.png' },
  { id: 'tissue', src: '/images/tissue.png' },
  { id: 'toilet', src: '/images/toilet.png' },
  { id: 'wetcloth', src: '/images/wetcloth.png' }
]

export default function Lesson({ data, index, total, onBack, onNext, onComplete, onBackToGrid }) {
  const [phase, setPhase] = useState('exercise')
  const [dropped, setDropped] = useState([])
  const [success, setSuccess] = useState(false)
  const [health, setHealth] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [positiveMsg, setPositiveMsg] = useState(null)
  const [showTutorial, setShowTutorial] = useState(false)
  const confettiRef = useRef(null)

  useEffect(() => {
    setPhase('exercise')
    setDropped([])
    setSuccess(false)
    setHealth(0)
    setFeedback(null)
    setPositiveMsg(null)
    setShowTutorial(false)

    // Check if tutorial should be shown
    const hasSeen = localStorage.getItem('hasSeenDragTutorial_v2')
    if (!hasSeen) {
      setTimeout(() => {
        setShowTutorial(true)
        localStorage.setItem('hasSeenDragTutorial_v2', 'true')
      }, 500)
      setTimeout(() => setShowTutorial(false), 4000)
    }
  }, [data])

  useEffect(() => {
    const required = (data.items || []).slice()
    if (required.length === 0) return
    const correctDropped = dropped.filter(id => required.includes(id))
    setHealth(correctDropped.length / required.length)
    if (correctDropped.length === required.length && required.length > 0) {
      setSuccess(true)
      launchConfetti()
      setPhase('healed')
    }
  }, [dropped, data])

  function onDragStart(e, item) {
    if (showTutorial) return; // Prevent drag during tutorial if needed, or just let it be
    e.dataTransfer.setData('text/plain', item.id)
  }

  function onDrop(e) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (!id || dropped.includes(id)) return
    const required = data.items || []
    const isCorrect = required.includes(id)

    const rect = e.currentTarget.getBoundingClientRect()
    setFeedback({ type: isCorrect ? 'tick' : 'cross', x: e.clientX - rect.left, y: e.clientY - rect.top })
    setTimeout(() => setFeedback(null), 1000)

    if (isCorrect) {
      const msg = POSITIVE_FEEDBACKS[Math.floor(Math.random() * POSITIVE_FEEDBACKS.length)]
      setPositiveMsg(msg)
      setTimeout(() => setPositiveMsg(null), 1200)
    }
    setDropped(prev => [...prev, id])
  }

  function launchConfetti() {
    const c = confettiRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    const w = c.width = window.innerWidth
    const h = c.height = window.innerHeight
    const pieces = []
    for (let i = 0; i < 180; i++) pieces.push({ x: Math.random() * w, y: Math.random() * h - h, vx: (Math.random() - 0.5) * 4, vy: Math.random() * 4 + 2, color: `hsl(${Math.random() * 360}, 80 %, 60 %)`, r: Math.random() * 6 + 4 })
    let t = 0
    const raf = () => {
      ctx.clearRect(0, 0, w, h)
      pieces.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.05; ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.r, p.r) })
      t++
      if (t < 200) requestAnimationFrame(raf)
      else ctx.clearRect(0, 0, w, h)
    }
    requestAnimationFrame(raf)
  }

  // Calculate tutorial positions based on IDs
  // We need to wait for render. We can use getBoundingClientRect in a sub-component or just blindly assume coordinates?
  // Better: use an Overlay component that calculates positions.

  return (
    <div className="lesson-root" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '20px', boxSizing: 'border-box' }}>
      {positiveMsg && (
        <div style={{ position: 'fixed', top: 40, left: '50%', transform: 'translateX(-50%)', background: 'white', color: '#1976d2', fontWeight: 'bold', fontSize: 32, borderRadius: 15, padding: '10px 30px', zIndex: 2000, border: '3px solid #1976d2', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
          {positiveMsg}
        </div>
      )}

      {showTutorial && <TutorialOverlay targetItems={data.items} />}

      <div className="top-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button className="back-btn" style={{ fontSize: 40 }} onClick={onBack}>←</button>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: 0 }}>{data.title}</h2>
          <div style={{ fontSize: 14 }}>Page {index + 1} of {total}</div>
        </div>
        <div style={{ width: 80 }}></div>
      </div>

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {phase === 'exercise' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 30, background: 'rgba(255,255,255,0.7)', padding: 20, borderRadius: 20, marginBottom: 'clamp(20px, 4vw, 40px)', maxWidth: '1600px', width: '100%', margin: '0 auto 40px', flexDirection: 'row', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 'clamp(18px, 4vw, 28px)', fontWeight: 'bold', color: '#333', whiteSpace: 'nowrap' }}>Drag the helpful items:</span>
              <div style={{ flex: 1, minWidth: 200, height: 40, background: '#ddd', borderRadius: 20, overflow: 'hidden', border: '3px solid #333' }}>
                <div style={{ width: `${health * 100}% `, height: '100%', background: 'linear-gradient(90deg, #4caf50, #8bc34a)', transition: 'width 0.4s' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'clamp(20px, 4vw, 60px)', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '1600px', margin: '0 auto', flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 40, flex: '1 1 auto', alignItems: 'center', justifyContent: 'flex-start', minWidth: '300px' }}>
                <div id="drop-zone" onDrop={onDrop} onDragOver={e => e.preventDefault()} style={{ position: 'relative', width: 'min(90vw, 440px)', height: 'min(90vw, 500px)', border: '6px dashed #1976d2', borderRadius: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(25,118,210,0.05)' }}>
                  <div style={{ position: 'absolute', top: -25, background: 'white', padding: '5px 25px', border: '3px solid #1976d2', borderRadius: 15, fontWeight: 'bold', color: '#1976d2', fontSize: 24 }}>Drop Here</div>
                  <img src={data.img} alt="character" style={{ height: '80%', objectFit: 'contain' }} />
                  {feedback && (
                    <div style={{ position: 'absolute', left: feedback.x, top: feedback.y, fontSize: 100, fontWeight: 'bold', color: feedback.type === 'tick' ? 'green' : 'red', textShadow: '4px 4px 8px rgba(0,0,0,0.3)', zIndex: 5 }}>
                      {feedback.type === 'tick' ? '✓' : '✗'}
                    </div>
                  )}
                </div>
                <div className="speech-cloud" style={{ background: '#fff', padding: 'clamp(20px, 3vw, 30px)', borderRadius: 30, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: '2px solid #eee', width: 'min(90vw, 450px)', minWidth: 0 }}>
                  <h3 style={{ marginTop: 0, fontSize: 'clamp(20px, 4vw, 32px)' }}>What the child says:</h3>
                  <ul style={{ fontSize: 'clamp(16px, 3vw, 24px)', lineHeight: '1.6', paddingLeft: 20 }}>
                    {data.lines.map((l, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: l }} />
                    ))}
                  </ul>
                </div>
              </div>
              <div className="items-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 24, flex: '1 1 540px', width: '100%', minWidth: 'min(90vw, 500px)' }}>
                {ALL_ITEMS.map((item) => {
                  const isUsed = dropped.includes(item.id);
                  const isCorrect = data.items.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      id={`item-${item.id}`} // ADDED ID
                      draggable={!isUsed}
                      onDragStart={e => onDragStart(e, item)}
                      style={{
                        position: 'relative',
                        background: 'white',
                        padding: 'clamp(10px, 2vw, 20px)',
                        borderRadius: 24,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        cursor: isUsed ? 'default' : 'grab',
                        opacity: isUsed ? 0.6 : 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 'clamp(120px, 15vw, 180px)'
                      }}
                    >
                      <img src={item.src} alt={item.id} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      {isUsed && (
                        <div style={{ position: 'absolute', fontSize: 60, color: isCorrect ? 'green' : 'red', fontWeight: 'bold' }}>
                          {isCorrect ? '✓' : '✗'}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {phase === 'healed' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 50 }}>
            <img src={'/images/boy.png'} alt="happy" style={{ width: 300 }} />
            <h2 style={{ color: '#2e7d32' }}>I feel much better now!</h2>
            <button className="action-btn" onClick={() => {
              if (onComplete) {
                onComplete(data.id)
              }
              // prefer returning to health grid if provided, otherwise fall back to onNext
              setTimeout(() => {
                if (typeof onBackToGrid === 'function') {
                  onBackToGrid()
                } else if (onNext) {
                  onNext()
                }
              }, 0)
            }} style={{ padding: '15px 40px', fontSize: 20 }}>Next</button>
          </div>
        )}
      </div>

      {success && <canvas ref={confettiRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 1500 }} />}
    </div>
  )
}

function TutorialOverlay({ targetItems = [] }) {
  const [coords, setCoords] = useState(null)

  useEffect(() => {
    // try to find first valid item
    const findCoords = () => {
      let sourceEl = null
      for (let id of targetItems) {
        const el = document.getElementById(`item-${id}`)
        if (el) {
          sourceEl = el
          break
        }
      }
      const targetEl = document.getElementById('drop-zone')

      if (sourceEl && targetEl) {
        const sRect = sourceEl.getBoundingClientRect()
        const tRect = targetEl.getBoundingClientRect()
        setCoords({
          startX: sRect.left + sRect.width / 2,
          startY: sRect.top + sRect.height / 2,
          endX: tRect.left + tRect.width / 2,
          endY: tRect.top + tRect.height / 2
        })
      }
    }

    // slight delay to ensure render
    setTimeout(findCoords, 100)
    window.addEventListener('resize', findCoords)
    return () => window.removeEventListener('resize', findCoords)
  }, [targetItems])

  if (!coords) return null

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
      <style>{`
         @keyframes moveHand {
             0% { transform: translate(${coords.startX}px, ${coords.startY}px) scale(1); opacity: 0; }
             10% { transform: translate(${coords.startX}px, ${coords.startY}px) scale(1); opacity: 1; }
             20% { transform: translate(${coords.startX}px, ${coords.startY}px) scale(0.9); } /* grab */
             80% { transform: translate(${coords.endX}px, ${coords.endY}px) scale(0.9); opacity: 1; }
             90% { transform: translate(${coords.endX}px, ${coords.endY}px) scale(1); opacity: 0; }
             100% { transform: translate(${coords.endX}px, ${coords.endY}px) scale(1); opacity: 0; }
         }
       `}</style>
      <div style={{
        position: 'absolute',
        left: 0, top: 0,
        width: 50, height: 50,
        background: 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" stroke="black" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2v6.5a.5.5 0 0 0 1 0V4a2 2 0 0 1 4 0v9a8 8 0 1 1-16 0V7a2 2 0 0 1 4 0v3.5a.5.5 0 0 0 1 0V4a2 2 0 0 1 2-2z"/></svg>\') no-repeat center/contain',
        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))',
        animation: 'moveHand 2s ease-in-out infinite'
      }} />
    </div>
  )
}