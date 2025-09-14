import React, { useState } from "react";
import API from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { useFlashCard } from "../contexts/FlashCardContext";

function RegisterDonor() {
  const { user } = useAuth();
  const { showSuccess, showError } = useFlashCard();
  const [form, setForm] = useState({
    name: "",
    bloodGroup: "",
    phone: "",
    lat: "",
    lng: "",
    city: "",
    address: "",
    aadharNumber: "",
    aadharCardImage: null,
    emergencyContact: {
      name: "",
      phone: ""
    },
    medicalHistory: {
      hasDiseases: false,
      diseases: [],
      medications: []
    }
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
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
      
      setForm({ ...form, aadharCardImage: file });
    }
  };

  // ✅ Use browser geolocation
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      showError("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({
          ...form,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        showSuccess("Location captured successfully!");
      },
      () => showError("Failed to get location. Please allow location access.")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      showError("Please login first to register as a donor.");
      return;
    }

    try {
      const formData = new FormData();
      
      // Add all form fields
      Object.keys(form).forEach(key => {
        if (key === 'emergencyContact' || key === 'medicalHistory') {
          formData.append(key, JSON.stringify(form[key]));
        } else if (key === 'aadharCardImage' && form[key]) {
          formData.append('aadharCardImage', form[key]);
        } else if (key !== 'aadharCardImage') {
          formData.append(key, form[key]);
        }
      });

      const response = await API.post("/donors", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      showSuccess("Donor registered successfully!");
      setForm({ 
        name: "", 
        bloodGroup: "", 
        phone: "", 
        lat: "", 
        lng: "", 
        city: "",
        address: "",
        aadharNumber: "",
        aadharCardImage: null,
        emergencyContact: { name: "", phone: "" },
        medicalHistory: { hasDiseases: false, diseases: [], medications: [] }
      });
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Failed to register donor. Please try again.";
      showError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex justify-center items-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">Become a Hero</h1>
          <p className="text-gray-600">Join our community of life-savers</p>
        </div>
        
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-2xl p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group
            </label>
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
              required
            >
              <option value="">Select your blood group</option>
              {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City / Area
            </label>
            <input
              type="text"
              name="city"
              placeholder="Enter your city or area"
              value={form.city}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              placeholder="Enter your full address"
              value={form.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aadhar Card Number
            </label>
            <input
              type="text"
              name="aadharNumber"
              placeholder="Enter 12-digit Aadhar number"
              value={form.aadharNumber}
              onChange={handleChange}
              maxLength="12"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Aadhar Card Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
            />
            <p className="text-sm text-gray-500 mt-1">PNG or JPG format, max 5MB</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Contact Name
            </label>
            <input
              type="text"
              name="emergencyContactName"
              placeholder="Emergency contact name"
              value={form.emergencyContact.name}
              onChange={(e) => setForm({
                ...form,
                emergencyContact: { ...form.emergencyContact, name: e.target.value }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Contact Phone
            </label>
            <input
              type="tel"
              name="emergencyContactPhone"
              placeholder="Emergency contact phone"
              value={form.emergencyContact.phone}
              onChange={(e) => setForm({
                ...form,
                emergencyContact: { ...form.emergencyContact, phone: e.target.value }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="space-y-3">
              <button
                type="button"
                onClick={useMyLocation}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 font-medium"
              >
                📍 Use My Current Location
              </button>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="lat"
                  placeholder="Latitude"
                  value={form.lat}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                />
                <input
                  type="text"
                  name="lng"
                  placeholder="Longitude"
                  value={form.lng}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            🩸 Register as Donor
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterDonor;
