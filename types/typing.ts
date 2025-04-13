export interface Language {
  code: string
  name: string
  flag?: string
}

export interface TextPrompt {
  id: string
  name: string
  prompt: string
  description?: string
  isCustom?: boolean
}

export interface TypingSettings {
  duration: number
  showKeyboard: boolean
  soundEnabled: boolean
  theme: "light" | "dark" | "system"
  difficulty: "easy" | "medium" | "hard"
}

export interface TypingMetrics {
  wpm: number
  cpm: number
  accuracy: number
  errors: number
  elapsedTime: number
}

// Add global type for workbox
declare global {
  interface Window {
    workbox: any
  }
}
