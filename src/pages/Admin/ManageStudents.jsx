import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function ManageStudents() {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // 'all', 'grade_1', 'grade_2'

    useEffect(() => {
        fetchStudents()
    }, [])

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
                color: '#94a3b8'
            }}>
                <div style={{ fontSize: '24px' }}>Loading...</div>
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
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '30px' }}>
                    👨‍🎓 Manage Students
                </h1>

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
                                        flexDirection: window.innerWidth < 800 ? 'column' : 'row',
                                        gap: window.innerWidth < 800 ? '15px' : '0',
                                        textAlign: window.innerWidth < 800 ? 'center' : 'left'
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
                                        justifyContent: window.innerWidth < 800 ? 'center' : 'flex-end',
                                        flexWrap: 'wrap'
                                    }}>
                                        <div style={{ textAlign: window.innerWidth < 800 ? 'center' : 'right' }}>
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
                                            background: '#334155',
                                            display: window.innerWidth < 800 ? 'none' : 'block'
                                        }} />

                                        <div style={{ textAlign: window.innerWidth < 800 ? 'center' : 'left', minWidth: '150px' }}>
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
