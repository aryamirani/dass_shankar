import React from 'react'

export default function ArtsOverview({ onBack }) {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                maxWidth: '600px',
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                padding: '40px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎨</div>
                <h1 style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#e91e63',
                    marginBottom: '16px'
                }}>
                    Arts Module
                </h1>
                <p style={{
                    fontSize: '18px',
                    color: '#666',
                    marginBottom: '30px',
                    lineHeight: '1.6'
                }}>
                    Creative arts and crafts activities coming soon!
                </p>
                <div style={{
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '24px',
                    marginTop: '24px'
                }}>
                    <p style={{ fontSize: '16px', color: '#888', margin: 0 }}>
                        This module is currently under development. Check back soon for exciting art activities!
                    </p>
                </div>
            </div>
        </div>
    )
}
