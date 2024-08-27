const User = require('../models/User')

const userLogedInn = async (socketid, userid) => {

    if (!userid) {
        console.error('User ID is undefined. Cannot log in user.');
        return;
    }


    try {
        // Fetch the user by ID
        const user = await User.findById(userid);

        //  Check if the user exists
        if (!user) {
            console.log(`User with ID ${userid} not found.`);
            return;
        }

        // Update user's status and socket ID
        user.status = 'online';
        user.socketid = socketid;

        // Save the updated user
       const userstatus = await user.save();

       if(userstatus){
       
        console.log('offline')
       
    }
       
    } catch (error) {
        console.error('Error updating user status:', error);
    }
};


const userLoggedout = async (socketid) => {
    try {
        // Find a single user document by socketid
        const user = await User.findOne({ socketid });

        // Check if the user was found
        if (!user) {
            console.log('User not found');
           
            return; 
        }

        user.status = 'offline';
        await user.save();
    
    } 
    catch (error) {
        console.error('Error updating user status:', error);
    }
};


module.exports = { userLogedInn, userLoggedout }