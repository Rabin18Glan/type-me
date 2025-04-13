"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { TypingSettings } from "@/types/typing"

interface SettingsPanelProps {
  settings: TypingSettings
  onUpdateSettings: (settings: TypingSettings) => void
}

export default function SettingsPanel({ settings, onUpdateSettings }: SettingsPanelProps) {
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
    onUpdateSettings({
      ...settings,
      theme: value as "light" | "dark" | "system",
    })
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="duration">
            Typing Duration: {settings.duration === 0 ? "Unlimited" : `${settings.duration} seconds`}
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
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="showKeyboard">Show Virtual Keyboard</Label>
            <Switch
              id="showKeyboard"
              checked={settings.showKeyboard}
              onCheckedChange={handleSwitchChange("showKeyboard")}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="soundEnabled">Sound Effects</Label>
            <Switch
              id="soundEnabled"
              checked={settings.soundEnabled}
              onCheckedChange={handleSwitchChange("soundEnabled")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Difficulty Level</Label>
          <RadioGroup value={settings.difficulty} onValueChange={handleDifficultyChange} className="flex space-x-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="easy" id="easy" />
              <Label htmlFor="easy">Easy</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hard" id="hard" />
              <Label htmlFor="hard">Hard</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Theme</Label>
          <RadioGroup value={settings.theme} onValueChange={handleThemeChange} className="flex space-x-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}
