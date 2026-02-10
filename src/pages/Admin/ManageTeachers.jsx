import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function ManageTeachers() {
    const [teachers, setTeachers] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // 'all', 'pending', 'approved', 'rejected'

    useEffect(() => {
        fetchTeachers()
    }, [])

    const fetchTeachers = async () => {
        try {
            const { data, error } = await supabase
                .from('teachers')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setTeachers(data || [])
        } catch (error) {
            console.error('Error fetching teachers:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (teacherId) => {
        try {
            const { error } = await supabase
                .from('teachers')
                .update({ approval_status: 'approved' })
                .eq('id', teacherId)

            if (error) throw error

            // Refresh list
            fetchTeachers()
            alert('Teacher approved successfully!')
        } catch (error) {
            console.error('Error approving teacher:', error)
            alert('Failed to approve teacher: ' + error.message)
        }
    }

    const handleReject = async (teacherId) => {
        if (!confirm('Are you sure you want to reject this teacher?')) return

        try {
            const { error } = await supabase
                .from('teachers')
                .update({ approval_status: 'rejected' })
                .eq('id', teacherId)

            if (error) throw error

            // Refresh list
            fetchTeachers()
            alert('Teacher rejected')
        } catch (error) {
            console.error('Error rejecting teacher:', error)
            alert('Failed to reject teacher: ' + error.message)
        }
    }

    const filteredTeachers = teachers.filter(t => {
        if (filter === 'all') return true
        return t.approval_status === filter
    })

    const pendingCount = teachers.filter(t => t.approval_status === 'pending').length
    const approvedCount = teachers.filter(t => t.approval_status === 'approved').length
    const rejectedCount = teachers.filter(t => t.approval_status === 'rejected').length

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ fontSize: '24px', color: '#666' }}>Loading...</div>
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
                    👨‍🏫 Manage Teachers
                </h1>

                {/* Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '15px',
                    marginBottom: '30px'
                }}>
                    <div style={{
                        background: '#1e293b',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid #334155'
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea' }}>{teachers.length}</div>
                        <div style={{ fontSize: '14px', color: '#94a3b8' }}>Total Teachers</div>
                    </div>
                    <div style={{
                        background: '#1e293b',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid #334155'
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffa726' }}>{pendingCount}</div>
                        <div style={{ fontSize: '14px', color: '#94a3b8' }}>Pending</div>
                    </div>
                    <div style={{
                        background: '#1e293b',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid #334155'
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4caf50' }}>{approvedCount}</div>
                        <div style={{ fontSize: '14px', color: '#94a3b8' }}>Approved</div>
                    </div>
                    <div style={{
                        background: '#1e293b',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid #334155'
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef5350' }}>{rejectedCount}</div>
                        <div style={{ fontSize: '14px', color: '#94a3b8' }}>Rejected</div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '20px',
                    flexWrap: 'wrap'
                }}>
                    {['all', 'pending', 'approved', 'rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            style={{
                                padding: '8px 16px',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: filter === status ? 'white' : '#94a3b8',
                                background: filter === status ? '#667eea' : '#1e293b',
                                border: filter === status ? 'none' : '1px solid #334155',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                transition: 'all 0.3s'
                            }}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Teachers List */}
                <div style={{
                    background: '#1e293b',
                    borderRadius: '16px',
                    padding: '30px',
                    border: '1px solid #334155'
                }}>
                    {filteredTeachers.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#94a3b8'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📭</div>
                            <p style={{ fontSize: '16px' }}>No teachers found for this filter</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {filteredTeachers.map((teacher) => (
                                <div
                                    key={teacher.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '20px',
                                        background: '#0f172a',
                                        borderRadius: '12px',
                                        border: teacher.approval_status === 'pending' ? '1px solid #ffa726' : '1px solid #334155',
                                        flexDirection: window.innerWidth < 640 ? 'column' : 'row',
                                        gap: window.innerWidth < 640 ? '15px' : '0',
                                        textAlign: window.innerWidth < 640 ? 'center' : 'left'
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#f1f5f9', marginBottom: '5px' }}>
                                            {teacher.full_name || teacher.name || 'Unnamed Teacher'}
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '5px' }}>
                                            {teacher.email}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                                            Joined: {new Date(teacher.created_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        {/* Status Badge */}
                                        <div style={{
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            background:
                                                teacher.approval_status === 'approved' ? 'rgba(76, 175, 80, 0.1)' :
                                                    teacher.approval_status === 'pending' ? 'rgba(255, 167, 38, 0.1)' :
                                                        'rgba(239, 83, 80, 0.1)',
                                            color:
                                                teacher.approval_status === 'approved' ? '#4caf50' :
                                                    teacher.approval_status === 'pending' ? '#ffa726' :
                                                        '#ef5350',
                                            textTransform: 'capitalize',
                                            border: `1px solid ${teacher.approval_status === 'approved' ? '#4caf50' :
                                                    teacher.approval_status === 'pending' ? '#ffa726' :
                                                        '#ef5350'
                                                }`
                                        }}>
                                            {teacher.approval_status}
                                        </div>

                                        {/* Action Buttons */}
                                        {teacher.approval_status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(teacher.id)}
                                                    style={{
                                                        padding: '8px 16px',
                                                        fontSize: '14px',
                                                        fontWeight: '600',
                                                        color: 'white',
                                                        background: '#4caf50',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    ✓ Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(teacher.id)}
                                                    style={{
                                                        padding: '8px 16px',
                                                        fontSize: '14px',
                                                        fontWeight: '600',
                                                        color: 'white',
                                                        background: '#ef5350',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    ✗ Reject
                                                </button>
                                            </>
                                        )}
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
