import { useEffect } from "react"

const realtimepostcomment = (socket,setPostdata) => {

useEffect(() => {
 
    //for post show in real-time to all followers
    const handlePostData = (data) => {

   
      setPostdata((prevState) => [data, ...prevState])

    };
    //post edit in real time for all follwers
    const handleUpdatepost = (updatedData) => {
      setPostdata((prevState) =>
        prevState.map((post) =>

          post._id === updatedData._id ? updatedData : post // Replace post if IDs match

        )
      );
    };

    //post delete for all followers in real-time
    const handleDeletepost = (deletePost) => {

      setPostdata((prevState) =>

        prevState.filter((post) => post._id !== deletePost._id)
      );
    };
    //post like in real-time to all followers
    const handleLikepost = (likePost) => {

      setPostdata((prevState) =>
        prevState.map((post) =>
          post._id === likePost._id ? { ...post, likes: [...likePost.likes] } : post
        )
      );
    };

    //first post comment in real-time to all followers
    const handlePostcomment = (PostComment) => {
      setPostdata((prevState) =>

        prevState.map((post) =>

          post._id === PostComment.post
            ? {
              ...post,
              comments: post.comments.some(comment => comment._id === PostComment._id)
                ? post.comments // If the comment already exists, don't add it

                : [PostComment, ...post.comments] // Otherwise, prepend it
            }
            : post
        )
      );
    };


    //edit first comment in real-timeto all followers
    const handleUpdatecomment = (UpdateComment) => {

      setPostdata((prevState) =>
        prevState.map((post) =>
          post._id === UpdateComment.post
            ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment._id === UpdateComment._id
                  ? {
                    ...comment,
                    text: UpdateComment.text, // Update only the text of the specific comment
                  }
                  : comment // Keep other comments unchanged
              ),
            }
            : post
        )
      );
    };


    //delete first comment in real-time to all followrs
    const handleDeletecomment = (DeleteComment) => {
      setPostdata((prevState) =>
        prevState.map((post) =>
          post._id === DeleteComment.post
            ? {
              ...post,
              comments: post.comments
                .filter((comment => comment._id !== DeleteComment._id))
            }  // Update only the comments field

            : post
        )
      );
    };
    //first comment like show in real-time to all followers
    const handleCommentlike = (CommentLike) => {

      setPostdata((prevState) =>
        prevState.map((post) =>
          post._id === CommentLike.post
            ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment._id === CommentLike._id
                  ? {
                    ...comment,
                    likes: [...CommentLike.likes]

                  } // Replace the likes array of the specific comment
                  : comment // Keep other comments unchanged
              ),
            }
            : post // Keep other posts unchanged
        )
      );
    };

    //first child comment in real-time to all followers   
    const handleCommentReply = ({ Comment, replyComment }) => {

      setPostdata((prevState) =>
        prevState.map((post) =>
          post._id === Comment.post // Check for the correct post
            ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment._id === Comment._id // Check for the correct comment
                  ? {
                    ...comment,
                    replies: comment.replies.some(replies => replies._id === replyComment._id) ?
                      comment.replies :
                      [replyComment, ...comment.replies]
                  }
                  : comment // Keep other comments unchanged
              ),
            }
            : post // Keep other posts unchanged
        )
      );
    };

    //first child comment edit in real-time to all followers  
    const handleCommentReplyEdit = ({ Comment, replyedit }) => {

      setPostdata((prevState) =>
        prevState.map((post) =>
          post._id === Comment.post // Check for the correct post
            ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment._id === Comment._id // Check for the correct comment
                  ? {
                    ...comment,
                    replies: comment.replies.map((reply) =>
                      reply._id === replyedit._id ? // Check for the correct reply
                        {
                          ...reply,
                          text: replyedit.text,
                          replies: reply.replies.map((replies) =>
                            replies.replytoid === replyedit._id ?
                              {
                                ...replies,
                                replytomsg: replyedit.text
                              }
                              : replies
                          )
                        }
                        : reply // Keep other replies unchanged
                    ),
                  }
                  : comment // Keep other comments unchanged
              ),
            }
            : post // Keep other posts unchanged
        )
      );
    };


    //first child comment edit in real-time to all followers  
    const handleCommentReplyDelete = ({ Comment, replyid }) => {

      setPostdata((prevState) =>
        prevState.map((post) =>
          post._id === Comment.post // Check for the correct post
            ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment._id === Comment._id // Check for the correct comment
                  ? {
                    ...comment,
                    replies: [...comment.replies.filter(replies => replies._id !== replyid)]
                  }
                  : comment // Keep other comments unchanged
              ),
            }
            : post // Keep other posts unchanged
        )
      );
    };


    //first child comment edit in real-time to all followers  
    const handleCommentReplyLike = ({ Comment, commentlike }) => {
      setPostdata((prevState) =>
        prevState.map((post) =>
          post._id === Comment.post // Check for the correct post
            ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment._id === Comment._id // Check for the correct comment
                  ? {
                    ...comment,
                    replies: comment.replies.map((reply) =>

                      reply._id === commentlike._id // If it's the reply to be liked
                        ? {
                          ...reply,
                          likes: [...commentlike.likes] // Add the like to the reply's likes array
                        }
                        : reply // Keep other replies unchanged
                    )
                  }
                  : comment // Keep other comments unchanged
              ),
            }
            : post // Keep other posts unchanged
        )
      );
    };


    const handleReplytoFirstchild = ({ Comment, recentcomment }) => {

      setPostdata((prevState) =>
        prevState.map((post) =>
          post._id === Comment.post // Check for the correct post
            ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment._id === Comment._id // Check for the correct comment
                  ? {
                    ...comment,

                    replies: comment.replies.map((reply) =>

                      reply._id === recentcomment.replytoid // If it's the reply to be liked

                        ? {
                          ...reply,

                          replies: reply.replies.some(replies => replies._id === recentcomment._id) ?

                            reply.replies : [recentcomment, ...reply.replies] // Add the like to the reply's likes array

                        }
                        : reply // Keep other replies unchanged
                    )
                  }
                  : comment // Keep other comments unchanged
              ),
            }
            : post // Keep other posts unchanged
        )
      );
    };

    const handlereplytoreplyEdit = ({ postid, recentcomment,replyid }) => {
      
      setPostdata((prevState) =>
        prevState.map((post) =>
          post._id === postid // Check for the correct post
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === recentcomment.commentid // Check for the correct comment
                    ? {
                        ...comment,
                        replies: comment.replies.map((reply) =>
                          reply._id === replyid // Check for the correct reply
                            ? {
                                ...reply,
                                replies: reply.replies.map((nestedReply) =>
                                  nestedReply._id === recentcomment._id // Check for the correct nested reply
                                    ? {
                                        ...nestedReply,
                                        text: recentcomment.text,
                                      }
                                    : nestedReply
                                ).map((nestedReplyReply) =>
                                  nestedReplyReply.replytoid === recentcomment._id
                                    ? {
                                        ...nestedReplyReply,
                                        replytomsg: recentcomment.text,
                                      }
                                    : nestedReplyReply
                                ),
                              }
                            : reply
                        ),
                      }
                    : comment
                ),
              }
            : post
        )
      );
    };
    

    const handlereplytoreplyDelete = ({ postid, recentcomment,replyid }) => {
      setPostdata((prevState) =>
        prevState.map((post) =>
          post._id === postid // Check for the correct post
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === recentcomment.commentid // Check for the correct comment
                    ? {
                        ...comment,
                        replies: comment.replies.map((reply) =>
                          reply._id === replyid // Check for the correct reply
                            ? {
                                ...reply,
                                replies:[...reply.replies.filter(replies=>replies._id !== recentcomment._id)]
                              }
                            : reply
                        ),
                      }
                    : comment
                ),
              }
            : post
        )
      );
    }; 

    const handlereplytoreplyLike = ({ postid, recentcomment, replyid }) => {
      console.log(replyid);
      console.log(recentcomment);
    
      setPostdata((prevState) =>
        prevState.map((post) =>
          post._id === postid // Check for the correct post
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === recentcomment.commentid // Check for the correct comment
                    ? {
                        ...comment,
                        replies: comment.replies.map((reply) =>
                          reply._id === replyid // Check for the correct reply
                            ? {
                                ...reply,
                                replies: reply.replies.map((replied) =>
                                  replied._id === recentcomment._id // Correct comparison
                                    ? {
                                        ...replied,
                                        likes: [...recentcomment.likes],
                                      }
                                    : replied
                                ),
                              }
                            : reply
                        ),
                      }
                    : comment
                ),
              }
            : post
        )
      );
    };
    

//last child

const handleReplytoLastchild = ({ Comment, recentcomment,replyid }) => {
  
  setPostdata((prevState) =>
    prevState.map((post) =>
      post._id === Comment.post // Check for the correct post
        ? {
          ...post,
          comments: post.comments.map((comment) =>
            comment._id === Comment._id // Check for the correct comment
              ? {
                ...comment,

                replies: comment.replies.map((reply) =>

                  reply._id === replyid // If it's the reply to be liked

                    ? {
                      ...reply,

                      replies: reply.replies.some(replies => replies._id === recentcomment._id) ?

                        reply.replies : [...reply.replies,recentcomment] // Add the like to the reply's likes array

                    }
                    : reply // Keep other replies unchanged
                )
              }
              : comment // Keep other comments unchanged
          ),
        }
        : post // Keep other posts unchanged
    )
  );
};
 




    //post work for  real-time 
    socket?.on('postdata', handlePostData);
    socket?.on('updatepost', handleUpdatepost)
    socket?.on('deletepost', handleDeletepost)
    socket?.on('likepost', handleLikepost)

    // first comment works for real-time
    socket?.on('postcomment', handlePostcomment)
    socket?.on('updatecomment', handleUpdatecomment)
    socket?.on('deletecommnet', handleDeletecomment)
    socket?.on('commentlike', handleCommentlike)

    //first childcomment work for real-time

    socket?.on('commentreply', handleCommentReply)
    socket?.on('commentreplyedit', handleCommentReplyEdit)
    socket?.on('commentreplydelete', handleCommentReplyDelete)
    socket?.on('commentreplylike', handleCommentReplyLike)

    //second childcomment work for real-time
    socket?.on('replytofirstchild', handleReplytoFirstchild)
    socket?.on('replytoreplyedit', handlereplytoreplyEdit)
    socket?.on('replytoreplydelete', handlereplytoreplyDelete)
    socket?.on('replytoreplylike', handlereplytoreplyLike)

    //last childcomment wor for real-time
    socket?.on('replytolastchild',handleReplytoLastchild)



    return () => {
      socket?.off('postdata', handlePostData);
      socket?.off('updatepost', handleUpdatepost);
      socket?.off('deletepost', handleDeletepost);
      socket?.off('likepost', handleLikepost);
      socket?.off('postcomment', handlePostcomment);
      socket?.off('updatecomment', handleUpdatecomment);
      socket?.off('deletecommnet', handleDeletecomment);
      socket?.off('commentlike', handleCommentlike);
      socket?.off('commentreply', handleCommentReply);
      socket?.off('commentreplyedit', handleCommentReplyEdit);
      socket?.off('commentreplydelete', handleCommentReplyDelete);
      socket?.off('commentreplylike', handleCommentReplyLike);
      socket?.off('replytofirstchild', handleReplytoFirstchild);
      socket?.off('replytoreplyedit', handlereplytoreplyEdit);
      socket?.off('replytoreplydelete', handlereplytoreplyDelete);
      socket?.off('replytoreplylike', handlereplytoreplyLike);
      socket?.off('replytolastchild',handleReplytoLastchild)

    };

  }, [socket]);

 
}

export default realtimepostcomment