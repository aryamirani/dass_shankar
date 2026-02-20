import React, { useState, useEffect } from 'react'
import { useStudentProgress } from './hooks/useStudentProgress'
import Sidebar from './components/Sidebar'
import Landing from './pages/Landing'
import HealthOverview from './pages/Grade2/health/HealthOverview'
import HealthProblems from './pages/Grade2/health/HealthProblems'
import Lesson from './pages/Grade2/science/Lesson'
import Assessment from './pages/Grade2/health/Assessment'
import Vocabulary from './pages/Grade1/english/Vocabulary'
import VocabularyExercise from './pages/Grade1/english/VocabularyExercise'
import VocabularyExerciseAM from './pages/Grade1/english/VocabularyExerciseAM'
import VocabularyThree from './pages/Grade1/english/VocabularyThree'
import VocabularyThreeAM from './pages/Grade1/english/VocabularyThreeAM'
import VocabularyExerciseAg from './pages/Grade1/english/VocabularyExerciseAg'
import VocabularyThreeAg from './pages/Grade1/english/VocabularyThreeAg'
import VocabularyExerciseAd from './pages/Grade1/english/VocabularyExerciseAd'
import VocabularyThreeAd from './pages/Grade1/english/VocabularyThreeAd'
import VocabularyExerciseAn from './pages/Grade1/english/VocabularyExerciseAn'
import VocabularyThreeAn from './pages/Grade1/english/VocabularyThreeAn'
import VocabularyExerciseAp from './pages/Grade1/english/VocabularyExerciseAp'
import VocabularyThreeAp from './pages/Grade1/english/VocabularyThreeAp'
import Maths from './pages/Grade1/maths/Maths'
import MathsExerciseOne from './pages/Grade1/maths/MathsExerciseOne'
import MathsExerciseTwo from './pages/Grade1/maths/MathsExerciseTwo'
import MathsExerciseThree from './pages/Grade1/maths/MathsExerciseThree'
import MathsExerciseFour from './pages/Grade1/maths/MathsExerciseFour'
import MathsExerciseFive from './pages/Grade1/maths/MathsExerciseFive'
import MathsExerciseSix from './pages/Grade1/maths/MathsExerciseSix'
import MathsExerciseSeven from './pages/Grade1/maths/MathsExerciseSeven'
import MathsExerciseEight from './pages/Grade1/maths/MathsExerciseEight'
import MathsExerciseNine from './pages/Grade1/maths/MathsExerciseNine'
import EnglishOverview from './pages/Grade2/english/EnglishOverview'
import EnglishReadWords from './pages/Grade1/english/EnglishReadWords'
import EnglishReadWords2 from './pages/Grade1/english/EnglishReadWords2'
import EnglishWordGame from './pages/Grade2/english/EnglishWordGame'
import EnglishPhonics from './pages/Grade2/english/EnglishPhonics'
import EnglishFillBlanks from './pages/Grade2/english/EnglishFillBlanks'
import ScienceOverview from './pages/Grade2/science/ScienceOverview'
// import ScienceOrgan from './pages/ScienceOrgan'
import ScienceHuman from './pages/Grade2/science/ScienceHuman'
import ComputerOverview from './pages/Grade1/computer/ComputerOverview'
import ComputerKeyboard from './pages/Grade1/computer/ComputerKeyboard'
import EVSOverview from './pages/Grade1/evs/EVSOverview'
import EVSIdentify from './pages/Grade1/evs/EVSIdentify'
import EVSGender from './pages/Grade1/evs/EVSGender'
import EVSJams from './pages/Grade1/evs/EVSJams'
import EVSBags from './pages/Grade1/evs/EVSBags'
import EVSMap from './pages/Grade1/evs/EVSMap'
import ArtsOverview from './pages/Grade1/arts/ArtsOverview'
import BookOverview from './pages/BookOverview'
import GradeOverview from './pages/GradeOverview'
import TestResultsSummary from './components/TestResultsSummary'
import CONDITIONS from './data/conditions'

// Wrapper for consistent navigation buttons
const NavigationWrapper = ({ children, onBack }) => {
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

      {children}
    </div>
  )
}

export default function LearningApp({ studentProfile, onExit }) {
  const [view, setView] = useState({ name: 'landing', index: 0 })
  const [completed, setCompleted] = useState([]) // store condition ids
  const [appMode, setAppMode] = useState('learn') // 'learn' or 'test'
  const [testSession, setTestSession] = useState({ active: false, results: [] })

  // load persisted completed list on mount
  useEffect(() => {
    const loadProgress = async () => {
      // 1. Try local storage first (instant)
      try {
        const raw = localStorage.getItem('completedLessons')
        if (raw) {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) setCompleted(parsed)
        }
      } catch (e) {
        console.warn('Failed to load completed lessons from localStorage', e)
      }

      // 2. If studentProfile exists, fetch from Supabase (source of truth)
      if (studentProfile?.id) {
        const sbProgress = await getProgress()
        if (sbProgress && sbProgress.length > 0) {
          // Merge with local if needed, or just replace? 
          // Replacing is cleaner for cross-device sync.
          setCompleted(prev => {
            const combined = new Set([...prev, ...sbProgress])
            return Array.from(combined)
          })
        }
      }
    }

    loadProgress()
  }, [studentProfile?.id])

  // persist when completed changes
  useEffect(() => {
    try { localStorage.setItem('completedLessons', JSON.stringify(completed)) } catch (e) { console.warn('Failed to save completed lessons', e) }
  }, [completed])

  // Auto-navigate based on student profile grade
  useEffect(() => {
    if (studentProfile?.grades?.display_name) {
      const grade = studentProfile.grades.display_name
      const currentGrade = view.name.startsWith('landing2') || ['book-a-grade-x2', 'health', 'english', 'science'].includes(view.name) ? 'Grade 2' : 'Grade 1'

      // If student is looking at the other grade's landing page, force them back
      if (grade === 'Grade 1' && view.name === 'landing2') {
        setView({ name: 'landing' })
      } else if (grade === 'Grade 2' && view.name === 'landing') {
        setView({ name: 'landing2' })
      }
    }
  }, [studentProfile, view.name])

  function goToLesson(index) {
    setView({ name: 'lesson', index })
  }
  function goHome() {
    if (studentProfile?.grades?.display_name === 'Grade 1') {
      setView({ name: 'book-a-grade-x' })
    } else if (studentProfile?.grades?.display_name === 'Grade 2') {
      setView({ name: 'book-a-grade-x2' })
    } else {
      setView({ name: 'landing', index: 0 })
    }
  }
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
  function goToArtsOverview() { setView({ name: 'arts' }) }
  function next() {
    if (view.name === 'lesson') {
      const nextIndex = view.index + 1
      if (nextIndex < CONDITIONS.length) setView({ name: 'lesson', index: nextIndex })
      else setView({ name: 'landing', index: 0 })
    }
  }

  // Initialize hook
  const { saveProgress, getProgress } = useStudentProgress(studentProfile?.id)

  function handleModeChange(mode) {
    setAppMode(mode)
    // When switching to test mode, reset test session
    if (mode === 'test') {
      setTestSession({ active: true, results: [] })
    } else {
      setTestSession({ active: false, results: [] })
    }
  }

  async function handleComplete(id, score = 100, metadata = {}) {
    if (appMode === 'test') {
      setTestSession(prev => {
        // Find if we already have a result for this specific activity
        const existingIdx = prev.results.findIndex(r => r.id === id);
        let newResults;
        if (existingIdx >= 0) {
          // Update existing result (take the higher score)
          newResults = [...prev.results];
          if (score > newResults[existingIdx].score) {
            newResults[existingIdx] = { ...newResults[existingIdx], score, metadata, timestamp: new Date().toISOString() };
          }
        } else {
          // Add new result
          newResults = [...prev.results, { id, score, metadata, timestamp: new Date().toISOString() }];
        }
        return { ...prev, results: newResults };
      })
    } else {
      setCompleted(prev => prev.includes(id) ? prev : [...prev, id])
      // If guest is exploring, don't save progress to Supabase
      if (studentProfile?.id && !studentProfile?.isGuest) {
        await saveProgress(id, score, true, { mode: 'practice', ...metadata })
      }
    }
  }

  async function finalizeTest() {
    if (!testSession.results.length) return

    // Save all results to Supabase (only for students, not parent preview or guest)
    if (studentProfile?.id && !studentProfile?.parentPreview && !studentProfile?.isGuest) {
      for (const res of testSession.results) {
        await saveProgress(res.id, res.score, true, { mode: 'test', ...res.metadata })
      }
    }

    setTestSession(prev => ({ ...prev, active: false }));
    setView({ name: 'test-summary' })
  }

  const allDone = completed.length === CONDITIONS.length

  const GRADE1_MODULES = [
    { id: 'vocabulary', label: 'English', icon: '📚', color: '#6366f1', description: 'Master new words through fun games and reading exercises.' },
    { id: 'maths', label: 'Maths', icon: '📐', color: '#a855f7', description: 'Learn counting, place values, and solve exciting word problems.' },
    { id: 'computer', label: 'Computer', icon: '💻', color: '#3b82f6', description: 'Start your digital journey with basic typing skills.' },
    { id: 'evs', label: 'EVS', icon: '🌿', color: '#10b981', description: 'Explore the world around you and identify objects and places.' },
    { id: 'arts', label: 'Arts', icon: '🎨', color: '#f59e0b', description: 'Express your creativity through patterns and colors.' }
  ]

  const GRADE2_MODULES = [
    { id: 'health', label: 'Health', icon: '❤️', color: '#ef4444', description: 'Learn about common health problems and simple remedies.' },
    { id: 'english', label: 'English', icon: '📖', color: '#f97316', description: 'Improve your grammar and vocabulary with word puzzles.' },
    { id: 'science', label: 'Science', icon: '🔬', color: '#06b6d4', description: 'Discover the human body and scientific wonders.' }
  ]

  function goToAssessment() { setView({ name: 'assessment' }) }

  function handleSidebarNav(viewId) {
    if (viewId === 'health-folder') return

    // Reset index when switching main views via sidebar
    if (viewId === 'health') setView({ name: 'health' }) // This now goes to Overview
    else if (viewId === 'landing') setView({ name: 'landing', index: 0 })
    else if (viewId === 'vocabulary') setView({ name: 'vocabulary' })
    else if (viewId === 'maths') setView({ name: 'maths' })
    else if (viewId === 'english') setView({ name: 'english' })
    else if (viewId === 'science') setView({ name: 'science' }) // Goes to science overview
    else if (viewId === 'computer') setView({ name: 'computer' }) // Goes to computer overview
    else if (viewId === 'evs') setView({ name: 'evs' })
    else if (viewId === 'arts') setView({ name: 'arts' })
    else if (viewId === 'book-a-grade-x') setView({ name: 'book-a-grade-x' })
    else if (viewId === 'book-a-grade-x2') setView({ name: 'book-a-grade-x2' })
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
    if (view.name === 'landing' || view.name === 'landing2' || view.name === 'book-a-grade-x' || view.name === 'book-a-grade-x2') return 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' // Darker consistent background

    return 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
  }

  return (
    <div className="app-root" style={{ '--app-background': getBackground(), background: 'var(--app-background)', display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar
        currentView={view.name}
        onChangeView={handleSidebarNav}
        completedItems={completed}
        studentProfile={studentProfile}
        onExit={onExit}
        testActive={testSession.active}
        appMode={appMode}
        onFinalize={finalizeTest}
      />

      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {view.name === 'landing' && (
          <GradeOverview
            gradeName="S-Learn - Grade 1"
            onBookClick={(bookId) => setView({ name: bookId })}
          />
        )}
        {view.name === 'landing2' && (
          <GradeOverview
            gradeName="S-Learn - Grade 2"
            onBookClick={(bookId) => setView({ name: bookId })}
          />
        )}

        {view.name === 'book-a-grade-x' && (
          <BookOverview
            gradeName="Book A - Grade 1"
            modules={GRADE1_MODULES}
            onModuleClick={handleSidebarNav}
            mode={appMode}
            onModeChange={handleModeChange}
          />
        )}

        {view.name === 'book-a-grade-x2' && (
          <BookOverview
            gradeName="Book A - Grade 2"
            modules={GRADE2_MODULES}
            onModuleClick={handleSidebarNav}
            mode={appMode}
            onModeChange={handleModeChange}
          />
        )}

        {view.name === 'test-summary' && (
          <TestResultsSummary
            results={testSession.results}
            totalExpectedCount={studentProfile?.grades?.display_name === 'Grade 2' ? 17 : 29}
            onBackToOverview={() => {
              setAppMode('learn')
              setTestSession({ active: false, results: [] })
              setView({ name: studentProfile?.grades?.display_name === 'Grade 2' ? 'book-a-grade-x2' : 'book-a-grade-x' })
            }}
          />
        )}

        {view.name === 'health' && <HealthOverview onStart={goToHealthProblems} onBack={goHome} />}
        {view.name === 'healthProblems' && (
          <NavigationWrapper
            onBack={goToHealthOverview}
          >
            <HealthProblems mode={appMode} onStart={() => goToLesson(0)} onSelect={(imgIndex) => goToLesson(imgIndex)} completed={completed} allDone={allDone} onAllDone={() => handleComplete('health')} onVocabulary={goToVocabulary} onBack={goToHealthOverview} onNextExercise={goToAssessment} />
          </NavigationWrapper>
        )}
        {view.name === 'lesson' && <Lesson data={CONDITIONS[view.index]} index={view.index} total={CONDITIONS.length} onBack={goToHealthProblems} onNext={next} onComplete={handleComplete} onBackToGrid={() => { if (appMode !== 'test') handleComplete('health'); goToHealthProblems() }} />}
        {view.name === 'assessment' && (
          <NavigationWrapper
            onBack={goToHealthProblems}
          >
            <Assessment mode={appMode} onDone={() => { handleComplete('assessment'); goToEnglish() }} onNextExercise={() => { handleComplete('assessment'); goToEnglish() }} />
          </NavigationWrapper>
        )}
        {view.name === 'vocabulary' && <Vocabulary onStart={goToVocabularyExercise} onBack={goHome} />}
        {view.name === 'vocabularyExercise' && (
          <NavigationWrapper
            onBack={() => setView({ name: 'vocabulary' })}
          >
            <VocabularyExercise onBack={() => setView({ name: 'vocabulary' })} onNextExercise={() => { handleComplete('vocabularyExercise'); goToVocabularyThree() }} />
          </NavigationWrapper>
        )}
        {view.name === 'vocabularyExerciseAn' && (
          <NavigationWrapper
            onBack={() => goToVocabularyExercise()}
          >
            <VocabularyExerciseAn onBack={() => goToVocabularyExercise()} onNextExercise={() => { handleComplete('vocabularyExerciseAn'); goToVocabularyThreeAn() }} />
          </NavigationWrapper>
        )}
        {view.name === 'vocabularyExerciseAp' && (
          <NavigationWrapper
            onBack={() => goToVocabularyExerciseAn()}
          >
            <VocabularyExerciseAp onBack={() => goToVocabularyExerciseAn()} onNextExercise={() => { handleComplete('vocabularyExerciseAp'); goToVocabularyThreeAp() }} />
          </NavigationWrapper>
        )}
        {view.name === 'vocabularyExerciseAg' && (
          <NavigationWrapper
            onBack={() => goToVocabularyExerciseAp()}
          >
            <VocabularyExerciseAg onBack={() => goToVocabularyExerciseAp()} onNextExercise={() => { handleComplete('vocabularyExerciseAg'); goToVocabularyThreeAg() }} />
          </NavigationWrapper>
        )}
        {view.name === 'vocabularyExerciseAM' && (
          <NavigationWrapper
            onBack={() => goToVocabularyExerciseAg()}
          >
            <VocabularyExerciseAM onBack={() => goToVocabularyExerciseAg()} onNextExercise={() => { handleComplete('vocabularyExerciseAM'); goToVocabularyThreeAM() }} />
          </NavigationWrapper>
        )}
        {view.name === 'vocabularyExerciseAd' && (
          <NavigationWrapper
            onBack={() => goToVocabularyExerciseAM()}
          >
            <VocabularyExerciseAd onBack={() => goToVocabularyExerciseAM()} onNextExercise={() => { handleComplete('vocabularyExerciseAd'); goToVocabularyThreeAd() }} />
          </NavigationWrapper>
        )}

        {view.name === 'vocabularyThree' && (
          <NavigationWrapper
            onBack={() => goToVocabularyExerciseAd()}
          >
            <VocabularyThree onBack={() => goToVocabularyExercise()} onNextExercise={() => { handleComplete('vocabularyThree'); goToVocabularyExerciseAn() }} />
          </NavigationWrapper>
        )}
        {view.name === 'vocabularyThreeAn' && (
          <NavigationWrapper
            onBack={() => goToVocabularyThree()}
          >
            <VocabularyThreeAn onBack={() => goToVocabularyThree()} onNextExercise={() => { handleComplete('vocabularyThreeAn'); goToVocabularyExerciseAp() }} />
          </NavigationWrapper>
        )}
        {view.name === 'vocabularyThreeAp' && (
          <NavigationWrapper
            onBack={() => goToVocabularyThreeAn()}
          >
            <VocabularyThreeAp onBack={() => goToVocabularyThreeAn()} onNextExercise={() => { handleComplete('vocabularyThreeAp'); goToVocabularyExerciseAg() }} />
          </NavigationWrapper>
        )}
        {view.name === 'vocabularyThreeAg' && (
          <NavigationWrapper
            onBack={() => goToVocabularyThreeAp()}
          >
            <VocabularyThreeAg onBack={() => goToVocabularyThreeAp()} onNextExercise={() => { handleComplete('vocabularyThreeAg'); goToVocabularyExerciseAM() }} />
          </NavigationWrapper>
        )}
        {view.name === 'vocabularyThreeAM' && (
          <NavigationWrapper
            onBack={() => goToVocabularyThreeAg()}
          >
            <VocabularyThreeAM onBack={() => goToVocabularyThreeAg()} onNextExercise={() => { handleComplete('vocabularyThreeAM'); goToVocabularyExerciseAd() }} />
          </NavigationWrapper>
        )}
        {view.name === 'vocabularyThreeAd' && (
          <NavigationWrapper
            onBack={() => goToVocabularyThreeAM()}
          >
            <VocabularyThreeAd onBack={() => goToVocabularyThreeAM()} onNextExercise={() => { handleComplete('vocabularyThreeAd'); goToMaths() }} />
          </NavigationWrapper>
        )}
        {view.name === 'maths' && <Maths onStart={goToMathsExerciseOne} onBack={goHome} />}
        {view.name === 'mathsExerciseOne' && (
          <NavigationWrapper
            onBack={() => setView({ name: 'maths' })}
          >
            <MathsExerciseOne onBack={() => setView({ name: 'maths' })} onNextExercise={() => { handleComplete('mathsExerciseOne'); goToMathsExerciseTwo() }} />
          </NavigationWrapper>
        )}
        {view.name === 'mathsExerciseTwo' && (
          <NavigationWrapper
            onBack={() => setView({ name: 'mathsExerciseOne' })}
          >
            <MathsExerciseTwo onBack={() => setView({ name: 'mathsExerciseOne' })} onNextExercise={() => { handleComplete('mathsExerciseTwo'); goToMathsExerciseThree() }} />
          </NavigationWrapper>
        )}
        {view.name === 'mathsExerciseThree' && (
          <NavigationWrapper
            onBack={() => setView({ name: 'mathsExerciseTwo' })}
          >
            <MathsExerciseThree onBack={() => setView({ name: 'mathsExerciseTwo' })} onNextExercise={() => { handleComplete('mathsExerciseThree'); goToMathsExerciseFour() }} />
          </NavigationWrapper>
        )}
        {view.name === 'mathsExerciseFour' && (
          <NavigationWrapper
            onBack={() => setView({ name: 'mathsExerciseThree' })}
          >
            <MathsExerciseFour onBack={() => setView({ name: 'mathsExerciseThree' })} onNextExercise={() => { handleComplete('mathsExerciseFour'); goToMathsExerciseFive() }} />
          </NavigationWrapper>
        )}
        {view.name === 'mathsExerciseFive' && (
          <NavigationWrapper
            onBack={() => setView({ name: 'mathsExerciseFour' })}
          >
            <MathsExerciseFive onBack={() => setView({ name: 'mathsExerciseFour' })} onNextExercise={() => { handleComplete('mathsExerciseFive'); goToMathsExerciseSix() }} />
          </NavigationWrapper>
        )}
        {view.name === 'mathsExerciseSix' && (
          <NavigationWrapper
            onBack={() => setView({ name: 'mathsExerciseFive' })}
          >
            <MathsExerciseSix onBack={() => setView({ name: 'mathsExerciseFive' })} onNextExercise={() => { handleComplete('mathsExerciseSix'); goToMathsExerciseSeven() }} />
          </NavigationWrapper>
        )}
        {view.name === 'mathsExerciseSeven' && (
          <NavigationWrapper
            onBack={() => setView({ name: 'mathsExerciseSix' })}
          >
            <MathsExerciseSeven onBack={() => setView({ name: 'mathsExerciseSix' })} onNextExercise={() => { handleComplete('mathsExerciseSeven'); goToMathsExerciseEight() }} />
          </NavigationWrapper>
        )}
        {view.name === 'mathsExerciseEight' && (
          <NavigationWrapper
            onBack={() => setView({ name: 'mathsExerciseSeven' })}
          >
            <MathsExerciseEight onBack={() => setView({ name: 'mathsExerciseSeven' })} onNextExercise={() => { handleComplete('mathsExerciseEight'); goToMathsExerciseNine() }} />
          </NavigationWrapper>
        )}
        {view.name === 'mathsExerciseNine' && (
          <NavigationWrapper
            onBack={() => setView({ name: 'mathsExerciseEight' })}
          >
            <MathsExerciseNine onBack={() => setView({ name: 'mathsExerciseEight' })} onComplete={() => handleComplete('mathsExerciseNine')} onNextExercise={() => { handleComplete('mathsExerciseNine'); goToComputerOverview() }} />
          </NavigationWrapper>
        )}
        {view.name === 'english' && <EnglishOverview onStart={goToEnglishWordGame} onBack={goHome} />}

        {view.name === 'englishReadWords' && (
          <NavigationWrapper
            onBack={() => goToVocabularyThreeAd()}
          >
            <EnglishReadWords onBack={() => goToVocabularyThreeAd()} onNextExercise={() => { handleComplete('englishReadWords'); goToEnglishReadWords2() }} />
          </NavigationWrapper>
        )}
        {view.name === 'englishReadWords2' && (
          <NavigationWrapper
            onBack={() => goToEnglishReadWords()}
          >
            <EnglishReadWords2 onBack={() => goToEnglishReadWords()} onNextExercise={() => { handleComplete('englishReadWords2'); goToVocabulary() }} />
          </NavigationWrapper>
        )}
        {view.name === 'englishWordGame' && (
          <NavigationWrapper
            onBack={() => setView({ name: 'english' })}
          >
            <EnglishWordGame onBack={() => setView({ name: 'english' })} onNextExercise={() => { handleComplete('englishWordGame'); goToEnglishPhonics() }} />
          </NavigationWrapper>
        )}
        {view.name === 'englishPhonics' && (
          <NavigationWrapper
            onBack={() => goToEnglishWordGame()}
          >
            <EnglishPhonics onBack={() => goToEnglishWordGame()} onNextExercise={() => { handleComplete('englishPhonics'); goToEnglishFillBlanks() }} />
          </NavigationWrapper>
        )}
        {view.name === 'englishFillBlanks' && (
          <NavigationWrapper
            onBack={() => goToEnglishPhonics()}
          >
            <EnglishFillBlanks onBack={() => goToEnglishPhonics()} onNextExercise={() => { handleComplete('englishFillBlanks'); goToScienceOverview() }} />
          </NavigationWrapper>
        )}
        {view.name === 'science' && <ScienceOverview onStart={goToScienceHuman} onBack={goHome} />}
        {/* {view.name === 'scienceOrgan' && <ScienceOrgan onBack={goToScienceOverview} onNext={goToScienceHuman} />} */}
        {view.name === 'scienceHuman' && (
          <NavigationWrapper
            onBack={goToScienceOverview}
          >
            <ScienceHuman onBack={goToScienceOverview} onNextExercise={() => { handleComplete('scienceHuman'); goHome() }} />
          </NavigationWrapper>
        )}

        {view.name === 'computer' && <ComputerOverview onStart={goToComputerKeyboard} onBack={goHome} />}
        {view.name === 'computerKeyboard' && (
          <NavigationWrapper onBack={goToComputerOverview}>
            <ComputerKeyboard onBack={goToComputerOverview} onNextExercise={() => { handleComplete('computerKeyboard'); goToEVSOverview() }} />
          </NavigationWrapper>
        )}

        {view.name === 'evs' && <EVSOverview onStart={goToEVSIdentify} onBack={goHome} />}
        {view.name === 'evsIdentify' && (
          <NavigationWrapper onBack={goToEVSOverview}>
            <EVSIdentify onBack={goToEVSOverview} onNextExercise={() => { handleComplete('evsIdentify'); goToEVSGender() }} />
          </NavigationWrapper>
        )}
        {view.name === 'evsGender' && (
          <NavigationWrapper onBack={goToEVSIdentify}>
            <EVSGender onBack={goToEVSIdentify} onNextExercise={() => { handleComplete('evsGender'); goToEVSJams() }} />
          </NavigationWrapper>
        )}
        {view.name === 'evsJams' && (
          <NavigationWrapper onBack={goToEVSGender}>
            <EVSJams onBack={goToEVSGender} onNextExercise={() => { handleComplete('evsJams'); goToEVSBags() }} />
          </NavigationWrapper>
        )}
        {view.name === 'evsBags' && (
          <NavigationWrapper onBack={goToEVSJams}>
            <EVSBags onBack={goToEVSJams} onNextExercise={() => { handleComplete('evsBags'); goToEVSMap() }} />
          </NavigationWrapper>
        )}
        {view.name === 'evsMap' && (
          <NavigationWrapper onBack={goToEVSBags}>
            <EVSMap onBack={() => setView({ name: 'evs' })} onNextExercise={() => { handleComplete('evsMap'); goToArtsOverview() }} />
          </NavigationWrapper>
        )}
        {view.name === 'arts' && <ArtsOverview onBack={goHome} />}
      </div>
    </div>
  )
}


