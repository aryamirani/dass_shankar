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
            background: '#f5f5f4', // Plain neutral background
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: "'Outfit', 'Inter', sans-serif",
            color: '#1e293b'
        }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .fade-in { animation: fadeIn 0.5s ease-out forwards; }
                .input-field:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
            `}</style>

            {/* Back Button */}
            <button
                onClick={onBackToHome}
                style={{
                    position: 'absolute',
                    top: '30px',
                    left: '30px',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    color: '#64748b',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    zIndex: 10,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#334155'; e.currentTarget.style.borderColor = '#cbd5e1' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0' }}
            >
                ← Back to Home
            </button>

            <div className="fade-in" style={{
                background: 'white',
                padding: '48px',
                borderRadius: '24px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                width: '100%',
                maxWidth: '420px',
                border: '1px solid #f1f5f9',
                boxSizing: 'border-box'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        color: '#0f172a',
                        marginBottom: '12px',
                        letterSpacing: '-0.5px'
                    }}>
                        Welcome Back
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Sign in to continue your journey</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fef2f2',
                        color: '#ef4444',
                        padding: '14px',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        fontSize: '14px',
                        textAlign: 'center',
                        border: '1px solid #fee2e2'
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
                            color: '#475569',
                            marginBottom: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
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
                                padding: '14px 16px',
                                fontSize: '16px',
                                background: '#f8fafc',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                outline: 'none',
                                color: '#1e293b',
                                transition: 'all 0.2s',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#475569',
                            marginBottom: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
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
                                padding: '14px 16px',
                                fontSize: '16px',
                                background: '#f8fafc',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                outline: 'none',
                                color: '#1e293b',
                                transition: 'all 0.2s',
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
                            background: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '14px',
                            fontSize: '16px',
                            fontWeight: '700',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                        }}
                        onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#1d4ed8')}
                        onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#2563eb')}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div style={{
                    marginTop: '32px',
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '15px'
                }}>
                    New to Shankar Foundation?{' '}
                    <button
                        onClick={onNavigateToSignup}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#2563eb',
                            fontWeight: '700',
                            cursor: 'pointer',
                            padding: 0,
                            fontSize: '15px',
                            textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                        Create an account
                    </button>
                </div>
            </div>
        </div>
    )
}
