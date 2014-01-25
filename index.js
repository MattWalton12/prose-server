/*
    Prose VOIP Server
    Version 0.0.1

    19/01/2014

    Developed by llana Digital.
    https://llana.co
*/

var version = "0.0.1";
var fs = require("fs");
var colors = require("colors");

console.log("\n---------------------------------------------")
console.log("Prose server".cyan + " (" + version + ") initialising");
console.log("---------------------------------------------")

console.log("\nLoading libraries:".cyan);

var libs = fs.readdirSync(__dirname + "/lib");

for (i=0; i<libs.length; i++) {
    var module = require("./lib/" + libs[i]);

    if (module.autorun && module.init) {
        module.init();
        console.log("\t- " + libs[i].cyan)

    } else {
        console.log("\t- " + libs[i]);
    }
}


console.log("\nLoading routes:".cyan)

var routes = fs.readdirSync(__dirname + "/routes");

for (i=0; i<routes.length; i++) {
    var route = require("./routes/" + routes[i]);
    route.init();

    console.log("\t- " + routes[i]);
}

console.log("\n");