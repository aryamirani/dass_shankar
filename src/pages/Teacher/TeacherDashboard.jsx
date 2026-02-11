import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import ProfileSettings from '../../components/ProfileSettings'
import ChildProgressView from '../Parent/ChildProgressView'

export default function TeacherDashboard({ onSelectStudent }) {
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
                background: '#0f172a',
                color: '#f1f5f9'
            }}>
                <div style={{ fontSize: '24px' }}>Loading...</div>
            </div>
        )
    }

    if (selectedStudentForProgress) {
        return (
            <div style={{ minHeight: '100vh', background: '#0f172a', padding: '40px 20px' }}>
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
            <div style={{ minHeight: '100vh', background: '#0f172a' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                    <button
                        onClick={() => setCurrentView('dashboard')}
                        style={{
                            marginBottom: '20px',
                            background: 'transparent',
                            border: '1px solid #334155',
                            color: '#94a3b8',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#1e293b'
                            e.target.style.color = '#f1f5f9'
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent'
                            e.target.style.color = '#94a3b8'
                        }}
                    >
                        ← Back to Dashboard
                    </button>
                    <ProfileSettings role="teacher" />
                </div>
            </div>
        )
    }


    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f172a', // Dark background
            padding: '40px 20px',
            color: '#f1f5f9'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '40px'
                }}>
                    <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#f1f5f9', margin: 0 }}>
                        👨‍🏫 Teacher Dashboard
                    </h1>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button
                            onClick={() => setCurrentView('profile')}
                            style={{
                                padding: '14px 28px',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#f1f5f9',
                                background: '#1e293b',
                                border: '1px solid #334155',
                                borderRadius: '12px',
                                cursor: 'pointer',
                            }}
                        >
                            👤 My Profile
                        </button>
                        <button
                            onClick={() => setShowAddStudent(true)}
                            style={{
                                padding: '14px 28px',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: 'white',
                                background: '#667eea',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            + Add Student
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    <div style={{
                        background: '#1e293b',
                        borderRadius: '16px',
                        padding: '30px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        border: '1px solid #334155'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '10px' }}>👥</div>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea', marginBottom: '5px' }}>
                            {students.length}
                        </div>
                        <div style={{ fontSize: '16px', color: '#94a3b8' }}>Total Students</div>
                    </div>
                </div>

                {/* Students List */}
                <div style={{
                    background: '#1e293b',
                    borderRadius: '16px',
                    padding: '30px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #334155'
                }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#f1f5f9' }}>
                        My Students
                    </h2>

                    {students.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#94a3b8'
                        }}>
                            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📚</div>
                            <p style={{ fontSize: '18px' }}>No students yet. Click "+ Add Student" to select from registered students!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {students.map((student) => (
                                <div
                                    key={student.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '20px',
                                        background: '#0f172a',
                                        borderRadius: '12px',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        cursor: 'pointer',
                                        border: '1px solid #334155',
                                        flexDirection: window.innerWidth < 640 ? 'column' : 'row',
                                        gap: window.innerWidth < 640 ? '15px' : '0',
                                        textAlign: window.innerWidth < 640 ? 'center' : 'left'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)'
                                        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                        e.currentTarget.style.borderColor = '#667eea'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = 'none'
                                        e.currentTarget.style.borderColor = '#334155'
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '20px', fontWeight: '600', color: '#f1f5f9', marginBottom: '5px' }}>
                                            {student.full_name}
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '3px' }}>
                                            Roll No: <strong>{student.roll_no || 'N/A'}</strong>
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#64748b' }}>
                                            {student.grades?.display_name || 'Unknown Grade'}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedStudentForProgress(student);
                                            }}
                                            style={{
                                                padding: '10px 20px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: 'white',
                                                background: '#667eea',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            View Progress →
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectStudent && onSelectStudent(student);
                                            }}
                                            style={{
                                                padding: '10px 20px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: 'white',
                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Explore Modules 🚀
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
                        background: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}>
                        <div style={{
                            background: '#1e293b',
                            borderRadius: '20px',
                            padding: '40px',
                            maxWidth: '600px',
                            width: '100%',
                            maxHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'column',
                            border: '1px solid #334155',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#f1f5f9', margin: 0 }}>
                                    Select Student
                                </h2>
                                <button
                                    onClick={() => setShowAddStudent(false)}
                                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer' }}
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
                                        padding: '14px',
                                        fontSize: '16px',
                                        background: '#0f172a',
                                        border: '1px solid #334155',
                                        borderRadius: '12px',
                                        color: '#f1f5f9',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                paddingRight: '10px',
                                display: 'grid',
                                gap: '10px',
                                minHeight: '300px'
                            }}>
                                {filteredAvailable.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                        {availableStudents.length === 0 ? 'No new students available to add.' : 'No students match your search.'}
                                    </div>
                                ) : (
                                    filteredAvailable.map(child => (
                                        <div
                                            key={child.id}
                                            onClick={() => handleLinkStudent(child.id)}
                                            style={{
                                                padding: '15px 20px',
                                                background: '#0f172a',
                                                borderRadius: '12px',
                                                border: '1px solid #334155',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#1e293b'
                                                e.currentTarget.style.borderColor = '#667eea'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = '#0f172a'
                                                e.currentTarget.style.borderColor = '#334155'
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: '600', color: '#f1f5f9' }}>{child.full_name}</div>
                                                <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                                                    Roll: {child.roll_no} • {child.grades?.display_name}
                                                </div>
                                            </div>
                                            <button style={{
                                                padding: '6px 12px',
                                                fontSize: '12px',
                                                background: '#667eea',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontWeight: '600'
                                            }}>
                                                Select
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div style={{ marginTop: '25px', textAlign: 'center' }}>
                                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
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
