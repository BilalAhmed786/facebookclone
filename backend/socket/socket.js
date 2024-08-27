const { Server } = require('socket.io');
const { userLogedInn, userLoggedout } = require('../utils/userStatus');
const Message = require('../models/Messages');
const path = require('path');
const fs = require('fs').promises;

function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173', // Update this to match your React app's URL
            methods: ['GET', 'POST', 'DELETE', 'PUT'],
            credentials: true,
        },
        maxHttpBufferSize: 1e8 // Setting buffer size for large file uploads
    });

    // A map to keep track of users' current chat partners
    const activeChats = new Map();

    io.on('connection', async (socket) => {
        

        
        socket.on('userid', async (userId) => {
           
            await userLogedInn(socket.id, userId);
            socket.join(userId); // User joins their own room
           
            socket.userId = userId;
           

     // get loginuser send and receive messages from database
            try {
                const messages = await Message.find({
                    $or: [
                        { sender: userId },
                        { receiver: userId }
                    ]
                })
                .populate('sender', 'name profilepicture')
                .populate('receiver', 'name profilepicture')
                .sort({ createdAt: 1 }); // Sort by creation date in ascending order

                socket.emit('chatretreive', messages);
            } catch (error) {
                console.error('Error fetching historical messages:', error);
            }
        });

        // Track the active chat partner
        socket.on('openChat', (friendId) => {
            activeChats.set(socket.userId, friendId);
            
            // Mark messages from this friend as reviewed
            Message.updateMany(
                { sender: friendId, receiver: socket.userId, isreviewed: false },
                { $set: { isreviewed: true } },
                (err) => {
                    if (err) {
                        console.error('Error updating message review status:', err);
                    }
                }
            );
        });

        // Handle chat message
        socket.on('chatMessage', async (data) => {
            const { files, senderId, receiverId, content } = data;
            const savedFiles = [];

            try {
                await Promise.all(files.map(async (file) => {
                    const base64Data = file.data.split(',')[1];
                    const buffer = Buffer.from(base64Data, 'base64');
                    const uploadPath = path.join(__dirname, '../public/uploads', file.name);
                    await fs.writeFile(uploadPath, buffer);
                    savedFiles.push(file.name);
                }));

                const chatMessage = new Message({
                    sender: senderId,
                    receiver: receiverId,
                    content: content || '',
                    files: savedFiles,
                });

                const savedMessage = await chatMessage.save();
               
                const populatedMessage = await Message.findById(savedMessage._id)
                    .populate('sender', 'name profilepicture')
                    .populate('receiver', 'name profilepicture');

                // Send messages back tologinuser and to whom it send message
                io.to(receiverId).emit('chatretreive', populatedMessage);
                io.to(senderId).emit('chatretreive', populatedMessage);

                // Check if the receiver is not actively chatting with the sender
                const currentChatPartner = activeChats.get(receiverId);
                if (currentChatPartner !== senderId) {
                    // Send a notification to the receiver if they are not actively chatting with the sender
                    io.to(receiverId).emit('newNotification', populatedMessage);
                }

                console.log('Message saved and emitted successfully');

            } catch (error) {
                console.error('Error handling chatMessage:', error);
            }
        });

        socket.on('closeChat', () => {
            activeChats.delete(socket.userId);
        });

        socket.on('disconnect', async () => {
            console.log(`Client disconnected: ${socket.id}`);
            activeChats.delete(socket.userId);
            await userLoggedout(socket.id);
        });
    });

    return io;
}

module.exports = initializeSocket;
