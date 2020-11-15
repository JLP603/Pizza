var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    order: {
        type: String,
        required: false,
    },
    special_instructions: {
        type: String,
        required: false,
    },
    date_time: {
        type: Date,
        required: true
    },
    is_completed: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Order', OrderSchema);