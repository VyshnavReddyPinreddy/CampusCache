import React, { useState, useEffect, useContext } from 'react';
import { AppContent } from '../../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const LeaderboardSection = () => {
  const { backendUrl, userData } = useContext(AppContent);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/points/fetch-points`);
      if (data.success) {
        setLeaderboard(data.leaderboard || []);
        
        // Find user's rank if not in top 10
        if (userData?._id && !data.leaderboard.find(user => user._id === userData._id)) {
          const { data: rankData } = await axios.get(`${backendUrl}/api/points/fetch-user-points`, {
            data: { userId: userData._id }
          });
          if (rankData.success) {
            setUserRank(rankData.rank);
          }
        }
      }
    } catch (error) {
      toast.error('Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Leaderboard</h2>
      
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboard.map((user, index) => (
              <tr 
                key={user._id}
                className={user._id === userData?._id ? 'bg-indigo-50' : ''}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {index + 1}
                    {index < 3 && (
                      <span className="ml-2">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.points}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {userRank && userRank > 10 && (
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
          <h3 className="font-medium text-gray-900">Your Position</h3>
          <p className="text-gray-600">
            You are currently ranked #{userRank} with {userData?.points} points
          </p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardSection;