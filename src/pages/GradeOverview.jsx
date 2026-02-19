import React from 'react'

const BOOKS = [
    { id: 'book-a', label: 'Book A', icon: '📖', color: '#2563eb' },
    { id: 'book-e', label: 'Book E', icon: '📘', color: '#7c3aed', placeholder: true },
    { id: 'book-i', label: 'Book I', icon: '📗', color: '#059669', placeholder: true },
    { id: 'book-o', label: 'Book O', icon: '📙', color: '#ea580c', placeholder: true },
    { id: 'book-u', label: 'Book U', icon: '📕', color: '#dc2626', placeholder: true },
]

export default function GradeOverview({ gradeName, onBookClick }) {
    return (
        <div style={{
            minHeight: '100%',
            background: '#b2ffc9ff', // Plain light green
            padding: '60px 40px',
            color: '#1e293b',
            fontFamily: "'Outfit', 'Inter', sans-serif"
        }}>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .book-card {
                    animation: fadeInUp 0.6s ease-out forwards;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .book-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
                }
                .placeholder-tag {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: #f1f5f9;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: #64748b;
                }
            `}</style>

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{
                        fontSize: 'clamp(32px, 5vw, 56px)',
                        fontWeight: 900,
                        marginBottom: '16px',
                        letterSpacing: '-1px',
                        color: '#000000ff' 
                    }}>
                        {gradeName}
                    </h1>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '40px'
                }}>
                    {BOOKS.map((book, index) => (
                        <div
                            key={book.id}
                            className="book-card"
                            onClick={() => !book.placeholder && onBookClick(book.id === 'book-a' ? (gradeName.includes('Grade 2') ? 'book-a-grade-x2' : 'book-a-grade-x') : book.id)}
                            style={{
                                background: 'white',
                                border: `2px solid ${book.color}`,
                                borderRadius: '24px',
                                padding: '30px',
                                cursor: book.placeholder ? 'default' : 'pointer',
                                position: 'relative',
                                animationDelay: `${index * 0.1}s`,
                                opacity: book.placeholder ? 0.6 : 1,
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center'
                            }}
                        >
                            {book.placeholder && <div className="placeholder-tag">Coming Soon</div>}

                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: `${book.color}15`,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '36px',
                                marginBottom: '20px',
                                color: book.color
                            }}>
                                {book.icon}
                            </div>

                            <h3 style={{
                                fontSize: '24px',
                                fontWeight: 800,
                                marginBottom: '16px',
                                color: '#1e293b'
                            }}>
                                {book.label}
                            </h3>

                            {!book.placeholder && (
                                <div style={{
                                    marginTop: 'auto',
                                    color: book.color,
                                    fontWeight: 700,
                                    fontSize: '14px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Explore Now
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
