var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    user_type: {
        type: String,
        required: true,
    },
    current_order: {
        type: String,
        required: false,
    }
});

module.exports = mongoose.model('User', UserSchema);