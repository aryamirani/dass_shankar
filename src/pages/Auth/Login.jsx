import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function Login({ onNavigateToSignup, onBackToHome }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { error } = await signIn(email, password)

        if (error) {
            setError(error.message)
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, hsl(230, 80%, 15%) 0%, hsl(230, 80%, 10%) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: "'Outfit', 'Inter', sans-serif"
        }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .fade-in { animation: fadeIn 0.6s ease-out forwards; }
                .input-field:focus { border-color: hsl(230, 100%, 65%) !important; box-shadow: 0 0 0 4px hsla(230, 100%, 65%, 0.1); }
            `}</style>

            {/* Back Button */}
            <button
                onClick={onBackToHome}
                style={{
                    position: 'absolute',
                    top: '30px',
                    left: '30px',
                    background: 'hsla(0, 0%, 100%, 0.05)',
                    border: '1px solid hsla(0, 0%, 100%, 0.1)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.3s',
                    zIndex: 10
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'hsla(0, 0%, 100%, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'hsla(0, 0%, 100%, 0.05)'}
            >
                ← Back to Home
            </button>

            <div className="fade-in" style={{
                background: 'hsla(0, 0%, 100%, 0.03)',
                backdropFilter: 'blur(15px)',
                padding: '48px',
                borderRadius: '32px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                width: '100%',
                maxWidth: '420px',
                border: '1px solid hsla(0, 0%, 100%, 0.05)',
                boxSizing: 'border-box'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        color: 'white',
                        marginBottom: '12px',
                        letterSpacing: '-0.5px'
                    }}>
                        Welcome Back
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Sign in to continue your journey</p>
                </div>

                {error && (
                    <div style={{
                        background: 'hsla(0, 100%, 65%, 0.1)',
                        color: 'hsl(0, 100%, 75%)',
                        padding: '14px',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        fontSize: '14px',
                        textAlign: 'center',
                        border: '1px solid hsla(0, 100%, 65%, 0.2)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#e2e8f0',
                            marginBottom: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="name@example.com"
                            className="input-field"
                            style={{
                                width: '100%',
                                padding: '16px',
                                fontSize: '16px',
                                background: 'hsla(0, 0%, 0%, 0.2)',
                                border: '2px solid hsla(0, 0%, 100%, 0.05)',
                                borderRadius: '14px',
                                outline: 'none',
                                color: 'white',
                                transition: 'all 0.3s',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#e2e8f0',
                            marginBottom: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="input-field"
                            style={{
                                width: '100%',
                                padding: '16px',
                                fontSize: '16px',
                                background: 'hsla(0, 0%, 0%, 0.2)',
                                border: '2px solid hsla(0, 0%, 100%, 0.05)',
                                borderRadius: '14px',
                                outline: 'none',
                                color: 'white',
                                transition: 'all 0.3s',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: 'hsl(230, 100%, 65%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '14px',
                            fontSize: '18px',
                            fontWeight: '700',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'all 0.3s',
                            boxShadow: '0 10px 20px hsla(230, 100%, 65%, 0.3)'
                        }}
                        onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div style={{
                    marginTop: '32px',
                    textAlign: 'center',
                    color: '#94a3b8',
                    fontSize: '15px'
                }}>
                    New to Shankar Foundation?{' '}
                    <button
                        onClick={onNavigateToSignup}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'hsl(230, 100%, 65%)',
                            fontWeight: '700',
                            cursor: 'pointer',
                            padding: 0,
                            fontSize: '15px',
                            textDecoration: 'underline'
                        }}
                    >
                        Create an account
                    </button>
                </div>
            </div>
        </div>
    )
}
