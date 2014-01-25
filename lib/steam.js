var accounts = require("./accounts.js");

exports.link = function(userid, steamid, cb) {
    accounts.userModel.findOne({userid: userid}, function(err, data) {
        if (data) {
            data.steam.id = steamid;
            data.save();

            cb();

        } else {
            cb("user not found");
        }
    });
}