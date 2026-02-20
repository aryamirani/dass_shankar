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

            const processedStudents = (studentsData || []).map(student => ({
                id: student.id,
                name: student.full_name,
                rollNo: student.roll_no,
                grade_id: student.grade_id,
                grade: student.grades?.display_name || 'N/A',
                createdAt: student.created_at,
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
            const { data: gradeData } = await supabase
                .from('grades')
                .select('id')
                .eq('name', newStudent.grade)
                .single()

            if (!gradeData) throw new Error('Grade not found')

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

            if (newStudent.teacherId) {
                await supabase.from('teacher_students').insert([{
                    teacher_id: newStudent.teacherId,
                    student_id: studentId
                }])
            }

            if (newStudent.parentId) {
                await supabase.from('parent_students').insert([{
                    parent_id: newStudent.parentId,
                    student_id: studentId
                }])
            }

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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px'
            }}>
                <div style={{ fontSize: '20px', color: '#6b7280' }}>Loading...</div>
            </div>
        )
    }

    if (selectedStudentForProgress) {
        return (
            <div>
                <ChildProgressView
                    child={{
                        ...selectedStudentForProgress,
                        full_name: selectedStudentForProgress.name,
                        grades: { display_name: selectedStudentForProgress.grade }
                    }}
                    onBack={() => setSelectedStudentForProgress(null)}
                />
            </div>
        )
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>
                    Manage Students
                </h2>
                <button
                    onClick={() => setShowAddStudent(true)}
                    style={{
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'white',
                        background: '#10b981',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#059669'}
                    onMouseLeave={(e) => e.target.style.background = '#10b981'}
                >
                    + Add Student
                </button>
            </div>

            {/* Filter Tabs */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '20px'
            }}>
                {['all', 'grade_1', 'grade_2'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '8px 16px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: filter === f ? 'white' : '#4b5563',
                            background: filter === f ? '#10b981' : 'white',
                            border: filter === f ? 'none' : '1px solid #e5e7eb',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            transition: 'all 0.2s'
                        }}
                    >
                        {f.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Students List */}
            <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
                {filteredStudents.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '48px 20px',
                        color: '#6b7280'
                    }}>
                        <p style={{ fontSize: '16px' }}>No students found</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {filteredStudents.map((student) => (
                            <div
                                key={student.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px 20px',
                                    background: '#f9fafb',
                                    borderRadius: '12px',
                                    border: '1px solid #e5e7eb'
                                }}
                            >
                                <div style={{ flex: 1, minWidth: '180px' }}>
                                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                                        {student.name}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '2px' }}>
                                        Roll No: <span style={{ color: '#111827' }}>{student.rollNo}</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                        Joined: {new Date(student.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                {/* Grade Badge */}
                                <div style={{
                                    padding: '4px 10px',
                                    background: '#f0fdf4',
                                    color: '#15803d',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    margin: '0 10px',
                                    border: '1px solid #bbf7d0'
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
                                    <div style={{ textAlign: 'right', minWidth: '140px' }}>
                                        <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Class Teacher
                                        </div>
                                        {student.teacher ? (
                                            <>
                                                <div style={{ fontSize: '13px', color: '#111827' }}>{student.teacher.full_name}</div>
                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{student.teacher.email}</div>
                                            </>
                                        ) : (
                                            <div style={{ fontSize: '13px', color: '#ef4444', fontStyle: 'italic' }}>Not Assigned</div>
                                        )}
                                    </div>

                                    <div style={{
                                        width: '1px',
                                        height: '30px',
                                        background: '#e5e7eb'
                                    }} />

                                    <div style={{ textAlign: 'left', minWidth: '140px' }}>
                                        <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Parent/Guardian
                                        </div>
                                        {student.parent ? (
                                            <>
                                                <div style={{ fontSize: '13px', color: '#111827' }}>{student.parent.full_name}</div>
                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{student.parent.email}</div>
                                            </>
                                        ) : (
                                            <div style={{ fontSize: '13px', color: '#ef4444', fontStyle: 'italic' }}>Not Linked</div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setSelectedStudentForProgress(student)}
                                        style={{
                                            padding: '6px 14px',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            color: '#10b981',
                                            background: '#f0fdf4',
                                            border: '1px solid #bbf7d0',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            marginLeft: '10px'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#10b981'
                                            e.target.style.color = '#fff'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = '#f0fdf4'
                                            e.target.style.color = '#10b981'
                                        }}
                                    >
                                        View Progress
                                    </button>
                                </div>
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
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '32px',
                        maxWidth: '560px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        borderTop: '6px solid #10b981'
                    }}>
                        <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '24px', color: '#111827' }}>
                            Add New Student
                        </h2>
                        <form onSubmit={handleAddStudent}>
                            {/* Basic Info */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4b5563', marginBottom: '6px' }}>Student Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newStudent.name}
                                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                        placeholder="Full Name"
                                        style={{ width: '100%', padding: '10px 14px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827', boxSizing: 'border-box', fontSize: '14px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4b5563', marginBottom: '6px' }}>Roll Number</label>
                                    <input
                                        type="text"
                                        required
                                        value={newStudent.rollNo}
                                        onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value.toUpperCase() })}
                                        placeholder="ROLL-001"
                                        style={{ width: '100%', padding: '10px 14px', background: '#f9fafb', border: rollNoError ? '1px solid #ef4444' : '1px solid #e5e7eb', borderRadius: '8px', color: '#111827', boxSizing: 'border-box', fontSize: '14px' }}
                                    />
                                    {rollNoError && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{rollNoError}</div>}
                                </div>
                            </div>

                            {/* Grade & Teacher */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4b5563', marginBottom: '6px' }}>Grade</label>
                                    <select
                                        value={newStudent.grade}
                                        onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                                        style={{ width: '100%', padding: '10px 14px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827', boxSizing: 'border-box', fontSize: '14px' }}
                                    >
                                        <option value="grade_1">Grade 1</option>
                                        <option value="grade_2">Grade 2</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4b5563', marginBottom: '6px' }}>Assign Teacher</label>
                                    <select
                                        value={newStudent.teacherId}
                                        onChange={(e) => setNewStudent({ ...newStudent, teacherId: e.target.value })}
                                        style={{ width: '100%', padding: '10px 14px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827', boxSizing: 'border-box', fontSize: '14px' }}
                                    >
                                        <option value="">Select Teacher (Optional)</option>
                                        {teachers.map(t => (
                                            <option key={t.id} value={t.id}>{t.full_name} ({t.email})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Parent */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4b5563', marginBottom: '6px' }}>Link Parent</label>
                                <select
                                    value={newStudent.parentId}
                                    onChange={(e) => setNewStudent({ ...newStudent, parentId: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827', boxSizing: 'border-box', fontSize: '14px' }}
                                >
                                    <option value="">Select Parent (Optional)</option>
                                    {parents.map(p => (
                                        <option key={p.id} value={p.id}>{p.full_name} ({p.email})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddStudent(false)}
                                    style={{ flex: 1, padding: '12px', background: 'white', border: '1px solid #e5e7eb', color: '#4b5563', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ flex: 1, padding: '12px', background: '#10b981', border: 'none', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
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
