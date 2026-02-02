import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Landing from './pages/Landing'
import HealthOverview from './pages/HealthOverview'
import HealthProblems from './pages/HealthProblems'
import Lesson from './pages/Lesson'
import Assessment from './pages/Assessment'
import Vocabulary from './pages/Vocabulary'
import VocabularyExercise from './pages/VocabularyExercise'
import VocabularyExerciseAM from './pages/VocabularyExerciseAM'
import VocabularyThree from './pages/VocabularyThree'
import VocabularyThreeAM from './pages/VocabularyThreeAM'
import Maths from './pages/Maths'
import MathsExerciseOne from './pages/MathsExerciseOne'
import MathsExerciseTwo from './pages/MathsExerciseTwo'
import MathsExerciseThree from './pages/MathsExerciseThree'
import MathsExerciseFour from './pages/MathsExerciseFour'
import MathsExerciseFive from './pages/MathsExerciseFive'
import MathsExerciseSix from './pages/MathsExerciseSix'
import MathsExerciseSeven from './pages/MathsExerciseSeven'
import MathsExerciseEight from './pages/MathsExerciseEight'
import EnglishOverview from './pages/EnglishOverview'
import EnglishWordGame from './pages/EnglishWordGame'
import EnglishPhonics from './pages/EnglishPhonics'
import EnglishFillBlanks from './pages/EnglishFillBlanks'
import ScienceOverview from './pages/ScienceOverview'
// import ScienceOrgan from './pages/ScienceOrgan'
import ScienceHuman from './pages/ScienceHuman'
import ComputerOverview from './pages/ComputerOverview'
import ComputerKeyboard from './pages/ComputerKeyboard'
import EVSOverview from './pages/EVSOverview'
import EVSIdentify from './pages/EVSIdentify'
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
  function goToHealthOverview() { setView({ name: 'health' }) }
  function goToHealthProblems() { setView({ name: 'healthProblems' }) }
  function goToVocabulary() { setView({ name: 'vocabulary' }) }
  function goToVocabularyExercise() { setView({ name: 'vocabularyExercise' }) }
  function goToVocabularyExerciseAM() { setView({ name: 'vocabularyExerciseAM' }) }
  function goToVocabularyThree() { setView({ name: 'vocabularyThree' }) }
  function goToVocabularyThreeAM() { setView({ name: 'vocabularyThreeAM' }) }
  function goToMaths() { setView({ name: 'maths' }) }
  function goToMathsExerciseOne() { setView({ name: 'mathsExerciseOne' }) }
  function goToMathsExerciseTwo() { setView({ name: 'mathsExerciseTwo' }) }
  function goToMathsExerciseThree() { setView({ name: 'mathsExerciseThree' }) }
  function goToMathsExerciseFour() { setView({ name: 'mathsExerciseFour' }) }
  function goToMathsExerciseFive() { setView({ name: 'mathsExerciseFive' }) }
  function goToMathsExerciseSix() { setView({ name: 'mathsExerciseSix' }) }
  function goToMathsExerciseSeven() { setView({ name: 'mathsExerciseSeven' }) }
  function goToMathsExerciseEight() { setView({ name: 'mathsExerciseEight' }) }
  function goToEnglish() { setView({ name: 'english' }) }
  function goToEnglishWordGame() { setView({ name: 'englishWordGame' }) }
  function goToEnglishPhonics() { setView({ name: 'englishPhonics' }) }
  function goToEnglishFillBlanks() { setView({ name: 'englishFillBlanks' }) }
  function goToScienceOverview() { setView({ name: 'science' }) }
  // function goToScienceOrgan() { setView({ name: 'scienceOrgan' }) }
  function goToScienceHuman() { setView({ name: 'scienceHuman' }) }
  function goToComputerOverview() { setView({ name: 'computer' }) }
  function goToComputerKeyboard() { setView({ name: 'computerKeyboard' }) }
  function goToEVSOverview() { setView({ name: 'evs' }) }
  function goToEVSIdentify() { setView({ name: 'evsIdentify' }) }
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
    if (viewId === 'health') setView({ name: 'health' }) // This now goes to Overview
    else if (viewId === 'landing') setView({ name: 'landing', index: 0 })
    else if (viewId === 'vocabulary') setView({ name: 'vocabulary' })
    else if (viewId === 'vocabulary') setView({ name: 'vocabulary' })
    else if (viewId === 'maths') setView({ name: 'maths' })
    else if (viewId === 'english') setView({ name: 'english' })
    else if (viewId === 'science') setView({ name: 'science' }) // Goes to science overview
    else if (viewId === 'computer') setView({ name: 'computer' }) // Goes to computer overview
    else if (viewId === 'evs') setView({ name: 'evs' })
    else setView({ name: viewId })
  }

  function getBackground() {
    // Maths - Purple
    if (view.name === 'maths' || view.name.startsWith('mathsExercise')) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

    // English - Orange
    if (view.name === 'english' || view.name.startsWith('english')) return 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'

    // Science - Red
    if (view.name === 'science' || view.name === 'scienceHuman' || view.name === 'evs' || view.name === 'evsIdentify') return 'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)'

    // Health - Pink
    if (view.name === 'health' || view.name === 'healthProblems' || view.name === 'assessment' || view.name === 'lesson') return 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)'

    // Vocabulary - Green
    if (view.name === 'vocabulary' || view.name.startsWith('vocabulary')) return 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'

    // Computer - Blue
    if (view.name === 'computer' || view.name === 'computerKeyboard') return 'linear-gradient(135deg, #0f172a 0%, #334155 100%)'

    // Overview / Landing - Blue (Lighter)
    return 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
  }

  return (
    <div className="app-root" style={{ '--app-background': getBackground(), background: 'var(--app-background)', display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar currentView={view.name} onChangeView={handleSidebarNav} completedItems={completed} />

      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {(view.name === 'landing' || view.name === 'landing2') && <Landing onVocabulary={goToVocabulary} onHealth={goToHealthOverview} onMaths={goToMaths} onEnglish={goToEnglish} onScience={goToScienceOverview} onComputer={goToComputerOverview} onEVS={goToEVSOverview} />}
        {view.name === 'health' && <HealthOverview onStart={goToHealthProblems} onBack={goHome} />}
        {view.name === 'healthProblems' && <HealthProblems onStart={() => goToLesson(0)} onSelect={(imgIndex) => goToLesson(imgIndex)} completed={completed} allDone={allDone} onAllDone={() => markCompleted('health')} onVocabulary={goToVocabulary} onBack={goToHealthOverview} />}
        {view.name === 'lesson' && <Lesson data={CONDITIONS[view.index]} index={view.index} total={CONDITIONS.length} onBack={goToHealthProblems} onNext={next} onComplete={markCompleted} onBackToGrid={() => { markCompleted('health'); goToHealthProblems() }} />}
        {view.name === 'assessment' && <Assessment onDone={() => { markCompleted('assessment'); goToHealthProblems() }} />}
        {view.name === 'vocabulary' && <Vocabulary onStart={goToVocabularyExercise} onBack={goHome} />}
  {view.name === 'vocabularyExercise' && <VocabularyExercise onBack={() => setView({ name: 'vocabulary' })} onNextExercise={() => { markCompleted('vocabularyExercise'); goToVocabularyThree() }} />}
  {view.name === 'vocabularyExerciseAM' && <VocabularyExerciseAM onBack={() => setView({ name: 'vocabulary' })} onNextExercise={() => { markCompleted('vocabularyExerciseAM'); goToVocabularyThreeAM() }} />}
  {view.name === 'vocabularyThree' && <VocabularyThree onBack={() => setView({ name: 'vocabulary' })} onGoToAM={goToVocabularyExerciseAM} />}
  {view.name === 'vocabularyThreeAM' && <VocabularyThreeAM onBack={() => setView({ name: 'vocabulary' })} />}
        {view.name === 'maths' && <Maths onStart={goToMathsExerciseOne} onBack={goHome} />}
        {view.name === 'mathsExerciseOne' && <MathsExerciseOne onBack={() => setView({ name: 'maths' })} onNextExercise={() => { markCompleted('mathsExerciseOne'); goToMathsExerciseTwo() }} />}
        {view.name === 'mathsExerciseTwo' && <MathsExerciseTwo onBack={() => setView({ name: 'mathsExerciseOne' })} onNextExercise={() => { markCompleted('mathsExerciseTwo'); goToMathsExerciseThree() }} />}
        {view.name === 'mathsExerciseThree' && <MathsExerciseThree onBack={() => setView({ name: 'mathsExerciseTwo' })} onNextExercise={() => { markCompleted('mathsExerciseThree'); goToMathsExerciseFour() }} />}
        {view.name === 'mathsExerciseFour' && <MathsExerciseFour onBack={() => setView({ name: 'mathsExerciseThree' })} onNextExercise={() => { markCompleted('mathsExerciseFour'); goToMathsExerciseFive() }} />}
        {view.name === 'mathsExerciseFive' && <MathsExerciseFive onBack={() => setView({ name: 'mathsExerciseFour' })} onNextExercise={() => { markCompleted('mathsExerciseFive'); goToMathsExerciseSix() }} />}
        {view.name === 'mathsExerciseSix' && <MathsExerciseSix onBack={() => setView({ name: 'mathsExerciseFive' })} onNextExercise={() => { markCompleted('mathsExerciseSix'); goToMathsExerciseSeven() }} />}
        {view.name === 'mathsExerciseSeven' && <MathsExerciseSeven onBack={() => setView({ name: 'mathsExerciseSix' })} onNextExercise={() => { markCompleted('mathsExerciseSeven'); goToMathsExerciseEight() }} />}
        {view.name === 'mathsExerciseEight' && <MathsExerciseEight onBack={() => setView({ name: 'mathsExerciseSeven' })} onComplete={() => markCompleted('mathsExerciseEight')} />}
        {view.name === 'english' && <EnglishOverview onStart={goToEnglishWordGame} onBack={goHome} />}

        {view.name === 'englishWordGame' && <EnglishWordGame onBack={() => setView({ name: 'english' })} />}
        {view.name === 'englishPhonics' && <EnglishPhonics onBack={() => setView({ name: 'english' })} />}
        {view.name === 'englishFillBlanks' && <EnglishFillBlanks onBack={() => setView({ name: 'english' })} />}
        {view.name === 'science' && <ScienceOverview onBack={goHome} />}
        {/* {view.name === 'scienceOrgan' && <ScienceOrgan onBack={goToScienceOverview} onNext={goToScienceHuman} />} */}
        {view.name === 'scienceHuman' && <ScienceHuman onBack={goToScienceOverview} />}

        {view.name === 'computer' && <ComputerOverview onStart={goToComputerKeyboard} onBack={goHome} />}
        {view.name === 'computerKeyboard' && <ComputerKeyboard onBack={goToComputerOverview} />}

        {view.name === 'evs' && <EVSOverview onStart={goToEVSIdentify} onBack={goHome} />}
        {view.name === 'evsIdentify' && <EVSIdentify onBack={goToEVSOverview} />}
      </div>
    </div>
  )
}


