import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import ManageTeachers from './ManageTeachers'
import ManageParents from './ManageParents'
import ManageStudents from './ManageStudents'

export default function AdminDashboard() {
    const [currentView, setCurrentView] = useState('dashboard') // 'dashboard', 'teachers', 'parents', 'students', 'profile'
    const [stats, setStats] = useState({
        teachers: 0,
        students: 0,
        parents: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const [teachersRes, studentsRes, parentsRes] = await Promise.all([
                supabase.from('teachers').select('id', { count: 'exact', head: true }),
                supabase.from('students').select('id', { count: 'exact', head: true }),
                supabase.from('parents').select('id', { count: 'exact', head: true })
            ])

            setStats({
                teachers: teachersRes.count || 0,
                students: studentsRes.count || 0,
                parents: parentsRes.count || 0
            })
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
        }
    }

    // Navigation wrapper to ensure consistent styling for sub-pages
    const renderContent = () => {
        if (currentView === 'teachers') {
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
                        <ManageTeachers />
                    </div>
                </div>
            )
        }

        if (currentView === 'parents') {
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
                        <ManageParents />
                    </div>
                </div>
            )
        }

        if (currentView === 'students') {
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
                        <ManageStudents />
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
                    <h1 style={{
                        fontSize: '42px',
                        fontWeight: 'bold',
                        color: '#f1f5f9',
                        marginBottom: '40px'
                    }}>
                        🛡️ Admin Dashboard
                    </h1>

                    {/* Stats Grid */}
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
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>👨‍🏫</div>
                            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea', marginBottom: '5px' }}>
                                {stats.teachers}
                            </div>
                            <div style={{ fontSize: '16px', color: '#94a3b8' }}>Total Teachers</div>
                            <button
                                onClick={() => setCurrentView('teachers')}
                                style={{
                                    marginTop: '20px',
                                    padding: '12px 24px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: 'white',
                                    background: '#667eea',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    width: '100%',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#5a67d8'}
                                onMouseLeave={(e) => e.target.style.background = '#667eea'}
                            >
                                Manage Teachers →
                            </button>
                        </div>

                        <div style={{
                            background: '#1e293b',
                            borderRadius: '16px',
                            padding: '30px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            border: '1px solid #334155'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>👨‍🎓</div>
                            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f687b3', marginBottom: '5px' }}>
                                {stats.students}
                            </div>
                            <div style={{ fontSize: '16px', color: '#94a3b8' }}>Total Students</div>
                            <button
                                onClick={() => setCurrentView('students')}
                                style={{
                                    marginTop: '20px',
                                    padding: '12px 24px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: 'white',
                                    background: '#f687b3',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    width: '100%',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#ed64a6'}
                                onMouseLeave={(e) => e.target.style.background = '#f687b3'}
                            >
                                View Students →
                            </button>
                        </div>

                        <div style={{
                            background: '#1e293b',
                            borderRadius: '16px',
                            padding: '30px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            border: '1px solid #334155'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>👨‍👩‍👧</div>
                            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4fd1c5', marginBottom: '5px' }}>
                                {stats.parents}
                            </div>
                            <div style={{ fontSize: '16px', color: '#94a3b8' }}>Total Parents</div>
                            <button
                                onClick={() => setCurrentView('parents')}
                                style={{
                                    marginTop: '20px',
                                    padding: '12px 24px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: 'white',
                                    background: '#4fd1c5',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    width: '100%',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#38b2ac'}
                                onMouseLeave={(e) => e.target.style.background = '#4fd1c5'}
                            >
                                Manage Parents →
                            </button>
                        </div>
                    </div>


                </div>
            </div>
        )
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

    return renderContent()
}
