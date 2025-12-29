import React, {useState, useEffect} from 'react'
import Landing from './pages/Landing'
import Lesson from './pages/Lesson'
import Assessment from './pages/Assessment'
import Vocabulary from './pages/Vocabulary'
import VocabularyExercise from './pages/VocabularyExercise'
import VocabularyThree from './pages/VocabularyThree'
import CONDITIONS from './data/conditions'

export default function App(){
  const [view,setView] = useState({name:'landing', index:0})
  const [completed, setCompleted] = useState([]) // store condition ids

  // load persisted completed list on mount
  useEffect(()=>{
    try{
      const raw = localStorage.getItem('completedLessons')
      if(raw){
        const parsed = JSON.parse(raw)
        if(Array.isArray(parsed)) setCompleted(parsed)
      }
    }catch(e){console.warn('Failed to load completed lessons', e)}
  },[])

  // persist when completed changes
  useEffect(()=>{
    try{ localStorage.setItem('completedLessons', JSON.stringify(completed)) }catch(e){console.warn('Failed to save completed lessons', e)}
  },[completed])

  function goToLesson(index){
    setView({name:'lesson', index})
  }
  function goHome(){ setView({name:'landing', index:0}) }
  function goToVocabulary(){ setView({name:'vocabulary'}) }
  function goToVocabularyExercise(){ setView({name:'vocabularyExercise'}) }
  function goToVocabularyThree(){ setView({name:'vocabularyThree'}) }
  function next(){
    if(view.name === 'lesson'){
      const nextIndex = view.index + 1
      if(nextIndex < CONDITIONS.length) setView({name:'lesson', index: nextIndex})
      else setView({name:'landing', index:0})
    }
  }

  function markCompleted(id){
    setCompleted(prev => prev.includes(id) ? prev : [...prev, id])
  }

  const allDone = completed.length === CONDITIONS.length

  function goToAssessment(){ setView({name:'assessment'}) }

  return (
    <div className="app-root">
      {view.name === 'landing' && <Landing onStart={()=>goToLesson(0)} onSelect={(imgIndex)=>goToLesson(imgIndex)} completed={completed} allDone={allDone} onAllDone={goToAssessment} onVocabulary={goToVocabulary} />}
      {view.name === 'lesson' && <Lesson data={CONDITIONS[view.index]} index={view.index} total={CONDITIONS.length} onBack={goHome} onNext={next} onComplete={markCompleted} />}
      {view.name === 'assessment' && <Assessment onDone={goHome} />}
      {view.name === 'vocabulary' && <Vocabulary onStart={goToVocabularyExercise} onBack={goHome} />}
      {view.name === 'vocabularyExercise' && <VocabularyExercise onBack={()=> setView({name:'vocabulary'})} onNextExercise={goToVocabularyThree} />}
      {view.name === 'vocabularyThree' && <VocabularyThree onBack={()=> setView({name:'vocabulary'})} />}
    </div>
  )
}


