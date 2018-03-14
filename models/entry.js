const mongoose = require('mongoose');

const TimeEntrySchema = new mongoose.Schema({
    start: {
        type: mongoose.Schema.Types.Mixed,
        default: Date.now,
        required: true
    },
    stop: mongoose.Schema.Types.Mixed,
    description: String,
    project: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

const TimeEntry = mongoose.model('TimeEntry', TimeEntrySchema);
module.exports = TimeEntry;
