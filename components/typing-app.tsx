"use client"

import { useState, useEffect } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import PWARegister from "@/app/pwa-register"
import TypingInterface from "@/components/typing-interface"
import TypingMetrics from "@/components/typing-metrics"
import LanguageSelector from "@/components/language-selector"
import SettingsPanel from "@/components/settings-panel"
import TextPromptSelector from "@/components/text-prompt-selector"
import VirtualKeyboard from "@/components/virtual-keyboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Keyboard, Languages, Type } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { generateText, getOfflineText } from "@/lib/text-generator"
import type { Language, TextPrompt, TypingSettings } from "@/types/typing"
import { languages } from "@/data/languages"

export default function TypingApp() {
  const { toast } = useToast()
  const isMobile = useMobile()
  const isOnline = useOnlineStatus()

  // State for typing session
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [metrics, setMetrics] = useState({
    wpm: 0,
    cpm: 0,
    accuracy: 100,
    errors: 0,
    elapsedTime: 0,
  })

  // Settings state
  const [selectedLanguage, setSelectedLanguage] = useLocalStorage<Language>("typeme-language", languages[0])
  const [selectedPrompt, setSelectedPrompt] = useLocalStorage<TextPrompt>("typeme-prompt", {
    id: "paragraph",
    name: "Paragraph",
    prompt: "Generate a paragraph for typing practice",
  })
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
  const loadNewText = async () => {
    setIsLoading(true)
    try {
      let newText = ""

      if (isOnline) {
        newText = await generateText(selectedPrompt.prompt, selectedLanguage.code, settings.difficulty)
      } else {
        newText = await getOfflineText(selectedLanguage.code)
        toast({
          title: "You're offline",
          description: "Using cached text for practice. Connect to get new content.",
          variant: "default",
        })
      }

      setText(newText || "The quick brown fox jumps over the lazy dog.")
    } catch (error) {
      console.error("Error loading text:", error)
      setText("The quick brown fox jumps over the lazy dog.")
      toast({
        title: "Couldn't load text",
        description: "Using default text for practice.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      resetTypingSession()
    }
  }

  // Reset typing session
  const resetTypingSession = () => {
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
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PWARegister />

      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
          TypeMe
        </h1>
        <p className="text-slate-400">Improve your typing speed and accuracy in {selectedLanguage.name}</p>
      </header>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <LanguageSelector selectedLanguage={selectedLanguage} onSelectLanguage={setSelectedLanguage} />

            <div className="flex gap-2">
              <Button variant="outline" onClick={loadNewText} disabled={isLoading || isTyping}>
                New Text
              </Button>

              <Button variant="outline" onClick={resetTypingSession} disabled={isLoading || !typedText}>
                Reset
              </Button>
            </div>
          </div>

          <TypingInterface
            text={text}
            typedText={typedText}
            setTypedText={setTypedText}
            isLoading={isLoading}
            isTyping={isTyping}
            setIsTyping={setIsTyping}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            metrics={metrics}
            setMetrics={setMetrics}
            settings={settings}
          />
        </CardContent>
      </Card>

      <TypingMetrics metrics={metrics} settings={settings} />

      <Tabs defaultValue="prompt" className="mt-6">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="prompt" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span className={isMobile ? "hidden" : ""}>Text</span>
          </TabsTrigger>
          <TabsTrigger value="keyboard" className="flex items-center gap-2">
            <Keyboard className="h-4 w-4" />
            <span className={isMobile ? "hidden" : ""}>Keyboard</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            <span className={isMobile ? "hidden" : ""}>Language</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className={isMobile ? "hidden" : ""}>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prompt">
          <TextPromptSelector selectedPrompt={selectedPrompt} onSelectPrompt={setSelectedPrompt} isOnline={isOnline} />
        </TabsContent>

        <TabsContent value="keyboard">
          <Card>
            <CardContent className="p-4">
              <VirtualKeyboard language={selectedLanguage} typedText={typedText} text={text} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language">
          <Card>
            <CardContent className="p-4">
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onSelectLanguage={setSelectedLanguage}
                displayType="grid"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <SettingsPanel settings={settings} onUpdateSettings={setSettings} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
