"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { TypingSettings } from "@/types/typing"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface SettingsPanelProps {
  settings: TypingSettings
  onUpdateSettings: (settings: TypingSettings) => void
}

export default function SettingsPanel({ settings, onUpdateSettings }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync theme with settings
  useEffect(() => {
    if (mounted && theme) {
      onUpdateSettings({
        ...settings,
        theme: theme as "light" | "dark" | "system",
      })
    }
  }, [theme, mounted])

  const handleDurationChange = (value: number[]) => {
    onUpdateSettings({
      ...settings,
      duration: value[0],
    })
  }

  const handleSwitchChange = (key: keyof TypingSettings) => (checked: boolean) => {
    onUpdateSettings({
      ...settings,
      [key]: checked,
    })
  }

  const handleDifficultyChange = (value: string) => {
    onUpdateSettings({
      ...settings,
      difficulty: value as "easy" | "medium" | "hard",
    })
  }

  const handleThemeChange = (value: string) => {
    setTheme(value)
    onUpdateSettings({
      ...settings,
      theme: value as "light" | "dark" | "system",
    })
  }

  if (!mounted) {
    return null
  }

  return (
    <Card className="border-slate-700/50 shadow-lg overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-yellow-500/5 pointer-events-none"></div>
      <CardContent className="p-6 space-y-8 relative">
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Label htmlFor="duration" className="text-base font-medium flex items-center">
            <span className="w-8 h-8 inline-flex items-center justify-center bg-amber-500/10 text-amber-400 rounded-full mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
            Typing Duration:{" "}
            <span className="ml-2 text-white">
              {settings.duration === 0 ? "Unlimited" : `${settings.duration} seconds`}
            </span>
          </Label>
          <Slider
            id="duration"
            min={0}
            max={300}
            step={15}
            value={[settings.duration]}
            onValueChange={handleDurationChange}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Unlimited</span>
            <span>5 min</span>
          </div>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Label className="text-base font-medium flex items-center mb-4">
            <span className="w-8 h-8 inline-flex items-center justify-center bg-emerald-500/10 text-emerald-400 rounded-full mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            Display Options
          </Label>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
            <Label htmlFor="showKeyboard" className="cursor-pointer">
              Show Virtual Keyboard
            </Label>
            <Switch
              id="showKeyboard"
              checked={settings.showKeyboard}
              onCheckedChange={handleSwitchChange("showKeyboard")}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
            <Label htmlFor="soundEnabled" className="cursor-pointer">
              Sound Effects
            </Label>
            <Switch
              id="soundEnabled"
              checked={settings.soundEnabled}
              onCheckedChange={handleSwitchChange("soundEnabled")}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </motion.div>

        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Label className="text-base font-medium flex items-center">
            <span className="w-8 h-8 inline-flex items-center justify-center bg-blue-500/10 text-blue-400 rounded-full mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
              </svg>
            </span>
            Difficulty Level
          </Label>
          <RadioGroup
            value={settings.difficulty}
            onValueChange={handleDifficultyChange}
            className="flex space-x-2 mt-3"
          >
            <div className="flex-1">
              <RadioGroupItem value="easy" id="easy" className="peer sr-only" />
              <Label
                htmlFor="easy"
                className="flex flex-col items-center justify-between rounded-md border-2 border-slate-700 bg-slate-800/50 p-4 hover:bg-slate-800 hover:border-slate-600 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-900/10 transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-400 mb-2"
                >
                  <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                  <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                </svg>
                Easy
              </Label>
            </div>
            <div className="flex-1">
              <RadioGroupItem value="medium" id="medium" className="peer sr-only" />
              <Label
                htmlFor="medium"
                className="flex flex-col items-center justify-between rounded-md border-2 border-slate-700 bg-slate-800/50 p-4 hover:bg-slate-800 hover:border-slate-600 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-900/10 transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-amber-400 mb-2"
                >
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                  <line x1="16" x2="2" y1="8" y2="22" />
                  <line x1="17.5" x2="9" y1="15" y2="15" />
                </svg>
                Medium
              </Label>
            </div>
            <div className="flex-1">
              <RadioGroupItem value="hard" id="hard" className="peer sr-only" />
              <Label
                htmlFor="hard"
                className="flex flex-col items-center justify-between rounded-md border-2 border-slate-700 bg-slate-800/50 p-4 hover:bg-slate-800 hover:border-slate-600 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-900/10 transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-400 mb-2"
                >
                  <path d="M12 2v8" />
                  <path d="m4.93 10.93 1.41 1.41" />
                  <path d="M2 18h2" />
                  <path d="M20 18h2" />
                  <path d="m19.07 10.93-1.41 1.41" />
                  <path d="M22 22H2" />
                  <path d="m8 22 4-10 4 10" />
                  <path d="M12 22v-3" />
                </svg>
                Hard
              </Label>
            </div>
          </RadioGroup>
        </motion.div>

        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Label className="text-base font-medium flex items-center">
            <span className="w-8 h-8 inline-flex items-center justify-center bg-purple-500/10 text-purple-400 rounded-full mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            </span>
            Theme
          </Label>
          <RadioGroup value={settings.theme} onValueChange={handleThemeChange} className="flex space-x-2 mt-3">
            <div className="flex-1">
              <RadioGroupItem value="light" id="light" className="peer sr-only" />
              <Label
                htmlFor="light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-slate-700 bg-slate-800/50 p-4 hover:bg-slate-800 hover:border-slate-600 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-900/10 transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-amber-400 mb-2"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
                Light
              </Label>
            </div>
            <div className="flex-1">
              <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
              <Label
                htmlFor="dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-slate-700 bg-slate-800/50 p-4 hover:bg-slate-800 hover:border-slate-600 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-900/10 transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-400 mb-2"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
                Dark
              </Label>
            </div>
            <div className="flex-1">
              <RadioGroupItem value="system" id="system" className="peer sr-only" />
              <Label
                htmlFor="system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-slate-700 bg-slate-800/50 p-4 hover:bg-slate-800 hover:border-slate-600 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-900/10 transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-400 mb-2"
                >
                  <rect width="20" height="14" x="2" y="3" rx="2" />
                  <line x1="8" x2="16" y1="21" y2="21" />
                  <line x1="12" x2="12" y1="17" y2="21" />
                </svg>
                System
              </Label>
            </div>
          </RadioGroup>
        </motion.div>
      </CardContent>
    </Card>
  )
}
