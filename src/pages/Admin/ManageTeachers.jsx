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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px'
            }}>
                <div style={{ fontSize: '20px', color: '#6b7280' }}>Loading...</div>
            </div>
        )
    }

    return (
        <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '24px', margin: 0 }}>
                Manage Teachers
            </h2>

            {/* Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                marginBottom: '24px',
                marginTop: '20px'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    borderTop: '4px solid #3b82f6'
                }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>{teachers.length}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Total Teachers</div>
                </div>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    borderTop: '4px solid #f59e0b'
                }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>{pendingCount}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Pending</div>
                </div>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    borderTop: '4px solid #10b981'
                }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>{approvedCount}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Approved</div>
                </div>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    borderTop: '4px solid #ef4444'
                }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444' }}>{rejectedCount}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Rejected</div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '20px'
            }}>
                {['all', 'pending', 'approved', 'rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        style={{
                            padding: '8px 16px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: filter === status ? 'white' : '#4b5563',
                            background: filter === status ? '#111827' : 'white',
                            border: filter === status ? 'none' : '1px solid #e5e7eb',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            transition: 'all 0.2s'
                        }}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Teachers List */}
            <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
                {filteredTeachers.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '48px 20px',
                        color: '#6b7280'
                    }}>
                        <p style={{ fontSize: '16px' }}>No teachers found for this filter</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {filteredTeachers.map((teacher) => (
                            <div
                                key={teacher.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px 20px',
                                    background: '#f9fafb',
                                    borderRadius: '12px',
                                    border: teacher.approval_status === 'pending' ? '1px solid #f59e0b' : '1px solid #e5e7eb'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                                        {teacher.full_name || teacher.name || 'Unnamed Teacher'}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '2px' }}>
                                        {teacher.email}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                        Joined: {new Date(teacher.created_at).toLocaleDateString()}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {/* Status Badge */}
                                    <div style={{
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        background:
                                            teacher.approval_status === 'approved' ? '#ecfdf5' :
                                                teacher.approval_status === 'pending' ? '#fffbeb' :
                                                    '#fef2f2',
                                        color:
                                            teacher.approval_status === 'approved' ? '#10b981' :
                                                teacher.approval_status === 'pending' ? '#f59e0b' :
                                                    '#ef4444',
                                        textTransform: 'capitalize'
                                    }}>
                                        {teacher.approval_status}
                                    </div>

                                    {/* Action Buttons */}
                                    {teacher.approval_status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(teacher.id)}
                                                style={{
                                                    padding: '6px 14px',
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    color: 'white',
                                                    background: '#10b981',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(teacher.id)}
                                                style={{
                                                    padding: '6px 14px',
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    color: 'white',
                                                    background: '#ef4444',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Reject
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
    )
}
