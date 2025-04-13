"use client"

import { useState, useCallback, useEffect } from "react"
import { Check, ChevronDown, Globe, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Language } from "@/types/typing"
import { languages } from "@/data/languages"
import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LanguageSelectorProps {
  selectedLanguage: Language
  onSelectLanguage: (language: Language) => void
  displayType?: "dropdown" | "grid"
}

export default function LanguageSelector({
  selectedLanguage,
  onSelectLanguage,
  displayType = "dropdown",
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredLanguages = languages.filter(
    (language) =>
      language.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      language.code.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleLanguageSelect = useCallback(
    (language: Language) => {
      onSelectLanguage(language)
      setOpen(false)
      // Reset search query after selection
      setSearchQuery("")
    },
    [onSelectLanguage],
  )

  if (!mounted) {
    return null
  }

  if (displayType === "grid") {
    return (
      <div>
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 bg-slate-800/50 border-slate-700/50 focus:border-emerald-500/50 transition-colors"
          />
        </div>

        <ScrollArea className="h-[60vh]">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {filteredLanguages.map((language, index) => (
              <motion.div
                key={language.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.02, 0.5) }}
              >
                <Card
                  className={cn(
                    "cursor-pointer hover:bg-slate-800 transition-colors overflow-hidden relative group",
                    selectedLanguage.code === language.code && "border-emerald-500 bg-emerald-900/10",
                  )}
                  onClick={() => handleLanguageSelect(language)}
                >
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform ${
                      selectedLanguage.code === language.code ? "scale-x-100" : ""
                    }`}
                  ></div>
                  <CardContent className="p-3 flex items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-700/80 flex-shrink-0 group-hover:bg-slate-700 transition-colors">
                      {language.flag || <Globe className="h-5 w-5" />}
                    </div>
                    <div className="truncate">
                      <p className="font-medium truncate">{language.name}</p>
                      <p className="text-xs text-slate-400">{language.code}</p>
                    </div>
                    {selectedLanguage.code === language.code && <Check className="h-4 w-4 text-emerald-400 ml-auto" />}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </ScrollArea>
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex items-center gap-2 w-[200px] justify-between bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 transition-colors"
        >
          <div className="flex items-center gap-2 truncate">
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-700">
              {selectedLanguage.flag || <Globe className="h-4 w-4" />}
            </div>
            <span className="truncate">{selectedLanguage.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 border-slate-700/50 bg-slate-800 shadow-xl">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search language..." className="border-b border-slate-700" />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup className="overflow-y-auto">
              <ScrollArea className="h-[300px]">
                {filteredLanguages.map((language) => (
                  <CommandItem
                    key={language.code}
                    value={language.code}
                    onSelect={() => {
                      const selected = languages.find((l) => l.code === language.code)
                      if (selected) {
                        handleLanguageSelect(selected)
                      }
                    }}
                    className="flex items-center gap-2 hover:bg-slate-700"
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      {language.flag || <Globe className="h-4 w-4" />}
                    </div>
                    <span>{language.name}</span>
                    {selectedLanguage.code === language.code && <Check className="h-4 w-4 ml-auto text-emerald-400" />}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
