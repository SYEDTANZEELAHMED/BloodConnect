import React, { useState } from 'react';
import API from '../utils/api';
import MapView from '../components/MapView';
import DonorCard from '../components/DonorCard';
import { useAuth } from '../contexts/AuthContext';
import { useFlashCard } from '../contexts/FlashCardContext';

export default function RequestBlood() {
  const { user } = useAuth();
  const { showSuccess, showError } = useFlashCard();
  const [form, setForm] = useState({
    patientName: '',
    bloodGroupNeeded: '',
    urgency: 'high',
    contactPhone: '',
    lat: '',
    lng: '',
    city: '',
    address: '',
    hospitalName: '',
    doctorName: '',
    requiredUnits: 1,
    notes: '',
    radius: 1000
  });
  const [donors, setDonors] = useState([]);
  const [requestMade, setRequestMade] = useState(null);

  async function useMyLocation() {
    if (!navigator.geolocation) {
      showError('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setForm((f) => ({
          ...f,
          lat: p.coords.latitude,
          lng: p.coords.longitude
        }));
        showSuccess('Location captured successfully!');
      },
      () => showError('Allow location or enter coords manually')
    );
  }

  async function submit(e) {
    e.preventDefault();
    
    if (!user) {
      showError("Please login first to create a blood request.");
      return;
    }

    try {
      console.log('Submitting form data:', form);
      const res = await API.post('/donors/request', form);
      console.log('Response received:', res.data);
      setDonors(res.data.searchResults?.donors || []);
      setRequestMade(res.data.request);
      
      if ((res.data.searchResults?.donors || []).length === 0) {
        showError(
          'No donors nearby. Please expand radius or share request on social.'
        );
      } else {
        showSuccess(`Found ${res.data.searchResults?.donors?.length || 0} donors nearby!`);
      }
    } catch (err) {
      console.error('Request error:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.message || 'Failed to create request.';
      showError(errorMessage);
    }
  }

  // ✅ Safely convert to numbers or fallback to default Delhi coords
  const defaultCenter = [28.6139, 77.209];
  const userCenter = [
    form.lat ? Number(form.lat) : defaultCenter[0],
    form.lng ? Number(form.lng) : defaultCenter[1]
  ];

  // ✅ If donors exist, center on first donor
  const mapCenter =
    donors.length > 0
      ? [donors[0].lat, donors[0].lng]
      : userCenter;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">Emergency Blood Request</h1>
          <p className="text-gray-600">Find compatible donors in your area quickly</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <form onSubmit={submit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name
                </label>
                <input 
                  value={form.patientName} 
                  onChange={e=>setForm({...form,patientName:e.target.value})} 
                  placeholder="Enter patient's full name" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input 
                  value={form.contactPhone} 
                  onChange={e=>setForm({...form,contactPhone:e.target.value})} 
                  placeholder="Enter contact phone number" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200" 
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input 
                  value={form.city} 
                  onChange={e=>setForm({...form,city:e.target.value})} 
                  placeholder="Enter city" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200" 
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Units
                </label>
                <input 
                  type="number"
                  value={form.requiredUnits} 
                  onChange={e=>setForm({...form,requiredUnits:Number(e.target.value)})} 
                  placeholder="Number of units needed" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200" 
                  min="1"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital Name
                </label>
                <input 
                  value={form.hospitalName} 
                  onChange={e=>setForm({...form,hospitalName:e.target.value})} 
                  placeholder="Enter hospital name" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor Name
                </label>
                <input 
                  value={form.doctorName} 
                  onChange={e=>setForm({...form,doctorName:e.target.value})} 
                  placeholder="Enter doctor name" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input 
                value={form.address} 
                onChange={e=>setForm({...form,address:e.target.value})} 
                placeholder="Enter full address" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea 
                value={form.notes} 
                onChange={e=>setForm({...form,notes:e.target.value})} 
                placeholder="Additional notes about the request" 
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200" 
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group Needed
                </label>
                <select 
                  value={form.bloodGroupNeeded} 
                  onChange={e=>setForm({...form,bloodGroupNeeded:e.target.value})} 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                >
                  <option value="">Select blood group needed</option>
                  {['O-','O+','A-','A+','B-','B+','AB-','AB+'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level
                </label>
                <select 
                  value={form.urgency} 
                  onChange={e=>setForm({...form,urgency:e.target.value})} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                >
                  <option value="high">🚨 High Priority</option>
                  <option value="medium">⚠️ Medium Priority</option>
                  <option value="low">ℹ️ Low Priority</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Radius (in kilometers)
              </label>
              <div className="relative">
                <input 
                  value={form.radius} 
                  onChange={e=>setForm({...form, radius: Number(e.target.value)})} 
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200" 
                  placeholder="Enter radius in kilometers" 
                  type="number"
                  min="1"
                  max="100"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 text-sm">km</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Search within {form.radius} km of your location (default: 1000 km)
              </p>
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
                    value={form.lat} 
                    onChange={e=>setForm({...form,lat:e.target.value})} 
                    placeholder="Latitude" 
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200" 
                  />
                  <input 
                    value={form.lng} 
                    onChange={e=>setForm({...form,lng:e.target.value})} 
                    placeholder="Longitude" 
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200" 
                  />
                </div>
              </div>
            </div>

            <button className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 font-semibold text-lg shadow-lg hover:shadow-xl">
              🩸 Create Request & Find Donors
            </button>
          </form>
        </div>

        {requestMade && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-green-600 text-xl">✅</span>
              <div>
                <p className="font-semibold text-green-800">Request Created Successfully!</p>
                <p className="text-sm text-green-600">Request ID: {requestMade._id} • Found {donors.length} compatible donors</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Available Donors</h3>
            {donors.length > 0 ? (
              <div className="space-y-4">
                {donors.map(d => <DonorCard key={d._id} donor={d} />)}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <p className="text-gray-600 text-lg">No donors found in your area</p>
                <p className="text-gray-500 text-sm mt-2">Try increasing the search radius or check back later</p>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Donor Locations</h3>
            <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg" style={{ height: "500px", width: "100%" }}>
              <MapView 
                center={[form.lat || 28.6139, form.lng || 77.2090]} 
                donors={donors} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
