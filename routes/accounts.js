var tcp = require("./../lib/tcp.js");
var accounts = require("./../lib/accounts.js");

exports.init = function() {
    tcp.registerAction("login", false, {
        username: {type: String, required: true},
        password: {type: String, required: true}

    }, function(socket, data) {
        accounts.login(data.username, data.password, function(err, userid) {
            if (err) {
                socket.sendError(err);

            } else {
                accounts.createSession(userid, function(err, token) {
                    if (err) {
                        socket.sendError(err);

                    } else {
                        socket.userid = userid;
                        socket.token = token;

                        socket.sendJSON({
                            status: "success",
                            userid: userid,
                            token: token
                        });
                    }
                });
            }
        });
    });

    tcp.registerAction("create-account", false, {
        username: {type: String, required: true},
        password: {type: String, required: true},
        serverKey: {type: String, required: true}

    }, function(socket, data) {
        // todo: implement serverkey to stop foreigners from joining >:(

        var user = accounts.create(data.username, data.password, function(err, userid) {
            socket.sendSuccess({
                userid: userid
            });
        });
    });

    tcp.registerAction("set-nickname", true, {
        nickname: {type: String, required: true}

    }, function(socket, data) {
        accounts.setNickname(socket.userid, data.nickname, function(err, userid) {
            if (err) {
                socket.sendError(err);

            } else {
                socket.sendSuccess();
            }
        });
    });
}