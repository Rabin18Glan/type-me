"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { useToast } from "@/hooks/use-toast"
import { generateText, getOfflineText, getDefaultText } from "@/lib/api/text-generator"
import type { Language, TextPrompt, TypingSettings, TypingMetrics } from "@/types/typing"
import { languages } from "@/data/languages"
import { defaultPrompts } from "@/data/text-prompts"

interface TypingContextType {
  // Text state
  text: string
  typedText: string
  setTypedText: (text: string) => void
  isLoading: boolean
  loadNewText: () => Promise<void>

  // Session state
  isTyping: boolean
  setIsTyping: (isTyping: boolean) => void
  startTime: number | null
  setStartTime: (time: number | null) => void
  endTime: number | null
  setEndTime: (time: number | null) => void
  resetTypingSession: () => void

  // Metrics
  metrics: TypingMetrics
  setMetrics: (metrics: TypingMetrics) => void

  // Settings
  selectedLanguage: Language
  setSelectedLanguage: (language: Language) => void
  selectedPrompt: TextPrompt
  setSelectedPrompt: (prompt: TextPrompt) => void
  settings: TypingSettings
  setSettings: (settings: TypingSettings) => void

  // Status
  isOnline: boolean
}

const TypingContext = createContext<TypingContextType | undefined>(undefined)

export function TypingProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const isOnline = useOnlineStatus()

  // Text state
  const [text, setText] = useState("")
  const [typedText, setTypedText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Session state
  const [isTyping, setIsTyping] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)

  // Metrics
  const [metrics, setMetrics] = useState<TypingMetrics>({
    wpm: 0,
    cpm: 0,
    accuracy: 100,
    errors: 0,
    elapsedTime: 0,
  })

  // Settings state with localStorage persistence
  const [selectedLanguage, setSelectedLanguage] = useLocalStorage<Language>("typeme-language", languages[0])
  const [selectedPrompt, setSelectedPrompt] = useLocalStorage<TextPrompt>("typeme-prompt", defaultPrompts[0])
  const [settings, setSettings] = useLocalStorage<TypingSettings>("typeme-settings", {
    duration: 60,
    showKeyboard: true,
    soundEnabled: true,
    theme: "dark",
    difficulty: "medium",
  })

  // Load text on initial render or when prompt/language changes
  useEffect(() => {
    loadNewText()
  }, [selectedLanguage, selectedPrompt])

  // Function to load new text from API or offline storage
  const loadNewText = useCallback(async () => {
    setIsLoading(true)
    try {
      let newText = ""
      let source = "default"

      if (isOnline) {
        try {
          newText = await generateText(selectedPrompt.prompt, selectedLanguage.code, settings.difficulty)
          source = "api"
        } catch (error) {
          console.error("Error generating text from API:", error)
          // Try to get text from offline storage first
          try {
            newText = await getOfflineText(selectedLanguage.code)
            source = "cache"
          } catch (offlineError) {
            // If that fails too, use default text
            newText = getDefaultText(selectedLanguage.code)
            source = "default"
          }

          toast({
            title: "Couldn't connect to Gemini API",
            description: "Using cached text for practice.",
            variant: "destructive",
          })
        }
      } else {
        newText = await getOfflineText(selectedLanguage.code)
        source = "cache"

        toast({
          title: "You're offline",
          description: "Using cached text for practice. Connect to get new content.",
          variant: "default",
        })
      }

      setText(newText || getDefaultText(selectedLanguage.code))

      if (source === "default") {
        toast({
          title: "Using default text",
          description: "No custom text available for this language.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error loading text:", error)
      setText(getDefaultText(selectedLanguage.code))

      toast({
        title: "Couldn't load text",
        description: "Using default text for practice.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      resetTypingSession()
    }
  }, [isOnline, selectedPrompt, selectedLanguage, settings.difficulty, toast])

  // Reset typing session
  const resetTypingSession = useCallback(() => {
    setTypedText("")
    setStartTime(null)
    setEndTime(null)
    setIsTyping(false)
    setMetrics({
      wpm: 0,
      cpm: 0,
      accuracy: 100,
      errors: 0,
      elapsedTime: 0,
    })
  }, [])

  const value = {
    // Text state
    text,
    typedText,
    setTypedText,
    isLoading,
    loadNewText,

    // Session state
    isTyping,
    setIsTyping,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    resetTypingSession,

    // Metrics
    metrics,
    setMetrics,

    // Settings
    selectedLanguage,
    setSelectedLanguage,
    selectedPrompt,
    setSelectedPrompt,
    settings,
    setSettings,

    // Status
    isOnline,
  }

  return <TypingContext.Provider value={value}>{children}</TypingContext.Provider>
}

export function useTyping() {
  const context = useContext(TypingContext)
  if (context === undefined) {
    throw new Error("useTyping must be used within a TypingProvider")
  }
  return context
}
