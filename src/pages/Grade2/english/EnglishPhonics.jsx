import React, { useState } from 'react'

export default function EnglishPhonics({ onBack, onNextExercise }) {
    const [dropped, setDropped] = useState({ 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] }) // Map index to array of dropped words

    const wordTriples = [
        { target: "Airplane", parts: ["Air", "Plane"] },
        { target: "Anything", parts: ["Any", "Thing"] },
        { target: "Basketball", parts: ["Basket", "Ball"] },
        { target: "Cupboard", parts: ["Cup", "Board"] },
        { target: "Classmate", parts: ["Class", "Mate"] },
        { target: "Doormat", parts: ["Door", "Mat"] }
    ]

    // Flatten and shuffle available parts
    const [availableParts, setAvailableParts] = useState(() => {
        const parts = wordTriples.flatMap((t, i) => t.parts.map(p => ({ text: p, id: `${i}-${p}` })))
        return parts.sort(() => Math.random() - 0.5)
    })

    // Drag handlers
    const onDragStart = (e, part) => {
        e.dataTransfer.setData("part", JSON.stringify(part))
    }

    const onDrop = (e, index) => {
        e.preventDefault()
        const partData = e.dataTransfer.getData("part")
        if (!partData) return
        const part = JSON.parse(partData)

        // Check if correct for this row
        const targetTriple = wordTriples[index]
        if (!targetTriple.parts.includes(part.text)) {
            // Wrong drop - maybe shake or toast? For now just ignore or simple feedback
            alert("Try again!") // Simple for now
            return
        }

        if (dropped[index].find(p => p.text === part.text)) return // Already dropped

        setDropped(prev => ({
            ...prev,
            [index]: [...prev[index], part]
        }))

        // Remove from available
        setAvailableParts(prev => prev.filter(p => p.id !== part.id))
    }

    return (
        <div className="landing-root">
            <div className="landing-inner" style={{ maxWidth: 1000, margin: '0 auto', paddingTop: 'clamp(60px, 8vh, 100px)' }}>

                <h1 className="center-title" style={{ fontSize: 'clamp(24px, 6vw, 32px)', marginBottom: 20 }}>Drag the words to form compound words</h1>

                <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 40, width: '100%', alignItems: 'center' }}>
                    {/* Word Bank */}
                    <div style={{ position: 'sticky', top: 20, zIndex: 10, background: 'rgba(255,255,255,0.8)', padding: 20, borderRadius: 16, width: '100%', boxSizing: 'border-box' }}>
                        <h3 style={{ marginTop: 0 }}>Word Bank</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                            {availableParts.map(part => (
                                <div
                                    key={part.id}
                                    draggable
                                    onDragStart={e => onDragStart(e, part)}
                                    style={{
                                        background: 'white', border: '1px solid #ccc', padding: '8px 14px', borderRadius: 8, cursor: 'grab', fontSize: 'clamp(16px, 4vw, 18px)',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {part.text}
                                </div>
                            ))}
                            {availableParts.length === 0 && <div style={{ color: '#888', fontStyle: 'italic' }}>All words used!</div>}
                        </div>
                    </div>

                    {/* Target Zones */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 800 }}>
                        {wordTriples.map((triple, i) => {
                            const currentDropped = dropped[i] || []
                            const isComplete = currentDropped.length === 2

                            return (
                                <div key={triple.target} style={{ display: 'flex', alignItems: 'center', gap: 20, background: 'rgba(255,255,255,0.5)', padding: 12, borderRadius: 12, flexWrap: 'wrap' }}>
                                    <div style={{
                                        background: 'white', padding: '12px 24px', borderRadius: 8, fontSize: 'clamp(18px, 5vw, 22px)', fontWeight: 'bold', width: 'clamp(120px, 30vw, 140px)', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                        wordBreak: 'break-word'
                                    }}>
                                        {triple.target}
                                    </div>

                                    <div
                                        onDragOver={e => e.preventDefault()}
                                        onDrop={e => onDrop(e, i)}
                                        style={{
                                            flex: 1, minHeight: 60, height: 'auto', border: `3px dashed ${isComplete ? '#2ecc71' : '#aaa'}`, borderRadius: 8,
                                            background: isComplete ? '#dcfce7' : 'rgba(255,255,255,0.4)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                            transition: 'all 0.3s',
                                            padding: '8px 10px',
                                            minWidth: '200px',
                                            flexWrap: 'wrap'
                                        }}
                                    >
                                        {currentDropped.length === 0 && !isComplete && <span style={{ color: '#999', fontSize: 'clamp(14px, 3vw, 16px)' }}>Drop parts here</span>}
                                        {currentDropped.map(p => (
                                            <span key={p.id} style={{ background: '#fff', padding: '6px 12px', borderRadius: 6, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', wordBreak: 'break-word' }}>{p.text}</span>
                                        ))}
                                        {isComplete && <span style={{ color: '#2ecc71', fontWeight: 'bold', marginLeft: 10 }}>✓</span>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {Object.values(dropped).every(arr => arr.length === 2) && (
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, marginTop: 20, padding: 20, background: '#f0fdf4', borderRadius: 16 }}>
                            <h2 style={{ textAlign: 'center', color: '#2e7d32', fontSize: 32, margin: 0 }}>Amazing! You built all the words! 🎉</h2>
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
                </div>
            </div>
        </div>
    )
}
