import React, {useState, useRef, useEffect} from 'react'

const POSITIVE_FEEDBACKS = [
  'Great work!',
  'Good job!',
  'Wow!',
  'Amazing!',
  'Awesome!',
  'You did it!',
  'Super!',
  'Fantastic!',
  'Nice!',
  'Brilliant!'
];

const ALL_ITEMS = [
  {id:'medicine', src:'/assets/medicine.png'},
  {id:'thermometer', src:'/assets/thermometer.png'},
  {id:'firstaid', src:'/assets/firstaid.png'},
  {id:'hotdrink', src:'/assets/hotdrink.png'},
  {id:'food', src:'/assets/food.png'},
  {id:'tissue', src:'/assets/tissue.png'},
  {id:'toilet', src:'/assets/toilet.png'},
  {id:'wetcloth', src:'/assets/wetcloth.png'}
]

export default function Lesson({data, index, total, onBack, onNext, onComplete}){
  const [phase, setPhase] = useState('exercise')
  const [dropped, setDropped] = useState([])
  const [success, setSuccess] = useState(false)
  const [health, setHealth] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [positiveMsg, setPositiveMsg] = useState(null)
  const confettiRef = useRef(null)
  const completeCalledRef = useRef(false)

  useEffect(()=>{
    setPhase('exercise')
    setDropped([])
    setSuccess(false)
    setHealth(0)
    setFeedback(null)
    completeCalledRef.current = false
  },[data])

  useEffect(()=>{
    const required = (data.items || []).slice()
    if(required.length === 0) return
    const correctDropped = dropped.filter(id => required.includes(id))
    setHealth(correctDropped.length / required.length)
    if(correctDropped.length === required.length){
      setSuccess(true)
      launchConfetti()
      setPhase('healed')
      if(onComplete && !completeCalledRef.current){
        onComplete(data.id || data.title)
        completeCalledRef.current = true
      }
    }
  },[dropped, data])

  function onDragStart(e,item){
    e.dataTransfer.setData('text/plain', item.id)
  }

  function onDrop(e){
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if(!id || dropped.includes(id)) return
    const required = data.items || []
    const isCorrect = required.includes(id)
    
    const rect = e.currentTarget.getBoundingClientRect()
    setFeedback({type: isCorrect ? 'tick' : 'cross', x: e.clientX - rect.left, y: e.clientY - rect.top})
    setTimeout(()=>setFeedback(null), 1000)

    if(isCorrect) {
      const msg = POSITIVE_FEEDBACKS[Math.floor(Math.random()*POSITIVE_FEEDBACKS.length)]
      setPositiveMsg(msg)
      setTimeout(()=>setPositiveMsg(null), 1200)
    }
    setDropped(prev=>[...prev,id])
  }

  function launchConfetti(){
    const c = confettiRef.current
    if(!c) return
    const ctx = c.getContext('2d')
    const w = c.width = window.innerWidth
    const h = c.height = window.innerHeight
    const pieces = []
    for(let i=0;i<180;i++) pieces.push({x:Math.random()*w,y:Math.random()*h-h,vx:(Math.random()-0.5)*4,vy:Math.random()*4+2,color:`hsl(${Math.random()*360},80%,60%)`,r:Math.random()*6+4})
    let t=0
    const raf = ()=>{
      ctx.clearRect(0,0,w,h)
      pieces.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=0.05;ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,p.r,p.r)})
      t++
      if(t<200) requestAnimationFrame(raf)
      else ctx.clearRect(0,0,w,h)
    }
    requestAnimationFrame(raf)
  }

  return (
    <div className="lesson-root" style={{display:'flex',flexDirection:'column',height:'100vh',padding:'20px',boxSizing:'border-box'}}>
      {positiveMsg && (
        <div style={{position:'fixed',top:40,left:'50%',transform:'translateX(-50%)',background:'white',color:'#1976d2',fontWeight:'bold',fontSize:32,borderRadius:15,padding:'10px 30px',zIndex:2000,border:'3px solid #1976d2',boxShadow:'0 4px 15px rgba(0,0,0,0.2)'}}>
          {positiveMsg}
        </div>
      )}

      <div className="top-nav" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <button className="action-btn" style={{padding:'10px 25px',cursor:'pointer'}} onClick={onBack}>Back</button>
        <div style={{textAlign:'center'}}>
          <h2 style={{margin:0}}>{data.title}</h2>
          <div style={{fontSize:14}}>Page {index+1} of {total}</div>
        </div>
        <div style={{width:80}}></div>
      </div>

      <div className="main-content" style={{display:'flex',flexDirection:'column',flex:1}}>
        {phase === 'exercise' && (
          <>
            {/* Progress Bar Section - Above Everything */}
            <div style={{display:'flex',alignItems:'center',gap:20,background:'rgba(255,255,255,0.7)',padding:15,borderRadius:15,marginBottom:30,maxWidth:'1200px',width:'100%',margin:'0 auto 30px'}}>
              <span style={{fontSize:20,fontWeight:'bold',color:'#333',whiteSpace:'nowrap'}}>Drag the helpful items:</span>
              <div style={{flex:1,height:25,background:'#ddd',borderRadius:15,overflow:'hidden',border:'2px solid #333'}}>
                <div style={{width:`${health*100}%`,height:'100%',background:'linear-gradient(90deg, #4caf50, #8bc34a)',transition:'width 0.4s'}} />
              </div>
            </div>

            {/* Main Content Area */}
            <div style={{display:'flex',gap:'40px',alignItems:'flex-start',justifyContent:'center',width:'100%',maxWidth:'1200px',margin:'0 auto',flex:1}}>
              {/* Character and Text Side by Side */}
              <div style={{display:'flex',flexDirection:'row',gap:32,flex:'0 0 700px',alignItems:'center'}}>
                {/* Character Drop Zone */}
                <div onDrop={onDrop} onDragOver={e=>e.preventDefault()} style={{position:'relative',width:340,height:350,border:'4px dashed #1976d2',borderRadius:25,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'rgba(25,118,210,0.05)'}}>
                  <div style={{position:'absolute',top:-15,background:'white',padding:'2px 15px',border:'2px solid #1976d2',borderRadius:10,fontWeight:'bold',color:'#1976d2'}}>Drop Here</div>
                  <img src={data.img} alt="character" style={{height:'80%',objectFit:'contain'}} />
                  {feedback && (
                    <div style={{position:'absolute',left:feedback.x,top:feedback.y,fontSize:60,fontWeight:'bold',color:feedback.type==='tick'?'green':'red',textShadow:'2px 2px 4px rgba(0,0,0,0.3)',zIndex:5}}>
                      {feedback.type==='tick'?'✓':'✗'}
                    </div>
                  )}
                </div>
                {/* Text Box */}
                <div className="speech-cloud" style={{background:'#fff',padding:20,borderRadius:20,boxShadow:'0 4px 10px rgba(0,0,0,0.1)',border:'1px solid #eee',minWidth:280,maxWidth:340}}>
                  <h3 style={{marginTop:0}}>What the child says:</h3>
                  <ul style={{fontSize:18,lineHeight:'1.5'}}>
                    {data.lines.map((l,i)=>(
                      <li key={i} dangerouslySetInnerHTML={{__html: l}} />
                    ))}
                  </ul>
                </div>
              </div>
              {/* Right Side: Draggable Items in 2 Columns */}
              <div className="items-grid" style={{display:'grid',gridTemplateColumns:'repeat(2, 1fr)',gap:15,flex:'0 0 400px'}}>
                {ALL_ITEMS.map((item)=>{
                  const isUsed = dropped.includes(item.id);
                  const isCorrect = data.items.includes(item.id);
                  return (
                    <div 
                      key={item.id} 
                      draggable={!isUsed} 
                      onDragStart={e=>onDragStart(e,item)}
                      style={{
                        position:'relative',
                        background:'white',
                        padding:15,
                        borderRadius:15,
                        boxShadow:'0 2px 5px rgba(0,0,0,0.1)',
                        cursor: isUsed ? 'default' : 'grab',
                        opacity: isUsed ? 0.6 : 1,
                        display:'flex',
                        justifyContent:'center',
                        alignItems:'center',
                        height:120
                      }}
                    >
                      <img src={item.src} alt={item.id} style={{width:'195px',height:'145px',objectFit:'contain'}} />
                      {isUsed && (
                        <div style={{position:'absolute',fontSize:40,color:isCorrect?'green':'red',fontWeight:'bold'}}>
                          {isCorrect?'✓':'✗'}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {phase === 'healed' && (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginTop:50}}>
            <img src={'/assets/boy.png'} alt="happy" style={{width:300}} />
            <h2 style={{color:'#2e7d32'}}>I feel much better now!</h2>
            <button className="action-btn" onClick={()=>{
              if (typeof onNext === 'function') onNext();
            }} style={{padding:'15px 40px',fontSize:20}}>Next</button>
          </div>
        )}
      </div>

      {success && <canvas ref={confettiRef} style={{position:'fixed',top:0,left:0,pointerEvents:'none',zIndex:1500}} />}
    </div>
  )
}