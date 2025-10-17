import React, { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const QuestionList = ({ questions, loading, onDelete, onReport, isUserQuestion }) => {
  const [reportingQuestion, setReportingQuestion] = useState(null);
  const [reportReason, setReportReason] = useState('');

  const handleReport = (questionId) => {
    if (!reportReason.trim()) {
      toast.error('Please provide a reason for reporting');
      return;
    }
    onReport(questionId, reportReason);
    setReportingQuestion(null);
    setReportReason('');
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
              {isUserQuestion(question) ? (
                <button
                  onClick={() => onDelete(question._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              ) : (
                <button
                  onClick={() => setReportingQuestion(question._id)}
                  className="text-gray-500 hover:text-gray-700"
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

          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              Posted by: {question.isAnonymous ? 'Anonymous' : question.author?.name || 'Unknown'}
            </div>
            <div>
              {format(new Date(question.createdAt), 'MMM d, yyyy')}
            </div>
          </div>

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