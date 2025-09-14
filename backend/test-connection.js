require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Donor = require('./models/Donor');
const Request = require('./models/Request');

async function testConnection() {
  try {
    console.log('Testing MongoDB Atlas connection...');
    await connectDB(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas successfully!');

    // Test basic operations
    console.log('\nTesting database operations...');
    
    // Count documents
    const userCount = await User.countDocuments();
    const donorCount = await Donor.countDocuments();
    const requestCount = await Request.countDocuments();
    
    console.log(`📊 Database stats:`);
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Donors: ${donorCount}`);
    console.log(`   - Requests: ${requestCount}`);

    // Test geospatial query
    console.log('\nTesting geospatial search...');
    const testDonors = await Donor.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [-74.006, 40.7128] },
          $maxDistance: 1000000 // 1000km in meters
        }
      }
    }).limit(5);
    
    console.log(`🔍 Found ${testDonors.length} donors near New York`);
    
    // Test blood type compatibility
    const { getCompatibleDonors } = require('./utils/compatibility');
    const compatibleGroups = getCompatibleDonors('O+');
    console.log(`🩸 Compatible blood groups for O+: ${compatibleGroups.join(', ')}`);

    console.log('\n✅ All tests passed! Database is ready to use.');
    console.log('\nNext steps:');
    console.log('1. Run "npm run seed" to populate with sample data');
    console.log('2. Start the server with "npm run dev"');
    console.log('3. Test the API endpoints');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing connection:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check your .env file has the correct MONGO_URI');
    console.log('2. Verify your MongoDB Atlas cluster is running');
    console.log('3. Check your IP is whitelisted in Atlas');
    process.exit(1);
  }
}

testConnection();

