
import React, {useState, useRef} from 'react'
import CONDITIONS from '../data/conditions'

// Part A mapping: use condition ids/titles and images as draggable answers
const DIAG_OPTIONS = CONDITIONS.map(c=>({id:c.id, label:c.title, img:c.img}))

// Part A questions (from worksheet): patient statements and correct diagnosis id
const PART_A = [
  {q: 'My body is warm. I have headache and muscle pains.', answer: 'fever'},
  {q: 'My nose is runny. I am sneezing.', answer: 'cold'},
  {q: 'My eyes are red , itchy and watery.', answer: 'eye'},
  {q: 'I am pooping watery and loose.', answer: 'diarrhea'},
  {q: 'My skin is hot, red and itchy.', answer: 'skin'}
]

// Part B options (words)
const PARTB_OPTIONS = ['plaster','ambulance','dentist','ointment','pain relief','tablet','facemask']

// Part B questions and correct answers (from worksheet)
const PART_B = [
  {q: "I have pain in the teeth. You should go to ________", answer: 'dentist'},
  {q: 'I have chest pain. You should call an ________', answer: 'ambulance'},
  {q: 'I have a cut on my finger. You should put a ______ on it.', answer: 'plaster'},
  {q: 'I have pain on my legs. You should apply pain relief ________', answer: 'ointment'},
  {q: 'I feel tired. You should take ________', answer: 'tablet'},
  {q: 'I have cold and cough. You should not go out. Wear ________', answer: 'facemask'}
]

export default function Assessment({onDone}){
  const [step, setStep] = useState('A')
  const [a1Drops, setA1Drops] = useState(Array(PART_A.length).fill(null))
  const [a2Drops, setA2Drops] = useState(Array(PART_B.length).fill(null))
  const [optionsA, setOptionsA] = useState(DIAG_OPTIONS)
  const [optionsB, setOptionsB] = useState(PARTB_OPTIONS)
  const [feedback, setFeedback] = useState(null)
  const confettiRef = useRef(null)

  function onDragStart(e,item){ e.dataTransfer.setData('text/plain', JSON.stringify({type:'optionA', id:item.id})) }
  function onDragStartPlacedA(e,index,id){ e.dataTransfer.setData('text/plain', JSON.stringify({type:'placedA', id, fromIndex:index})) }
  function onDragStartOptionB(e,opt){ e.dataTransfer.setData('text/plain', JSON.stringify({type:'optionB', val:opt})) }
  function onDragStartPlacedB(e,index,val){ e.dataTransfer.setData('text/plain', JSON.stringify({type:'placedB', val, fromIndex:index})) }

  function handleDropA(e,index){
    e.preventDefault()
    const raw = e.dataTransfer.getData('text/plain')
    if(!raw) return
    let payload
    try{ payload = JSON.parse(raw) }catch(err){ return }

    setA1Drops(prev=>{
      const next = prev.slice()
      if(payload.type === 'optionA'){
        // placing from options: remove payload.id from options and if target had one, return it to options
        const prevId = next[index]
        next[index] = payload.id
        setOptionsA(optPrev=>{
          let working = optPrev.slice()
          if(prevId){
            // add previous back only if missing
            if(!working.find(p=>p.id===prevId)){
              const item = DIAG_OPTIONS.find(x=>x.id===prevId)
              if(item) working = [...working, item]
            }
          }
          // remove the placed id from options
          working = working.filter(p=>p.id !== payload.id)
          return working
        })
      } else if(payload.type === 'placedA'){
        // move or swap between questions
        const from = payload.fromIndex
        if(from === index) return next
        const sourceId = payload.id
        const targetId = next[index]
        // put source into target
        next[index] = sourceId
        // put target into source slot (could be undefined -> null)
        next[from] = targetId || null
      }
      return next
    })
  }

  function handleDropB(e,index){
    e.preventDefault()
    const raw = e.dataTransfer.getData('text/plain')
    if(!raw) return
    let payload
    try{ payload = JSON.parse(raw) }catch(err){ payload = {type:'optionB', val: raw} }

    setA2Drops(prev=>{
      const next = prev.slice()
      if(payload.type === 'optionB'){
        const prevVal = next[index]
        next[index] = payload.val
        setOptionsB(prevB=>{
          let working = prevB.slice()
          if(prevVal && !working.includes(prevVal)) working = [...working, prevVal]
          working = working.filter(x=> x !== payload.val)
          return working
        })
      } else if(payload.type === 'placedB'){
        const from = payload.fromIndex
        if(from === index) return next
        const sourceVal = payload.val
        const targetVal = next[index]
        next[index] = sourceVal
        next[from] = targetVal || null
      }
      return next
    })
  }

  // allow dropping back to options area (A)
  function handleDropToOptionsA(e){
    e.preventDefault()
    const raw = e.dataTransfer.getData('text/plain')
    if(!raw) return
    let payload
    try{ payload = JSON.parse(raw) }catch(err){ return }
    if(payload.type === 'placedA'){
      const from = payload.fromIndex
      setA1Drops(prev=>{
        const next = prev.slice()
        next[from] = null
        return next
      })
      setOptionsA(prev=>{
        if(prev.find(p=>p.id===payload.id)) return prev
        const item = DIAG_OPTIONS.find(x=>x.id===payload.id)
        return item ? [...prev, item] : prev
      })
    }
  }

  // allow dropping back to options area (B)
  function handleDropToOptionsB(e){
    e.preventDefault()
    const raw = e.dataTransfer.getData('text/plain')
    if(!raw) return
    let payload
    try{ payload = JSON.parse(raw) }catch(err){ payload = {type:'optionB', val:raw} }
    if(payload.type === 'placedB'){
      const from = payload.fromIndex
      setA2Drops(prev=>{
        const next = prev.slice()
        next[from] = null
        return next
      })
      setOptionsB(prev=> prev.includes(payload.val) ? prev : [...prev, payload.val])
    }
  }

  function checkAnswers(){
    let a1Correct = 0, a2Correct = 0
    PART_A.forEach((q,i)=>{ if(a1Drops[i] === q.answer) a1Correct++ })
    PART_B.forEach((q,i)=>{ if(a2Drops[i] === q.answer) a2Correct++ })
    const total = a1Correct + a2Correct
    setFeedback({a1:a1Correct,a2:a2Correct,total})
    if(total === PART_A.length + PART_B.length && confettiRef.current){
      const c = confettiRef.current; const ctx = c.getContext('2d'); c.width = window.innerWidth; c.height = window.innerHeight
      for(let i=0;i<200;i++){ ctx.fillStyle = `hsl(${Math.random()*360},80%,60%)`; ctx.fillRect(Math.random()*c.width, Math.random()*c.height, 6,6) }
    }
  }

  function resetAssessment(){
    setA1Drops(Array(PART_A.length).fill(null))
    setA2Drops(Array(PART_B.length).fill(null))
    setOptionsA(DIAG_OPTIONS)
    setOptionsB(PARTB_OPTIONS)
    setFeedback(null)
    setStep('A')
  }

  return (
    <div style={{padding:'0 24px 24px 24px', backgroundImage:"url('/assets/background2.jpg')", backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat', minHeight:'100vh'}}>
      <h2 style={{textAlign:'center', fontSize:60, fontWeight:900, marginTop:0}}>Drag and Drop</h2>

      {step === 'A' && (
        <div style={{width:'100%',margin:'12px 0',paddingLeft:12,paddingRight:12}}>
          <div style={{display:'flex',gap:20,alignItems:'flex-start'}}>
            <div onDragOver={(e)=>e.preventDefault()} onDrop={handleDropToOptionsA} style={{width:420,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12, position:'relative', marginLeft:0, alignSelf:'flex-start'}}>
              {optionsA.map(opt=> (
                <div key={opt.id} draggable onDragStart={(e)=>onDragStart(e,opt)} style={{width:'100%',height:190,background:'transparent',borderRadius:8,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'grab'}}>
                  <img src={opt.img} alt={opt.label} style={{width:200,height:160,objectFit:'contain',filter:'contrast(1.25) saturate(1.35) brightness(1.08)'}} />
                  <div style={{fontSize:18,marginTop:8,textAlign:'center',fontWeight:900,color:'#111'}}>{opt.label}</div>
                </div>
              ))}
            </div>

            <div style={{flex:1,display:'grid',gridTemplateColumns:'1fr 1fr',gap:26, marginLeft:460}}>
              {PART_A.map((p,i)=> (
                <div key={i} onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>handleDropA(e,i)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,background:'rgba(255,255,255,0.06)',padding:18,minHeight:160,borderRadius:12,border:'1px solid rgba(255,255,255,0.18)',boxSizing:'border-box',boxShadow:'0 8px 20px rgba(0,0,0,0.25)'}}>
                  <div style={{flex:1,fontSize:30,lineHeight:1.45,fontWeight:800,color:'#02122a'}}>{p.q}</div>
                  <div style={{width:260,height:160,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    {a1Drops[i] ? (
                      <img draggable onDragStart={(e)=>onDragStartPlacedA(e,i,a1Drops[i])} src={DIAG_OPTIONS.find(x=>x.id===a1Drops[i]).img} alt="ans" style={{maxWidth:'100%',maxHeight:'100%',filter:'contrast(1.25) saturate(1.35) brightness(1.08)',cursor:'grab'}} />
                    ) : <div style={{width:1}} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:18}}>
            <button className="action-btn" onClick={()=>setStep('B')}>Next: Part B</button>
            <button className="action-btn secondary" onClick={resetAssessment}>Reset</button>
            <button className="action-btn" onClick={onDone}>Back Home</button>
          </div>
        </div>
      )}

      {step === 'B' && (
        <div style={{maxWidth:1000,margin:'12px auto'}}>
          <div style={{display:'flex',gap:20,alignItems:'flex-start'}}>
            <div onDragOver={(e)=>e.preventDefault()} onDrop={handleDropToOptionsB} style={{width:420,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12, position:'relative', marginLeft:0}}>
              {optionsB.map(opt=> (
                <div key={opt} draggable onDragStart={(e)=>onDragStartOptionB(e,opt)} style={{padding:'12px 14px',background:'rgba(255,255,255,0.02)',borderRadius:8,cursor:'grab',textAlign:'center',fontSize:20,fontWeight:900,color:'#111',border:'1px solid rgba(0,0,0,0.08)'}}>{opt}</div>
              ))}
            </div>

            <div style={{flex:1,display:'grid',gridTemplateColumns:'1fr 1fr',gap:18, marginLeft:460}}>
              {PART_B.map((p,i)=> (
                <div key={i} onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>handleDropB(e,i)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,background:'rgba(255,255,255,0.06)',padding:16,minHeight:120,borderRadius:12,border:'1px solid rgba(255,255,255,0.18)',boxSizing:'border-box',boxShadow:'0 6px 16px rgba(0,0,0,0.18)'}}>
                  <div style={{flex:1,fontSize:26,lineHeight:1.35,fontWeight:800,color:'#02122a'}}>{p.q}</div>
                  <div style={{minWidth:220,minHeight:52,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    {a2Drops[i] ? (
                      <div draggable onDragStart={(e)=>onDragStartPlacedB(e,i,a2Drops[i])} style={{padding:'6px 10px',borderRadius:8,fontWeight:900,cursor:'grab'}}>{a2Drops[i]}</div>
                    ) : <div style={{width:1}} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:18}}>
            <button className="action-btn" onClick={checkAnswers}>Check Answers</button>
            <button className="action-btn secondary" onClick={()=>setStep('A')}>Back: Part A</button>
            <button className="action-btn" onClick={resetAssessment}>Reset</button>
            <button className="action-btn" onClick={onDone}>Back Home</button>
          </div>
        </div>
      )}

      {feedback && (
        <div style={{textAlign:'center',marginTop:18}}>
          <div>Part A correct: {feedback.a1} / {PART_A.length}</div>
          <div>Part B correct: {feedback.a2} / {PART_B.length}</div>
          <div style={{marginTop:8,fontWeight:700}}>Total: {feedback.total} / {PART_A.length + PART_B.length}</div>
        </div>
      )}

      <canvas ref={confettiRef} style={{position:'fixed',left:0,top:0,width:'100%',height:'100%',pointerEvents:'none'}} />
    </div>
  )
}
