const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    retypepassword: { type: String, required: true },
    profilepicture: { type: String, default: "" },
    coverpicture: { type: String, default: "" },
    followers: { type:Array, default:[] },
    following: { type: Array, default:[]},
    isAdmin: { type:Boolean, default:false},
    city: { type: String, max:50 },
    from: { type: String, max: 50 },
    relationship: { type:Number,enum:[1,2,3]},
    
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
