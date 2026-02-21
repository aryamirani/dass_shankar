import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useSpeech } from '../../../hooks/useSpeech'

const WORDS = [
  { id: 'bag', img: '/Grade1/english/VocabularyThreeAg/bag.png' },
  { id: 'tag', img: '/Grade1/english/VocabularyThreeAg/tag.png' },
  { id: 'rag', img: '/Grade1/english/VocabularyThreeAg/rag.png' }
]

const POSITIVE = [
  '👍 Good', '✅ Yes', '🌟 Nice', '🎉 Great', '😃 Yay', '👌 Ok'
]

const GENTLE = [
  '👎 Retry', '☹️ Try again', '❌ Wrong'
]

export default function VocabularyThreeAg({ onBack, onNextExercise }) {
  const [step, setStep] = useState(0) // 0: gallery, 1: match, 2: type
  const [viewIndex, setViewIndex] = useState(0)
  const [message, setMessage] = useState(null)
  const [hoveredTarget, setHoveredTarget] = useState(null)
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    if (step === 1) {
      const hasSeen = localStorage.getItem('hasSeenVocabMatchTutorial')
      if (!hasSeen) {
        setTimeout(() => {
          setShowTutorial(true)
          localStorage.setItem('hasSeenVocabMatchTutorial', 'true')
        }, 500)
        setTimeout(() => setShowTutorial(false), 4000)
      }
    } else {
      setShowTutorial(false)
    }
  }, [step])

  // --- Matching & gallery state ---
  const shuffleWords = (arr) => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t }
    return a
  }

  const [galleryOrder, setGalleryOrder] = useState(() => shuffleWords(WORDS))
  const [targets, setTargets] = useState(() => shuffleWords(WORDS).map(w => ({ ...w, matched: false })))
  const [draggables, setDraggables] = useState(() => shuffleWords(WORDS).map(w => ({ id: w.id, text: w.id, used: false })))
  const [typeOrder, setTypeOrder] = useState(() => shuffleWords(WORDS))

  function reshuffleAll() {
    setGalleryOrder(shuffleWords(WORDS))
    setTargets(shuffleWords(WORDS).map(w => ({ ...w, matched: false })))
    setDraggables(shuffleWords(WORDS).map(w => ({ id: w.id, text: w.id, used: false })))
    setHoveredTarget(null)
    setTypeOrder(shuffleWords(WORDS))
  }

  // --- Typing state ---
  const [typeIndex, setTypeIndex] = useState(0)
  const [letters, setLetters] = useState(['', '', ''])
  const inputRefs = useRef([])
  const { speak } = useSpeech()

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 1200)
      return () => clearTimeout(t)
    }
  }, [message])


  // tab styles for header buttons
  const tabFilled = { padding: 'clamp(10px, 2vw, 16px) clamp(16px, 3vw, 24px)', fontSize: 'clamp(14px, 2.5vw, 20px)', borderRadius: 20, background: '#1976d2', border: 'none', color: '#fff', fontWeight: 800, boxShadow: '0 8px 18px rgba(25,118,210,0.18)', cursor: 'pointer' }
  const tabOutline = { padding: 'clamp(10px, 2vw, 16px) clamp(16px, 3vw, 24px)', fontSize: 'clamp(14px, 2.5vw, 20px)', borderRadius: 20, background: '#fff', border: '2px solid #1976d2', color: '#0d47a1', fontWeight: 700, boxShadow: '0 6px 14px rgba(25,118,210,0.08)', cursor: 'pointer' }
  const tabStyle = (i) => step === i ? tabFilled : tabOutline

  // drag handlers
  const [selectedDraggable, setSelectedDraggable] = useState(null)

  function onDragStart(e, item) {
    if (item.used) return
    e.dataTransfer.setData('text/plain', item.id)
    setSelectedDraggable(null) // Clear selection if dragging
  }

  function handleDraggableClick(item) {
    if (item.used) return
    if (selectedDraggable === item.id) {
      setSelectedDraggable(null)
    } else {
      setSelectedDraggable(item.id)
      speak(item.id) // Optional: speak word when selected
    }
  }

  function handleTargetClick(target) {
    if (target.matched) return
    if (selectedDraggable) {
      // Attempt match with selected draggable
      checkMatch(selectedDraggable, target.id)
    }
  }

  function checkMatch(dragId, targetId) {
    if (dragId === targetId) {
      setTargets(prev => prev.map(t => t.id === targetId ? { ...t, matched: true } : t))
      setDraggables(prev => prev.map(d => d.id === dragId ? { ...d, used: true } : d))
      setHoveredTarget(null)
      setSelectedDraggable(null)
      setMessage({ type: 'success', text: POSITIVE[Math.floor(Math.random() * POSITIVE.length)] })
    } else {
      setHoveredTarget(null)
      setSelectedDraggable(null)
      setMessage({ type: 'error', text: GENTLE[Math.floor(Math.random() * GENTLE.length)] })
    }
  }

  function onDropTarget(e, target) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (!id) return
    checkMatch(id, target.id)
  }

  function allowDrop(e) { e.preventDefault() }

  function onDragEnterTarget(e, t) { e.preventDefault(); setHoveredTarget(t.id) }
  function onDragLeaveTarget(e, t) { e.preventDefault(); setHoveredTarget(null) }

  // typing handlers
  function onSubmitType(e) {
    e.preventDefault()
    const expected = typeOrder[typeIndex].id.toLowerCase()
    const attempt = letters.join('').toLowerCase()
    if (attempt === expected) {
      setMessage({ type: 'success', text: POSITIVE[Math.floor(Math.random() * POSITIVE.length)] })
      setLetters(['', '', ''])
      setTypeIndex(i => i + 1)
    } else {
      setMessage({ type: 'error', text: GENTLE[Math.floor(Math.random() * GENTLE.length)] })
    }
    if (inputRefs.current[0]) inputRefs.current[0].focus()
  }

  return (
    <div style={{ height: '100vh', maxHeight: '100vh', overflow: 'hidden', padding: '10px 20px', boxSizing: 'border-box', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {showTutorial && step === 1 && <TutorialOverlay draggables={draggables} targets={targets} />}

      <div style={{ maxWidth: 1200, margin: '0 auto', background: 'rgba(255,255,255,0.0)', padding: 10, display: 'flex', flexDirection: 'column', flex: 1, width: '100%' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 6vh, 42px)', fontWeight: 900, color: '#111', textShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: 10 }}>Vocabulary</h2>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button className="action-btn" onClick={() => { setStep(0); reshuffleAll() }} style={tabStyle(0)}>Visual Reference</button>
          <button className="action-btn" onClick={() => { setStep(1); reshuffleAll() }} style={tabStyle(1)}>Interactive Matching</button>
          <button className="action-btn" onClick={() => { setStep(2); reshuffleAll(); setTypeIndex(0); setLetters(['', '', '']); if (inputRefs.current[0]) inputRefs.current[0].focus() }} style={tabStyle(2)}>Type the word</button>
        </div>

        {/* Global Feedback Banner */}
        <div style={{ minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
          {message && (
            <div style={{ padding: '8px 24px', fontSize: message.type === 'success' ? 'clamp(24px, 4vw, 32px)' : 'clamp(20px, 3.5vw, 24px)', fontWeight: 800, color: message.type === 'success' ? '#155724' : '#856404', background: message.type === 'success' ? 'rgba(212,237,218,0.98)' : 'rgba(255,243,205,0.95)', borderRadius: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', whiteSpace: 'nowrap', animation: 'popIn 0.2s ease-out' }}>
              {message.text}
            </div>
          )}
        </div>

        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 0 }}>
            <div key={galleryOrder[viewIndex].id} onClick={() => speak(galleryOrder[viewIndex].id)} style={{ textAlign: 'center', width: '100%', maxWidth: 600, background: 'transparent', borderRadius: 20, padding: 'clamp(5px, 2vh, 20px)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <img src={galleryOrder[viewIndex].img} alt={galleryOrder[viewIndex].id} style={{ width: '100%', maxWidth: '35vh', height: 'auto', maxHeight: '35vh', objectFit: 'contain' }} />
              <div style={{ fontSize: 'clamp(40px, 8vh, 80px)', fontWeight: 800, color: '#111', lineHeight: 1, margin: '15px 0' }}>{galleryOrder[viewIndex].id}</div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); speak(galleryOrder[viewIndex].id); }}
                style={{ 
                  marginTop: 10, 
                  background: '#1976d2', 
                  color: 'white', 
                  fontSize: 'clamp(18px, 3vh, 26px)', 
                  fontWeight: 800, 
                  padding: '12px 32px', 
                  borderRadius: 50, 
                  border: 'none', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(25,118,210,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}
              >
                <span style={{ fontSize: '1.2em' }}>🔊</span> Click to Listen
              </button>
            </div>

            <div style={{ display: 'flex', gap: 40, marginTop: 'clamp(15px, 3vh, 30px)' }}>
              <button
                className="action-btn"
                onClick={() => setViewIndex(prev => Math.max(0, prev - 1))}
                disabled={viewIndex === 0}
                style={{
                  background: '#fff', color: viewIndex === 0 ? '#ccc' : '#1976d2',
                  cursor: viewIndex === 0 ? 'default' : 'pointer',
                  border: 'none', fontSize: 'clamp(24px, 6vw, 40px)', fontWeight: 900, padding: '10px 30px',
                  borderRadius: 50, boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              >
                &lt;
              </button>

              <button
                className="action-btn"
                onClick={() => setViewIndex(prev => Math.min(galleryOrder.length - 1, prev + 1))}
                disabled={viewIndex === galleryOrder.length - 1}
                style={{
                  background: '#fff', color: viewIndex === galleryOrder.length - 1 ? '#ccc' : '#1976d2',
                  cursor: viewIndex === galleryOrder.length - 1 ? 'default' : 'pointer',
                  border: 'none', fontSize: 'clamp(24px, 6vw, 40px)', fontWeight: 900, padding: '10px 30px',
                  borderRadius: 50, boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              >
                &gt;
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vh, 20px)', marginTop: 10, alignItems: 'center', flex: 1, minHeight: 0 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: 'clamp(10px, 1.5vw, 20px)', width: '100%', padding: 10, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
              {targets.map(t => {
                const isHover = hoveredTarget === t.id
                return (
                  <div key={t.id}
                    id={`target-${t.id}`}
                    onDrop={(e) => onDropTarget(e, t)}
                    onDragOver={allowDrop}
                    onDragEnter={(e) => onDragEnterTarget(e, t)}
                    onDragLeave={(e) => onDragLeaveTarget(e, t)}
                    style={{
                      flex: '1 1 0',
                      minWidth: 0,
                      maxWidth: '220px',
                      aspectRatio: '1',
                      borderRadius: 16,
                      background: 'rgba(255,255,255,0.9)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      border: t.matched ? 'none' : (isHover ? '3px dashed #1976d2' : '3px dashed #ccc'),
                      transition: 'all 180ms ease',
                      padding: 10
                    }}>
                    <img src={t.img} alt={t.id} style={{ width: '100%', maxWidth: '80%', height: 'auto', maxHeight: '60%', objectFit: 'contain', opacity: t.matched ? 0.6 : 1, filter: t.matched ? 'grayscale(0.1) brightness(0.98)' : 'none' }} />
                    <div style={{ height: 8 }} />
                    {t.matched ? <div style={{ color: '#2e7d32', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ fontSize: 'clamp(20px, 4vw, 28px)' }}>✓</span></div> : null}
                  </div>
                )
              })}
            </div>

            {targets.every(t => t.matched) ? (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
                <button
                  onClick={() => { setStep(2); reshuffleAll(); setTypeIndex(0); setLetters(['', '', '']); if (inputRefs.current[0]) inputRefs.current[0].focus() }}
                  style={{
                    padding: '16px 32px', fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 'bold', color: 'white',
                    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', border: 'none',
                    borderRadius: '50px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
                    animation: 'popIn 600ms cubic-bezier(.2,.9,.2,1) both'
                  }}
                >
                  Next: Type Exercise →
                </button>
              </div>
            ) : (
              <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', padding: '10px 0', background: 'rgba(255,255,255,0.6)', borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ fontWeight: 800, width: '100%', textAlign: 'center', marginBottom: 4, color: '#444', fontSize: 'clamp(14px, 2.5vw, 18px)' }}>Drag words to images</div>
                {draggables.map(d => (
                  <div
                    key={d.id}
                    id={`draggable-${d.id}`}
                    draggable={!d.used}
                    onDragStart={(e) => onDragStart(e, d)}
                    style={{
                      padding: 'clamp(6px, 1.5vh, 12px) clamp(16px, 3vw, 24px)',
                      background: 'white',
                      borderRadius: 12,
                      marginBottom: 4,
                      boxShadow: d.used ? 'none' : '0 4px 8px rgba(0,0,0,0.1)',
                      border: '2px solid #ddd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: d.used ? 'default' : 'grab',
                      opacity: d.used ? 0.5 : 1,
                      position: 'relative'
                    }}
                  >
                    <div style={{ fontSize: 'clamp(20px, 4vw, 32px)', fontWeight: 700 }}>{d.text}</div>
                    {d.used && (
                      <div style={{ position: 'absolute', right: -5, top: -5, color: '#fff', fontSize: 14, fontWeight: 900, background: '#4caf50', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div style={{ marginTop: 'clamp(10px, 2vh, 40px)', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {typeIndex >= typeOrder.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                <div style={{ fontSize: 'clamp(26px, 5vw, 36px)', fontWeight: 800, color: '#2e7d32' }}>All done — great typing!</div>
                <button
                  onClick={onNextExercise}
                  style={{
                    padding: '16px 32px',
                    fontSize: 'clamp(20px, 4vw, 26px)',
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
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={typeOrder[typeIndex].img} alt={typeOrder[typeIndex].id} style={{ width: '100%', maxWidth: '30vh', height: 'auto', maxHeight: '30vh', objectFit: 'contain' }} />
                <form onSubmit={onSubmitType} style={{ marginTop: 'clamp(10px, 2vh, 20px)' }}>
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 90 }}>
                    <div style={{ display: 'flex', gap: 'clamp(8px, 1.5vw, 16px)' }}>
                      {[0, 1, 2].map(i => (
                        <input
                          key={i}
                          ref={el => inputRefs.current[i] = el}
                          value={letters[i]}
                          onChange={e => {
                            const v = e.target.value.slice(0, 1)
                            setLetters(prev => {
                              const next = [...prev]
                              next[i] = v
                              return next
                            })
                            if (v && i < 2) {
                              const next = inputRefs.current[i + 1]
                              if (next) next.focus()
                            }
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Backspace') {
                              if (letters[i] === '') {
                                if (i > 0) {
                                  const prev = inputRefs.current[i - 1]
                                  setLetters(prevL => {
                                    const next = [...prevL]
                                    next[i - 1] = ''
                                    return next
                                  })
                                  if (prev) prev.focus()
                                  e.preventDefault()
                                }
                              } else {
                                setLetters(prevL => {
                                  const next = [...prevL]
                                  next[i] = ''
                                  return next
                                })
                                e.preventDefault()
                              }
                            } else if (e.key === 'ArrowLeft') {
                              if (i > 0 && inputRefs.current[i - 1]) inputRefs.current[i - 1].focus()
                              e.preventDefault()
                            } else if (e.key === 'ArrowRight') {
                              if (i < 2 && inputRefs.current[i + 1]) inputRefs.current[i + 1].focus()
                              e.preventDefault()
                            }
                          }}
                          placeholder="_"
                          maxLength={1}
                          style={{ width: 'clamp(60px, 15vw, 100px)', height: 'clamp(60px, 15vw, 100px)', fontSize: 'clamp(32px, 8vw, 54px)', textAlign: 'center', borderRadius: 16, border: '3px solid #ddd', boxShadow: '0 8px 18px rgba(0,0,0,0.06)' }}
                        />
                      ))}
                    </div>
                  </div>
                  <div style={{ height: 12 }}></div>
                  <button className="action-btn" type="submit" style={{ padding: '12px 24px', fontSize: 'clamp(18px, 3vw, 24px)', background: '#1976d2', color: 'white', borderRadius: 50, border: 'none', cursor: 'pointer' }}>Check word</button>
                </form>
              </div>
            )}
          </div>
        )}



      </div>

      <div style={{ height: '70px' }} /> {/* Spacer for footer */}

      {/* Word List Footer */}
      <div className="word-footer" style={{
        position: 'fixed', bottom: 10, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)',
        padding: '10px 30px', borderRadius: 50,
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        border: '3px solid rgba(255,255,255,0.8)',
        display: 'flex', gap: 20, alignItems: 'center', zIndex: 100,
        width: 'max-content', maxWidth: '95vw', overflowX: 'auto'
      }}>
        <span style={{ fontWeight: 800, color: '#1976d2', fontSize: 'clamp(14px, 3vw, 16px)', textTransform: 'uppercase', letterSpacing: 2 }}>Words:</span>
        <div style={{ display: 'flex', gap: 'clamp(10px, 2vw, 20px)' }}>
          {WORDS.map(w => (
            <span key={w.id} style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 700, color: '#333' }}>{w.id}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function TutorialOverlay({ draggables, targets }) {
  const [coords, setCoords] = useState(null)

  useEffect(() => {
    const findCoords = () => {
      // Find a valid move: an unused draggable that has a corresponding unmatched target
      let bestMove = null
      for (let d of draggables) {
        if (d.used) continue
        // find target
        const t = targets.find(tar => tar.id === d.id)
        if (t && !t.matched) {
          bestMove = { draggable: d, target: t }
          break
        }
      }

      if (bestMove) {
        const sourceEl = document.getElementById(`draggable-${bestMove.draggable.id}`)
        const targetEl = document.getElementById(`target-${bestMove.target.id}`)
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
    }

    setTimeout(findCoords, 100)
    window.addEventListener('resize', findCoords)
    return () => window.removeEventListener('resize', findCoords)
  }, [draggables, targets])

  if (!coords) return null

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
      <style>{`
         @keyframes moveHand {
             0% { transform: translate(${coords.startX}px, ${coords.startY}px) scale(1); opacity: 0; }
             10% { transform: translate(${coords.startX}px, ${coords.startY}px) scale(1); opacity: 1; }
             20% { transform: translate(${coords.startX}px, ${coords.startY}px) scale(0.9); } 
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
