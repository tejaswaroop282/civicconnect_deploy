const { GoogleGenerativeAI } = require("@google/generative-ai")

const ALLOWED_CATEGORIES = [
  "Road Maintenance",
  "Street Lighting",
  "Waste Management",
  "Water & Utilities",
  "Parks & Recreation",
  "Public Safety",
  "Environmental",
  "Transportation",
  "Other",
]

function safeJsonParse(maybeJson) {
  try {
    return JSON.parse(maybeJson)
  } catch {
    return null
  }
}

async function classifyIssueWithGemini(description) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null
  if (!description || typeof description !== "string") return null

  function normalizeCategory(rawCategory) {
    if (!rawCategory || typeof rawCategory !== "string") return null
    const cleaned = rawCategory.trim().toLowerCase().replace(/\s+/g, " ")
    const map = {
      "road maintenance": "Road Maintenance",
      roads: "Road Maintenance",
      pothole: "Road Maintenance",
      "street lighting": "Street Lighting",
      "street light": "Street Lighting",
      lighting: "Street Lighting",
      "waste management": "Waste Management",
      garbage: "Waste Management",
      trash: "Waste Management",
      "water & utilities": "Water & Utilities",
      "water and utilities": "Water & Utilities",
      "water leak": "Water & Utilities",
      "parks & recreation": "Parks & Recreation",
      "parks and recreation": "Parks & Recreation",
      "public safety": "Public Safety",
      environmental: "Environmental",
      transportation: "Transportation",
      other: "Other",
    }
    return map[cleaned] || null
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const modelCandidates = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-1.5-flash"]

    const prompt = `
Classify this civic issue report into exactly one of these categories:
${ALLOWED_CATEGORIES.join(", ")}

Return ONLY a JSON object with this shape:
{"category":"<one of the categories above>"}

Issue description:
${description}
`.trim()

    let lastError = null
    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent(prompt)
        const responseText = result?.response?.text?.() || ""

        // Extract first JSON object in case model adds extra text.
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (!jsonMatch) continue

        const parsed = safeJsonParse(jsonMatch[0])
        const normalized = normalizeCategory(parsed?.category)
        if (normalized && ALLOWED_CATEGORIES.includes(normalized)) return normalized
      } catch (error) {
        lastError = error
        continue
      }
    }

    if (lastError) {
      console.error("Gemini classification failed:", lastError?.message || lastError)
    }
    return null
  } catch (error) {
    console.error("Gemini classification failed:", error?.message || error)
    return null
  }
}

module.exports = { classifyIssueWithGemini, ALLOWED_CATEGORIES }

