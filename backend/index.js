const express = require('express');
require('dotenv').config()
require('./database/db')
const cookieParser = require('cookie-parser');
const path = require('path');
const authrize = require('./middleware/verifyuser')
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const usersRoutes = require('./routes/users');

const app = express();

app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded({extended:true}))   
app.use(express.static(path.join(__dirname,'public')))
app.use('/api/auth', authRoutes);
app.use('/api/posts',authrize, postRoutes);
app.use('/api/comments',authrize, commentRoutes);
app.use('/api/users',authrize, usersRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
