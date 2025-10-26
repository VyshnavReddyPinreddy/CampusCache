import transporter from '../config/nodemailer.js';
import User from '../models/User.js';

const submitFeedback = async (req, res) => {
    try {
        const { feedback } = req.body;
        const {userId} = req.body;  // From auth middleware

        // Get user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Prepare email content
        const emailContent = `
            New Feedback Received
            ---------------------
            From User:
            Name: ${user.name}
            Email: ${user.email}
            Role: ${user.role}
            ---------------------
            Feedback:
            ${feedback}
        `;

        // // Send email
        // await transporter.sendMail({
        //     from: process.env.SENDER_EMAIL,
        //     to: process.env.SENDER_EMAIL, // Send to admin email
        //     subject: 'New User Feedback - CampusCache',
        //     text: emailContent
        // });

        return res.json({
            success: true,
            message: 'Feedback submitted successfully'
        });

    } catch (error) {
        console.error('Feedback submission error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to submit feedback'
        });
    }
};

export default submitFeedback;