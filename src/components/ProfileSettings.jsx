import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function ProfileSettings({ role }) {
    const { user, updateProfile } = useAuth()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState(null)
    const [profile, setProfile] = useState({
        full_name: '',
        phone: '',
        email: ''
    })
    const [students, setStudents] = useState([])

    useEffect(() => {
        if (user) {
            fetchProfile()
        }
    }, [user])

    const fetchProfile = async () => {
        try {
            setLoading(true)
            let profileData = { email: user.email, full_name: '', phone: '' }

            if (role === 'admin') {
                // Admin profile stored in user metadata
                profileData.full_name = user.user_metadata?.full_name || 'Admin'
                profileData.phone = user.user_metadata?.phone || ''
            } else if (role === 'teacher') {
                const { data, error } = await supabase
                    .from('teachers')
                    .select('full_name, phone')
                    .eq('user_id', user.id)
                    .single()

                if (error) throw error
                if (data) {
                    profileData.full_name = data.full_name
                    profileData.phone = data.phone || ''
                }
            } else if (role === 'parent') {
                const { data, error } = await supabase
                    .from('parents')
                    .select('full_name, phone')
                    .eq('user_id', user.id)
                    .single()

                if (error) throw error
                if (data) {
                    profileData.full_name = data.full_name
                    profileData.phone = data.phone || ''
                }

                // Fetch linked students
                const { data: parentData } = await supabase
                    .from('parents')
                    .select('id')
                    .eq('user_id', user.id)
                    .single()

                if (parentData) {
                    const { data: studentData, error: studentError } = await supabase
                        .from('parent_students')
                        .select(`
                            student_id,
                            students (
                                id,
                                full_name,
                                roll_no,
                                date_of_birth,
                                grades (display_name)
                            )
                        `)
                        .eq('parent_id', parentData.id)

                    if (!studentError && studentData) {
                        setStudents(studentData.map(ps => ({
                            ...ps.students,
                            grade_name: ps.students.grades?.display_name || 'N/A'
                        })) || [])
                    }
                }
            }

            setProfile(profileData)
        } catch (error) {
            console.error('Error fetching profile:', error)
            setMessage({ type: 'error', text: 'Failed to load profile' })
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setMessage(null)

        try {
            if (role === 'admin') {
                // Update auth metadata for admin
                const { error } = await supabase.auth.updateUser({
                    data: { full_name: profile.full_name, phone: profile.phone }
                })
                if (error) throw error
            } else if (role === 'teacher') {
                const { error } = await supabase
                    .from('teachers')
                    .update({
                        full_name: profile.full_name,
                        phone: profile.phone,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', user.id)
                if (error) throw error
            } else if (role === 'parent') {
                const { error } = await supabase
                    .from('parents')
                    .update({
                        full_name: profile.full_name,
                        phone: profile.phone,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', user.id)
                if (error) throw error
            }

            // Update students if parent
            if (role === 'parent' && students.length > 0) {
                for (const student of students) {
                    const { error: studentError } = await supabase
                        .from('students')
                        .update({
                            full_name: student.full_name,
                            date_of_birth: student.date_of_birth,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', student.id)
                    if (studentError) throw studentError
                }
            }

            setMessage({ type: 'success', text: 'Profile updated successfully' })
        } catch (error) {
            console.error('Error updating profile:', error)
            setMessage({ type: 'error', text: 'Failed to update profile: ' + error.message })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div style={{ color: '#94a3b8' }}>Loading profile...</div>
    }

    return (
        <div style={{
            background: '#ffffff',
            padding: '48px',
            borderRadius: '24px',
            maxWidth: '640px',
            margin: '0 auto',
            border: '1px solid rgba(229, 231, 235, 0.5)',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02), 0 4px 6px -2px rgba(0,0,0,0.01)'
        }}>
            <h2 style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                color: '#111827', 
                marginBottom: '8px',
                letterSpacing: '-0.025em'
            }}>
                Profile Settings
            </h2>
            <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '32px' }}>
                Update your personal information and contact details.
            </p>

            {message && (
                <div style={{
                    padding: '16px',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                    color: message.type === 'success' ? '#166534' : '#991b1b',
                    fontWeight: '500',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{ fontSize: '18px' }}>{message.type === 'success' ? '✓' : '⚠'}</span>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', color: '#374151', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={profile.email}
                        disabled
                        style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            color: '#9ca3af',
                            cursor: 'not-allowed',
                            fontSize: '15px',
                            boxSizing: 'border-box'
                        }}
                    />
                    <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        Email cannot be changed directly for security reasons.
                    </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', color: '#374151', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        required
                        style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: '#ffffff',
                            border: '1px solid #d1d5db',
                            borderRadius: '12px',
                            color: '#111827',
                            outline: 'none',
                            fontSize: '15px',
                            boxSizing: 'border-box',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#10b981'
                            e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db'
                            e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', color: '#374151', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="+1 234 567 8900"
                        style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: '#ffffff',
                            border: '1px solid #d1d5db',
                            borderRadius: '12px',
                            color: '#111827',
                            outline: 'none',
                            fontSize: '15px',
                            boxSizing: 'border-box',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#10b981'
                            e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db'
                            e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                        }}
                    />
                </div>


                {role === 'parent' && students.length > 0 && (
                    <div style={{ marginTop: '32px', borderTop: '1px solid #f3f4f6', paddingTop: '40px', marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '24px', letterSpacing: '-0.01em' }}>
                            Child Profiles
                        </h3>
                        {students.map((student, index) => (
                            <div key={student.id} style={{
                                background: '#f9fafb',
                                padding: '32px',
                                borderRadius: '20px',
                                marginBottom: '24px',
                                border: '1px solid #f3f4f6',
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px', marginBottom: '24px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#374151', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={student.full_name}
                                            onChange={(e) => {
                                                const newStudents = [...students];
                                                newStudents[index].full_name = e.target.value;
                                                setStudents(newStudents);
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                background: '#ffffff',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '10px',
                                                color: '#111827',
                                                outline: 'none',
                                                fontSize: '14px',
                                                boxSizing: 'border-box',
                                                transition: 'all 0.2s ease',
                                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = '#10b981'
                                                e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = '#d1d5db'
                                                e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#6b7280', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>
                                            Roll Number
                                        </label>
                                        <input
                                            type="text"
                                            value={student.roll_no}
                                            disabled
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                background: '#f3f4f6',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '10px',
                                                color: '#9ca3af',
                                                cursor: 'not-allowed',
                                                fontSize: '14px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#6b7280', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>
                                            Grade
                                        </label>
                                        <input
                                            type="text"
                                            value={student.grade_name}
                                            disabled
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                background: '#f3f4f6',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '10px',
                                                color: '#9ca3af',
                                                cursor: 'not-allowed',
                                                fontSize: '14px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#374151', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            value={student.date_of_birth || ''}
                                            onChange={(e) => {
                                                const newStudents = [...students];
                                                newStudents[index].date_of_birth = e.target.value;
                                                setStudents(newStudents);
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                background: '#ffffff',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '10px',
                                                color: '#111827',
                                                outline: 'none',
                                                fontSize: '14px',
                                                boxSizing: 'border-box',
                                                transition: 'all 0.2s ease',
                                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = '#10b981'
                                                e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = '#d1d5db'
                                                e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={saving}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: saving ? '#9ca3af' : '#111827',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: saving ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        letterSpacing: '0.025em'
                    }}
                    onMouseEnter={(e) => {
                        if (!saving) e.target.style.background = '#1f2937'
                    }}
                    onMouseLeave={(e) => {
                        if (!saving) e.target.style.background = '#111827'
                    }}
                >
                    {saving ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
            </form>
        </div>
    )
}
