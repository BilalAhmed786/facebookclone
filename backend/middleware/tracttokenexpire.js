const jwt = require('jsonwebtoken');
const User = require('../models/User');

const expiredtoken = async (req, res, next) => {
    const token = req.cookies.auth_token; // Access token from the cookie (assuming it's named 'token')

    if (!token) {
        console.log('No token found in cookies.');
        return next(); // No token, move to the next middleware
    }

    try {
        // Verify and decode the token using your JWT secret
        const decoded = jwt.verify(token, process.env.TOKEN_SEC);
       
        // Check if the token is near expiration
        const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
        const timeRemaining = decoded.exp - currentTime; // Time remaining in seconds

        if (timeRemaining <= 60) { // e.g., less than 1 minute remaining
            const userId = decoded.userId; // Get user ID from the decoded token

            if (userId) {
                try {
                    // Update user status to offline
                    await User.updateOne({_id:userId}, {$set:{status:0 }});
                    
                    console.log(`User ${userId} status updated to offline due to token expiration.`);
                } 
                catch (error) {
                    console.error('Error updating user status:', error);
                    return next(error); // Pass the error to the next middleware
                }
            }
        }
        next(); // Proceed to the next middleware
    } catch (err) {
        // Token has already expired or is invalid
        if (err.name === 'TokenExpiredError') {
            console.log('Token has expired.');
        } else {
            console.error('Token is invalid:', err);
        }

        return next(); // Move to the next middleware or handle the error as needed
    }
};

module.exports = expiredtoken;
