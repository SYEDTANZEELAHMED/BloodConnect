# 🩸 BloodConnect - Blood Donation Platform

A comprehensive blood donation platform that connects patients in need with verified donors through real-time matching, interactive maps, TrustScore badges, and complete request management system.

![BloodConnect](https://img.shields.io/badge/BloodConnect-Blood%20Donation%20Platform-red?style=for-the-badge&logo=heart)
![React](https://img.shields.io/badge/React-18.0+-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)

## ✨ Features

### 🔐 Authentication & Security
- **Secure Login/Signup** with JWT authentication
- **KYC Verification** - Complete Know Your Customer verification process
- **Role-based Access** - Different access levels for donors and requesters

### 🏆 TrustScore & Gamification
- **TrustScore System** - Gamified donor rating with points and levels
- **Badge System** - Earn badges for donations and helping others
- **Leaderboard** - Top donors ranking system
- **Level Progression** - New Donor → Verified → Trusted → Expert → Elite

### 🗺️ Location & Mapping
- **Interactive Maps** - Real-time donor location display using Leaflet
- **Geolocation** - Automatic location detection
- **Radius Search** - Find donors within specified distance
- **Distance Calculation** - Sort donors by proximity

### 📋 Request Management
- **Blood Request Creation** - Easy form to create blood requests
- **Request Tracking** - Track request status (Pending/Accepted/Rejected)
- **Donor Communication** - Direct contact with donors
- **Request History** - Complete request lifecycle management

### 📊 Real-time Features
- **Live Dashboard Stats** - Real-time statistics from database
- **Dynamic Updates** - Stats update as users join and donate
- **Smart Notifications** - Flash card notifications for better UX

### 🎨 Modern UI/UX
- **Responsive Design** - Works on all devices
- **Beautiful Interface** - Modern, clean design with Tailwind CSS
- **User-friendly** - Intuitive navigation and interactions
- **Accessibility** - Accessible design principles

## 🚀 Tech Stack

### Frontend
- **React.js 18+** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Leaflet** - Interactive maps
- **React Context** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/SYEDTANZEELAHMED/BloodConnect.git
cd BloodConnect
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your MongoDB URI and JWT secret
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# FRONTEND_URL=http://localhost:5173
# NODE_ENV=development

# Start backend server
npm run dev
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend/blood-donor-app

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 🔧 Environment Variables

Create a `.env` file in the `backend` directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bloodconnect
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## 📱 Usage Guide

### For Patients/Requesters
1. **Sign Up** - Create an account
2. **Complete KYC** - Verify your identity
3. **Request Blood** - Fill out the blood request form
4. **Find Donors** - Browse available donors in your area
5. **Contact Donors** - Reach out to compatible donors
6. **Track Requests** - Monitor your request status

### For Donors
1. **Sign Up** - Create an account
2. **Complete KYC** - Verify your identity and health status
3. **Register as Donor** - Add your blood group and location
4. **Earn TrustScore** - Build reputation through donations
5. **Help Others** - Respond to blood requests
6. **Track Impact** - See how many lives you've saved

## 🏗️ Project Structure

```
BloodConnect/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── upload.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Donor.js
│   │   └── Request.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── donors.js
│   │   ├── requests.js
│   │   ├── kyc.js
│   │   └── stats.js
│   ├── uploads/
│   ├── .env
│   └── server.js
├── frontend/
│   └── blood-donor-app/
│       ├── src/
│       │   ├── components/
│       │   ├── contexts/
│       │   ├── pages/
│       │   └── utils/
│       └── public/
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Donors
- `GET /api/donors/search` - Search for donors
- `POST /api/donors/request` - Create blood request
- `GET /api/donors/status` - Check donor status

### Requests
- `GET /api/requests/my-requests` - Get user's requests
- `POST /api/requests/create` - Create individual request
- `PUT /api/requests/:id/respond` - Respond to request

### KYC & TrustScore
- `POST /api/kyc/complete` - Complete KYC verification
- `GET /api/kyc/status` - Get KYC status
- `GET /api/kyc/trustscore` - Get TrustScore and leaderboard

### Statistics
- `GET /api/stats/dashboard` - Get dashboard statistics

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Syed Tanzeel Ahmed** - *Initial work* - [SYEDTANZEELAHMED](https://github.com/SYEDTANZEELAHMED)

## 🙏 Acknowledgments

- All blood donors who save lives every day
- Healthcare workers and medical professionals
- Open source community for amazing tools
- Everyone who believes in the power of helping others

## 📞 Contact

- **Email**: mduzairshams@mail.com
- **Phone**: +91 7943570126
- **Emergency**: +91 868885246

---

**Made with ❤️ for humanity. Every drop counts!**
