"use client"

import { useState } from "react"
import { Check, ChevronDown, Globe, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Language } from "@/types/typing"
import { languages } from "@/data/languages"

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

  const filteredLanguages = languages.filter(
    (language) =>
      language.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      language.code.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (displayType === "grid") {
    return (
      <div>
        <div className="mb-4">
          <Input
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
            prefix={<Search className="h-4 w-4 text-slate-400" />}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredLanguages.map((language) => (
            <Card
              key={language.code}
              className={cn(
                "cursor-pointer hover:bg-slate-800 transition-colors",
                selectedLanguage.code === language.code && "border-emerald-500 bg-emerald-900/10",
              )}
              onClick={() => onSelectLanguage(language)}
            >
              <CardContent className="p-3 flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 flex-shrink-0">
                  {language.flag || <Globe className="h-4 w-4" />}
                </div>
                <div className="truncate">
                  <p className="font-medium truncate">{language.name}</p>
                  <p className="text-xs text-slate-400">{language.code}</p>
                </div>
                {selectedLanguage.code === language.code && <Check className="h-4 w-4 text-emerald-400 ml-auto" />}
              </CardContent>
            </Card>
          ))}
        </div>
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
          className="flex items-center gap-2 w-[200px] justify-between"
        >
          <div className="flex items-center gap-2 truncate">
            <div className="w-5 h-5 flex items-center justify-center">
              {selectedLanguage.flag || <Globe className="h-4 w-4" />}
            </div>
            <span className="truncate">{selectedLanguage.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {languages.map((language) => (
                <CommandItem
                  key={language.code}
                  value={language.code}
                  onSelect={() => {
                    onSelectLanguage(language)
                    setOpen(false)
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {language.flag || <Globe className="h-4 w-4" />}
                  </div>
                  <span>{language.name}</span>
                  {selectedLanguage.code === language.code && <Check className="h-4 w-4 ml-auto" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
