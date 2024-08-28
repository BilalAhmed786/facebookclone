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

    io.on('connection', async (socket) => {



        socket.on('userid', async (userId) => {

            await userLogedInn(socket.id, userId);

            socket.join(userId); //every loginuser will join chat



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

                // Send messages back to loginuser and to whom it send
                io.to(receiverId).emit('chatretreive', populatedMessage);
                io.to(senderId).emit('chatretreive', populatedMessage);

                console.log('Message saved and emitted successfully');

            } catch (error) {
                console.error('Error handling chatMessage:', error);
            }
        });

        socket.on('disconnect', async () => {
            console.log(`Client disconnected: ${socket.id}`);
            await userLoggedout(socket.id);
        });


        //for update notification 
        socket.on('isreviewed', async (id) => {
            try {

                await Message.updateMany({ receiver: id }, { $set: { isreviewed: true } });

               io.to(id).emit('reviewstatus','changesuccess')
                
               console.log('isreview updated')
            
            } catch (error) {

                console.log(error)
            }



        })
    });

    return io;
}

module.exports = initializeSocket;
