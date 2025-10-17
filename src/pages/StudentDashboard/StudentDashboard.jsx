import React, { useState } from 'react';
import QuestionsSection from './components/QuestionsSection';
import AnswersSection from './components/AnswersSection';
import LeaderboardSection from './components/LeaderboardSection';
import ReportsSection from './components/ReportsSection';
import { AppContent } from '../../context/AppContext';
import { useContext } from 'react';

const StudentDashboard = () => {
  const { userData } = useContext(AppContent);
  const [activeTab, setActiveTab] = useState('questions');

  const tabs = [
    { id: 'questions', label: 'Questions' },
    { id: 'answers', label: 'Answers' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'reports', label: 'My Reports' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      {/* <Header /> */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {userData?.name}</h1>
          <p className="text-gray-600">Your Points: {userData?.points || 0}</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-900 text-white'
                  : 'bg-white text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-indigo-900 hover:text-white border border-indigo-500 hover:border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'questions' && <QuestionsSection />}
          {activeTab === 'answers' && <AnswersSection />}
          {activeTab === 'leaderboard' && <LeaderboardSection />}
          {activeTab === 'reports' && <ReportsSection />}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;