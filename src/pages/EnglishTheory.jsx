import React from 'react'

export default function EnglishTheory({ onBack }) {
    const words = [
        { partA: 'post', partB: 'box', result: 'Postbox' },
        { partA: 'pop', partB: 'corn', result: 'Popcorn' },
        { partA: 'print', partB: 'out', result: 'Printout' },
        { partA: 'road', partB: 'side', result: 'Roadside' },
        { partA: 'rail', partB: 'way', result: 'Railway' },
        { partA: 'rain', partB: 'bow', result: 'Rainbow' },
        { partA: 'super', partB: 'man', result: 'Superman' },
        { partA: 'some', partB: 'thing', result: 'Something' },
        { partA: 'salt', partB: 'water', result: 'Saltwater' },
        { partA: 'thunder', partB: 'storm', result: 'Thunderstorm' },
        { partA: 'time', partB: 'table', result: 'Timetable' },
        { partA: 'tea', partB: 'spoon', result: 'Teaspoon' },
        { partA: 'up', partB: 'stairs', result: 'Upstairs' },
        { partA: 'under', partB: 'ground', result: 'Underground' },
        { partA: 'user', partB: 'name', result: 'Username' },
        { partA: 'with', partB: 'out', result: 'Without' },
        { partA: 'water', partB: 'colour', result: 'Watercolour' },
        { partA: 'week', partB: 'day', result: 'Weekday' },
    ]

    return (
        <div style={{ minHeight: '100vh', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: 1000, position: 'relative' }}>
                <button className="action-btn secondary" onClick={onBack} style={{ position: 'absolute', left: 0, top: 0, padding: '8px 16px', fontSize: 16, minHeight: 40 }}>
                    Back
                </button>

                <h1 style={{ textAlign: 'center', color: '#4a90e2', fontSize: 40, marginTop: 10 }}>Compound Words</h1>

                <div style={{
                    backgroundColor: '#e3f2fd',
                    borderLeft: '5px solid #4a90e2',
                    padding: 24,
                    margin: '30px 0',
                    borderRadius: 12
                }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: 24 }}>The Theory: What is a Compound Word?</h3>
                    <p style={{ fontSize: 18, lineHeight: 1.5 }}>A compound word is made when <strong>two smaller words</strong> join together to create a <strong>new word</strong> with a completely new meaning.</p>

                    <div style={{
                        fontSize: '1.8em',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        margin: '20px 0',
                        color: '#ff6b6b',
                        background: '#fff0f0',
                        padding: 16,
                        borderRadius: 12,
                        border: '2px dashed #ff6b6b'
                    }}>
                        Word 1 + Word 2 = New Word
                    </div>

                    <p style={{ fontSize: 18 }}><em>Example:</em> "Rain" (water from the sky) + "Bow" (a tied ribbon) = <strong>Rainbow</strong> (colorful arc in the sky).</p>
                </div>

                <h3 style={{ textAlign: 'center', fontSize: 28 }}>Matches from Class</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 20,
                    paddingBottom: 40
                }}>
                    {words.map((w, i) => (
                        <div key={i} style={{
                            background: 'white',
                            border: '2px solid #ddd',
                            borderRadius: 12,
                            padding: 20,
                            textAlign: 'center',
                            fontSize: 22,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                            transition: 'transform 0.2s',
                            cursor: 'default'
                        }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.borderColor = '#4a90e2';
                                e.currentTarget.style.boxShadow = '0 5px 15px rgba(74, 144, 226, 0.2)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.borderColor = '#ddd';
                                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';
                            }}
                        >
                            <span style={{ color: '#4a90e2', fontWeight: 'bold' }}>{w.partA}</span>
                            {' + '}
                            <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>{w.partB}</span>
                            <span style={{ color: '#999', margin: '0 8px' }}>=</span>
                            <span style={{ fontWeight: 800, color: '#333' }}>{w.result}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
