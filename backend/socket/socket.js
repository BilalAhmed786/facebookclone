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
            
            socket.join(userId);
            
            await userLogedInn(socket.id, userId);
           
            io.emit('statusUpdate', { userId, status: 1 });
            
            
            try {
                const messages = await Message.find({
                    $or: [{ sender: userId }, { receiver: userId }]
                })
                .populate('sender', 'name profilepicture')
                .populate('receiver', 'name profilepicture')
                .sort({ createdAt: 1 });
               
                socket.emit('chatretreive', messages);
            } catch (error) {
                console.error('Error fetching historical messages:', error);
            }
          
        
        });

        //frienduserinfo broadcost to all login users
        socket.on('friendinfo', (id) => {
            
    
            // Broadcasting the message to all other users
           
                socket.broadcast.emit('friendinfo',id);
           
        });
       
        socket.on('chatMessage', async (data) => {
            const { files, senderId, receiverId, content,isreviewed } = data;
            const savedFiles = [];
            
            try {
                for (const file of files) {
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
        
        
        socket.on('disconnect', async () => {
            console.log(`Client disconnected: ${socket.id}`);
            const user = await userLoggedout(socket.id);
            if (user) {
                io.emit('statusUpdate', { userId: user._id, status: 0 });
            }
        });

        socket.on('isreviewed', async (id) => {
            try {
                await Message.updateMany({ receiver: id }, { $set: { isreviewed: true } });
                io.to(id).emit('reviewstatus', 'changesuccess');
            } catch (error) {
                console.error('Error updating review status:', error);
            }
        });
    });

    return io;
}

module.exports = initializeSocket;
