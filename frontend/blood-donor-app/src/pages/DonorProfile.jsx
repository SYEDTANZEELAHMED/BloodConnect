import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useFlashCard } from '../contexts/FlashCardContext';

export default function DonorProfile() {
  const { donorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useFlashCard();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDonorProfile();
  }, [donorId, user, navigate]);

  const fetchDonorProfile = async () => {
    try {
      const response = await API.get(`/donors/${donorId}`);
      setDonor(response.data);
    } catch (error) {
      console.error('Error fetching donor profile:', error);
      showError('Failed to load donor profile');
      navigate('/request');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!requestMessage.trim()) {
      showError('Please enter a message for your request');
      return;
    }

    setRequesting(true);
    try {
      await API.post('/requests/create', {
        donorId: donorId,
        message: requestMessage,
        urgency: 'medium'
      });
      
      showSuccess('Blood request sent successfully!');
      setTimeout(() => navigate('/my-requests'), 2000);
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to send request');
    } finally {
      setRequesting(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 200) return 'text-purple-600';
    if (score >= 150) return 'text-blue-600';
    if (score >= 100) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getLevelColor = (level) => {
    if (level === 'Elite Donor') return 'bg-purple-100 text-purple-800';
    if (level === 'Expert Donor') return 'bg-blue-100 text-blue-800';
    if (level === 'Trusted Donor') return 'bg-green-100 text-green-800';
    if (level === 'Verified Donor') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading donor profile...</p>
        </div>
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Donor Not Found</h1>
          <button
            onClick={() => navigate('/request')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/request')}
            className="mb-4 text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
          >
            ← Back to Search
          </button>
          <h1 className="text-4xl font-bold text-red-600 mb-2">Donor Profile</h1>
          <p className="text-gray-600">Contact and request blood from this donor</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Donor Information */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Donor Information</h2>
            
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-red-600 font-bold text-2xl">🩸</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{donor.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-lg font-semibold">
                  {donor.bloodGroup}
                </span>
                {donor.isKycVerified && (
                  <span className="text-green-600 text-lg" title="KYC Verified">✅</span>
                )}
              </div>
              
              {/* TrustScore */}
              <div className="text-center mb-4">
                <div className={`text-3xl font-bold ${getScoreColor(donor.trustScore?.score || 0)} mb-2`}>
                  {donor.trustScore?.score || 0}
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(donor.trustScore?.level || 'New Donor')}`}>
                  {donor.trustScore?.level || 'New Donor'}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-700">Phone:</span>
                <a href={`tel:${donor.phone}`} className="text-blue-600 hover:text-blue-700 font-medium">
                  {donor.phone}
                </a>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-700">Location:</span>
                <span className="text-gray-600">{donor.city}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-700">Distance:</span>
                <span className="text-gray-600">{donor.distance} km</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-700">Available:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  donor.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {donor.available ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            {/* Badges */}
            {donor.trustScore?.badges && donor.trustScore.badges.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">Badges Earned</h4>
                <div className="flex flex-wrap gap-2">
                  {donor.trustScore.badges.map((badge, index) => (
                    <div key={index} className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="text-lg mr-2">{badge.icon}</span>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">{badge.name}</div>
                        <div className="text-xs text-gray-600">{badge.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Request Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Blood Request</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message *
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="4"
                  placeholder="Please describe your blood requirement and urgency..."
                  required
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Request Guidelines:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Be clear about your blood type requirement</li>
                  <li>• Mention the urgency of your need</li>
                  <li>• Provide your contact information</li>
                  <li>• Be respectful and polite in your message</li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => navigate('/request')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendRequest}
                  disabled={requesting || !donor.available}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {requesting ? 'Sending...' : 'Send Request'}
                </button>
              </div>

              {!donor.available && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-700 text-sm">
                    ⚠️ This donor is currently not available for blood donation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
