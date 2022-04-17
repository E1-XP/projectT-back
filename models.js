const mongoose = require("mongoose");

mongoose.set("debug", true);
mongoose.Promise = global.Promise;

const URL =
  "mongodb://e1-xp:admin@cluster0-shard-00-00-u2jzk.mongodb.net:27017,cluster0-shard-00-01-u2jzk.mongodb.net:27017,cluster0-shard-00-02-u2jzk.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";

mongoose.connect(URL, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
});

module.exports.URL = URL;
module.exports.User = require("./features/user/user.model");
module.exports.TimeEntry = require("./features/entries/entry.model");
