import React, {useState, useMemo, useRef, useEffect} from 'react'

const WORDS = [
  {id:'bat', img:'/assets/bat.png'},
  {id:'cat', img:'/assets/cat.png'},
  {id:'hat', img:'/assets/hat.png'},
  {id:'mat', img:'/assets/mat.png'},
  {id:'rat', img:'/assets/rat.png'}
]

const POSITIVE = ['Great job!','Well done!','Awesome!','Yay!']
const GENTLE = ['Try again!','Almost — try another one!','Nice effort — try again!']

export default function VocabularyThree({onBack}){
  const [step, setStep] = useState(0) // 0: gallery, 1: match, 2: type
  const [message, setMessage] = useState(null)
  const [hoveredTarget, setHoveredTarget] = useState(null)

  // --- Matching state ---
  const initialTargets = useMemo(()=> WORDS.map(w=>({...w, matched:false})),[])
  const [targets, setTargets] = useState(initialTargets)
  const [draggables, setDraggables] = useState(()=>WORDS.map(w=>({id:w.id, text:w.id, used:false})))

  // --- Typing state ---
  const [typeIndex, setTypeIndex] = useState(0)
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  useEffect(()=>{
    if(message){
      const t = setTimeout(()=>setMessage(null), 1200)
      return ()=>clearTimeout(t)
    }
  },[message])

  // drag handlers
  function onDragStart(e, item){
    e.dataTransfer.setData('text/plain', item.id)
  }

  function onDropTarget(e, target){
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if(!id) return
    if(id === target.id){
      setTargets(prev => prev.map(t => t.id === target.id ? {...t, matched:true} : t))
      setDraggables(prev => prev.map(d => d.id === id ? {...d, used:true} : d))
      setHoveredTarget(null)
      setMessage({type:'success', text: POSITIVE[Math.floor(Math.random()*POSITIVE.length)]})
    } else {
      setHoveredTarget(null)
      setMessage({type:'error', text: GENTLE[Math.floor(Math.random()*GENTLE.length)]})
    }
  }

  function allowDrop(e){ e.preventDefault() }

  function onDragEnterTarget(e, t){ e.preventDefault(); setHoveredTarget(t.id) }
  function onDragLeaveTarget(e, t){ e.preventDefault(); setHoveredTarget(null) }

  // typing handlers
  function onSubmitType(e){
    e.preventDefault()
    const expected = WORDS[typeIndex].id.toLowerCase()
    if(input.trim().toLowerCase() === expected){
      setMessage({type:'success', text: POSITIVE[Math.floor(Math.random()*POSITIVE.length)]})
      setInput('')
      setTypeIndex(i => i+1)
    } else {
      setMessage({type:'error', text: GENTLE[Math.floor(Math.random()*GENTLE.length)]})
    }
    if(inputRef.current) inputRef.current.focus()
  }

  return (
    <div style={{minHeight:'100vh',padding:20,boxSizing:'border-box',position:'relative',backgroundImage:`linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.6)), url(/assets/alphabet.jpg)`,backgroundSize:'cover',backgroundPosition:'center'}}>
      <div style={{position:'absolute',left:20,top:20}}>
        <button className="action-btn" onClick={onBack} style={{padding:'8px 12px'}}>Back</button>
      </div>

      <div style={{maxWidth:980,margin:'0 auto',background:'rgba(255,255,255,0.0)',padding:10}}>
        <h2 style={{textAlign:'center',fontSize:28}}>Vocabulary set: bat, cat, hat, mat, rat</h2>

        <div style={{display:'flex',justifyContent:'center',gap:12,marginTop:18}}>
          <button className="action-btn" onClick={()=>setStep(0)} style={{padding:'8px 12px'}}>Gallery</button>
          <button className="action-btn" onClick={()=>setStep(1)} style={{padding:'8px 12px'}}>Match (drag & drop)</button>
          <button className="action-btn" onClick={()=>{setStep(2); setTypeIndex(0); setInput(''); if(inputRef.current) inputRef.current.focus()}} style={{padding:'8px 12px'}}>Type the word</button>
        </div>

        {step === 0 && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginTop:20,alignItems:'center',justifyItems:'center'}}>
            {WORDS.map(w=> (
              <div key={w.id} style={{textAlign:'center'}}>
                <img src={w.img} alt={w.id} style={{width:180,height:140,objectFit:'contain'}} />
                <div style={{fontSize:36,fontWeight:800,marginTop:8}}>{w.id}</div>
              </div>
            ))}
          </div>
        )}

        {step === 1 && (
          <div style={{display:'flex',gap:30,marginTop:20,alignItems:'flex-start'}}>
            <div style={{flex:1,display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:20}}>
              {targets.map(t => {
                const isHover = hoveredTarget === t.id
                return (
                <div key={t.id}
                  onDrop={(e)=>onDropTarget(e,t)}
                  onDragOver={allowDrop}
                  onDragEnter={(e)=>onDragEnterTarget(e,t)}
                  onDragLeave={(e)=>onDragLeaveTarget(e,t)}
                  style={{
                    minHeight:160,
                    borderRadius:14,
                    background: t.matched ? 'linear-gradient(180deg,#e8f5e9,#ffffff)' : 'rgba(255,255,255,0.95)',
                    display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',
                    boxShadow: isHover ? '0 10px 20px rgba(25,118,210,0.12)' : '0 6px 12px rgba(0,0,0,0.06)',
                    border: t.matched ? '3px solid #2e7d32' : (isHover ? '3px dashed #1976d2' : '2px dashed rgba(0,0,0,0.12)'),
                    transition: 'all 180ms ease'
                  }}>
                  <img src={t.img} alt={t.id} style={{width:160,height:120,objectFit:'contain',opacity: t.matched ? 0.6 : 1,filter: t.matched ? 'grayscale(0.1) brightness(0.98)' : 'none'}} />
                  <div style={{height:8}} />
                  {t.matched ? <div style={{color:'#2e7d32',fontWeight:800,display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:20}}>✓</span>Matched</div> : <div style={{height:22}} />}
                </div>
              )})}
            </div>

            <div style={{width:280,display:'flex',flexDirection:'column',gap:12}}>
              <div style={{fontWeight:800}}>Drag these words onto the matching picture:</div>
              {draggables.map(d => (
                <div key={d.id} style={{padding:8,background:d.used ? '#e8f5e9' : 'white',borderRadius:10,marginBottom:10,boxShadow:d.used ? '0 3px 6px rgba(0,0,0,0.04)' : '0 8px 18px rgba(0,0,0,0.08)'}}>
                  <button draggable={!d.used} onDragStart={(e)=>onDragStart(e,d)} style={{cursor:d.used ? 'default' : 'grab',fontSize:24,padding:'10px 14px',minWidth:160,borderRadius:8,background:d.used ? '#c8e6c9' : '#fff',border:d.used ? '2px solid #2e7d32' : '2px solid #ddd'}}>{d.text}</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{marginTop:20,textAlign:'center'}}>
            {typeIndex >= WORDS.length ? (
              <div style={{fontSize:24,fontWeight:800,color:'#2e7d32'}}>All done — great typing!</div>
            ) : (
              <div>
                <img src={WORDS[typeIndex].img} alt={WORDS[typeIndex].id} style={{width:260,height:200,objectFit:'contain'}} />
                <form onSubmit={onSubmitType} style={{marginTop:12}}>
                  <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} placeholder="Type the word" style={{fontSize:22,padding:'8px 12px',width:260,textAlign:'center'}} />
                  <div style={{height:12}}></div>
                  <button className="action-btn" type="submit" style={{padding:'8px 16px'}}>Submit</button>
                </form>
              </div>
            )}
          </div>
        )}

        {message && (
          <div style={{position:'fixed',top:40,left:'50%',transform:'translateX(-50%)',padding:'10px 20px',fontSize:20,fontWeight:700,color: message.type === 'success' ? '#155724' : '#856404',background: message.type === 'success' ? 'rgba(212,237,218,0.95)' : 'rgba(255,243,205,0.95)',borderRadius:12,boxShadow:'0 6px 18px rgba(0,0,0,0.08)'}}>
            {message.text}
          </div>
        )}

      </div>
    </div>
  )
}
