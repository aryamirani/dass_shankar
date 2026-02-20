import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function ManageParents() {
    const [parentRequests, setParentRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // all, pending, approved, rejected
    const [searchRollNo, setSearchRollNo] = useState('')
    const [searchResults, setSearchResults] = useState(null)
    const [validationData, setValidationData] = useState({}) // Store fetched student data for validation

    useEffect(() => {
        fetchParentRequests()
    }, [])

    const fetchParentRequests = async () => {
        try {
            const { data, error } = await supabase
                .from('parent_requests')
                .select(`
                    *,
                    parents (
                        id,
                        email,
                        full_name
                    )
                `)
                .order('created_at', { ascending: false })

            if (error) throw error
            setParentRequests(data || [])

            // Fetch student data for all pending requests to validate
            const pendingRequests = (data || []).filter(r => r.status === 'pending')
            if (pendingRequests.length > 0) {
                validateRequests(pendingRequests)
            }
        } catch (error) {
            console.error('Error fetching parent requests:', error)
        } finally {
            setLoading(false)
        }
    }

    const validateRequests = async (requests) => {
        const rollNos = requests.map(r => r.student_roll_no)
        try {
            const { data, error } = await supabase
                .from('students')
                .select(`
                    id,
                    roll_no,
                    grades (display_name)
                `)
                .in('roll_no', rollNos)

            if (error) throw error

            const validationMap = {}
            data.forEach(student => {
                validationMap[student.roll_no] = student
            })
            setValidationData(validationMap)
        } catch (err) {
            console.error("Error validating requests:", err)
        }
    }

    const searchStudent = async () => {
        if (!searchRollNo.trim()) {
            setSearchResults(null)
            return
        }

        try {
            const { data, error } = await supabase
                .from('students')
                .select(`
                    id,
                    full_name,
                    roll_no,
                    grades (display_name)
                `)
                .eq('roll_no', searchRollNo.toUpperCase())
                .single()

            if (error) {
                setSearchResults({ found: false })
            } else {
                setSearchResults({ found: true, student: data })
            }
        } catch (error) {
            setSearchResults({ found: false })
        }
    }

    const handleApprove = async (request) => {
        // Strict Validation Check
        const validStudent = validationData[request.student_roll_no]
        if (!validStudent) {
            alert("Cannot approve: Student roll number does not exist.")
            return
        }
        if (validStudent.grades?.display_name !== request.grade_name) {
            alert(`Cannot approve: Grade mismatch. Parent requested '${request.grade_name}', but student is in '${validStudent.grades?.display_name}'.`)
            return
        }

        if (!confirm(`WARNING: You are about to link ${request.parents?.full_name} to student ${request.student_name} (${request.student_roll_no}).\n\nPlease confirm that you have personally verified this relationship.\n\nAre you sure you want to proceed?`)) {
            return
        }

        try {
            // Link parent to student
            const { error: linkError } = await supabase
                .from('parent_students')
                .insert([{
                    parent_id: request.parent_id,
                    student_id: validStudent.id
                }])

            if (linkError) throw linkError

            // Update parent approval status
            const { error: approvalError } = await supabase
                .from('parents')
                .update({ approval_status: 'approved' })
                .eq('id', request.parent_id)

            if (approvalError) throw approvalError

            // Update request status
            const { error: requestError } = await supabase
                .from('parent_requests')
                .update({
                    status: 'approved',
                    reviewed_at: new Date().toISOString()
                })
                .eq('id', request.id)

            if (requestError) throw requestError

            fetchParentRequests()
            alert('Parent approved and linked to student successfully!')
        } catch (error) {
            console.error('Error approving parent:', error)
            alert('Failed to approve parent: ' + error.message)
        }
    }

    const handleReject = async (requestId, parentId) => {
        if (!confirm('Are you sure you want to reject this parent request?')) return

        try {
            // Update parent approval status
            const { error: approvalError } = await supabase
                .from('parents')
                .update({ approval_status: 'rejected' })
                .eq('id', parentId)

            if (approvalError) throw approvalError

            // Update request status
            const { error: requestError } = await supabase
                .from('parent_requests')
                .update({
                    status: 'rejected',
                    reviewed_at: new Date().toISOString()
                })
                .eq('id', requestId)

            if (requestError) throw requestError

            fetchParentRequests()
            alert('Parent request rejected')
        } catch (error) {
            console.error('Error rejecting parent:', error)
            alert('Failed to reject parent: ' + error.message)
        }
    }

    const filteredRequests = parentRequests.filter(req => {
        if (filter === 'all') return true
        return req.status === filter
    })

    const stats = {
        total: parentRequests.length,
        pending: parentRequests.filter(r => r.status === 'pending').length,
        approved: parentRequests.filter(r => r.status === 'approved').length,
        rejected: parentRequests.filter(r => r.status === 'rejected').length
    }

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

    // Helper to check validation status
    const getValidationStatus = (request) => {
        if (request.status !== 'pending') return null

        const student = validationData[request.student_roll_no]
        if (!student) {
            return { valid: false, message: 'Roll No Not Found' }
        }
        if (student.grades?.display_name !== request.grade_name) {
            return { valid: false, message: `Grade Mismatch (Actual: ${student.grades?.display_name})` }
        }
        return { valid: true, message: 'Details Match' }
    }

    return (
        <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: '0 0 20px 0' }}>
                Manage Parent Requests
            </h2>

            {/* Warning Banner */}
            <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                padding: '14px 16px',
                borderRadius: '12px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <div>
                    <div style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '14px' }}>CRITICAL: Verify Parent-Student Relationship</div>
                    <div style={{ fontSize: '13px', color: '#991b1b' }}>
                        Only approve requests where you have verified that the parent and student are correctly matched.
                        The system automatically validates Roll Number and Grade, but you must ensure the identity is correct.
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                marginBottom: '24px'
            }}>
                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', borderTop: '4px solid #a855f7' }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#a855f7' }}>{stats.total}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Total Requests</div>
                </div>
                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', borderTop: '4px solid #f59e0b' }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.pending}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Pending</div>
                </div>
                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', borderTop: '4px solid #10b981' }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>{stats.approved}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Approved</div>
                </div>
                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', borderTop: '4px solid #ef4444' }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444' }}>{stats.rejected}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Rejected</div>
                </div>
            </div>

            {/* Student Search Tool */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#111827', margin: '0 0 12px 0' }}>
                    Search Student by Roll Number
                </h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                    <input
                        type="text"
                        value={searchRollNo}
                        onChange={(e) => setSearchRollNo(e.target.value.toUpperCase())}
                        placeholder="e.g., 2024-1-001"
                        style={{
                            flex: 1,
                            padding: '10px 14px',
                            fontSize: '14px',
                            background: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            outline: 'none',
                            color: '#111827'
                        }}
                    />
                    <button
                        onClick={searchStudent}
                        style={{
                            padding: '10px 20px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'white',
                            background: '#a855f7',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#9333ea'}
                        onMouseLeave={(e) => e.target.style.background = '#a855f7'}
                    >
                        Search
                    </button>
                </div>
                {searchResults && (
                    <div style={{
                        padding: '12px',
                        borderRadius: '8px',
                        background: searchResults.found ? '#ecfdf5' : '#fef2f2',
                        border: `1px solid ${searchResults.found ? '#a7f3d0' : '#fecaca'}`
                    }}>
                        {searchResults.found ? (
                            <div>
                                <div style={{ fontWeight: 'bold', color: '#10b981', marginBottom: '4px', fontSize: '14px' }}>
                                    Student Found
                                </div>
                                <div style={{ fontSize: '13px', color: '#111827' }}>
                                    <strong>Name:</strong> {searchResults.student.full_name}<br />
                                    <strong>Roll No:</strong> {searchResults.student.roll_no}<br />
                                    <strong>Grade:</strong> {searchResults.student.grades?.display_name}
                                </div>
                            </div>
                        ) : (
                            <div style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '14px' }}>
                                No student found with this roll number
                            </div>
                        )}
                    </div>
                )}
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
                            textTransform: 'capitalize'
                        }}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Parent Requests List */}
            <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
                {filteredRequests.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '48px 20px',
                        color: '#6b7280'
                    }}>
                        <p style={{ fontSize: '16px' }}>No {filter !== 'all' ? filter : ''} requests found</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {filteredRequests.map((request) => {
                            const validation = getValidationStatus(request)

                            return (
                                <div
                                    key={request.id}
                                    style={{
                                        padding: '16px 20px',
                                        background: '#f9fafb',
                                        borderRadius: '12px',
                                        border: request.status === 'pending' ? '1px solid #f59e0b' : '1px solid #e5e7eb'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'start',
                                        marginBottom: '12px'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                                                {request.parents?.email}
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#6b7280' }}>
                                                Parent Name: {request.parents?.full_name || 'N/A'}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                color: 'white',
                                                background: request.status === 'pending' ? '#f59e0b' :
                                                    request.status === 'approved' ? '#10b981' : '#ef4444',
                                                display: 'inline-block',
                                                marginBottom: '4px'
                                            }}>
                                                {request.status}
                                            </span>
                                            {validation && !validation.valid && (
                                                <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>
                                                    {validation.message}
                                                </div>
                                            )}
                                            {validation && validation.valid && (
                                                <div style={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}>
                                                    {validation.message}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{
                                        background: 'white',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        marginBottom: '12px',
                                        border: '1px solid #e5e7eb'
                                    }}>
                                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                                            Student Details Provided:
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.6' }}>
                                            <strong>Student Name:</strong> {request.student_name}<br />
                                            <strong>Roll Number:</strong> {request.student_roll_no}<br />
                                            <strong>Grade:</strong> {request.grade_name}
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }}>
                                        Requested: {new Date(request.created_at).toLocaleString()}
                                    </div>

                                    {request.status === 'pending' && (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => handleApprove(request)}
                                                disabled={validation && !validation.valid}
                                                style={{
                                                    padding: '8px 16px',
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    color: 'white',
                                                    background: (validation && !validation.valid) ? '#9ca3af' : '#10b981',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: (validation && !validation.valid) ? 'not-allowed' : 'pointer',
                                                    opacity: (validation && !validation.valid) ? 0.5 : 1
                                                }}
                                                title={(validation && !validation.valid) ? validation.message : 'Approve & Link'}
                                            >
                                                {(validation && !validation.valid) ? 'Cannot Approve' : 'Approve & Link'}
                                            </button>
                                            <button
                                                onClick={() => handleReject(request.id, request.parent_id)}
                                                style={{
                                                    padding: '8px 16px',
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
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
