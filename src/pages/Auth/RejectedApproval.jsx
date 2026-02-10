import React from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function RejectedApproval() {
    const { signOut, user } = useAuth()

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #ef5350 0%, #e53935 100%)',
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
                <div style={{ fontSize: '80px', marginBottom: '20px' }}>❌</div>

                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '15px'
                }}>
                    Application Rejected
                </h1>

                <p style={{
                    fontSize: '18px',
                    color: '#666',
                    marginBottom: '10px',
                    lineHeight: '1.6'
                }}>
                    Your teacher application has been rejected by an administrator.
                </p>

                <p style={{
                    fontSize: '16px',
                    color: '#999',
                    marginBottom: '30px',
                    lineHeight: '1.6'
                }}>
                    If you believe this is a mistake, please contact your administrator.
                </p>

                <div style={{
                    background: '#ffebee',
                    border: '2px solid #ef9a9a',
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

                <button
                    onClick={signOut}
                    style={{
                        width: '100%',
                        padding: '14px',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'white',
                        background: 'linear-gradient(135deg, #ef5350 0%, #e53935 100%)',
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

                <p style={{
                    fontSize: '13px',
                    color: '#999',
                    marginTop: '30px',
                    lineHeight: '1.5'
                }}>
                    Contact your administrator for more information about this decision.
                </p>
            </div>
        </div>
    )
}
