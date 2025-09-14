import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useFlashCard } from '../contexts/FlashCardContext';

export default function KYC() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useFlashCard();
  const [step, setStep] = useState(1);
  const [healthIssues, setHealthIssues] = useState([]);
  const [form, setForm] = useState({
    aadharNumber: '',
    age: '',
    profilePhoto: null,
    aadharCardImage: null,
    lifestyleHabits: {
      smokes: false,
      drinks: false,
      tobaccoConsumption: false
    },
    healthIssues: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHealthIssues();
  }, []);

  const fetchHealthIssues = async () => {
    try {
      const response = await API.get('/kyc/health-issues');
      setHealthIssues(response.data);
    } catch (error) {
      console.error('Error fetching health issues:', error);
    }
  };

  const handleFileChange = (field, file) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError('Please select an image file (PNG or JPG)');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showError('File size must be less than 5MB');
        return;
      }
      
      setForm({ ...form, [field]: file });
      setError('');
    }
  };

  const handleLifestyleChange = (habit, value) => {
    setForm({
      ...form,
      lifestyleHabits: {
        ...form.lifestyleHabits,
        [habit]: value === 'yes'
      }
    });
  };

  const handleHealthIssueChange = (issueId, checked) => {
    if (checked) {
      setForm({
        ...form,
        healthIssues: [...form.healthIssues, healthIssues[issueId]]
      });
    } else {
      setForm({
        ...form,
        healthIssues: form.healthIssues.filter((_, index) => index !== issueId)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('aadharNumber', form.aadharNumber);
      formData.append('age', form.age);
      formData.append('lifestyleHabits', JSON.stringify(form.lifestyleHabits));
      formData.append('healthIssues', JSON.stringify(form.healthIssues));
      
      if (form.profilePhoto) {
        formData.append('profilePhoto', form.profilePhoto);
      }
      if (form.aadharCardImage) {
        formData.append('aadharCardImage', form.aadharCardImage);
      }

      await API.post('/kyc/complete', formData);

      showSuccess('KYC completed successfully! You are now a verified donor.');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to complete KYC');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!form.aadharNumber || !form.age || !form.profilePhoto)) {
      showError('Please fill Aadhar number, age and upload profile photo');
      return;
    }
    if (step === 2 && !form.aadharCardImage) {
      showError('Please upload Aadhar card image');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">Complete Your KYC</h1>
          <p className="text-gray-600">Become a trustworthy donor by completing your verification</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-16 h-1 ${step > stepNum ? 'bg-red-600' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 text-sm text-gray-600">
            <span className={step >= 1 ? 'text-red-600 font-medium' : ''}>Profile Photo</span>
            <span className={`mx-4 ${step >= 2 ? 'text-red-600 font-medium' : ''}`}>Aadhar Card</span>
            <span className={`mx-4 ${step >= 3 ? 'text-red-600 font-medium' : ''}`}>Lifestyle</span>
            <span className={step >= 4 ? 'text-red-600 font-medium' : ''}>Health Issues</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Step 1: Profile Photo and Aadhar Number */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 1: Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhar Card Number *
                </label>
                <input
                  type="text"
                  value={form.aadharNumber}
                  onChange={(e) => setForm({ ...form, aadharNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter 12-digit Aadhar number"
                  maxLength="12"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <select
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select your age</option>
                  {Array.from({ length: 48 }, (_, i) => i + 18).map(age => (
                    <option key={age} value={age}>{age} years</option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">Age range: 18-65 years (blood donation eligibility)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Your Profile Photo *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('profilePhoto', e.target.files[0])}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">PNG or JPG format, max 5MB</p>
              </div>
            </div>
          )}

          {/* Step 2: Aadhar Card Image */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 2: Aadhar Card Verification</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Aadhar Card Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('aadharCardImage', e.target.files[0])}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Upload clear image of your Aadhar card (PNG or JPG, max 5MB)</p>
              </div>
            </div>
          )}

          {/* Step 3: Lifestyle Habits */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 3: Lifestyle Habits</h2>
              <p className="text-gray-600 mb-6">Please answer these questions honestly. This helps us ensure blood safety.</p>
              
              <div className="space-y-4">
                {[
                  { key: 'smokes', question: 'Do you smoke?' },
                  { key: 'drinks', question: 'Do you drink alcohol?' },
                  { key: 'tobaccoConsumption', question: 'Do you consume any form of tobacco?' }
                ].map(({ key, question }) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-3">{question}</h3>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={key}
                          value="yes"
                          checked={form.lifestyleHabits[key] === true}
                          onChange={(e) => handleLifestyleChange(key, e.target.value)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={key}
                          value="no"
                          checked={form.lifestyleHabits[key] === false}
                          onChange={(e) => handleLifestyleChange(key, e.target.value)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Health Issues */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 4: Health Background</h2>
              <p className="text-gray-600 mb-6">Please select any health conditions that apply to you. This helps us determine your eligibility for blood donation.</p>
              
              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {healthIssues.map((issue, index) => (
                    <label key={index} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={form.healthIssues.some(selected => selected.name === issue.name)}
                        onChange={(e) => handleHealthIssueChange(index, e.target.checked)}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium text-gray-800">{issue.name}</div>
                        <div className="text-sm text-gray-600">{issue.description}</div>
                        <div className="text-xs text-gray-500 capitalize">{issue.type}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Completing KYC...' : 'Complete KYC'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
