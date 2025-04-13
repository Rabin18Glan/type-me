"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTyping } from "@/features/typing/context/typing-context"
import { Bug, X, RefreshCw } from "lucide-react"

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    text,
    typedText,
    isLoading,
    isTyping,
    startTime,
    endTime,
    metrics,
    selectedLanguage,
    selectedPrompt,
    settings,
    isOnline,
  } = useTyping()

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 opacity-50 hover:opacity-100 bg-slate-800/80 border-slate-700/50"
        onClick={() => setIsOpen(true)}
      >
        <Bug className="h-4 w-4 mr-2" />
        Debug
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 max-h-[80vh] overflow-auto z-50 opacity-90 hover:opacity-100 border-slate-700/50 shadow-lg">
      <CardHeader className="py-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center">
          <Bug className="h-4 w-4 mr-2 text-amber-400" />
          Debug Panel
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="py-2 text-xs">
        <div className="space-y-2">
          <div className="flex justify-between p-2 rounded bg-slate-800/50">
            <strong>Online:</strong>{" "}
            <span className={isOnline ? "text-emerald-400" : "text-red-400"}>{isOnline ? "Yes" : "No"}</span>
          </div>
          <div className="flex justify-between p-2 rounded bg-slate-800/50">
            <strong>Loading:</strong>{" "}
            <span className={isLoading ? "text-amber-400" : "text-slate-400"}>{isLoading ? "Yes" : "No"}</span>
          </div>
          <div className="flex justify-between p-2 rounded bg-slate-800/50">
            <strong>Typing:</strong>{" "}
            <span className={isTyping ? "text-emerald-400" : "text-slate-400"}>{isTyping ? "Yes" : "No"}</span>
          </div>
          <div className="flex justify-between p-2 rounded bg-slate-800/50">
            <strong>Language:</strong>{" "}
            <span>
              {selectedLanguage.name} ({selectedLanguage.code})
            </span>
          </div>
          <div className="flex justify-between p-2 rounded bg-slate-800/50">
            <strong>Prompt:</strong> <span>{selectedPrompt.name}</span>
          </div>
          <div className="flex justify-between p-2 rounded bg-slate-800/50">
            <strong>Start Time:</strong>{" "}
            <span>{startTime ? new Date(startTime).toISOString().substring(11, 19) : "None"}</span>
          </div>
          <div className="flex justify-between p-2 rounded bg-slate-800/50">
            <strong>End Time:</strong>{" "}
            <span>{endTime ? new Date(endTime).toISOString().substring(11, 19) : "None"}</span>
          </div>
          <div className="flex justify-between p-2 rounded bg-slate-800/50">
            <strong>WPM:</strong> <span className="text-emerald-400">{metrics.wpm.toFixed(2)}</span>
          </div>
          <div className="flex justify-between p-2 rounded bg-slate-800/50">
            <strong>Text Length:</strong> <span>{text.length}</span>
          </div>
          <div className="flex justify-between p-2 rounded bg-slate-800/50">
            <strong>Typed Length:</strong> <span>{typedText.length}</span>
          </div>
          <div className="p-2 rounded bg-slate-800/50">
            <strong>Settings:</strong> <pre className="mt-1 text-slate-400">{JSON.stringify(settings, null, 2)}</pre>
          </div>
          <div className="pt-2">
            <Button
              size="sm"
              variant="destructive"
              className="w-full"
              onClick={() => {
                localStorage.clear()
                window.location.reload()
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear Storage & Reload
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
