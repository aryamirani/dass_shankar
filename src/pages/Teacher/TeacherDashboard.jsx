import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import ProfileSettings from '../../components/ProfileSettings'
import ChildProgressView from '../Parent/ChildProgressView'

export default function TeacherDashboard({ onSelectStudent, signOut }) {
    const { user } = useAuth()
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddStudent, setShowAddStudent] = useState(false)
    const [availableStudents, setAvailableStudents] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [teacherProfileId, setTeacherProfileId] = useState(null)
    const [currentView, setCurrentView] = useState('dashboard') // 'dashboard', 'profile'
    const [selectedStudentForProgress, setSelectedStudentForProgress] = useState(null)

    useEffect(() => {
        if (user) {
            fetchTeacherProfile()
        }
    }, [user])

    const fetchTeacherProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('teachers')
                .select('id')
                .eq('user_id', user.id)
                .single()

            if (error) throw error
            if (data) {
                setTeacherProfileId(data.id)
                fetchStudents(data.id)
            }
        } catch (error) {
            console.error('Error fetching teacher profile:', error)
        }
    }

    const fetchStudents = async (teacherId) => {
        if (!teacherId) return
        try {
            const { data, error } = await supabase
                .from('teacher_students')
                .select(`
          student_id,
          students (
            id,
            full_name,
            roll_no,
            grade_id,
            grades (display_name)
          )
        `)
                .eq('teacher_id', teacherId)

            if (error) throw error
            setStudents(data?.map(ts => ts.students) || [])
        } catch (error) {
            console.error('Error fetching students:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchAvailableStudents = async () => {
        try {
            // Get all students who aren't already matched with THIS teacher
            const { data: currentLinks } = await supabase
                .from('teacher_students')
                .select('student_id')
                .eq('teacher_id', teacherProfileId)

            const linkedIds = currentLinks?.map(l => l.student_id) || []

            let query = supabase
                .from('students')
                .select(`
                    id,
                    full_name,
                    roll_no,
                    grades (display_name)
                `)

            if (linkedIds.length > 0) {
                query = query.not('id', 'in', `(${linkedIds.join(',')})`)
            }

            const { data, error } = await query

            if (error) throw error
            setAvailableStudents(data || [])
        } catch (error) {
            console.error('Error fetching available students:', error)
        }
    }

    useEffect(() => {
        if (showAddStudent && teacherProfileId) {
            fetchAvailableStudents()
        }
    }, [showAddStudent, teacherProfileId])

    const handleLinkStudent = async (studentId) => {
        try {
            const { error } = await supabase
                .from('teacher_students')
                .insert([{
                    teacher_id: teacherProfileId,
                    student_id: studentId
                }])

            if (error) throw error

            // Refresh
            fetchStudents(teacherProfileId)
            setShowAddStudent(false)
            setSearchTerm('')
        } catch (error) {
            console.error('Error linking student:', error)
            alert('Failed to add student: ' + error.message)
        }
    }

    const filteredAvailable = availableStudents.filter(s =>
        s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.roll_no?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f3f4f6',
                color: '#6b7280'
            }}>
                <div style={{ fontSize: '24px' }}>Loading...</div>
            </div>
        )
    }

    if (selectedStudentForProgress) {
        return (
            <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '40px 20px', fontFamily: '"Inter", "Segoe UI", sans-serif' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <ChildProgressView
                        child={selectedStudentForProgress}
                        onBack={() => setSelectedStudentForProgress(null)}
                    />
                </div>
            </div>
        )
    }

    if (currentView === 'profile') {
        return (
            <div style={{ minHeight: '100vh', background: '#f3f4f6', fontFamily: '"Inter", "Segoe UI", sans-serif' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                    <button
                        onClick={() => setCurrentView('dashboard')}
                        style={{
                            marginBottom: '24px',
                            background: '#111827',
                            border: 'none',
                            color: '#ffffff',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                            fontWeight: '500',
                            fontSize: '14px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#1f2937'
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#111827'
                        }}
                    >
                        ← Back to Dashboard
                    </button>
                    <div style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '40px' }}>
                        <ProfileSettings role="teacher" />
                    </div>
                </div>
            </div>
        )
    }


    return (
        <div style={{
            minHeight: '100vh',
            background: '#f3f4f6', // Light background
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* Top Navigation Bar */}
            <nav style={{
                background: '#111827',
                padding: '16px 32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                    Welcome, Teacher
                </div>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <button
                        onClick={() => setCurrentView('dashboard')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: currentView === 'dashboard' ? '#ffffff' : '#9ca3af',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'color 0.2s',
                            padding: 0
                        }}>
                        Dashboard
                    </button>
                    <button
                        onClick={() => setCurrentView('profile')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: currentView === 'profile' ? '#ffffff' : '#9ca3af',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'color 0.2s',
                            padding: 0
                        }}>
                        My Profile
                    </button>
                    <button
                        onClick={signOut}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'color 0.2s',
                            padding: 0
                        }}>
                        Logout
                    </button>
                </div>
            </nav>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '40px'
                }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                        Teacher Dashboard
                    </h1>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button
                            onClick={() => setShowAddStudent(true)}
                            style={{
                                padding: '12px 24px',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: 'white',
                                background: '#0084ffff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                // boxShadow: '0 4px 14px 0 rgba(0, 195, 255, 1)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = '(135deg, #00b7ffff 0%, #00b7ffff 100%)'
                                e.target.style.boxShadow = '0 6px 20px 0 rgba(0, 195, 255, 1)'
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = '(135deg, #00b7ffff 0%, #00b7ffff 100%)'
                                e.target.style.boxShadow = '0 4px 14px 0 rgba(0, 195, 255, 1)'
                            }}
                        >
                            + Add Student
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '24px',
                    marginBottom: '40px'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #e5e7eb',
                        borderTop: '4px solid #10b981'
                    }}>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
                            {students.length}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Students</div>
                    </div>
                </div>

                {/* Students List */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '32px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #e5e7eb'
                }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#111827' }}>
                        My Students
                    </h2>

                    {students.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#6b7280'
                        }}>
                            <p style={{ fontSize: '16px', fontWeight: '500' }}>No students yet. Click "+ Add Student" to select from registered students!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {students.map((student) => (
                                <div
                                    key={student.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '20px 24px',
                                        background: '#f9fafb',
                                        borderRadius: '12px',
                                        transition: 'all 0.2s',
                                        border: '1px solid #e5e7eb',
                                        flexDirection: window.innerWidth < 640 ? 'column' : 'row',
                                        gap: window.innerWidth < 640 ? '16px' : '0'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#d1d5db'
                                        e.currentTarget.style.background = '#f3f4f6'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#e5e7eb'
                                        e.currentTarget.style.background = '#f9fafb'
                                    }}
                                >
                                    <div style={{ flex: 1, textAlign: window.innerWidth < 640 ? 'center' : 'left' }}>
                                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                                            {student.full_name}
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#4b5563', marginBottom: '4px' }}>
                                            Roll No: <span style={{ fontWeight: '500', color: '#111827' }}>{student.roll_no || 'N/A'}</span>
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#6b7280' }}>
                                            {student.grades?.display_name || 'Unknown Grade'}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: window.innerWidth < 640 ? 'center' : 'flex-end' }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedStudentForProgress(student);
                                            }}
                                            style={{
                                                padding: '8px 16px',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                color: '#e11d48',
                                                background: '#ffe4e6',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = '#fecdd3'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = '#ffe4e6'
                                            }}
                                        >
                                            View Progress
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectStudent && onSelectStudent(student);
                                            }}
                                            style={{
                                                padding: '8px 16px',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                color: '#ffffff',
                                                background: '#10b981',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = '#059669'}
                                            onMouseLeave={(e) => e.target.style.background = '#10b981'}
                                        >
                                            Explore Modules
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Student Selection Modal */}
                {showAddStudent && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(17, 24, 39, 0.7)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}>
                        <div style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '32px',
                            maxWidth: '600px',
                            width: '100%',
                            maxHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                                    Select Student
                                </h2>
                                <button
                                    onClick={() => setShowAddStudent(false)}
                                    style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '24px', cursor: 'pointer', transition: 'color 0.2s' }}
                                    onMouseEnter={(e) => e.target.style.color = '#4b5563'}
                                    onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                                >
                                    ×
                                </button>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <input
                                    type="text"
                                    placeholder="Search by name or roll number..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        fontSize: '14px',
                                        background: '#f9fafb',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        color: '#111827',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        transition: 'border-color 0.2s, box-shadow 0.2s'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#111827'
                                        e.target.style.boxShadow = '0 0 0 3px rgba(17, 24, 39, 0.1)'
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#d1d5db'
                                        e.target.style.boxShadow = 'none'
                                    }}
                                />
                            </div>

                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                paddingRight: '8px',
                                display: 'grid',
                                gap: '12px',
                                minHeight: '300px'
                            }}>
                                {filteredAvailable.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', fontSize: '14px' }}>
                                        {availableStudents.length === 0 ? 'No new students available to add.' : 'No students match your search.'}
                                    </div>
                                ) : (
                                    filteredAvailable.map(child => (
                                        <div
                                            key={child.id}
                                            onClick={() => handleLinkStudent(child.id)}
                                            style={{
                                                padding: '16px',
                                                background: 'white',
                                                borderRadius: '12px',
                                                border: '1px solid #e5e7eb',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = '#111827'
                                                e.currentTarget.style.background = '#f8fafc'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = '#e5e7eb'
                                                e.currentTarget.style.background = 'white'
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: '600', color: '#111827', fontSize: '15px', marginBottom: '4px' }}>{child.full_name}</div>
                                                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                                                    Roll: {child.roll_no} • {child.grades?.display_name}
                                                </div>
                                            </div>
                                            <button style={{
                                                padding: '8px 16px',
                                                fontSize: '13px',
                                                background: '#10b981',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                boxShadow: '0 1px 2px 0 rgba(16, 185, 129, 0.3)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = '#059669'
                                                e.target.style.boxShadow = '0 4px 6px -1px rgba(16, 185, 129, 0.4)'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = '#10b981'
                                                e.target.style.boxShadow = '0 1px 2px 0 rgba(16, 185, 129, 0.3)'
                                            }}>
                                                Select
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                                    Can't find a student? Please contact an administrator to register them.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
