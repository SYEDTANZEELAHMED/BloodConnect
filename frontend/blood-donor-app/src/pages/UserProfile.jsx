import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useFlashCard } from '../contexts/FlashCardContext';
import TrustScoreCard from '../components/TrustScoreCard';

export default function UserProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showError } = useFlashCard();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await API.get('/kyc/status');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      showError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const getProfileImage = () => {
    if (profile?.kyc?.isCompleted && profile?.profile?.profilePhoto) {
      return `http://localhost:5000${profile.profile.profilePhoto}`;
    }
    return null;
  };

  const getBorderColor = () => {
    return profile?.kyc?.isCompleted ? 'border-green-500' : 'border-red-500';
  };

  const getStatusIcon = () => {
    if (profile?.kyc?.isCompleted) {
      return (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">User Profile</h1>
          <p className="text-gray-600">Review your account and KYC information</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>
            
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full border-4 ${getBorderColor()} overflow-hidden bg-gray-100 flex items-center justify-center`}>
                  {getProfileImage() ? (
                    <img 
                      src={getProfileImage()} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                {getStatusIcon()}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mt-4">{user?.name}</h3>
              <p className="text-gray-600">{user?.email}</p>
              <div className={`px-4 py-2 rounded-full text-sm font-medium mt-2 ${
                profile?.kyc?.isCompleted 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {profile?.kyc?.isCompleted ? 'KYC Verified' : 'KYC Pending'}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-700">Phone:</span>
                <span className="text-gray-600">{user?.phone || 'Not provided'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-700">Roles:</span>
                <span className="text-gray-600">{user?.roles?.join(', ') || 'User'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-700">Member Since:</span>
                <span className="text-gray-600">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>

            {!profile?.kyc?.isCompleted && (
              <div className="mt-6">
                <button
                  onClick={() => navigate('/kyc')}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-200 font-semibold"
                >
                  Complete KYC Verification
                </button>
              </div>
            )}
          </div>

          {/* KYC Details */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">KYC Details</h2>
            
            {profile?.kyc?.isCompleted ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Aadhar Number:</span>
                  <span className="text-gray-600">
                    {profile.kyc.aadharNumber ? 
                      `${profile.kyc.aadharNumber.slice(0, 4)}****${profile.kyc.aadharNumber.slice(-4)}` : 
                      'Not provided'
                    }
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Age:</span>
                  <span className="text-gray-600">{profile.kyc.age || 'Not provided'}</span>
                </div>

                <div className="py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700 block mb-2">Lifestyle Habits:</span>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Smokes:</span>
                      <span className={profile.kyc.lifestyleHabits?.smokes ? 'text-red-600' : 'text-green-600'}>
                        {profile.kyc.lifestyleHabits?.smokes ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Drinks:</span>
                      <span className={profile.kyc.lifestyleHabits?.drinks ? 'text-red-600' : 'text-green-600'}>
                        {profile.kyc.lifestyleHabits?.drinks ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tobacco:</span>
                      <span className={profile.kyc.lifestyleHabits?.tobaccoConsumption ? 'text-red-600' : 'text-green-600'}>
                        {profile.kyc.lifestyleHabits?.tobaccoConsumption ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700 block mb-2">Health Issues:</span>
                  {profile.kyc.healthIssues?.length > 0 ? (
                    <div className="space-y-1">
                      {profile.kyc.healthIssues.map((issue, index) => (
                        <div key={index} className="text-sm text-gray-600 bg-red-50 px-2 py-1 rounded">
                          {issue.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-green-600">No health issues reported</span>
                  )}
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-700">Completed:</span>
                  <span className="text-gray-600">
                    {profile.kyc.completedAt ? new Date(profile.kyc.completedAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">KYC Not Completed</h3>
                <p className="text-gray-600 mb-4">
                  Complete your KYC verification to become a trusted donor and access all features.
                </p>
                <button
                  onClick={() => navigate('/kyc')}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200"
                >
                  Complete KYC
                </button>
              </div>
            )}
          </div>

          {/* TrustScore Card */}
          <TrustScoreCard />
        </div>
      </div>
    </div>
  );
}
