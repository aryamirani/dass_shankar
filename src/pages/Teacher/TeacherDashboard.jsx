import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import ProfileSettings from '../../components/ProfileSettings'

export default function TeacherDashboard({ onSelectStudent }) {
    const { user } = useAuth()
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddStudent, setShowAddStudent] = useState(false)
    const [newStudent, setNewStudent] = useState({ name: '', rollNo: '', grade: 'grade_1' })
    const [rollNoError, setRollNoError] = useState('')
    const [teacherProfileId, setTeacherProfileId] = useState(null)
    const [currentView, setCurrentView] = useState('dashboard') // 'dashboard', 'profile'

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

    const handleAddStudent = async (e) => {
        e.preventDefault()
        setRollNoError('')

        try {
            // Get grade ID
            const { data: gradeData } = await supabase
                .from('grades')
                .select('id')
                .eq('name', newStudent.grade)
                .single()

            if (!gradeData) throw new Error('Grade not found')

            // Create student with roll number
            const { data: studentData, error: studentError } = await supabase
                .from('students')
                .insert([{
                    full_name: newStudent.name,
                    roll_no: newStudent.rollNo,
                    grade_id: gradeData.id,
                    created_by: teacherProfileId
                }])
                .select()
                .single()

            if (studentError) {
                if (studentError.code === '23505') { // Unique constraint violation
                    setRollNoError('This roll number is already taken')
                    return
                }
                throw studentError
            }

            // Link student to teacher
            const { error: linkError } = await supabase
                .from('teacher_students')
                .insert([{
                    teacher_id: teacherProfileId,
                    student_id: studentData.id
                }])

            if (linkError) throw linkError

            // Refresh student list
            fetchStudents(teacherProfileId)
            setShowAddStudent(false)
            setNewStudent({ name: '', rollNo: '', grade: 'grade_1' })
            setRollNoError('')
        } catch (error) {
            console.error('Error adding student:', error)
            alert('Failed to add student: ' + error.message)
        }
    }

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
                            <p style={{ fontSize: '18px' }}>No students yet. Click "Add Student" to get started!</p>
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
                                    onClick={() => onSelectStudent && onSelectStudent(student)}
                                >
                                    <div>
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
                                    <button
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
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Student Modal */}
                {showAddStudent && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(5px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            background: '#1e293b',
                            borderRadius: '16px',
                            padding: '40px',
                            maxWidth: '500px',
                            width: '90%',
                            border: '1px solid #334155',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}>
                            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '30px', color: '#f1f5f9' }}>
                                Add New Student
                            </h2>
                            <form onSubmit={handleAddStudent}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#cbd5e1',
                                        marginBottom: '8px'
                                    }}>
                                        Student Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newStudent.name}
                                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            fontSize: '16px',
                                            background: '#0f172a',
                                            border: '1px solid #334155',
                                            borderRadius: '12px',
                                            outline: 'none',
                                            color: '#f1f5f9',
                                            boxSizing: 'border-box'
                                        }}
                                        placeholder="Enter student name"
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#cbd5e1',
                                        marginBottom: '8px'
                                    }}>
                                        Roll Number <span style={{ color: '#ef5350' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={newStudent.rollNo}
                                        onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value.toUpperCase() })}
                                        placeholder="e.g., 2024-1-001"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            fontSize: '16px',
                                            background: '#0f172a',
                                            border: rollNoError ? '1px solid #ef5350' : '1px solid #334155',
                                            borderRadius: '12px',
                                            outline: 'none',
                                            color: '#f1f5f9',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                    {rollNoError && (
                                        <div style={{ color: '#ef5350', fontSize: '13px', marginTop: '5px' }}>
                                            {rollNoError}
                                        </div>
                                    )}
                                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '5px' }}>
                                        Roll number must be unique for each student.
                                    </div>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#cbd5e1',
                                        marginBottom: '8px'
                                    }}>
                                        Grade
                                    </label>
                                    <select
                                        value={newStudent.grade}
                                        onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            fontSize: '16px',
                                            background: '#0f172a',
                                            border: '1px solid #334155',
                                            borderRadius: '12px',
                                            outline: 'none',
                                            color: '#f1f5f9',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        <option value="grade_1">Grade 1</option>
                                        <option value="grade_2">Grade 2</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddStudent(false)}
                                        style={{
                                            flex: 1,
                                            padding: '14px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: '#94a3b8',
                                            background: 'transparent',
                                            border: '1px solid #334155',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#0f172a'
                                            e.target.style.color = '#f1f5f9'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'transparent'
                                            e.target.style.color = '#94a3b8'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{
                                            flex: 1,
                                            padding: '14px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: 'white',
                                            background: '#667eea',
                                            border: 'none',
                                            borderRadius: '12px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Add Student
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
