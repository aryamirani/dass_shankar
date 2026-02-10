import React from 'react'

export default function BookOverview({ gradeName, modules, onModuleClick, mode, onModeChange }) {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f172a',
            color: '#f1f5f9',
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
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '6px',
                        borderRadius: '16px',
                        display: 'flex',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }}>
                        <button
                            onClick={() => onModeChange('learn')}
                            style={{
                                padding: '10px 24px',
                                borderRadius: '12px',
                                border: 'none',
                                background: mode === 'learn' ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' : 'transparent',
                                color: mode === 'learn' ? 'white' : '#94a3b8',
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
                                background: mode === 'test' ? 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)' : 'transparent',
                                color: mode === 'test' ? 'white' : '#94a3b8',
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
                        background: 'linear-gradient(135deg, #60a5fa 0%, #c084fc 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.02em'
                    }}>
                        {gradeName}
                    </h1>
                    <p style={{
                        fontSize: 'clamp(18px, 4vw, 24px)',
                        color: '#94a3b8',
                        marginTop: '10px',
                        fontWeight: 500
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
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '24px',
                                padding: '30px',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)'
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                                e.currentTarget.style.borderColor = module.color
                                e.currentTarget.style.boxShadow = `0 20px 40px -15px ${module.color}33`
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                                e.currentTarget.style.boxShadow = 'none'
                            }}
                        >
                            {/* Icon Circle */}
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '18px',
                                background: `${module.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '32px',
                                border: `1px solid ${module.color}33`
                            }}>
                                {module.icon}
                            </div>

                            <div>
                                <h3 style={{
                                    fontSize: '24px',
                                    fontWeight: 700,
                                    margin: '0 0 8px 0',
                                    color: '#f8fafc'
                                }}>
                                    {module.label}
                                </h3>
                                <p style={{
                                    fontSize: '15px',
                                    color: '#94a3b8',
                                    margin: 0,
                                    lineHeight: 1.5
                                }}>
                                    {module.description}
                                </p>
                            </div>

                            {/* Start Button */}
                            <div style={{
                                marginTop: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 600,
                                color: module.color,
                                fontSize: '15px'
                            }}>
                                Start Learning <span>→</span>
                            </div>

                            {/* Decorative Background Blob */}
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                width: '100px',
                                height: '100px',
                                background: module.color,
                                filter: 'blur(50px)',
                                opacity: 0.1,
                                pointerEvents: 'none'
                            }} />
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
