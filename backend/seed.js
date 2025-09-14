require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Donor = require('./models/Donor');
const Request = require('./models/Request');

async function seed() {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Donor.deleteMany({});
    await Request.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '+1234567890',
        roles: ['donor', 'requester'],
        profile: {
          dateOfBirth: new Date('1990-01-15'),
          gender: 'male',
          address: '123 Main St, New York, NY',
          emergencyContact: {
            name: 'Jane Doe',
            phone: '+1234567899',
            relationship: 'Spouse'
          }
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        phone: '+1234567891',
        roles: ['donor'],
        profile: {
          dateOfBirth: new Date('1985-05-20'),
          gender: 'female',
          address: '456 Oak Ave, Los Angeles, CA'
        }
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'password123',
        phone: '+1234567892',
        roles: ['requester'],
        profile: {
          dateOfBirth: new Date('1988-12-10'),
          gender: 'male',
          address: '789 Pine St, Chicago, IL'
        }
      },
      {
        name: 'Alice Brown',
        email: 'alice@example.com',
        password: 'password123',
        phone: '+1234567893',
        roles: ['donor', 'requester'],
        profile: {
          dateOfBirth: new Date('1992-03-25'),
          gender: 'female',
          address: '321 Elm St, Miami, FL'
        }
      },
      {
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        password: 'password123',
        phone: '+1234567894',
        roles: ['donor'],
        profile: {
          dateOfBirth: new Date('1987-08-12'),
          gender: 'male',
          address: '654 Maple Dr, Seattle, WA'
        }
      }
    ]);
    console.log('Created sample users');

    // Create sample donors with different blood types and locations
    const donors = await Donor.insertMany([
      {
        userId: users[0]._id,
        name: 'John Doe',
        phone: '+1234567890',
        bloodGroup: 'O+',
        city: 'New York',
        address: '123 Main St, New York, NY',
        location: { type: 'Point', coordinates: [-74.006, 40.7128] },
        available: true,
        emergencyContact: {
          name: 'Jane Doe',
          phone: '+1234567899'
        },
        medicalHistory: {
          hasDiseases: false,
          diseases: [],
          medications: []
        }
      },
      {
        userId: users[1]._id,
        name: 'Jane Smith',
        phone: '+1234567891',
        bloodGroup: 'A+',
        city: 'Los Angeles',
        address: '456 Oak Ave, Los Angeles, CA',
        location: { type: 'Point', coordinates: [-118.2437, 34.0522] },
        available: true,
        medicalHistory: {
          hasDiseases: false,
          diseases: [],
          medications: []
        }
      },
      {
        userId: users[3]._id,
        name: 'Alice Brown',
        phone: '+1234567893',
        bloodGroup: 'B+',
        city: 'Miami',
        address: '321 Elm St, Miami, FL',
        location: { type: 'Point', coordinates: [-80.1918, 25.7617] },
        available: true,
        medicalHistory: {
          hasDiseases: false,
          diseases: [],
          medications: []
        }
      },
      {
        userId: users[4]._id,
        name: 'Charlie Wilson',
        phone: '+1234567894',
        bloodGroup: 'AB+',
        city: 'Seattle',
        address: '654 Maple Dr, Seattle, WA',
        location: { type: 'Point', coordinates: [-122.3321, 47.6062] },
        available: true,
        medicalHistory: {
          hasDiseases: false,
          diseases: [],
          medications: []
        }
      }
    ]);
    console.log('Created sample donors');

    // Create sample requests
    const requests = await Request.insertMany([
      {
        userId: users[2]._id,
        patientName: 'Robert Johnson',
        bloodGroupNeeded: 'O+',
        urgency: 'high',
        contactPhone: '+1234567892',
        city: 'Chicago',
        address: '789 Pine St, Chicago, IL',
        hospitalName: 'Chicago General Hospital',
        doctorName: 'Dr. Smith',
        requiredUnits: 2,
        location: { type: 'Point', coordinates: [-87.6298, 41.8781] },
        matchedDonors: [donors[0]._id],
        notes: 'Emergency surgery required'
      },
      {
        userId: users[0]._id,
        patientName: 'Mary Johnson',
        bloodGroupNeeded: 'A+',
        urgency: 'medium',
        contactPhone: '+1234567890',
        city: 'New York',
        address: '123 Main St, New York, NY',
        hospitalName: 'NYC Medical Center',
        doctorName: 'Dr. Brown',
        requiredUnits: 1,
        location: { type: 'Point', coordinates: [-74.006, 40.7128] },
        matchedDonors: [donors[1]._id],
        notes: 'Regular blood transfusion'
      }
    ]);
    console.log('Created sample requests');

    console.log('Seed data created successfully!');
    console.log('\nSample data created:');
    console.log('- Users:', users.length);
    console.log('- Donors:', donors.length);
    console.log('- Requests:', requests.length);
    console.log('\nTest credentials:');
    console.log('john@example.com / password123 (donor + requester)');
    console.log('jane@example.com / password123 (donor)');
    console.log('bob@example.com / password123 (requester)');
    console.log('alice@example.com / password123 (donor + requester)');
    console.log('charlie@example.com / password123 (donor)');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();