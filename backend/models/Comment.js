        const mongoose = require('mongoose');

    const ReplySchema = new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },       
        text: { type: String, required: true },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Add this line to track likes
        replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }] // Allow nested replies
        }, {
        timestamps: true
        }); 

        const CommentSchema = new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
        text: { type: String, required: true },
        replies: [ReplySchema], 
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Add this line to track likes
        }, {
        timestamps: true
        });

        module.exports = mongoose.model('Comment', CommentSchema);
