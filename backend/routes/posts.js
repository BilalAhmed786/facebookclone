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

        const postdata = await Post.findOne({_id:post._id.toString()})

        .sort({ createdAt: -1 }).populate('user').populate({
            path:'likes',
            select:"name"
            })
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
                            select: 'name profilepicture',
                        }
                       
                    }
                ]
    
            })



        if (postdata) {

            return res.json({msg:'Posted Successfully',postdata:postdata})
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

           const postdata = await Post.findOne({_id:post._id.toString()})

            .sort({ createdAt: -1 }).populate('user').populate({
                path:'likes',
                select:"name"
                })
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
                                select: 'name profilepicture',
                            }
                           
                        }
                    ]
        
                })

        if (postdata) {

            return res.json({msg:'Posted Successfully',postdata:postdata})
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



// Get single posts
router.get('/singlepost/:id', async (req, res) => {

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

        const post = await Post.findById(req.params.id).populate('user');

        if (post.user._id.toString() === req.user.userId) {


           const postdelete = await post.deleteOne()

           if(postdelete){

               return res.json({msg:'post deleted',postdelete:post})
           
            }


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

        post.text = req.body.text;
        post.bgcolor = req.body.bgcolor; 

          const postedit = await post.save();
       
          const postdata = await Post.findOne({_id:postedit._id.toString()})

          .sort({ createdAt: -1 }).populate('user').populate({
              path:'likes',
              select:"name"
              })
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
                              select: 'name profilepicture',
                          }
                         
                      }
                  ]
      
              })

      if (postdata) {

          return res.json({msg:'updated Successfully',postdata:postdata})
      }

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

             const postsave =   await post.save()

             const postfind = await Post.findOne({_id:postsave._id}).populate('user').populate({
                path:'likes',
                select:'name'
             })

            return res.json({msg:'post liked',postlike:postfind})
        } else {

            post.likes.pull(req.user.userId)

            const postsave = await post.save()

            const postfind = await Post.findOne({_id:postsave._id}).populate('user').populate({
                path:'likes',
                select:'name'
             })

             return res.json({msg:'post unliked',postlike:postfind})

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
        const allPosts = await Post.find({ user: { $in: followingUsers },isShared:false }).sort({ createdAt: -1 }).populate('user').populate({
        path:'likes',
        select:"name"
        })
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
                        select: 'name profilepicture',
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

        const user = await User.findById(req.user.userId);


        // Find the user by ID from the request body
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }



        const allPosts = await Post.find({

            $or: [
                { user: req.params.id },      
                { user: req.params.id,isShared: true }  
            ]

    }).sort({ createdAt: -1 }).populate('user')
            .populate({
                path:'likes',
                select:'name'
            })
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
                            select: 'name profilepicture',
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

//shared post 


router.post('/sharedpost/:id',async(req,res)=>{

    try {
        const originalPost = await Post.findById(req.params.id);
        if (!originalPost) {
            return res.status(404).json('Original post not found');
        }

        // Create a new post document for the shared post
        const sharedPost = new Post({
            user: req.user.userId,  // Assuming you have a way to get the logged-in user's ID
            text: originalPost.text,  // Allowing the user to add additional text
            bgcolor:originalPost.bgcolor,
            isShared: true,
            originalPost: originalPost._id,
              
        });

        await sharedPost.save();

        return res.status(201).json('Post shared successfully');
    } catch (error) {
        console.log(error);
        return res.status(500).json('Server error');
    }


})





module.exports = router;
