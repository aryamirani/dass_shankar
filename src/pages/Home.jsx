import React from 'react'

export default function Home({ onLogin, onSignup, onGuest }) {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, hsl(200, 100%, 95%) 0%, hsl(200, 100%, 85%) 100%)',
            color: '#1e293b',
            fontFamily: "'Outfit', 'Inter', sans-serif",
            overflowX: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .fade-in { animation: fadeIn 0.8s ease-out forwards; }
                .hero-btn {
                    padding: 16px 32px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border: none;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .hero-btn:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 15px 30px -10px rgba(0,0,0,0.2); }
                .btn-primary { 
                    background: #2563eb; 
                    color: white; 
                    box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4); 
                }
                .btn-secondary { 
                    background: white; 
                    color: #1e293b; 
                    border: 2px solid #e2e8f0; 
                }
                .btn-secondary:hover { border-color: #cbd5e1; }
                .btn-guest { 
                    background: #10b981; 
                    color: white; 
                    box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4); 
                }
            `}</style>

            <main style={{ 
                padding: '40px', 
                maxWidth: 1000, 
                width: '100%',
                textAlign: 'center' 
            }} className="fade-in">
                
                <h1 style={{
                    fontSize: 'clamp(3rem, 8vw, 5rem)',
                    fontWeight: 900,
                    lineHeight: 1.1,
                    marginBottom: 40,
                    letterSpacing: '-2px'
                }}>
                    <span style={{ color: '#0f172a', display: 'block', fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '10px' }}>Welcome to S-Learn by</span>
                    <span style={{ 
                        background: 'linear-gradient(to right, #f97316, #ea580c)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>Shankar Foundation</span>
                </h1>

                {/* <p style={{
                    fontSize: '1.5rem',
                    color: '#475569',
                    maxWidth: 700,
                    margin: '0 auto 60px',
                    lineHeight: 1.6,
                    fontWeight: 500
                }}>
                    Empowering lives through education and therapy.
                </p> */}

                <div style={{ 
                    display: 'flex', 
                    gap: 20, 
                    justifyContent: 'center', 
                    flexWrap: 'wrap' 
                }}>
                    <button onClick={onLogin} className="hero-btn btn-secondary">Login</button>
                    <button onClick={onSignup} className="hero-btn btn-primary">Sign Up</button>
                    <button onClick={onGuest} className="hero-btn btn-guest">Explore as Guest</button>
                </div>
            </main>
        </div>
    )
}
