import React from 'react'

import CONDITIONS from '../data/conditions'

export default function HealthProblems({ onStart, onSelect, completed = [], allDone = false, onAllDone, onVocabulary, onBack }) {
  const [page, setPage] = React.useState(0);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(CONDITIONS.length / itemsPerPage);

  const displayedConditions = CONDITIONS.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <div id="landing" className="landing-root" role="main">
      <div className="landing-inner">
        <div style={{ position: 'absolute', left: 20, top: 20, zIndex: 40 }}>
          <button className="action-btn secondary" style={{ padding: '8px 14px', fontSize: 16, minHeight: 40 }} onClick={onBack}>Back</button>
        </div>
        <div style={{ position: 'absolute', right: 20, top: 20, zIndex: 40 }}>
          <button className="action-btn secondary" style={{ padding: '8px 14px', fontSize: 16, minHeight: 40 }} onClick={onAllDone || onStart}>Skip to Assessment</button>
        </div>
        <h1 className="center-title" style={{ marginBottom: 32 }}>Health Problems</h1>
        <div className="health-grid" role="list">
          {displayedConditions.map((c, i) => {
            const globalIndex = page * itemsPerPage + i;
            const done = completed.includes(c.id);
            return (
              <button
                key={c.id}
                className={"health-grid-item" + (done ? ' completed' : '')}
                onClick={() => !done && onSelect(globalIndex)}
                aria-label={c.title}
                title={c.title}
                disabled={done}
                tabIndex={0}
                style={{ animation: `popIn 0.5s cubic-bezier(.5,1.8,.5,1) ${(i * 0.04).toFixed(2)}s both` }}
              >
                <img src={c.img} alt={c.title} className="health-img" />
                <div className="health-label">{c.title}</div>
                {done && (
                  <span className="tick big-tick">✓</span>
                )}
              </button>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            {page < totalPages - 1 && (
              <button
                className="action-btn secondary"
                style={{ borderRadius: '50%', width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, padding: 0 }}
                onClick={() => setPage(p => p + 1)}
              >
                →
              </button>
            )}
            {page > 0 && (
              <button
                className="action-btn secondary"
                style={{ borderRadius: '50%', width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, padding: 0 }}
                onClick={() => setPage(p => p - 1)}
              >
                ←
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
