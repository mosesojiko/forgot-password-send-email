const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        min: 6,
        max: 225
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Email already exist'],
        max: 225,
        min: 6
    },
    password: {
        type: String,
        required: true,
        
        max: 1024,
        min:6
    }
})
module.exports = mongoose.model('User', userSchema,)