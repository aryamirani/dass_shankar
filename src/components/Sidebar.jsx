//test
import React, { useState } from 'react'

const MENU_STRUCTURE = [
    { id: 'landing', label: 'Overview', type: 'file', icon: '🏠' },
    {
        id: 'health', label: 'Health Module', type: 'folder', icon: '❤️', children: [
            { id: 'healthProblems', label: 'Common Problems', type: 'file', icon: '🌡️' },
            { id: 'assessment', label: 'Health Quiz', type: 'file', icon: '📝' }
        ]
    },
    {
        id: 'vocabulary', label: 'Vocabulary Module', type: 'folder', icon: '📚', children: [
            { id: 'vocabularyExercise', label: 'Matching Game', type: 'file', icon: '🧩' },
            { id: 'vocabularyThree', label: 'Interactive Learn', type: 'file', icon: '🎮' }
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
            { id: 'mathsExerciseEight', label: 'Calculator', type: 'file', icon: '🧮' }
        ]
    },
    {
        id: 'english', label: 'English Module', type: 'folder', icon: '📝', children: [
            { id: 'englishTheory', label: 'Compound Words', type: 'file', icon: '🧬' },
            { id: 'englishWordGame', label: 'Word Surgery', type: 'file', icon: '📚' },
            { id: 'englishPhonics', label: 'Word Match', type: 'file', icon: '📐' },
            { id: 'englishFillBlanks', label: 'Fill Blanks', type: 'file', icon: '✍️' }
        ]
    },
    {
        id: 'science', label: 'Science Module', type: 'folder', icon: '🔬', children: [
            { id: 'scienceOrgan', label: 'Human Anatomy', type: 'file', icon: '🫀' }
        ]
    }
]

export default function Sidebar({ currentView, onChangeView, completedItems = [] }) {
    const [expanded, setExpanded] = useState({
        'health': true,
        'vocabulary': true,
        'maths': true,
        'english': true,
        'science': true
    })
    const [collapsed, setCollapsed] = useState(false)
    const [hovered, setHovered] = useState(null)

    const toggleFolder = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
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

    const renderItem = (item, level = 0) => {
        const isActive = currentView === item.id ||
            (item.id === 'health' && (currentView === 'healthProblems' || currentView === 'assessment')) ||
            (item.id === 'science' && currentView === 'scienceOrgan') ||
            (item.id === 'english' && currentView.startsWith('english'))
        const isFolder = item.type === 'folder'
        const isOpen = expanded[item.id]
        const isHovered = hovered === item.id
        const completed = isCompleted(item)

        // Only show children for folders if not collapsed OR if collapsed (we can't easily indent, so maybe hide?)
        // Design choice: Hide children when collapsed to keep icons separate
        const showChildren = isFolder && isOpen && !collapsed

        return (
            <div key={item.id} style={{ marginBottom: 2 }}>
                <div
                    onClick={(e) => {
                        // Logic:
                        // If user clicks the arrow, TOGGLE.
                        // If user clicks the label/box:
                        //   - If it's a file, NAVIGATE.
                        //   - If it's a folder:
                        //       - If it has a navId (like vocab/maths), NAVIGATE.
                        //       - Else TOGGLE.
                        if (isFolder) {
                            // If we clicked strictly on the arrow (handled by stopPropagation if we separate it), but here we handle main click
                            // We want 'vocabulary' and 'maths' and 'health' to navigate
                            if (item.id === 'vocabulary' || item.id === 'maths' || item.id === 'english' || item.id === 'science' || item.id === 'health') {
                                onChangeView(item.id)
                            } else {
                                toggleFolder(item.id)
                            }
                        } else {
                            onChangeView(item.id)
                        }
                    }}
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                        paddingLeft: collapsed ? 0 : 16 + level * 24,
                        paddingRight: collapsed ? 0 : 16,
                        paddingTop: 10,
                        paddingBottom: 10,
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
                        height: 44
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
                                width: 20,
                                height: 20,
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
                                fontSize: 10,
                                color: isActive ? '#4fc3f7' : '#888',
                                transform: isOpen ? 'rotate(90deg)' : 'none',
                                transition: 'transform 0.2s',
                            }}>
                                ▶
                            </span>
                        </div>
                    )}

                    <span style={{
                        marginRight: collapsed ? 0 : 12,
                        fontSize: 18,
                        filter: isActive ? 'drop-shadow(0 0 4px rgba(79, 195, 247, 0.4))' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {item.icon}
                    </span>

                    {!collapsed && (
                        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: 0.3 }}>
                            {item.label}
                        </span>
                    )}

                    {!collapsed && completed && (
                        <span style={{ color: '#4CAF50', marginLeft: 8, fontSize: 16, fontWeight: 800 }}>✓</span>
                    )}
                </div>
                {showChildren && (
                    <div style={{
                        overflow: 'hidden',
                        animation: 'slideDown 0.2s ease-out'
                    }}>
                        {item.children.map(child => renderItem(child, level + 1))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div style={{
            width: collapsed ? 64 : 280,
            background: '#1e1e1e',
            borderRight: '1px solid #333',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            color: '#e0e0e0',
            fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
            userSelect: 'none',
            boxShadow: '4px 0 24px rgba(0,0,0,0.2)',
            zIndex: 10,
            transition: 'width 0.3s cubic-bezier(0.2, 0, 0, 1)'
        }}>
            {/* Header */}
            <div style={{
                padding: collapsed ? '20px 0' : '20px 24px',
                borderBottom: '1px solid #2d2d2d',
                background: '#252526',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'space-between',
                height: 80
            }}>
                {!collapsed && (
                    <div>
                        <div style={{
                            fontSize: 13,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: 1.2,
                            color: '#666',
                            marginBottom: 4
                        }}>
                            Course Content
                        </div>
                        <div style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: '#fff',
                            letterSpacing: -0.5
                        }}>
                            Explorer
                        </div>
                    </div>
                )}

                {/* Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#888',
                        cursor: 'pointer',
                        padding: 8,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    {collapsed ? '»' : '«'}
                </button>
            </div>

            {/* List */}
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '16px 0', overflowX: 'hidden' }}>
                {MENU_STRUCTURE.map(item => renderItem(item))}
            </div>

            {/* Footer */}
            <div style={{
                padding: '16px',
                borderTop: '1px solid #2d2d2d',
                background: '#252526',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: 12,
                height: 70
            }}>
                <div style={{
                    width: 32, height: 32, borderRadius: '50%', background: '#4fc3f7', color: '#1e1e1e',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 14,
                    flexShrink: 0
                }}>
                    SF
                </div>
                {!collapsed && (
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Shankar Foundation</div>
                        <div style={{ fontSize: 11, color: '#888' }}>Learning Portal</div>
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
    )
}
