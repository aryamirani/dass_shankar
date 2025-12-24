import React, {useState, useRef, useEffect} from 'react'
// Positive feedback messages
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
  {id:'bed', src:'/assets/bed.png'},
  {id:'hotdrink', src:'/assets/hotdrink.png'},
  {id:'food', src:'/assets/food.png'},
  {id:'tissue', src:'/assets/tissue.png'},
  {id:'toilet', src:'/assets/toilet.png'},
  {id:'wetcloth', src:'/assets/wetcloth.png'},
  {id:'facemask', src:'/assets/facemask.png'}
]

export default function Lesson({data, index, total, onBack, onNext, onComplete}){
  const [phase, setPhase] = useState('exercise') // start directly at drag-and-drop
  const [autoApplied, setAutoApplied] = useState([])
  const [dropped, setDropped] = useState([])
  const [success, setSuccess] = useState(false)
  const [health, setHealth] = useState(0)
  const [feedback, setFeedback] = useState(null) // {type: 'tick' or 'cross', x, y}
  const [positiveMsg, setPositiveMsg] = useState(null)
  const confettiRef = useRef(null)
  const completeCalledRef = useRef(false)

  // scene timing: show boy -> then condition
  useEffect(()=>{
    // when condition changes, start directly at drag-and-drop
    setPhase('exercise')
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
    if(isCorrect) {
      // Show random positive message
      const msg = POSITIVE_FEEDBACKS[Math.floor(Math.random() * POSITIVE_FEEDBACKS.length)]
      setPositiveMsg(msg)
      setTimeout(() => setPositiveMsg(null), 1200)
    }
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
      {positiveMsg && (
        <div style={{
          position: 'fixed',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.97)',
          color: '#1976d2',
          fontWeight: 'bold',
          fontSize: 36,
          borderRadius: 18,
          boxShadow: '0 4px 24px #1976d2aa',
          padding: '18px 48px',
          zIndex: 1000,
          border: '3px solid #1976d2',
          textShadow: '2px 2px 8px #fff, 0 0 8px #1976d2aa',
          animation: 'pop-in 0.2s',
        }}>
          {positiveMsg}
        </div>
      )}
      <div className="top-row">
        <button className="action-btn secondary" onClick={onBack}>Back</button>
        <div style={{textAlign:'center'}}>
          <h2 className="lesson-title">{data.title}</h2>
          <div className="progress">Page {index+1} of {total}</div>
        </div>
        <div style={{width:120}} />
      </div>


      <div className="scene">
        {phase === 'exercise' && (
          <div style={{width:'100%'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              <div style={{position:'relative', marginLeft: '10%'}}>
                <div style={{display:'flex', flexDirection:'column', alignItems:'center', position:'relative'}}>
                  <div
                    style={{
                      marginBottom: 8,
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: '#1976d2',
                      textShadow: '2px 2px 8px #fff, 0 0 8px #1976d2aa',
                      background: 'rgba(255,255,255,0.85)',
                      borderRadius: 12,
                      padding: '4px 20px',
                      border: '2px solid #1976d2',
                      zIndex: 2,
                      boxShadow: '0 2px 8px #1976d233',
                    }}
                  >
                    Drop Here
                  </div>
                  <img
                    src={data.img}
                    alt="Sick"
                    style={{
                      width: 360,
                      border: '4px dashed #1976d2',
                      borderRadius: 32,
                      boxShadow: '0 0 16px 2px #1976d2aa',
                      filter: 'drop-shadow(0 0 8px #1976d2aa)',
                      background: '#e3f2fd',
                      transition: 'box-shadow 0.3s, border 0.3s',
                    }}
                    onDragOver={e => e.preventDefault()}
                    onDrop={onDrop}
                  />
                </div>
                {feedback && (
                  <div style={{position:'absolute', left: feedback.x - 20, top: feedback.y - 20, fontSize:40, color: feedback.type === 'tick' ? 'green' : 'red'}}>
                    {feedback.type === 'tick' ? '✓' : '✗'}
                  </div>
                )}
              </div>
              <div style={{flex:1, marginLeft:40}}>
                <div className="speech-cloud bubble-from-mouth" style={{marginBottom:18}}>
                  <div style={{fontWeight:'bold', fontSize:22, marginBottom:8}}>What the child says:</div>
                  <ul style={{paddingLeft:24, margin:0}}>
                    {data.lines.map((l,i)=>{
                      // Bold the keywords that match required items
                      let line = l;
                      (data.items||[]).forEach(item=>{
                        if(item==='thermometer' && /thermometer|hot|temperature|warm/i.test(line)) line = line.replace(/(thermometer|hot|temperature|warm)/ig, '<b>$1</b>');
                        if(item==='tissue' && /tissue|wipe|wiping|nose/i.test(line)) line = line.replace(/(tissue|wipe|wiping|nose)/ig, '<b>$1</b>');
                        if(item==='facemask' && /mask|cover|mouth|cough/i.test(line)) line = line.replace(/(mask|cover|mouth|cough)/ig, '<b>$1</b>');
                        if(item==='hotdrink' && /warm|drink|cup/i.test(line)) line = line.replace(/(warm|drink|cup)/ig, '<b>$1</b>');
                        if(item==='medicine' && /medicine|pain|soothe|relief/i.test(line)) line = line.replace(/(medicine|pain|soothe|relief)/ig, '<b>$1</b>');
                        if(item==='bed' && /bed|lie down|rest|tired|quiet/i.test(line)) line = line.replace(/(bed|lie down|rest|tired|quiet)/ig, '<b>$1</b>');
                        if(item==='firstaid' && /first aid|soothe|cut|bandage|help/i.test(line)) line = line.replace(/(first aid|soothe|cut|bandage|help)/ig, '<b>$1</b>');
                        if(item==='wetcloth' && /wet|cloth|wipe|clean|cool/i.test(line)) line = line.replace(/(wet|cloth|wipe|clean|cool)/ig, '<b>$1</b>');
                        if(item==='toilet' && /toilet|poop|potty|bathroom/i.test(line)) line = line.replace(/(toilet|poop|potty|bathroom)/ig, '<b>$1</b>');
                        if(item==='food' && /food|eat|hungry/i.test(line)) line = line.replace(/(food|eat|hungry)/ig, '<b>$1</b>');
                      });
                      return <li key={i} style={{marginBottom:6}} dangerouslySetInnerHTML={{__html: line}} />
                    })}
                  </ul>
                </div>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:24, marginBottom:18}}>
                  <div className="subtitle" style={{fontSize:28, fontWeight:'bold', textShadow:'2px 2px 4px rgba(0,0,0,0.5)', color:'#333', margin:0}}>Drag the helpful items to the child.</div>
                  <div style={{width:320, height:30, border:'4px solid #333', borderRadius:15, boxShadow:'0 4px 8px rgba(0,0,0,0.2)'}}>
                    <div style={{width:`${health * 100}%`, height:'100%', backgroundColor:'green', borderRadius:12, transition:'width 0.5s'}}></div>
                  </div>
                </div>
                <div className="items-list" aria-label="Draggable items" style={{display:'flex',flexWrap:'wrap',gap:28,justifyContent:'center', maxWidth:'100%', marginTop:24}}>
                  {ALL_ITEMS.map(it=> {
                    const isDropped = dropped.includes(it.id);
                    let feedbackType = null;
                    if (isDropped) {
                      const required = data.items || [];
                      feedbackType = required.includes(it.id) ? 'tick' : 'cross';
                    }
                    return (
                      <div key={it.id} className="draggable-item" draggable={!isDropped} onDragStart={(e)=>onDragStart(e,it)} style={{position:'relative'}}>
                        <img src={it.src} alt={it.id} style={{width:180,height:180,borderRadius:18, filter: isDropped ? 'grayscale(0.2) brightness(0.98)' : 'none'}} />
                        {isDropped && (
                          <span style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 90,
                            fontWeight: 900,
                            color: feedbackType === 'tick' ? 'green' : 'red',
                            pointerEvents: 'none',
                            zIndex: 2,
                            textShadow: '0 4px 16px rgba(0,0,0,0.18)'
                          }}>
                            {feedbackType === 'tick' ? '✓' : '✗'}
                          </span>
                        )}
                      </div>
                    );
                  })}
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
