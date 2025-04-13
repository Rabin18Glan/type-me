"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { calculateMetrics } from "@/lib/metrics"
import type { TypingSettings } from "@/types/typing"

interface TypingInterfaceProps {
  text: string
  typedText: string
  setTypedText: (text: string) => void
  isLoading: boolean
  isTyping: boolean
  setIsTyping: (isTyping: boolean) => void
  startTime: number | null
  setStartTime: (time: number | null) => void
  endTime: number | null
  setEndTime: (time: number | null) => void
  metrics: {
    wpm: number
    cpm: number
    accuracy: number
    errors: number
    elapsedTime: number
  }
  setMetrics: (metrics: any) => void
  settings: TypingSettings
}

export default function TypingInterface({
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
}: TypingInterfaceProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const textDisplayRef = useRef<HTMLDivElement>(null)

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [text])

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
  }, [typedText, startTime, endTime, text, settings.duration])

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
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-slate-400">
          {startTime && !endTime && settings.duration > 0 ? (
            <span>Time remaining: {Math.ceil(timeRemaining)}s</span>
          ) : (
            <span>Duration: {settings.duration > 0 ? `${settings.duration}s` : "Unlimited"}</span>
          )}
        </div>
        <div className="text-sm text-slate-400">Progress: {Math.round(progressPercentage)}%</div>
      </div>

      <Progress value={progressPercentage} className="mb-4" />

      <Card className="mb-4 bg-slate-800/50 border-slate-700">
        <CardContent className="p-4 h-40 overflow-y-auto" ref={textDisplayRef}>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <div className="font-mono text-lg leading-relaxed whitespace-pre-wrap">
              {text.split("").map((char, index) => {
                let className = "text-slate-400"

                if (index < typedText.length) {
                  className = typedText[index] === char ? "text-emerald-400" : "text-red-400 bg-red-900/30"
                }

                if (index === typedText.length) {
                  className += " border-r-2 border-emerald-400 animate-pulse"
                }

                return (
                  <span key={index} className={className}>
                    {char}
                  </span>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <input
        ref={inputRef}
        type="text"
        value={typedText}
        onChange={handleInputChange}
        disabled={isLoading || endTime !== null}
        className="opacity-0 absolute -z-10"
        aria-label="Typing input"
      />

      {endTime && (
        <div className="text-center p-4 bg-emerald-900/20 border border-emerald-800 rounded-lg">
          <h3 className="text-xl font-bold text-emerald-400 mb-2">Typing Complete!</h3>
          <p className="text-slate-300">
            You typed at {Math.round(metrics.wpm)} WPM with {Math.round(metrics.accuracy)}% accuracy.
          </p>
        </div>
      )}
    </div>
  )
}
