import React, { useState, useEffect, useContext } from 'react';
import { AppContent } from '../../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import AnswerList from './AnswerList';

const AnswersSection = () => {
  const { backendUrl, userData } = useContext(AppContent);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('my'); // 'my' only since this is user's answers section

  const fetchAnswers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/answer/user-answers`, {
        data: { userId: userData?._id }
      });
      if (data.success) {
        setAnswers(data.answers || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch answers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?._id) {
      fetchAnswers();
    }
  }, [userData]);

  const handleDelete = async (answerId) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/answers/${answerId}`);
      if (data.success) {
        toast.success('Answer deleted successfully');
        fetchAnswers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete answer');
    }
  };

  const handleReport = async (answerId, reason) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/reports`, {
        contentId: answerId,
        contentType: 'Answer',
        reason,
        description: reason
      });
      if (data.success) {
        toast.success('Answer reported successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to report answer');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Your Answers</h2>
      <AnswerList
        answers={answers}
        loading={loading}
        onDelete={handleDelete}
        onReport={handleReport}
        isUserAnswer={(answer) => answer.author === userData?._id}
      />
    </div>
  );
};

export default AnswersSection;