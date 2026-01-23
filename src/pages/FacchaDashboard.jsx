import React from 'react'

export default function FacchaDashboard({ onOpenEnglish, onOpenMath, onOpenScience, onOpenComputer, onOpenVocabulary, onOpenHealth, onBack }) {
    return (
        <div style={{ minHeight: '100vh', padding: 40 }}>
            <div style={{ position: 'absolute', left: 20, top: 20 }}>
                <button className="back-btn" onClick={onBack}>←</button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <h1 style={{ fontSize: 'clamp(32px, 8vw, 48px)', marginBottom: 8, color: '#333' }}>Shankar Foundation</h1>
                <p style={{ fontSize: 'clamp(18px, 4vw, 24px)', color: '#666' }}>Select a subject to start learning</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginTop: 24, maxWidth: 1000, margin: '0 auto' }}>
                <button className="card" onClick={onOpenEnglish} style={{ padding: '30px 20px', fontSize: 'clamp(20px, 5vw, 24px)', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>English</button>
                <button className="card" onClick={onOpenMath} style={{ padding: '30px 20px', fontSize: 'clamp(20px, 5vw, 24px)', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Math</button>
                <button className="card" onClick={onOpenScience} style={{ padding: '30px 20px', fontSize: 'clamp(20px, 5vw, 24px)', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Science</button>
                <button className="card" onClick={onOpenComputer} style={{ padding: '30px 20px', fontSize: 'clamp(20px, 5vw, 24px)', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Computer Skills</button>
                <button className="card" onClick={onOpenVocabulary} style={{ padding: '30px 20px', fontSize: 'clamp(20px, 5vw, 24px)', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Vocabulary</button>
                <button className="card" onClick={onOpenHealth} style={{ padding: '30px 20px', fontSize: 'clamp(20px, 5vw, 24px)', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Health</button>
            </div>
        </div>
    )
}
