import React from 'react'

import CONDITIONS from '../data/conditions'

export default function Landing({onStart, onSelect, completed = [], allDone = false, onAllDone}){
  return (
    <div id="landing" className="landing-root" role="main">
      <div className="landing-inner">
        <div style={{position:'absolute', right:20, top:20, zIndex:40}}>
          <button className="action-btn secondary" style={{padding:'8px 14px', fontSize:16, minHeight:40}} onClick={onAllDone || onStart}>Skip to Assessment</button>
        </div>
        <div className="circle-menu" role="list">
          {CONDITIONS.map((c,i)=> {
            const done = completed.includes(c.id)
            return (
              <button key={c.id} className={"circle-item" + (done ? ' completed' : '')} onClick={()=>!done && onSelect(i)} aria-label={c.title} title={c.title} disabled={done}>
                <img src={c.img} alt={c.title} />
                {done && <span className="tick">✓</span>}
              </button>
            )
          })}
          <div className="circle-center">
            {allDone ? (
              <button className="action-btn" onClick={onAllDone || onStart}>Next</button>
            ) : (
              <h1 className="center-title">Health Problems</h1>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
