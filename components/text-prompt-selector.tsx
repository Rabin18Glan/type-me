"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { TextPrompt } from "@/types/typing"
import { cn } from "@/lib/utils"
import { Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TextPromptSelectorProps {
  selectedPrompt: TextPrompt
  onSelectPrompt: (prompt: TextPrompt) => void
  isOnline: boolean
}

const textPrompts: TextPrompt[] = [
  {
    id: "paragraph",
    name: "Paragraph",
    prompt: "Generate a paragraph for typing practice",
    description: "General text for practice",
  },
  {
    id: "code",
    name: "Code",
    prompt: "Generate a code snippet for typing practice",
    description: "Programming syntax practice",
  },
  {
    id: "quotes",
    name: "Quotes",
    prompt: "Generate famous quotes for typing practice",
    description: "Inspirational quotes",
  },
  {
    id: "facts",
    name: "Facts",
    prompt: "Generate interesting facts for typing practice",
    description: "Learn while typing",
  },
  {
    id: "news",
    name: "News",
    prompt: "Generate a news article excerpt for typing practice",
    description: "Current events style",
  },
  {
    id: "story",
    name: "Story",
    prompt: "Generate a short story excerpt for typing practice",
    description: "Narrative text",
  },
  {
    id: "technical",
    name: "Technical",
    prompt: "Generate technical documentation for typing practice",
    description: "Technical terminology",
  },
  {
    id: "custom",
    name: "Custom",
    prompt: "",
    description: "Your own text",
    isCustom: true,
  },
]

export default function TextPromptSelector({ selectedPrompt, onSelectPrompt, isOnline }: TextPromptSelectorProps) {
  return (
    <div>
      {!isOnline && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You're offline. Custom text generation is unavailable. Using cached texts.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {textPrompts.map((prompt) => (
          <Card
            key={prompt.id}
            className={cn(
              "cursor-pointer hover:bg-slate-800 transition-colors",
              selectedPrompt.id === prompt.id && "border-emerald-500 bg-emerald-900/10",
              !isOnline && prompt.id === "custom" && "opacity-50 cursor-not-allowed",
            )}
            onClick={() => {
              if (!isOnline && prompt.id === "custom") return
              onSelectPrompt(prompt)
            }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{prompt.name}</h3>
                  <p className="text-xs text-slate-400">{prompt.description}</p>
                </div>
                {selectedPrompt.id === prompt.id && <Check className="h-4 w-4 text-emerald-400" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
