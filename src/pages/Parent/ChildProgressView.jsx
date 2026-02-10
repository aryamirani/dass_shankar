import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function ChildProgressView({ child, onBack }) {
    const [progress, setProgress] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        completedCount: 0,
        averageScore: 0,
        totalExercises: 0
    })

    useEffect(() => {
        if (child?.id) {
            fetchProgress()
        }
    }, [child?.id])

    const fetchProgress = async () => {
        try {
            setLoading(true)

            // 1. Fetch total exercises for this child's grade
            const { count: totalExercisesCount, error: countError } = await supabase
                .from('exercises')
                .select(`
                    id,
                    modules!inner (
                        book_id,
                        books!inner (
                            grade_id
                        )
                    )
                `, { count: 'exact', head: true })
                .eq('modules.books.grade_id', child.grade_id)

            if (countError) throw countError

            // 2. Fetch progress data joined with exercise details
            const { data, error } = await supabase
                .from('student_progress')
                .select(`
                    id,
                    score,
                    updated_at,
                    completed,
                    exercise_id,
                    metadata,
                    exercises (
                        name,
                        slug,
                        max_score,
                        modules (
                            id,
                            name
                        )
                    )
                `)
                .eq('student_id', child.id)
                .order('updated_at', { ascending: false })

            if (error) throw error

            setProgress(data || [])

            // Calculate stats
            const totalEx = totalExercisesCount || stats.totalExercises
            if (data && data.length > 0) {
                const completed = data.filter(p => p.completed).length
                const totalScore = data.reduce((acc, curr) => acc + (curr.score || 0), 0)
                setStats({
                    completedCount: completed,
                    averageScore: Math.round(totalScore / data.length),
                    totalExercises: totalEx
                })
            } else {
                setStats(prev => ({
                    ...prev,
                    totalExercises: totalEx
                }))
            }
        } catch (error) {
            console.error('Error fetching student progress:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                <div style={{ fontSize: '20px' }}>Loading progress data...</div>
            </div>
        )
    }

    return (
        <div style={{ color: '#f1f5f9', animation: 'fadeIn 0.5s ease-out' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <button
                    onClick={onBack}
                    style={{
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
                    ← Back
                </button>
                <div>
                    <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>{child.full_name}'s Progress</h2>
                    <p style={{ color: '#94a3b8', margin: '4px 0 0 0' }}>{child.grades?.display_name}</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155', textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Exercises Completed</div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#6366f1' }}>{stats.completedCount}</div>
                </div>
                <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155', textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Average Score</div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981' }}>{stats.averageScore}%</div>
                </div>
                <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155', textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Progress</div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f59e0b' }}>
                        {Math.round((stats.completedCount / stats.totalExercises) * 100)}%
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155', background: 'rgba(255,255,255,0.02)' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Recent Activity</h3>
                </div>

                {progress.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                        <p>No learning activity recorded yet.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', fontSize: '13px' }}>
                                    <th style={{ padding: '16px 24px', fontWeight: '500' }}>Exercise Name</th>
                                    <th style={{ padding: '16px 24px', fontWeight: '500' }}>Module</th>
                                    <th style={{ padding: '16px 24px', fontWeight: '500' }}>Mode</th>
                                    <th style={{ padding: '16px 24px', fontWeight: '500' }}>Completion Date</th>
                                    <th style={{ padding: '16px 24px', fontWeight: '500', textAlign: 'right' }}>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {progress.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #334155', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '16px 24px', fontWeight: '500' }}>{item.exercises?.name || 'Unknown Exercise'}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{
                                                background: 'rgba(99, 102, 241, 0.1)',
                                                color: '#818cf8',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: '600'
                                            }}>
                                                {item.exercises?.modules?.name || 'General'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{
                                                background: item.metadata?.mode === 'test' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                color: item.metadata?.mode === 'test' ? '#f59e0b' : '#10b981',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '11px',
                                                fontWeight: '700',
                                                textTransform: 'uppercase'
                                            }}>
                                                {item.metadata?.mode || 'Learn'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', color: '#94a3b8', fontSize: '14px' }}>
                                            {new Date(item.updated_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <span style={{
                                                color: item.score >= 80 ? '#10b981' : (item.score >= 50 ? '#f59e0b' : '#ef4444'),
                                                fontWeight: 'bold',
                                                fontSize: '16px'
                                            }}>
                                                {item.score}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div >
    )
}
