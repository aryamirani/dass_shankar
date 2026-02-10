//hehe
import React, { useState, useEffect, useMemo } from 'react'

const MENU_STRUCTURE = [
    { id: 'landing', label: 'Grade 1', type: 'file', icon: '🏠' },
    {
        id: 'book-a-grade-x', label: 'Book A', type: 'folder', icon: '📖', children: [
            {
                id: 'vocabulary', label: 'English Module', type: 'folder', icon: '📚', children: [
                    { id: 'vocabularyExercise', label: 'Matching Game', type: 'file', icon: '🧩' },
                    { id: 'vocabularyThree', label: 'Interactive Learn', type: 'file', icon: '🎮' },
                    { id: 'englishReadWords', label: 'Read Words', type: 'file', icon: '👁️' }
                ]
            },
            {
                id: 'maths', label: 'Maths Module', type: 'folder', icon: '📐', children: [
                    { id: 'mathsExerciseOne', label: 'Counting', type: 'file', icon: '1️⃣' },
                    { id: 'mathsExerciseTwo', label: 'Write the digits', type: 'file', icon: '✍️' },
                    { id: 'mathsExerciseThree', label: 'Fill missing number', type: 'file', icon: '❓' },
                    { id: 'mathsExerciseFour', label: 'Before and after', type: 'file', icon: '↔️' },
                    { id: 'mathsExerciseFive', label: 'In between', type: 'file', icon: '🔹' },
                    { id: 'mathsExerciseSix', label: 'Ordering', type: 'file', icon: '📊' },
                    { id: 'mathsExerciseSeven', label: 'Place Values', type: 'file', icon: '🏘️' },
                    { id: 'mathsExerciseEight', label: 'Calculator', type: 'file', icon: '🧮' },
                    { id: 'mathsExerciseNine', label: 'Word Problems', type: 'file', icon: '💭' }
                ]
            },
            {
                id: 'computer', label: 'Computer Module', type: 'folder', icon: '💻', children: [
                    { id: 'computerKeyboard', label: 'Typing Practice', type: 'file', icon: '⌨️' }
                ]
            },
            {
                id: 'evs', label: 'EVS Module', type: 'folder', icon: '🌿', children: [
                    { id: 'evsIdentify', label: 'Identify Objects', type: 'file', icon: '🖼️' },
                    { id: 'evsGender', label: 'Identify Gender', type: 'file', icon: '👥' },
                    { id: 'evsJams', label: 'Read Labels', type: 'file', icon: '🏺' },
                    { id: 'evsBags', label: 'Types of Bags', type: 'file', icon: '👜' },
                    { id: 'evsMap', label: 'Map', type: 'file', icon: '🗺️' }
                ]
            },
            {
                id: 'arts', label: 'Arts Module', type: 'folder', icon: '🎨', children: []
            }
        ]
    },
    { id: 'landing2', label: 'Grade 2', type: 'file', icon: '🏠' },
    {
        id: 'book-a-grade-x2', label: 'Book A', type: 'folder', icon: '📖', children: [
            {
                id: 'health', label: 'Health Module', type: 'folder', icon: '❤️', children: [
                    { id: 'healthProblems', label: 'Common Problems', type: 'file', icon: '🌡️' },
                    { id: 'assessment', label: 'Health Quiz', type: 'file', icon: '📝' }
                ]
            },
            {
                id: 'english', label: 'English Module', type: 'folder', icon: '📖', children: [
                    { id: 'englishWordGame', label: 'Word Surgery', type: 'file', icon: '📚' },
                    { id: 'englishPhonics', label: 'Word Match', type: 'file', icon: '📐' },
                    { id: 'englishFillBlanks', label: 'Fill Blanks', type: 'file', icon: '✍️' }
                ]
            },
            {
                id: 'science', label: 'Science Module', type: 'folder', icon: '🔬', children: [
                    { id: 'scienceHuman', label: 'Identify Organs', type: 'file', icon: '🧠' }
                ]
            }
        ]
    }
]

// Helper function to determine which folder contains the current view
function getActiveFolderId(currentView) {
    if (currentView === 'healthProblems' || currentView === 'assessment' || currentView === 'health' || currentView === 'lesson') return 'health'
    if (currentView && currentView.startsWith('vocabulary')) return 'vocabulary'
    if (currentView === 'englishReadWords' || currentView === 'englishReadWords2') return 'vocabulary'
    if ((currentView && currentView.startsWith('mathsExercise')) || currentView === 'maths') return 'maths'
    if (currentView && currentView.startsWith('english')) return 'english'
    if (currentView === 'scienceOrgan' || currentView === 'scienceHuman' || currentView === 'science') return 'science'
    if (currentView === 'computerKeyboard' || currentView === 'computer') return 'computer'
    if (currentView === 'evsIdentify' || currentView === 'evsGender' || currentView === 'evsJams' || currentView === 'evsBags' || currentView === 'evsMap' || currentView === 'evs') return 'evs'
    if (currentView === 'arts') return 'arts'
    return null
}


export default function Sidebar({ currentView, onChangeView, completedItems = [], studentProfile, onExit, testActive, appMode, onFinalize }) {
    // Filter logic
    const displayedMenu = useMemo(() => {
        if (!studentProfile) return MENU_STRUCTURE
        const g = studentProfile.grades?.display_name || ''
        if (g === 'Grade 1') {
            return MENU_STRUCTURE.filter(item => item.id === 'landing' || item.id === 'book-a-grade-x')
        }
        if (g === 'Grade 2') {
            return MENU_STRUCTURE.filter(item => item.id === 'landing2' || item.id === 'book-a-grade-x2')
        }
        return MENU_STRUCTURE
    }, [studentProfile])

    // Determine which folder should be open based on current view
    const activeFolderId = getActiveFolderId(currentView)

    // Only the folder containing the current view is expanded by default
    const [expanded, setExpanded] = useState({
        'book-a-grade-x': activeFolderId && ['vocabulary', 'maths', 'computer', 'evs', 'arts'].includes(activeFolderId),
        'book-a-grade-x2': activeFolderId && ['health', 'english', 'science'].includes(activeFolderId),
        'health': activeFolderId === 'health',
        'vocabulary': activeFolderId === 'vocabulary',
        'maths': activeFolderId === 'maths',
        'english': activeFolderId === 'english',
        'science': activeFolderId === 'science',
        'computer': activeFolderId === 'computer',
        'evs': activeFolderId === 'evs',
        'arts': activeFolderId === 'arts'
    })
    const [collapsed, setCollapsed] = useState(false)
    const [hovered, setHovered] = useState(null)
    const [subOpen, setSubOpen] = useState({})

    // Update expanded state when currentView changes
    useEffect(() => {
        const activeFolder = getActiveFolderId(currentView)
        if (activeFolder) {
            // Collapse all modules, then expand only the active ones
            setExpanded({
                'book-a-grade-x': ['vocabulary', 'maths', 'computer', 'evs', 'arts'].includes(activeFolder),
                'book-a-grade-x2': ['health', 'english', 'science'].includes(activeFolder),
                'health': activeFolder === 'health',
                'vocabulary': activeFolder === 'vocabulary',
                'maths': activeFolder === 'maths',
                'english': activeFolder === 'english',
                'science': activeFolder === 'science',
                'computer': activeFolder === 'computer',
                'evs': activeFolder === 'evs',
                'arts': activeFolder === 'arts'
            })
        }
    }, [currentView])

    // Mobile support logic
    const [isMobile, setIsMobile] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)


    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024)
            if (window.innerWidth >= 1024) {
                setMobileOpen(false) // Reset when going back to desktop
            }
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Accordion: only one folder open at a time
    const toggleFolder = (id) => {
        setExpanded(prev => {
            const newExpanded = Object.fromEntries(Object.keys(prev).map(k => [k, false]))
            newExpanded[id] = !prev[id]
            return newExpanded
        })
    }

    // Check if an item or folder is completed
    const isCompleted = (item) => {
        if (item.type === 'file') {
            return completedItems.includes(item.id)
        }
        if (item.type === 'folder' && item.children) {
            // Folder is complete if ALL children are complete AND there is at least one child
            return item.children.length > 0 && item.children.every(child => completedItems.includes(child.id))
        }
        return false
    }

    // When navigating to a page, auto-expand the parent module and collapse others
    const handleItemClick = (item) => {
        if (item.type === 'folder') {
            toggleFolder(item.id)
            onChangeView(item.id)
            if (isMobile) setMobileOpen(false)
            return
        }

        // Find parent folder and expand it
        let parentId = null
        for (const mod of MENU_STRUCTURE) {
            if (mod.type === 'folder' && mod.children && mod.children.some(child => child.id === item.id)) {
                parentId = mod.id
                break
            }
        }
        if (parentId) {
            setExpanded(prev => {
                const newExpanded = Object.fromEntries(Object.keys(prev).map(k => [k, false]))
                newExpanded[parentId] = true
                return newExpanded
            })
        }

        // Special handling for Vocabulary submenu toggles
        if (item.id === 'vocabularyExercise' || item.id === 'vocabularyThree') {
            setSubOpen(prev => ({ ...prev, [item.id]: !prev[item.id] }))
            return
        }

        // Default: navigate to the view
        onChangeView(item.id)
        if (isMobile) setMobileOpen(false)
    }

    const renderItem = (item, level = 0) => {
        const isActive = currentView === item.id ||
            (item.id === 'health' && (currentView === 'healthProblems' || currentView === 'assessment')) ||
            (item.id === 'science' && (currentView === 'scienceOrgan' || currentView === 'scienceHuman')) ||
            (item.id === 'english' && currentView.startsWith('english') && currentView !== 'englishReadWords' && currentView !== 'englishReadWords2') ||
            (item.id === 'vocabulary' && (currentView.startsWith('vocabulary') || currentView === 'englishReadWords' || currentView === 'englishReadWords2')) ||
            (item.id === 'computer' && currentView === 'computerKeyboard') ||
            (item.id === 'evs' && currentView.startsWith('evs')) ||
            (item.id === 'arts' && currentView === 'arts') ||
            (item.id === 'book-a-grade-x' && ['vocabulary', 'maths', 'computer', 'evs', 'arts'].some(m => currentView && (currentView === m || currentView.startsWith(m)))) ||
            (item.id === 'book-a-grade-x2' && ['health', 'english', 'science'].some(m => currentView && (currentView === m || currentView.startsWith(m))))
        const isFolder = item.type === 'folder'
        const isOpen = expanded[item.id]
        const isHovered = hovered === item.id
        const completed = isCompleted(item)

        // Only show children for folders if not collapsed OR if collapsed (we can't easily indent, so maybe hide?)
        // Design choice: Hide children when collapsed to keep icons separate
        const showChildren = isFolder && isOpen && !collapsed

        return (
            <div key={item.id} style={{ marginBottom: 1 }}>
                <div
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                        paddingLeft: collapsed ? 0 : 12 + level * 16,
                        paddingRight: collapsed ? 0 : 12,
                        paddingTop: 8,
                        paddingBottom: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        cursor: 'pointer',
                        background: isActive
                            ? 'linear-gradient(90deg, rgba(37, 37, 38, 1) 0%, rgba(45, 45, 48, 1) 100%)'
                            : (isHovered ? 'rgba(255, 255, 255, 0.08)' : 'transparent'),
                        color: isActive ? '#4fc3f7' : (isHovered ? '#fff' : '#aaa'),
                        borderLeft: isActive ? '3px solid #4fc3f7' : '3px solid transparent',
                        transition: 'all 0.15s ease-out',
                        borderRadius: collapsed ? 0 : '0 6px 6px 0',
                        marginRight: collapsed ? 0 : 4,
                        position: 'relative',
                        height: 38
                    }}
                    title={collapsed ? item.label : ''}
                >
                    {/* Folder arrow - Separate click area */}
                    {isFolder && !collapsed && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                                toggleFolder(item.id)
                            }}
                            style={{
                                width: 16,
                                height: 16,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 4,
                                borderRadius: 4,
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <span style={{
                                fontSize: 9,
                                color: isActive ? '#4fc3f7' : '#888',
                                transform: isOpen ? 'rotate(90deg)' : 'none',
                                transition: 'transform 0.2s',
                            }}>
                                ▶
                            </span>
                        </div>
                    )}

                    <span style={{
                        marginRight: collapsed ? 0 : 8,
                        fontSize: 16,
                        filter: isActive ? 'drop-shadow(0 0 4px rgba(79, 195, 247, 0.4))' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {item.icon}
                    </span>

                    {!collapsed && (
                        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: 0.2, fontSize: 13, fontWeight: isActive ? 600 : 400 }}>
                            {item.label}
                        </span>
                    )}

                    {!collapsed && completed && appMode !== 'test' && (
                        <span style={{ color: '#4CAF50', marginLeft: 6, fontSize: 14, fontWeight: 800 }}>✓</span>
                    )}
                </div>
                {showChildren && (
                    <div style={{
                        overflow: 'hidden',
                        animation: 'slideDown 0.2s ease-out'
                    }}>
                        {item.children.map(child => (
                            <div key={child.id}>
                                {renderItem(child, level + 1)}
                                {/* Special submenu for Vocabulary matching game */}
                                {child.id === 'vocabularyExercise' && subOpen['vocabularyExercise'] && (
                                    <div style={{ paddingLeft: 12 + (level + 1) * 16 + 8, paddingRight: 10, paddingTop: 4, paddingBottom: 4, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                        <button className="sidebar-sub" onClick={() => { onChangeView('vocabularyExercise'); if (isMobile) setMobileOpen(false); }} style={{ padding: '6px 4px', textAlign: 'center', fontSize: 11 }}>at</button>
                                        <button className="sidebar-sub" onClick={() => { onChangeView('vocabularyExerciseAn'); if (isMobile) setMobileOpen(false); }} style={{ padding: '6px 4px', textAlign: 'center', fontSize: 11 }}>an</button>
                                        <button className="sidebar-sub" onClick={() => { onChangeView('vocabularyExerciseAp'); if (isMobile) setMobileOpen(false); }} style={{ padding: '6px 4px', textAlign: 'center', fontSize: 11 }}>ap</button>
                                        <button className="sidebar-sub" onClick={() => { onChangeView('vocabularyExerciseAg'); if (isMobile) setMobileOpen(false); }} style={{ padding: '6px 4px', textAlign: 'center', fontSize: 11 }}>ag</button>
                                        <button className="sidebar-sub" onClick={() => { onChangeView('vocabularyExerciseAM'); if (isMobile) setMobileOpen(false); }} style={{ padding: '6px 4px', textAlign: 'center', fontSize: 11 }}>am</button>
                                        <button className="sidebar-sub" onClick={() => { onChangeView('vocabularyExerciseAd'); if (isMobile) setMobileOpen(false); }} style={{ padding: '6px 4px', textAlign: 'center', fontSize: 11 }}>ad</button>
                                    </div>
                                )}

                                {/* Special submenu for Vocabulary interactive learn */}
                                {child.id === 'vocabularyThree' && subOpen['vocabularyThree'] && (
                                    <div style={{ paddingLeft: 12 + (level + 1) * 16 + 8, paddingRight: 10, paddingTop: 6, paddingBottom: 6, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                        <button className="sidebar-sub" onClick={() => { onChangeView('vocabularyThree'); if (isMobile) setMobileOpen(false); }} style={{ padding: '6px 4px', textAlign: 'center', fontSize: 11 }}>at</button>
                                        <button className="sidebar-sub" onClick={() => { onChangeView('vocabularyThreeAn'); if (isMobile) setMobileOpen(false); }} style={{ padding: '6px 4px', textAlign: 'center', fontSize: 11 }}>an</button>
                                        <button className="sidebar-sub" onClick={() => { onChangeView('vocabularyThreeAp'); if (isMobile) setMobileOpen(false); }} style={{ padding: '6px 4px', textAlign: 'center', fontSize: 11 }}>ap</button>
                                        <button className="sidebar-sub" onClick={() => { onChangeView('vocabularyThreeAg'); if (isMobile) setMobileOpen(false); }} style={{ padding: '6px 4px', textAlign: 'center', fontSize: 11 }}>ag</button>
                                        <button className="sidebar-sub" onClick={() => { onChangeView('vocabularyThreeAM'); if (isMobile) setMobileOpen(false); }} style={{ padding: '6px 4px', textAlign: 'center', fontSize: 11 }}>am</button>
                                        <button className="sidebar-sub" onClick={() => { onChangeView('vocabularyThreeAd'); if (isMobile) setMobileOpen(false); }} style={{ padding: '6px 4px', textAlign: 'center', fontSize: 11 }}>ad</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <>
            {/* Mobile Hamburger Button */}
            {isMobile && !mobileOpen && (
                <button
                    onClick={() => setMobileOpen(true)}
                    style={{
                        position: 'fixed',
                        top: 15,
                        right: 15,
                        zIndex: 999,
                        background: '#1e1e1e',
                        border: '1px solid #333',
                        color: '#fff',
                        borderRadius: 8,
                        padding: 8,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        cursor: 'pointer',
                        fontSize: 20,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    ☰
                </button>
            )}

            {/* Mobile Backdrop */}
            {isMobile && mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 999
                    }}
                />
            )}

            <div style={{
                width: isMobile ? 240 : (collapsed ? 60 : 240),
                background: '#1e1e1e',
                borderRight: '1px solid #333',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                color: '#e0e0e0',
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
                userSelect: 'none',
                boxShadow: '4px 0 24px rgba(0,0,0,0.2)',
                zIndex: 1000,
                transition: 'width 0.3s cubic-bezier(0.2, 0, 0, 1), transform 0.3s ease',
                position: isMobile ? 'fixed' : 'relative',
                transform: isMobile ? (mobileOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
                left: 0, top: 0
            }}>
                {/* Header */}
                <div style={{
                    padding: collapsed ? '12px 0' : '12px 16px',
                    borderBottom: '1px solid #2d2d2d',
                    background: '#252526',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    height: 56
                }}>
                    {!collapsed && (
                        <div>
                            <div style={{
                                fontSize: 11,
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: 1.1,
                                color: '#666',
                                marginBottom: 2
                            }}>
                                Course Content
                            </div>
                            <div style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: '#fff',
                                letterSpacing: -0.4
                            }}>
                                Explorer
                            </div>
                        </div>
                    )}

                    {/* Collapse Toggle - Hide on mobile */}
                    {!isMobile && (
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 6,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'transform 0.3s ease'
                            }}
                        >
                            <img
                                src="/common/main-menu.png"
                                alt={collapsed ? 'Expand' : 'Collapse'}
                                style={{
                                    width: 18,
                                    height: 18,
                                    filter: 'brightness(0.9)',
                                    objectFit: 'contain'
                                }}
                            />
                        </button>
                    )}
                    {/* Close button for Mobile */}
                    {isMobile && (
                        <button
                            onClick={() => setMobileOpen(false)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#fff',
                                fontSize: 20
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* List */}
                <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '10px 0', overflowX: 'hidden' }}>
                    {displayedMenu.map(item => renderItem(item))}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '12px',
                    borderTop: '1px solid #2d2d2d',
                    background: '#252526',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        gap: 10
                    }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: '50%', background: '#4fc3f7', color: '#1e1e1e',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 12,
                            flexShrink: 0
                        }}>
                            {studentProfile ? studentProfile.full_name?.charAt(0).toUpperCase() : 'SF'}
                        </div>
                        {!collapsed && (
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
                                    {studentProfile ? studentProfile.full_name : 'Shankar Foundation'}
                                </div>
                                <div style={{ fontSize: 11, color: '#888' }}>
                                    {studentProfile ? `Roll No: ${studentProfile.roll_no}` : 'Learning Portal'}
                                </div>
                            </div>
                        )}
                    </div>

                    {!collapsed && testActive && (
                        <button
                            onClick={onFinalize}
                            style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '14px',
                                fontWeight: 800,
                                color: 'white',
                                background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                marginTop: 8,
                                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)',
                                animation: 'pulse 2s infinite'
                            }}
                        >
                            FINISH TEST
                        </button>
                    )}

                    {!collapsed && onExit && (
                        <button
                            onClick={onExit}
                            style={{
                                width: '100%',
                                padding: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#ff5252',
                                background: 'rgba(255, 82, 82, 0.1)',
                                border: '1px solid rgba(255, 82, 82, 0.2)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: 4,
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={e => e.target.style.background = 'rgba(255, 82, 82, 0.2)'}
                            onMouseLeave={e => e.target.style.background = 'rgba(255, 82, 82, 0.1)'}
                        >
                            ← Back to Dashboard
                        </button>
                    )}
                </div>

                <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 5px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #1e1e1e; 
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #444; 
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #555; 
            }
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(234, 88, 12, 0); }
                100% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0); }
            }
          `}</style>
            </div>
        </>
    )
}
