import React from 'react'

export default function FacchaDashboard({ onOpenEnglish, onOpenMath, onOpenScience, onOpenComputer, onBack }) {
    return (
        <div style={{ minHeight: '100vh', padding: 40 }}>
            <div style={{ position: 'absolute', left: 20, top: 20 }}>
                <button className="back-btn" onClick={onBack}>←</button>
            </div>

            <h1 style={{ fontSize: 40 }}>Shankar Foundation</h1>
            <p>Select a subject to start learning</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginTop: 24 }}>
                <button className="card" onClick={onOpenEnglish}>English</button>
                <button className="card" onClick={onOpenMath}>Math</button>
                <button className="card" onClick={onOpenScience}>Science</button>
                <button className="card" onClick={onOpenComputer}>Computer Skills</button>
            </div>
        </div>
    )
}
