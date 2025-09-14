import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import API from "../utils/api";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDonor, setIsDonor] = useState(false);
  const [hasRequests, setHasRequests] = useState(false);

  useEffect(() => {
    if (user) {
      checkDonorStatus();
      checkRequestStatus();
    }
  }, [user]);

  const checkDonorStatus = async () => {
    try {
      const response = await API.get('/donors/status');
      setIsDonor(response.data.isDonor);
    } catch (error) {
      setIsDonor(false);
    }
  };

  const checkRequestStatus = async () => {
    try {
      const response = await API.get('/requests/my-requests');
      setHasRequests(response.data.requests && response.data.requests.length > 0);
    } catch (error) {
      setHasRequests(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-lg">
      <Link to="/" className="text-2xl font-bold text-red-600 hover:text-red-700">
        BloodConnect ❤️
      </Link>
      
      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <span className="text-gray-700">Welcome, {user.name}</span>
            <Link to="/profile" className="text-gray-600 hover:text-gray-700 font-medium transition duration-200">
              Profile
            </Link>
            {!isDonor && (
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium transition duration-200">
                Register as Donor
              </Link>
            )}
            <Link to="/request" className="text-red-600 hover:text-red-700 font-medium transition duration-200">
              Request Blood
            </Link>
            {hasRequests && (
              <Link to="/my-requests" className="text-purple-600 hover:text-purple-700 font-medium transition duration-200">
                My Requests
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium transition duration-200">
              Register as Donor
            </Link>
            <Link to="/request" className="text-red-600 hover:text-red-700 font-medium transition duration-200">
              Request Blood
            </Link>
            <Link to="/login" className="text-gray-600 hover:text-gray-700 font-medium transition duration-200">
              Login
            </Link>
            <Link to="/signup" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
