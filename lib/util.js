var json = require("json-toolkit"),
    md5 = require("MD5"),
    crypto = require("crypto");

exports.validJSON = function(str) {
    var v = json.validate(str);
    if (v == null) {
        return true;

    } else {
        return v;
    }
}

exports.token = function(unique, cb) {
    crypto.randomBytes(48, function(err, buf) {
        cb(md5(Date.now() + "/-" + unique + buf.toString("hex")));
    });
}