import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useFlashCard } from '../contexts/FlashCardContext';

export default function MyRequests() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showError } = useFlashCard();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyRequests();
  }, [user, navigate]);

  const fetchMyRequests = async () => {
    try {
      const response = await API.get('/requests/my-requests');
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      showError('Failed to load your requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return '✅';
      case 'rejected':
        return '❌';
      case 'pending':
        return '⏳';
      case 'completed':
        return '🎉';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">My Blood Requests</h1>
          <p className="text-gray-600">Track the status of your blood donation requests</p>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Requests Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't sent any blood requests yet. Start by searching for donors.
            </p>
            <button
              onClick={() => navigate('/request')}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-200 font-medium"
            >
              Search for Donors
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div key={request._id} className="bg-white rounded-2xl shadow-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold text-lg">🩸</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        {request.donorId?.name || 'Unknown Donor'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Blood Group: {request.donorId?.bloodGroup || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      <span>{getStatusIcon(request.status)}</span>
                      <span className="capitalize">{request.status}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Your Message:</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {request.message}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Donor Contact:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span>📞</span>
                        <a 
                          href={`tel:${request.donorId?.phone}`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {request.donorId?.phone || 'Not available'}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span className="text-gray-600">
                          {request.donorId?.city || 'Location not specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {request.status === 'accepted' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-600">✅</span>
                      <h4 className="font-semibold text-green-800">Request Accepted!</h4>
                    </div>
                    <p className="text-green-700 text-sm">
                      Great news! The donor has accepted your request. You can now contact them directly using the phone number above.
                    </p>
                    {request.respondedAt && (
                      <p className="text-green-600 text-xs mt-2">
                        Accepted on: {new Date(request.respondedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {request.status === 'rejected' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-red-600">❌</span>
                      <h4 className="font-semibold text-red-800">Request Declined</h4>
                    </div>
                    <p className="text-red-700 text-sm">
                      Unfortunately, this donor was unable to help at this time. Don't worry, you can search for other available donors.
                    </p>
                    {request.respondedAt && (
                      <p className="text-red-600 text-xs mt-2">
                        Declined on: {new Date(request.respondedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {request.status === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-600">⏳</span>
                      <h4 className="font-semibold text-yellow-800">Waiting for Response</h4>
                    </div>
                    <p className="text-yellow-700 text-sm">
                      Your request has been sent and is waiting for the donor's response. You'll be notified once they respond.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
