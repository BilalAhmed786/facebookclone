const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Reply = require('../models/Reply')


const router = express.Router();



// Add a comment to a post
router.post('/comment/:id', async (req, res) => {

    const { text } = req.body;

    try {
        const post = await Post.findById(req.params.id);
        if (!post) {

            return res.status(404).json({ msg: 'Post not found' });

        }

        const comment = new Comment({
            user: req.user.userId,
            post: req.params.id,
            text
        });

        await comment.save();

        post.comments.push(comment._id.toString());

        await post.save();

        res.json('comment success');
    } catch (err) {

        console.error(err.message);

        res.status(500).send('Server error');
    }
});

//add comment reply
router.post('/reply/:commentId', async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.userId; // Assuming you have user authentication and the user's ID is available in req.user

    if (!text) {
        return res.status(400).json({ message: 'Reply text is required' });
    }

    try {
        // Find the comment by its ID
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Create a new reply object
        const newReply = {
            user: userId,
            text: text,
            likes: [],
            replies: []
        };

        // Add the new reply to the replies array of the comment
        comment.replies.push(newReply);

        // Save the updated comment
        await comment.save();

        res.status(201).json({ message: 'Reply added successfully', reply: newReply });
    } catch (error) {
        console.error('Error adding reply to comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//add commentreply to reply

router.post('/reply2reply', async (req, res) => {
    
    try {
        const parentComment = await Comment.findById(req.body.commentid);

        if (!parentComment) {
           
            return res.status(404).json({ message: 'Comment not found' });
        
        }

        // Find the specific reply within the comment's replies
        const reply = parentComment.replies.find(reply => reply._id.equals(req.body.replyid));

        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }

       
        
        const newcomment = new Reply({

            user: req.user.userId,
            replyto:req.body.replyto,
            text:req.body.text

        })

        const comment = await newcomment.save()


        if (!comment) {


            return res.status(500).json('server error')


        }

            reply.replies.push(comment._id.toString())

            
            await parentComment.save()

            return res.json('comment saved successfully')

    } catch (error) {

        console.error(error);

        res.status(500).json({ message: error.message });

    }



})

// get comment for single user who wants to edit comment
router.get('/singlecomment/:id', async (req, res) => {

    const singlecomment = await Comment.findById(req.params.id)

    if (singlecomment.user.toString() === req.body.userId) {


        return res.json(singlecomment.text)


    } else {

        return res.status(401).json('u cant edit this message')
    }

})



//delete comment
router.delete('/removecomment/:id', async (req, res) => {

    const usercomment = await Comment.findById(req.params.id)

    if (usercomment.user.toString() === req.body.userId) {

        await usercomment.deleteOne()

        return res.json("comment deleted")

    } else {


        return res.status(401).json('u cant remove this comment')

    }

})

router.put('/updatecomment/:id', async (req, res) => {

    const comment = await Comment.findById(req.params.id)


    if (comment.user.toString() === req.body.userId) {

        await Comment.updateOne({ $set: { text: req.body.text } })

        return res.json('update success')

    } else {

        return res.status(401).json('u cantupdate this comment')
    }


})

module.exports = router;
