import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
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

export default function App() {
  const [view, setView] = useState({ name: 'landing', index: 0 })
  const [completed, setCompleted] = useState([]) // store condition ids

  // load persisted completed list on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('completedLessons')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setCompleted(parsed)
      }
    } catch (e) { console.warn('Failed to load completed lessons', e) }
  }, [])

  // persist when completed changes
  useEffect(() => {
    try { localStorage.setItem('completedLessons', JSON.stringify(completed)) } catch (e) { console.warn('Failed to save completed lessons', e) }
  }, [completed])

  function goToLesson(index) {
    setView({ name: 'lesson', index })
  }
  function goHome() { setView({ name: 'landing', index: 0 }) }
  function goToHealth() { setView({ name: 'health' }) }
  function goToVocabulary() { setView({ name: 'vocabulary' }) }
  function goToVocabularyExercise() { setView({ name: 'vocabularyExercise' }) }
  function goToVocabularyThree() { setView({ name: 'vocabularyThree' }) }
  function goToMaths() { setView({ name: 'maths' }) }
  function goToMathsExerciseOne() { setView({ name: 'mathsExerciseOne' }) }
  function goToMathsExerciseTwo() { setView({ name: 'mathsExerciseTwo' }) }
  function goToMathsExerciseThree() { setView({ name: 'mathsExerciseThree' }) }
  function goToMathsExerciseFour() { setView({ name: 'mathsExerciseFour' }) }
  function goToMathsExerciseFive() { setView({ name: 'mathsExerciseFive' }) }
  function goToMathsExerciseSix() { setView({ name: 'mathsExerciseSix' }) }
  function goToMathsExerciseSeven() { setView({ name: 'mathsExerciseSeven' }) }
  function goToMathsExerciseEight() { setView({ name: 'mathsExerciseEight' }) }
  function next() {
    if (view.name === 'lesson') {
      const nextIndex = view.index + 1
      if (nextIndex < CONDITIONS.length) setView({ name: 'lesson', index: nextIndex })
      else setView({ name: 'landing', index: 0 })
    }
  }

  function markCompleted(id) {
    setCompleted(prev => prev.includes(id) ? prev : [...prev, id])
  }

  const allDone = completed.length === CONDITIONS.length

  function goToAssessment() { setView({ name: 'assessment' }) }

  function handleSidebarNav(viewId) {
    if (viewId === 'health-folder') return

    // Reset index when switching main views via sidebar
    if (viewId === 'health') setView({ name: 'health' })
    else if (viewId === 'landing') setView({ name: 'landing', index: 0 })
    else if (viewId === 'vocabulary') setView({ name: 'vocabulary' })
    else if (viewId === 'maths') setView({ name: 'maths' })
    else setView({ name: viewId })
  }

  return (
    <div className="app-root" style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar currentView={view.name} onChangeView={handleSidebarNav} completedItems={completed} />

      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {view.name === 'landing' && <Landing onVocabulary={goToVocabulary} onHealth={goToHealth} onMaths={goToMaths} />}
        {view.name === 'health' && <HealthProblems onStart={() => goToLesson(0)} onSelect={(imgIndex) => goToLesson(imgIndex)} completed={completed} allDone={allDone} onAllDone={() => markCompleted('health')} onVocabulary={goToVocabulary} onBack={goHome} />}
        {view.name === 'lesson' && <Lesson data={CONDITIONS[view.index]} index={view.index} total={CONDITIONS.length} onBack={goToHealth} onNext={next} onComplete={markCompleted} onBackToGrid={() => { markCompleted('health'); goToHealth() }} />}
        {view.name === 'assessment' && <Assessment onDone={() => { markCompleted('assessment'); goToHealth() }} />}
        {view.name === 'vocabulary' && <Vocabulary onStart={goToVocabularyExercise} onBack={goHome} />}
        {view.name === 'vocabularyExercise' && <VocabularyExercise onBack={() => setView({ name: 'vocabulary' })} onNextExercise={() => { markCompleted('vocabularyExercise'); goToVocabularyThree() }} />}
        {view.name === 'vocabularyThree' && <VocabularyThree onBack={() => setView({ name: 'vocabulary' })} />}
        {view.name === 'maths' && <Maths onStart={goToMathsExerciseOne} onBack={goHome} />}
        {view.name === 'mathsExerciseOne' && <MathsExerciseOne onBack={() => setView({ name: 'maths' })} onNextExercise={() => { markCompleted('mathsExerciseOne'); goToMathsExerciseTwo() }} />}
        {view.name === 'mathsExerciseTwo' && <MathsExerciseTwo onBack={() => setView({ name: 'mathsExerciseOne' })} onNextExercise={() => { markCompleted('mathsExerciseTwo'); goToMathsExerciseThree() }} />}
        {view.name === 'mathsExerciseThree' && <MathsExerciseThree onBack={() => setView({ name: 'mathsExerciseTwo' })} onNextExercise={() => { markCompleted('mathsExerciseThree'); goToMathsExerciseFour() }} />}
        {view.name === 'mathsExerciseFour' && <MathsExerciseFour onBack={() => setView({ name: 'mathsExerciseThree' })} onNextExercise={() => { markCompleted('mathsExerciseFour'); goToMathsExerciseFive() }} />}
        {view.name === 'mathsExerciseFive' && <MathsExerciseFive onBack={() => setView({ name: 'mathsExerciseFour' })} onNextExercise={() => { markCompleted('mathsExerciseFive'); goToMathsExerciseSix() }} />}
        {view.name === 'mathsExerciseSix' && <MathsExerciseSix onBack={() => setView({ name: 'mathsExerciseFive' })} onNextExercise={() => { markCompleted('mathsExerciseSix'); goToMathsExerciseSeven() }} />}
        {view.name === 'mathsExerciseSeven' && <MathsExerciseSeven onBack={() => setView({ name: 'mathsExerciseSix' })} onNextExercise={() => { markCompleted('mathsExerciseSeven'); goToMathsExerciseEight() }} />}
        {view.name === 'mathsExerciseEight' && <MathsExerciseEight onBack={() => setView({ name: 'mathsExerciseSeven' })} onComplete={() => markCompleted('mathsExerciseEight')} />}
      </div>
    </div>
  )
}


