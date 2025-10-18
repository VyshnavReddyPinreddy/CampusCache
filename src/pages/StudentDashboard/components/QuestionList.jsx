import React, { useState, useContext, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContent } from '../../../context/AppContext';

const QuestionList = ({ questions, loading, onDelete, onReport, isUserQuestion }) => {
  const { backendUrl, userData } = useContext(AppContent);
  const [reportingQuestion, setReportingQuestion] = useState(null);
  const [reportingAnswer, setReportingAnswer] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loadingAnswers, setLoadingAnswers] = useState({});
  const [answeringQuestion, setAnsweringQuestion] = useState(null);
  const [answerContent, setAnswerContent] = useState('');
  const [isAnswerAnonymous, setIsAnswerAnonymous] = useState(false);
  const [votes, setVotes] = useState({});
  const [votingInProgress, setVotingInProgress] = useState({});

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

  const handleReportAnswer = async (answerId) => {
    if (!/\w+/.test(reportReason)) {
      toast.error('Provide at least one word for reason to report');
      return;
    }
    try {
      const { data } = await axios.post(`${backendUrl}/api/report`, {
        contentId: answerId,
        contentType: 'Answer',
        reasons: reportReason.trim()
      });
      if (data.success) {
        toast.success('Answer reported successfully');
        setReportingAnswer(null);
        setReportReason('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to report answer');
    }
  };

  const handleVote = async (answerId, voteType) => {
    if (votingInProgress[answerId]) return;
    
    try {
      setVotingInProgress(prev => ({ ...prev, [answerId]: true }));
      const { data } = await axios.post(`${backendUrl}/api/vote/add-vote`, {
        userId: userData._id,
        answerId,
        voteType
      });
      
      if (data.success) {
        setVotes(prev => ({
          ...prev,
          [answerId]: data.voteStatus
        }));
        // Update the answer score in the answers state
        setAnswers(prev => {
          const questionId = selectedQuestion;
          if (!questionId) return prev;
          
          const updatedAnswers = prev[questionId].map(answer => 
            answer._id === answerId ? { ...answer, score: data.answer.score } : answer
          );
          
          return {
            ...prev,
            [questionId]: updatedAnswers
          };
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to vote');
    } finally {
      setVotingInProgress(prev => ({ ...prev, [answerId]: false }));
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/answer/delete-answer`, {
        data: {
          userId: userData._id,
          answerId
        }
      });
      if (data.success) {
        toast.success('Answer deleted successfully');
        // Refresh the answers for this question
        const questionId = selectedQuestion;
        if (questionId) {
          const { data: newData } = await axios.get(`${backendUrl}/api/answer/get-answer/${questionId}`);
          if (newData.success) {
            setAnswers(prev => ({ ...prev, [questionId]: newData.allAnswers || [] }));
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete answer');
    }
  };

  const handleAnswer = async (questionId) => {
    if (!answerContent.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/answer/add-answer`, {
        questionId,
        content: answerContent.trim(),
        isAnonymous: isAnswerAnonymous,
        userId: userData._id
      });

      if (data.success) {
        toast.success('Answer posted successfully');
        setAnswerContent('');
        setAnsweringQuestion(null);
        // Update the answers list if answers are currently shown
        if (selectedQuestion === questionId) {
          const { data: newData } = await axios.get(`${backendUrl}/api/answer/get-answer/${questionId}`);
          if (newData.success) {
            setAnswers(prev => ({ ...prev, [questionId]: newData.allAnswers || [] }));
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post answer');
    }
  };

  const fetchVotes = async (answerId) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/vote/user-vote`, {
        params: {
          userId: userData._id,
          answerId
        }
      });
      if (data.success && data.vote) {
        setVotes(prev => ({
          ...prev,
          [answerId]: data.vote.voteType
        }));
      }
    } catch (error) {
      console.error('Failed to fetch vote status:', error);
    }
  };

  const fetchAnswers = async (questionId) => {
    if (answers[questionId]) {
      setSelectedQuestion(selectedQuestion === questionId ? null : questionId);
      return;
    }

    setLoadingAnswers(prev => ({ ...prev, [questionId]: true }));
    try {
      const { data } = await axios.get(`${backendUrl}/api/answer/get-answer/${questionId}`);
      if (data.success) {
        const allAnswers = data.allAnswers || [];
        setAnswers(prev => ({ ...prev, [questionId]: allAnswers }));
        setSelectedQuestion(questionId);
        
        // Fetch vote status for each answer
        allAnswers.forEach(answer => {
          fetchVotes(answer._id);
        });
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
              Posted by: {question.isAnonymous ? '-----' : question.author?.name || '-----'}
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
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`anonymous-${question._id}`}
                    checked={isAnswerAnonymous}
                    onChange={(e) => setIsAnswerAnonymous(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor={`anonymous-${question._id}`} className="text-sm text-gray-600">
                    Post anonymously
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setAnsweringQuestion(null);
                      setAnswerContent('');
                      setIsAnswerAnonymous(false);
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
            </div>
          )}

          {selectedQuestion === question._id && answers[question._id] && (
            <div className="mt-6 space-y-4 border-t pt-4">
              <h4 className="font-semibold text-gray-700 mb-2">Answers</h4>
              {answers[question._id].length === 0 ? (
                <p className="text-gray-500">No answers yet. Be the first to answer!</p>
              ) : (
                answers[question._id].map((answer) => (
                  <div key={answer._id} className="bg-gray-50 rounded-lg overflow-hidden">
                    <div className="p-4">
                      <p className="text-gray-700 whitespace-pre-wrap break-words">{answer.content}</p>
                    </div>

                    <div className="bg-gray-100 px-4 py-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        {/* Left side: Voting controls */}
                        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-md shadow-sm">
                          <button
                            onClick={() => handleVote(answer._id, 1)}
                            disabled={votingInProgress[answer._id]}
                            className={`group flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 ${
                              votes[answer._id] === 1
                                ? 'bg-indigo-100'
                                : 'hover:bg-indigo-50'
                            } ${
                              votingInProgress[answer._id] ? 'cursor-not-allowed opacity-50' : ''
                            }`}
                          >
                            <svg 
                              className={`w-5 h-5 transition-all duration-200 ${
                                votes[answer._id] === 1
                                  ? 'text-indigo-600 scale-110'
                                  : 'text-gray-500 group-hover:text-indigo-600 group-hover:scale-110'
                              }`} 
                              fill="none" 
                              strokeWidth="2.5"
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 19V5M5 12l7-7 7 7"/>
                            </svg>
                          </button>
                          
                          <span className={`font-semibold text-lg transition-all duration-200 ${
                            answer.score > 0 ? 'text-indigo-600' : 
                            answer.score < 0 ? 'text-red-600' : 
                            'text-gray-600'
                          }`}>
                            {answer.score || 0}
                          </span>

                          <button
                            onClick={() => handleVote(answer._id, -1)}
                            disabled={votingInProgress[answer._id]}
                            className={`group flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 ${
                              votes[answer._id] === -1
                                ? 'bg-red-100'
                                : 'hover:bg-red-50'
                            } ${
                              votingInProgress[answer._id] ? 'cursor-not-allowed opacity-50' : ''
                            }`}
                          >
                            <svg 
                              className={`w-5 h-5 transition-all duration-200 ${
                                votes[answer._id] === -1
                                  ? 'text-red-600 scale-110'
                                  : 'text-gray-500 group-hover:text-red-600 group-hover:scale-110'
                              }`} 
                              fill="none" 
                              strokeWidth="2.5"
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 5v14M5 12l7 7 7-7"/>
                            </svg>
                          </button>
                        </div>

                        {/* Center: Posted by and date */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div>
                            Posted by: {answer.isAnonymous ? '-----' : answer.author?.name || 'Unknown'}
                          </div>
                          <div>
                            {format(new Date(answer.createdAt), 'MMM d, yyyy')}
                          </div>
                        </div>

                        {/* Right side: Action buttons */}
                        <div className="flex items-center gap-2">
                          {answer.author?._id === userData?._id ? (
                            <button
                              onClick={() => handleDeleteAnswer(answer._id)}
                              className="px-3 py-1.5 rounded-lg transition-all duration-200 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"
                            >
                              Delete
                            </button>
                          ) : (
                            <button
                              onClick={() => setReportingAnswer(answer._id)}
                              className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                                reportingAnswer === answer._id
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                              }`}
                            >
                              Report
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    {reportingAnswer === answer._id && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                        <textarea
                          value={reportReason}
                          onChange={(e) => setReportReason(e.target.value)}
                          placeholder="Why are you reporting this answer?"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                          rows="3"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            onClick={() => {
                              setReportingAnswer(null);
                              setReportReason('');
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReportAnswer(answer._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            Submit Report
                          </button>
                        </div>
                      </div>
                    )}
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