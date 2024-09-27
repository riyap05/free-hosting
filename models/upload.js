// models/Upload.js

const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    uploadTimestamp: {
        type: Date,
        default: Date.now,
    },
    hostedUrl: {
        type: String,
        required: true,
    }
});

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;
