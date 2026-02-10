import React from 'react'

import CONDITIONS from '../../../data/conditions'

export default function HealthProblems({ onStart, onSelect, completed = [], allDone = false, onAllDone, onVocabulary, onBack, onNextExercise, mode = 'learn' }) {
  const [page, setPage] = React.useState(0);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(CONDITIONS.length / itemsPerPage);

  const displayedConditions = CONDITIONS.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <div id="landing" className="landing-root" role="main" style={{ position: 'relative' }}>
      <div className="landing-inner" style={{ paddingTop: 'clamp(60px, 10vh, 100px)' }}>
        <h1 className="center-title" style={{ marginBottom: 40, fontSize: 'clamp(28px, 5vw, 42px)', width: '100%', textAlign: 'center' }}>Health Problems</h1>
        <div className="health-grid" role="list">
          {displayedConditions.map((c, i) => {
            const globalIndex = page * itemsPerPage + i;
            const done = completed.includes(c.id);
            return (
              <button
                key={c.id}
                className={"health-grid-item" + (done ? ' completed' : '')}
                onClick={() => onSelect(globalIndex)}
                aria-label={c.title}
                title={c.title}
                disabled={done && mode !== 'test'}
                tabIndex={0}
                style={{ animation: `popIn 0.5s cubic-bezier(.5,1.8,.5,1) ${(i * 0.04).toFixed(2)}s both`, width: '100%', maxWidth: '420px' }}
              >
                <img src={c.img} alt={c.title} className="health-img" style={{ width: '100%', height: 'auto', maxHeight: 260, objectFit: 'contain' }} />
                <div className="health-label" style={{ fontSize: 'clamp(18px, 4vw, 24px)' }}>{c.title}</div>
                {done && (
                  <span className="tick big-tick">✓</span>
                )}
              </button>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', marginTop: 20, gap: 20, justifyContent: page > 0 ? 'space-between' : 'flex-end' }}>
            {page > 0 && (
              <button
                className="action-btn secondary"
                style={{ borderRadius: 50, minWidth: 'clamp(60px, 10vw, 100px)', height: 'clamp(40px, 8vw, 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(18px, 4vw, 24px)', padding: '0 30px' }}
                onClick={() => setPage(p => p - 1)}
              >
                ←
              </button>
            )}
            {page < totalPages - 1 && (
              <button
                className="action-btn secondary"
                style={{ borderRadius: 50, minWidth: 100, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, padding: '0 30px' }}
                onClick={() => setPage(p => p + 1)}
              >
                →
              </button>
            )}
          </div>

        )}

        {Object.keys(completed).length >= CONDITIONS.length && (
          <div style={{ textAlign: 'center', marginTop: 40, paddingBottom: 40 }}>
            <h2 style={{ color: '#2e7d32', marginBottom: 20 }}>All topics completed! 🎉</h2>
            <button
              onClick={onNextExercise}
              style={{
                padding: '16px 32px',
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
                transition: 'transform 0.2s',
                animation: 'popIn 600ms cubic-bezier(.2,.9,.2,1) 200ms both'
              }}
              onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
            >
              Next: Assessment →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
