import type { TypingMetrics } from "@/types/typing"

export function calculateMetrics(
  originalText: string,
  typedText: string,
  startTime: number,
  currentTime: number,
): TypingMetrics {
  // Calculate elapsed time in seconds
  const elapsedTime = (currentTime - startTime) / 1000

  // Calculate words per minute (WPM)
  // Standard: 5 characters = 1 word
  const wordCount = typedText.length / 5
  const wpm = wordCount / (elapsedTime / 60)

  // Calculate characters per minute (CPM)
  const cpm = typedText.length / (elapsedTime / 60)

  // Calculate accuracy
  let correctChars = 0
  let errors = 0

  for (let i = 0; i < typedText.length; i++) {
    if (i < originalText.length) {
      if (typedText[i] === originalText[i]) {
        correctChars++
      } else {
        errors++
      }
    } else {
      errors++
    }
  }

  const accuracy = typedText.length > 0 ? (correctChars / typedText.length) * 100 : 100

  return {
    wpm: isNaN(wpm) || !isFinite(wpm) ? 0 : wpm,
    cpm: isNaN(cpm) || !isFinite(cpm) ? 0 : cpm,
    accuracy: isNaN(accuracy) || !isFinite(accuracy) ? 100 : accuracy,
    errors,
    elapsedTime,
  }
}
