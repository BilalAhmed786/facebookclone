const User = require('../models/User')

const userLogedInn = async (userid) => {

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
        user.status = 1;
       
        // Save the updated user
        const userstatus = await user.save();

        if (userstatus) {

           console.log('status update')

        }

    } catch (error) {
        console.error('Error updating user status:', error);
    }
};


const userLoggedout = async (userid) => {
    try {
        // Find a single user document by socketid
        const user = await User.findOne({_id: userid });

        // Check if the user was found
        if (!user) {

            console.log('User not found');

            return;
        }

        user.status = 0;

        const userstatus = await user.save();


        if (userstatus) {

            return userstatus
        }

    }
    catch (error) {
        console.error('Error updating user status:', error);
    }
};


const onlineFriends = async (userid) => {

    try {

        const finduser = await User.findOne({ _id: userid }, { password: 0, retypepassword: 0 })
            .populate({
                path: 'followers',
                select: 'name profilepicture status', // Include name, profilepicture, and status fields
                options: {
                    sort: { status: -1 }, // Sort followers by status, e.g., online (1) first then offline (0)
                },
            });



        if (!finduser) {

            console.log('user not found')
        }

        return finduser


    } catch (error) {


        console.log(error)

    }
}


module.exports = { userLogedInn, userLoggedout, onlineFriends }