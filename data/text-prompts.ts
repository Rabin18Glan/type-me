import type { TextPrompt } from "@/types/typing"

export const defaultPrompts: TextPrompt[] = [
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
