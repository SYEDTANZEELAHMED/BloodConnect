require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Donor = require('./models/Donor');
const Request = require('./models/Request');

async function testAPI() {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await connectDB(process.env.MONGO_URI);
    console.log('✅ Connected successfully!');

    // Test user registration
    console.log('\n👤 Testing user registration...');
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '+1234567890'
    });
    await testUser.save();
    console.log('✅ User created:', testUser.email);

    // Test donor registration
    console.log('\n🩸 Testing donor registration...');
    const testDonor = new Donor({
      userId: testUser._id,
      name: 'Test Donor',
      phone: '+1234567890',
      bloodGroup: 'O+',
      city: 'Test City',
      address: '123 Test St',
      location: { type: 'Point', coordinates: [-74.006, 40.7128] },
      available: true,
      emergencyContact: {
        name: 'Emergency Contact',
        phone: '+1234567891'
      },
      medicalHistory: {
        hasDiseases: false,
        diseases: [],
        medications: []
      }
    });
    await testDonor.save();
    console.log('✅ Donor created:', testDonor.name);

    // Test blood request
    console.log('\n🚨 Testing blood request...');
    const testRequest = new Request({
      userId: testUser._id,
      patientName: 'Test Patient',
      bloodGroupNeeded: 'O+',
      urgency: 'high',
      contactPhone: '+1234567890',
      city: 'Test City',
      address: '456 Patient St',
      hospitalName: 'Test Hospital',
      doctorName: 'Dr. Test',
      requiredUnits: 2,
      location: { type: 'Point', coordinates: [-74.006, 40.7128] },
      notes: 'Test request'
    });
    await testRequest.save();
    console.log('✅ Request created:', testRequest.patientName);

    // Test search functionality
    console.log('\n🔍 Testing search functionality...');
    const searchResults = await Donor.find({
      bloodGroup: 'O+',
      available: true,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [-74.006, 40.7128] },
          $maxDistance: 1000000 // 1000km in meters
        }
      }
    });
    console.log('✅ Found donors:', searchResults.length);

    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await User.deleteOne({ email: 'test@example.com' });
    await Donor.deleteOne({ userId: testUser._id });
    await Request.deleteOne({ userId: testUser._id });
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All tests passed! Your API is working correctly.');
    console.log('\nNext steps:');
    console.log('1. Start the backend server: npm run dev');
    console.log('2. Start the frontend: cd ../frontend/blood-donor-app && npm run dev');
    console.log('3. Test the complete flow in the browser');

    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testAPI();

