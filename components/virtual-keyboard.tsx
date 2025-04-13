"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { Language } from "@/types/typing"
import { getKeyboardLayout } from "@/data/keyboard-layouts"

interface VirtualKeyboardProps {
  language: Language
  typedText: string
  text: string
}

export default function VirtualKeyboard({ language, typedText, text }: VirtualKeyboardProps) {
  const [layout, setLayout] = useState<string[][]>([])
  const [pressedKey, setPressedKey] = useState<string | null>(null)
  const [nextKey, setNextKey] = useState<string | null>(null)

  // Load keyboard layout based on language
  useEffect(() => {
    const keyboardLayout = getKeyboardLayout(language.code)
    setLayout(keyboardLayout)
  }, [language])

  // Determine the next key to press
  useEffect(() => {
    if (text && typedText !== text) {
      const nextCharIndex = typedText.length
      if (nextCharIndex < text.length) {
        setNextKey(text[nextCharIndex])
      } else {
        setNextKey(null)
      }
    } else {
      setNextKey(null)
    }
  }, [text, typedText])

  // Handle physical keyboard events to highlight pressed keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKey(e.key)
    }

    const handleKeyUp = () => {
      setPressedKey(null)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  if (!layout.length) {
    return <div className="text-center py-4">Loading keyboard layout...</div>
  }

  return (
    <div className="select-none">
      <div className="text-center mb-2 text-sm text-slate-400">Virtual Keyboard ({language.name})</div>

      <div className="flex flex-col items-center gap-1">
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 w-full justify-center">
            {row.map((key, keyIndex) => {
              const isSpecialKey = key.length > 1
              const isPressed = !isSpecialKey && pressedKey === key
              const isNextKey = !isSpecialKey && nextKey === key

              let width = "w-8"
              let content = key

              if (key === "Space") {
                width = "w-32"
                content = ""
              } else if (key === "Shift" || key === "Enter") {
                width = "w-16"
              } else if (key === "Backspace") {
                width = "w-12"
                content = "⌫"
              } else if (key === "Tab") {
                width = "w-12"
                content = "⇥"
              } else if (key === "CapsLock") {
                width = "w-14"
                content = "⇪"
              }

              return (
                <div
                  key={`${rowIndex}-${keyIndex}`}
                  className={cn(
                    "h-8 sm:h-10 flex items-center justify-center rounded border border-slate-700 text-sm sm:text-base transition-colors",
                    width,
                    isPressed && "bg-emerald-600 border-emerald-500 text-white",
                    isNextKey && "bg-emerald-900/50 border-emerald-700 text-emerald-400",
                    !isPressed && !isNextKey && "bg-slate-800",
                  )}
                >
                  {content}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
