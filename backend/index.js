const express = require('express');
require('dotenv').config()
require('./database/db')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const path = require('path');
const authorize = require('./middleware/verifyuser')
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const usersRoutes = require('./routes/users');
const usernotification = require('./routes/notification');
const chatmessages = require('./routes/chatmessages');
const initializeSocket = require('./socket/socket')
const {createServer}  = require('http');
const app = express();
const server = createServer(app);

initializeSocket(server);



app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded({extended:true}))   
app.use(express.static(path.join(__dirname,'public')))
app.use(cors({

    origin:'http://localhost:5173',
    credentials:true

}))
app.use('/api/auth', authRoutes);
app.use('/api/posts',authorize, postRoutes);
app.use('/api/comments',authorize,commentRoutes);
app.use('/api/users',authorize, usersRoutes);
app.use('/api/notification',authorize, usernotification);
app.use('/api/livechat',authorize, chatmessages);



server.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
