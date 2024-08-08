const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');
const User = require('../models/User');
const upload = require('../multer/multer');
const router = express.Router();

//during edit files upload

router.post('/editupload', upload.array('files', 10), async (req, res) => {

    if (!req.files || req.files.length === 0) {

        return res.status(400).send('No files uploaded.');

    }

    const files = req.files.map(res => res.filename)


    return res.json(files)

})


router.post('/upload', upload.array('files', 10), async (req, res) => {

    if (!req.files || req.files.length === 0) {

        return res.status(400).send('No files uploaded.');

    }

    const files = req.files.map(res => res.filename)


    try {
        const post = new Post({
            user: req.user.userId,
            text: files,

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
router.get('/singlepost/:id', async (req, res) => {

    console.log(req.params.id)
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

        if (post.user.toString() === req.user.userId) {


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

//update post

router.post('/updatepost', async (req, res) => {
    try {

        const post = await Post.findById(req.body.editId)

        const filterfiles = post.text.filter(file => !req.body.text.includes(file));


        const removefiles = filterfiles.map((files) => {

            const filePath = path.join(__dirname, '../public/uploads', files);

            fs.unlink(filePath, (err) => {

                if (err) {

                    console.log(err)
                }
            })

        })

        if (removefiles) {

            console.log('files removed')
        }


        post.text = req.body.text;
        post.bgcolor = req.body.bgcolor; // Assuming bgcolor is also updated

        await post.save();

        res.send('Post updated successfully');

    } catch (error) {

        console.log(error)
    }


})

//like unlike a post 
router.put('/like/:id', async (req, res) => {


    try {

        const post = await Post.findById(req.params.id)


        if (!post.likes.includes(req.user.userId)) {

            post.likes.push(req.user.userId)

            await post.save()

            return res.json('post liked')
        } else {

            post.likes.pull(req.user.userId)

            await post.save()

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
        const allPosts = await Post.find({ user: { $in: followingUsers } }).sort({ createdAt: -1 }).populate('user')
            .populate({
                path: 'comments',
                options: { sort: { createdAt: -1 } }, 
                populate: [
                    {
                        path: 'user',
                        select: 'name profilepicture'
                    },
                    {
                        path: 'replies.user',
                        select: 'name profilepicture'
                    },

                    {
                        path: 'replies.replies',
                        populate: {
                            path: 'user',
                            select: 'name profilepicture'
                        }
                    }


                ]

            });

        // Send the posts as a JSON response
        return res.status(200).json({ allPosts: allPosts, Userid: user._id });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }

})

// get post for profile posts 
router.get('/timeline/:id', async (req, res) => {
    try {

        const allPosts = await Post.find({ user: req.params.id }).sort({ createdAt: -1 }).populate('user').populate('comments');

        // Send the posts as a JSON response
        return res.json(allPosts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }

})




module.exports = router;
