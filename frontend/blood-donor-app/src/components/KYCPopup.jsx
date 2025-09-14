import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useFlashCard } from '../contexts/FlashCardContext';

export default function KYCPopup({ isOpen, onClose }) {
  const [kycStatus, setKycStatus] = useState({ isCompleted: false });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showError } = useFlashCard();

  useEffect(() => {
    if (isOpen) {
      fetchKycStatus();
    }
  }, [isOpen]);

  const fetchKycStatus = async () => {
    try {
      const response = await API.get('/kyc/status');
      setKycStatus(response.data);
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

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen || loading) return null;

  // Don't show popup if KYC is already completed
  if (kycStatus.isCompleted) {
    onClose();
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Your KYC</h2>
          <p className="text-gray-600 mb-6">
            Become a trustworthy donor by completing your KYC verification. This helps build trust in our community and ensures blood safety.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">What you'll need:</h3>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              <li>• 12-digit Aadhar Card number</li>
              <li>• Clear photo of your Aadhar Card</li>
              <li>• Your current profile photo</li>
              <li>• Information about your lifestyle habits</li>
              <li>• Health background details</li>
            </ul>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Maybe Later
            </button>
            <button
              onClick={handleCompleteKYC}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Complete KYC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
