"use client"

import { useTyping } from "@/features/typing/context/typing-context"
import TypingInterface from "@/features/typing/components/typing-interface"
import LanguageSelector from "@/features/typing/components/language-selector"
import SettingsPanel from "@/features/typing/components/settings-panel"
import TextPromptSelector from "@/features/typing/components/text-prompt-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Languages, Type, RefreshCw, RotateCcw } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { DebugPanel } from "@/components/debug-panel"
import { motion } from "framer-motion"
import { useState } from "react"

export default function TypingApp() {
  const {
    loadNewText,
    resetTypingSession,
    isLoading,
    isTyping,
    typedText,
    selectedLanguage,
    setSelectedLanguage,
    selectedPrompt,
    setSelectedPrompt,
    settings,
    setSettings,
    isOnline,
  } = useTyping()

  const isMobile = useMobile()
  const [showOptions, setShowOptions] = useState(false)

  return (
    <div className="container mx-auto px-4 py-4 max-w-5xl">
      <motion.header
        className="mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold gradient-primary">TypeMe</h1>
          <div className="flex gap-2">
            <LanguageSelector selectedLanguage={selectedLanguage} onSelectLanguage={setSelectedLanguage} />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowOptions(!showOptions)}
              className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showOptions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Tabs defaultValue="prompt" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4 bg-slate-800/50 p-1 w-full max-w-md mx-auto">
                <TabsTrigger
                  value="prompt"
                  className="flex items-center gap-2 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
                >
                  <Type className="h-4 w-4" />
                  <span className={isMobile ? "hidden" : ""}>Text</span>
                </TabsTrigger>
                <TabsTrigger
                  value="language"
                  className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
                >
                  <Languages className="h-4 w-4" />
                  <span className={isMobile ? "hidden" : ""}>Language</span>
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="flex items-center gap-2 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400"
                >
                  <Settings className="h-4 w-4" />
                  <span className={isMobile ? "hidden" : ""}>Settings</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="prompt">
                <TextPromptSelector
                  selectedPrompt={selectedPrompt}
                  onSelectPrompt={setSelectedPrompt}
                  isOnline={isOnline}
                />
              </TabsContent>

              <TabsContent value="language">
                <Card className="border-slate-700/50 shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none"></div>
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
          </motion.div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <Button
            variant="outline"
            onClick={loadNewText}
            disabled={isLoading || isTyping}
            className="group relative overflow-hidden bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50"
            size="sm"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            New Text
          </Button>

          <Button
            variant="outline"
            onClick={resetTypingSession}
            disabled={isLoading || !typedText}
            className="group relative overflow-hidden bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50"
            size="sm"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>

          {/* Duration options like monkeytype */}
          <div className="flex gap-1 ml-2">
            {[15, 30, 60, 120].map((duration) => (
              <Button
                key={duration}
                variant={settings.duration === duration ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSettings({ ...settings, duration })}
                className={
                  settings.duration === duration
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : "bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50"
                }
              >
                {duration}
              </Button>
            ))}
          </div>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="mb-6 overflow-hidden border-slate-700/50 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
          <CardContent className="p-6">
            <TypingInterface />
          </CardContent>
        </Card>
      </motion.div>

      {/* Debug panel
      <DebugPanel /> */}
    </div>
  )
}
