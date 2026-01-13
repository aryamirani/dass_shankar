import React, { useState, useMemo, useRef, useEffect } from 'react'

const WORDS = [
  { id: 'bat', img: '/assets/bat.png' },
  { id: 'cat', img: '/assets/cat.png' },
  { id: 'hat', img: '/assets/hat.png' },
  { id: 'mat', img: '/assets/mat.png' },
  { id: 'rat', img: '/assets/rat.png' }
]

const POSITIVE = [
  '🌟 Great job!', '🎉 Yay!', '🙂 Nice!', '🚀 Awesome!', '👍 Well done!', '✨ Fantastic!'
]
const GENTLE = ['Try again!', 'Almost — try another one!', 'Nice effort — try again!']

export default function VocabularyThree({ onBack }) {
  const [step, setStep] = useState(0) // 0: gallery, 1: match, 2: type
  const [viewIndex, setViewIndex] = useState(0)
  const [message, setMessage] = useState(null)
  const [hoveredTarget, setHoveredTarget] = useState(null)

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
  const voiceRef = useRef(null)

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 1200)
      return () => clearTimeout(t)
    }
  }, [message])

  // pick a reasonable English voice (if available) and respond to voice list changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    function chooseVoice() {
      const voices = window.speechSynthesis.getVoices() || []
      if (!voices.length) return

      // Prioritize high-quality voices
      let v = voices.find(v => v.name === 'Google US English')
      v = v || voices.find(v => v.name === 'Samantha')
      v = v || voices.find(v => v.name.includes('Natural') && v.lang.startsWith('en'))
      v = v || voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en-us'))
      v = v || voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en-gb'))
      v = v || voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en'))
      v = v || voices[0]
      voiceRef.current = v
    }
    chooseVoice()
    // some browsers populate voices asynchronously
    window.speechSynthesis.onvoiceschanged = chooseVoice
    return () => { try { window.speechSynthesis.onvoiceschanged = null } catch (e) { } }
  }, [])

  // speak a word using Web Speech API
  function speak(text) {
    try {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
        const u = new SpeechSynthesisUtterance(text)
        // prefer a selected voice if available
        if (voiceRef.current) u.voice = voiceRef.current
        u.lang = (voiceRef.current && voiceRef.current.lang) ? voiceRef.current.lang : 'en-US'
        // gentle settings to avoid very high-pitched voices
        u.rate = 1.0
        u.pitch = 1.0
        u.volume = 1
        window.speechSynthesis.speak(u)
      }
    } catch (e) {
      console.warn('Speech failed', e)
    }
  }

  // tab styles for header buttons
  const tabFilled = { padding: '10px 16px', borderRadius: 20, background: '#1976d2', border: 'none', color: '#fff', fontWeight: 800, boxShadow: '0 8px 18px rgba(25,118,210,0.18)' }
  const tabOutline = { padding: '10px 16px', borderRadius: 20, background: '#fff', border: '2px solid #1976d2', color: '#0d47a1', fontWeight: 700, boxShadow: '0 6px 14px rgba(25,118,210,0.08)' }
  const tabStyle = (i) => step === i ? tabFilled : tabOutline

  // drag handlers
  function onDragStart(e, item) {
    e.dataTransfer.setData('text/plain', item.id)
  }

  function onDropTarget(e, target) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (!id) return
    if (id === target.id) {
      setTargets(prev => prev.map(t => t.id === target.id ? { ...t, matched: true } : t))
      setDraggables(prev => prev.map(d => d.id === id ? { ...d, used: true } : d))
      setHoveredTarget(null)
      setMessage({ type: 'success', text: POSITIVE[Math.floor(Math.random() * POSITIVE.length)] })
    } else {
      setHoveredTarget(null)
      setMessage({ type: 'error', text: GENTLE[Math.floor(Math.random() * GENTLE.length)] })
    }
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
    <div style={{ minHeight: '100vh', padding: 20, boxSizing: 'border-box', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 20, top: 20 }}>
        <button className="action-btn" onClick={onBack} style={{ padding: '8px 12px' }}>Back</button>
      </div>

      <div style={{ maxWidth: 980, margin: '0 auto', background: 'rgba(255,255,255,0.0)', padding: 10 }}>
        <h2 style={{ textAlign: 'center', fontSize: 28 }}>Vocabulary set: bat, cat, hat, mat, rat</h2>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 18 }}>
          <button className="action-btn" onClick={() => { setStep(0); reshuffleAll() }} style={tabStyle(0)}>Visual Reference</button>
          <button className="action-btn" onClick={() => { setStep(1); reshuffleAll() }} style={tabStyle(1)}>Interactive Matching</button>
          <button className="action-btn" onClick={() => { setStep(2); reshuffleAll(); setTypeIndex(0); setLetters(['', '', '']); if (inputRefs.current[0]) inputRefs.current[0].focus() }} style={tabStyle(2)}>Type the word</button>
        </div>

        {step === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, marginTop: 40 }}>
            <button
              className="action-btn"
              onClick={() => setViewIndex(prev => Math.max(0, prev - 1))}
              disabled={viewIndex === 0}
              style={{
                background: 'transparent', color: viewIndex === 0 ? '#ccc' : '#1976d2',
                cursor: viewIndex === 0 ? 'default' : 'pointer',
                border: 'none', fontSize: 60, fontWeight: 900, padding: 20
              }}
            >
              &lt;
            </button>

            <div key={galleryOrder[viewIndex].id} onClick={() => speak(galleryOrder[viewIndex].id)} style={{ textAlign: 'center', width: 320, background: '#fff', borderRadius: 20, padding: 30, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer' }}>
              <img src={galleryOrder[viewIndex].img} alt={galleryOrder[viewIndex].id} style={{ width: 220, height: 180, objectFit: 'contain' }} />
              <div style={{ height: 20 }} />
              <div style={{ fontSize: 36, fontWeight: 800, color: '#111' }}>{galleryOrder[viewIndex].id}</div>
              <div style={{ marginTop: 10, color: '#666', fontSize: 14 }}>Click to listen</div>
            </div>

            <button
              className="action-btn"
              onClick={() => setViewIndex(prev => Math.min(galleryOrder.length - 1, prev + 1))}
              disabled={viewIndex === galleryOrder.length - 1}
              style={{
                background: 'transparent', color: viewIndex === galleryOrder.length - 1 ? '#ccc' : '#1976d2',
                cursor: viewIndex === galleryOrder.length - 1 ? 'default' : 'pointer',
                border: 'none', fontSize: 60, fontWeight: 900, padding: 20
              }}
            >
              &gt;
            </button>
          </div>
        )}

        {step === 1 && (
          <div style={{ display: 'flex', gap: 30, marginTop: 20, alignItems: 'flex-start' }}>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
              {targets.map(t => {
                const isHover = hoveredTarget === t.id
                return (
                  <div key={t.id}
                    onDrop={(e) => onDropTarget(e, t)}
                    onDragOver={allowDrop}
                    onDragEnter={(e) => onDragEnterTarget(e, t)}
                    onDragLeave={(e) => onDragLeaveTarget(e, t)}
                    style={{
                      minHeight: 160,
                      borderRadius: 14,
                      background: t.matched ? 'linear-gradient(180deg,#e8f5e9,#ffffff)' : 'rgba(255,255,255,0.95)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                      boxShadow: isHover ? '0 10px 20px rgba(25,118,210,0.12)' : '0 6px 12px rgba(0,0,0,0.06)',
                      border: t.matched ? '3px solid #2e7d32' : (isHover ? '3px dashed #1976d2' : '2px dashed rgba(0,0,0,0.12)'),
                      transition: 'all 180ms ease'
                    }}>
                    <img src={t.img} alt={t.id} style={{ width: 160, height: 120, objectFit: 'contain', opacity: t.matched ? 0.6 : 1, filter: t.matched ? 'grayscale(0.1) brightness(0.98)' : 'none' }} />
                    <div style={{ height: 8 }} />
                    {t.matched ? <div style={{ color: '#2e7d32', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 20 }}>✓</span>Matched</div> : <div style={{ height: 22 }} />}
                  </div>
                )
              })}
            </div>

            <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontWeight: 800 }}>Drag the word tiles onto the matching image</div>
              {draggables.map(d => (
                <div
                  key={d.id}
                  draggable={!d.used}
                  onDragStart={(e) => onDragStart(e, d)}
                  style={{
                    padding: 10,
                    background: 'transparent',
                    borderRadius: 10,
                    marginBottom: 12,
                    boxShadow: d.used ? 'none' : '0 6px 14px rgba(0,0,0,0.04)',
                    border: '2px solid #000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: d.used ? 'default' : 'grab',
                    opacity: d.used ? 0.9 : 1,
                    position: 'relative'
                  }}
                >
                  <div style={{ fontSize: 22, fontWeight: 800, padding: '18px 28px', borderRadius: 8, background: 'transparent' }}>{d.text}</div>
                  {d.used && (
                    <div style={{ position: 'absolute', right: 6, top: 6, color: '#2e7d32', fontSize: 36, fontWeight: 900, background: 'rgba(255,255,255,0.6)', borderRadius: 20, padding: '2px 8px', boxShadow: '0 6px 12px rgba(0,0,0,0.06)' }}>✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            {typeIndex >= typeOrder.length ? (
              <div style={{ fontSize: 24, fontWeight: 800, color: '#2e7d32' }}>All done — great typing!</div>
            ) : (
              <div>
                <img src={typeOrder[typeIndex].img} alt={typeOrder[typeIndex].id} style={{ width: 260, height: 200, objectFit: 'contain' }} />
                <form onSubmit={onSubmitType} style={{ marginTop: 12 }} onPaste={(e) => {
                  e.preventDefault()
                  const pasted = (e.clipboardData || window.clipboardData).getData('text').trim().slice(0, 3)
                  if (!pasted) return
                  const chars = pasted.split('')
                  setLetters(prev => {
                    const next = [...prev]
                    for (let i = 0; i < 3; i++) next[i] = chars[i] || ''
                    return next
                  })
                  const nextIndex = Math.min(2, pasted.length - 1)
                  setTimeout(() => { if (inputRefs.current[nextIndex]) inputRefs.current[nextIndex].focus() }, 20)
                }}>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 10 }}>
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
                        style={{ width: 60, height: 60, fontSize: 28, textAlign: 'center', borderRadius: 8, border: '2px solid #ddd', boxShadow: '0 8px 18px rgba(0,0,0,0.06)' }}
                      />
                    ))}
                  </div>
                  <div style={{ height: 12 }}></div>
                  <button className="action-btn" type="submit" style={{ padding: '8px 16px' }}>Submit</button>
                </form>
              </div>
            )}
          </div>
        )}

        {message && (
          <div style={{ position: 'fixed', top: 40, left: '50%', transform: 'translateX(-50%)', padding: '12px 26px', fontSize: message.type === 'success' ? 36 : 28, fontWeight: 800, color: message.type === 'success' ? '#155724' : '#856404', background: message.type === 'success' ? 'rgba(212,237,218,0.98)' : 'rgba(255,243,205,0.95)', borderRadius: 14, boxShadow: '0 8px 22px rgba(0,0,0,0.1)' }}>
            {message.text}
          </div>
        )}

      </div>
    </div>
  )
}
