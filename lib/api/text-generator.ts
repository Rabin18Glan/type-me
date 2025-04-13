import fallbackTexts from "@/data/fallback-texts.json"

// Cache for offline text
const TEXT_CACHE_KEY = "typeme-text-cache"

// Function to generate text using Gemini AI
export async function generateText(prompt: string, languageCode: string, difficulty: string): Promise<string> {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return getDefaultText(languageCode)
    }

    // Check if we're online
    if (!navigator.onLine) {
      return getOfflineText(languageCode)
    }

    // Make API request to our backend
    const response = await fetch("/api/generate-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        languageCode,
        difficulty,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API error: ${response.status} - ${errorText}`)
      throw new Error(`Failed to generate text: ${response.status}`)
    }

    const data = await response.json()

    // If there was an error but the API returned a fallback text
    if (data.source === "error" && data.text) {
      console.warn("Using fallback text due to API error:", data.error)
      // Still cache the fallback text for offline use
      cacheTextForLanguage(languageCode, data.text)
      return data.text
    }

    const generatedText = data.text

    // Cache the text for offline use
    cacheTextForLanguage(languageCode, generatedText)

    return generatedText
  } catch (error) {
    console.error("Error generating text:", error)
    // Try to get text from cache first before falling back to default
    try {
      const cachedText = await getOfflineText(languageCode)
      if (cachedText && cachedText !== getDefaultText(languageCode)) {
        return cachedText
      }
    } catch (e) {
      // If getting from cache fails, continue to default
    }
    return getDefaultText(languageCode)
  }
}

// Function to get text from cache for offline use
export async function getOfflineText(languageCode: string): Promise<string> {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return getDefaultText(languageCode)
    }

    // Try to get cached text for the language
    const cachedTexts = JSON.parse(localStorage.getItem(TEXT_CACHE_KEY) || "{}")

    if (cachedTexts[languageCode] && cachedTexts[languageCode].length > 0) {
      // Get a random text from the cache
      const texts = cachedTexts[languageCode]
      const randomIndex = Math.floor(Math.random() * texts.length)
      return texts[randomIndex]
    }

    return getDefaultText(languageCode)
  } catch (error) {
    console.error("Error getting offline text:", error)
    return getDefaultText(languageCode)
  }
}

// Function to cache text for a language
function cacheTextForLanguage(languageCode: string, text: string) {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return
    }

    // Get existing cache
    const cachedTexts = JSON.parse(localStorage.getItem(TEXT_CACHE_KEY) || "{}")

    // Initialize array for language if it doesn't exist
    if (!cachedTexts[languageCode]) {
      cachedTexts[languageCode] = []
    }

    // Add text to cache (limit to 10 texts per language)
    if (!cachedTexts[languageCode].includes(text)) {
      cachedTexts[languageCode].unshift(text)
      cachedTexts[languageCode] = cachedTexts[languageCode].slice(0, 10)
    }

    // Save back to localStorage
    localStorage.setItem(TEXT_CACHE_KEY, JSON.stringify(cachedTexts))
  } catch (error) {
    console.error("Error caching text:", error)
  }
}

// Get a random text from the fallback texts
export function getDefaultText(languageCode: string): string {
  // Check if we have fallback texts for this language
  if (fallbackTexts[languageCode as keyof typeof fallbackTexts]) {
    const texts = fallbackTexts[languageCode as keyof typeof fallbackTexts]
    const randomIndex = Math.floor(Math.random() * texts.length)
    return texts[randomIndex]
  }

  // If no fallback texts for this language, use English
  const englishTexts = fallbackTexts.en
  const randomIndex = Math.floor(Math.random() * englishTexts.length)
  return englishTexts[randomIndex]
}
