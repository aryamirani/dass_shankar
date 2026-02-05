import React, { useState, useMemo, useRef, useEffect } from 'react'

// Words from PDF. Images located in public folder.
const WORDS = [
  { id: 'dam', img: '/GradeX/english/VocabularyThreeAM/dam.png' },
  { id: 'jam', img: '/GradeX/english/VocabularyThreeAM/jam.png' },
  { id: 'ham', img: '/GradeX/english/VocabularyThreeAM/ham.png' },
  
]

const POSITIVE = ['👍 Good', '✅ Yes', '🌟 Nice', '🎉 Great', '😃 Yay', '👌 Ok']
const GENTLE = ['👎 Retry', '☹️ Try again', '❌ Wrong']

export default function VocabularyThree({ onBack, onGoToAg }) {
  const [step, setStep] = useState(0) // 0: gallery, 1: match, 2: type
  const [viewIndex, setViewIndex] = useState(0)
  const [message, setMessage] = useState(null)
  const [hoveredTarget, setHoveredTarget] = useState(null)
  const [selectedDraggable, setSelectedDraggable] = useState(null)

  const voiceRef = useRef(null)
  const inputRefs = useRef([])

  // --- Data Setup ---
  const shuffleWords = (arr) => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t }
    return a
  }

  const [galleryOrder, setGalleryOrder] = useState(() => shuffleWords(WORDS))
  const [targets, setTargets] = useState(() => shuffleWords(WORDS).map(w => ({ ...w, matched: false })))
  const [draggables, setDraggables] = useState(() => shuffleWords(WORDS).map(w => ({ id: w.id, text: w.id, used: false })))
  const [typeOrder, setTypeOrder] = useState(() => shuffleWords(WORDS))
  const [letters, setLetters] = useState(['', '', ''])
  const [typeIndex, setTypeIndex] = useState(0)

  function reshuffleAll() {
    setGalleryOrder(shuffleWords(WORDS))
    setTargets(shuffleWords(WORDS).map(w => ({ ...w, matched: false })))
    setDraggables(shuffleWords(WORDS).map(w => ({ id: w.id, text: w.id, used: false })))
    setTypeOrder(shuffleWords(WORDS))
    setHoveredTarget(null)
    setSelectedDraggable(null)
    setTypeIndex(0)
    setLetters(['', '', ''])
  }

  // --- Voice & Speech ---
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const chooseVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      voiceRef.current = voices.find(v => v.lang.startsWith('en')) || voices[0]
    }
    chooseVoice()
    window.speechSynthesis.onvoiceschanged = chooseVoice
  }, [])

  function speak(text) {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    if (voiceRef.current) u.voice = voiceRef.current
    window.speechSynthesis.speak(u)
  }

  // --- Matching Logic ---
  function checkMatch(dragId, targetId) {
    if (dragId === targetId) {
      setTargets(prev => prev.map(t => t.id === targetId ? { ...t, matched: true } : t))
      setDraggables(prev => prev.map(d => d.id === dragId ? { ...d, used: true } : d))
      setMessage({ type: 'success', text: POSITIVE[Math.floor(Math.random() * POSITIVE.length)] })
    } else {
      setMessage({ type: 'error', text: GENTLE[Math.floor(Math.random() * GENTLE.length)] })
    }
    setSelectedDraggable(null)
    setHoveredTarget(null)
  }

  const onDragStart = (e, id) => e.dataTransfer.setData('text/plain', id)
  const onDrop = (e, target) => {
    e.preventDefault()
    checkMatch(e.dataTransfer.getData('text/plain'), target.id)
  }

  // --- Typing Logic ---
  function onSubmitType(e) {
    e.preventDefault()
    if (letters.join('').toLowerCase() === typeOrder[typeIndex].id.toLowerCase()) {
      setMessage({ type: 'success', text: POSITIVE[Math.floor(Math.random() * POSITIVE.length)] })
      setLetters(['', '', ''])
      setTypeIndex(i => i + 1)
    } else {
      setMessage({ type: 'error', text: GENTLE[Math.floor(Math.random() * GENTLE.length)] })
    }
  }

  useEffect(() => { if (message) setTimeout(() => setMessage(null), 1200) }, [message])

  const tabStyle = (i) => ({
    padding: '10px 16px', borderRadius: 20, fontWeight: 800, cursor: 'pointer',
    background: step === i ? '#1976d2' : '#fff',
    color: step === i ? '#fff' : '#1976d2',
    border: '2px solid #1976d2'
  })

  return (
    <div style={{ minHeight: '100vh', padding: 20, position: 'relative' }}>
      {onGoToAg && (
        <div style={{ position: 'absolute', right: 20, top: 20 }}>
          <button className="action-btn" onClick={onGoToAg} style={{ padding: '8px 12px', borderRadius: 999, fontWeight: 800 }}>Next</button>
        </div>
      )}
      
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 900, color: '#333' }}>"am" Words</h2>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, margin: '20px 0' }}>
          <button onClick={() => { setStep(0); reshuffleAll() }} style={tabStyle(0)}>Learn</button>
          <button onClick={() => { setStep(1); reshuffleAll() }} style={tabStyle(1)}>Match</button>
          <button onClick={() => { setStep(2); reshuffleAll() }} style={tabStyle(2)}>Type</button>
        </div>

        {/* Gallery */}
        {step === 0 && (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <img src={galleryOrder[viewIndex].img} alt="word" style={{ height: 250, objectFit: 'contain' }} />
            <div style={{ fontSize: 50, fontWeight: 800, margin: '20px 0' }}>{galleryOrder[viewIndex].id}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
              <button className="action-btn" onClick={() => setViewIndex(v => Math.max(0, v - 1))}>&lt;</button>
              <button className="action-btn" onClick={() => speak(galleryOrder[viewIndex].id)}>🔊 Listen</button>
              <button className="action-btn" onClick={() => setViewIndex(v => Math.min(galleryOrder.length - 1, v + 1))}>&gt;</button>
            </div>
          </div>
        )}

        {/* Matching */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 15, width: '100%' }}>
              {targets.map(t => (
                <div key={t.id} onDrop={(e) => onDrop(e, t)} onDragOver={e => e.preventDefault()} style={{ border: '3px dashed #ccc', padding: 15, borderRadius: 15, textAlign: 'center', background: t.matched ? '#dcfce7' : '#f9f9f9' }}>
                  <img src={t.img} style={{ height: 80, opacity: t.matched ? 0.5 : 1 }} alt="target" />
                  {t.matched && <div style={{ color: '#2e7d32', fontWeight: 900 }}>{t.id.toUpperCase()} ✓</div>}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              {draggables.map(d => (
                <div key={d.id} draggable={!d.used} onDragStart={e => onDragStart(e, d.id)} style={{ padding: '10px 20px', background: 'white', borderRadius: 10, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', cursor: d.used ? 'default' : 'grab', opacity: d.used ? 0.3 : 1, fontSize: 24, fontWeight: 700 }}>
                  {d.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Typing */}
        {step === 2 && typeIndex < typeOrder.length && (
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <img src={typeOrder[typeIndex].img} style={{ height: 200 }} alt="type-target" />
            <form onSubmit={onSubmitType} style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                {[0, 1, 2].map(i => (
                  <input
                    key={i}
                    ref={el => inputRefs.current[i] = el}
                    value={letters[i]}
                    maxLength={1}
                    onChange={e => {
                      const v = e.target.value.toLowerCase()
                      const newLetters = [...letters]; newLetters[i] = v; setLetters(newLetters)
                      if (v && i < 2) inputRefs.current[i+1].focus()
                    }}
                    style={{ width: 60, height: 60, fontSize: 30, textAlign: 'center', borderRadius: 10, border: '2px solid #1976d2' }}
                  />
                ))}
              </div>
              <button className="action-btn" type="submit" style={{ marginTop: 20 }}>Check Word</button>
            </form>
          </div>
        )}
        {step === 2 && typeIndex >= typeOrder.length && <h2 style={{ textAlign: 'center', color: '#2e7d32' }}>Excellent Typing! 🎉</h2>}
      </div>

      {/* Floating Success/Error Message */}
      {message && (
        <div style={{ position: 'fixed', top: 100, left: '50%', transform: 'translateX(-50%)', padding: '15px 30px', borderRadius: 15, background: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', fontSize: 28, fontWeight: 800, zIndex: 1000 }}>
          {message.text}
        </div>
      )}

      {/* Footer Word Reference */}
      <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: '10px 30px', borderRadius: 50, boxShadow: '0 5px 15px rgba(0,0,0,0.1)', display: 'flex', gap: 20 }}>
        {WORDS.map(w => <span key={w.id} style={{ fontWeight: 700, fontSize: 24 }}>{w.id}</span>)}
      </div>
    </div>
  )
}