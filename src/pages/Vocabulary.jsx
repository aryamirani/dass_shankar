import React from 'react'

export default function Vocabulary({onStart, onBack}){
  const bg = '/assets/alphabet.jpg'
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',backgroundImage:`linear-gradient(rgba(255,255,255,0.55), rgba(255,255,255,0.55)), url(${bg})`,backgroundSize:'cover',backgroundPosition:'center',backgroundRepeat:'no-repeat'}}>
      <style>{`
        @keyframes popIn { 0% { opacity: 0; transform: translateY(30px) scale(0.98); } 60% { transform: translateY(-8px) scale(1.02); opacity: 1; } 100% { transform: translateY(0) scale(1); } }
        @keyframes floatB { 0%{transform:translateY(0)}50%{transform:translateY(-6px)}100%{transform:translateY(0)} }
      `}</style>
      <div style={{position:'absolute',left:20,top:20}}>
        <button className="action-btn" onClick={onBack} style={{padding:'8px 12px'}}>Back</button>
      </div>
      <div style={{textAlign:'center',background:'rgba(255,255,255,0.0)',padding:20}}>
        <h1 style={{fontSize:'clamp(48px, 12vw, 120px)',letterSpacing:4,margin:0,fontWeight:900,display:'inline-block',lineHeight:1,background:'linear-gradient(90deg,#ff8a00,#ff3d81,#6a11cb)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent',textShadow:'0 10px 30px rgba(106,17,203,0.08)',animation:'popIn 700ms cubic-bezier(.2,.9,.2,1) both'}}>
          Vocabulary
        </h1>
        <div style={{height:12}} />
        <div style={{fontSize:20,color:'#333',opacity:0.95,marginTop:6,animation:'popIn 700ms cubic-bezier(.2,.9,.2,1) 120ms both'}}>Start learning words with fun activities</div>
        <div style={{height:24}} />
        <button className="action-btn" onClick={onStart} style={{padding:'14px 30px',fontSize:20,animation:'popIn 700ms cubic-bezier(.2,.9,.2,1) 260ms both',transformOrigin:'center'}} onMouseEnter={e=>{ e.currentTarget.style.animation = 'floatB 900ms ease-in-out infinite'}} onMouseLeave={e=>{ e.currentTarget.style.animation = 'popIn 700ms cubic-bezier(.2,.9,.2,1) 260ms both'}}>
          Start now
        </button>
      </div>
    </div>
  )
}
