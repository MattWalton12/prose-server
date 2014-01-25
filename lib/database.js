exports.autorun = true;

var mongoose = require("mongoose"),
    autoIncrement = require("mongoose-auto-increment");

var config = require("./config.js"),
    events = require("./events.js"),
    console = require("./console.js");

exports.init = function() {
    mongoose.connect(config.MongoHost);
    var con = mongoose.connection;

    autoIncrement.initialize(con);

    con.on("error", function(err) {
        console.error("Failed to connect to MongoDB server: " + err);
    });

    con.once("open", function() {
        events.call("DatabaseConnected");
        console.debug("Connected to MongoDB server");
    });
}