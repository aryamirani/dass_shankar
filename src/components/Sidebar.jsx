//hehe
import React, { useState, useEffect } from 'react'

const MENU_STRUCTURE = [
    { id: 'landing', label: 'Grade X', type: 'file', icon: '🏠' },
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
        id: 'computer', label: 'Computer Module', type: 'folder', icon: '�', children: [
            { id: 'computerKeyboard', label: 'Typing Practice', type: 'file', icon: '⌨️' }
        ]
    },
    {
        id: 'evs', label: 'EVS Module', type: 'folder', icon: '🌿', children: [
            { id: 'evsIdentify', label: 'Identify Objects', type: 'file', icon: '🖼️' },
            { id: 'evsMap', label: 'Map', type: 'file', icon: '🗺️' }
        ]
    },
    { id: 'landing2', label: 'Grade X2', type: 'file', icon: '🏠' },
    {
        id: 'health', label: 'Health Module', type: 'folder', icon: '❤️', children: [
            { id: 'healthProblems', label: 'Common Problems', type: 'file', icon: '🌡️' },
            { id: 'assessment', label: 'Health Quiz', type: 'file', icon: '📝' }
        ]
    },
    {
        id: 'english', label: 'English Module', type: 'folder', icon: '�', children: [{ id: 'englishWordGame', label: 'Word Surgery', type: 'file', icon: '📚'},
            { id: 'englishPhonics', label: 'Word Match', type: 'file', icon: '📐' },
            { id: 'englishFillBlanks', label: 'Fill Blanks', type: 'file', icon: '✍️' }

        ]
    },
    {
        id: 'science', label: 'Science Module', type: 'folder', icon: '�', children: [
            // { id: 'scienceOrgan', label: 'Human Anatomy', type: 'file', icon: '🫀' },
            { id: 'scienceHuman', label: 'Identify Organs', type: 'file', icon: '🧠' }
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
    return null
}

export default function Sidebar({ currentView, onChangeView, completedItems = [] }) {
    // Determine which folder should be open based on current view
    const activeFolderId = getActiveFolderId(currentView)

    // Only the folder containing the current view is expanded by default
    const [expanded, setExpanded] = useState({
        'health': activeFolderId === 'health',
        'vocabulary': activeFolderId === 'vocabulary',
        'maths': activeFolderId === 'maths',
        'english': activeFolderId === 'english',
        'science': activeFolderId === 'science',
        'computer': activeFolderId === 'computer',
        'evs': activeFolderId == 'evs'
    })
    const [collapsed, setCollapsed] = useState(false)
    const [hovered, setHovered] = useState(null)
    const [subOpen, setSubOpen] = useState({})

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
            // Folder is complete if ALL children are complete
            return item.children.every(child => completedItems.includes(child.id))
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
            (item.id === 'evs' && currentView.startsWith('evs'))
        const isFolder = item.type === 'folder'
        const isOpen = expanded[item.id]
        const isHovered = hovered === item.id
        const completed = isCompleted(item)

        // Only show children for folders if not collapsed OR if collapsed (we can't easily indent, so maybe hide?)
        // Design choice: Hide children when collapsed to keep icons separate
        const showChildren = isFolder && isOpen && !collapsed

        return (
            <div key={item.id} style={{ marginBottom: 4 }}>
                <div
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                        paddingLeft: collapsed ? 0 : 20 + level * 28,
                        paddingRight: collapsed ? 0 : 20,
                        paddingTop: 14,
                        paddingBottom: 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        cursor: 'pointer',
                        background: isActive
                            ? 'linear-gradient(90deg, rgba(37, 37, 38, 1) 0%, rgba(45, 45, 48, 1) 100%)'
                            : (isHovered ? 'rgba(255, 255, 255, 0.08)' : 'transparent'),
                        color: isActive ? '#4fc3f7' : (isHovered ? '#fff' : '#ccc'),
                        borderLeft: isActive ? '4px solid #4fc3f7' : '4px solid transparent',
                        transition: 'all 0.15s ease-out',
                        borderRadius: collapsed ? 0 : '0 8px 8px 0',
                        marginRight: collapsed ? 0 : 8,
                        position: 'relative',
                        height: 52
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
                                width: 24,
                                height: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 8,
                                borderRadius: 4,
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <span style={{
                                fontSize: 12,
                                color: isActive ? '#4fc3f7' : '#888',
                                transform: isOpen ? 'rotate(90deg)' : 'none',
                                transition: 'transform 0.2s',
                            }}>
                                ▶
                            </span>
                        </div>
                    )}

                    <span style={{
                        marginRight: collapsed ? 0 : 14,
                        fontSize: 22,
                        filter: isActive ? 'drop-shadow(0 0 4px rgba(79, 195, 247, 0.4))' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {item.icon}
                    </span>

                    {!collapsed && (
                        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: 0.3, fontSize: 16 }}>
                            {item.label}
                        </span>
                    )}

                    {!collapsed && completed && (
                        <span style={{ color: '#4CAF50', marginLeft: 8, fontSize: 18, fontWeight: 800 }}>✓</span>
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
                                    <div style={{ paddingLeft: 20 + (level + 1) * 28 + 12, paddingTop: 6, paddingBottom: 6, display: 'flex', gap: 8, flexDirection: 'column' }}>
                                        <button className="sidebar-sub" onClick={() => { onChangeView('vocabularyExercise'); if (isMobile) setMobileOpen(false); }} style={{ padding: '8px 12px', textAlign: 'left' }}>at</button>
                                        <button className="sidebar-sub" onClick={() => { onChangeView('vocabularyExerciseAg'); if (isMobile) setMobileOpen(false); }} style={{ padding: '8px 12px', textAlign: 'left' }}>ag</button>
                                        <button className="sidebar-sub" onClick={() => { onChangeView('vocabularyExerciseAM'); if (isMobile) setMobileOpen(false); }} style={{ padding: '8px 12px', textAlign: 'left' }}>am</button>
                                        <button className="sidebar-sub" onClick={() => { onChangeView('vocabularyExerciseAd'); if (isMobile) setMobileOpen(false); }} style={{ padding: '8px 12px', textAlign: 'left' }}>ad</button>
                                    </div>
                                )}
                                {/* Special submenu for Vocabulary interactive learn */}
                                {child.id === 'vocabularyThree' && subOpen['vocabularyThree'] && (
                                    <div style={{ paddingLeft: 20 + (level + 1) * 28 + 12, paddingTop: 6, paddingBottom: 6, display: 'flex', gap: 8, flexDirection: 'column' }}>
                                        <button className="sidebar-sub" onClick={() => { onChangeView('vocabularyThree'); if (isMobile) setMobileOpen(false); }} style={{ padding: '8px 12px', textAlign: 'left' }}>at</button>
                                        <button className="sidebar-sub" onClick={() => { onChangeView('vocabularyThreeAg'); if (isMobile) setMobileOpen(false); }} style={{ padding: '8px 12px', textAlign: 'left' }}>ag</button>
                                        <button className="sidebar-sub" onClick={() => { onChangeView('vocabularyThreeAM'); if (isMobile) setMobileOpen(false); }} style={{ padding: '8px 12px', textAlign: 'left' }}>am</button>
                                        <button className="sidebar-sub" onClick={() => { onChangeView('vocabularyThreeAd'); if (isMobile) setMobileOpen(false); }} style={{ padding: '8px 12px', textAlign: 'left' }}>ad</button>
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
                        top: 20,
                        right: 20,
                        zIndex: 999,
                        background: '#1e1e1e',
                        border: '1px solid #333',
                        color: '#fff',
                        borderRadius: 8,
                        padding: 10,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        cursor: 'pointer',
                        fontSize: 24,
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
                width: isMobile ? 300 : (collapsed ? 80 : 340),
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
                    padding: collapsed ? '24px 0' : '24px 28px',
                    borderBottom: '1px solid #2d2d2d',
                    background: '#252526',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    height: 100
                }}>
                    {!collapsed && (
                        <div>
                            <div style={{
                                fontSize: 15,
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: 1.2,
                                color: '#666',
                                marginBottom: 6
                            }}>
                                Course Content
                            </div>
                            <div style={{
                                fontSize: 24,
                                fontWeight: 700,
                                color: '#fff',
                                letterSpacing: -0.5
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
                                padding: 10,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'transform 0.3s ease'
                            }}
                        >
                            <img
                                src="/assets/main-menu.png"
                                alt={collapsed ? 'Expand' : 'Collapse'}
                                style={{
                                    width: 28,
                                    height: 28,
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
                                fontSize: 24
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* List */}
                <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '20px 0', overflowX: 'hidden' }}>
                    {MENU_STRUCTURE.map(item => renderItem(item))}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '20px',
                    borderTop: '1px solid #2d2d2d',
                    background: '#252526',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    gap: 14,
                    height: 85
                }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: '50%', background: '#4fc3f7', color: '#1e1e1e',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 16,
                        flexShrink: 0
                    }}>
                        SF
                    </div>
                    {!collapsed && (
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                            <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>Shankar Foundation</div>
                            <div style={{ fontSize: 13, color: '#888' }}>Learning Portal</div>
                        </div>
                    )}
                </div>

                <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #1e1e1e; 
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #444; 
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #555; 
            }
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
            </div>
        </>
    )
}
