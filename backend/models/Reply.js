const mongoose = require('mongoose');

const Reply2ReplySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    commentid:{type: mongoose.Schema.Types.ObjectId,required:true},
    replytoid:{type: mongoose.Schema.Types.ObjectId,required:true},
    replyto: { type: String, required: true },
    replytomsg: { type: String, required:true},
    text: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Add this line to track likes
}, {    
    timestamps: true
});
module.exports = mongoose.model('Reply', Reply2ReplySchema);