var mysql = require("mysql");
var  util = require("util");
var conn = mysql.createConnection({
    "host":"bx1vaxcq0en7l5bwgsxl-mysql.services.clever-cloud.com",
    "user":"ubdlmkybsf8b9y2f",
    "password":"OLUnv1xJD8LuWkLdaCaO",
    "database":"bx1vaxcq0en7l5bwgsxl"
});

var exe = util.promisify(conn.query).bind(conn);

module.exports = exe;
