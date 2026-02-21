import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts'

export default function ChildProgressView({ child, onBack }) {
    const [progress, setProgress] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        completedCount: 0,
        averageScore: 0,
        totalExercises: 0
    })
    
    // Analytics State
    const [chartFilter, setChartFilter] = useState('Weekly') // Daily, Weekly, Monthly, Yearly
    const [aggregatedData, setAggregatedData] = useState({
        chartData: [],
        subjectDistribution: [],
        uniqueSubjects: [],
        allProgressData: []
    })
    const [showActivityLog, setShowActivityLog] = useState(false)

    // Pie Chart Colors
    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#0ea5e9', '#ec4899', '#8b5cf6'];

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
                
                // Process Analytics
                aggregateProgress(data)
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

    const aggregateProgress = (data) => {
        // Only count completed exercises for charts
        const completed = data.filter(d => d.completed)

        // Subject Distribution (Pie Chart)
        const subjectsMap = {}
        completed.forEach(item => {
            const subject = item.exercises?.modules?.name || item.exercises?.item_type || 'General'
            subjectsMap[subject] = (subjectsMap[subject] || 0) + 1
        })
        
        const subjectDistribution = Object.keys(subjectsMap).map(key => ({
            name: key,
            value: subjectsMap[key]
        }))

        const uniqueSubjects = Object.keys(subjectsMap)

        setAggregatedData({
            chartData: generateChartData(completed, 'Weekly', uniqueSubjects), // Initial load default
            subjectDistribution,
            uniqueSubjects,
            allProgressData: completed
        })
    }

    const generateChartData = (completedData, filterType, subjects = []) => {
        const map = {}
        const dataKeys = []
        const now = new Date()
        
        if (filterType === 'Daily') {
            const hours = [0, 3, 6, 9, 12, 15, 18, 21]
            hours.forEach(h => {
                const label = h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`
                dataKeys.push(label)
            })
        } else if (filterType === 'Weekly') {
            const startOfWeek = new Date(now)
            startOfWeek.setDate(now.getDate() - now.getDay())
            for (let i = 0; i < 7; i++) {
                const d = new Date(startOfWeek)
                d.setDate(startOfWeek.getDate() + i)
                dataKeys.push(`${d.toLocaleDateString('default', { weekday: 'short' })} ${d.getDate()}`)
            }
        } else if (filterType === 'Monthly') {
            for (let i = 1; i <= 5; i++) {
                dataKeys.push(`Week ${i}`)
            }
        } else if (filterType === 'Yearly') {
            for (let i = 0; i < 12; i++) {
                const d = new Date(now.getFullYear(), i, 1)
                dataKeys.push(d.toLocaleString('default', { month: 'short' }))
            }
        }

        dataKeys.forEach(k => {
            map[k] = {}
            subjects.forEach(s => map[k][s] = 0)
        })

        completedData.forEach(item => {
            const date = new Date(item.updated_at)
            const subject = item.exercises?.modules?.name || item.exercises?.item_type || 'General'
            
            if (date.getFullYear() !== now.getFullYear()) return;
            
            if (filterType === 'Daily' && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()) {
                 const hour = date.getHours()
                 let timeKey;
                 if (hour < 3) timeKey = '12 AM'
                 else if (hour < 6) timeKey = '3 AM'
                 else if (hour < 9) timeKey = '6 AM'
                 else if (hour < 12) timeKey = '9 AM'
                 else if (hour < 15) timeKey = '12 PM'
                 else if (hour < 18) timeKey = '3 PM'
                 else if (hour < 21) timeKey = '6 PM'
                 else timeKey = '9 PM'
                 
                 if (map[timeKey] && map[timeKey][subject] !== undefined) map[timeKey][subject]++
            } else if (filterType === 'Weekly') {
                 const startOfWeek = new Date(now)
                 startOfWeek.setDate(now.getDate() - now.getDay())
                 startOfWeek.setHours(0,0,0,0)
                 const endOfWeek = new Date(startOfWeek)
                 endOfWeek.setDate(startOfWeek.getDate() + 6)
                 endOfWeek.setHours(23,59,59,999)
                 
                 if (date >= startOfWeek && date <= endOfWeek) {
                     const dayKey = `${date.toLocaleDateString('default', { weekday: 'short' })} ${date.getDate()}`
                     if (map[dayKey] && map[dayKey][subject] !== undefined) map[dayKey][subject]++
                 }
            } else if (filterType === 'Monthly' && date.getMonth() === now.getMonth()) {
                const weekNum = Math.ceil(date.getDate() / 7)
                const weekKey = `Week ${weekNum > 5 ? 5 : weekNum}`
                if (map[weekKey] && map[weekKey][subject] !== undefined) map[weekKey][subject]++
            } else if (filterType === 'Yearly') {
                const monthKey = date.toLocaleString('default', { month: 'short' })
                if (map[monthKey] && map[monthKey][subject] !== undefined) map[monthKey][subject]++
            }
        })

        return dataKeys.map(key => ({ name: key, ...map[key] }))
    }

    const handleFilterChange = (e) => {
        const filter = e.target.value;
        setChartFilter(filter);
        setAggregatedData(prev => ({
            ...prev,
            chartData: generateChartData(prev.allProgressData, filter, prev.uniqueSubjects)
        }))
    }
    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                <div style={{ fontSize: '20px' }}>Loading progress data...</div>
            </div>
        )
    }

    if (showActivityLog) {
        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', color: '#111827', animation: 'fadeIn 0.5s ease-out' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px', flexShrink: 0 }}>
                    <button
                        onClick={() => setShowActivityLog(false)}
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
                            transition: 'all 0.2s ease',
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
                        Back to Charts
                    </button>
                    <div>
                        <h2 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 4px 0', color: '#111827', letterSpacing: '-0.025em' }}>
                            Recent Activity Log
                        </h2>
                    </div>
                </div>

                {/* Detailed Table */}
                <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '20px', border: '1px solid rgba(229, 231, 235, 0.5)', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02), 0 4px 6px -2px rgba(0,0,0,0.01)' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', background: '#ffffff', flexShrink: 0 }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#111827', letterSpacing: '-0.01em' }}>All Completed Exercises</h3>
                    </div>

                    {progress.length === 0 ? (
                        <div style={{ padding: '80px 40px', textAlign: 'center', color: '#6b7280', flex: 1, overflowY: 'auto' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px', opacity: 0.5 }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            <p style={{ fontSize: '16px', fontWeight: '500' }}>No learning activity recorded yet.</p>
                            <p style={{ fontSize: '14px', marginTop: '8px' }}>Complete exercises and modules to see them appear here.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
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
            </div>
        )
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', color: '#111827', animation: 'fadeIn 0.5s ease-out' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexShrink: 0 }}>
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

                <button
                    onClick={() => setShowActivityLog(true)}
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
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        fontWeight: '600',
                        fontSize: '14px'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = '#f9fafb'
                        e.target.style.borderColor = '#d1d5db'
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = '#ffffff'
                        e.target.style.borderColor = '#e5e7eb'
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    Activity Log
                </button>
            </div>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px', flexShrink: 0 }}>
                <div style={{ background: '#ffffff', padding: '20px 24px', borderRadius: '20px', border: '1px solid rgba(229, 231, 235, 0.5)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02), 0 4px 6px -2px rgba(0,0,0,0.01)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                
                <div style={{ background: '#ffffff', padding: '20px 24px', borderRadius: '20px', border: '1px solid rgba(229, 231, 235, 0.5)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02), 0 4px 6px -2px rgba(0,0,0,0.01)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                
                <div style={{ background: '#ffffff', padding: '20px 24px', borderRadius: '20px', border: '1px solid rgba(229, 231, 235, 0.5)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02), 0 4px 6px -2px rgba(0,0,0,0.01)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
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

            {/* Analytics Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '20px', flex: 1, minHeight: 0 }}>
                {/* Bar Chart: Learning Activity */}
                <div style={{ background: '#ffffff', padding: '20px 24px', borderRadius: '20px', border: '1px solid rgba(229, 231, 235, 0.5)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02), 0 4px 6px -2px rgba(0,0,0,0.01)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                        <div>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700', color: '#111827' }}>Learning Activity</h3>
                            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Exercises completed over time.</p>
                        </div>
                        <select 
                            value={chartFilter} 
                            onChange={handleFilterChange}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                background: '#f9fafb',
                                color: '#374151',
                                fontSize: '13px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                outline: 'none'
                            }}
                        >
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Yearly">Yearly</option>
                        </select>
                    </div>
                    
                    <div style={{ width: '100%', height: '100%', flex: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={aggregatedData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} allowDecimals={false} />
                                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{fontSize: '12px', paddingBottom: '20px'}}/>
                                {aggregatedData.uniqueSubjects.map((subject, idx) => (
                                    <Bar 
                                        key={subject} 
                                        dataKey={subject} 
                                        stackId="a" 
                                        fill={COLORS[idx % COLORS.length]} 
                                        radius={[4, 4, 0, 0]} 
                                        barSize={32} 
                                    />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: Subject Focus */}
                <div style={{ background: '#ffffff', padding: '20px 24px', borderRadius: '20px', border: '1px solid rgba(229, 231, 235, 0.5)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02), 0 4px 6px -2px rgba(0,0,0,0.01)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700', color: '#111827' }}>Subject Focus</h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Distribution of learning.</p>
                    </div>
                    
                    <div style={{ width: '100%', height: '100%', position: 'relative', flex: 1, minHeight: 0 }}>
                        {aggregatedData.subjectDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={aggregatedData.subjectDistribution}
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {aggregatedData.subjectDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '20px'}}/>
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '14px' }}>
                                No subject data yet
                            </div>
                        )}
                            
                        {aggregatedData.subjectDistribution.length > 0 && (
                            <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <div style={{ fontSize: '28px', fontWeight: '800', color: '#111827' }}>{stats.completedCount}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '-4px' }}>Total</div>
                            </div>
                        )}
                    </div>
                </div>
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
