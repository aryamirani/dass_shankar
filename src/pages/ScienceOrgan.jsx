import React, { useState } from 'react'

export default function ScienceOrgan({ onBack, onNext }) {
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
                position: 'fixed',
                left: 'clamp(20px, 5vw, 40px)',
                top: 'clamp(80px, 15vh, 100px)',
                width: 'clamp(240px, 80vw, 280px)',
                background: 'rgba(15, 15, 15, 0.85)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 10,
                padding: 20,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
                zIndex: 10
            }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: 'clamp(18px, 4vw, 20px)', color: '#fff' }}>Human Anatomy</h2>
                <p style={{ margin: 0, fontSize: 'clamp(16px, 4vw, 22px)', color: '#d0d0d0', lineHeight: 1.5 }}>{info}</p>

                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onNext}
                        style={{
                            padding: '10px 20px',
                            background: '#ff512f',
                            color: 'white',
                            border: 'none',
                            borderRadius: 8,
                            fontSize: 16,
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(255, 81, 47, 0.4)'
                        }}
                    >
                        PRACTICE →
                    </button>
                </div>
            </div>

            {/* Body Container */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '600px', height: 'auto', marginTop: 50, display: 'flex', justifyContent: 'center' }}>
                <svg viewBox="0 0 900 1800" style={{ width: '100%', height: 'auto', maxHeight: '90vh' }}>
                    {/* Outline handled via Image inside SVG or foreignObject if we want to keep using img tag, but simpler: */}
                    {/* We can use an image tag that scales, and overlay SVG on top. */}
                </svg>
                {/* Re-implementing structure to allow proper scaling */}
                <div style={{ position: 'relative', width: '100%', paddingBottom: '200%' /* aspect ratio 1:2 */ }}>
                    <img src="/images/outline.svg" alt="Human Body" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />

                    {/* Organs - using percentage positioning based on original 900x1800 coords
                        Heart: left 430, top 190. 430/900 = 47.7%, 190/1800 = 10.5%
                     */}
                    <div style={{ position: 'absolute', top: '10.5%', left: '47.7%', width: '4.4%', height: '2.2%', pointerEvents: 'none', zIndex: 2 }}>
                        <img src="/images/heart.webp" alt="Heart" style={{ width: '190%', height: '140%' }} />
                    </div>
                    {/* Lungs: left 350, top 140. 350/900 = 38.8%, 140/1800 = 7.7% */}
                    <div style={{ position: 'absolute', top: '7.7%', left: '38.8%', width: '13.3%', height: '5%', pointerEvents: 'none', zIndex: 1 }}>
                        <img src="/images/lungs.png" alt="Lungs" style={{ width: '190%', height: '140%' }} />
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
        </div>
    )
}
