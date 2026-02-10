import React from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function PendingApproval() {
    const { signOut, user } = useAuth()

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '60px 40px',
                maxWidth: '550px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '80px', marginBottom: '20px' }}>⏳</div>

                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '15px'
                }}>
                    Pending Approval
                </h1>

                <p style={{
                    fontSize: '18px',
                    color: '#666',
                    marginBottom: '10px',
                    lineHeight: '1.6'
                }}>
                    Your teacher account is waiting for admin approval.
                </p>

                <p style={{
                    fontSize: '16px',
                    color: '#999',
                    marginBottom: '30px',
                    lineHeight: '1.6'
                }}>
                    You'll receive access once an administrator reviews and approves your application.
                </p>

                <div style={{
                    background: '#fff3e0',
                    border: '2px solid #ffb74d',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '30px',
                    textAlign: 'left'
                }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                        <strong>Account Email:</strong>
                    </div>
                    <div style={{ fontSize: '16px', color: '#333', fontWeight: '600' }}>
                        {user?.email}
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }}>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '14px',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'white',
                            background: 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        🔄 Check Approval Status
                    </button>

                    <button
                        onClick={signOut}
                        style={{
                            padding: '14px',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#666',
                            background: '#f5f5f5',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        Sign Out
                    </button>
                </div>

                <p style={{
                    fontSize: '13px',
                    color: '#999',
                    marginTop: '30px',
                    lineHeight: '1.5'
                }}>
                    If you have questions, please contact your administrator.
                </p>
            </div>
        </div>
    )
}
