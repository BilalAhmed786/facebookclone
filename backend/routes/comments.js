const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');


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
