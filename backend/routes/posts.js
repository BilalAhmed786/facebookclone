const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const User = require('../models/User');
const authrize = require('../middleware/verifyuser');
const { request } = require('https');

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {

        cb(null, `${file.originalname}`);

    }
});

const upload = multer({ storage });


const router = express.Router();



router.post('/upload', upload.array('files', 10), authrize, async (req, res) => {
   
    if (!req.files || req.files.length === 0) {
   
        return res.status(400).send('No files uploaded.');
   
     }

      const files = req.files.map(res=>res.filename)
   
    try {
        const post = new Post({
            user: req.user.userId,
            text:files,
        
        });

        const postsaved = await post.save();

        if (postsaved) {

            return res.json('Posted Successfully')
        }

    } catch (err) {
        console.error(err.message);
      
        res.status(500).send('Server error');
    }
    
});


// Create a post
router.post('/', async (req, res) => {
    const { text, bgcolor } = req.body;

    if (!text) {

        return res.status(400).json('text required for post')
    }

    try {
        const post = new Post({
            user: req.user.userId,
            text,
            bgcolor
        });

        const postsaved = await post.save();

        if (postsaved) {

            return res.json('Posted Successfully')
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



// Get single posts
router.get('singlepost/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user').select('-password -retypepasword').populate('comments');



        return res.json(post)

    }
    catch (err) {
        console.error(err.message);

        res.status(500).send('Server error');
    }
});

// delete single posts
router.delete('/:id', async (req, res) => {
    try {

        const post = await Post.findById(req.params.id)

        if (post.user.toString() === req.body.userId) {


            await post.deleteOne()

            return res.json('post deleted')

        } else {

            return res.json('u cannot delete this post')
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//like unlike a post 
router.put('/like/:id',async (req, res) => {

    try {

        const post = await Post.findById(req.user.id)

        if (!post.likes.includes(req.body.userId)) {

            await Post.updateOne({ $push: { likes: req.body.userId } })

            return res.json('post liked')
        } else {


            await Post.updateOne({ $pull: { likes: req.body.userId } })

            return res.json('post unliked')

        }


    } catch (err) {

        console.log(err)
    }


})

// get post for homepage follwing and currentuser posts 


router.get('/allposts', async (req, res) => {

    
    try {
        
            const user = await User.findById(req.user.userId);

       
        // Find the user by ID from the request body
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Get the list of user IDs that the current user is following
        const followingUsers = user.following.map(followUser => followUser);


        followingUsers.push(user._id.toString());

        // Find all posts from the current user and the users they are following
        const allPosts = await Post.find({ user: { $in: followingUsers } }).populate('user');

        // Send the posts as a JSON response
        return res.status(200).json(allPosts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }

})

// get post for profile posts 
router.get('/timeline',  async (req, res) => {
    try {
        
        const allPosts = await Post.find({ user:req.user.userId});

        // Send the posts as a JSON response
        return res.json(allPosts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }

})




module.exports = router;
