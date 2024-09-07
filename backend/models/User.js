const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    socketid: {type:String,default:''},
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    retypepassword: { type: String, required: true },
    profilepicture: { type: String, default: "" },
    coverpicture: { type: String, default: "" },
    status:{ type:Number, default:0 },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isAdmin: { type:Boolean, default:false},
    city: { type: String, max:50 },
    from: { type: String, max: 50 },
    relationship: { type:String,default:"single"},
    
}, {
    timestamps: true
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.retypepassword = await bcrypt.hash(this.retypepassword, salt);
    next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
