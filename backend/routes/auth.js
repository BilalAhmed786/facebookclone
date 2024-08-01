const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userverify = require('../middleware/verifyuser')

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    const { name, email, password, retypepassword } = req.body;

    if (!name || !email || !password || !retypepassword) {


        return res.status(400).json('All fields requried')
    }

    if (password !== retypepassword) {

        return res.status(400).json('Mismatch passwords')

    }



    try {
        let user = await User.findOne({ email });

        if (user) {

            return res.status(400).json('User already exists'   );

        }

        user = new User({ name, email, password, retypepassword });

        await user.save();

        const payload = { userId: user.id };

        const token = jwt.sign(payload, process.env.TOKEN_SEC, { expiresIn: '1h' });

        res.cookie('auth_token', token, {
            httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not accessible via JavaScript
            secure: process.env.NODE_ENV === 'production', // Ensure cookies are sent over HTTPS in production
            maxAge: 3600000 // Cookie expiration time in milliseconds (1 hour in this case)
        });

        return res.json('register successfully')
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



//for procted routes

router.get('/userinfo', userverify, async (req, res) => {

    try {

        const userinfo = await User.findById(req.user.userId, { password: 0, retypepassword: 0 })


        return res.json(userinfo)

    } catch (error) {

        console.log(error)
    }


})

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {

        return res.status(400).json('All fileds required')

    }


    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json('Invalid credentials');
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json('Invalid credentials');
        }

        const payload = { userId: user.id };

        const token = jwt.sign(payload, process.env.TOKEN_SEC, { expiresIn: '1h' });

            res.cookie('auth_token', token, {
                httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not accessible via JavaScript
                secure: process.env.NODE_ENV === 'production', // Ensure cookies are sent over HTTPS in production
                maxAge: 3600000 // Cookie expiration time in milliseconds (1 hour in this case)
            });

        return res.json('login success')

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// logout user
router.post('/logout', (req, res) => {
    
   
    try {
      // Clear the auth token cookie
      res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        
      });
      
      // Respond with a success message
      return res.status(200).json('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ msg: 'Server error during logout' });
    }
  });
  

module.exports = router;
