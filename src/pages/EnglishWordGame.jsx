import React, { useState, useEffect } from 'react'

export default function EnglishWordGame({ onBack }) {
    const [leftWords, setLeftWords] = useState([])
    const [rightWords, setRightWords] = useState([])
    const [selectedLeft, setSelectedLeft] = useState(null)
    const [healedWords, setHealedWords] = useState([])
    const [shaking, setShaking] = useState(null)

    const wordPairs = {
        "Sun": "Flower",
        "Tooth": "Brush",
        "Rain": "Bow",
        "Jelly": "Fish",
        "Head": "Ache"
    }

    useEffect(() => {
        const keys = Object.keys(wordPairs)
        const values = Object.values(wordPairs)
        setLeftWords(shuffle([...keys]))
        setRightWords(shuffle([...values]))
    }, [])

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const handleLeftClick = (word) => {
        // If already healed, ignore (though we filter them out usually)
        if (healedWords.some(hw => hw.includes(word))) return
        setSelectedLeft(word)
    }

    const handleRightClick = (word) => {
        if (healedWords.some(hw => hw.includes(word))) return

        if (!selectedLeft) {
            shakeBox(word)
            return
        }

        const correctMatch = wordPairs[selectedLeft]
        if (word === correctMatch) {
            // Success
            setHealedWords(prev => [...prev, selectedLeft + word])
            setSelectedLeft(null)
        } else {
            // Failure
            shakeBox(selectedLeft)
            shakeBox(word)
        }
    }

    const shakeBox = (id) => {
        setShaking(id)
        setTimeout(() => setShaking(null), 500)
    }

    const isHealed = (word, side) => {
        // This logic is tricky because healedWords is "SunFlower". We check if "Sun" is part of a healed word pair.
        // Simplifying: we'll just track matched indices or words.
        // Actually, looking at the code, let's just use a derived check.
        if (side === 'left') return healedWords.some(hw => hw.startsWith(word))
        if (side === 'right') return healedWords.some(hw => hw.endsWith(word))
        return false
    }

    return (
        <div className="landing-root">
            <div className="landing-inner" style={{ alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: 20, top: 20 }}>
                    <button className="back-btn" onClick={onBack}>←</button>
                </div>

                <h1 className="center-title" style={{ fontSize: 40, marginBottom: 10 }}>Word Surgery</h1>
                <p style={{ fontSize: 20, color: '#555', marginBottom: 30 }}>Tap a blue word part, then tap the matching red part!</p>

                <div style={{ display: 'flex', gap: 60, marginBottom: 40 }}>
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 200 }}>
                        <h3 style={{ textAlign: 'center', color: '#444' }}>Part 1</h3>
                        {leftWords.map(word => {
                            const healed = isHealed(word, 'left')
                            if (healed) return <div key={word} style={{ height: 60 }} /> // Placeholder to keep layout stable or just hide

                            return (
                                <button
                                    key={word}
                                    onClick={() => handleLeftClick(word)}
                                    className={shaking === word ? 'shake' : ''}
                                    style={{
                                        background: selectedLeft === word ? '#fff9c4' : 'white',
                                        border: `3px solid ${selectedLeft === word ? '#fbc02d' : '#3498db'}`,
                                        borderRadius: 12,
                                        padding: 16,
                                        fontSize: 24,
                                        cursor: 'pointer',
                                        transform: selectedLeft === word ? 'scale(1.05)' : 'scale(1)',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 4px 0 #ddd',
                                        opacity: healed ? 0 : 1,
                                        pointerEvents: healed ? 'none' : 'auto'
                                    }}
                                >
                                    {word}
                                </button>
                            )
                        })}
                    </div>

                    {/* Right Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 200 }}>
                        <h3 style={{ textAlign: 'center', color: '#444' }}>Part 2</h3>
                        {rightWords.map(word => {
                            const healed = isHealed(word, 'right')
                            if (healed) return <div key={word} style={{ height: 60 }} />

                            return (
                                <button
                                    key={word}
                                    onClick={() => handleRightClick(word)}
                                    className={shaking === word ? 'shake' : ''}
                                    style={{
                                        background: 'white',
                                        border: '3px solid #e74c3c',
                                        borderRadius: 12,
                                        padding: 16,
                                        fontSize: 24,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 4px 0 #ddd',
                                        opacity: healed ? 0 : 1
                                    }}
                                >
                                    {word}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {healedWords.length > 0 && (
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <h3 style={{ color: '#2ecc40' }}>Healed Words:</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 600 }}>
                            {healedWords.map(hw => (
                                <span key={hw} style={{
                                    background: '#2ecc40', color: 'white', padding: '8px 16px', borderRadius: 20, fontWeight: 'bold', fontSize: 18,
                                    animation: 'popIn 0.5s both'
                                }}>
                                    {hw}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <style>{`
          .shake { animation: shake 0.5s; }
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            50% { transform: translateX(10px); }
            75% { transform: translateX(-10px); }
            100% { transform: translateX(0); }
          }
        `}</style>
            </div>
        </div>
    )
}
