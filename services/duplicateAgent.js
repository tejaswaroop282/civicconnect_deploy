const Issue = require("../models/Issue")

async function findNearbyDuplicate(category, longitude, latitude) {
  if (!category) {
    return null
  }

  const lng = Number(longitude)
  const lat = Number(latitude)

  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    return null
  }

  const duplicateIssue = await Issue.findOne({
    category,
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        $maxDistance: 100,
      },
    },
  })

  return duplicateIssue || null
}

module.exports = { findNearbyDuplicate }
