import React, { useState, useContext, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContent } from '../../../context/AppContext';

const QuestionList = ({ questions, loading, onDelete, onReport, isUserQuestion }) => {
  const { backendUrl } = useContext(AppContent);
  const [reportingQuestion, setReportingQuestion] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loadingAnswers, setLoadingAnswers] = useState({});
  const [answeringQuestion, setAnsweringQuestion] = useState(null);
  const [answerContent, setAnswerContent] = useState('');

  const handleReport = (questionId) => {
    // Require at least one word character to avoid empty/whitespace-only reasons
    if (!/\w+/.test(reportReason)) {
      toast.error('Provide at least one word for reason to report');
      return;
    }
    const reason = reportReason.trim();
    onReport(questionId, reason);
    setReportingQuestion(null);
    setReportReason('');
  };

  const handleAnswer = async (questionId) => {
    if (!answerContent.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/answer/create`, {
        questionId,
        content: answerContent.trim()
      });

      if (data.success) {
        toast.success('Answer posted successfully');
        setAnswerContent('');
        setAnsweringQuestion(null);
        // Update the answers list if answers are currently shown
        if (selectedQuestion === questionId) {
          const { data: newData } = await axios.get(`${backendUrl}/api/answer/question/${questionId}`);
          if (newData.success) {
            setAnswers(prev => ({ ...prev, [questionId]: newData.answers || [] }));
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post answer');
    }
  };

  const fetchAnswers = async (questionId) => {
    if (answers[questionId]) {
      setSelectedQuestion(selectedQuestion === questionId ? null : questionId);
      return;
    }

    setLoadingAnswers(prev => ({ ...prev, [questionId]: true }));
    try {
      const { data } = await axios.get(`${backendUrl}/api/answer/question/${questionId}`);
      if (data.success) {
        setAnswers(prev => ({ ...prev, [questionId]: data.answers || [] }));
        setSelectedQuestion(questionId);
      }
    } catch (error) {
      toast.error('Failed to fetch answers');
    } finally {
      setLoadingAnswers(prev => ({ ...prev, [questionId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading questions...</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No questions found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div key={question._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{question.title}</h3>
            <div className="flex items-center gap-2">
              {isUserQuestion(question) && (
                <button
                  onClick={() => onDelete(question._id)}
                  className="px-3 py-1.5 rounded-lg transition-all duration-200 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"
                >
                  Delete
                </button>
              )}
              {!isUserQuestion(question) && (
                <button
                  onClick={() => setReportingQuestion(question._id)}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                    reportingQuestion === question._id
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  Report
                </button>
              )}
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">{question.content}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
            <div>
              Posted by: {question.isAnonymous ? '-----' : question.author?.name || 'Unknown'}
            </div>
            <div>
              {format(new Date(question.createdAt), 'MMM d, yyyy')}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchAnswers(question._id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                selectedQuestion === question._id 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
              }`}
            >
              {selectedQuestion === question._id ? 'Hide Answers' : 'View Answers'}
              {loadingAnswers[question._id] && (
                <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
                  selectedQuestion === question._id ? 'border-white' : 'border-indigo-600'
                }`}></div>
              )}
            </button>
            <button
              onClick={() => setAnsweringQuestion(answeringQuestion === question._id ? null : question._id)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                answeringQuestion === question._id
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-green-100 text-green-600 hover:bg-green-200'
              }`}
            >
              {answeringQuestion === question._id ? 'Cancel Answer' : 'Answer'}
            </button>
          </div>

          {answeringQuestion === question._id && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <textarea
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="Write your answer here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                rows="3"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => {
                    setAnsweringQuestion(null);
                    setAnswerContent('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAnswer(question._id)}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                >
                  Post Answer
                </button>
              </div>
            </div>
          )}

          {selectedQuestion === question._id && answers[question._id] && (
            <div className="mt-6 space-y-4 border-t pt-4">
              <h4 className="font-semibold text-gray-700 mb-2">Answers</h4>
              {answers[question._id].length === 0 ? (
                <p className="text-gray-500">No answers yet. Be the first to answer!</p>
              ) : (
                answers[question._id].map((answer) => (
                  <div key={answer._id} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-2">{answer.content}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div>
                        Posted by: {answer.isAnonymous ? '-----' : answer.author?.name || 'Unknown'}
                      </div>
                      <div>
                        {format(new Date(answer.createdAt), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {reportingQuestion === question._id && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Why are you reporting this question?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                rows="3"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => {
                    setReportingQuestion(null);
                    setReportReason('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReport(question._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Submit Report
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionList;