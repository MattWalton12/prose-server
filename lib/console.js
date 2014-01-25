var log = console.log

var colors = require("colors");
var config = require("./config.js");
var events = require("./events.js");

exports.debug = function(message) {
    if (config.Debug) {
        events.call("debugMessage", message);
        console.log("[".white + "debug".cyan + ("]: " + message).white);
    }
}

exports.error = function(message) {
    events.call("errorMessage", message);
    console.log("[".white + "error".red + ("]: " + message).white);
}

exports.warning = function(message) {
    events.call("warningMessage", message);
    console.log("[".white + "warning".yellow + ("]: " + message).white);
}

exports.log = log;
