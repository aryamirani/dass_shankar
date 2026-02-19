/**
 * useSpeech - Shared speech hook for Interactive Learn modules.
 *
 * Strategy:
 *  1. Try to play a pre-generated natural-sounding MP3 from /audio/{word}.mp3
 *     (generated with Google TTS via gTTS - clear, natural, non-robotic)
 *  2. Fall back to Web Speech API if the audio file is not available.
 */
import { useRef, useEffect } from 'react'

export function useSpeech() {
    const voiceRef = useRef(null)
    // Cache of Audio objects so we don't re-fetch files repeatedly
    const audioCache = useRef({})

    useEffect(() => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return

        function chooseVoice() {
            const voices = window.speechSynthesis.getVoices() || []
            if (!voices.length) return

            let v = null
            v = v || voices.find(v => v.name === 'Google US English')
            v = v || voices.find(v => v.name === 'Google UK English Female')
            v = v || voices.find(v => v.name === 'Samantha')
            v = v || voices.find(v => v.name.includes('Ava') && v.lang.startsWith('en'))
            v = v || voices.find(v => v.name.includes('Aria') && v.lang.startsWith('en'))
            v = v || voices.find(v => v.name.includes('Jenny') && v.lang.startsWith('en'))
            v = v || voices.find(v => v.lang && v.lang.toLowerCase() === 'en-us')
            v = v || voices.find(v => v.lang && v.lang.toLowerCase() === 'en-gb')
            v = v || voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en'))
            v = v || voices[0]
            voiceRef.current = v
        }

        chooseVoice()
        window.speechSynthesis.onvoiceschanged = chooseVoice
        return () => {
            try { window.speechSynthesis.onvoiceschanged = null } catch (e) { }
        }
    }, [])

    function speakFallback(text) {
        try {
            if (typeof window === 'undefined' || !window.speechSynthesis) return
            window.speechSynthesis.cancel()
            const u = new SpeechSynthesisUtterance(text)
            if (voiceRef.current) {
                u.voice = voiceRef.current
                u.lang = voiceRef.current.lang || 'en-US'
            } else {
                u.lang = 'en-US'
            }
            u.rate = 0.85
            u.pitch = 1.0
            u.volume = 1.0
            window.speechSynthesis.speak(u)
        } catch (e) {
            console.warn('Speech synthesis fallback error:', e)
        }
    }

    function speak(text) {
        // Simple words can have pre-recorded audio files
        const word = text.toLowerCase().trim()
        const audioPath = `/audio/${word}.mp3`

        // Return cached Audio object if already loaded
        if (audioCache.current[word]) {
            const cached = audioCache.current[word]
            cached.currentTime = 0
            cached.play().catch(() => speakFallback(text))
            return
        }

        // Try to load the pre-recorded MP3 file
        const audio = new Audio(audioPath)
        audio.onerror = () => {
            // File not found - fall back to Web Speech API
            speakFallback(text)
        }
        audio.oncanplaythrough = () => {
            audioCache.current[word] = audio
            audio.play().catch(() => speakFallback(text))
        }
        audio.load()
    }

    return { speak }
}
