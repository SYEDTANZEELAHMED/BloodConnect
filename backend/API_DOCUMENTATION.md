# Blood Donor App API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/register`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

#### POST `/api/auth/login`
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Donor Routes (`/api/donors`)

#### POST `/api/donors` (Protected)
Register as a blood donor
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "bloodGroup": "O+",
  "lat": 40.7128,
  "lng": -74.006,
  "city": "New York",
  "address": "123 Main St, New York, NY",
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "+1234567899"
  },
  "medicalHistory": {
    "hasDiseases": false,
    "diseases": [],
    "medications": []
  }
}
```

#### GET `/api/donors/profile` (Protected)
Get current user's donor profile

#### PUT `/api/donors/profile` (Protected)
Update donor profile

#### GET `/api/donors/search`
Search for donors by blood type and location
```
GET /api/donors/search?bloodGroup=O+&lat=40.7128&lng=-74.006&radius=1000
```

#### GET `/api/donors/all`
Get all available donors (public)

### Request Routes (`/api/requests`)

#### POST `/api/requests` (Protected)
Create a blood request
```json
{
  "patientName": "Robert Johnson",
  "bloodGroupNeeded": "O+",
  "urgency": "high",
  "contactPhone": "+1234567892",
  "lat": 41.8781,
  "lng": -87.6298,
  "city": "Chicago",
  "address": "789 Pine St, Chicago, IL",
  "hospitalName": "Chicago General Hospital",
  "doctorName": "Dr. Smith",
  "requiredUnits": 2,
  "notes": "Emergency surgery required",
  "radius": 1000
}
```

#### GET `/api/requests/search`
Search for blood requests
```
GET /api/requests/search?bloodGroup=O+&lat=41.8781&lng=-87.6298&radius=1000&urgency=high
```

#### GET `/api/requests/my-requests` (Protected)
Get current user's requests

#### PUT `/api/requests/:id/status` (Protected)
Update request status
```json
{
  "status": "fulfilled",
  "fulfilledBy": "donor_id_here"
}
```

#### GET `/api/requests`
Get all active requests

## Key Features

### 1. Blood Type Compatibility
The system automatically finds compatible donors based on blood type:
- O- can donate to: O-, O+, A-, A+, B-, B+, AB-, AB+
- O+ can donate to: O+, A+, B+, AB+
- A- can donate to: A-, A+, AB-, AB+
- A+ can donate to: A+, AB+
- B- can donate to: B-, B+, AB-, AB+
- B+ can donate to: B+, AB+
- AB- can donate to: AB-, AB+
- AB+ can donate to: AB+

### 2. Location-Based Search
- Searches within specified radius (default: 1000km)
- Results sorted by distance (closest first)
- Uses MongoDB's geospatial queries for efficient searching

### 3. User Roles
- **requester**: Can create blood requests
- **donor**: Can register as blood donor
- **admin**: Full access (future feature)

### 4. Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Token expires in 7 days

## Testing the API

### 1. Start the server
```bash
cd backend
npm run dev
```

### 2. Seed sample data
```bash
npm run seed
```

### 3. Test endpoints using curl or Postman

#### Register a user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","phone":"+1234567890"}'
```

#### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Search for donors:
```bash
curl "http://localhost:5000/api/donors/search?bloodGroup=O+&lat=40.7128&lng=-74.006&radius=1000"
```

## Database Schema

### User Model
- Basic user information
- Multiple roles support
- Profile information
- Emergency contacts

### Donor Model
- Linked to User
- Blood group and availability
- Location (geospatial)
- Medical history
- Donation history

### Request Model
- Linked to User
- Patient information
- Blood group needed
- Location (geospatial)
- Matched donors
- Status tracking

## Environment Variables
Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb+srv://syedtanzeel032_db_user:36lBLILI3UuTyf6w@cluster1.3mokbkc.mongodb.net/blood-donor-app?retryWrites=true&w=majority&appName=Cluster1
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

