import React, { useState, useRef, useEffect } from 'react'

const POSITIVE = [
    '🌟 Great job!', '👍 Perfect!', '🤩 Excellent!', '🚀 Awesome!', '🎉 Well done!', '✨ Fantastic!', '🧠 You got it!'
]

const GENTLE = [
    '🔁 Try again!', '🙂 Almost there — check your spelling!', '💪 Nice try — give it another shot!'
]

export default function ScienceHuman({ onBack, onNextExercise }) {
    const [index, setIndex] = useState(null)
    const [typed, setTyped] = useState('')
    const [result, setResult] = useState(null) // 'correct' | 'wrong' | null
    const [message, setMessage] = useState(null)
    const correctAudio = useRef()
    const wrongAudio = useRef()

    const items = [
        {
            img: '/Grade2/science/Human/lungs.png',
            valid: ['lungs', 'lung'],
            audio: '/Grade2/science/Human/lungs.m4a',
            name: 'Lungs'
        },
        {
            img: '/Grade2/science/Human/heart.webp',
            valid: ['heart'],
            audio: '/Grade2/science/Human/heart.m4a',
            name: 'Heart'
        }
    ]

    const [completed, setCompleted] = useState([])

    function startRound() {
        // Find items not yet completed
        const available = items.map((_, i) => i).filter(i => !completed.includes(i))

        if (available.length === 0) {
            setIndex(null) // All done
            return
        }

        // Pick a random available item
        const newIndex = available[Math.floor(Math.random() * available.length)]
        setIndex(newIndex)
        setTyped('')
        setResult(null)
        setMessage(null)
    }

    // auto-start on mount
    useEffect(() => { startRound() }, [])

    function checkAnswer() {
        if (index === null) return
        const ans = typed.toLowerCase().trim()

        if (items[index].valid.includes(ans)) {
            correctAudio.current?.play()
            setResult('correct')
            setMessage(POSITIVE[Math.floor(Math.random() * POSITIVE.length)])
            setTimeout(() => {
                const a = new Audio(items[index].audio)
                a.play()
                if (!completed.includes(index)) {
                    setCompleted(prev => [...prev, index])
                }
            }, 300)
        } else {
            wrongAudio.current?.play()
            setResult('wrong')
            setMessage(GENTLE[Math.floor(Math.random() * GENTLE.length)])
        }
    }

    // Handle Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (result === 'correct') {
                startRound()
            } else {
                checkAnswer()
            }
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            // background handled by App.jsx
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            fontFamily: '"Outfit", sans-serif'
        }}>

            <div style={{
                width: '100%',
                maxWidth: 900,
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 24,
                padding: 'clamp(20px, 4vw, 40px)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                display: 'flex',
                gap: 'clamp(20px, 4vw, 40px)',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap'
            }}>
                <div style={{ flex: 1, minWidth: 300 }}>
                    <div style={{
                        height: 400,
                        background: '#f0f9ff',
                        borderRadius: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #e0f2fe',
                        overflow: 'hidden'
                    }}>
                        {index !== null ? (
                            <img
                                src={items[index].img}
                                alt="organ"
                                style={{
                                    maxWidth: '85%',
                                    maxHeight: '85%',
                                    objectFit: 'contain',
                                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
                                }}
                            />
                        ) : (
                            <div style={{ color: '#94a3b8', fontSize: 18 }}>Loading...</div>
                        )}
                    </div>
                </div>

                <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                        <h1 style={{
                            fontSize: 36,
                            fontWeight: 800,
                            color: '#1e293b',
                            margin: '0 0 10px 0',
                            background: 'linear-gradient(90deg, #2563eb, #db2777)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Identify the Organ
                        </h1>
                        <p style={{ color: '#64748b', fontSize: 18, margin: 0 }}>
                            Type the name of the organ shown in the image.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                        <input
                            value={typed}
                            onChange={e => { setTyped(e.target.value); setResult(null); setMessage(null) }}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your answer..."
                            style={{
                                padding: '16px 20px',
                                fontSize: 20,
                                borderRadius: 12,
                                border: result === 'correct' ? '2px solid #22c55e' : (result === 'wrong' ? '2px solid #ef4444' : '2px solid #cbd5e1'),
                                outline: 'none',
                                width: '100%',
                                boxSizing: 'border-box',
                                transition: 'all 0.2s',
                                background: result === 'correct' ? '#f0fdf4' : (result === 'wrong' ? '#fef2f2' : 'white')
                            }}
                        />

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={checkAnswer}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 12,
                                    fontSize: 18,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'transform 0.1s',
                                    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)'
                                }}
                                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                Check Answer
                            </button>

                            <button
                                onClick={startRound}
                                disabled={result !== 'correct'}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    background: result === 'correct' ? '#10b981' : '#e2e8f0',
                                    color: result === 'correct' ? 'white' : '#94a3b8',
                                    border: 'none',
                                    borderRadius: 12,
                                    fontSize: 18,
                                    fontWeight: 600,
                                    cursor: result === 'correct' ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {completed.length === items.length - 1 && result === 'correct' ? 'Finish' : 'Next Organ →'}
                            </button>
                        </div>
                    </div>

                    <div style={{ minHeight: 60 }}>
                        {message && (
                            <div style={{
                                background: result === 'correct' ? '#dcfce7' : '#fee2e2',
                                color: result === 'correct' ? '#166534' : '#991b1b',
                                padding: '16px',
                                borderRadius: 12,
                                fontSize: 18,
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                animation: 'fadeIn 0.3s ease-out'
                            }}>
                                {message}
                            </div>
                        )}
                        {completed.length === items.length && (
                            <div style={{ marginTop: 20, textAlign: 'center' }}>
                                <h2 style={{ color: '#2e7d32', marginBottom: 20 }}>Excellent! You identified all organs! 🎉</h2>
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
                                        animation: 'popIn 600ms cubic-bezier(.2,.9,.2,1) 200ms both',
                                        width: '100%'
                                    }}
                                    onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
                                >
                                    Next Exercise →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <audio ref={correctAudio} src="/Grade2/science/Human/correct.wav" />
            <audio ref={wrongAudio} src="/Grade2/science/Human/wrong.wav" />
        </div>
    )
}
