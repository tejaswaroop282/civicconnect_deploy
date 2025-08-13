# CivicConnect - Civic Issue Reporting Platform

CivicConnect is a web-based platform that enables citizens to report civic issues in their community and allows government administrators to manage and respond to these reports efficiently.

## 🌟 Features

### For Citizens
- **Easy Issue Reporting**: Report civic problems with photos, descriptions, and location details
- **Issue Tracking**: Monitor the status of reported issues (Pending → In Progress → Resolved)
- **User Dashboard**: View all your reported issues in one place
- **Category-based Reporting**: Organize issues by type (Road Maintenance, Street Lighting, etc.)
- **Real-time Updates**: Receive updates from administrators on issue progress

### For Administrators
- **Admin Dashboard**: Comprehensive view of all reported issues
- **Status Management**: Update issue status and add administrative remarks
- **Filtering & Search**: Filter issues by status, category, and priority
- **User Management**: View citizen reports and contact information
- **Statistics**: Track resolution rates and community engagement

## 🛠 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Express Sessions
- **File Upload**: Multer for image handling
- **Styling**: Bootstrap 5 + Custom CSS

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14.0.0 or higher)
- **MongoDB** (v4.0 or higher)
- **npm** (comes with Node.js)

## 🚀 Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd civicconnect-project
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Configuration
Create a `.env` file in the root directory:
\`\`\`env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/civicconnect

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-here

# Server Configuration
PORT=3000
\`\`\`

### 4. Create Upload Directory
\`\`\`bash
mkdir uploads
\`\`\`

### 5. Seed the Database
\`\`\`bash
npm run seed
\`\`\`

### 6. Start the Application
\`\`\`bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
\`\`\`

### 7. Access the Application
Open your browser and navigate to: `http://localhost:3000`

## 🔑 Default Login Credentials

### Admin Accounts
- **Email**: admin@civic.com | **Password**: admin123
- **Email**: michael.admin@civic.com | **Password**: admin123

### Citizen Accounts
- **Email**: john.smith@email.com | **Password**: user123
- **Email**: emily.davis@email.com | **Password**: user123
- **Email**: robert.wilson@email.com | **Password**: user123
- **Email**: lisa.anderson@email.com | **Password**: user123
- **Email**: david.brown@email.com | **Password**: user123

## 📁 Project Structure

\`\`\`
civicconnect-project/
├── app.js                 # Main application file
├── package.json           # Project dependencies
├── seed.js               # Database seeding script
├── .env                  # Environment variables
├── models/               # Database models
│   ├── User.js          # User model
│   └── Issue.js         # Issue model
├── routes/              # Express routes
│   ├── auth.js          # Authentication routes
│   ├── issues.js        # Issue management routes
│   └── admin.js         # Admin-specific routes
├── views/               # HTML templates
│   ├── index.html       # Homepage
│   ├── login.html       # Login page
│   ├── register.html    # Registration page
│   ├── dashboard.html   # User dashboard
│   ├── report.html      # Issue reporting form
│   ├── admin-dashboard.html # Admin dashboard
│   ├── issue-detail.html   # Issue details page
│   ├── 404.html         # 404 error page
│   └── 500.html         # 500 error page
├── public/              # Static assets
│   ├── css/
│   │   └── style.css    # Custom styles
│   └── js/
│       └── main.js      # Client-side JavaScript
└── uploads/             # File upload directory
\`\`\`

## 🎯 Usage Guide

### For Citizens

1. **Register/Login**: Create an account or login with existing credentials
2. **Report Issue**: Click "Report Issue" and fill out the form with:
   - Issue title and description
   - Category selection
   - Location details
   - Priority level
   - Optional photo upload
3. **Track Progress**: View your dashboard to see issue status updates
4. **Receive Updates**: Get notifications when administrators update your issues

### For Administrators

1. **Login**: Use admin credentials to access the admin dashboard
2. **Review Issues**: View all reported issues with filtering options
3. **Update Status**: Change issue status (Pending → In Progress → Resolved)
4. **Add Remarks**: Provide updates and comments for citizens
5. **Monitor Statistics**: Track overall platform performance and resolution rates

## 🔧 Configuration Options

### Database Configuration
- **Local MongoDB**: `mongodb://localhost:27017/civicconnect`
- **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/civicconnect`

### File Upload Settings
- **Max File Size**: 5MB
- **Allowed Types**: JPG, PNG, GIF
- **Storage Location**: `./uploads/`

### Session Configuration
- **Session Duration**: 24 hours
- **Cookie Security**: HTTP-only cookies
- **Session Store**: Memory (development) / MongoDB (production recommended)

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   \`\`\`bash
   # Make sure MongoDB is running
   mongod --dbpath /path/to/your/db
   \`\`\`

2. **Port Already in Use**
   \`\`\`bash
   # Change port in .env file or kill existing process
   lsof -ti:3000 | xargs kill -9
   \`\`\`

3. **File Upload Issues**
   \`\`\`bash
   # Ensure uploads directory exists and has write permissions
   mkdir uploads
   chmod 755 uploads
   \`\`\`

4. **Session Issues**
   \`\`\`bash
   # Clear browser cookies and restart server
   # Check SESSION_SECRET in .env file
   \`\`\`

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **Session Management**: Secure HTTP-only cookies
- **Input Validation**: Server-side validation for all forms
- **File Upload Security**: Type and size restrictions
- **Authentication Middleware**: Protected routes for authenticated users
- **Admin Authorization**: Role-based access control

## 🌐 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /logout` - User logout
- `GET /api/auth/check` - Check authentication status

### Issues
- `POST /api/issues/report` - Report new issue
- `GET /api/issues/my-issues` - Get user's issues
- `GET /api/issues/:id` - Get issue details

### Admin
- `GET /api/admin/issues` - Get all issues (admin)
- `PUT /api/admin/issues/:id/update` - Update issue status (admin)
- `GET /api/admin/stats` - Get platform statistics (admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

## 🎉 Acknowledgments

- Bootstrap team for the UI framework
- MongoDB team for the database
- Express.js team for the web framework
- All contributors and testers

---

**CivicConnect** - Making cities better, one report at a time! 🏙️✨
\`\`\`

```plaintext file=".env"
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/civicconnect

# Session Configuration  
SESSION_SECRET=civicconnect-super-secret-session-key-2024

# Server Configuration
PORT=3000

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Environment
NODE_ENV=development
