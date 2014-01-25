exports.autorun = true;

var net = require("net"),
    schemaValidate = require("jsonschema").validate;

var config = require("./config.js"),
    events = require("./events.js"),
    util = require("./util.js"),
    accounts = require("./accounts.js"),
    console = require("./console.js");


var server;
var actions = [];

net.Socket.prototype.sendJSON = function(json) {
    this.write(JSON.stringify(json));
}

net.Socket.prototype.sendError = function(error) {
    this.sendJSON({
        "status" : "error",
        "error" : error
    });
}

net.Socket.prototype.sendSuccess = function(options) {
    var res = {
        "status" : "success"
    }

    if (options)
        res = res.concat(options);

    this.sendJSON(res);
}

exports.getServer = function() {
    return server;
}

function newConnection(socket) {
    events.call("NewTCPConnection", socket);
    console.debug("New TCP connection from " + socket.remoteAddress);

    socket.on("data", function(data) {
        data = data.toString().trim();
        var valid = util.validJSON(data);

        if (valid == true) {
            data = JSON.parse(data);
            events.call("TCPDataReceived", {socket: socket, data: data});

            if (data.action) {
                events.call("TCPAction", {socket: socket, action: data.action, data: data});

                var action = data.action;
                delete data.action;

                if (actions[action]) {

                    if (actions[action].auth) {
                        if (!socket.userid || !socket.token || !accounts.checkSession(socket.userid, socket.token)) {
                            socket.sendError("authentication required");
                            return;
                        }
                    }

                    var val = schemaValidate(data, actions[action].schema);

                    if (val.errors.length != 0) {
                        socket.sendError("invalid parameters");

                    } else {
                        actions[action].func(socket, data);
                    }
                }
            }

        } else {
            // todo: replace with get indentiy function
            console.warning("Invalid JSON from " + socket.remoteAddress);
            socket.sendError("invalid json");
        }
    });
}

exports.init = function(ip, port) {
    server = net.createServer(newConnection);

    server.listen(config.TCPPort, config.IP, function() {
        events.call("TCPBound", {
            ip: config.IP,
            port: config.TCPPort
        });

        console.debug("TCP server bound to port " + config.TCPPort);
    });

    server.on("error", function(e) {
        console.error("Failed to bind TCP server: " + e.code)
    });
}

exports.registerAction = function(name, auth, schema, func) {
    actions[name] = {
        schema: {
            type: Object,
            properties: schema
        },

        func: func,
        auth: auth
    };
}