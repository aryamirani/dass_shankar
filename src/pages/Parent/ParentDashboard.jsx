import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import ProfileSettings from '../../components/ProfileSettings'
import ChildProgressView from './ChildProgressView'

export default function ParentDashboard({ onSelectStudent }) {
    const { user } = useAuth()
    const [children, setChildren] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentView, setCurrentView] = useState('dashboard') // 'dashboard', 'profile'
    const [selectedChild, setSelectedChild] = useState(null)

    useEffect(() => {
        if (user) {
            fetchChildren()
        }
    }, [user])

    const fetchChildren = async () => {
        try {
            // 1. Get the actual parent_id from the parents table using the auth user.id
            const { data: parentData, error: parentError } = await supabase
                .from('parents')
                .select('id')
                .eq('user_id', user.id)
                .single()

            if (parentError) throw parentError
            if (!parentData) {
                console.error("No parent profile found for user")
                setLoading(false)
                return
            }

            // 2. Use the parent_id to fetch linked students
            const { data, error } = await supabase
                .from('parent_students')
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
                .eq('parent_id', parentData.id)

            if (error) throw error
            setChildren(data?.map(ps => ps.students) || [])
        } catch (error) {
            console.error('Error fetching children:', error)
        } finally {
            setLoading(false)
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
                    <ProfileSettings role="parent" />
                </div>
            </div>
        )
    }

    if (selectedChild) {
        return (
            <div style={{ minHeight: '100vh', background: '#0f172a', padding: '40px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <ChildProgressView
                        child={selectedChild}
                        onBack={() => setSelectedChild(null)}
                    />
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#f1f5f9', margin: 0 }}>
                        👨‍👩‍👧 Parent Dashboard
                    </h1>
                    <button
                        onClick={() => setCurrentView('profile')}
                        style={{
                            padding: '10px 20px',
                            background: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#f1f5f9',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        👤 My Profile
                    </button>
                </div>

                {children.length === 0 ? (
                    <div style={{
                        background: '#1e293b',
                        borderRadius: '16px',
                        padding: '60px 30px',
                        textAlign: 'center',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        border: '1px solid #334155'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>👶</div>
                        <p style={{ fontSize: '18px', color: '#94a3b8' }}>
                            No children linked yet. Please contact an administrator to link your child's account.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {children.map((child) => (
                            <div
                                key={child.id}
                                style={{
                                    background: '#1e293b',
                                    borderRadius: '16px',
                                    padding: '30px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    border: '1px solid #334155'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '20px',
                                    flexDirection: window.innerWidth < 640 ? 'column' : 'row',
                                    gap: window.innerWidth < 640 ? '15px' : '0'
                                }}>
                                    <div style={{ textAlign: window.innerWidth < 640 ? 'center' : 'left' }}>
                                        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '5px' }}>
                                            {child.full_name}
                                        </h2>
                                        <p style={{ fontSize: '16px', color: '#94a3b8' }}>
                                            {child.grades?.display_name || 'Unknown Grade'}
                                        </p>
                                    </div>
                                    <div style={{
                                        background: '#334155',
                                        borderRadius: '50%',
                                        width: '80px',
                                        height: '80px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '36px',
                                        border: '1px solid #475569'
                                    }}>
                                        👶
                                    </div>
                                </div>

                                <div style={{
                                    background: '#0f172a',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    marginTop: '20px',
                                    border: '1px solid #334155'
                                }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#f1f5f9', marginBottom: '15px' }}>
                                        Progress Overview
                                    </h3>
                                    <p style={{ fontSize: '14px', color: '#94a3b8' }}>
                                        View detailed progress by clicking "View Details" below
                                    </p>
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                        <button
                                            onClick={() => setSelectedChild(child)}
                                            style={{
                                                marginTop: '15px',
                                                padding: '12px 24px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: 'white',
                                                background: '#667eea',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                flex: window.innerWidth < 640 ? 1 : 'none'
                                            }}
                                        >
                                            View Details →
                                        </button>
                                        <button
                                            onClick={() => onSelectStudent(child)}
                                            style={{
                                                marginTop: '15px',
                                                padding: '12px 24px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: 'white',
                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                flex: window.innerWidth < 640 ? 1 : 'none'
                                            }}
                                        >
                                            Explore Modules 🚀
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
