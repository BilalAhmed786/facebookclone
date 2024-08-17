const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: {type:Array, required:true},
    bgcolor:{type:String,default:""},
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    originalPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null }, 
    isShared: { type: Boolean, default: false },
    
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);
