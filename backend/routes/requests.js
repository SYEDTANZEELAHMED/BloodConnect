const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');

// GET /api/requests/my-requests : get user's blood requests
router.get('/my-requests', verifyToken, async (req, res) => {
  try {
    const requests = await Request.find({ requesterId: req.userId })
      .populate('donorId', 'name phone bloodGroup city')
      .sort({ createdAt: -1 });
    
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/requests/create : create a blood request
router.post('/create', verifyToken, async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('User ID:', req.userId);
    
    const { donorId, message, urgency } = req.body;
    
    if (!donorId) {
      return res.status(400).json({ message: 'Donor ID is required' });
    }

    // Check if request already exists
    const existingRequest = await Request.findOne({
      requesterId: req.userId,
      donorId: donorId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Request already sent to this donor' });
    }

    const request = new Request({
      requesterId: req.userId,
      donorId: donorId,
      message: message || 'Please help me with blood donation',
      urgency: urgency || 'medium',
      status: 'pending'
    });

    await request.save();
    
    // Update requester's TrustScore
    const requester = await User.findById(req.userId);
    if (requester) {
      requester.trustScore.bloodRequestsAccepted += 1;
      requester.updateTrustScore();
      await requester.save();
    }

    res.json({ 
      message: 'Blood request sent successfully',
      request: request
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/requests/:id/respond : respond to a blood request
router.put('/:id/respond', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be accepted or rejected' });
    }

    const request = await Request.findById(requestId).populate('requesterId donorId');
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.donorId._id.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to respond to this request' });
    }

    request.status = status;
    request.respondedAt = new Date();
    await request.save();

    // Update donor's TrustScore if accepted
    if (status === 'accepted') {
      const donor = await User.findById(req.userId);
      if (donor) {
        donor.trustScore.bloodDonations += 1;
        donor.updateTrustScore();
        await donor.save();
      }
    }

    res.json({ 
      message: `Request ${status} successfully`,
      request: request
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/requests/received : get requests received by donor
router.get('/received', verifyToken, async (req, res) => {
  try {
    const requests = await Request.find({ donorId: req.userId })
      .populate('requesterId', 'name phone')
      .sort({ createdAt: -1 });
    
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;