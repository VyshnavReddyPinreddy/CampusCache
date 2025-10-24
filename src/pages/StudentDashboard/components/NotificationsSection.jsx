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

    const markAsRead = async (notificationId) => {
        try {
            await axios.put(backendUrl+`/api/notifications/${notificationId}/read`);
            // Update local state to mark as read
            setNotifications(notifications.map(notif => 
                notif._id === notificationId 
                    ? { ...notif, isRead: true }
                    : notif
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
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
                                {!notification.isRead && (
                                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-600 bg-blue-100 rounded">
                                        New
                                    </span>
                                )}
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
                            {!notification.isRead && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        markAsRead(notification._id);
                                    }}
                                    className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    Mark as read
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsSection;