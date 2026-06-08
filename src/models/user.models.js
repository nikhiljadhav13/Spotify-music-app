const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true, // This field is required
        unique: true //  This field must be unique across all documents in the collection
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['user', 'artist'],
        default: 'user'
    }
})

const userModel = mongoose.model('User',userSchema);

module.exports = userModel;