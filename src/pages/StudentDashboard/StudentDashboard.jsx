import React from 'react';
import QuestionsSection from './components/QuestionsSection';
import { AppContent } from '../../context/AppContext';
import { useContext, useState } from 'react';
import LeaderboardSection from './components/LeaderboardSection';

const StudentDashboard = () => {
  const { userData } = useContext(AppContent);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {userData?.name}</h1>
          <div className="relative">
            <button 
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              {userData?.name?.[0]?.toUpperCase()}
            </button>
            {showLeaderboard && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-20">
                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-indigo-50">
                  Leaderboard
                </a>
                <a href="/logout" className="block px-4 py-2 text-gray-800 hover:bg-indigo-50">
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <QuestionsSection />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;