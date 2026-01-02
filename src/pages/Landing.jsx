import React from 'react'

export default function Landing({onVocabulary, onHealth, onMaths}){
  return (
    <div id="landing" className="landing-root" role="main">
      <div className="landing-inner" style={{padding:40}}>
        <h1 style={{fontSize:64, lineHeight:1, margin:8, fontWeight:900}}>WELCOME TO SHANKAR FOUNDATION</h1>
        <h2 style={{fontSize:24, color:'#444', marginTop:12}}>Choose a module</h2>

        <div style={{display:'flex',gap:20,justifyContent:'center',marginTop:36}}>
          <button className="action-btn" onClick={onVocabulary} style={{padding:'18px 28px', fontSize:20}}>Vocabulary</button>
          <button className="action-btn" onClick={onHealth} style={{padding:'18px 28px', fontSize:20}}>Health Problems</button>
          <button className="action-btn" onClick={onMaths} style={{padding:'18px 28px', fontSize:20}}>Maths</button>
        </div>
      </div>
    </div>
  )
}
