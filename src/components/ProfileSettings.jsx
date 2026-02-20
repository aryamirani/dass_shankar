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
            background: '#1e293b',
            padding: '40px',
            borderRadius: '16px',
            maxWidth: '600px',
            margin: '0 auto',
            border: '1px solid #334155'
        }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '30px' }}>
                👤 Profile Settings
            </h2>

            {message && (
                <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    background: message.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(239, 83, 80, 0.1)',
                    border: `1px solid ${message.type === 'success' ? '#4caf50' : '#f44336'}`,
                    color: message.type === 'success' ? '#4caf50' : '#ef5350'
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px', fontWeight: '600' }}>
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={profile.email}
                        disabled
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: '#0f172a',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#94a3b8',
                            cursor: 'not-allowed'
                        }}
                    />
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '5px' }}>
                        Email cannot be changed directly for security reasons.
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px', fontWeight: '600' }}>
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        required
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: '#0f172a',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#f1f5f9',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px', fontWeight: '600' }}>
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="+1 234 567 8900"
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: '#0f172a',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#f1f5f9',
                            outline: 'none'
                        }}
                    />
                </div>


                {role === 'parent' && students.length > 0 && (
                    <div style={{ marginTop: '20px', borderTop: '1px solid #334155', paddingTop: '40px', marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '25px' }}>
                            👶 Child Profiles
                        </h3>
                        {students.map((student, index) => (
                            <div key={student.id} style={{
                                background: '#0f172a',
                                padding: '25px',
                                borderRadius: '12px',
                                marginBottom: '20px',
                                border: '1px solid #334155'
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', marginBottom: '8px', fontWeight: '600' }}>
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
                                                padding: '10px',
                                                background: '#0f172a',
                                                border: '1px solid #334155',
                                                borderRadius: '8px',
                                                color: '#f1f5f9',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>
                                            Roll Number
                                        </label>
                                        <input
                                            type="text"
                                            value={student.roll_no}
                                            disabled
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                background: '#1e293b',
                                                border: '1px solid #334155',
                                                borderRadius: '8px',
                                                color: '#64748b',
                                                cursor: 'not-allowed'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>
                                            Grade
                                        </label>
                                        <input
                                            type="text"
                                            value={student.grade_name}
                                            disabled
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                background: '#1e293b',
                                                border: '1px solid #334155',
                                                borderRadius: '8px',
                                                color: '#64748b',
                                                cursor: 'not-allowed'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', marginBottom: '8px', fontWeight: '600' }}>
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
                                                padding: '10px',
                                                background: '#0f172a',
                                                border: '1px solid #334155',
                                                borderRadius: '8px',
                                                color: '#f1f5f9',
                                                outline: 'none'
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
                        padding: '14px',
                        background: saving ? '#475569' : '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s'
                    }}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    )
}
