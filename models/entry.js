const mongoose = require('mongoose');

const TimeEntrySchema = new mongoose.Schema({
    start: {
        type: Number,
        default: Date.now,
        required: true
    },
    stop: Number,
    description: String,
    project: String,
    billable: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

TimeEntrySchema.pre('remove', function (next) {
    User.findById(this.userId).then(user => {
        user.entries.remove(this.id);
        user.save().then(function (e) {
            next();
        }).catch(err => console.log(err));
    })
});

const TimeEntry = mongoose.model('TimeEntry', TimeEntrySchema);
module.exports = TimeEntry;
