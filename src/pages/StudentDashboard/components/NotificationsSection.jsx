import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContent } from '../../../context/AppContext';

const NotificationsSection = () => {
    const { backendUrl, userData } = useContext(AppContent);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AppContent);

    useEffect(() => {
        fetchNotifications();
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const response = await axios.post(backendUrl+'/api/notifications/get',{
                userId : userData._id
            });
            if (response.data.success) {
                setNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleReadStatus = async (notificationId) => {
        try {
            const response = await axios.put(backendUrl+`/api/notifications/${notificationId}/toggle`);
            if (response.data.success) {
                // Update local state to toggle read status
                setNotifications(notifications.map(notif => 
                    notif._id === notificationId 
                        ? { ...notif, isRead: !notif.isRead }
                        : notif
                ));
            }
        } catch (error) {
            console.error('Error toggling notification status:', error);
        }
    };

    if (loading) {
        return <div>Loading notifications...</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Notifications</h2>
            {notifications.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">No notifications yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`p-6 rounded-lg shadow-md border transition-all duration-200 ${
                                notification.isRead 
                                    ? 'bg-white border-gray-200' 
                                    : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                            }`}
                            onClick={() => !notification.isRead && markAsRead(notification._id)}
                        >
                            <div className="flex justify-between items-start">
                                <p className="text-gray-800 font-medium">{notification.message}</p>
                                <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded ${
                                    notification.isRead 
                                        ? 'text-gray-600 bg-gray-100'
                                        : 'text-blue-600 bg-blue-100'
                                }`}>
                                    {notification.isRead ? 'Read' : 'New'}
                                </span>
                            </div>
                            <div className="mt-3 flex items-center text-sm">
                                <span className="capitalize text-gray-600 font-medium">
                                    {notification.contentType}
                                </span>
                                <span className="mx-2 text-gray-400">•</span>
                                <span className="text-gray-500">
                                    {new Date(notification.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleReadStatus(notification._id);
                                }}
                                className={`mt-3 text-sm font-medium px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                                    notification.isRead
                                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 border border-gray-200'
                                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-200'
                                }`}
                            >
                                <svg 
                                    className={`w-4 h-4 ${notification.isRead ? 'text-gray-500' : 'text-blue-500'}`} 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    {notification.isRead ? (
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                                        />
                                    ) : (
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                        />
                                    )}
                                </svg>
                                Mark as {notification.isRead ? 'unread' : 'read'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsSection;