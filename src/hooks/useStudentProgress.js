import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useStudentProgress(studentId) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const startTimeRef = useRef(null)

    // Start tracking time when the hook is mounted or when explicitly called
    const startTracking = () => {
        startTimeRef.current = Date.now()
    }

    // Also start tracking on mount
    useEffect(() => {
        startTracking()
    }, [])

    const getProgress = async () => {
        if (!studentId) return []

        setLoading(true)
        try {
            const { data, error: pgError } = await supabase
                .from('student_progress')
                .select('exercise_id, exercises(slug), completed')
                .eq('student_id', studentId)

            if (pgError) throw pgError

            return data.map(rp => rp.exercises.slug)
        } catch (err) {
            console.error('Error fetching progress:', err)
            setError(err.message)
            return []
        } finally {
            setLoading(false)
        }
    }

    const saveProgress = async (exerciseSlug, score = null, completed = true, metadata = {}) => {
        if (!studentId) {
            console.warn('No student ID provided for progress tracking')
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Calculate time spent
            const endTime = Date.now()
            const timeSpentSeconds = startTimeRef.current
                ? Math.floor((endTime - startTimeRef.current) / 1000)
                : 0

            // 1. Get exercise_id
            const { data: exercise, error: exError } = await supabase
                .from('exercises')
                .select('id')
                .eq('slug', exerciseSlug)
                .single()

            if (exError) throw new Error(`Exercise not found: ${exerciseSlug}`)

            // 2. Check for existing progress to increment attempts
            const { data: existing } = await supabase
                .from('student_progress')
                .select('id, attempts, score')
                .eq('student_id', studentId)
                .eq('exercise_id', exercise.id)
                .single()

            const attempts = (existing?.attempts || 0) + 1

            // Only update score if new score is higher (optional logic, but good utility) 
            // OR always update. User requirement didn't specify. 
            // Usually we want to track the *latest* or *best*. 
            // The prompt says "score integer".
            // I will just save the current attempt's result.
            // If completed is true, we update completed.

            const payload = {
                student_id: studentId,
                exercise_id: exercise.id,
                completed: completed || existing?.completed || false,
                score: score,
                attempts: attempts,
                time_spent_seconds: (existing?.time_spent_seconds || 0) + timeSpentSeconds,
                last_attempted_at: new Date().toISOString(),
                metadata: {
                    ...(existing?.metadata || {}),
                    ...metadata
                }
            }

            // If it's the first time, updated headers are handled by DB defaults usually, 
            // but we want `first_attempted_at` to stay if it exists.
            // Upsert handles this if we exclude `first_attempted_at` from payload (it won't change on update).
            // But on insert, we want it. Defaults handle it.

            const { error: upError } = await supabase
                .from('student_progress')
                .upsert(payload, { onConflict: 'student_id, exercise_id' })

            if (upError) throw upError

            console.log('Progress saved:', { exerciseSlug, score, attempts })

        } catch (err) {
            console.error('Error saving progress:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return {
        startTracking,
        saveProgress,
        getProgress,
        loading,
        error
    }
}
