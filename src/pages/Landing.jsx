import React from 'react'

import CONDITIONS from '../data/conditions'

export default function Landing({onStart, onSelect, completed = [], allDone = false, onAllDone, onVocabulary}) {
  return (
    <div id="landing" className="landing-root" role="main">
      <div className="landing-inner">
        <div style={{position:'absolute', left:20, top:20, zIndex:40}}>
          <button className="action-btn secondary" style={{padding:'8px 14px', fontSize:16, minHeight:40}} onClick={onVocabulary}>Go to Next Section</button>
        </div>
        <div style={{position:'absolute', right:20, top:20, zIndex:40}}>
          <button className="action-btn secondary" style={{padding:'8px 14px', fontSize:16, minHeight:40}} onClick={onAllDone || onStart}>Skip to Assessment</button>
        </div>
        <h1 className="center-title" style={{marginBottom: 32}}>Health Problems</h1>
        <div className="health-grid" role="list">
          {CONDITIONS.map((c, i) => {
            const done = completed.includes(c.id);
            return (
              <button
                key={c.id}
                className={"health-grid-item" + (done ? ' completed' : '')}
                onClick={() => !done && onSelect(i)}
                aria-label={c.title}
                title={c.title}
                disabled={done}
                tabIndex={0}
                style={{animation: `popIn 0.5s cubic-bezier(.5,1.8,.5,1) ${(i*0.04).toFixed(2)}s both`}}
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
      </div>
    </div>
  );
}
