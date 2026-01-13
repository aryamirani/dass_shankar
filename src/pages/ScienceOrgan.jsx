import React, { useState } from 'react'

export default function ScienceOrgan({ onBack }) {
    const [info, setInfo] = useState("Click an organ to see details.")

    return (
        <div style={{
            minHeight: '100vh', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
        }}>
            <div style={{ position: 'absolute', left: 20, top: 20, zIndex: 50 }}>
                <button className="back-btn" onClick={onBack}>←</button>
            </div>

            {/* Info Panel */}
            <div style={{
                position: 'absolute', left: 40, top: 100, width: 280,
                background: 'rgba(15, 15, 15, 0.85)', backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 10, padding: 20,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)'
            }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: 20, color: '#fff' }}>Human Anatomy</h2>
                <p style={{ margin: 0, fontSize: 16, color: '#d0d0d0', lineHeight: 1.5 }}>{info}</p>
            </div>

            {/* Body Container */}
            <div style={{ position: 'relative', width: 900, height: 1800, transform: 'scale(1.5)', transformOrigin: 'top center', marginTop: 50 }}>
                {/* Outline */}
                <img src="/assets/science/outline.svg" alt="Human Body" width="900" style={{ pointerEvents: 'none' }} />

                {/* Organs */}
                <div style={{ position: 'absolute', top: 190, left: 430, width: 40, height: 40, pointerEvents: 'none', zIndex: 2 }}>
                    <img src="/assets/science/heart.webp" alt="Heart" style={{ width: '190%', height: '140%' }} />
                </div>
                <div style={{ position: 'absolute', top: 140, left: 350, width: 120, height: 90, pointerEvents: 'none', zIndex: 1 }}>
                    <img src="/assets/science/lungs.png" alt="Lungs" style={{ width: '190%', height: '140%' }} />
                </div>

                {/* Hit Map (Interactive Layer) */}
                <svg viewBox="0 0 900 1800" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                    <ellipse
                        cx="460" cy="200" rx="70" ry="50" fill="transparent"
                        style={{ cursor: 'pointer', pointerEvents: 'all' }}
                        onClick={() => setInfo("Lungs: Gas exchange. The lungs bring oxygen into the body and remove carbon dioxide.")}
                        onMouseEnter={e => e.currentTarget.setAttribute('stroke', 'rgba(255,255,255,0.3)')}
                        onMouseLeave={e => e.currentTarget.setAttribute('stroke', 'none')}
                    />
                    <ellipse
                        cx="470" cy="225" rx="20" ry="20" fill="transparent"
                        style={{ cursor: 'pointer', pointerEvents: 'all' }}
                        onClick={() => setInfo("Heart: Pumps blood. The heart sends blood through the body to provide oxygen and nutrients.")}
                        onMouseEnter={e => e.currentTarget.setAttribute('stroke', 'rgba(255,255,255,0.3)')}
                        onMouseLeave={e => e.currentTarget.setAttribute('stroke', 'none')}
                    />
                </svg>
            </div>
        </div>
    )
}
