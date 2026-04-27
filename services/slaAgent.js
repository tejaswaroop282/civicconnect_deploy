function calculateDeadline(category) {
  const createdAt = new Date()

  const slaHoursByCategory = {
    "Waste Management": 24,
    "Street Lighting": 48,
    "Road Maintenance": 72,
  }

  const slaHours = slaHoursByCategory[category]
  if (!slaHours) {
    return null
  }

  return new Date(createdAt.getTime() + slaHours * 60 * 60 * 1000)
}

module.exports = { calculateDeadline }
