import React, { useState } from 'react'

export default function EnglishFillBlanks({ onBack }) {
    const data = [
        { clue: "A vehicle with wings to fly", answer: "airplane" },
        { clue: "A room where we sleep", answer: "bedroom" },
        { clue: "A person who studies in the same class", answer: "classmate" },
        { clue: "A container used to put trash", answer: "dustbin" },
        { clue: "An ornament for ear", answer: "earring" }
    ]

    const [answers, setAnswers] = useState({})
    const [shuffledWords] = useState(() => data.map(d => d.answer).sort(() => Math.random() - 0.5))
    const [result, setResult] = useState(null)

    const onDragStart = (e, word) => {
        e.dataTransfer.setData("text", word)
    }

    const onDrop = (e, index) => {
        e.preventDefault()
        const word = e.dataTransfer.getData("text")
        if (!word) return
        setAnswers(prev => ({ ...prev, [index]: word }))
    }

    const checkAnswers = () => {
        let correctCount = 0
        data.forEach((item, i) => {
            if (answers[i] === item.answer) correctCount++
        })
        setResult(correctCount === data.length ? "Perfect! All Correct!" : `You got ${correctCount} out of ${data.length} correct.`)
    }

    return (
        <div className="landing-root" style={{ overflowY: 'auto', display: 'block', height: '100vh' }}>
            {/* Back Button */}
            <div style={{ position: 'fixed', left: 20, top: 20, zIndex: 100 }}>
                <button className="back-btn" onClick={onBack}>←</button>
            </div>

            <div style={{ maxWidth: 1200, margin: '80px auto 40px', padding: '0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                    <h1 style={{ fontSize: 48, fontWeight: 900, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.2)', margin: 0 }}>Fill in the Blanks</h1>
                    <button className="action-btn" onClick={checkAnswers}>Check Answers</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40, padding: 40, maxWidth: 1400, margin: '0 auto' }}>

                    {/* Questions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {data.map((item, i) => {
                            const userAnswer = answers[i]
                            const isCorrect = result && userAnswer === item.answer
                            const isWrong = result && userAnswer && userAnswer !== item.answer

                            return (
                                <div key={i} style={{ background: 'white', padding: 16, borderRadius: 12, fontSize: 18, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                    <span style={{ fontWeight: 'bold', marginRight: 8 }}>{i + 1}.</span>
                                    {item.clue}:
                                    <div
                                        onDragOver={e => e.preventDefault()}
                                        onDrop={e => onDrop(e, i)}
                                        style={{
                                            display: 'inline-block', minWidth: 150, borderBottom: '2px solid #555', margin: '0 10px',
                                            textAlign: 'center', color: '#0056b3', fontWeight: 'bold', padding: '0 10px',
                                            background: isCorrect ? '#dcfce7' : (isWrong ? '#fee2e2' : 'transparent'),
                                            borderRadius: 4
                                        }}
                                    >
                                        {userAnswer || (isWrong ? '?' : '________')}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Word Bank */}
                    <div style={{ alignSelf: 'start', position: 'sticky', top: 100 }}>
                        <div style={{ background: 'white', padding: 20, borderRadius: 16, border: '1px solid #ddd' }}>
                            <h3 style={{ marginTop: 0 }}>Word Bank</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {shuffledWords.map((word, k) => {
                                    // Check if used
                                    const used = Object.values(answers).includes(word)
                                    return (
                                        <div
                                            key={k}
                                            draggable={!used}
                                            onDragStart={e => onDragStart(e, word)}
                                            style={{
                                                background: used ? '#eee' : '#e0f2fe',
                                                color: used ? '#999' : '#0369a1',
                                                padding: '8px 12px', borderRadius: 6, cursor: used ? 'default' : 'grab',
                                                textDecoration: used ? 'line-through' : 'none'
                                            }}
                                        >
                                            {word}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        {result && (
                            <div style={{ marginTop: 20, padding: 20, background: '#111', color: '#fff', borderRadius: 12, textAlign: 'center', fontSize: 18 }}>
                                {result}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}
