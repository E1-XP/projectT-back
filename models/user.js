const mongoose = require('mongoose'),
    bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    entries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeEntry'
    }]
})

UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, 10).then(function (securedPass) {
        user.password = securedPass;
        next();
    }, function (err) { next(err) })
});

const User = mongoose.model('User', UserSchema);
module.exports = User;