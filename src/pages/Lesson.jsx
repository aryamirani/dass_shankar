import React, {useState, useRef, useEffect} from 'react'

const COLD_ITEMS = [
  {id:'thermometer', src:'/assets/thermometer.svg'},
  {id:'tissues', src:'/assets/tissues.svg'},
  {id:'mask', src:'/assets/mask.svg'},
  {id:'tea', src:'/assets/tea.svg'}
]

export default function Lesson({data, index, total, onBack, onNext}){
  const [phase, setPhase] = useState('showCondition') // showCondition -> waitingHelp -> exercise -> healed
  const [autoApplied, setAutoApplied] = useState([])
  const [dropped, setDropped] = useState([])
  const [success, setSuccess] = useState(false)
  const confettiRef = useRef(null)

  // scene timing: show boy -> then condition
  useEffect(()=>{
    // when condition changes, start by showing the condition (sick boy image) and its speech bubble
    setPhase('showCondition')
    setAutoApplied([])
    setDropped([])
    setSuccess(false)
  },[data])

  // for cold: auto-apply items then show healed then exercise
  // no auto sequence here; flow: showCondition -> waitingHelp (Help button appears) -> exercise when user presses Help

  useEffect(()=>{
    // check success for exercises where there are required items
    const required = (data.items || []).slice()
    if(required.length === 0) return
    if(required.every(r=>dropped.includes(r))){
      setSuccess(true)
      launchConfetti()
      // show healed image
      setPhase('healed')
    }
  },[dropped, data])

  function onDragStart(e,item){
    e.dataTransfer.setData('text/plain', item.id)
  }
  function onDrop(e){
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if(!id) return
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
          <div className="fade-enter-active" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:18}}>
            <img src={data.img} alt={data.title} style={{width:420}} />
            <div className="speech-cloud bubble-from-mouth">
              {data.lines.map((l,i)=>(<div key={i}>{l}</div>))}
            </div>
            <div className="controls-row">
              <button className="action-btn secondary" onClick={()=>speak(data.lines.join(' '))}>Speak</button>
              <button className="action-btn" onClick={()=> setPhase('waitingHelp')}>Help him</button>
            </div>
          </div>
        )}

        {phase === 'waitingHelp' && (
          <div className="fade-enter-active" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:18}}>
            <img src={data.img} alt={data.title} style={{width:420}} />
            <div className="speech-cloud">Tap Help to start the game.</div>
            <div className="controls-row">
              <button className="action-btn" onClick={()=> setPhase('exercise')}>Start Game</button>
            </div>
          </div>
        )}

        {phase === 'exercise' && (
          <div style={{width:'100%'}}>
            <div className="sick-stage" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
              <img src={data.img} alt="Sick" style={{width:360}} />
              <div className="subtitle">Drag the helpful items to the child.</div>
            </div>

            <div style={{marginTop:18,display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
              <div className="items-list" aria-label="Draggable items" style={{display:'flex',flexWrap:'wrap',gap:12,justifyContent:'center'}}>
                {(function(){
                  // build items: correct ones from data.items, fill with distractors to 10
                  const pool = []
                  const correct = (data.items||[])
                  correct.forEach(id=> pool.push({id, src: `/assets/${id === 'thermometer' ? 'thermometer.svg' : id === 'tissues' ? 'tissues.svg' : id === 'mask' ? 'mask.svg' : id === 'tea' ? 'tea.svg' : id + '.svg'}`}))
                  const distractors = ['item_a.svg','item_b.svg','item_c.svg','item_d.svg','item_e.svg','item_f.svg']
                  let i = 0
                  while(pool.length < 10){
                    const name = distractors[i % distractors.length]
                    pool.push({id: `d_${i}`, src: `/assets/${name}`})
                    i++
                  }
                  // shuffle
                  for(let j=pool.length-1;j>0;j--){const k=Math.floor(Math.random()*(j+1));[pool[j],pool[k]]=[pool[k],pool[j]]}
                  return pool.map(it=> (
                    <div key={it.id} className="draggable-item" draggable onDragStart={(e)=>onDragStart(e,it)}>
                      <img src={it.src} alt={it.id} style={{width:96,height:96,borderRadius:12}} />
                    </div>
                  ))
                })()}
              </div>

              <div className="drop-zone" onDragOver={(e)=>e.preventDefault()} onDrop={onDrop} tabIndex={0} aria-label="Drop zone" style={{marginTop:12,minHeight:120,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <div>Drop items here</div>
                <div className="dropped-list" style={{marginTop:8,display:'flex',gap:8,flexWrap:'wrap'}}>
                  {dropped.map(id=> <div key={id} className={'dropped correct'}>{id}</div>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === 'healed' && (
          <div className="fade-enter-active" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:18}}>
            <img src={'/assets/boy.png'} alt="Healed" style={{width:360}} />
            <div className="speech-cloud">I feel better.</div>
            <div className="controls-row">
              <div className="subtitle">Tap another image to learn more.</div>
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
