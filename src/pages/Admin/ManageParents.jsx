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

        if (!confirm(`⚠️ CRITICAL WARNING ⚠️\n\nYou are about to link ${request.parents?.full_name} to student ${request.student_name} (${request.student_roll_no}).\n\nPlease confirm that you have personally verified this relationship.\n\nAre you sure you want to proceed?`)) {
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
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div style={{ fontSize: '24px', color: 'white' }}>Loading...</div>
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
        <div style={{
            background: '#0f172a',
            padding: '20px 0',
            minHeight: '100vh',
            color: '#f1f5f9'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '40px' }}>
                    👨‍👩‍👧 Manage Parent Requests
                </h1>

                {/* Warning Banner */}
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid #ef4444',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <span style={{ fontSize: '24px' }}>⚠️</span>
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '16px' }}>CRITICAL: Verify Parent-Student Relationship</div>
                        <div style={{ fontSize: '14px', color: '#fca5a5' }}>
                            Only approve requests where you have verified that the parent and student are correctly matched.
                            The system now automatically validates Roll Number and Grade, but you must ensure the identity is correct.
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                }}>
                    <div style={{
                        background: '#1e293b',
                        borderRadius: '16px',
                        padding: '20px',
                        border: '1px solid #334155'
                    }}>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>{stats.total}</div>
                        <div style={{ fontSize: '14px', color: '#94a3b8' }}>Total Requests</div>
                    </div>
                    <div style={{
                        background: '#1e293b',
                        borderRadius: '16px',
                        padding: '20px',
                        border: '1px solid #334155'
                    }}>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff9800' }}>{stats.pending}</div>
                        <div style={{ fontSize: '14px', color: '#94a3b8' }}>Pending</div>
                    </div>
                    <div style={{
                        background: '#1e293b',
                        borderRadius: '16px',
                        padding: '20px',
                        border: '1px solid #334155'
                    }}>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4caf50' }}>{stats.approved}</div>
                        <div style={{ fontSize: '14px', color: '#94a3b8' }}>Approved</div>
                    </div>
                    <div style={{
                        background: '#1e293b',
                        borderRadius: '16px',
                        padding: '20px',
                        border: '1px solid #334155'
                    }}>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f44336' }}>{stats.rejected}</div>
                        <div style={{ fontSize: '14px', color: '#94a3b8' }}>Rejected</div>
                    </div>
                </div>

                {/* Student Search Tool */}
                <div style={{
                    background: '#1e293b',
                    borderRadius: '16px',
                    padding: '25px',
                    marginBottom: '30px',
                    border: '1px solid #334155'
                }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#f1f5f9' }}>
                        🔍 Search Student by Roll Number
                    </h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <input
                            type="text"
                            value={searchRollNo}
                            onChange={(e) => setSearchRollNo(e.target.value.toUpperCase())}
                            placeholder="e.g., 2024-1-001"
                            style={{
                                flex: 1,
                                padding: '12px',
                                fontSize: '14px',
                                background: '#0f172a',
                                border: '1px solid #334155',
                                borderRadius: '8px',
                                outline: 'none',
                                color: '#f1f5f9'
                            }}
                        />
                        <button
                            onClick={searchStudent}
                            style={{
                                padding: '12px 24px',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: 'white',
                                background: '#667eea',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Search
                        </button>
                    </div>
                    {searchResults && (
                        <div style={{
                            padding: '15px',
                            borderRadius: '8px',
                            background: searchResults.found ? 'rgba(76, 175, 80, 0.1)' : 'rgba(239, 83, 80, 0.1)',
                            border: `1px solid ${searchResults.found ? '#4caf50' : '#f44336'}`
                        }}>
                            {searchResults.found ? (
                                <div>
                                    <div style={{ fontWeight: 'bold', color: '#4caf50', marginBottom: '5px' }}>
                                        ✓ Student Found
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#f1f5f9' }}>
                                        <strong>Name:</strong> {searchResults.student.full_name}<br />
                                        <strong>Roll No:</strong> {searchResults.student.roll_no}<br />
                                        <strong>Grade:</strong> {searchResults.student.grades?.display_name}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ fontWeight: 'bold', color: '#ef5350' }}>
                                    ✗ No student found with this roll number
                                </div>
                            )}
                        </div>
                    )}
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
                                padding: '10px 20px',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: filter === status ? 'white' : '#94a3b8',
                                background: filter === status ? '#667eea' : '#1e293b',
                                border: filter === status ? 'none' : '1px solid #334155',
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
                    background: '#1e293b',
                    borderRadius: '16px',
                    padding: '30px',
                    border: '1px solid #334155'
                }}>
                    {filteredRequests.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#94a3b8'
                        }}>
                            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📭</div>
                            <p style={{ fontSize: '18px' }}>No {filter !== 'all' ? filter : ''} requests found</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {filteredRequests.map((request) => {
                                const validation = getValidationStatus(request)

                                return (
                                    <div
                                        key={request.id}
                                        style={{
                                            padding: '20px',
                                            background: '#0f172a',
                                            borderRadius: '12px',
                                            border: request.status === 'pending' ? '1px solid #ff9800' : '1px solid #334155'
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'start',
                                            marginBottom: '15px',
                                            flexDirection: window.innerWidth < 640 ? 'column' : 'row',
                                            gap: window.innerWidth < 640 ? '10px' : '0'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '18px', fontWeight: '600', color: '#f1f5f9', marginBottom: '5px' }}>
                                                    {request.parents?.email}
                                                </div>
                                                <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                                                    Parent Name: {request.parents?.full_name || 'N/A'}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    color: 'white',
                                                    background: request.status === 'pending' ? '#ff9800' :
                                                        request.status === 'approved' ? '#4caf50' : '#f44336',
                                                    display: 'inline-block',
                                                    marginBottom: '5px'
                                                }}>
                                                    {request.status}
                                                </span>
                                                {validation && !validation.valid && (
                                                    <div style={{ color: '#ef5350', fontSize: '12px', fontWeight: 'bold' }}>
                                                        ⚠ {validation.message}
                                                    </div>
                                                )}
                                                {validation && validation.valid && (
                                                    <div style={{ color: '#4caf50', fontSize: '12px', fontWeight: 'bold' }}>
                                                        ✓ {validation.message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{
                                            background: '#1e293b',
                                            padding: '15px',
                                            borderRadius: '8px',
                                            marginBottom: '15px',
                                            border: '1px solid #334155'
                                        }}>
                                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#667eea', marginBottom: '10px' }}>
                                                📚 Student Details Provided:
                                            </div>
                                            <div style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6' }}>
                                                <strong>Student Name:</strong> {request.student_name}<br />
                                                <strong>Roll Number:</strong> {request.student_roll_no}<br />
                                                <strong>Grade:</strong> {request.grade_name}
                                            </div>
                                        </div>

                                        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '15px' }}>
                                            Requested: {new Date(request.created_at).toLocaleString()}
                                        </div>

                                        {request.status === 'pending' && (
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button
                                                    onClick={() => handleApprove(request)}
                                                    disabled={validation && !validation.valid}
                                                    style={{
                                                        padding: '10px 20px',
                                                        fontSize: '14px',
                                                        fontWeight: '600',
                                                        color: 'white',
                                                        background: (validation && !validation.valid) ? '#94a3b8' : '#4caf50',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: (validation && !validation.valid) ? 'not-allowed' : 'pointer',
                                                        opacity: (validation && !validation.valid) ? 0.5 : 1
                                                    }}
                                                    title={(validation && !validation.valid) ? validation.message : 'Approve & Link'}
                                                >
                                                    {(validation && !validation.valid) ? 'Cannot Approve' : '✓ Approve & Link'}
                                                </button>
                                                <button
                                                    onClick={() => handleReject(request.id, request.parent_id)}
                                                    style={{
                                                        padding: '10px 20px',
                                                        fontSize: '14px',
                                                        fontWeight: '600',
                                                        color: 'white',
                                                        background: '#f44336',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    ✗ Reject
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
        </div>
    )
}
