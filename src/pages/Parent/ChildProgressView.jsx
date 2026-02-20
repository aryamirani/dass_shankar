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
                    module:modules!inner (
                        book:books!inner (
                            grade:grades!inner (
                                id
                            )
                        )
                    )
                `, { count: 'exact', head: true })
                .eq('module.book.grade.id', child.grade_id)

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
        <div style={{ color: '#111827', animation: 'fadeIn 0.5s ease-out' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <button
                        onClick={onBack}
                        style={{
                            background: '#ffffff',
                            border: '1px solid #e5e7eb',
                            color: '#374151',
                            padding: '10px 16px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2sease',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            fontWeight: '600',
                            fontSize: '14px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#f9fafb'
                            e.target.style.borderColor = '#d1d5db'
                            e.target.style.color = '#111827'
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#ffffff'
                            e.target.style.borderColor = '#e5e7eb'
                            e.target.style.color = '#374151'
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        Back
                    </button>
                    <div>
                        <h2 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 4px 0', color: '#111827', letterSpacing: '-0.025em' }}>
                            {child.full_name}'s Progress
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#6b7280', fontSize: '15px', fontWeight: '500' }}>{child.grades?.display_name}</span>
                            <span style={{ color: '#d1d5db' }}>•</span>
                            <span style={{ color: '#6b7280', fontSize: '15px' }}>Roll: {child.roll_no}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div style={{ background: '#ffffff', padding: '28px', borderRadius: '24px', border: '1px solid rgba(229, 231, 235, 0.5)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02), 0 4px 6px -2px rgba(0,0,0,0.01)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6b7280' }}>
                        <div style={{ display: 'flex', padding: '8px', background: '#d1fae5', color: '#059669', borderRadius: '12px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Exercises Completed</span>
                    </div>
                    <div style={{ fontSize: '42px', fontWeight: '800', color: '#111827', letterSpacing: '-0.025em' }}>
                        {stats.completedCount}
                    </div>
                </div>
                
                <div style={{ background: '#ffffff', padding: '28px', borderRadius: '24px', border: '1px solid rgba(229, 231, 235, 0.5)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02), 0 4px 6px -2px rgba(0,0,0,0.01)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6b7280' }}>
                        <div style={{ display: 'flex', padding: '8px', background: '#fef3c7', color: '#d97706', borderRadius: '12px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Average Score</span>
                    </div>
                    <div style={{ fontSize: '42px', fontWeight: '800', color: stats.averageScore >= 80 ? '#10b981' : (stats.averageScore >= 50 ? '#f59e0b' : '#ef4444'), letterSpacing: '-0.025em' }}>
                        {stats.averageScore}%
                    </div>
                </div>
                
                <div style={{ background: '#ffffff', padding: '28px', borderRadius: '24px', border: '1px solid rgba(229, 231, 235, 0.5)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02), 0 4px 6px -2px rgba(0,0,0,0.01)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6b7280' }}>
                        <div style={{ display: 'flex', padding: '8px', background: '#ccfbf1', color: '#0d9488', borderRadius: '12px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Overall Progress</span>
                    </div>
                    <div style={{ fontSize: '42px', fontWeight: '800', color: '#0d9488', letterSpacing: '-0.025em' }}>
                        {Math.round((stats.completedCount / stats.totalExercises) * 100) || 0}%
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid rgba(229, 231, 235, 0.5)', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02), 0 4px 6px -2px rgba(0,0,0,0.01)' }}>
                <div style={{ padding: '24px 32px', borderBottom: '1px solid #f3f4f6', background: '#ffffff' }}>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#111827', letterSpacing: '-0.01em' }}>Recent Activity</h3>
                </div>

                {progress.length === 0 ? (
                    <div style={{ padding: '80px 40px', textAlign: 'center', color: '#6b7280' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px', opacity: 0.5 }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        <p style={{ fontSize: '16px', fontWeight: '500' }}>No learning activity recorded yet.</p>
                        <p style={{ fontSize: '14px', marginTop: '8px' }}>Complete exercises and modules to see them appear here.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontSize: '13px', background: '#f9fafb' }}>
                                    <th style={{ padding: '16px 32px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Exercise Name</th>
                                    <th style={{ padding: '16px 24px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Module</th>
                                    <th style={{ padding: '16px 24px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mode</th>
                                    <th style={{ padding: '16px 24px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                                    <th style={{ padding: '16px 32px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {progress.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'all 0.2s', background: 'white' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                                        <td style={{ padding: '20px 32px', fontWeight: '600', color: '#111827', fontSize: '15px' }}>{item.exercises?.name || 'Unknown Exercise'}</td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <span style={{
                                                background: '#ffe4e6',
                                                color: '#e11d48',
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                display: 'inline-block'
                                            }}>
                                                {item.exercises?.modules?.name || item.exercises?.item_type || 'General'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <span style={{
                                                background: item.metadata?.mode === 'test' ? '#fef3c7' : '#dcfce7',
                                                color: item.metadata?.mode === 'test' ? '#b45309' : '#15803d',
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                display: 'inline-block'
                                            }}>
                                                {item.metadata?.mode || 'Learn'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px 24px', color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>
                                            {new Date(item.updated_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '48px' }}>
                                                <span style={{
                                                    color: item.score >= 80 ? '#10b981' : (item.score >= 50 ? '#f59e0b' : '#ef4444'),
                                                    fontWeight: '800',
                                                    fontSize: '18px'
                                                }}>
                                                    {item.score}%
                                                </span>
                                            </div>
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
