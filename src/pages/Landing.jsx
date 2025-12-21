import React from 'react'

import CONDITIONS from '../data/conditions'

export default function Landing({onStart, onSelect}){
  return (
    <div id="landing" className="landing-root" role="main">
      <div className="landing-inner">
        <div className="circle-menu" role="list">
          {CONDITIONS.map((c,i)=> (
            <button key={c.id} className="circle-item" onClick={()=>onSelect(i)} aria-label={c.title} title={c.title}>
              <img src={c.img} alt={c.title} />
            </button>
          ))}
          <div className="circle-center" aria-hidden="true">
            <h1 className="center-title">Health Problems</h1>
          </div>
        </div>

        
      </div>
    </div>
  )
}
