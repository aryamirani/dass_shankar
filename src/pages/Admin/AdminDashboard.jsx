import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import ManageTeachers from './ManageTeachers'
import ManageParents from './ManageParents'
import ManageStudents from './ManageStudents'

export default function AdminDashboard({ signOut }) {
    const [currentView, setCurrentView] = useState('dashboard')
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

    // Shared header component
    const renderHeader = () => (
        <header style={{
            background: '#111827',
            color: 'white',
            padding: '16px 40px',
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Welcome, Admin</span>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <button
                        style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontWeight: currentView === 'dashboard' ? 'bold' : '500' }}
                        onClick={() => setCurrentView('dashboard')}
                    >
                        Dashboard
                    </button>
                    <button
                        style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontWeight: currentView === 'teachers' ? 'bold' : '500' }}
                        onClick={() => setCurrentView('teachers')}
                    >
                        Teachers
                    </button>
                    <button
                        style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontWeight: currentView === 'students' ? 'bold' : '500' }}
                        onClick={() => setCurrentView('students')}
                    >
                        Students
                    </button>
                    <button
                        style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontWeight: currentView === 'parents' ? 'bold' : '500' }}
                        onClick={() => setCurrentView('parents')}
                    >
                        Parents
                    </button>
                    <button
                        style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontWeight: '500' }}
                        onClick={async () => {
                            if (typeof signOut === 'function') {
                                await signOut();
                            } else {
                                await supabase.auth.signOut();
                            }
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    )

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f3f4f6',
                color: '#6b7280'
            }}>
                <div style={{ fontSize: '20px' }}>Loading Dashboard...</div>
            </div>
        )
    }

    if (currentView === 'teachers') {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f3f4f6', overflow: 'hidden' }}>
                {renderHeader()}
                <div style={{ flex: 1, overflow: 'auto', padding: '24px 40px' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <ManageTeachers />
                    </div>
                </div>
            </div>
        )
    }

    if (currentView === 'parents') {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f3f4f6', overflow: 'hidden' }}>
                {renderHeader()}
                <div style={{ flex: 1, overflow: 'auto', padding: '24px 40px' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <ManageParents />
                    </div>
                </div>
            </div>
        )
    }

    if (currentView === 'students') {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f3f4f6', overflow: 'hidden' }}>
                {renderHeader()}
                <div style={{ flex: 1, overflow: 'auto', padding: '24px 40px' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <ManageStudents />
                    </div>
                </div>
            </div>
        )
    }

    // Main dashboard view
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f3f4f6', fontFamily: '"Inter", "Segoe UI", sans-serif', overflow: 'hidden' }}>
            {renderHeader()}
            <div style={{ flex: 1, overflow: 'auto', padding: '24px 40px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                    {/* Stats Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '24px',
                        marginBottom: '32px'
                    }}>
                        {/* Teachers Card */}
                        <div style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '24px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%'
                        }}>
                            <div>
                                <div style={{ fontSize: '18px', fontWeight: '600', margin: '0' }}>Teachers</div>
                                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Manage platform teachers.</div>
                                <div style={{ fontSize: '36px', fontWeight: '700', marginTop: '16px', marginBottom: '8px', color: '#1f2937' }}>
                                    {stats.teachers}
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                <button
                                    onClick={() => setCurrentView('teachers')}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#10b981',
                                        fontWeight: '600',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        padding: '6px 12px',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                >
                                    Manage Teachers →
                                </button>
                            </div>
                        </div>

                        {/* Students Card */}
                        <div style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '24px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%'
                        }}>
                            <div>
                                <div style={{ fontSize: '18px', fontWeight: '600', margin: '0' }}>Students</div>
                                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Manage platform students.</div>
                                <div style={{ fontSize: '36px', fontWeight: '700', marginTop: '16px', marginBottom: '8px', color: '#1f2937' }}>
                                    {stats.students}
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                <button
                                    onClick={() => setCurrentView('students')}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#10b981',
                                        fontWeight: '600',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        padding: '6px 12px',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                >
                                    Manage Students →
                                </button>
                            </div>
                        </div>

                        {/* Parents Card */}
                        <div style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '24px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%'
                        }}>
                            <div>
                                <div style={{ fontSize: '18px', fontWeight: '600', margin: '0' }}>Parents</div>
                                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Manage platform parents.</div>
                                <div style={{ fontSize: '36px', fontWeight: '700', marginTop: '16px', marginBottom: '8px', color: '#1f2937' }}>
                                    {stats.parents}
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                <button
                                    onClick={() => setCurrentView('parents')}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#10b981',
                                        fontWeight: '600',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        padding: '6px 12px',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                >
                                    Manage Parents →
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
