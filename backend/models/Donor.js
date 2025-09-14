const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  bloodGroup: { 
    type: String, 
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  available: { type: Boolean, default: true },
  lastDonated: { type: Date },
  city: { type: String, required: true },
  address: { type: String },
  aadharNumber: { type: String },
  aadharCardImage: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  emergencyContact: {
    name: String,
    phone: String
  },
  medicalHistory: {
    hasDiseases: { type: Boolean, default: false },
    diseases: [String],
    medications: [String]
  },
  donationHistory: [{
    date: Date,
    location: String,
    bloodType: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

DonorSchema.index({ location: '2dsphere' });
DonorSchema.index({ bloodGroup: 1, available: 1 });
DonorSchema.index({ userId: 1 });

module.exports = mongoose.model('Donor', DonorSchema);
