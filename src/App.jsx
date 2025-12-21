import React, {useState} from 'react'
import Landing from './pages/Landing'
import Lesson from './pages/Lesson'
import CONDITIONS from './data/conditions'

export default function App(){
  const [view,setView] = useState({name:'landing', index:0})

  function goToLesson(index){
    setView({name:'lesson', index})
  }
  function goHome(){ setView({name:'landing', index:0}) }
  function next(){
    if(view.name === 'lesson'){
      const nextIndex = view.index + 1
      if(nextIndex < CONDITIONS.length) setView({name:'lesson', index: nextIndex})
      else setView({name:'landing', index:0})
    }
  }

  return (
    <div className="app-root">
      {view.name === 'landing' && <Landing onStart={()=>goToLesson(0)} onSelect={(imgIndex)=>goToLesson(imgIndex)} />}
      {view.name === 'lesson' && <Lesson data={CONDITIONS[view.index]} index={view.index} total={CONDITIONS.length} onBack={goHome} onNext={next} />}
    </div>
  )
}
