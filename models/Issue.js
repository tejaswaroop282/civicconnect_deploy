// Issue model - defines the structure for civic issues in MongoDB
const mongoose = require("mongoose")

// Define the issue schema
const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Issue title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Issue description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Road Maintenance",
        "Street Lighting",
        "Waste Management",
        "Water & Utilities",
        "Parks & Recreation",
        "Public Safety",
        "Environmental",
        "Transportation",
        "Other",
      ],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    adminRemarks: {
      type: String,
      trim: true,
      maxlength: [500, "Admin remarks cannot exceed 500 characters"],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isDuplicate: {
      type: Boolean,
      default: false,
    },
    duplicateOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      default: null,
    },
    deadline: {
      type: Date,
    },
    isOverdue: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
)

// Index for better query performance
issueSchema.index({ status: 1, createdAt: -1 })
issueSchema.index({ reportedBy: 1, createdAt: -1 })
issueSchema.index({ category: 1 })
issueSchema.index({ location: "2dsphere" })

// Virtual for formatted creation date
issueSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
})

// Virtual for time ago
issueSchema.virtual("timeAgo").get(function () {
  const now = new Date()
  const diffTime = Math.abs(now - this.createdAt)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return "1 day ago"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
})

// Ensure virtual fields are serialized
issueSchema.set("toJSON", { virtuals: true })

module.exports = mongoose.model("Issue", issueSchema)
