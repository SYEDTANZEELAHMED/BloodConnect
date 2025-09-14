const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('./auth');
const upload = require('../config/upload');

// Health issues list for blood donation eligibility
const HEALTH_ISSUES = [
  { type: 'infectious', name: 'HIV/AIDS', description: 'Human Immunodeficiency Virus' },
  { type: 'infectious', name: 'Hepatitis B', description: 'Hepatitis B Virus' },
  { type: 'infectious', name: 'Hepatitis C', description: 'Hepatitis C Virus' },
  { type: 'infectious', name: 'Syphilis', description: 'Sexually Transmitted Infection' },
  { type: 'infectious', name: 'Malaria', description: 'Malaria (within 3 years)' },
  { type: 'infectious', name: 'Tuberculosis', description: 'Active TB' },
  { type: 'infectious', name: 'COVID-19', description: 'Active COVID-19 infection' },
  { type: 'cardiovascular', name: 'Heart Disease', description: 'Coronary artery disease, heart attack' },
  { type: 'cardiovascular', name: 'High Blood Pressure', description: 'Uncontrolled hypertension' },
  { type: 'cardiovascular', name: 'Stroke', description: 'Cerebrovascular accident' },
  { type: 'cardiovascular', name: 'Heart Surgery', description: 'Recent heart surgery' },
  { type: 'blood', name: 'Anemia', description: 'Severe iron deficiency anemia' },
  { type: 'blood', name: 'Blood Clotting Disorder', description: 'Hemophilia, bleeding disorders' },
  { type: 'blood', name: 'Blood Cancer', description: 'Leukemia, lymphoma, myeloma' },
  { type: 'blood', name: 'Sickle Cell Disease', description: 'Sickle cell anemia' },
  { type: 'blood', name: 'Thalassemia', description: 'Thalassemia major' },
  { type: 'diabetes', name: 'Type 1 Diabetes', description: 'Insulin-dependent diabetes' },
  { type: 'diabetes', name: 'Type 2 Diabetes', description: 'Non-insulin dependent diabetes (uncontrolled)' },
  { type: 'diabetes', name: 'Diabetic Complications', description: 'Kidney, eye, nerve damage' },
  { type: 'cancer', name: 'Active Cancer', description: 'Currently undergoing treatment' },
  { type: 'cancer', name: 'Cancer History', description: 'History of certain cancers' },
  { type: 'neurological', name: 'Epilepsy', description: 'Seizure disorders' },
  { type: 'neurological', name: 'Multiple Sclerosis', description: 'MS' },
  { type: 'neurological', name: 'Parkinson\'s Disease', description: 'Neurodegenerative disorder' },
  { type: 'kidney', name: 'Kidney Disease', description: 'Chronic kidney disease' },
  { type: 'kidney', name: 'Dialysis', description: 'Kidney dialysis' },
  { type: 'liver', name: 'Liver Disease', description: 'Cirrhosis, hepatitis' },
  { type: 'liver', name: 'Liver Transplant', description: 'Previous liver transplant' },
  { type: 'respiratory', name: 'Severe Asthma', description: 'Uncontrolled severe asthma' },
  { type: 'respiratory', name: 'COPD', description: 'Chronic Obstructive Pulmonary Disease' },
  { type: 'autoimmune', name: 'Lupus', description: 'Systemic Lupus Erythematosus' },
  { type: 'autoimmune', name: 'Rheumatoid Arthritis', description: 'Severe rheumatoid arthritis' },
  { type: 'autoimmune', name: 'Crohn\'s Disease', description: 'Inflammatory bowel disease' },
  { type: 'mental', name: 'Severe Depression', description: 'Requiring hospitalization' },
  { type: 'mental', name: 'Bipolar Disorder', description: 'Severe bipolar disorder' },
  { type: 'mental', name: 'Schizophrenia', description: 'Schizophrenia' },
  { type: 'pregnancy', name: 'Pregnancy', description: 'Currently pregnant' },
  { type: 'pregnancy', name: 'Recent Childbirth', description: 'Within 6 months' },
  { type: 'pregnancy', name: 'Breastfeeding', description: 'Currently breastfeeding' },
  { type: 'medication', name: 'Blood Thinners', description: 'Warfarin, heparin, etc.' },
  { type: 'medication', name: 'Immunosuppressants', description: 'Steroids, chemotherapy' },
  { type: 'medication', name: 'Recent Vaccination', description: 'Within 2 weeks' },
  { type: 'surgery', name: 'Recent Surgery', description: 'Within 3 months' },
  { type: 'surgery', name: 'Dental Surgery', description: 'Within 24 hours' },
  { type: 'surgery', name: 'Tattoo/Piercing', description: 'Within 3 months' },
  { type: 'travel', name: 'International Travel', description: 'To high-risk areas' },
  { type: 'travel', name: 'Malaria Endemic Area', description: 'Within 3 years' },
  { type: 'other', name: 'Weight Issues', description: 'Underweight (BMI < 18.5) or severely overweight' },
  { type: 'other', name: 'Age Restrictions', description: 'Under 18 or over 65' },
  { type: 'other', name: 'Recent Blood Donation', description: 'Within 56 days' }
];

// GET /api/kyc/health-issues : get list of health issues
router.get('/health-issues', (req, res) => {
  res.json(HEALTH_ISSUES);
});

// GET /api/kyc/status : get KYC completion status
router.get('/status', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('kyc trustScore');
    res.json({ 
      isCompleted: user.kyc.isCompleted,
      kyc: user.kyc,
      trustScore: user.trustScore
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/kyc/trustscore : get TrustScore and leaderboard
router.get('/trustscore', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('trustScore kyc');
    
    // Get top 10 users by TrustScore
    const leaderboard = await User.find({ 'kyc.isCompleted': true })
      .select('name trustScore profile.profilePhoto')
      .sort({ 'trustScore.score': -1 })
      .limit(10);

    res.json({
      userTrustScore: user.trustScore,
      leaderboard: leaderboard
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/kyc/complete : complete KYC process
router.post('/complete', verifyToken, upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'aadharCardImage', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('KYC Complete Request Body:', req.body);
    console.log('KYC Complete Request Files:', req.files);
    
    const { 
      aadharNumber, 
      lifestyleHabits, 
      healthIssues,
      age
    } = req.body;

    if (!aadharNumber) {
      return res.status(400).json({ message: 'Aadhar number is required' });
    }

    // Parse JSON strings if they come as strings
    let parsedLifestyleHabits;
    let parsedHealthIssues;
    
    try {
      parsedLifestyleHabits = typeof lifestyleHabits === 'string' 
        ? JSON.parse(lifestyleHabits) 
        : lifestyleHabits;
    } catch (e) {
      console.error('Error parsing lifestyleHabits:', e);
      parsedLifestyleHabits = {};
    }
    
    try {
      parsedHealthIssues = typeof healthIssues === 'string' 
        ? JSON.parse(healthIssues) 
        : healthIssues;
    } catch (e) {
      console.error('Error parsing healthIssues:', e);
      parsedHealthIssues = [];
    }

    // Prepare update data
    const updateData = {
      'kyc.isCompleted': true,
      'kyc.aadharNumber': aadharNumber,
      'kyc.age': age ? parseInt(age) : null,
      'kyc.lifestyleHabits': parsedLifestyleHabits,
      'kyc.healthIssues': parsedHealthIssues,
      'kyc.completedAt': new Date()
    };

    // Add file paths if uploaded
    if (req.files.profilePhoto) {
      updateData['profile.profilePhoto'] = `/uploads/${req.files.profilePhoto[0].filename}`;
    }
    
    if (req.files.aadharCardImage) {
      updateData['kyc.aadharCardImage'] = `/uploads/${req.files.aadharCardImage[0].filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.userId, 
      updateData,
      { new: true }
    ).select('kyc profile trustScore');

    // Update TrustScore after KYC completion
    user.updateTrustScore();
    await user.save();

    res.json({
      message: 'KYC completed successfully',
      kyc: user.kyc,
      profile: user.profile,
      trustScore: user.trustScore
    });
  } catch (error) {
    console.error('KYC completion error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
