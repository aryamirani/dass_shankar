import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import ProfileSettings from '../../components/ProfileSettings'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts'
import {
    LayoutDashboard, FileText, BarChart2, Layers, Calendar, MessageSquare,
    Mic, Plus
} from 'lucide-react'
import './ParentDashboard.css'

export default function ParentDashboard({ onSelectStudent }) {
    const { user } = useAuth()
    const [children, setChildren] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentView, setCurrentView] = useState('dashboard') // 'dashboard', 'profile'
    const [isDarkMode, setIsDarkMode] = useState(false)
    
    const [chartFilter, setChartFilter] = useState('Weekly') // Daily, Weekly, Monthly, Yearly
    const [aggregatedData, setAggregatedData] = useState({
        totalCompleted: 0,
        chartData: [],
        subjectDistribution: [],
        recentActivity: [],
        allProgressData: [],
        uniqueSubjects: []
    })

    useEffect(() => {
        if (user) {
            fetchDashboardData()
        }
    }, [user])

    const fetchDashboardData = async () => {
        setLoading(true)
        try {
            // 1. Fetch parent profile and linked children
            const { data: parentData, error: parentError } = await supabase
                .from('parents')
                .select('id')
                .eq('user_id', user.id)
                .single()

            if (parentError) throw parentError

            const { data: childrenData, error: childError } = await supabase
                .from('parent_students')
                .select(`
                    student_id,
                    students (
                        id,
                        full_name,
                        roll_no,
                        grade_id,
                        grades (display_name)
                    )
                `)
                .eq('parent_id', parentData.id)

            if (childError) throw childError

            const fetchedChildren = childrenData?.map(ps => ps.students) || []
            setChildren(fetchedChildren)

            if (fetchedChildren.length > 0) {
                // 2. Fetch progress for all children
                const childIds = fetchedChildren.map(c => c.id)
                const { data: progressData, error: progressError } = await supabase
                    .from('student_progress')
                    .select(`
                        id,
                        score,
                        updated_at,
                        completed,
                        exercises (
                            id,
                            name,
                            modules (
                                name
                            )
                        )
                    `)
                    .in('student_id', childIds)
                    .order('updated_at', { ascending: false })

                if (progressError) throw progressError

                if (progressData) {
                    aggregateProgress(progressData)
                }
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const aggregateProgress = (data) => {
        // 1. Total Completed
        const completed = data.filter(d => d.completed)

        // 2. Subject Distribution (Pie Chart)
        const subjectsMap = {}
        completed.forEach(item => {
            const subject = item.exercises?.modules?.name || 'General'
            subjectsMap[subject] = (subjectsMap[subject] || 0) + 1
        })
        
        const subjectDistribution = Object.keys(subjectsMap).map(key => ({
            name: key,
            value: subjectsMap[key]
        }))

        const uniqueSubjects = Object.keys(subjectsMap)

        setAggregatedData({
            totalCompleted: completed.length,
            chartData: generateChartData(completed, 'Weekly', uniqueSubjects), // Initial load default
            subjectDistribution,
            recentActivity: data.slice(0, 5), // Top 5 recent
            allProgressData: completed, // Store for filtering
            uniqueSubjects
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
            const subject = item.exercises?.modules?.name || 'General'
            
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

    // Pie Chart Colors
    const COLORS = ['#fbbc04', '#c084fc', '#1f2937', '#6b7280', '#10b981'];

    if (loading) {
        return (
            <div className="dashboard-layout" style={{ alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '20px', color: '#6b7280' }}>Loading Dashboard...</div>
            </div>
        )
    }

    if (currentView === 'profile') {
        return (
            <div style={{ minHeight: '100vh', background: '#f3f4f6', fontFamily: '"Inter", "Segoe UI", sans-serif' }}>
                <main style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', padding: '40px 20px' }}>
                    <button
                        onClick={() => setCurrentView('dashboard')}
                        style={{
                            marginBottom: '24px', 
                            background: '#111827', 
                            color: '#ffffff',
                            border: 'none', 
                            padding: '10px 16px', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                            fontWeight: '500',
                            fontSize: '14px',
                            alignSelf: 'flex-start'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#1f2937'
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#111827'
                        }}
                    >
                        ← Back to Dashboard
                    </button>
                    <div style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '40px' }}>
                        <ProfileSettings role="parent" />
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className={`dashboard-layout ${isDarkMode ? 'dark-mode' : ''}`}>
            <header style={{ 
                background: '#111827', 
                color: 'white', 
                padding: '16px 40px', 
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* <div className="sidebar-logo" style={{ marginBottom: 0 }}>N</div> */}
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Welcome, {user?.email?.split('@')[0] || 'Parent'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <button 
                        style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontWeight: '500' }}
                        onClick={() => {
                            if (children.length > 0) {
                                onSelectStudent(children[0])
                            }
                        }}
                    >
                        Explore Modules
                    </button>
                    <button 
                        style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontWeight: '500' }}
                        onClick={() => setCurrentView('profile')}
                    >
                        Profile
                    </button>
                    {/* <button 
                        style={{ background: '#374151', border: 'none', color: 'white', cursor: 'pointer', fontWeight: '500', padding: '6px 12px', borderRadius: '12px' }}
                        onClick={() => setIsDarkMode(!isDarkMode)}
                    >
                        {isDarkMode ? '☀️ Light' : '🌙 Dark'}
                    </button> */}
                    <button 
                        style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontWeight: '500' }}
                        onClick={async () => {
                            if (typeof signOut === 'function') {
                                await signOut();
                            } else {
                                await supabase.auth.signOut();
                            }
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>

        <main className="main-content">
            <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', height: '100%', padding: '24px 0', display: 'flex', alignItems: 'center' }}>
                <div className="dashboard-grid">
                    {/* Top Left: Bar Chart */}
                    <div className="card">
                        <div className="card-header">
                            <div>
                                <h3 className="card-title">Learning Activity</h3>
                                <p className="card-subtitle">Exercises completed over time.</p>
                            </div>
                            <select className="dropdown-select" value={chartFilter} onChange={handleFilterChange}>
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                        </div>
                        <div className="stat-large">{aggregatedData.totalCompleted}</div>
                        <div className="stat-metric">Total Completed Exercises</div>
                        <div style={{ width: '100%', height: '200px', marginTop: '20px' }}>
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={aggregatedData.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{fontSize: '12px', paddingBottom: '10px'}}/>
                                    {aggregatedData.uniqueSubjects.map((subject, idx) => (
                                        <Bar 
                                            key={subject} 
                                            dataKey={subject} 
                                            stackId="a" 
                                            fill={COLORS[idx % COLORS.length]} 
                                            radius={
                                                // Only add border radius to top of the stack if we want
                                                // Actually standard radius on stacked bars can look weird, lets try just standard
                                                [4, 4, 0, 0]
                                            } 
                                            barSize={30} 
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Right: Pie Chart */}
                    <div className="card">
                         <div className="card-header">
                            <div>
                                <h3 className="card-title">Subject Focus</h3>
                                <p className="card-subtitle">Distribution of learning.</p>
                            </div>
                        </div>
                        <div style={{ width: '100%', height: '250px', position: 'relative' }}>
                            {aggregatedData.subjectDistribution.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={aggregatedData.subjectDistribution}
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {aggregatedData.subjectDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '12px'}}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                                    No data yet
                                </div>
                            )}
                             
                             {aggregatedData.subjectDistribution.length > 0 && (
                                <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{aggregatedData.totalCompleted}</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Total</div>
                                </div>
                             )}
                        </div>
                    </div>

                    {/* Bottom Left: Children List */}
                    <div className="card">
                         <div className="card-header">
                            <div>
                                <h3 className="card-title">Children</h3>
                                <p className="card-subtitle">Manage and view progress.</p>
                            </div>
                        </div>
                        {children.length === 0 ? (
                             <p style={{ color: '#6b7280', fontSize: '14px' }}>No children linked yet.</p>
                        ) : (
                            <div className="children-list">
                                {children.map(child => (
                                    <div key={child.id} className="child-row">
                                        <div className="child-info-basic">
                                            <span className="child-name">{child.full_name}</span>
                                            <span className="child-grade">Grade: {child.grades?.display_name || 'N/A'} | Roll No: {child.roll_no}</span>
                                        </div>
                                        <div className="child-actions">
                                            <button 
                                                className="btn-secondary"
                                                onClick={() => {
                                                    // Placeholder: Could navigate to a detailed view or toggle a modal
                                                    alert(`Viewing details for ${child.full_name}`)
                                                }}
                                            >
                                                Details
                                            </button>
                                            <button 
                                                className="btn-text"
                                                onClick={() => onSelectStudent(child)}
                                            >
                                                Explore Modules →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bottom Right: Recent Activity List */}
                    <div className="card">
                         <div className="card-header">
                            <div>
                                <h3 className="card-title">Recent Activity</h3>
                                <p className="card-subtitle">Latest completed exercises.</p>
                            </div>
                            <span className="badge badge-yellow">All Time</span>
                        </div>
                        
                        <div className="children-list" style={{ marginTop: '16px' }}>
                            {aggregatedData.recentActivity.length === 0 ? (
                                <p style={{ color: '#6b7280', fontSize: '14px' }}>No activity yet.</p>
                            ) : (
                                aggregatedData.recentActivity.map(activity => (
                                    <div key={activity.id} className="child-row" style={{ padding: '8px 0' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '14px', fontWeight: '500' }}>
                                                {activity.exercises?.name || 'Exercise'}
                                            </span>
                                            <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                                {new Date(activity.updated_at).toLocaleDateString()} • {activity.exercises?.modules?.name || 'General'}
                                            </span>
                                        </div>
                                        <div>
                                            <span style={{ 
                                                fontSize: '14px', 
                                                fontWeight: 'bold',
                                                color: activity.completed ? '#10b981' : '#f59e0b' 
                                            }}>
                                                {activity.score}%
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    )
}
