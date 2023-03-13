import express from "express";
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();
const fs = require("fs");
const db = require("./database");
const AppError = require("./appError");
const multer = require("multer");
const csv = require("fast-csv");
const upload = require("./multer-config");
const path = require("path");
var storage = require("./multer-config");
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
  // res.send("Hello World!");
});

app.get("/error", (req, res) => {
  res.render("error");
});

function uploadCsv(path: any) {
  // console.log(path);
  let stream = fs.createReadStream(path);
  let csvDataCol: any[] = [];
  let fileStream = csv
    .parse()
    .on("data", function (data: any) {
      csvDataCol.push(data);
    })
    .on("end", function () {
      csvDataCol.shift();

      const query = "INSERT INTO LG_votes (APC,PDP,LP,NNPP) VALUES ?";

      db.query(query, [csvDataCol], (error: any, result: any) => {
        if (error) {
          console.log("This is the error", error);
          throw new AppError("ERROR DB");
        }
        // console.log(result);
      });
    });
  stream.pipe(fileStream);
}

app.post("/import-csv", upload.single("file"), async (req, res, error) => {
  const username = req.body.username;
  console.log(username);

  if (!req.file) {
    console.log("No file upload");
    return res.send("NO FILE UPLOADED");
  } else {
    if (!username) {
      return res.send("INPUT USERNAME");
    }
    const query = `SELECT * FROM Auth_users WHERE name = '${username}';`;
    db.query(query, (error: any, result: any) => {
      if (error) {
        throw new AppError("ERROR DB", 400);
      } else {
        if (result.length > 0) {
          uploadCsv(__dirname + "/uploads/" + req.file?.filename);
          return res.send("DONE");
        } else {
          return res.send("USER NOT ALLOWED");
        }
      }
    });
  }
});

app.use((req, res) => {
  res.status(404).send("Not found");
});

app.use((err: any, req: any, res: any, next: any) => {
  console.log("***********************");
  console.log("*******ERROR***********");
  const { status = 500, message = "something went wrong" } = err;
  res.status(500).send(message);
  // next(err);
});

app.listen(port, () => {
  return console.log(`Express is listening at ${port} G!`);
});
