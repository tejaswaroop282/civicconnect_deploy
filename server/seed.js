// Seed script to populate database with sample data
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()

// Import models
const User = require("./models/User")
const Issue = require("./models/Issue")

// Connect to MongoDB
async function connectDB() {
  try {
   
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/civicconnect")
    console.log("✅ Connected to MongoDB")
  } catch (error) {
    console.error("❌ MongoDB connection error:", error)
    process.exit(1)
  }
}

// Clear existing data
async function clearData() {
  try {
    console.log("🧹 Clearing existing data...")
    await User.deleteMany({})
    await Issue.deleteMany({})
    console.log("✅ Cleared existing data")
  } catch (error) {
    console.error("❌ Error clearing data:", error)
  }
}

// Create admin users
async function createAdmins() {
  try {
    console.log("👨‍💼 Creating admin users...")

    const admins = [
      {
        name: "Sarah Johnson",
        email: "admin@civic.com",
        password: "admin123",
        phone: "+1-555-0101",
        isAdmin: true,
      },
      {
        name: "Michael Chen",
        email: "michael.admin@civic.com",
        password: "admin123",
        phone: "+1-555-0102",
        isAdmin: true,
      },
    ]

    for (const adminData of admins) {
      const admin = new User(adminData)
      await admin.save()
      console.log(`✅ Created admin: ${admin.name}`)
    }
  } catch (error) {
    console.error("❌ Error creating admins:", error)
  }
}

// Create citizen users
async function createCitizens() {
  try {
    console.log("👤 Creating citizen users...")

    const citizens = [
      {
        name: "John Smith",
        email: "john.smith@email.com",
        password: "user123",
        phone: "+1-555-0201",
      },
      {
        name: "Emily Davis",
        email: "emily.davis@email.com",
        password: "user123",
        phone: "+1-555-0202",
      },
      {
        name: "Robert Wilson",
        email: "robert.wilson@email.com",
        password: "user123",
        phone: "+1-555-0203",
      },
      {
        name: "Lisa Anderson",
        email: "lisa.anderson@email.com",
        password: "user123",
        phone: "+1-555-0204",
      },
      {
        name: "David Brown",
        email: "david.brown@email.com",
        password: "user123",
        phone: "+1-555-0205",
      },
    ]

    for (const citizenData of citizens) {
      const citizen = new User(citizenData)
      await citizen.save()
      console.log(`✅ Created citizen: ${citizen.name}`)
    }
  } catch (error) {
    console.error("❌ Error creating citizens:", error)
  }
}

// Create sample issues
async function createIssues() {
  try {
    console.log("📝 Creating sample issues...")

    // Get some users to assign issues to
    const citizens = await User.find({ isAdmin: false }).limit(5)

    const issues = [
      {
        title: "Large Pothole on Main Street",
        description:
          "There's a dangerous pothole on Main Street near the intersection with Oak Avenue. It's about 2 feet wide and very deep. Several cars have been damaged.",
        category: "Road Maintenance",
        location: {
          type: "Point",
          coordinates: [-122.4194, 37.7749], // Example: San Francisco
        },
        status: "pending",
        reportedBy: citizens[0]._id,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
      {
        title: "Broken Street Light",
        description:
          "The street light at the corner of Pine Street and 2nd Avenue has been out for over a week. It's creating a safety hazard for pedestrians at night.",
        category: "Street Lighting",
        location: {
          type: "Point",
          coordinates: [-73.9857, 40.7484], // Example: New York
        },
        status: "in-progress",
        reportedBy: citizens[1]._id,
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500",
        adminRemarks: "Work order has been issued to the electrical department. Repair scheduled for this week.",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        title: "Garbage Not Collected for 3 Days",
        description:
          "The garbage bins on Elm Street haven't been collected for 3 days. The smell is getting bad and attracting pests.",
        category: "Waste Management",
        location: {
          type: "Point",
          coordinates: [-0.1278, 51.5074], // Example: London
        },
        status: "resolved",
        reportedBy: citizens[2]._id,
        imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500",
        adminRemarks: "Issue resolved. Garbage collection route has been updated and bins have been collected.",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      },
      {
        title: "Water Leak in City Park",
        description:
          "There's a significant water leak near the playground in City Park. Water is pooling and creating muddy conditions.",
        category: "Water & Utilities",
        location: {
          type: "Point",
          coordinates: [2.3522, 48.8566], // Example: Paris
        },
        status: "in-progress",
        reportedBy: citizens[3]._id,
        imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500",
        adminRemarks: "Water department has been notified. Repair crew dispatched to assess the situation.",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        title: "Damaged Road Surface",
        description:
          "The road surface on Maple Avenue is severely cracked and uneven. It's causing damage to vehicles and is unsafe for cyclists.",
        category: "Road Maintenance",
        location: {
          type: "Point",
          coordinates: [151.2093, -33.8688], // Example: Sydney
        },
        status: "pending",
        reportedBy: citizens[4]._id,
        imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        title: "Illegal Dumping Behind Shopping Center",
        description:
          "Someone has been illegally dumping furniture and appliances behind the shopping center on Commerce Street.",
        category: "Environmental",
        location: {
          type: "Point",
          coordinates: [139.6917, 35.6895], // Example: Tokyo
        },
        status: "resolved",
        reportedBy: citizens[0]._id,
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        adminRemarks:
          "Cleanup completed. Additional surveillance cameras have been installed to prevent future dumping.",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      },
    ]

    for (const issueData of issues) {
      const issue = new Issue(issueData)
      await issue.save()
      console.log(`✅ Created issue: ${issue.title} (${issue.status})`)
    }
  } catch (error) {
    console.error("❌ Error creating issues:", error)
  }
}

// Main seeding function
async function seedDatabase() {
  try {
    await connectDB()
    await clearData()
    await createAdmins()
    await createCitizens()
    await createIssues()

    console.log("\n🎉 Database seeded successfully!")
    console.log("\n📊 Summary:")

    const userCount = await User.countDocuments()
    const adminCount = await User.countDocuments({ isAdmin: true })
    const citizenCount = await User.countDocuments({ isAdmin: false })
    const issueCount = await Issue.countDocuments()

    console.log(`👥 Users created: ${userCount}`)
    console.log(`   - Admins: ${adminCount}`)
    console.log(`   - Citizens: ${citizenCount}`)
    console.log(`📝 Issues created: ${issueCount}`)

    console.log("\n🔑 Login Credentials:")
    console.log("👨‍💼 Admin Accounts:")
    console.log("   - admin@civic.com / admin123")
    console.log("   - michael.admin@civic.com / admin123")
    console.log("\n👤 Citizen Accounts:")
    console.log("   - john.smith@email.com / user123")
    console.log("   - emily.davis@email.com / user123")
    console.log("   - robert.wilson@email.com / user123")
    console.log("   - lisa.anderson@email.com / user123")
    console.log("   - david.brown@email.com / user123")

    console.log("\n🚀 Ready to start! Run: node app.js")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  } finally {
    console.log("🔌 Database connection closed")
    await mongoose.connection.close()
    process.exit(0)
  }
}

// Run the seeding
seedDatabase()
