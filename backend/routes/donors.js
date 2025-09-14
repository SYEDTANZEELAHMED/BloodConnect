const express = require('express');
const router = express.Router();
const Donor = require('../models/Donor');
const User = require('../models/User');
const { verifyToken } = require('./auth');
const { getCompatibleDonors } = require('../utils/compatibility');
const upload = require('../config/upload');

// POST /api/donors : register as donor (requires authentication)
router.post('/', verifyToken, upload.single('aadharCardImage'), async (req, res) => {
  try {
    const { 
      name, 
      phone, 
      bloodGroup, 
      lat, 
      lng, 
      city, 
      address,
      aadharNumber,
      emergencyContact,
      medicalHistory 
    } = req.body;
    
    if (!name || !phone || !bloodGroup || !lat || !lng || !city) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already has a donor profile
    const existingDonor = await Donor.findOne({ userId: req.userId });
    if (existingDonor) {
      return res.status(400).json({ message: 'Donor profile already exists' });
    }

    const donor = new Donor({
      userId: req.userId,
      name, 
      phone, 
      bloodGroup,
      city,
      address,
      aadharNumber,
      aadharCardImage: req.file ? `/uploads/${req.file.filename}` : null,
      emergencyContact: emergencyContact ? JSON.parse(emergencyContact) : {},
      medicalHistory: medicalHistory ? JSON.parse(medicalHistory) : {},
      location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
      available: true
    });
    
    await donor.save();
    
    // Update user role to include donor
    await User.findByIdAndUpdate(req.userId, { 
      $addToSet: { roles: 'donor' },
      $set: { updatedAt: new Date() }
    });

    res.status(201).json({
      message: 'Donor registered successfully',
      donor: {
        id: donor._id,
        name: donor.name,
        phone: donor.phone,
        bloodGroup: donor.bloodGroup,
        city: donor.city,
        available: donor.available
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/donors/profile : get current user's donor profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.userId });
    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }
    res.json(donor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/donors/profile : update donor profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: new Date() };
    if (updateData.lat && updateData.lng) {
      updateData.location = { 
        type: 'Point', 
        coordinates: [parseFloat(updateData.lng), parseFloat(updateData.lat)] 
      };
    }
    
    const donor = await Donor.findOneAndUpdate(
      { userId: req.userId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }
    
    res.json({ message: 'Profile updated successfully', donor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/donors/search?bloodGroup=A+&lat=..&lng=..&radius=1000
router.get('/search', async (req, res) => {
  try {
    const { bloodGroup, lat, lng, radius = 1000 } = req.query;
    if (!bloodGroup || !lat || !lng) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Convert radius from kilometers to meters
    const radiusInMeters = parseInt(radius) * 1000;

    // Get compatible blood groups
    const compatibleGroups = getCompatibleDonors(bloodGroup);

    // Find donors with compatible blood groups within radius
    const donors = await Donor.find({
      bloodGroup: { $in: compatibleGroups },
      available: true,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radiusInMeters
        }
      }
    })
    .populate('userId', 'trustScore kyc.isCompleted')
    .select('name phone bloodGroup city address location available lastDonated createdAt userId')
    .limit(100);

    // Calculate distances for sorting and include TrustScore
    const donorsWithDistance = donors.map(donor => {
      const distance = calculateDistance(
        parseFloat(lat), 
        parseFloat(lng), 
        donor.location.coordinates[1], 
        donor.location.coordinates[0]
      );
      return {
        ...donor.toObject(),
        distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
        trustScore: donor.userId?.trustScore || { score: 0, level: 'New Donor', badges: [] },
        isKycVerified: donor.userId?.kyc?.isCompleted || false
      };
    });

    // Sort by distance (ascending)
    donorsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json({
      bloodGroupNeeded: bloodGroup,
      compatibleGroups,
      totalFound: donorsWithDistance.length,
      donors: donorsWithDistance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/donors/all : get all donors (for admin or debugging)
router.get('/all', async (req, res) => {
  try {
    const donors = await Donor.find({ available: true })
      .select('name phone bloodGroup city available createdAt')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(donors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

// GET /api/donors/:id : get individual donor details
router.get('/:id', async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id)
      .populate('userId', 'trustScore kyc.isCompleted')
      .select('name phone bloodGroup city address location available lastDonated createdAt userId');
    
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    const donorData = {
      ...donor.toObject(),
      trustScore: donor.userId?.trustScore || { score: 0, level: 'New Donor', badges: [] },
      isKycVerified: donor.userId?.kyc?.isCompleted || false
    };

    res.json(donorData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/donors/request : create blood request and search for donors
router.post('/request', verifyToken, async (req, res) => {
  try {
    const { 
      patientName, 
      contactPhone, 
      bloodGroupNeeded, 
      urgency, 
      notes, 
      lat, 
      lng, 
      radius = 1000 
    } = req.body;

    if (!patientName || !contactPhone || !bloodGroupNeeded || !lat || !lng) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create blood request record
    const bloodRequest = {
      requesterId: req.userId,
      patientName,
      contactPhone,
      bloodGroupNeeded,
      urgency: urgency || 'medium',
      notes: notes || '',
      location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
      status: 'active',
      createdAt: new Date()
    };

    // Get compatible blood groups
    const compatibleGroups = getCompatibleDonors(bloodGroupNeeded);

    // Find donors with compatible blood groups within radius
    const radiusInMeters = parseInt(radius) * 1000;
    const donors = await Donor.find({
      bloodGroup: { $in: compatibleGroups },
      available: true,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radiusInMeters
        }
      }
    })
    .populate('userId', 'trustScore kyc.isCompleted')
    .select('name phone bloodGroup city address location available lastDonated createdAt userId')
    .limit(100);

    // Calculate distances for sorting and include TrustScore
    const donorsWithDistance = donors.map(donor => {
      const distance = calculateDistance(
        parseFloat(lat), 
        parseFloat(lng), 
        donor.location.coordinates[1], 
        donor.location.coordinates[0]
      );
      return {
        ...donor.toObject(),
        distance: Math.round(distance * 100) / 100,
        trustScore: donor.userId?.trustScore || { score: 0, level: 'New Donor', badges: [] },
        isKycVerified: donor.userId?.kyc?.isCompleted || false
      };
    });

    // Sort by distance (ascending)
    donorsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json({
      message: 'Blood request created and donors found',
      request: bloodRequest,
      searchResults: {
        donors: donorsWithDistance,
        totalFound: donorsWithDistance.length,
        searchRadius: radius
      }
    });
  } catch (error) {
    console.error('Blood request creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/donors/status : check if user is registered as donor
router.get('/status', verifyToken, async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.userId });
    res.json({ isDonor: !!donor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
