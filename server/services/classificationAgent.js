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

function classifyByKeywords(description) {
  if (!description || typeof description !== "string") return null
  const normalizedDescription = description.toLowerCase()

  if (normalizedDescription.includes("pothole")) return "Road Maintenance"
  if (normalizedDescription.includes("garbage")) return "Waste Management"
  if (normalizedDescription.includes("street light")) return "Street Lighting"
  if (normalizedDescription.includes("water leak")) return "Water & Utilities"
  return null
}

function classifyIssue(description) {
  if (!description || typeof description !== "string") return null
  return classifyByKeywords(description)
}

module.exports = { classifyIssue, ALLOWED_CATEGORIES }
