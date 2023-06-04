const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ForgotpasswordSchema = new Schema({

    active: {
        type: Boolean,
        default: true
    },
    expiresby: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }    
})

module.exports = mongoose.model('forgotpassword',ForgotpasswordSchema);