const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  roles: { type: [String], enum: ['donor', 'requester', 'admin'], default: ['requester'] },
  isActive: { type: Boolean, default: true },
  profile: {
    dateOfBirth: Date,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    address: String,
    profilePhoto: String, // URL to uploaded profile photo
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },
  kyc: {
    isCompleted: { type: Boolean, default: false },
    aadharNumber: String,
    age: { type: Number, min: 18, max: 65 },
    aadharCardImage: String, // URL to uploaded Aadhar card image
    lifestyleHabits: {
      smokes: { type: Boolean, default: false },
      drinks: { type: Boolean, default: false },
      tobaccoConsumption: { type: Boolean, default: false }
    },
    healthIssues: [{
      type: String,
      name: String,
      description: String
    }],
    completedAt: Date
  },
  trustScore: {
    score: { type: Number, default: 0 },
    level: { type: String, default: 'New Donor' },
    badges: [{
      name: { type: String, required: true },
      description: String,
      earnedAt: { type: Date, default: Date.now },
      icon: String
    }],
    bloodDonations: { type: Number, default: 0 },
    bloodRequestsAccepted: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Update updatedAt before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Calculate TrustScore and update badges
UserSchema.methods.updateTrustScore = function() {
  let score = 0;
  const badges = [];
  
  // Base score for KYC completion
  if (this.kyc.isCompleted) {
    score += 50;
    badges.push({
      name: 'Verified Donor',
      description: 'Completed KYC verification',
      icon: '✅'
    });
  }
  
  // Score for blood donations
  score += this.trustScore.bloodDonations * 30;
  if (this.trustScore.bloodDonations >= 1) {
    badges.push({
      name: 'Life Saver',
      description: 'Donated blood at least once',
      icon: '🩸'
    });
  }
  if (this.trustScore.bloodDonations >= 5) {
    badges.push({
      name: 'Hero Donor',
      description: 'Donated blood 5+ times',
      icon: '🏆'
    });
  }
  
  // Score for accepting blood requests
  score += this.trustScore.bloodRequestsAccepted * 20;
  if (this.trustScore.bloodRequestsAccepted >= 1) {
    badges.push({
      name: 'Helper',
      description: 'Helped someone in need',
      icon: '🤝'
    });
  }
  
  // Determine level based on score
  let level = 'New Donor';
  if (score >= 200) level = 'Elite Donor';
  else if (score >= 150) level = 'Expert Donor';
  else if (score >= 100) level = 'Trusted Donor';
  else if (score >= 50) level = 'Verified Donor';
  
  this.trustScore.score = score;
  this.trustScore.level = level;
  this.trustScore.badges = badges;
  this.trustScore.lastUpdated = new Date();
  
  return this.trustScore;
};

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user has specific role
UserSchema.methods.hasRole = function(role) {
  return this.roles.includes(role);
};

// Add role to user
UserSchema.methods.addRole = function(role) {
  if (!this.roles.includes(role)) {
    this.roles.push(role);
  }
  return this.save();
};

module.exports = mongoose.model('User', UserSchema);
