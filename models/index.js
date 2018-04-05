const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://e1xp:admin@ds255958.mlab.com:55958/auth', {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE
});

// mongoose.connect('mongodb://localhost/auth', {
//     keepAlive: true,
//     reconnectTries: Number.MAX_VALUE
// });

module.exports.User = require('./user');
module.exports.TimeEntry = require('./entry');

// console.log('v:', entry[field]);

// entry.save().then(function (err) {
//     if (err) console.log(err);

//     db.TimeEntry.find({ userId: userid })
//         .then(foundEntries => res.status(200).json(foundEntries));
// });