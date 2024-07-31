const express = require('express');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');
const authrize = require('../middleware/verifyuser')

const router = express.Router();

// Create a post
router.post('/', authrize, async (req, res) => {
    const { text } = req.body;

    if(!text){

        return res.status(400).json('image or text required for post')
    }

    try {
        const post = new Post({
            user: req.user.userId,
            text
        }); 
        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get single posts
router.get('/:id', authrize, async (req, res) => {
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
router.delete('/:id', authrize, async(req, res) => {
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
router.put('/like/:id',authrize, async (req, res) => {

    try {

        const post = await Post.findById(req.params.id)

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

// get post for timeline follwing and currentuser posts 


router.get('/allposts/:id',authrize, async (req, res) => {
    try {
        console.log(req.params.id)
        const user = await User.findById(req.params.id);
        
        // Find the user by ID from the request body
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Get the list of user IDs that the current user is following
        const followingUsers = user.following.map(followUser => followUser);

      
        followingUsers.push(user._id.toString());

        // Find all posts from the current user and the users they are following
        const allPosts = await Post.find({ user: { $in: followingUsers } });

        // Send the posts as a JSON response
         return res.json(allPosts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }

})



module.exports = router;
