import React, {useState, useMemo, useEffect} from 'react'

const POSITIVE = [
  'Great job!', 'Yay!', 'Nice!', 'Awesome!', 'Well done!', 'Fantastic!'
]

const GENTLE = [
  'Try again!', 'Almost — try another one!', 'Nice effort — try again!'
]

export default function VocabularyExercise({onBack, onNextExercise}){
  // generate randomized 4x4 grid (16 items) with 4-6 'at' targets placed randomly
  const initialData = useMemo(()=>{
    const distractors = ['an','ab','ac','ap','ad','am','ag','af','ar']
    const countAt = Math.floor(Math.random()*3) + 4 // 4..6
    const arr = []
    for(let i=0;i<countAt;i++) arr.push('at')
    while(arr.length < 16) arr.push(distractors[Math.floor(Math.random()*distractors.length)])
    // shuffle Fisher-Yates
    for(let i=arr.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); const t = arr[i]; arr[i]=arr[j]; arr[j]=t }
    return { items: arr.map((w,i)=>({id:i, word:w, removed:false})), countAt }
  }, [])

  const [items, setItems] = useState(initialData.items)
  const [message, setMessage] = useState(null)
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(()=>{
    if(message){
      const t = setTimeout(()=>setMessage(null), 1100)
      return ()=>clearTimeout(t)
    }
  },[message])

  function handleClick(item){
    if(item.word === 'at'){
      setItems(prev => prev.map(p => p.id === item.id ? {...p, removed:true} : p))
      setMessage({type:'success', text: POSITIVE[Math.floor(Math.random()*POSITIVE.length)]})
      setCompletedCount(c => c+1)
    } else {
      setMessage({type:'error', text: GENTLE[Math.floor(Math.random()*GENTLE.length)]})
    }
  }

  const totalAt = initialData.countAt

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',padding:20,position:'relative',backgroundImage:`linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.6)), url(/assets/alphabet.jpg)`,backgroundSize:'cover',backgroundPosition:'center'}}>
      <div style={{position:'absolute',left:20,top:20}}>
        <button className="action-btn" onClick={onBack} style={{padding:'8px 12px'}}>Back</button>
      </div>
      <div style={{position:'absolute',right:20,top:20}}>
        <button className="action-btn secondary" onClick={onNextExercise} style={{padding:'8px 12px'}}>Skip to next exercise</button>
      </div>

      <div style={{width:'100%',maxWidth:980,background:'rgba(255,255,255,0.0)',padding:10}}>
        <h2 style={{fontSize:36,textAlign:'center',marginBottom:8}}>Find and tap only the "at" words</h2>
        <div style={{textAlign:'center',marginBottom:12,fontSize:18,color:'#333'}}>
          Correct found: {completedCount} / {totalAt}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:24,justifyItems:'center',alignItems:'center',padding:20}}>
          {items.map(item=> (
            item.removed ? (
              <div key={item.id} style={{minWidth:120,minHeight:80}} />
            ) : (
              <button
                key={item.id}
                onClick={()=>handleClick(item)}
                style={{
                  minWidth:120,
                  minHeight:80,
                  fontSize:44,
                  fontWeight:800,
                  borderRadius:18,
                  border:'2px solid #333',
                  background:'white',
                  cursor:'pointer',
                  boxShadow:'0 6px 12px rgba(0,0,0,0.08)'
                }}
              >
                {item.word}
              </button>
            )
          ))}
        </div>

        {completedCount === totalAt && (
          <div style={{textAlign:'center',marginTop:20,fontSize:22,fontWeight:'bold',color:'#2e7d32'}}>All done — great work!</div>
        )}
      </div>

      {message && (
        <div style={{position:'fixed',top:40,left:'50%',transform:'translateX(-50%)',padding:'10px 20px',fontSize:22,fontWeight:700,color: message.type === 'success' ? '#155724' : '#856404',background: message.type === 'success' ? 'rgba(212,237,218,0.95)' : 'rgba(255,243,205,0.95)',borderRadius:12,boxShadow:'0 6px 18px rgba(0,0,0,0.08)'}}>
          {message.text}
        </div>
      )}
    </div>
  )
}
