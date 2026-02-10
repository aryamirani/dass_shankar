import React from 'react'

export default function Home({ onLogin, onSignup, onGuest }) {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, hsl(230, 80%, 15%) 0%, hsl(230, 80%, 10%) 100%)',
            color: 'white',
            fontFamily: "'Outfit', 'Inter', sans-serif",
            overflowX: 'hidden'
        }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
                .fade-in { animation: fadeIn 0.8s ease-out forwards; }
                .hero-btn {
                    padding: 14px 28px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border: none;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .hero-btn:hover { transform: translateY(-3px) scale(1.02); }
                .btn-primary { background: hsl(230, 100%, 65%); color: white; box-shadow: 0 10px 20px hsla(230, 100%, 65%, 0.3); }
                .btn-secondary { background: transparent; color: white; border: 2px solid hsla(0, 0%, 100%, 0.2); }
                .btn-secondary:hover { background: hsla(0, 0%, 100%, 0.1); border-color: white; }
                .btn-guest { background: hsl(150, 80%, 45%); color: white; box-shadow: 0 10px 20px hsla(150, 80%, 45%, 0.3); }
                .info-card {
                    background: hsla(0, 0%, 100%, 0.03);
                    backdrop-filter: blur(10px);
                    border: 1px solid hsla(0, 0%, 100%, 0.05);
                    border-radius: 24px;
                    padding: 32px;
                    transition: all 0.3s ease;
                }
                .info-card:hover { background: hsla(0, 0%, 100%, 0.05); transform: translateY(-5px); }
            `}</style>

            {/* Navbar */}
            <nav style={{
                padding: '24px 5%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'fixed',
                width: '100%',
                top: 0,
                zIndex: 1000,
                background: 'hsla(230, 80%, 10%, 0.8)',
                backdropFilter: 'blur(10px)',
                boxSizing: 'border-box'
            }} className="fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        background: 'hsl(230, 100%, 65%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold'
                    }}>S</div>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Shankar Foundation</span>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                    <button onClick={onLogin} className="hero-btn btn-secondary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>Login</button>
                    <button onClick={onSignup} className="hero-btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>Join Us</button>
                </div>
            </nav>

            {/* Hero Section */}
            <main style={{ padding: '160px 5% 80px', maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 80 }} className="fade-in">
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                        fontWeight: 900,
                        lineHeight: 1.1,
                        marginBottom: 24,
                        background: 'linear-gradient(to bottom, #fff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Welcome To <br />
                        Shankar Foundation
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#94a3b8',
                        maxWidth: 700,
                        margin: '0 auto 40px',
                        lineHeight: 1.6
                    }}>
                        Empowering children and adults with special needs through individualized education,
                        therapeutic interventions, and vocational rehabilitation.
                    </p>
                    <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={onGuest} className="hero-btn btn-guest">Explore as Guest</button>
                        <button onClick={onSignup} className="hero-btn btn-primary">Create Account</button>
                    </div>
                </div>

                {/* Info Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 32,
                    marginBottom: 100
                }} className="fade-in">
                    <div className="info-card">
                        <div style={{ fontSize: '2rem', marginBottom: 16 }}>🏫</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>Our Mission</h3>
                        <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>
                            Based in Hyderabad, we are a dedicated school and therapeutic center.
                            Our personalized approach helps every child realize their educational and social potential.
                        </p>
                    </div>
                    <div className="info-card">
                        <div style={{ fontSize: '2rem', marginBottom: 16 }}>💊</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>Therapeutic Support</h3>
                        <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>
                            Access a range of specialized therapies including Physiotherapy, Speech, and Occupational therapy,
                            all integrated into our students' daily programs.
                        </p>
                    </div>
                    <div className="info-card">
                        <div style={{ fontSize: '2rem', marginBottom: 16 }}>🛠️</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>Life Skills</h3>
                        <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>
                            Beyond the classroom, we prepare our students for adult life through vocational training,
                            enabling them to lead independent and fulfilling lives within the community.
                        </p>
                    </div>
                </div>

                {/* Locations section */}
                <div style={{
                    padding: 40,
                    background: 'hsla(230, 80%, 20%, 0.3)',
                    borderRadius: 32,
                    textAlign: 'center',
                    border: '1px solid hsla(230, 100%, 65%, 0.2)'
                }} className="fade-in">
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 20 }}>Find Us in Hyderabad</h2>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 60, flexWrap: 'wrap' }}>
                        <div>
                            <h4 style={{ color: 'hsl(230, 100%, 65%)', marginBottom: 8 }}>Begumpet Day Center</h4>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Mayuri Marg, Begumpet</p>
                        </div>
                        <div>
                            <h4 style={{ color: 'hsl(230, 100%, 65%)', marginBottom: 8 }}>Kohada Residential Center</h4>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Village Kohada, Ranga Reddy District</p>
                        </div>
                    </div>
                </div>
            </main>

            <footer style={{
                padding: '40px 5%',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '0.9rem',
                marginTop: 'auto'
            }}>
                © 2026 Shankar Foundation. Dedicated to empowering lives in Hyderabad.
            </footer>
        </div>
    )
}
