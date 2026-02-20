import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import PasswordField from '../../components/PasswordField'

export default function Signup({ onNavigateToLogin, onBackToHome }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState('teacher')
    const [fullName, setFullName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [studentDetails, setStudentDetails] = useState({ name: '', rollNo: '', grade: 'Grade 1' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const { signUp } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!fullName.trim()) {
            return setError('Please enter your full name')
        }

        if (password !== confirmPassword) {
            return setError('Passwords do not match')
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters')
        }

        if (role === 'parent') {
            if (!studentDetails.name || !studentDetails.rollNo) {
                return setError('Please provide student name and roll number')
            }
        }

        setLoading(true)

        const { error } = await signUp(email, password, role, fullName, phoneNumber, studentDetails)

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#f5f5f4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                fontFamily: "'Outfit', 'Inter', sans-serif",
                color: '#1e293b'
            }}>
                <div style={{
                    background: 'white',
                    padding: '48px',
                    borderRadius: '24px',
                    textAlign: 'center',
                    maxWidth: '500px',
                    width: '100%',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🎉</div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px', color: '#0f172a' }}>Registration Successful!</h2>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '32px', lineHeight: 1.6 }}>
                        Thank you for joining Shankar Foundation.
                        {role === 'teacher'
                            ? " Your account is now pending approval by an administrator."
                            : " You can now sign in to track your child's progress."}
                    </p>
                    <button
                        onClick={onNavigateToLogin}
                        style={{
                            padding: '16px 32px',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '14px',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)'
                        }}
                    >
                        Go to Sign In
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f5f4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            fontFamily: "'Outfit', 'Inter', sans-serif"
        }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .fade-in { animation: fadeIn 0.5s ease-out forwards; }
                .input-field:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
                .role-btn {
                    flex: 1;
                    padding: 16px;
                    border: 2px solid #e2e8f0;
                    border-radius: 16px;
                    background: #f8fafc;
                    color: #64748b;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    alignItems: center;
                    gap: 8px;
                }
                .role-btn:hover { background: #f1f5f9; border-color: #cbd5e1; }
                .role-btn.active {
                    border-color: #2563eb;
                    background: #eff6ff;
                    color: #2563eb;
                }
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
                maxWidth: '500px',
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
                        Create Account
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Join our supportive learning community</p>
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
                    {/* Role Selection */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#64748b',
                            marginBottom: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            I am registering as a...
                        </label>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button
                                type="button"
                                onClick={() => setRole('teacher')}
                                className={`role-btn ${role === 'teacher' ? 'active' : ''}`}
                            >
                                <span style={{ fontSize: '1.5rem' }}>👨‍🏫</span>
                                Teacher
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('parent')}
                                className={`role-btn ${role === 'parent' ? 'active' : ''}`}
                            >
                                <span style={{ fontSize: '1.5rem' }}>👨‍👩‍👧</span>
                                Parent
                            </button>
                        </div>
                    </div>

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
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Arya Mirani"
                            required
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
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="e.g. +91 98765 43210"
                            required
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                        <PasswordField
                            id="signup-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            label="Password"
                            placeholder="••••••••"
                            marginBottom="0"
                        />
                        <PasswordField
                            id="signup-confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            label="Confirm"
                            placeholder="••••••••"
                            marginBottom="0"
                        />
                    </div>

                    {/* Student Details for Parents */}
                    {role === 'parent' && (
                        <div style={{
                            background: '#f8fafc',
                            padding: '24px',
                            borderRadius: '16px',
                            marginBottom: '32px',
                            border: '1px solid #e2e8f0'
                        }}>
                            <h3 style={{
                                fontSize: '15px',
                                fontWeight: '700',
                                color: '#334155',
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                🎓 Student Information
                            </h3>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                                    Child's Full Name
                                </label>
                                <input
                                    type="text"
                                    value={studentDetails.name}
                                    onChange={(e) => setStudentDetails({ ...studentDetails, name: e.target.value })}
                                    placeholder="Enter child's full name"
                                    className="input-field"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        fontSize: '15px',
                                        background: 'white',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '10px',
                                        color: '#1e293b',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                                        Roll No.
                                    </label>
                                    <input
                                        type="text"
                                        value={studentDetails.rollNo}
                                        onChange={(e) => setStudentDetails({ ...studentDetails, rollNo: e.target.value })}
                                        placeholder="2024-X"
                                        className="input-field"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            fontSize: '15px',
                                            background: 'white',
                                            border: '1px solid #cbd5e1',
                                            borderRadius: '10px',
                                            color: '#1e293b',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                                        Grade
                                    </label>
                                    <select
                                        value={studentDetails.grade}
                                        onChange={(e) => setStudentDetails({ ...studentDetails, grade: e.target.value })}
                                        className="input-field"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            fontSize: '15px',
                                            background: 'white',
                                            border: '1px solid #cbd5e1',
                                            borderRadius: '10px',
                                            color: '#1e293b',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        <option value="Grade 1">Grade 1</option>
                                        <option value="Grade 2">Grade 2</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

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
                        {loading ? 'Creating your account...' : 'Create Account'}
                    </button>
                </form>

                <div style={{
                    marginTop: '32px',
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '15px'
                }}>
                    Already have an account?{' '}
                    <button
                        onClick={onNavigateToLogin}
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
                        Sign In
                    </button>
                </div>
            </div>
        </div >
    )
}
