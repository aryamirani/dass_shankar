import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function Signup({ onNavigateToLogin }) {
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

        // Validate parent student details
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

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: '#1e293b', // Card background
                padding: '40px',
                borderRadius: '24px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                width: '100%',
                maxWidth: '450px',
                border: '1px solid #334155'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        color: '#f1f5f9', // Light text
                        marginBottom: '10px'
                    }}>
                        Create Account
                    </h1>
                    <p style={{ color: '#94a3b8' }}>Join our learning community</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#fca5a5',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '14px',
                        textAlign: 'center',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Role Selection */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#e2e8f0',
                            marginBottom: '12px'
                        }}>
                            I am a...
                        </label>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button
                                type="button"
                                onClick={() => setRole('teacher')}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    border: role === 'teacher' ? '2px solid #667eea' : '2px solid #334155',
                                    borderRadius: '12px',
                                    background: role === 'teacher' ? 'rgba(102, 126, 234, 0.1)' : '#0f172a',
                                    color: role === 'teacher' ? '#667eea' : '#94a3b8',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            >
                                👨‍🏫 Teacher
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('parent')}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    border: role === 'parent' ? '2px solid #667eea' : '2px solid #334155',
                                    borderRadius: '12px',
                                    background: role === 'parent' ? 'rgba(102, 126, 234, 0.1)' : '#0f172a',
                                    color: role === 'parent' ? '#667eea' : '#94a3b8',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            >
                                👨‍👩‍👧 Parent
                            </button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#e2e8f0',
                            marginBottom: '8px'
                        }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            required
                            style={{
                                width: '100%',
                                padding: '14px',
                                fontSize: '16px',
                                background: '#0f172a',
                                border: '2px solid #334155',
                                borderRadius: '12px',
                                outline: 'none',
                                color: '#f1f5f9',
                                transition: 'border-color 0.3s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#334155'}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#e2e8f0',
                            marginBottom: '8px'
                        }}>
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter your phone number"
                            required
                            style={{
                                width: '100%',
                                padding: '14px',
                                fontSize: '16px',
                                background: '#0f172a',
                                border: '2px solid #334155',
                                borderRadius: '12px',
                                outline: 'none',
                                color: '#f1f5f9',
                                transition: 'border-color 0.3s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#334155'}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#e2e8f0',
                            marginBottom: '8px'
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                            style={{
                                width: '100%',
                                padding: '14px',
                                fontSize: '16px',
                                background: '#0f172a',
                                border: '2px solid #334155',
                                borderRadius: '12px',
                                outline: 'none',
                                color: '#f1f5f9',
                                transition: 'border-color 0.3s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#334155'}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#e2e8f0',
                            marginBottom: '8px'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Create a password"
                            style={{
                                width: '100%',
                                padding: '14px',
                                fontSize: '16px',
                                background: '#0f172a',
                                border: '2px solid #334155',
                                borderRadius: '12px',
                                outline: 'none',
                                color: '#f1f5f9',
                                transition: 'border-color 0.3s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#334155'}
                        />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#e2e8f0',
                            marginBottom: '8px'
                        }}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm your password"
                            style={{
                                width: '100%',
                                padding: '14px',
                                fontSize: '16px',
                                background: '#0f172a',
                                border: '2px solid #334155',
                                borderRadius: '12px',
                                outline: 'none',
                                color: '#f1f5f9',
                                transition: 'border-color 0.3s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#334155'}
                        />
                    </div>

                    {/* Student Details for Parents */}
                    {role === 'parent' && (
                        <div style={{
                            background: '#0f172a',
                            padding: '20px',
                            borderRadius: '16px',
                            marginBottom: '30px',
                            border: '1px solid #334155'
                        }}>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '700',
                                color: '#f1f5f9',
                                marginBottom: '15px'
                            }}>
                                Student Details
                            </h3>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>
                                    Child's Name
                                </label>
                                <input
                                    type="text"
                                    value={studentDetails.name}
                                    onChange={(e) => setStudentDetails({ ...studentDetails, name: e.target.value })}
                                    placeholder="Enter child's full name"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        fontSize: '14px',
                                        background: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: '8px',
                                        color: '#f1f5f9',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>
                                    Roll Number
                                </label>
                                <input
                                    type="text"
                                    value={studentDetails.rollNo}
                                    onChange={(e) => setStudentDetails({ ...studentDetails, rollNo: e.target.value })}
                                    placeholder="e.g. 2024-1-001"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        fontSize: '14px',
                                        background: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: '8px',
                                        color: '#f1f5f9',
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
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        fontSize: '14px',
                                        background: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: '8px',
                                        color: '#f1f5f9',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <option value="Grade 1">Grade 1</option>
                                    <option value="Grade 2">Grade 2</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'transform 0.2s',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                        }}
                        onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div style={{
                    marginTop: '25px',
                    textAlign: 'center',
                    color: '#94a3b8',
                    fontSize: '14px'
                }}>
                    Already have an account?{' '}
                    <button
                        onClick={onNavigateToLogin}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#667eea',
                            fontWeight: '600',
                            cursor: 'pointer',
                            padding: 0,
                            fontSize: '14px'
                        }}
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </div >
    )
}

