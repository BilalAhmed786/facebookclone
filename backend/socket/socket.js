const { Server } = require('socket.io');
const { userLogedInn, userLoggedout } = require('../utils/userStatus');
const Message = require('../models/Messages');
const path = require('path');
const fs = require('fs').promises;
const cookie = require("cookie");
const jwt = require("jsonwebtoken");


function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST', 'DELETE', 'PUT'],
            credentials: true,
        },
        maxHttpBufferSize: 1e8,
    });

    io.on('connection', (socket) => {

       socket.on('userid', async (userId) => {

            socket.userId = userId; 
            
            socket.join(userId);

            await userLogedInn(userId); 

            io.emit('statusUpdate', { userId, status: 1 }); //emit to all loggedin user logedin userstatus(1)



        });

      //chatusertrack

        socket.on('chattracker',(data)=>{
           
            socket.broadcast.emit('chattracker',data)

        })

        
        socket.on('chatMessage', async (data) => { //for real-time chat
            const { files, senderId, receiverId, content, isreviewed } = data;

            const savedFiles = [];

            try {
                for (const file of files) { //if message has files stored into upload directory
                    const base64Data = file.data.split(',')[1];
                    const buffer = Buffer.from(base64Data, 'base64');
                    const uniqueFileName = `${Date.now()}-${file.name}`;
                    const uploadPath = path.join(__dirname, '../public/uploads', uniqueFileName);
                    await fs.writeFile(uploadPath, buffer);
                    savedFiles.push(uniqueFileName);
                }

                const chatMessage = new Message({
                    sender: senderId,
                    receiver: receiverId,
                    content: content || '',
                    files: savedFiles,
                    isreviewed
                });

                const savedMessage = await chatMessage.save();
                const populatedMessage = await Message.findById(savedMessage._id)
                    .populate('sender', 'name profilepicture')
                    .populate('receiver', 'name profilepicture');

                io.to(receiverId).emit('chatretreive', populatedMessage);
                io.to(senderId).emit('chatretreive', populatedMessage);

            } catch (error) {
                console.error('Error handling chatMessage:', error);
                socket.emit('error', 'An error occurred while sending the message.');
            }
        });



        //track login user currently chat with which friend
        // socket.on('friendinfo', (id) => {
         
        //     socket.broadcast.emit('friendinfo', id);

        // });

        //emit notification to logedin user to whom someone follow in real-time 
        socket.on('followuser', (followuser) => {

            io.to(followuser.receiver).emit('followuser', followuser)

        })

        //track loggedin user if its currently open notifications dropdown from topbar


        socket.on('followernotific', (msg) => {


            socket.broadcast.emit('followernotific', msg)


        })

        //post show all follower in real-time(image or text whatever)

        socket.on('postdata', (data) => {

            data.user.followers.forEach((followuser) => {

                io.to(followuser).emit('postdata', data);
            });
        });


        //after post edit show their user in real-time aswell

        socket.on('updatepost', (data) => {

            data.user.followers.map((followersid) => {


                io.to(followersid).emit('updatepost', data)


            })

        })

        //post delete to all followers in real-time
        socket.on('deletepost', (data) => {

            data.user.followers.map((followersid) => {

                io.to(followersid).emit('deletepost', data)


            })

        })

        //likepost any user emit to all followers 

        socket.on('likepost', (data) => {

            const user = []

            user.push(data.user._id)

            data.user.followers.map((followersid) => {

                user.push(followersid)


                io.to(user).emit('likepost', data)


            })

        })

        //first comment to a post

        socket.on('postcomment', (data) => {



            const user = []

            user.push(data.userdet.user._id)

            data.userdet.user.followers.map((followersid) => {

                user.push(followersid)


                io.to(user).emit('postcomment', data.recentcomment)


            })

        })

        //first comment edit

        socket.on('updatecomment', (data) => {


            const user = []

            user.push(data.userinfo.user._id)

            data.userinfo.user.followers.map((followersid) => {

                user.push(followersid)


                io.to(user).emit('updatecomment', data.recentcomment)


            })

        })

        //first comment delete

        socket.on('deletecommnet', (data) => {
            console.log(data)
            const user = []

            user.push(data.userinfo.user._id)

            data.userinfo.user.followers.map((followersid) => {

                user.push(followersid)


                io.to(user).emit('deletecommnet', data.recentcomment)



            })

        })

        socket.on('commentlike', (data) => {

            const user = []

            user.push(data.userinfo.user._id)

            data.userinfo.user.followers.map((followersid) => {

                user.push(followersid)


                io.to(user).emit('commentlike', data.recentcomment)



            })

        })

        //first replycomment 
       
        socket.on('commentreply', (data) => {

            const user = []

            user.push(data.userinfo.user._id)

            data.userinfo.user.followers.map((followersid) => {

                user.push(followersid)


            io.to(user).emit('commentreply', {Comment:data.recentcomment,replyComment:data.replycomment})



            })

        })

        socket.on('commentreplyedit', (data) => {

            const user = []

            user.push(data.userinfo.user._id)

            data.userinfo.user.followers.map((followersid) => {

                user.push(followersid)


            io.to(user).emit('commentreplyedit', {Comment:data.comment,replyedit:data.replyedit})



            })

        })  

        socket.on('commentreplydelete', (data) => {

            const user = []

            user.push(data.userinfo.user._id)

            data.userinfo.user.followers.map((followersid) => {

                user.push(followersid)


            io.to(user).emit('commentreplydelete', {Comment:data.comment,replyid:data.replyid})



            })

        }) 

        socket.on('commentreplylike', (data) => {

            const user = []

            user.push(data.userinfo.user._id)

            data.userinfo.user.followers.map((followersid) => {

                user.push(followersid)


            io.to(user).emit('commentreplylike', {Comment:data.comment,commentlike:data.commentlike})



            })

        })   

      //2nd reply comment  
        socket.on('replytofirstchild', (data) => {

            const user = []

            user.push(data.userinfo.user._id)

            data.userinfo.user.followers.map((followersid) => {

                user.push(followersid)


            io.to(user).emit('replytofirstchild', {Comment:data.comment,recentcomment:data.recentcomment})



            })

        })   

        socket.on('replytoreplyedit', (data) => {

            const user = []

            user.push(data.userinfo.user._id)

            data.userinfo.user.followers.map((followersid) => {

                user.push(followersid)


            io.to(user).emit('replytoreplyedit',
                 {
                postid:data.userinfo._id,
                recentcomment:data.recentcomment,
                replyid:data.replyid
            })



            })

        })  
        
        socket.on('replytoreplydelete', (data) => {

            const user = []

            user.push(data.userinfo.user._id)

            data.userinfo.user.followers.map((followersid) => {

                user.push(followersid)


            io.to(user).emit('replytoreplydelete', {
                postid:data.userinfo._id,
                recentcomment:data.recentcomment,
                replyid:data.replyid
            })



            })

        })  

        socket.on('replytoreplylike', (data) => {

            const user = []

            user.push(data.userinfo.user._id)

            data.userinfo.user.followers.map((followersid) => {

                user.push(followersid)


            io.to(user).emit('replytoreplylike',
                
                {
                    postid:data.userinfo._id,
                    recentcomment:data.recentcomment,
                    replyid:data.replyid
                })



            })

        })  

//last child

socket.on('replytolastchild', (data) => {

    const user = []

    user.push(data.userinfo.user._id)

    data.userinfo.user.followers.map((followersid) => {

        user.push(followersid)


    io.to(user).emit('replytolastchild', {Comment:data.comment,recentcomment:data.recentcomment,replyid:data.replyid})



    })

})   

        socket.on('disconnect', async () => {
                if(!socket.userId){
                    return
                }
              const user = await userLoggedout(socket.userId);
          
              if (user) {
                io.emit('statusUpdate', { userId: user._id, status: 0 });
            }
        });


    });

    return io;
}

module.exports = initializeSocket;
