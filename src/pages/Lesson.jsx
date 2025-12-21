import React, {useState, useRef, useEffect} from 'react'

const ALL_ITEMS = [
  {id:'medicine', src:'/assets/medicine.png'},
  {id:'thermometer', src:'/assets/thermometer.png'},
  {id:'firstaid', src:'/assets/firstaid.png'},
  {id:'bed', src:'/assets/bed.png'},
  {id:'hotdrink', src:'/assets/hotdrink.png'},
  {id:'food', src:'/assets/food.png'},
  {id:'tissue', src:'/assets/tissue.png'},
  {id:'toilet', src:'/assets/toilet.png'},
  {id:'wetcloth', src:'/assets/wetcloth.png'},
  {id:'facemask', src:'/assets/facemask.png'}
]

export default function Lesson({data, index, total, onBack, onNext, onComplete}){
  const [phase, setPhase] = useState('showCondition') // showCondition -> exercise -> healed
  const [autoApplied, setAutoApplied] = useState([])
  const [dropped, setDropped] = useState([])
  const [success, setSuccess] = useState(false)
  const [health, setHealth] = useState(0)
  const [feedback, setFeedback] = useState(null) // {type: 'tick' or 'cross', x, y}
  const confettiRef = useRef(null)
  const completeCalledRef = useRef(false)

  // scene timing: show boy -> then condition
  useEffect(()=>{
    // when condition changes, start by showing the condition (sick boy image) and its speech bubble
    setPhase('showCondition')
    setAutoApplied([])
    setDropped([])
    setSuccess(false)
    setHealth(0)
    setFeedback(null)
    completeCalledRef.current = false
  },[data])

  // for cold: auto-apply items then show healed then exercise
  // no auto sequence here; flow: showCondition -> exercise when user presses Help

  useEffect(()=>{
    // check success for exercises where there are required items
    const required = (data.items || []).slice()
    if(required.length === 0) return
    const correctDropped = dropped.filter(id => required.includes(id))
    setHealth(correctDropped.length / required.length)
    if(correctDropped.length === required.length){
      setSuccess(true)
      launchConfetti()
      // show healed image
      setPhase('healed')
      // notify parent once
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
    // show feedback
    const rect = e.target.getBoundingClientRect()
    setFeedback({type: isCorrect ? 'tick' : 'cross', x: e.clientX - rect.left, y: e.clientY - rect.top})
    setTimeout(() => setFeedback(null), 1000)
    if(!dropped.includes(id)) setDropped(prev=>[...prev,id])
  }

  function launchConfetti(){
    const c = confettiRef.current
    if(!c) return
    const ctx = c.getContext('2d')
    const w = c.width = window.innerWidth
    const h = c.height = window.innerHeight
    const pieces = []
    for(let i=0;i<180;i++) pieces.push({x:Math.random()*w,y:Math.random()*h- h,vx:(Math.random()-0.5)*4,vy:Math.random()*4+2,color:`hsl(${Math.random()*360},80%,60%)`,r:Math.random()*6+4})
    let t=0
    const raf = ()=>{
      ctx.clearRect(0,0,w,h)
      pieces.forEach(p=>{p.x+=p.vx; p.y+=p.vy; p.vy+=0.05; ctx.fillStyle=p.color; ctx.fillRect(p.x,p.y,p.r,p.r)})
      t++
      if(t<200) requestAnimationFrame(raf)
      else ctx.clearRect(0,0,w,h)
    }
    requestAnimationFrame(raf)
  }

  function speak(text){
    if(!('speechSynthesis' in window)) return
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.9
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(u)
  }

  return (
    <div className="lesson-root">
      <div className="top-row">
        <button className="action-btn secondary" onClick={onBack}>Back</button>
        <div style={{textAlign:'center'}}>
          <h2 className="lesson-title">{data.title}</h2>
          <div className="progress">Page {index+1} of {total}</div>
        </div>
        <div style={{width:120}} />
      </div>

      <div className="scene">
        {phase === 'showCondition' && (
          <div className="fade-enter-active" style={{display:'flex', alignItems:'center', gap:18}}>
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:30}}>
              <img src={data.img} alt={data.title} style={{width:420}} />
              <div className="controls-row">
                <button className="action-btn" onClick={()=> setPhase('exercise')}>Help him</button>
              </div>
            </div>
            <div className="speech-cloud bubble-from-mouth">
              {data.lines.map((l,i)=>(<div key={i}>{l}</div>))}
            </div>
          </div>
        )}

        {phase === 'exercise' && (
          <div style={{width:'100%'}}>
            <div style={{textAlign:'center', marginBottom:18}}>
              <div className="subtitle" style={{fontSize:28, fontWeight:'bold', textShadow:'2px 2px 4px rgba(0,0,0,0.5)', color:'#333'}}>Drag the helpful items to the child.</div>
              <div style={{width:400, height:30, border:'4px solid #333', borderRadius:15, margin:'0 auto', boxShadow:'0 4px 8px rgba(0,0,0,0.2)'}}>
                <div style={{width:`${health * 100}%`, height:'100%', backgroundColor:'green', borderRadius:12, transition:'width 0.5s'}}></div>
              </div>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div style={{position:'relative', marginLeft: '20%'}}>
                <img src={data.img} alt="Sick" style={{width:360}} onDragOver={(e)=>e.preventDefault()} onDrop={onDrop} />
                {feedback && (
                  <div style={{position:'absolute', left: feedback.x - 20, top: feedback.y - 20, fontSize:40, color: feedback.type === 'tick' ? 'green' : 'red'}}>
                    {feedback.type === 'tick' ? '✓' : '✗'}
                  </div>
                )}
              </div>
              <div className="items-list" aria-label="Draggable items" style={{display:'flex',flexWrap:'wrap',gap:16,justifyContent:'center', maxWidth:'50%'}}>
                {ALL_ITEMS.map(it=> (
                  <div key={it.id} className="draggable-item" draggable={!dropped.includes(it.id)} onDragStart={(e)=>onDragStart(e,it)} style={{opacity: dropped.includes(it.id) ? 0.5 : 1}}>
                    <img src={it.src} alt={it.id} style={{width:240,height:240,borderRadius:12}} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {phase === 'healed' && (
          <div className="fade-enter-active" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:18}}>
            <img src={'/assets/boy.png'} alt="Healed" style={{width:360}} />
            <div className="speech-cloud">I feel better.</div>
            <div className="controls-row">
              <button className="action-btn" onClick={onBack}>Go Home</button>
            </div>
          </div>
        )}
      </div>

      {success && (
        <div className="success-overlay">
          <canvas ref={confettiRef} className="confetti-canvas" />
        </div>
      )}
    </div>
  )
}
