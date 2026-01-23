import React, { useRef } from 'react'

export default function FacchaLearn() {
    const btnRef = useRef()

    function vanish() {
        if (!btnRef.current) return
        btnRef.current.classList.add('vanish')
        setTimeout(() => btnRef.current.classList.remove('vanish'), 800)
    }

    return (
        <div style={{ minHeight: '100vh', padding: 40, color: '#fff' }}>
            <h2>Learn Demo</h2>
            <button ref={btnRef} id="btn" onClick={vanish} style={{ padding: 12 }}>Click</button>
        </div>
    )
}
