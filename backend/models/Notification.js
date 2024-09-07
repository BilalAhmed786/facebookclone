const mongoose = require('mongoose');

const Notifications = new mongoose.Schema({
        type: {
            type: String,
            enum: ['follow', 'like', 'comment'],
        },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        msg:{type:String,required:true},
        postId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        isread: { type: Boolean, default: false },
       }, { timestamps: true}
    );
module.exports = mongoose.model('Notification', Notifications);