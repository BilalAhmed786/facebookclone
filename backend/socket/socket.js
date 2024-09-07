const { Server } = require('socket.io');
const { userLogedInn, userLoggedout } = require('../utils/userStatus');
const Message = require('../models/Messages');
const path = require('path');
const fs = require('fs').promises;

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
            
            socket.join(userId);//every loggedin user connect to socket
            
            await userLogedInn(socket.id, userId); // login user status online(1)
           
            io.emit('statusUpdate', { userId, status: 1 }); //emit to all loggedin user logedin userstatus(1)
            
            
           
        });

        socket.on('chatMessage', async (data) => { //for real-time chat
            const { files, senderId, receiverId, content,isreviewed } = data;

            console.log(isreviewed)
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
        socket.on('friendinfo', (id) => {
            
            socket.broadcast.emit('friendinfo',id);
           
        });

       //emit notification to logedin user to whom someone follow in real-time 
        socket.on('followuser',(followuser)=>{

             io.to(followuser.receiver).emit('followuser',followuser)
   
})

    //track loggedin user if its currently open notifications dropdown from topbar


         socket.on('followernotific',(msg)=>{


         socket.broadcast.emit('followernotific',msg)


    })
    
       
     
    socket.on('disconnect', async () => {
            console.log(`Client disconnected: ${socket.id}`);
            const user = await userLoggedout(socket.id);
            if (user) {
                io.emit('statusUpdate', { userId: user._id, status: 0 });
            }
        });

       
    });

    return io;
}

module.exports = initializeSocket;
