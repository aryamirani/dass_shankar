import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import ChildProgressView from '../Parent/ChildProgressView'

export default function ManageStudents() {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // 'all', 'grade_1', 'grade_2'
    const [showAddStudent, setShowAddStudent] = useState(false)
    const [teachers, setTeachers] = useState([])
    const [parents, setParents] = useState([])
    const [rollNoError, setRollNoError] = useState('')
    const [selectedStudentForProgress, setSelectedStudentForProgress] = useState(null)
    const [newStudent, setNewStudent] = useState({
        name: '',
        rollNo: '',
        grade: 'grade_1',
        teacherId: '',
        parentId: ''
    })

    useEffect(() => {
        fetchStudents()
        fetchTeachersAndParents()
    }, [])

    const fetchTeachersAndParents = async () => {
        try {
            const [{ data: teachersData }, { data: parentsData }] = await Promise.all([
                supabase.from('teachers').select('id, full_name, email'),
                supabase.from('parents').select('id, full_name, email')
            ])
            setTeachers(teachersData || [])
            setParents(parentsData || [])
        } catch (error) {
            console.error('Error fetching teachers/parents:', error)
        }
    }

    const fetchStudents = async () => {
        try {
            // Fetch students with their grade
            const { data: studentsData, error: studentsError } = await supabase
                .from('students')
                .select(`
                    id,
                    full_name,
                    roll_no,
                    created_at,
                    grade_id,
                    grades (display_name),
                    teacher_students (
                        teachers (full_name, email)
                    ),
                    parent_students (
                        parents (full_name, email, phone)
                    )
                `)
                .order('created_at', { ascending: false })

            if (studentsError) throw studentsError

            // Process data to flatten structure
            const processedStudents = (studentsData || []).map(student => ({
                id: student.id,
                name: student.full_name,
                rollNo: student.roll_no,
                grade_id: student.grade_id,
                grade: student.grades?.display_name || 'N/A',
                createdAt: student.created_at,
                // Taking the first teacher/parent found (assuming 1:1 or 1:many but showing primary)
                teacher: student.teacher_students?.[0]?.teachers || null,
                parent: student.parent_students?.[0]?.parents || null
            }))

            setStudents(processedStudents)
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
            // 1. Get Grade ID
            const { data: gradeData } = await supabase
                .from('grades')
                .select('id')
                .eq('name', newStudent.grade)
                .single()

            if (!gradeData) throw new Error('Grade not found')

            // 2. Create Student
            const { data: studentData, error: studentError } = await supabase
                .from('students')
                .insert([{
                    full_name: newStudent.name,
                    roll_no: newStudent.rollNo,
                    grade_id: gradeData.id
                }])
                .select()
                .single()

            if (studentError) {
                if (studentError.code === '23505') {
                    setRollNoError('This roll number is already taken')
                    return
                }
                throw studentError
            }

            const studentId = studentData.id

            // 3. Link Teacher if selected
            if (newStudent.teacherId) {
                await supabase.from('teacher_students').insert([{
                    teacher_id: newStudent.teacherId,
                    student_id: studentId
                }])
            }

            // 4. Link Parent if selected
            if (newStudent.parentId) {
                await supabase.from('parent_students').insert([{
                    parent_id: newStudent.parentId,
                    student_id: studentId
                }])
            }

            // Refresh
            fetchStudents()
            setShowAddStudent(false)
            setNewStudent({ name: '', rollNo: '', grade: 'grade_1', teacherId: '', parentId: '' })
        } catch (error) {
            console.error('Error adding student:', error)
            alert('Failed to add student: ' + error.message)
        }
    }

    const filteredStudents = students.filter(s => {
        if (filter === 'all') return true
        if (filter === 'grade_1') return s.grade === 'Grade 1'
        if (filter === 'grade_2') return s.grade === 'Grade 2'
        return true
    })

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                background: '#0f172a'
            }}>
                <div style={{ fontSize: '24px' }}>Loading...</div>
            </div>
        )
    }

    if (selectedStudentForProgress) {
        return (
            <div style={{
                background: '#0f172a',
                padding: '40px 20px',
                minHeight: '100vh'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <ChildProgressView
                        child={{
                            ...selectedStudentForProgress,
                            full_name: selectedStudentForProgress.name,
                            grades: { display_name: selectedStudentForProgress.grade }
                        }}
                        onBack={() => setSelectedStudentForProgress(null)}
                    />
                </div>
            </div>
        )
    }

    return (
        <div style={{
            background: '#0f172a',
            padding: '20px 0',
            minHeight: '100vh',
            color: '#f1f5f9'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#f1f5f9', margin: 0 }}>
                        👨‍🎓 Manage Students
                    </h1>
                    <button
                        onClick={() => setShowAddStudent(true)}
                        style={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'white',
                            background: '#667eea',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(102, 126, 234, 0.3)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        + Add Student
                    </button>
                </div>

                {/* Filter Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '20px',
                    flexWrap: 'wrap'
                }}>
                    {['all', 'grade_1', 'grade_2'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '8px 16px',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: filter === f ? 'white' : '#94a3b8',
                                background: filter === f ? '#667eea' : '#1e293b',
                                border: filter === f ? 'none' : '1px solid #334155',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                transition: 'all 0.3s'
                            }}
                        >
                            {f.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {/* Students List */}
                <div style={{
                    background: '#1e293b',
                    borderRadius: '16px',
                    padding: '30px',
                    border: '1px solid #334155'
                }}>
                    {filteredStudents.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#94a3b8'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📭</div>
                            <p style={{ fontSize: '16px' }}>No students found</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {filteredStudents.map((student) => (
                                <div
                                    key={student.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '20px',
                                        background: '#0f172a',
                                        borderRadius: '12px',
                                        border: '1px solid #334155',
                                        flexDirection: window.innerWidth < 1200 ? 'column' : 'row',
                                        gap: window.innerWidth < 1200 ? '15px' : '0',
                                        textAlign: window.innerWidth < 1200 ? 'center' : 'left'
                                    }}
                                >
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#f1f5f9', marginBottom: '5px' }}>
                                            {student.name}
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '3px' }}>
                                            Roll No: <span style={{ color: '#fff' }}>{student.rollNo}</span>
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                                            Joined: {new Date(student.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Grade Badge */}
                                    <div style={{
                                        padding: '6px 12px',
                                        background: 'rgba(102, 126, 234, 0.1)',
                                        color: '#667eea',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        margin: '0 10px'
                                    }}>
                                        {student.grade}
                                    </div>

                                    {/* Relations Info */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '20px',
                                        flex: 2,
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        flexWrap: 'wrap'
                                    }}>
                                        <div style={{ textAlign: 'right', minWidth: '150px' }}>
                                            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                Class Teacher
                                            </div>
                                            {student.teacher ? (
                                                <>
                                                    <div style={{ fontSize: '14px', color: '#e2e8f0' }}>{student.teacher.full_name}</div>
                                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{student.teacher.email}</div>
                                                </>
                                            ) : (
                                                <div style={{ fontSize: '13px', color: '#ef5350', fontStyle: 'italic' }}>Not Assigned</div>
                                            )}
                                        </div>

                                        <div style={{
                                            width: '1px',
                                            height: '30px',
                                            background: '#334155'
                                        }} />

                                        <div style={{ textAlign: 'left', minWidth: '150px' }}>
                                            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                Parent/Guardian
                                            </div>
                                            {student.parent ? (
                                                <>
                                                    <div style={{ fontSize: '14px', color: '#e2e8f0' }}>{student.parent.full_name}</div>
                                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{student.parent.email}</div>
                                                </>
                                            ) : (
                                                <div style={{ fontSize: '13px', color: '#ef5350', fontStyle: 'italic' }}>Not Linked</div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => setSelectedStudentForProgress(student)}
                                            style={{
                                                padding: '8px 16px',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                color: '#667eea',
                                                background: 'rgba(102, 126, 234, 0.1)',
                                                border: '1px solid rgba(102, 126, 234, 0.3)',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                marginLeft: '20px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = '#667eea'
                                                e.target.style.color = '#fff'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'rgba(102, 126, 234, 0.1)'
                                                e.target.style.color = '#667eea'
                                            }}
                                        >
                                            View Progress →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Student Modal */}
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
                    zIndex: 2000,
                    padding: '20px'
                }}>
                    <div style={{
                        background: '#1e293b',
                        borderRadius: '20px',
                        padding: '40px',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        border: '1px solid #334155',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '30px', color: '#f1f5f9' }}>
                            Add New Student
                        </h2>
                        <form onSubmit={handleAddStudent}>
                            {/* Basic Info */}
                            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 640 ? '1fr' : '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>Student Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newStudent.name}
                                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                        placeholder="Full Name"
                                        style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>Roll Number</label>
                                    <input
                                        type="text"
                                        required
                                        value={newStudent.rollNo}
                                        onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value.toUpperCase() })}
                                        placeholder="ROLL-001"
                                        style={{ width: '100%', padding: '12px', background: '#0f172a', border: rollNoError ? '1px solid #ef4444' : '1px solid #334155', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}
                                    />
                                    {rollNoError && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{rollNoError}</div>}
                                </div>
                            </div>

                            {/* Grade & Teacher */}
                            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 640 ? '1fr' : '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>Grade</label>
                                    <select
                                        value={newStudent.grade}
                                        onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                                        style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}
                                    >
                                        <option value="grade_1">Grade 1</option>
                                        <option value="grade_2">Grade 2</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>Assign Teacher</label>
                                    <select
                                        value={newStudent.teacherId}
                                        onChange={(e) => setNewStudent({ ...newStudent, teacherId: e.target.value })}
                                        style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}
                                    >
                                        <option value="">Select Teacher (Optional)</option>
                                        {teachers.map(t => (
                                            <option key={t.id} value={t.id}>{t.full_name} ({t.email})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Parent */}
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>Link Parent</label>
                                <select
                                    value={newStudent.parentId}
                                    onChange={(e) => setNewStudent({ ...newStudent, parentId: e.target.value })}
                                    style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}
                                >
                                    <option value="">Select Parent (Optional)</option>
                                    {parents.map(p => (
                                        <option key={p.id} value={p.id}>{p.full_name} ({p.email})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddStudent(false)}
                                    style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ flex: 1, padding: '14px', background: '#667eea', border: 'none', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}
                                >
                                    Create Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
