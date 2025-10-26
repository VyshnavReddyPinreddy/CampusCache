import Notification from '../models/Notification.js';

// Get user's notifications
export const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 }); // Most recent first

        return res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Toggle notification read status
export const toggleNotificationReadStatus = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        // First get the current notification to check its status
        const currentNotification = await Notification.findById(notificationId);
        
        if (!currentNotification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        // Toggle the isRead status
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: !currentNotification.isRead },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            notification
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create notification (internal use)
export const createNotification = async (userId, contentType, contentId, message) => {
    try {
        const notification = new Notification({
            userId,
            contentType,
            contentId,
            message
        });
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
};