import React, { useState, useEffect, useRef } from 'react'

export default function ComputerKeyboard({ onBack }) {
    const [target, setTarget] = useState('')
    const [typed, setTyped] = useState('')
    const [result, setResult] = useState(null)
    const [activeKey, setActiveKey] = useState(null)

    // Refs for audio
    const correctRef = useRef()
    const wrongRef = useRef()

    const wordbank = [
        'hello', 'cat', 'dog', 'cap', 'stick', 'shoes', 'shirt', 'balloon',
        'apple', 'glowing', 'keyboard', 'computer', 'screen', 'mouse', 'click'
    ]

    const rows = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ]

    useEffect(() => {
        setTarget(wordbank[Math.floor(Math.random() * wordbank.length)])
    }, [])

    const handleInput = (key) => {
        if (result === 'correct') return

        if (key === 'Backspace') {
            setTyped(t => t.slice(0, -1))
        } else if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
            setTyped(t => t + key.toLowerCase())
        }
    }

    // Physical Keyboard Sync
    useEffect(() => {
        function onKey(e) {
            // Prevent default behavior for some keys if needed, but usually we want to let them stay
            // e.preventDefault() // Maybe better not to prevent default globally unless needed

            const k = e.key.toLowerCase()
            setActiveKey(k === 'backspace' ? 'backspace' : k)
            handleInput(e.key)

            // Remove highlight
            setTimeout(() => setActiveKey(null), 150)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [result, typed])

    // Win Logic
    useEffect(() => {
        if (!target) return
        if (typed.toLowerCase() === target) {
            correctRef.current?.play()
            setResult('correct')
            setTimeout(() => {
                setTarget(wordbank[Math.floor(Math.random() * wordbank.length)])
                setTyped('')
                setResult(null)
            }, 1000)
        }
    }, [typed, target])

    const reset = () => {
        setTarget(wordbank[Math.floor(Math.random() * wordbank.length)])
        setTyped('')
        setResult(null)
        // Refocus window to ensure keyboard capture works if they clicked the button
        window.focus()
    }

    return (
        <div style={{
            minHeight: '100vh',
            // background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', // Handled by App.jsx
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Outfit", sans-serif',
            color: 'white',
            overflow: 'hidden',
            userSelect: 'none'
        }}>

            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)',
                borderRadius: 24,
                padding: 'clamp(20px, 4vw, 40px)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
                width: '95%',
                maxWidth: 900
            }}>
                {/* Header / Instructions */}
                <h1 style={{
                    margin: 0,
                    fontSize: 'clamp(24px, 5vw, 32px)',
                    fontWeight: 600,
                    background: 'linear-gradient(90deg, #60a5fa, #c084fc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center'
                }}>
                    Typing Master
                </h1>

                {/* Word Display */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                    minHeight: 120
                }}>
                    <div style={{
                        fontSize: 'clamp(32px, 8vw, 48px)',
                        fontWeight: 700,
                        letterSpacing: 2,
                        textShadow: '0 0 20px rgba(255,255,255,0.2)',
                        textAlign: 'center',
                        wordBreak: 'break-all'
                    }}>
                        {target}
                    </div>

                    {/* Typed Input Feedback */}
                    <div style={{
                        fontSize: 'clamp(24px, 6vw, 32px)',
                        color: result === 'correct' ? '#4ade80' : '#e2e8f0',
                        minHeight: 40,
                        borderBottom: '2px solid rgba(255,255,255,0.3)',
                        padding: '0 20px',
                        transition: 'all 0.2s',
                        textShadow: result === 'correct' ? '0 0 10px #4ade80' : 'none',
                        textAlign: 'center',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        maxWidth: '100%'
                    }}>
                        {typed}<span className="blink">|</span>
                    </div>
                </div>

                {/* Virtual Keyboard */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    marginTop: 10,
                    padding: 'clamp(10px, 2vw, 20px)',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: 16,
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    {rows.map((row, rIdx) => (
                        <div key={rIdx} style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(2px, 1vw, 8px)' }}>
                            {row.map(char => {
                                const isActive = activeKey === char
                                return (
                                    <button
                                        key={char}
                                        onMouseDown={() => {
                                            setActiveKey(char)
                                            handleInput(char)
                                        }}
                                        onMouseUp={() => setActiveKey(null)}
                                        onMouseLeave={() => setActiveKey(null)}
                                        onTouchStart={(e) => {
                                            e.preventDefault() // prevent mouse emulation double firing
                                            setActiveKey(char)
                                            handleInput(char)
                                        }}
                                        onTouchEnd={() => setActiveKey(null)}
                                        style={{
                                            width: 'clamp(28px, 8vw, 50px)',
                                            height: 'clamp(36px, 10vw, 50px)',
                                            borderRadius: 8,
                                            border: 'none',
                                            background: isActive ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            fontSize: 'clamp(14px, 4vw, 20px)',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'all 0.1s',
                                            boxShadow: isActive ? '0 0 15px #3b82f6' : '0 4px 0 rgba(0,0,0,0.3)',
                                            transform: isActive ? 'translateY(4px)' : 'translateY(0)',
                                            textTransform: 'uppercase',
                                            padding: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {char}
                                    </button>
                                )
                            })}
                        </div>
                    ))}

                    {/* Space and Backspace Row */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 4 }}>
                        <button
                            onMouseDown={() => {
                                setActiveKey('backspace')
                                handleInput('Backspace')
                            }}
                            onMouseUp={() => setActiveKey(null)}
                            onMouseLeave={() => setActiveKey(null)}
                            onTouchStart={(e) => {
                                e.preventDefault()
                                setActiveKey('backspace')
                                handleInput('Backspace')
                            }}
                            onTouchEnd={() => setActiveKey(null)}
                            style={{
                                height: 'clamp(36px, 10vw, 50px)',
                                padding: '0 20px',
                                borderRadius: 8,
                                border: 'none',
                                background: activeKey === 'backspace' ? '#ef4444' : 'rgba(255,255,255,0.1)',
                                color: 'white',
                                fontSize: 'clamp(12px, 3.5vw, 16px)',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.1s',
                                boxShadow: activeKey === 'backspace' ? '0 0 15px #ef4444' : '0 4px 0 rgba(0,0,0,0.3)',
                                transform: activeKey === 'backspace' ? 'translateY(4px)' : 'translateY(0)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            Backspace ⌫
                        </button>
                    </div>
                </div>

                {/* Controls */}
                <div style={{ marginTop: 10 }}>
                    <button
                        onClick={reset}
                        style={{
                            padding: '12px 30px',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: '#94a3b8',
                            borderRadius: 10,
                            cursor: 'pointer',
                            fontSize: 16,
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'white'; e.currentTarget.style.color = 'white' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#94a3b8' }}
                    >
                        Skip Word
                    </button>
                </div>
            </div>

            <style>{`
                .blink {
                    animation: blinker 1s linear infinite;
                }
                @keyframes blinker {
                    50% { opacity: 0; }
                }
            `}</style>

            <audio ref={correctRef} src="/GradeX/computer/Keyboard/correct.wav" />
            <audio ref={wrongRef} src="/GradeX/computer/Keyboard/wrong.wav" />
        </div>
    )
}
