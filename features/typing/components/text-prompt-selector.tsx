"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import type { TextPrompt } from "@/types/typing"
import { cn } from "@/lib/utils"
import {
  Check,
  AlertCircle,
  FileText,
  Code,
  Quote,
  BookOpen,
  Newspaper,
  Lightbulb,
  FileCode,
  PenTool,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { defaultPrompts } from "@/data/text-prompts"
import { motion } from "framer-motion"

interface TextPromptSelectorProps {
  selectedPrompt: TextPrompt
  onSelectPrompt: (prompt: TextPrompt) => void
  isOnline: boolean
}

// Map of icons for each prompt type
const promptIcons: Record<string, React.ReactNode> = {
  paragraph: <FileText className="h-5 w-5 text-emerald-400" />,
  code: <Code className="h-5 w-5 text-blue-400" />,
  quotes: <Quote className="h-5 w-5 text-purple-400" />,
  facts: <Lightbulb className="h-5 w-5 text-amber-400" />,
  news: <Newspaper className="h-5 w-5 text-red-400" />,
  story: <BookOpen className="h-5 w-5 text-teal-400" />,
  technical: <FileCode className="h-5 w-5 text-indigo-400" />,
  custom: <PenTool className="h-5 w-5 text-pink-400" />,
}

export default function TextPromptSelector({ selectedPrompt, onSelectPrompt, isOnline }: TextPromptSelectorProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <div>
      {!isOnline && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Alert variant="warning" className="mb-6 border-amber-500/20 bg-amber-500/10">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-200">
              You're offline. Custom text generation is unavailable. Using cached texts.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {defaultPrompts.map((prompt) => (
          <motion.div key={prompt.id} variants={item}>
            <Card
              className={cn(
                "cursor-pointer hover:bg-slate-800 transition-all overflow-hidden relative group",
                selectedPrompt.id === prompt.id && "border-emerald-500 bg-emerald-900/10",
                !isOnline && prompt.id === "custom" && "opacity-50 cursor-not-allowed",
              )}
              onClick={() => {
                if (!isOnline && prompt.id === "custom") return
                onSelectPrompt(prompt)
              }}
            >
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform ${selectedPrompt.id === prompt.id ? "scale-x-100" : ""}`}
              ></div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-slate-800/80 group-hover:scale-110 transition-transform">
                      {promptIcons[prompt.id] || <FileText className="h-5 w-5 text-slate-400" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-white group-hover:text-emerald-400 transition-colors">
                        {prompt.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{prompt.description}</p>
                    </div>
                  </div>
                  {selectedPrompt.id === prompt.id && (
                    <div className="bg-emerald-500/20 p-1 rounded-full">
                      <Check className="h-4 w-4 text-emerald-400" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
