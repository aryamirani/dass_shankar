import React, {useState, useEffect} from 'react'
import Landing from './pages/Landing'
import HealthProblems from './pages/HealthProblems'
import Lesson from './pages/Lesson'
import Assessment from './pages/Assessment'
import Vocabulary from './pages/Vocabulary'
import VocabularyExercise from './pages/VocabularyExercise'
import VocabularyThree from './pages/VocabularyThree'
import Maths from './pages/Maths'
import MathsExerciseOne from './pages/MathsExerciseOne'
import MathsExerciseTwo from './pages/MathsExerciseTwo'
import MathsExerciseThree from './pages/MathsExerciseThree'
import MathsExerciseFour from './pages/MathsExerciseFour'
import MathsExerciseFive from './pages/MathsExerciseFive'
import MathsExerciseSix from './pages/MathsExerciseSix'
import MathsExerciseSeven from './pages/MathsExerciseSeven'
import MathsExerciseEight from './pages/MathsExerciseEight'
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
  function goToHealth(){ setView({name:'health'}) }
  function goToVocabulary(){ setView({name:'vocabulary'}) }
  function goToVocabularyExercise(){ setView({name:'vocabularyExercise'}) }
  function goToVocabularyThree(){ setView({name:'vocabularyThree'}) }
  function goToMaths(){ setView({name:'maths'}) }
  function goToMathsExerciseOne(){ setView({name:'mathsExerciseOne'}) }
  function goToMathsExerciseTwo(){ setView({name:'mathsExerciseTwo'}) }
  function goToMathsExerciseThree(){ setView({name:'mathsExerciseThree'}) }
  function goToMathsExerciseFour(){ setView({name:'mathsExerciseFour'}) }
  function goToMathsExerciseFive(){ setView({name:'mathsExerciseFive'}) }
  function goToMathsExerciseSix(){ setView({name:'mathsExerciseSix'}) }
  function goToMathsExerciseSeven(){ setView({name:'mathsExerciseSeven'}) }
  function goToMathsExerciseEight(){ setView({name:'mathsExerciseEight'}) }
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
      {view.name === 'landing' && <Landing onVocabulary={goToVocabulary} onHealth={goToHealth} onMaths={goToMaths} />}
      {view.name === 'health' && <HealthProblems onStart={()=>goToLesson(0)} onSelect={(imgIndex)=>goToLesson(imgIndex)} completed={completed} allDone={allDone} onAllDone={goToAssessment} onVocabulary={goToVocabulary} onBack={goHome} />}
      {view.name === 'lesson' && <Lesson data={CONDITIONS[view.index]} index={view.index} total={CONDITIONS.length} onBack={goHome} onNext={next} onComplete={markCompleted} onBackToGrid={goToHealth} />}
      {view.name === 'assessment' && <Assessment onDone={goHome} />}
      {view.name === 'vocabulary' && <Vocabulary onStart={goToVocabularyExercise} onBack={goHome} />}
      {view.name === 'vocabularyExercise' && <VocabularyExercise onBack={()=> setView({name:'vocabulary'})} onNextExercise={goToVocabularyThree} />}
      {view.name === 'vocabularyThree' && <VocabularyThree onBack={()=> setView({name:'vocabulary'})} />}
      {view.name === 'maths' && <Maths onStart={goToMathsExerciseOne} onBack={goHome} />}
      {view.name === 'mathsExerciseOne' && <MathsExerciseOne onBack={()=> setView({name:'maths'})} onNextExercise={goToMathsExerciseTwo} />}
      {view.name === 'mathsExerciseTwo' && <MathsExerciseTwo onBack={()=> setView({name:'mathsExerciseOne'})} onNextExercise={goToMathsExerciseThree} />}
      {view.name === 'mathsExerciseThree' && <MathsExerciseThree onBack={()=> setView({name:'mathsExerciseTwo'})} onNextExercise={goToMathsExerciseFour} />}
      {view.name === 'mathsExerciseFour' && <MathsExerciseFour onBack={()=> setView({name:'mathsExerciseThree'})} onNextExercise={goToMathsExerciseFive} />}
      {view.name === 'mathsExerciseFive' && <MathsExerciseFive onBack={()=> setView({name:'mathsExerciseFour'})} onNextExercise={goToMathsExerciseSix} />}
      {view.name === 'mathsExerciseSix' && <MathsExerciseSix onBack={()=> setView({name:'mathsExerciseFive'})} onNextExercise={goToMathsExerciseSeven} />}
      {view.name === 'mathsExerciseSeven' && <MathsExerciseSeven onBack={()=> setView({name:'mathsExerciseSix'})} onNextExercise={goToMathsExerciseEight} />}
      {view.name === 'mathsExerciseEight' && <MathsExerciseEight onBack={()=> setView({name:'mathsExerciseSeven'})} />}
    </div>
  )
}


