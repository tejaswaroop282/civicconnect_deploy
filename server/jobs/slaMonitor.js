const cron = require("node-cron")
const Issue = require("../models/Issue")

function startSlaMonitor() {
  cron.schedule("0 * * * *", async () => {
    try {
      await Issue.updateMany(
        {
          deadline: { $lt: new Date() },
          isOverdue: false,
        },
        {
          $set: { isOverdue: true },
        },
      )
    } catch (error) {
      console.error("SLA monitor job failed:", error)
    }
  })
}

module.exports = { startSlaMonitor }
