import './index.css'
import BG from "../../Timer_HC/src/assets/background.svg"
import React, { useState, useRef } from 'react'
import alarmSound from './assets/alarm_wake_up.mp3'

function App() {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(5)
  const [seconds, setSeconds] = useState(0)
  const [remaining, setRemaining] = useState(5 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [status, setStatus] = useState('Ready to start')
  const intervalRef = useRef<number | null>(null)
  const [flash, setFlash] = useState(false)
  const [pulse, setPulse] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  React.useEffect(() => {
    if (!isRunning) {
      setRemaining(hours * 3600 + minutes * 60 + seconds)
    }
  }, [hours, minutes, seconds])

  React.useEffect(() => {
    if (isRunning && remaining > 0) {
      setPulse(true)
      intervalRef.current = setInterval(() => {
        setRemaining(prev => prev - 1)
      }, 1000)
      setStatus('Running...')
    }
    if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      setPulse(false)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  React.useEffect(() => {
    if (remaining === 0 && isRunning) {
      setIsRunning(false)
      setStatus("Time's up! (Reset to Stop)")
      setPulse(false)
      setFlash(true)
      playNotification()
    }
  }, [remaining])

  function handleStart() {
    if (!isRunning && remaining > 0) {
      setIsRunning(true)
      setStatus('Running...')
      setFlash(false)
    }
  }

  function handlePause() {
    setIsRunning(false)
    setStatus('Paused')
  }

  function handleReset() {
    setIsRunning(false)
    setFlash(false)
    setStatus('Ready to start')
    setRemaining(hours * 3600 + minutes * 60 + seconds)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  function playNotification() {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(alarmSound)
        audioRef.current.loop = true
      }
      audioRef.current.currentTime = 0
      audioRef.current.play()
    } catch {
      if (navigator.vibrate) navigator.vibrate([200, 100, 200])
    }
  }

  const dispH = Math.floor(remaining / 3600)
  const dispM = Math.floor((remaining % 3600) / 60)
  const dispS = remaining % 60
  return (
    <>
            <div
        style={{
          backgroundImage: `url(${BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        className='w-full min-h-screen flex justify-center items-center'
      >
        <div className={`timer-container bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 w-full max-w-md ${flash ? 'flash-bg' : ''}`}>
          <div
            id="display"
            className={`text-6xl md:text-7xl font-bold text-white text-center mb-8 font-mono tracking-wider drop-shadow-lg ${pulse ? 'pulse-scale' : ''}`}
          >
            {`${dispH.toString().padStart(2, '0')}:${dispM.toString().padStart(2, '0')}:${dispS.toString().padStart(2, '0')}`}
          </div>
          <div className="input-section mb-8">
            <div className="flex justify-center gap-4 mb-6">
              <div className="flex flex-col items-center">
                <label htmlFor="hours" className="text-white text-xs font-semibold mb-2 uppercase tracking-wider">Hours</label>
                <input
                  type="number"
                  id="hours"
                  min="0"
                  max="23"
                  value={hours}
                  disabled={isRunning}
                  onChange={e => setHours(Math.max(0, Math.min(23, Number(e.target.value))))}
                  className="w-16 h-12 text-center text-lg font-semibold bg-white/20 backdrop-blur-sm text-white rounded-lg border-0 focus:ring-2 focus:ring-white/50 focus:bg-white/30 placeholder-white/70"
                />
              </div>
              <div className="flex flex-col items-center">
                <label htmlFor="minutes" className="text-white text-xs font-semibold mb-2 uppercase tracking-wider">Minutes</label>
                <input
                  type="number"
                  id="minutes"
                  min="0"
                  max="59"
                  value={minutes}
                  disabled={isRunning}
                  onChange={e => setMinutes(Math.max(0, Math.min(59, Number(e.target.value))))}
                  className="w-16 h-12 text-center text-lg font-semibold bg-white/20 backdrop-blur-sm text-white rounded-lg border-0 focus:ring-2 focus:ring-white/50 focus:bg-white/30 placeholder-white/70"
                />
              </div>
              <div className="flex flex-col items-center">
                <label htmlFor="seconds" className="text-white text-xs font-semibold mb-2 uppercase tracking-wider">Seconds</label>
                <input
                  type="number"
                  id="seconds"
                  min="0"
                  max="59"
                  value={seconds}
                  disabled={isRunning}
                  onChange={e => setSeconds(Math.max(0, Math.min(59, Number(e.target.value))))}
                  className="w-16 h-12 text-center text-lg font-semibold bg-white/20 backdrop-blur-sm text-white rounded-lg border-0 focus:ring-2 focus:ring-white/50 focus:bg-white/30 placeholder-white/70"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <button
              id="startBtn"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-full uppercase tracking-wide text-sm transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 min-w-[100px]"
              onClick={handleStart}
              disabled={isRunning || remaining === 0}
            >
              Start
            </button>
            <button
              id="pauseBtn"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-full uppercase tracking-wide text-sm transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[100px]"
              onClick={handlePause}
              disabled={!isRunning}
            >
              Pause
            </button>
            <button
              id="resetBtn"
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-full uppercase tracking-wide text-sm transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 min-w-[100px]"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
          <div id="status" className="text-center text-white text-lg font-bold uppercase tracking-wider">
            {status}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
