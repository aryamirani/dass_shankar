import React from 'react'

export default function Vocabulary({onStart, onBack}){
  const bg = '/assets/alphabet.jpg'
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',backgroundImage:`linear-gradient(rgba(255,255,255,0.55), rgba(255,255,255,0.55)), url(${bg})`,backgroundSize:'cover',backgroundPosition:'center',backgroundRepeat:'no-repeat'}}>
      <div style={{position:'absolute',left:20,top:20}}>
        <button className="action-btn" onClick={onBack} style={{padding:'8px 12px'}}>Back</button>
      </div>
      <div style={{textAlign:'center',background:'rgba(255,255,255,0.0)',padding:20}}>
        <h1 style={{fontSize:120,letterSpacing:6,margin:0,fontWeight:900,color:'#111'}}>VOCABULARY</h1>
        <div style={{height:30}} />
        <button className="action-btn" onClick={onStart} style={{padding:'14px 28px',fontSize:22}}>Start now</button>
      </div>
    </div>
  )
}
