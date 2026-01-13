import React, { useState } from 'react'

export default function EnglishPhonics({ onBack }) {
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
            <div className="landing-inner" style={{ maxWidth: 1200 }}>
                <div style={{ position: 'absolute', left: 20, top: 20, zIndex: 50 }}>
                    <button className="back-btn" onClick={onBack}>←</button>
                </div>

                <h1 className="center-title" style={{ fontSize: 32, marginBottom: 20 }}>Drag the words to form compound words</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 40, width: '100%' }}>

                    {/* Target Zones */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {wordTriples.map((triple, i) => {
                            const currentDropped = dropped[i] || []
                            const isComplete = currentDropped.length === 2

                            return (
                                <div key={triple.target} style={{ display: 'flex', alignItems: 'center', gap: 20, background: 'rgba(255,255,255,0.5)', padding: 12, borderRadius: 12 }}>
                                    <div style={{
                                        background: 'white', padding: '12px 24px', borderRadius: 8, fontSize: 22, fontWeight: 'bold', width: 140, textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                    }}>
                                        {triple.target}
                                    </div>

                                    <div
                                        onDragOver={e => e.preventDefault()}
                                        onDrop={e => onDrop(e, i)}
                                        style={{
                                            flex: 1, height: 60, border: `3px dashed ${isComplete ? '#2ecc71' : '#aaa'}`, borderRadius: 8,
                                            background: isComplete ? '#dcfce7' : 'rgba(255,255,255,0.4)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        {currentDropped.length === 0 && !isComplete && <span style={{ color: '#999' }}>Drop parts here</span>}
                                        {currentDropped.map(p => (
                                            <span key={p.id} style={{ background: '#fff', padding: '6px 12px', borderRadius: 6, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{p.text}</span>
                                        ))}
                                        {isComplete && <span style={{ color: '#2ecc71', fontWeight: 'bold', marginLeft: 10 }}>✓ Correct</span>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Word Bank */}
                    <div style={{ background: 'rgba(255,255,255,0.8)', padding: 20, borderRadius: 16, height: 'fit-content' }}>
                        <h3 style={{ marginTop: 0 }}>Word Bank</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                            {availableParts.map(part => (
                                <div
                                    key={part.id}
                                    draggable
                                    onDragStart={e => onDragStart(e, part)}
                                    style={{
                                        background: 'white', border: '1px solid #ccc', padding: '8px 14px', borderRadius: 8, cursor: 'grab', fontSize: 18,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {part.text}
                                </div>
                            ))}
                            {availableParts.length === 0 && <div style={{ color: '#888', fontStyle: 'italic' }}>All words used!</div>}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
