import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

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
                background: 'linear-gradient(135deg, hsl(230, 80%, 15%) 0%, hsl(230, 80%, 10%) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                fontFamily: "'Outfit', 'Inter', sans-serif"
            }}>
                <div style={{
                    background: 'hsla(0, 0%, 100%, 0.03)',
                    backdropFilter: 'blur(15px)',
                    padding: '48px',
                    borderRadius: '32px',
                    textAlign: 'center',
                    maxWidth: '500px',
                    border: '1px solid hsla(0, 0%, 100%, 0.1)',
                    color: 'white'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🎉</div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>Registration Successful!</h2>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '32px', lineHeight: 1.6 }}>
                        Thank you for joining Shankar Foundation.
                        {role === 'teacher'
                            ? " Your account is now pending approval by an administrator."
                            : " You can now sign in to track your child's progress."}
                    </p>
                    <button
                        onClick={onNavigateToLogin}
                        style={{
                            padding: '16px 32px',
                            background: 'hsl(150, 80%, 45%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '14px',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px hsla(150, 80%, 45%, 0.3)'
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
            background: 'linear-gradient(135deg, hsl(230, 80%, 15%) 0%, hsl(230, 80%, 10%) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            fontFamily: "'Outfit', 'Inter', sans-serif"
        }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .fade-in { animation: fadeIn 0.6s ease-out forwards; }
                .input-field:focus { border-color: hsl(230, 100%, 65%) !important; box-shadow: 0 0 0 4px hsla(230, 100%, 65%, 0.1); }
                .role-btn {
                    flex: 1;
                    padding: 16px;
                    border: 2px solid hsla(0, 0%, 100%, 0.05);
                    border-radius: 16px;
                    background: hsla(0, 0%, 0%, 0.2);
                    color: #94a3b8;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    flex-direction: column;
                    alignItems: center;
                    gap: 8px;
                }
                .role-btn.active {
                    border-color: hsl(230, 100%, 65%);
                    background: hsla(230, 100%, 65%, 0.1);
                    color: white;
                }
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
                maxWidth: '500px',
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
                        Create Account
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Join our supportive learning community</p>
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
                    {/* Role Selection */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#94a3b8',
                            marginBottom: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
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
                            color: '#e2e8f0',
                            marginBottom: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. John Doe"
                            required
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#e2e8f0',
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
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#e2e8f0',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Confirm
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                    </div>

                    {/* Student Details for Parents */}
                    {role === 'parent' && (
                        <div style={{
                            background: 'hsla(0, 0%, 0%, 0.2)',
                            padding: '24px',
                            borderRadius: '24px',
                            marginBottom: '32px',
                            border: '1px solid hsla(0, 0%, 100%, 0.05)'
                        }}>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '700',
                                color: 'white',
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                🎓 Student Information
                            </h3>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>
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
                                        background: 'hsla(0, 0%, 0%, 0.3)',
                                        border: '1px solid hsla(0, 0%, 100%, 0.1)',
                                        borderRadius: '10px',
                                        color: 'white',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>
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
                                            background: 'hsla(0, 0%, 0%, 0.3)',
                                            border: '1px solid hsla(0, 0%, 100%, 0.1)',
                                            borderRadius: '10px',
                                            color: 'white',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>
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
                                            background: 'hsla(0, 0%, 0%, 0.3)',
                                            border: '1px solid hsla(0, 0%, 100%, 0.1)',
                                            borderRadius: '10px',
                                            color: 'white',
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
                            padding: '18px',
                            background: 'hsl(230, 100%, 65%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '16px',
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
                        {loading ? 'Creating your account...' : 'Create Account'}
                    </button>
                </form>

                <div style={{
                    marginTop: '32px',
                    textAlign: 'center',
                    color: '#94a3b8',
                    fontSize: '15px'
                }}>
                    Already have an account?{' '}
                    <button
                        onClick={onNavigateToLogin}
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
                        Sign In
                    </button>
                </div>
            </div>
        </div >
    )
}
