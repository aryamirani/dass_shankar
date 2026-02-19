import React from 'react'

export default function BookOverview({ gradeName, modules, onModuleClick, mode, onModeChange }) {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#fdf8baff', // Light yellow
            color: '#1e293b',
            padding: '40px 20px',
            fontFamily: '"Outfit", sans-serif'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Mode Selector */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '40px',
                    animation: 'fadeInDown 0.8s ease-out'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '6px',
                        borderRadius: '16px',
                        display: 'flex',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <button
                            onClick={() => onModeChange('learn')}
                            style={{
                                padding: '10px 24px',
                                borderRadius: '12px',
                                border: 'none',
                                background: mode === 'learn' ? '#2563eb' : 'transparent',
                                color: mode === 'learn' ? 'white' : '#64748b',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                fontSize: '15px'
                            }}
                        >
                            Practice Mode
                        </button>
                        <button
                            onClick={() => onModeChange('test')}
                            style={{
                                padding: '10px 24px',
                                borderRadius: '12px',
                                border: 'none',
                                background: mode === 'test' ? '#ea580c' : 'transparent',
                                color: mode === 'test' ? 'white' : '#64748b',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                fontSize: '15px'
                            }}
                        >
                            Test Mode
                        </button>
                    </div>
                </div>

                {/* Hero Section */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '60px',
                    animation: 'fadeInDown 0.8s ease-out 0.1s both'
                }}>
                    <h1 style={{
                        fontSize: 'clamp(32px, 8vw, 64px)',
                        fontWeight: 900,
                        margin: 0,
                        color: '#0f172a',
                        letterSpacing: '-0.02em',
                        marginBottom: '16px'
                    }}>
                        {gradeName}
                    </h1>
                    <p style={{
                        fontSize: 'clamp(18px, 4vw, 24px)',
                        color: '#475569',
                        marginTop: '10px',
                        fontWeight: 500,
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        {mode === 'learn'
                            ? 'Master new concepts with immediate feedback and guidance.'
                            : 'Challenge yourself! Complete exercises and see your results at the end.'}
                    </p>
                </div>

                {/* Modules Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '30px',
                    animation: 'fadeInUp 0.8s ease-out 0.2s both'
                }}>
                    {modules.map((module, index) => (
                        <div
                            key={module.id}
                            onClick={() => onModuleClick(module.id)}
                            style={{
                                background: 'white',
                                border: '2px solid #e2e8f0', // Standardized border
                                borderRadius: '24px',
                                padding: '30px',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center', // Centered alignment
                                textAlign: 'center',   // Centered text
                                gap: '20px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)'
                                e.currentTarget.style.borderColor = '#94a3b8' // Darker grey on hover
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.borderColor = '#e2e8f0'
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            {/* Icon Circle */}
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: `${module.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '36px',
                                border: `1px solid ${module.color}30`, // Kept icon styling for distinction
                                marginBottom: '10px'
                            }}>
                                {module.icon}
                            </div>

                            <div>
                                <h3 style={{
                                    fontSize: '24px',
                                    fontWeight: 700,
                                    margin: '0 0 8px 0',
                                    color: '#1e293b'
                                }}>
                                    {module.label}
                                </h3>
                                {/* Description removed */}
                            </div>

                            {/* Start Button */}
                            <div style={{
                                marginTop: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 700,
                                color: '#475569', // Standardized color
                                fontSize: '15px'
                            }}>
                                Start Learning <span>→</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}
