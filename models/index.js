const mongoose = require("mongoose");

mongoose.set("debug", true);
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://e1xp:admin@ds255958.mlab.com:55958/auth", {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
});

module.exports.User = require("./user");
module.exports.TimeEntry = require("./entry");
