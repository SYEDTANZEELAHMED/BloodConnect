import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlashCard } from '../contexts/FlashCardContext';

export default function DonorCard({ donor }) {
  const navigate = useNavigate();
  const { showSuccess, showError } = useFlashCard();
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(donor.phone);
      showSuccess('Phone number copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      showError('Failed to copy phone number');
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

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-6 mb-4 border border-gray-100 cursor-pointer"
         onClick={() => navigate(`/donor/${donor._id}`)}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold text-lg">🩸</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-gray-800">{donor.name}</h3>
                {donor.isKycVerified && (
                  <span className="text-green-600 text-sm" title="KYC Verified">✅</span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {donor.bloodGroup}
                </span>
                <span className="text-sm text-gray-500">Blood Group</span>
              </div>
              
              {/* TrustScore Badge */}
              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(donor.trustScore?.level || 'New Donor')}`}>
                  {donor.trustScore?.level || 'New Donor'}
                </div>
                <div className={`text-sm font-bold ${getScoreColor(donor.trustScore?.score || 0)}`}>
                  {donor.trustScore?.score || 0} pts
                </div>
              </div>
              
              {/* Top Badge */}
              {donor.trustScore?.badges && donor.trustScore.badges.length > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  {donor.trustScore.badges.slice(0, 2).map((badge, index) => (
                    <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                      <span>{badge.icon}</span>
                      <span>{badge.name}</span>
                    </span>
                  ))}
                  {donor.trustScore.badges.length > 2 && (
                    <span className="text-xs text-gray-500">+{donor.trustScore.badges.length - 2} more</span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{donor.city || 'Location not specified'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📞</span>
              <span>{donor.phone}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 ml-4">
          <a 
            href={`tel:${donor.phone}`} 
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 font-medium text-center shadow-md hover:shadow-lg"
          >
            📞 Call Now
          </a>
          <button 
            onClick={copyToClipboard} 
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200 font-medium shadow-md hover:shadow-lg"
          >
            📋 Copy
          </button>
        </div>
      </div>
    </div>
  );
}
