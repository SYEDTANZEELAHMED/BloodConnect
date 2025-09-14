const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Donor = require('../models/Donor');
const Request = require('../models/Request');

// GET /api/stats/dashboard : get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    // Count total users
    const totalUsers = await User.countDocuments();
    
    // Count active donors (users who have completed KYC and are registered as donors)
    const activeDonors = await Donor.countDocuments({ available: true });
    
    // Count unique cities covered
    const citiesCovered = await Donor.distinct('city');
    
    // Count completed blood donations (accepted requests)
    const livesSaved = await Request.countDocuments({ status: 'accepted' });
    
    res.json({
      totalUsers,
      activeDonors,
      citiesCovered: citiesCovered.length,
      livesSaved
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
