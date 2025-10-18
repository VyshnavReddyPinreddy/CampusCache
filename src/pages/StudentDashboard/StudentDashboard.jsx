import React from 'react';
import QuestionsSection from './components/QuestionsSection';
import { AppContent } from '../../context/AppContext';
import { useContext, useState } from 'react';
import LeaderboardSection from './components/LeaderboardSection';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { userData, backendUrl } = useContext(AppContent);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      const profileMenu = document.getElementById('profile-menu');
      const profileButton = document.getElementById('profile-button');
      if (showDropdown && profileMenu && !profileMenu.contains(event.target) && !profileButton.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if(data.success){
        toast.success("Logged out successfully!");
        // Redirect to login page or homepage
        window.location.href = '/';
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed!");
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {userData?.name}</h1>
          <div className="relative">
            <button 
              id="profile-button"
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              {userData?.name?.[0]?.toUpperCase()}
            </button>
            {showDropdown && (
              <div id="profile-menu" className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-20">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLeaderboard(true);
                    setShowDropdown(false);
                  }} 
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-50"
                >
                  Leaderboard
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/');
                    setShowDropdown(false);
                  }} 
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-50"
                >
                  Go to Home
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }} 
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {showLeaderboard ? (
            <LeaderboardSection onClose={() => setShowLeaderboard(false)} />
          ) : (
            <QuestionsSection />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;