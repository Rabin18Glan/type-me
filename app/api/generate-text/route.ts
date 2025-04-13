import { type NextRequest, NextResponse } from "next/server"
import { getDefaultText } from "@/lib/api/text-generator"

export async function POST(request: NextRequest) {
  try {
    const { prompt, languageCode, difficulty } = await request.json()

    // Check if Gemini API key is available
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      // Fallback to default text if no API key
      return NextResponse.json({
        text: getDefaultText(languageCode),
        source: "default",
      })
    }

    // Prepare the prompt for Gemini
    const fullPrompt = `
      Generate a typing practice text in ${getLanguageName(languageCode)} language.
      Difficulty level: ${difficulty}.
      Context: ${prompt}.
      
      Requirements:
      - Text should be between 100-200 words for easy, 200-300 for medium, 300-400 for hard difficulty
      - Text should be coherent and make sense
      - Text should be appropriate for all ages
      - Only return the text content, no additional instructions or metadata
      - If the language uses non-Latin characters, include those
      
      The text:
    `

    try {
      // Call Gemini API with the correct endpoint for Gemini 1.0 Pro
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: fullPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        },
      )

      if (!response.ok) {
        console.error(`Gemini API error: ${response.status} - ${await response.text()}`)
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()

      // Extract the generated text
      let generatedText = ""

      if (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text
      ) {
        generatedText = data.candidates[0].content.parts[0].text.trim()
      }

      if (!generatedText) {
        throw new Error("No text generated")
      }

      return NextResponse.json({
        text: generatedText,
        source: "gemini",
      })
    } catch (apiError) {
      console.error("Gemini API error:", apiError)
      // Return a fallback text from our JSON file
      return NextResponse.json({
        text: getDefaultText(languageCode),
        source: "fallback",
        error: apiError instanceof Error ? apiError.message : "Unknown API error",
      })
    }
  } catch (error) {
    console.error("Error in generate-text route:", error)

    // Return a default text as fallback
    return NextResponse.json({
      text: getDefaultText("en"),
      source: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

// Helper function to get language name from code
function getLanguageName(code: string): string {
  const languageMap: Record<string, string> = {
    en: "English",
    ne: "Nepali",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ru: "Russian",
    zh: "Chinese",
    ja: "Japanese",
    ko: "Korean",
    // Add more languages as needed
  }

  return languageMap[code] || "English"
}
