import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useFlashCard } from '../contexts/FlashCardContext';

export default function TrustScoreCard() {
  const [trustData, setTrustData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showError } = useFlashCard();

  useEffect(() => {
    fetchTrustScore();
  }, []);

  const fetchTrustScore = async () => {
    try {
      const response = await API.get('/kyc/trustscore');
      setTrustData(response.data);
    } catch (error) {
      console.error('Error fetching trust score:', error);
      showError('Failed to load trust score');
    } finally {
      setLoading(false);
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
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!trustData) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">TrustScore</h2>
        <div className="text-center py-8">
          <p className="text-gray-600">Unable to load trust score</p>
        </div>
      </div>
    );
  }

  const { userTrustScore, leaderboard } = trustData;

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your TrustScore</h2>
      
      {/* User's TrustScore */}
      <div className="text-center mb-8">
        <div className={`text-6xl font-bold ${getScoreColor(userTrustScore.score)} mb-2`}>
          {userTrustScore.score}
        </div>
        <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getLevelColor(userTrustScore.level)}`}>
          {userTrustScore.level}
        </div>
      </div>

      {/* Badges */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Badges Earned</h3>
        <div className="flex flex-wrap gap-2">
          {userTrustScore.badges && userTrustScore.badges.length > 0 ? (
            userTrustScore.badges.map((badge, index) => (
              <div key={index} className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                <span className="text-lg mr-2">{badge.icon}</span>
                <div>
                  <div className="font-medium text-gray-800 text-sm">{badge.name}</div>
                  <div className="text-xs text-gray-600">{badge.description}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-sm">No badges earned yet</div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{userTrustScore.bloodDonations}</div>
          <div className="text-sm text-gray-600">Blood Donations</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{userTrustScore.bloodRequestsAccepted}</div>
          <div className="text-sm text-gray-600">Requests Helped</div>
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Top Donors</h3>
          <button
            onClick={() => navigate('/leaderboard')}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-2">
          {leaderboard.slice(0, 3).map((user, index) => (
            <div key={user._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  {user.profile?.profilePhoto ? (
                    <img 
                      src={`http://localhost:5000${user.profile.profilePhoto}`} 
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-800 text-sm">{user.name}</div>
                  <div className="text-xs text-gray-600">{user.trustScore.level}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${getScoreColor(user.trustScore.score)}`}>
                  {user.trustScore.score}
                </div>
                <div className="text-xs text-gray-500">#{index + 1}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
