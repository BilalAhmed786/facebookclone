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

        const commentsaved =  await comment.save();

        post.comments.push(comment._id.toString());

        
        const postcomment = await post.save();

        //for socket collect followers of post user and recentcomment of that post
       
        const recentcomment = await Comment.findOne({_id:commentsaved._id}).populate('user','name profilepicture')
        const postdata = await Post.findOne({ _id: postcomment._id }).populate('user')
      


        return res.json({msg:'comment success',postcomment:postdata,recentcomment:recentcomment});
    } catch (err) {

        console.error(err.message);

        res.status(500).send('Server error');
    }
});

//add comment reply
router.post('/reply/:commentId', async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

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
        const commentsaved = await comment.save();

        // Get the newly added reply (the last element in the replies array)
        const addedReplyId = commentsaved.replies[commentsaved.replies.length - 1]._id;

        // Retrieve the comment again and populate the user in replies
        const populatedComment = await Comment.findById(commentId)
          .populate({
            path: 'replies.user', // Populate the user in the replies array
            select: 'name profilepicture' // Select the fields you need
          });

        // Find the newly added reply with populated user
        const addedReply = populatedComment.replies.find(reply => reply._id.toString() === addedReplyId.toString());
        const postdata = await Post.findOne({_id: commentsaved.post}, {user: 1}).populate('user');
       

        res.status(201).json({
          msg: 'Reply added successfully',
          userinfo: postdata,
          recentcomment: populatedComment,
          replycomment:addedReply
         
        });
    } catch (error) {
        console.error('Error adding reply to comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//reply first child comment 

router.post('/reply2firstchild', async (req, res) => {

  
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
            commentid: req.body.commentid,
            replytoid:req.body.replyid,
            replyto: req.body.replyto,
            replytomsg: req.body.replytomsg,
            text: req.body.text

        })

        const comment = await newcomment.save()


        if (!comment) {


            return res.status(500).json('server error')


        }

        reply.replies.push(comment._id.toString())


        const updatedcomment =   await parentComment.save()
        const postdata  = await Post.findOne({_id:updatedcomment.post},{user:1}).populate('user', 'followers')
        const recentcomment  = await Reply.findOne({_id:comment._id}).populate('user','name profilepicture')


        return res.json({
            
            msg: 'saved successfully',
            userinfo:postdata,
            comment:updatedcomment,
            recentcomment:recentcomment
        })

    } catch (error) {

        console.error(error);

        res.status(500).json({ message: error.message });

    }



})

//reply to 2nd(last)child comment
router.post('/replytoreply', async (req, res) => {

  
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
            commentid: req.body.commentid,
            replytoid:req.body.repliesid,
            replyto: req.body.replyto,
            replytomsg: req.body.replytomsg,
            text: req.body.text

        })

        const comment = await newcomment.save()


        if (!comment) {


            return res.status(500).json('server error')


        }

        reply.replies.push(comment._id.toString())


      const updatedcomment =  await parentComment.save()
      const postdata = await Post.findOne({_id:updatedcomment.post},{user:1}).populate('user','followers')
      const recentcomment = await Reply.findOne({_id:comment._id}).populate('user','name profilepicture') 
      
        return res.json({
           msg: 'comment saved successfully',
           userinfo:postdata,
           comment:updatedcomment,
           replyid:req.body.replyid,
           recentcomment:recentcomment
        })

    } catch (error) {

        console.error(error);

        res.status(500).json({ message: error.message });

    }



})



// parent comment edit and delete
router.get('/singlecomment/:id', async (req, res) => {

    const singlecomment = await Comment.findById(req.params.id)

    return res.json(singlecomment.text)


})


router.delete('/removecomment/:id', async (req, res) => {
    try {
     
        // Populate post and user if the comment was successfully deleted
        const recentcomment = await Comment.findOne({_id:req.params.id}).populate('user','name profilepicture')
        
        // Delete the comment and its replies
        const usercomment = await Comment.findByIdAndDelete(req.params.id);
        
        await Reply.deleteMany({ commentid: req.params.id });
      
        const postdata = await Post.findOne({ _id: usercomment.post },{user:1}).populate('user','followers')
      


  
        return res.json({ msg: 'Comment removed', userinfo:postdata,recentcomment:recentcomment });
      
    } catch (err) {
      console.error(err.message);
      return res.status(500).json('Server error');
    }
  });
  

router.put('/updatecomment/:id', async (req, res) => {


    const comment = await Comment.findOneAndUpdate({ _id: req.params.id }, { $set: { text: req.body.comment } })


    const postdata = await Post.findOne({_id:comment.post},{user:1}).populate('user','followers')
    const updatedcomment = await Comment.findOne({_id:comment._id}).populate('user','name profilepicture')

    if (comment) {

        return res.json({msg:'update success',userinfo:postdata,recentcomment:updatedcomment})

    } else {

        return res.status(500).json('server error')
    }

})


//first child comment edit delete update

router.post('/childcommentedit/:id', async (req, res) => {

    const comment = await Comment.findById(req.params.id)

    const findcomment = comment.replies.find(reply => reply._id.toString() === req.body.commentreplyid)

    if (!findcomment) {

        return res.status(500).json('server error')
    }

    return res.json(findcomment.text)

})

router.put('/updatechildcomment/:id', async (req, res) => {
    try {
        // Find the comment by ID
        const findcomment = await Comment.findById(req.params.id);

        // Find the specific reply within the replies array
        const comment = findcomment.replies.find(reply => reply._id.toString() === req.body.commentreplyid);

        // If the reply is not found, return a 404 error
        if (!comment) {
            return res.status(404).json('Comment not found');
        }

        // Update the text of the found reply
        comment.text = req.body.comment;

        // Save the updated comment document
        const updatedcomment = await findcomment.save();


        const postdata = await Post.findOne({_id:updatedcomment.post},{user:1}).populate('user','followers')
        const commentupdate = await Comment.findById(req.params.id).populate('replies.user','name profilepicture')

        const specificreply = commentupdate.replies.find(reply => reply._id.toString() === req.body.commentreplyid);

        // Update any reply in the Reply collection where replytoid matches commentreplyid
        const replyUpdateResult = await Reply.updateMany(
            { replytoid: req.body.commentreplyid },
            { replytomsg: req.body.comment }
        );

        // Check if the reply update was successful (optional)
        if (replyUpdateResult.nModified === 0) {
            console.log('No replies were updated');
        }

        return res.json({
          msg:'Comment updated successfully',
          userinfo:postdata,
          comment:commentupdate,
          replyedit:specificreply

        }
        
        );
    } catch (error) {
        console.log(error);
        return res.status(500).json('Server error');
    }
})




router.delete('/deletechildcomment/:id/:replyid', async (req, res) => {

    try {

        const findcomment = await Comment.findById(req.params.id)

        if (!findcomment) {

            return res.status(404).json('reply not found')
        }
        // Remove the reply from the replies array
        findcomment.replies.pull({ _id: req.params.replyid });

        // Save the updated comment document
       const updatedcomment = await findcomment.save();

       const postdata = await Post.findOne({_id:updatedcomment.post},{user:1}).populate('user','followers')

        await Reply.deleteMany({ commentid: req.params.id })

        return res.json({
                msg:'deleted successfully',
                comment:updatedcomment,
                userinfo:postdata,
                replyid:req.params.replyid
            })

    } catch (error) {

        console.log(error)
    }


})

//for last child edit update delete

router.get('/replytoreplyedit/:id',async(req,res)=>{

try{

    const reply = await Reply.findById(req.params.id)

            if(!reply){

                return res.status(404).json('reply not found')
            }

                return res.json(reply.text)


}catch(error){

    console.log(error)
}
    


})


router.put('/replytoreplyupdate/:id/:replyid', async (req, res) => {
    
    try {
        // Update the reply by ID
        const reply = await Reply.findByIdAndUpdate(req.params.id, { text: req.body.comment }, { new: true })
        .populate('user','name profilepicture')

        const postdata = await Post.findOne({comments:reply.commentid},{user:1}).populate('user','followers')
        // Check if the reply was found and updated
        if (!reply) {
            return res.status(404).json('Reply not found');
        }

        // Update replies that reference this reply (where replytoid matches)
        const replyto = await Reply.updateMany({ replytoid: req.params.id }, { replytomsg: req.body.comment });

        // Check if the replyto update was successful (optional based on your needs)
        if (replyto.nModified === 0) {
           
            return res.status(404).json('No replies referencing this reply were found to update');
        
        }

            return res.json({
                msg:'Update successful',
                userinfo:postdata,
                recentcomment:reply,
                replyid:req.params.replyid
            });
    
        } catch (error) {
        
        console.log(error);
        
        return res.status(500).json('Server error');
    }
});


router.delete('/replytoreplydelete/:id/:replyid',async(req,res)=>{

    try{

        
        const recentcomment = await Reply.findById(req.params.id).populate('user')
        
        const postdata = await Post.findOne({comments:recentcomment.commentid},{user:1})
        
        .populate('user','followers')
        
        const comment = await Reply.findByIdAndDelete(req.params.id)
            


             if(!comment){

                return res.status(404).json('comment not found')
            
            }


            
            return res.json({
            
                msg:'deleted successfully',
                userinfo:postdata,
                recentcomment:recentcomment,
                replyid:req.params.replyid
            

            })
       


    }catch(error){

        console.log(error)
    }


})


router.put('/like/:id', async (req, res) => {

  
    try {

        const comment = await Comment.findById(req.params.id)


        if (!comment.likes.includes(req.user.userId)) {


            comment.likes.push(req.user.userId)

          const likesave =  await comment.save()


          const postdata = await Post.findOne({_id:likesave.post}).populate('user')
          const recentcomment = await Comment.findOne({_id:likesave._id}).populate('user','name profilepicture')

       
            res.json({msg:'like comment',userinfo:postdata,recentcomment:recentcomment})

        } else {


                comment.likes.pull(req.user.userId)
            
                
            const likesave =  await comment.save()

                
                const postdata = await Post.findOne({_id:likesave.post}).populate('user')
                const recentcomment = await Comment.findOne({_id:likesave._id}).populate('user','name profilepicture')
  
  
            res.json({msg:'unlike comment',userinfo:postdata,recentcomment:recentcomment})
        }



    } catch (error) {

        console.log(error)
    }


})


router.put('/replylike/:id', async (req, res) => {
    const { id } = req.params;  // Comment ID
    const { replyid } = req.body;  // Reply ID
    const userId = req.user.userId;  // Assuming req.user contains the user info

    try {
        // Check if the user has already liked the reply
        const comment = await Comment.findOne({ _id: id })

        const commentfind = comment.replies.find(reply => reply._id.toString() === replyid)


        if (!commentfind.likes.includes(userId)) {


            commentfind.likes.push(userId)

           const updatedcomment = await comment.save()

            const postdata = await Post.findOne({_id:updatedcomment.post},{user:1}).populate('user','followers')
           
            const replycomment =   updatedcomment.replies.find(reply => reply._id.toString() === replyid)
          
            res.json({
                msg:'comment likes',
                userinfo:postdata,
                comment:updatedcomment,
                commentlike:replycomment

            })


        } else {

            commentfind.likes.pull(userId)

            const updatedcomment = await comment.save()

            const postdata = await Post.findOne({_id:updatedcomment.post},{user:1}).populate('user','followers')
           
            const replycomment =   updatedcomment.replies.find(reply => reply._id.toString() === replyid)
          
            res.json({
                msg:'comment likes',
                userinfo:postdata,
                comment:updatedcomment,
                commentlike:replycomment

            })

        }


    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
});



router.put('/replytoreplylike/:id/:replyid', async (req, res) => {

    try {

        const comment = await Reply.findById(req.params.id)


        if (!comment.likes.includes(req.user.userId)) {

            comment.likes.push(req.user.userId)

          const updatedcomment =   await comment.save()

          const postdata = await Post.findOne({comments:updatedcomment.commentid},{user:1}).populate('user','followers')
            
          
          res.json({

              msg:'like comment',
              userinfo:postdata,
              recentcomment:updatedcomment,
              replyid:req.params.replyid
          })

        } else {

            comment.likes.pull(req.user.userId)

            const updatedcomment =   await comment.save()

            const postdata = await Post.findOne({comments:updatedcomment.commentid},{user:1}).populate('user','followers')
              
            
            res.json({
  
                msg:'like comment',
                userinfo:postdata,
                recentcomment:updatedcomment,
                replyid:req.params.replyid
            })

        }


    } catch (error) {

        console.log(error)


    }


})





module.exports = router;
