import express from "express";
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();
const db = require("./database");
const multer = require("multer");
var storage = require("./multer-config");
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
  // res.send("Hello World!");
});

app.post("import-csv", (req, res) => {});

app.listen(port, () => {
  return console.log(`Express is listening at ${port} G!`);
});
