import React from 'react'

const BOOKS = [
    { id: 'book-a', label: 'Book A', description: 'Master foundational concepts with interactive exercises.', icon: '📖', color: 'hsl(230, 100%, 65%)' },
    { id: 'book-e', label: 'Book E', description: 'Explore advanced topics and creative challenges.', icon: '📘', color: 'hsl(280, 80%, 65%)', placeholder: true },
    { id: 'book-i', label: 'Book I', description: 'Deep dive into specialized learning modules.', icon: '📗', color: 'hsl(150, 80%, 45%)', placeholder: true },
    { id: 'book-o', label: 'Book O', description: 'Practical applications and real-world scenarios.', icon: '📙', color: 'hsl(30, 90%, 60%)', placeholder: true },
    { id: 'book-u', label: 'Book U', description: 'Capstone projects and comprehensive reviews.', icon: '📕', color: 'hsl(0, 80%, 60%)', placeholder: true },
]

export default function GradeOverview({ gradeName, onBookClick }) {
    return (
        <div style={{
            minHeight: '100%',
            background: 'linear-gradient(135deg, hsl(230, 80%, 12%) 0%, hsl(230, 80%, 8%) 100%)',
            padding: '60px 40px',
            color: 'white',
            fontFamily: "'Outfit', 'Inter', sans-serif"
        }}>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .book-card {
                    animation: fadeInUp 0.6s ease-out forwards;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .book-card:hover {
                    transform: translateY(-10px);
                    background: hsla(0, 0%, 100%, 0.08) !important;
                    border-color: hsla(0, 0%, 100%, 0.2) !important;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4) !important;
                }
                .placeholder-tag {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: hsla(0, 0%, 100%, 0.1);
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: #94a3b8;
                }
            `}</style>

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{
                        fontSize: 'clamp(32px, 5vw, 56px)',
                        fontWeight: 900,
                        marginBottom: '16px',
                        letterSpacing: '-2px',
                        background: 'linear-gradient(to right, #fff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        {gradeName}
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        color: '#94a3b8',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Select a book to begin your learning journey. Each book contains specialized modules tailored for your progress.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '30px'
                }}>
                    {BOOKS.map((book, index) => (
                        <div
                            key={book.id}
                            className="book-card"
                            onClick={() => !book.placeholder && onBookClick(book.id === 'book-a' ? (gradeName.includes('Grade 2') ? 'book-a-grade-x2' : 'book-a-grade-x') : book.id)}
                            style={{
                                background: 'hsla(0, 0%, 100%, 0.03)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid hsla(0, 0%, 100%, 0.05)',
                                borderRadius: '32px',
                                padding: '40px',
                                cursor: book.placeholder ? 'default' : 'pointer',
                                position: 'relative',
                                animationDelay: `${index * 0.1}s`,
                                opacity: book.placeholder ? 0.6 : 1
                            }}
                        >
                            {book.placeholder && <div className="placeholder-tag">Coming Soon</div>}

                            <div style={{
                                width: '70px',
                                height: '70px',
                                background: `${book.color}20`,
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '32px',
                                marginBottom: '24px',
                                border: `1px solid ${book.color}40`,
                                boxShadow: `0 10px 20px ${book.color}20`
                            }}>
                                {book.icon}
                            </div>

                            <h3 style={{
                                fontSize: '24px',
                                fontWeight: 800,
                                marginBottom: '12px',
                                color: 'white'
                            }}>
                                {book.label}
                            </h3>

                            <p style={{
                                color: '#94a3b8',
                                lineHeight: '1.6',
                                fontSize: '15px'
                            }}>
                                {book.description}
                            </p>

                            {!book.placeholder && (
                                <div style={{
                                    marginTop: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: book.color,
                                    fontWeight: 700,
                                    fontSize: '14px'
                                }}>
                                    EXPLORE NOW →
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
