// Hook system to make managing events easier.

var events = {};

exports.on = function(name, func) {
    if (!events[name])
        events[name] = [];

    events[name].push(func);
}

exports.call = function(name, arguments) {
    if (events[name]) {
        for (i=0; i<events[name].length; i++) {
            events[name][i](arguments);
        }
    }
}
