// Positive feedback messages
const POSITIVE_FEEDBACKS = [
  '🌟 Great work!',
  '👍 Good job!',
  '🤩 Wow!',
  '✨ Amazing!',
  '🚀 Awesome!',
  '🎉 You did it!',
  '🦸 Super!',
  '🪄 Fantastic!',
  '🙂 Nice!',
  '🧠 Brilliant!'
];

import React, { useState, useRef, useEffect } from 'react'
import CONDITIONS from '../../../data/conditions'

const DIAG_OPTIONS = CONDITIONS.map(c => ({ id: c.id, label: c.title, img: c.img }))

const PART_A = [
  { q: 'My body is warm. I have headache and muscle pains.', answer: 'fever' },
  { q: 'My nose is runny. I am sneezing.', answer: 'cold' },
  { q: 'My eyes are red , itchy and watery.', answer: 'eye' },
  { q: 'I am pooping watery and loose.', answer: 'diarrhea' },
  { q: 'My skin is hot, red and itchy.', answer: 'skin' }
]

const PARTB_OPTIONS = ['plaster', 'ambulance', 'dentist', 'ointment', 'pain relief', 'tablet', 'facemask']

const PART_B = [
  { q: "I have pain in the teeth. You should go to ________", answer: 'dentist' },
  { q: 'I have chest pain. You should call an ________', answer: 'ambulance' },
  { q: 'I have a cut on my finger. You should put a ______ on it.', answer: 'plaster' },
  { q: 'I have pain on my legs. You should apply pain relief ________', answer: 'ointment' },
  { q: 'I feel tired. You should take ________', answer: 'tablet' },
  { q: 'I have cold and cough. You should not go out. Wear ________', answer: 'facemask' }
]

function shuffle(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export default function Assessment({ onDone, onNextExercise, mode = 'learn' }) {
  const [step, setStep] = useState('A')
  const [a1Index, setA1Index] = useState(0)
  const [a2Index, setA2Index] = useState(0)
  const [a1Drops, setA1Drops] = useState([]) // indices of PART_A that were correct in learn mode, or all answers in test mode
  const [a2Drops, setA2Drops] = useState([])
  const [optionsA, setOptionsA] = useState([])
  const [optionsB, setOptionsB] = useState(PARTB_OPTIONS)
  const [feedback, setFeedback] = useState(null)
  const [positiveMsg, setPositiveMsg] = useState(null)
  const [locked, setLocked] = useState(false)
  const confettiRef = useRef(null)
  const [testAnswers, setTestAnswers] = useState([])

  // Update options for Part A when the question changes
  useEffect(() => {
    if (step === 'A' && a1Index < PART_A.length) {
      const currentAnswerId = PART_A[a1Index].answer;
      const currentAnswerOpt = DIAG_OPTIONS.find(o => o.id === currentAnswerId);
      const distractors = DIAG_OPTIONS.filter(o => o.id !== currentAnswerId);
      const shuffledDistractors = shuffle(distractors).slice(0, 5);
      if (currentAnswerOpt) {
        setOptionsA(shuffle([currentAnswerOpt, ...shuffledDistractors]));
      } else {
        setOptionsA(shuffle(distractors).slice(0, 6));
      }
    }
  }, [a1Index, step]);

  function onDragStartOptionB(e, opt) { e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'optionB', val: opt })) }

  function handleSelectA(optId) {
    if (locked) return;
    const answer = PART_A[a1Index].answer;

    if (mode === 'test') {
      const isCorrect = optId === answer;
      const answerLabel = DIAG_OPTIONS.find(o => o.id === optId)?.label || optId;
      const correctLabel = DIAG_OPTIONS.find(o => o.id === answer)?.label || answer;

      setTestAnswers(prev => [...prev, {
        question: `Symptoms: ${PART_A[a1Index].q}`,
        user: answerLabel,
        correct: correctLabel,
        status: isCorrect ? 'correct' : 'wrong'
      }]);

      setA1Drops(prev => [...prev, optId]);
      setA1Index(idx => idx + 1);
      return;
    }

    if (optId === answer) {
      setLocked(true);
      setA1Drops(prev => [...prev, optId]);
      const msg = POSITIVE_FEEDBACKS[Math.floor(Math.random() * POSITIVE_FEEDBACKS.length)];
      setPositiveMsg(msg);
      setTimeout(() => {
        setPositiveMsg(null);
        setA1Index(idx => idx + 1);
        setLocked(false);
      }, 1200);
    } else {
      setPositiveMsg('Try again! You can do it!');
      setTimeout(() => setPositiveMsg(null), 1200);
    }
  }

  function handleDropB(e) {
    if (locked) return;
    e.preventDefault()
    const raw = e.dataTransfer.getData('text/plain')
    if (!raw) return
    let payload
    try { payload = JSON.parse(raw) } catch (err) { payload = { type: 'optionB', val: raw } }
    const answer = PART_B[a2Index].answer

    if (mode === 'test') {
      const isCorrect = payload.val === answer;
      setTestAnswers(prev => [...prev, {
        question: PART_B[a2Index].q,
        user: payload.val,
        correct: answer,
        status: isCorrect ? 'correct' : 'wrong'
      }]);
      setA2Drops(prev => [...prev, payload.val]);
      setA2Index(idx => idx + 1);
      return;
    }

    if (payload.type === 'optionB' && payload.val === answer) {
      setLocked(true)
      setA2Drops(prev => [...prev, payload.val])
      setOptionsB(prev => prev.filter(opt => opt !== payload.val))
      const msg = POSITIVE_FEEDBACKS[Math.floor(Math.random() * POSITIVE_FEEDBACKS.length)]
      setPositiveMsg(msg)
      setTimeout(() => {
        setPositiveMsg(null)
        setA2Index(idx => idx + 1)
        setLocked(false)
      }, 1200)
    } else if (payload.type === 'optionB') {
      setPositiveMsg('Try again! You can do it!')
      setTimeout(() => setPositiveMsg(null), 1200)
    }
  }

  function checkAnswers() {
    if (mode === 'test') {
      const score = Math.round((testAnswers.filter(a => a.status === 'correct').length / testAnswers.length) * 100);
      if (onDone) {
        onDone('health-assessment', score, { answers: testAnswers });
      }
      return;
    }

    let a1Correct = a1Drops.length;
    let a2Correct = a2Drops.length;
    const total = a1Correct + a2Correct
    setFeedback({ a1: a1Correct, a2: a2Correct, total })
    if (total === PART_A.length + PART_B.length && confettiRef.current) {
      const c = confettiRef.current; const ctx = c.getContext('2d'); c.width = window.innerWidth; c.height = window.innerHeight
      for (let i = 0; i < 200; i++) { ctx.fillStyle = `hsl(${Math.random() * 360},80%,60%)`; ctx.fillRect(Math.random() * c.width, Math.random() * c.height, 6, 6) }
    }
  }

  function resetAssessment() {
    setA1Index(0)
    setA2Index(0)
    setA1Drops([])
    setA2Drops([])
    setTestAnswers([])
    setOptionsB(PARTB_OPTIONS)
    setFeedback(null)
    setStep('A')
  }

  return (
    <div style={{ padding: '0 24px 24px 24px', minHeight: '100vh', position: 'relative' }}>
      {positiveMsg && (
        <div style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.97)', color: '#1976d2', fontWeight: 'bold', fontSize: 36, borderRadius: 18, boxShadow: '0 4px 24px #1976d2aa', padding: '18px 48px', zIndex: 1000, border: '3px solid #1976d2' }}>
          {positiveMsg}
        </div>
      )}

      <h2 style={{ textAlign: 'center', fontSize: 'clamp(32px, 8vw, 60px)', fontWeight: 900, marginTop: 40 }}>Health Quiz</h2>
      <p style={{ textAlign: 'center', fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 600, color: '#333', marginTop: -10, marginBottom: 30, padding: '0 20px' }}>
        {step === 'A' ? 'Choose the correct health problem based on the symptoms.' : 'Drag the correct solution to complete the sentence.'}
      </p>

      {step === 'A' && (
        <div style={{ width: '100%', margin: '12px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {a1Index < PART_A.length ? (
              <>
                <div style={{ marginBottom: 30 }}>
                  <div style={{ fontSize: 'clamp(20px, 5vw, 32px)', fontWeight: 700 }}>Part A Progress</div>
                  <div style={{ height: 24, background: '#e3f2fd', borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(a1Index / PART_A.length) * 100}%`, background: '#1976d2', transition: 'width 0.4s' }}></div>
                  </div>
                </div>
                <div style={{ fontSize: 'clamp(24px, 6vw, 42px)', fontWeight: 800, marginBottom: 40, lineHeight: 1.3 }}>{PART_A[a1Index].q}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 20, marginTop: 20 }}>
                  {optionsA.map(opt => (
                    <button key={opt.id} disabled={locked} onClick={() => handleSelectA(opt.id)} style={{ padding: 16, background: '#fff', borderRadius: 20, border: '4px solid #1976d2', cursor: 'pointer', opacity: locked ? 0.5 : 1, minHeight: 180, fontSize: 'clamp(18px, 4vw, 24px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px #1976d233' }}>
                      <img src={opt.img} alt={opt.label} style={{ width: '100%', maxWidth: 170, height: 'auto', maxHeight: 170, objectFit: 'contain', marginBottom: 12 }} />
                      <div style={{ fontWeight: 800, color: '#1976d2', fontSize: 'inherit' }}>{opt.label}</div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(32px, 8vw, 48px)', marginBottom: 30 }}>Great job! Part A complete.</div>
                <button className="action-btn" onClick={() => setStep('B')}>Next: Part B</button>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 'B' && (
        <div style={{ width: '100%', margin: '12px 0' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            {a2Index < PART_B.length ? (
              <>
                <div style={{ marginBottom: 30 }}>
                  <div style={{ fontSize: 'clamp(20px, 5vw, 32px)', fontWeight: 700 }}>Part B Progress</div>
                  <div style={{ height: 24, background: '#e3f2fd', borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(a2Index / PART_B.length) * 100}%`, background: '#1976d2' }}></div>
                  </div>
                </div>
                <div style={{ fontSize: 'clamp(24px, 6vw, 48px)', fontWeight: 800, marginBottom: 40, lineHeight: 1.4 }}>
                  {(() => {
                    const q = PART_B[a2Index].q;
                    const parts = q.split(/_{2,}/);
                    return (
                      <>
                        {parts[0]}
                        <span
                          onDragOver={e => e.preventDefault()}
                          onDrop={handleDropB}
                          style={{
                            display: 'inline-block',
                            minWidth: 'clamp(140px, 30vw, 200px)',
                            minHeight: 'clamp(40px, 8vw, 60px)',
                            borderBottom: '6px solid #1976d2',
                            background: a2Drops[a2Index] ? '#e3f2fd' : '#fff',
                            borderRadius: 12,
                            margin: '0 12px',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            fontWeight: 900,
                            fontSize: 'inherit',
                            color: '#1976d2',
                            transition: 'background 0.2s',
                            padding: '0 10px'
                          }}
                        >
                          {a2Drops[a2Index] ? a2Drops[a2Index] : <span style={{ color: '#bbb', fontWeight: 400, fontSize: '0.8em' }}>Drop here</span>}
                        </span>
                        {parts[1] || ''}
                      </>
                    );
                  })()}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 40, justifyContent: 'center' }}>
                  {optionsB.map(opt => (
                    <div key={opt} draggable={!locked} onDragStart={e => onDragStartOptionB(e, opt)} style={{ padding: 'clamp(16px, 3vw, 24px) clamp(24px, 4vw, 40px)', background: '#fff', borderRadius: 20, border: '4px solid #1976d2', cursor: 'grab', opacity: locked ? 0.5 : 1, fontSize: 'clamp(20px, 5vw, 36px)', fontWeight: 800, color: '#1976d2', minWidth: 'clamp(100px, 20vw, 160px)', minHeight: 70, boxShadow: '0 4px 16px #1976d233', textAlign: 'center', marginBottom: 12 }}>{opt}</div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <button className="action-btn" onClick={checkAnswers}>Check Final Results</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inline controls */}
      <div style={{ textAlign: 'center', marginTop: 40, paddingTop: 20, borderTop: '2px dashed #ccc' }}>
        <button className="action-btn secondary" style={{ fontSize: 16, padding: '6px 18px', marginRight: 10 }} onClick={resetAssessment}>Reset</button>

      </div>

      {feedback && (
        <div style={{ textAlign: 'center', marginTop: 18, background: 'white', padding: 20, borderRadius: 15 }}>
          <h3>Results</h3>
          <div style={{ fontSize: 24, marginBottom: 20 }}>Total Score: {feedback.total} / {PART_A.length + PART_B.length}</div>
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
      )}

      <canvas ref={confettiRef} style={{ position: 'fixed', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
    </div>
  )
}