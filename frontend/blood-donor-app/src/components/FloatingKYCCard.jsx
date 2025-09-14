import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useFlashCard } from '../contexts/FlashCardContext';

export default function FloatingKYCCard({ isVisible, onClose }) {
  const [kycStatus, setKycStatus] = useState({ isCompleted: false });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showError } = useFlashCard();

  useEffect(() => {
    if (isVisible) {
      fetchKycStatus();
    }
  }, [isVisible]);

  const fetchKycStatus = async () => {
    try {
      const response = await API.get('/kyc/status');
      setKycStatus(response.data);
      if (response.data.isCompleted) {
        onClose(); // Hide card if KYC is completed
      }
    } catch (error) {
      console.error('Error fetching KYC status:', error);
      showError('Failed to load KYC status');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteKYC = () => {
    onClose();
    navigate('/kyc');
  };

  const handleDismiss = () => {
    onClose();
    // Store dismissal in localStorage to not show again for this session
    localStorage.setItem('kycCardDismissed', 'true');
  };

  if (!isVisible || loading || kycStatus.isCompleted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 transform transition-all duration-300 hover:scale-105">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Complete Your KYC</h3>
              <p className="text-sm text-gray-600">Become a verified donor</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">
            Complete your KYC verification to:
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Build trust in the community
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Access all donor features
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Get verified donor badge
            </li>
          </ul>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleDismiss}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            Later
          </button>
          <button
            onClick={handleCompleteKYC}
            className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 font-medium"
          >
            Complete Now
          </button>
        </div>
      </div>
    </div>
  );
}
