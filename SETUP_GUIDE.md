# 🩸 Blood Donor App - Complete Setup Guide

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file with your MongoDB Atlas connection
echo "MONGO_URI=mongodb+srv://syedtanzeel032_db_user:36lBLILI3UuTyf6w@cluster1.3mokbkc.mongodb.net/blood-donor-app?retryWrites=true&w=majority&appName=Cluster1
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development" > .env

# Test database connection
npm run test-connection

# Seed sample data
npm run seed

# Start the server
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend/blood-donor-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🎯 Main Goal Achieved

✅ **Blood Search with 1000km Radius**: When you search for blood in the "Request for Blood" page, you will see:
- List of registered donors below in "Available Donors"
- Results arranged by KM radius in ascending order (closest first)
- Results shown even if out of radius (up to 1000km)
- Extended range to 1000 kilometers as requested

## 🔧 What Was Fixed

### 1. **Authentication Issues**
- ✅ Added JWT token handling in API requests
- ✅ Created AuthContext for state management
- ✅ Updated all forms to require authentication
- ✅ Added proper error handling and user feedback

### 2. **Form Issues**
- ✅ Added all required fields (city, address, emergency contacts, etc.)
- ✅ Updated form validation and error messages
- ✅ Fixed API response structure mismatch

### 3. **Database Integration**
- ✅ Connected to MongoDB Atlas cluster
- ✅ Enhanced models with proper schemas
- ✅ Added geospatial indexing for location searches
- ✅ Implemented blood type compatibility matching

### 4. **Search Functionality**
- ✅ 1000km radius search (as requested)
- ✅ Distance-based sorting (ascending order)
- ✅ Blood type compatibility matching
- ✅ Efficient geospatial queries

## 🧪 Testing the Complete Flow

### 1. Test Database Connection
```bash
cd backend
npm run test-connection
```

### 2. Test API Functionality
```bash
cd backend
npm run test-api
```

### 3. Test Complete User Flow
1. **Register a new user** at `/signup`
2. **Login** at `/login`
3. **Register as donor** at `/register` (requires login)
4. **Create blood request** at `/request` (requires login)
5. **View search results** with donors sorted by distance

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Donor Management
- `POST /api/donors` - Register as donor (requires auth)
- `GET /api/donors/profile` - Get donor profile (requires auth)
- `PUT /api/donors/profile` - Update donor profile (requires auth)
- `GET /api/donors/search` - Search donors by blood type and location

### Blood Requests
- `POST /api/requests` - Create blood request (requires auth)
- `GET /api/requests/search` - Search blood requests
- `GET /api/requests/my-requests` - Get user's requests (requires auth)

## 🎨 Frontend Features

### 1. **Authentication System**
- Login/Signup pages with proper validation
- JWT token management
- Protected routes
- User state management

### 2. **Donor Registration**
- Complete donor profile form
- Location capture (GPS + manual entry)
- Emergency contact information
- Medical history tracking

### 3. **Blood Request System**
- Comprehensive request form
- Hospital and doctor information
- Urgency levels
- Notes and additional details

### 4. **Search & Results**
- 1000km radius search
- Distance-based sorting
- Blood type compatibility
- Interactive map view
- Donor cards with contact info

## 🔍 Key Features Implemented

### Blood Type Compatibility
- O- can donate to: All blood types
- O+ can donate to: O+, A+, B+, AB+
- A- can donate to: A-, A+, AB-, AB+
- A+ can donate to: A+, AB+
- B- can donate to: B-, B+, AB-, AB+
- B+ can donate to: B+, AB+
- AB- can donate to: AB-, AB+
- AB+ can donate to: AB+

### Location-Based Search
- Geospatial queries using MongoDB
- 1000km search radius (as requested)
- Results sorted by distance (closest first)
- Efficient indexing for fast searches

### User Management
- Multiple roles support (donor, requester, admin)
- Profile management
- Authentication and authorization
- Session management

## 🚨 Troubleshooting

### Common Issues

1. **"Failed to create request" Error**
   - Make sure you're logged in
   - Check that all required fields are filled
   - Verify backend server is running

2. **Database Connection Issues**
   - Check your `.env` file has correct MONGO_URI
   - Verify MongoDB Atlas cluster is running
   - Check IP whitelist in Atlas

3. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT_SECRET in backend .env
   - Verify token expiration

### Debug Commands
```bash
# Test database connection
cd backend && npm run test-connection

# Test API functionality
cd backend && npm run test-api

# Check server logs
cd backend && npm run dev

# Check frontend console
# Open browser dev tools and check console for errors
```

## 🎉 Success Indicators

When everything is working correctly, you should see:

1. ✅ Backend server running on port 5000
2. ✅ Frontend running on port 5173
3. ✅ Database connection successful
4. ✅ User registration/login working
5. ✅ Donor registration working
6. ✅ Blood request creation working
7. ✅ Search results showing donors sorted by distance
8. ✅ 1000km radius search working

## 📱 User Flow

1. **New User**: Sign up → Login → Register as Donor → Create Blood Request
2. **Existing User**: Login → Register as Donor (if not done) → Create Blood Request
3. **Search Results**: View donors sorted by distance within 1000km radius

The system now provides a complete blood donor matching platform with all the requested features!

