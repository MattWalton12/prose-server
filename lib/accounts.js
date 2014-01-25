exports.autorun = true;

var mongoose = require("mongoose"),
    autoIncrement = require("mongoose-auto-increment"),
    bcrypt = require("bcrypt-nodejs");

var util = require("./util.js"),
    events = require("./events.js"),
    tcp = require("./tcp.js");

function hashPassword(val) {
    return bcrypt.hashSync(val);
}

var UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, set: hashPassword},

    nickname: {type: String},

    permissions: {type: Array},

    steam: {
        id: {type: String},
        name: {type: String},
        avatar: {type: String}
    }
});

/*
    Accounts stuff

    To-do: validation on pretty much every function
*/

exports.create = function(username, password, cb) {
    exports.userModel.nextCount(function(err, count) {
        var user = new exports.userModel({username: username, password: password});
        user.save();

        cb(null, count);
    });
}

exports.login = function(username, password, cb) {
    exports.userModel.findOne({username: username}, function(err, data) {
        if (data) {

            if (bcrypt.compareSync(password, data.password)) {
                cb(null, data.userid);

            } else {
                cb("invalid-credentials");
            }

        } else {
            cb("invalid-credentials");
        }
    });
}

exports.setNickname = function(userid, nickname, cb) {
    exports.userModel.findOne({userid: userid}, function(err, data) {
        if (data) {
            data.nickname = nickname;
            data.save();

            cb();

        } else {
            cb("user not found");
        }
    });
}

/*
    Session stuff
*/

exports.createSession = function(userid, cb) {
    if (exports.sessions[userid]) {
        cb("session-exists");

    } else {
        util.token(userid.toString(), function(token) {
            exports.sessions[userid] = {
                token: token,
                time: Date.now(),
                valid: true
            };

            cb(null, token);
        });
    }
}

exports.checkSession = function(userid, token) {
    return (exports.sessions[userid] && (exports.sessions[userid].token == token) && exports.sessions[userid].valid);
}

exports.init = function() {
    events.on("DatabaseConnected", function() {
        UserSchema.plugin(autoIncrement.plugin, {model: "user", field: "userid", startAt: 1});
        exports.userModel = mongoose.model("user", UserSchema);
    });

    exports.sessions = [];
}