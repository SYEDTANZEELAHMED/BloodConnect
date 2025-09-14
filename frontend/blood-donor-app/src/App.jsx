import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { FlashCardProvider } from "./contexts/FlashCardContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RegisterDonor from "./pages/RegisterDonor";
import RequestBlood from "./pages/RequestBlood";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import KYC from "./pages/KYC";
import KYCPopup from "./components/KYCPopup";
import UserProfile from "./pages/UserProfile";
import FloatingKYCCard from "./components/FloatingKYCCard";
import DonorProfile from "./pages/DonorProfile";
import MyRequests from "./pages/MyRequests";

function Home() {
  const [showKYCPopup, setShowKYCPopup] = React.useState(false);
  const [showFloatingKYC, setShowFloatingKYC] = React.useState(false);
  const [stats, setStats] = React.useState({
    livesSaved: 0,
    activeDonors: 0,
    citiesCovered: 0,
    totalUsers: 0
  });

  React.useEffect(() => {
    // Fetch dashboard stats
    fetchStats();
    
    // Show KYC popup after 2 seconds if user is logged in
    const timer = setTimeout(() => {
      const token = localStorage.getItem('token');
      const kycCardDismissed = localStorage.getItem('kycCardDismissed');
      
      if (token) {
        if (kycCardDismissed) {
          // Show floating card instead of popup
          setShowFloatingKYC(true);
        } else {
          setShowKYCPopup(true);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stats/dashboard');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-red-600 mb-6 leading-tight">
            Connecting Hearts, Saving Lives
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            We bridge the gap between blood donors and patients in need, creating a lifeline 
            that connects communities and saves precious lives every day. Join our mission to 
            make blood donation accessible, safe, and impactful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition duration-300 shadow-lg hover:shadow-xl">
              Become a Donor
            </Link>
            <Link to="/request" className="bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-red-600 hover:bg-red-50 transition duration-300 shadow-lg hover:shadow-xl">
              Request Blood
            </Link>
          </div>
        </div>
      </section>

      {/* Our Work Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our Work</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every day, we facilitate life-saving connections through our comprehensive blood donation platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Emergency Response</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Our rapid response system connects patients with compatible donors within minutes, 
                ensuring critical blood needs are met when every second counts.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Community Building</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                We foster a strong community of regular donors and volunteers who understand 
                the profound impact of their life-saving contributions to society.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Safe & Verified</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Every donor is carefully screened and verified, ensuring the highest safety 
                standards while maintaining a seamless and trustworthy donation experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-pink-600">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">{stats.livesSaved}</div>
              <div className="text-lg opacity-90">Lives Saved</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">{stats.activeDonors}</div>
              <div className="text-lg opacity-90">Active Donors</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">{stats.citiesCovered}</div>
              <div className="text-lg opacity-90">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-90">Emergency Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of heroes who are saving lives every day through blood donation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition duration-300 shadow-lg">
              Get Started Today
            </Link>
            <Link to="/request" className="bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-red-600 hover:bg-red-50 transition duration-300 shadow-lg">
              Need Blood Now?
            </Link>
          </div>
        </div>
      </section>
      
      {/* KYC Popup */}
      <KYCPopup 
        isOpen={showKYCPopup} 
        onClose={() => {
          setShowKYCPopup(false);
          // Show floating card after popup is dismissed
          setTimeout(() => setShowFloatingKYC(true), 1000);
        }} 
      />
      
      {/* Floating KYC Card */}
      <FloatingKYCCard 
        isVisible={showFloatingKYC} 
        onClose={() => setShowFloatingKYC(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FlashCardProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              <Route path="/register" element={<RegisterDonor />} />
              <Route path="/request" element={<RequestBlood />} />
              <Route path="/kyc" element={<KYC />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/donor/:donorId" element={<DonorProfile />} />
              <Route path="/my-requests" element={<MyRequests />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </FlashCardProvider>
    </AuthProvider>
  );
}