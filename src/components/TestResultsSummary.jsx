import React from 'react'

export default function TestResultsSummary({ results, onBackToOverview, totalExpectedCount }) {
    const totalPossible = (totalExpectedCount || results.length) * 100
    const totalScore = results.reduce((acc, curr) => acc + (curr.score || 0), 0)
    const percentage = Math.round((totalScore / totalPossible) * 100)

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f172a',
            color: '#f1f5f9',
            padding: '40px 20px',
            fontFamily: '"Outfit", sans-serif'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '10px' }}>Test Results</h1>
                    <div style={{
                        fontSize: '72px',
                        fontWeight: 900,
                        color: percentage >= 70 ? '#4CAF50' : percentage >= 40 ? '#f59e0b' : '#ef4444'
                    }}>
                        {percentage}%
                    </div>
                </div>

                {/* Score Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
                        <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Total Score</div>
                        <div style={{ fontSize: '32px', fontWeight: 700 }}>{totalScore} / {totalPossible}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
                        <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Exercises</div>
                        <div style={{ fontSize: '32px', fontWeight: 700 }}>{results.length}</div>
                    </div>
                </div>

                {/* Detailed Breakdown */}
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>What happened?</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {results.map((res, i) => (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '24px',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <div style={{ fontSize: '18px', fontWeight: 600 }}>Exercise: {res.id}</div>
                                <div style={{
                                    padding: '4px 12px',
                                    borderRadius: '99px',
                                    background: res.score >= 100 ? '#4CAF5033' : '#ef444433',
                                    color: res.score >= 100 ? '#4CAF50' : '#ef4444',
                                    fontSize: '14px',
                                    fontWeight: 700
                                }}>
                                    {res.score}/100
                                </div>
                            </div>

                            {res.metadata?.answers && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {res.metadata.answers.map((ans, j) => (
                                        <div key={j} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '12px',
                                            background: ans.status === 'correct' ? '#4CAF5011' : '#ef444411',
                                            borderRadius: '8px',
                                            border: ans.status === 'correct' ? '1px solid #4CAF5033' : '1px solid #ef444433'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '14px', color: '#94a3b8' }}>{ans.question}</div>
                                                <div style={{ fontWeight: 600 }}>Your Answer: {ans.user}</div>
                                            </div>
                                            {ans.status === 'wrong' && (
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '14px', color: '#4CAF50' }}>Correct Answer</div>
                                                    <div style={{ fontWeight: 700, color: '#4CAF50' }}>{ans.correct}</div>
                                                </div>
                                            )}
                                            <div style={{ fontSize: '20px' }}>
                                                {ans.status === 'correct' ? '✓' : '✗'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={onBackToOverview}
                    style={{
                        width: '100%',
                        marginTop: '40px',
                        padding: '18px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                        color: 'white',
                        border: 'none',
                        fontSize: '18px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
                >
                    Back to Learning
                </button>
            </div>
        </div>
    )
}
