import React, { useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import PendingApproval from './pages/Auth/PendingApproval'
import RejectedApproval from './pages/Auth/RejectedApproval'
import AdminDashboard from './pages/Admin/AdminDashboard'
import TeacherDashboard from './pages/Teacher/TeacherDashboard'
import ParentDashboard from './pages/Parent/ParentDashboard'
import LearningApp from './LearningApp'

export default function App() {
    const { user, role, approvalStatus, loading, signOut } = useAuth()
    const [authView, setAuthView] = useState('login') // 'login' or 'signup'
    const [selectedStudent, setSelectedStudent] = useState(null)

    if (loading || (user && !role)) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', color: 'white', marginBottom: '10px' }}>
                        {loading ? 'Loading...' : 'Fetching permissions...'}
                    </div>
                </div>
            </div>
        )
    }

    // Not authenticated - show login/signup
    if (!user) {
        if (authView === 'signup') {
            return <Signup onNavigateToLogin={() => setAuthView('login')} />
        }
        return <Login onNavigateToSignup={() => setAuthView('signup')} />
    }

    // If a student is selected (by teacher/admin), show learning app
    if (selectedStudent) {
        return (
            <div>
                <LearningApp
                    studentProfile={selectedStudent}
                    onExit={() => setSelectedStudent(null)}
                />
            </div>
        )
    }

    // Show dashboard based on role
    if (role === 'admin') {
        return (
            <div>
                <div style={{
                    background: '#667eea',
                    color: 'white',
                    padding: '15px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div><strong>Logged in as Admin</strong></div>
                    <button
                        onClick={signOut}
                        style={{
                            padding: '8px 16px',
                            background: 'white',
                            color: '#667eea',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Logout
                    </button>
                </div>
                <AdminDashboard />
            </div>
        )
    }

    if (role === 'teacher') {
        // Check approval status
        if (approvalStatus === 'pending') {
            return <PendingApproval />
        }
        if (approvalStatus === 'rejected') {
            return <RejectedApproval />
        }

        // Approved teacher - show dashboard
        return (
            <div>
                <div style={{
                    background: '#667eea',
                    color: 'white',
                    padding: '15px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div><strong>Logged in as Teacher</strong></div>
                    <button
                        onClick={signOut}
                        style={{
                            padding: '8px 16px',
                            background: 'white',
                            color: '#667eea',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Logout
                    </button>
                </div>
                <TeacherDashboard onSelectStudent={setSelectedStudent} />
            </div>
        )
    }

    if (role === 'parent') {
        return (
            <div>
                <div style={{
                    background: '#f5576c',
                    color: 'white',
                    padding: '15px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div><strong>Logged in as Parent</strong></div>
                    <button
                        onClick={signOut}
                        style={{
                            padding: '8px 16px',
                            background: 'white',
                            color: '#f5576c',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Logout
                    </button>
                </div>
                <ParentDashboard />
            </div>
        )
    }

    return <div>Unknown role</div>
}
