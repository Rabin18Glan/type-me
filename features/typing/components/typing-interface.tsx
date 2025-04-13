"use client"

import React, { useEffect, useRef, useCallback } from "react"
import { useTyping } from "@/features/typing/context/typing-context"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { calculateMetrics } from "@/lib/metrics"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Award } from "lucide-react"
import VirtualKeyboard from "@/features/typing/components/virtual-keyboard"
import TypingMetrics from "@/features/typing/components/typing-metrics"

export default function TypingInterface() {
  const {
    text,
    typedText,
    setTypedText,
    isLoading,
    isTyping,
    setIsTyping,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    metrics,
    setMetrics,
    settings,
  } = useTyping()

  const inputRef = useRef<HTMLInputElement>(null)
  const textDisplayRef = useRef<HTMLDivElement>(null)

  // Focus input when component mounts or text changes
  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus()
    }
  }, [text, isLoading])

  // Re-focus input when clicked anywhere in the text display
  const handleTextDisplayClick = useCallback(() => {
    if (inputRef.current && !endTime) {
      inputRef.current.focus()
    }
  }, [endTime])

  // Update metrics during typing
  useEffect(() => {
    if (startTime && !endTime) {
      const now = Date.now()
      const elapsedTime = (now - startTime) / 1000

      // Check if time limit reached
      if (settings.duration > 0 && elapsedTime >= settings.duration) {
        setEndTime(now)
        setIsTyping(false)
      }

      // Update metrics
      const newMetrics = calculateMetrics(text, typedText, startTime, now)
      setMetrics(newMetrics)

      // Auto-scroll text display to keep current position visible
      if (textDisplayRef.current) {
        const currentPos = typedText.length
        const textDisplay = textDisplayRef.current
        const charElements = textDisplay.querySelectorAll("span")

        if (charElements[currentPos]) {
          charElements[currentPos].scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          })
        }
      }
    }
  }, [typedText, startTime, endTime, text, settings.duration, setEndTime, setIsTyping, setMetrics])

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Start timer on first keystroke
    if (!startTime && value) {
      setStartTime(Date.now())
      setIsTyping(true)
    }

    // Update typed text
    setTypedText(value)

    // Check if typing is complete
    if (value === text) {
      setEndTime(Date.now())
      setIsTyping(false)
    }
  }

  // Calculate progress percentage
  const progressPercentage = text ? (typedText.length / text.length) * 100 : 0

  // Calculate time remaining
  const timeRemaining =
    startTime && settings.duration > 0
      ? Math.max(0, settings.duration - (Date.now() - startTime) / 1000)
      : settings.duration

  return (
    <div className="relative">
      {/* Top info bar */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-slate-400 flex items-center">
          <Clock className="h-4 w-4 mr-1 text-emerald-400" />
          {startTime && !endTime && settings.duration > 0 ? (
            <span>
              Time remaining: <span className="text-white font-medium">{Math.ceil(timeRemaining)}s</span>
            </span>
          ) : (
            <span>
              Duration:{" "}
              <span className="text-white font-medium">
                {settings.duration > 0 ? `${settings.duration}s` : "Unlimited"}
              </span>
            </span>
          )}
        </div>
        <div className="text-sm text-slate-400">
          Progress: <span className="text-white font-medium">{Math.round(progressPercentage)}%</span>
        </div>
      </div>

      <Progress
        value={progressPercentage}
        className="mb-4 h-2 bg-slate-700"
        indicatorClassName="bg-gradient-to-r from-emerald-500 to-teal-500"
      />

      {/* Metrics at the top during typing */}
      {isTyping && !endTime && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-4"
        >
          <TypingMetrics compact={true} horizontal={true} />
        </motion.div>
      )}

      {/* Text area */}
      <Card className="mb-4 border-slate-700/50 shadow-lg overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-800/80 pointer-events-none"></div>
        <CardContent
          className="p-6 h-48 overflow-y-auto cursor-text relative"
          ref={textDisplayRef}
          onClick={handleTextDisplayClick}
        >
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-full bg-slate-700/50" />
              <Skeleton className="h-5 w-3/4 bg-slate-700/50" />
              <Skeleton className="h-5 w-5/6 bg-slate-700/50" />
              <Skeleton className="h-5 w-2/3 bg-slate-700/50" />
            </div>
          ) : (
            <div className="font-mono text-lg leading-relaxed whitespace-pre-wrap">
              {text.split("").map((char, index) => {
                let className = "text-slate-400"

                if (index < typedText.length) {
                  className = typedText[index] === char ? "text-emerald-400 neon-glow" : "text-red-400 bg-red-900/30"
                }

                return (
                  <React.Fragment key={index}>
                    {index === typedText.length && (
                      <span className="border-r-2 border-emerald-400 animate-blink h-5 inline-block mr-0.5"></span>
                    )}
                    <span className={className}>{char}</span>
                  </React.Fragment>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Keyboard below text */}
      {settings.showKeyboard && (
        <Card className="border-slate-700/50 shadow-lg overflow-hidden relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none"></div>
          <CardContent className="p-4">
            <VirtualKeyboard />
          </CardContent>
        </Card>
      )}

      {/* Hidden input for typing */}
      <input
        ref={inputRef}
        type="text"
        value={typedText}
        onChange={handleInputChange}
        disabled={isLoading || endTime !== null}
        className="opacity-0 absolute -z-10"
        aria-label="Typing input"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {/* Results after typing completion */}
      <AnimatePresence>
        {endTime && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="text-center p-6 rounded-lg relative overflow-hidden mt-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-3">
                <Award className="h-12 w-12 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Typing Complete!</h3>
              <div className="flex justify-center">
                <TypingMetrics centered={true} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
