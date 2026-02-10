import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Landing from './pages/Landing'
import HealthOverview from './pages/GradeX2/health/HealthOverview'
import HealthProblems from './pages/GradeX2/health/HealthProblems'
import Lesson from './pages/GradeX2/science/Lesson'
import Assessment from './pages/GradeX2/health/Assessment'
import Vocabulary from './pages/GradeX/english/Vocabulary'
import VocabularyExercise from './pages/GradeX/english/VocabularyExercise'
import VocabularyExerciseAM from './pages/GradeX/english/VocabularyExerciseAM'
import VocabularyThree from './pages/GradeX/english/VocabularyThree'
import VocabularyThreeAM from './pages/GradeX/english/VocabularyThreeAM'
import VocabularyExerciseAg from './pages/GradeX/english/VocabularyExerciseAg'
import VocabularyThreeAg from './pages/GradeX/english/VocabularyThreeAg'
import VocabularyExerciseAd from './pages/GradeX/english/VocabularyExerciseAd'
import VocabularyThreeAd from './pages/GradeX/english/VocabularyThreeAd'
import VocabularyExerciseAn from './pages/GradeX/english/VocabularyExerciseAn'
import VocabularyThreeAn from './pages/GradeX/english/VocabularyThreeAn'
import VocabularyExerciseAp from './pages/GradeX/english/VocabularyExerciseAp'
import VocabularyThreeAp from './pages/GradeX/english/VocabularyThreeAp'
import Maths from './pages/GradeX/maths/Maths'
import MathsExerciseOne from './pages/GradeX/maths/MathsExerciseOne'
import MathsExerciseTwo from './pages/GradeX/maths/MathsExerciseTwo'
import MathsExerciseThree from './pages/GradeX/maths/MathsExerciseThree'
import MathsExerciseFour from './pages/GradeX/maths/MathsExerciseFour'
import MathsExerciseFive from './pages/GradeX/maths/MathsExerciseFive'
import MathsExerciseSix from './pages/GradeX/maths/MathsExerciseSix'
import MathsExerciseSeven from './pages/GradeX/maths/MathsExerciseSeven'
import MathsExerciseEight from './pages/GradeX/maths/MathsExerciseEight'
import MathsExerciseNine from './pages/GradeX/maths/MathsExerciseNine'
import EnglishOverview from './pages/GradeX2/english/EnglishOverview'
import EnglishReadWords from './pages/GradeX/english/EnglishReadWords'
import EnglishReadWords2 from './pages/GradeX/english/EnglishReadWords2'
import EnglishWordGame from './pages/GradeX2/english/EnglishWordGame'
import EnglishPhonics from './pages/GradeX2/english/EnglishPhonics'
import EnglishFillBlanks from './pages/GradeX2/english/EnglishFillBlanks'
import ScienceOverview from './pages/GradeX2/science/ScienceOverview'
// import ScienceOrgan from './pages/ScienceOrgan'
import ScienceHuman from './pages/GradeX2/science/ScienceHuman'
import ComputerOverview from './pages/GradeX/computer/ComputerOverview'
import ComputerKeyboard from './pages/GradeX/computer/ComputerKeyboard'
import EVSOverview from './pages/GradeX/evs/EVSOverview'
import EVSIdentify from './pages/GradeX/evs/EVSIdentify'
import EVSGender from './pages/GradeX/evs/EVSGender'
import EVSJams from './pages/GradeX/evs/EVSJams'
import EVSBags from './pages/GradeX/evs/EVSBags'
import EVSMap from './pages/GradeX/evs/EVSMap'
import CONDITIONS from './data/conditions'

// Wrapper for consistent navigation buttons
const NavigationWrapper = ({ children, onBack, onNext }) => {
  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      {/* Back Button - Top Left */}
      {onBack && (
        <button 
          onClick={onBack}
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            zIndex: 100,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#333',
            fontSize: 18,
            fontWeight: 'bold',
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)'
          }}
        >
          <span style={{ fontSize: 24 }}>←</span> <span>Back</span>
        </button>
      )}

      {/* Next Button - Bottom Right */}
      {onNext && (
        <button 
          onClick={onNext}
          style={{
            position: 'fixed', // Changed to fixed to ensure it stays on screen
            bottom: 30,
            right: 30,
            zIndex: 100,
            background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '12px 28px',
            fontSize: 18,
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)'
          }}
          onMouseLeave={e => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)'
          }}
        >
          Next →
        </button>
      )}

      {children}
    </div>
  )
}

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
  function goToVocabularyExerciseAg() { setView({ name: 'vocabularyExerciseAg' }) }
  function goToVocabularyExerciseAd() { setView({ name: 'vocabularyExerciseAd' }) }
  function goToVocabularyExerciseAn() { setView({ name: 'vocabularyExerciseAn' }) }
  function goToVocabularyThree() { setView({ name: 'vocabularyThree' }) }
  function goToVocabularyThreeAM() { setView({ name: 'vocabularyThreeAM' }) }
  function goToVocabularyThreeAg() { setView({ name: 'vocabularyThreeAg' }) }
  function goToVocabularyThreeAd() { setView({ name: 'vocabularyThreeAd' }) }
  function goToVocabularyThreeAn() { setView({ name: 'vocabularyThreeAn' }) }
  function goToVocabularyExerciseAp() { setView({ name: 'vocabularyExerciseAp' }) }
  function goToVocabularyThreeAp() { setView({ name: 'vocabularyThreeAp' }) }
  function goToMaths() { setView({ name: 'maths' }) }
  function goToMathsExerciseOne() { setView({ name: 'mathsExerciseOne' }) }
  function goToMathsExerciseTwo() { setView({ name: 'mathsExerciseTwo' }) }
  function goToMathsExerciseThree() { setView({ name: 'mathsExerciseThree' }) }
  function goToMathsExerciseFour() { setView({ name: 'mathsExerciseFour' }) }
  function goToMathsExerciseFive() { setView({ name: 'mathsExerciseFive' }) }
  function goToMathsExerciseSix() { setView({ name: 'mathsExerciseSix' }) }
  function goToMathsExerciseSeven() { setView({ name: 'mathsExerciseSeven' }) }
  function goToMathsExerciseEight() { setView({ name: 'mathsExerciseEight' }) }
  function goToMathsExerciseNine() { setView({ name: 'mathsExerciseNine' }) }
  function goToEnglish() { setView({ name: 'english' }) }
  function goToEnglishReadWords() { setView({ name: 'englishReadWords' }) }
  function goToEnglishReadWords2() { setView({ name: 'englishReadWords2' }) }
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
  function goToEVSGender() { setView({ name: 'evsGender' }) }
  function goToEVSJams() { setView({ name: 'evsJams' }) }
  function goToEVSBags() { setView({ name: 'evsBags' }) }
  function goToEVSMap() { setView({ name: 'evsMap' }) }
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
    if (view.name === 'science' || view.name === 'scienceHuman' || view.name === 'evs' || view.name === 'evsIdentify' || view.name === 'evsGender' || view.name === 'evsJams' || view.name === 'evsBags' || view.name === 'evsMap') return 'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)'

    // Health - Pink
    if (view.name === 'health' || view.name === 'healthProblems' || view.name === 'assessment' || view.name === 'lesson') return 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)'

    // Vocabulary - Orange
    if (view.name === 'vocabulary' || view.name.startsWith('vocabulary')) return 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'

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
        {view.name === 'healthProblems' && (
          <NavigationWrapper 
            onBack={goToHealthOverview} 
            onNext={goToAssessment}
          >
            <HealthProblems onStart={() => goToLesson(0)} onSelect={(imgIndex) => goToLesson(imgIndex)} completed={completed} allDone={allDone} onAllDone={() => markCompleted('health')} onVocabulary={goToVocabulary} onBack={goToHealthOverview} />
          </NavigationWrapper>
        )}
        {view.name === 'lesson' && <Lesson data={CONDITIONS[view.index]} index={view.index} total={CONDITIONS.length} onBack={goToHealthProblems} onNext={next} onComplete={markCompleted} onBackToGrid={() => { markCompleted('health'); goToHealthProblems() }} />}
        {view.name === 'assessment' && (
          <NavigationWrapper 
            onBack={goToHealthProblems} 
            onNext={() => { markCompleted('assessment'); goToEnglish() }}
          >
            <Assessment onDone={() => { markCompleted('assessment'); goToEnglish() }} />
          </NavigationWrapper>
        )}
        {view.name === 'vocabulary' && <Vocabulary onStart={goToVocabularyExercise} onBack={goHome} />}
  {view.name === 'vocabularyExercise' && (
    <NavigationWrapper 
      onBack={() => setView({ name: 'vocabulary' })} 
      onNext={() => { markCompleted('vocabularyExercise'); goToVocabularyExerciseAn() }}
    >
      <VocabularyExercise onBack={() => setView({ name: 'vocabulary' })} onNextExercise={() => { markCompleted('vocabularyExercise'); goToVocabularyExerciseAn() }} />
    </NavigationWrapper>
  )}
  {view.name === 'vocabularyExerciseAn' && (
    <NavigationWrapper 
      onBack={() => goToVocabularyExercise()} 
      onNext={() => { markCompleted('vocabularyExerciseAn'); goToVocabularyExerciseAp() }}
    >
      <VocabularyExerciseAn onBack={() => goToVocabularyExercise()} onNextExercise={() => { markCompleted('vocabularyExerciseAn'); goToVocabularyExerciseAp() }} />
    </NavigationWrapper>
  )}
  {view.name === 'vocabularyExerciseAp' && (
    <NavigationWrapper 
      onBack={() => goToVocabularyExerciseAn()} 
      onNext={() => { markCompleted('vocabularyExerciseAp'); goToVocabularyExerciseAg() }}
    >
      <VocabularyExerciseAp onBack={() => goToVocabularyExerciseAn()} onNextExercise={() => { markCompleted('vocabularyExerciseAp'); goToVocabularyExerciseAg() }} />
    </NavigationWrapper>
  )}
  {view.name === 'vocabularyExerciseAg' && (
    <NavigationWrapper 
      onBack={() => goToVocabularyExerciseAp()} 
      onNext={() => { markCompleted('vocabularyExerciseAg'); goToVocabularyExerciseAM() }}
    >
      <VocabularyExerciseAg onBack={() => goToVocabularyExerciseAp()} onNextExercise={() => { markCompleted('vocabularyExerciseAg'); goToVocabularyExerciseAM() }} />
    </NavigationWrapper>
  )}
  {view.name === 'vocabularyExerciseAM' && (
    <NavigationWrapper 
      onBack={() => goToVocabularyExerciseAg()} 
      onNext={() => { markCompleted('vocabularyExerciseAM'); goToVocabularyExerciseAd() }}
    >
      <VocabularyExerciseAM onBack={() => goToVocabularyExerciseAg()} onNextExercise={() => { markCompleted('vocabularyExerciseAM'); goToVocabularyExerciseAd() }} />
    </NavigationWrapper>
  )}
  {view.name === 'vocabularyExerciseAd' && (
    <NavigationWrapper 
      onBack={() => goToVocabularyExerciseAM()} 
      onNext={() => { markCompleted('vocabularyExerciseAd'); goToVocabularyThree() }}
    >
      <VocabularyExerciseAd onBack={() => goToVocabularyExerciseAM()} onNextExercise={() => { markCompleted('vocabularyExerciseAd'); goToVocabularyThree() }} />
    </NavigationWrapper>
  )}
  
  {view.name === 'vocabularyThree' && (
    <NavigationWrapper 
      onBack={() => goToVocabularyExerciseAd()} 
      onNext={() => { markCompleted('vocabularyThree'); goToVocabularyThreeAn() }}
    >
      <VocabularyThree onBack={() => goToVocabularyExerciseAd()} onGoToAM={goToVocabularyThreeAn} />
    </NavigationWrapper>
  )}
  {view.name === 'vocabularyThreeAn' && (
    <NavigationWrapper 
      onBack={() => goToVocabularyThree()} 
      onNext={() => { markCompleted('vocabularyThreeAn'); goToVocabularyThreeAp() }}
    >
      <VocabularyThreeAn onBack={() => goToVocabularyThree()} onGoToAg={goToVocabularyThreeAp} />
    </NavigationWrapper>
  )}
  {view.name === 'vocabularyThreeAp' && (
    <NavigationWrapper 
      onBack={() => goToVocabularyThreeAn()} 
      onNext={() => { markCompleted('vocabularyThreeAp'); goToVocabularyThreeAg() }}
    >
      <VocabularyThreeAp onBack={() => goToVocabularyThreeAn()} />
    </NavigationWrapper>
  )}
  {view.name === 'vocabularyThreeAg' && (
    <NavigationWrapper 
      onBack={() => goToVocabularyThreeAp()} 
      onNext={() => { markCompleted('vocabularyThreeAg'); goToVocabularyThreeAM() }}
    >
      <VocabularyThreeAg onBack={() => goToVocabularyThreeAp()} onGoToAd={goToVocabularyThreeAM} />
    </NavigationWrapper>
  )}
  {view.name === 'vocabularyThreeAM' && (
    <NavigationWrapper 
      onBack={() => goToVocabularyThreeAg()} 
      onNext={() => { markCompleted('vocabularyThreeAM'); goToVocabularyThreeAd() }}
    >
      <VocabularyThreeAM onBack={() => goToVocabularyThreeAg()} onGoToAg={goToVocabularyThreeAd} />
    </NavigationWrapper>
  )}
  {view.name === 'vocabularyThreeAd' && (
    <NavigationWrapper 
      onBack={() => goToVocabularyThreeAM()} 
      onNext={() => { markCompleted('vocabularyThreeAd'); goToEnglishReadWords() }}
    >
      <VocabularyThreeAd onBack={() => goToVocabularyThreeAM()} onGoToAn={goToEnglishReadWords} />
    </NavigationWrapper>
  )}
        {view.name === 'maths' && <Maths onStart={goToMathsExerciseOne} onBack={goHome} />}
        {view.name === 'mathsExerciseOne' && (
          <NavigationWrapper 
            onBack={() => setView({ name: 'maths' })} 
            onNext={() => { markCompleted('mathsExerciseOne'); goToMathsExerciseTwo() }}
          >
            <MathsExerciseOne onBack={() => setView({ name: 'maths' })} onNextExercise={() => { markCompleted('mathsExerciseOne'); goToMathsExerciseTwo() }} />
          </NavigationWrapper>
        )}
        {view.name === 'mathsExerciseTwo' && (
          <NavigationWrapper 
            onBack={() => setView({ name: 'mathsExerciseOne' })} 
            onNext={() => { markCompleted('mathsExerciseTwo'); goToMathsExerciseThree() }}
          >
            <MathsExerciseTwo onBack={() => setView({ name: 'mathsExerciseOne' })} onNextExercise={() => { markCompleted('mathsExerciseTwo'); goToMathsExerciseThree() }} />
          </NavigationWrapper>
        )}
        {view.name === 'mathsExerciseThree' && (
          <NavigationWrapper 
            onBack={() => setView({ name: 'mathsExerciseTwo' })} 
            onNext={() => { markCompleted('mathsExerciseThree'); goToMathsExerciseFour() }}
          >
            <MathsExerciseThree onBack={() => setView({ name: 'mathsExerciseTwo' })} onNextExercise={() => { markCompleted('mathsExerciseThree'); goToMathsExerciseFour() }} />
          </NavigationWrapper>
        )}
        {view.name === 'mathsExerciseFour' && (
          <NavigationWrapper 
            onBack={() => setView({ name: 'mathsExerciseThree' })} 
            onNext={() => { markCompleted('mathsExerciseFour'); goToMathsExerciseFive() }}
          >
            <MathsExerciseFour onBack={() => setView({ name: 'mathsExerciseThree' })} onNextExercise={() => { markCompleted('mathsExerciseFour'); goToMathsExerciseFive() }} />
          </NavigationWrapper>
        )}
        {view.name === 'mathsExerciseFive' && (
          <NavigationWrapper 
            onBack={() => setView({ name: 'mathsExerciseFour' })} 
            onNext={() => { markCompleted('mathsExerciseFive'); goToMathsExerciseSix() }}
          >
            <MathsExerciseFive onBack={() => setView({ name: 'mathsExerciseFour' })} onNextExercise={() => { markCompleted('mathsExerciseFive'); goToMathsExerciseSix() }} />
          </NavigationWrapper>
        )}
        {view.name === 'mathsExerciseSix' && (
          <NavigationWrapper 
            onBack={() => setView({ name: 'mathsExerciseFive' })} 
            onNext={() => { markCompleted('mathsExerciseSix'); goToMathsExerciseSeven() }}
          >
            <MathsExerciseSix onBack={() => setView({ name: 'mathsExerciseFive' })} onNextExercise={() => { markCompleted('mathsExerciseSix'); goToMathsExerciseSeven() }} />
          </NavigationWrapper>
        )}
        {view.name === 'mathsExerciseSeven' && (
          <NavigationWrapper 
            onBack={() => setView({ name: 'mathsExerciseSix' })} 
            onNext={() => { markCompleted('mathsExerciseSeven'); goToMathsExerciseEight() }}
          >
            <MathsExerciseSeven onBack={() => setView({ name: 'mathsExerciseSix' })} onNextExercise={() => { markCompleted('mathsExerciseSeven'); goToMathsExerciseEight() }} />
          </NavigationWrapper>
        )}
        {view.name === 'mathsExerciseEight' && (
          <NavigationWrapper 
            onBack={() => setView({ name: 'mathsExerciseSeven' })} 
            onNext={() => { markCompleted('mathsExerciseEight'); goToMathsExerciseNine() }}
          >
            <MathsExerciseEight onBack={() => setView({ name: 'mathsExerciseSeven' })} onNextExercise={() => { markCompleted('mathsExerciseEight'); goToMathsExerciseNine() }} />
          </NavigationWrapper>
        )}
        {view.name === 'mathsExerciseNine' && (
          <NavigationWrapper 
            onBack={() => setView({ name: 'mathsExerciseEight' })} 
            onNext={() => { markCompleted('mathsExerciseNine'); goToComputerOverview() }}
          >
            <MathsExerciseNine onBack={() => setView({ name: 'mathsExerciseEight' })} onComplete={() => markCompleted('mathsExerciseNine')} onNext={() => { markCompleted('mathsExerciseNine'); goToComputerOverview() }} />
          </NavigationWrapper>
        )}
        {view.name === 'english' && <EnglishOverview onStart={goToEnglishWordGame} onBack={goHome} />}

        {view.name === 'englishReadWords' && (
          <NavigationWrapper 
            onBack={() => goToVocabularyThreeAd()} 
            onNext={() => { markCompleted('englishReadWords'); goToEnglishReadWords2() }}
          >
            <EnglishReadWords onBack={() => goToVocabularyThreeAd()} onNext={() => { markCompleted('englishReadWords'); goToEnglishReadWords2() }} />
          </NavigationWrapper>
        )}
        {view.name === 'englishReadWords2' && (
          <NavigationWrapper 
            onBack={() => goToEnglishReadWords()} 
            onNext={() => { markCompleted('englishReadWords2'); goToMaths() }}
          >
            <EnglishReadWords2 onBack={() => goToEnglishReadWords()} />
          </NavigationWrapper>
        )}
        {view.name === 'englishWordGame' && (
          <NavigationWrapper 
            onBack={() => setView({ name: 'english' })} 
            onNext={() => { markCompleted('englishWordGame'); goToEnglishPhonics() }}
          >
            <EnglishWordGame onBack={() => setView({ name: 'english' })} />
          </NavigationWrapper>
        )}
        {view.name === 'englishPhonics' && (
          <NavigationWrapper 
            onBack={() => goToEnglishWordGame()} 
            onNext={() => { markCompleted('englishPhonics'); goToEnglishFillBlanks() }}
          >
            <EnglishPhonics onBack={() => goToEnglishWordGame()} />
          </NavigationWrapper>
        )}
        {view.name === 'englishFillBlanks' && (
          <NavigationWrapper 
            onBack={() => goToEnglishPhonics()} 
            onNext={() => { markCompleted('englishFillBlanks'); goToScienceOverview() }}
          >
            <EnglishFillBlanks onBack={() => goToEnglishPhonics()} />
          </NavigationWrapper>
        )}
        {view.name === 'science' && <ScienceOverview onStart={goToScienceHuman} onBack={goHome} />}
        {/* {view.name === 'scienceOrgan' && <ScienceOrgan onBack={goToScienceOverview} onNext={goToScienceHuman} />} */}
        {view.name === 'scienceHuman' && (
          <NavigationWrapper 
            onBack={goToScienceOverview} 
            onNext={() => { markCompleted('scienceHuman'); goHome() }}
          >
            <ScienceHuman onBack={goToScienceOverview} />
          </NavigationWrapper>
        )}

        {view.name === 'computer' && <ComputerOverview onStart={goToComputerKeyboard} onBack={goHome} />}
        {view.name === 'computerKeyboard' && (
          <NavigationWrapper onBack={goToComputerOverview} onNext={() => { markCompleted('computerKeyboard'); goToEVSOverview() }}>
            <ComputerKeyboard onBack={goToComputerOverview} />
          </NavigationWrapper>
        )}

        {view.name === 'evs' && <EVSOverview onStart={goToEVSIdentify} onBack={goHome} />}
        {view.name === 'evsIdentify' && (
          <NavigationWrapper onBack={goToEVSOverview} onNext={() => { markCompleted('evsIdentify'); goToEVSGender() }}>
            <EVSIdentify onBack={goToEVSOverview} />
          </NavigationWrapper>
        )}
        {view.name === 'evsGender' && (
          <NavigationWrapper onBack={goToEVSIdentify} onNext={() => { markCompleted('evsGender'); goToEVSJams() }}>
            <EVSGender onBack={goToEVSIdentify} />
          </NavigationWrapper>
        )}
        {view.name === 'evsJams' && (
          <NavigationWrapper onBack={goToEVSGender} onNext={() => { markCompleted('evsJams'); goToEVSBags() }}>
            <EVSJams onBack={goToEVSGender} />
          </NavigationWrapper>
        )}
        {view.name === 'evsBags' && (
          <NavigationWrapper onBack={goToEVSJams} onNext={() => { markCompleted('evsBags'); goToEVSMap() }}>
            <EVSBags onBack={goToEVSJams} />
          </NavigationWrapper>
        )}
        {view.name === 'evsMap' && (
          <NavigationWrapper onBack={goToEVSBags} onNext={() => { markCompleted('evsMap'); goToHealthOverview() }}>
            <EVSMap onBack={() => setView({ name: 'evs' })} />
          </NavigationWrapper>
        )}
      </div>
    </div>
  )
}


