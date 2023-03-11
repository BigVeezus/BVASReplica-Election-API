"use strict";
const express = require("express");
const mysql = require("mysql");
const db = mysql.createPool({
    connectionLimit: 10,
    acquireTimeout: 100000,
    host: "localhost",
    user: "root",
    database: "Election_ng",
    password: "",
});
db.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
    if (error) {
        throw error;
    }
    console.log("The solution is: ", results[0].solution);
    console.log("MY SQL DATABASE CONNECTED PROPERLY!");
});
module.exports = db;
//# sourceMappingURL=database.js.map