"use client"

import { useState, useEffect } from "react"
import { useTyping } from "@/features/typing/context/typing-context"
import { cn } from "@/lib/utils"
import { getKeyboardLayout } from "@/data/keyboard-layouts"
import { motion } from "framer-motion"

export default function VirtualKeyboard() {
  const { selectedLanguage, typedText, text } = useTyping()
  const [layout, setLayout] = useState<string[][]>([])
  const [pressedKey, setPressedKey] = useState<string | null>(null)
  const [nextKey, setNextKey] = useState<string | null>(null)

  // Load keyboard layout based on language
  useEffect(() => {
    const keyboardLayout = getKeyboardLayout(selectedLanguage.code)
    setLayout(keyboardLayout)
  }, [selectedLanguage])

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
    return <div className="text-center py-2 text-sm text-slate-400">Loading keyboard layout...</div>
  }

  return (
    <div className="select-none">
      <motion.div
        className="flex flex-col items-center gap-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
                width = "w-14"
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
                <motion.div
                  key={`${rowIndex}-${keyIndex}`}
                  className={cn(
                    "h-8 sm:h-10 flex items-center justify-center rounded-md border text-xs sm:text-sm transition-all shadow-md",
                    width,
                    isPressed &&
                      "bg-gradient-to-b from-emerald-500 to-emerald-600 border-emerald-400 text-white scale-95 shadow-emerald-500/20 shadow-inner",
                    isNextKey &&
                      "bg-gradient-to-b from-emerald-900/70 to-emerald-800/70 border-emerald-700 text-emerald-400",
                    !isPressed &&
                      !isNextKey &&
                      "bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 hover:from-slate-700 hover:to-slate-800",
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {content}
                </motion.div>
              )
            })}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
