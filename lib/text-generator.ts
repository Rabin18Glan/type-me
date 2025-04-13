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
      throw new Error("Failed to generate text")
    }

    const data = await response.json()
    const generatedText = data.text

    // Cache the text for offline use
    cacheTextForLanguage(languageCode, generatedText)

    return generatedText
  } catch (error) {
    console.error("Error generating text:", error)
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

// Default texts for different languages
function getDefaultText(languageCode: string): string {
  const defaultTexts: Record<string, string> = {
    en: "The quick brown fox jumps over the lazy dog. This pangram contains all the letters of the English alphabet. It is commonly used for touch-typing practice.",
    es: "El veloz zorro marrón salta sobre el perro perezoso. Este pangrama contiene todas las letras del alfabeto español.",
    fr: "Portez ce vieux whisky au juge blond qui fume. Ce texte contient toutes les lettres de l'alphabet français.",
    de: "Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Dieser Satz enthält alle Buchstaben des deutschen Alphabets.",
    it: "Pranzo d'acqua fa volti sghembi. Questa frase contiene tutte le lettere dell'alfabeto italiano.",
    pt: "Luís argüia à Júlia que brações, fé, chá, óxido, pôr, zângão eram palavras do português.",
    ru: "Съешь же ещё этих мягких французских булок, да выпей чаю. Это предложение содержит все буквы русского алфавита.",
    zh: "永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭，修禊事也。群贤毕至，少长咸集。",
    ja: "いろはにほへと ちりぬるを わかよたれそ つねならむ うゐのおくやま けふこえて あさきゆめみし ゑひもせす",
    ko: "다람쥐 헌 쳇바퀴에 타고파. 이 문장은 한글의 모든 자음과 모음을 포함하고 있습니다.",
    // Add more languages as needed
  }

  return defaultTexts[languageCode] || defaultTexts.en
}
