import express from "express";
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();
const fs = require("fs");
const db = require("./database");
const multer = require("multer");
const csv = require("fast-csv");
// const upload = require("./multer-config");
const path = require("path");
// var storage = require("./multer-config");
const port = 3000;

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let storage = multer.diskStorage({
  destination: (req: any, file: any, callBack: any) => {
    callBack(null, path.join(__dirname, "/uploads/"));
  },
  filename: (req: any, file: any, callback: any) => {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
    // console.log(file.fieldname);
  },
});

let upload = multer({
  storage: storage,
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
  // res.send("Hello World!");
});

app.get("/error", (req, res) => {
  throw new Error("ERROR");
});

app.post("/import-csv", upload.single("file"), (req, res, error) => {
  if (!req.file) {
    console.log("No file upload");
  } else {
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
          const email = csvDataCol[0][1];
          // console.log(email);
          const doesArrayContainPassword = csvDataCol[0].includes("password");

          const query = "INSERT INTO Auth_users (name,email,password) VALUES ?";

          db.query(query, [csvDataCol], (error: any, result: any) => {
            if (error) {
              console.log("This is the error", error);
              res.send(error);
            }
            // console.log(result);
          });
        });
      stream.pipe(fileStream);
    }
    uploadCsv(__dirname + "/uploads/" + req.file?.filename);
  }
});

app.use((req, res) => {
  res.status(404).send("Not found");
});

app.use((err: any, req: any, res: any, next: any) => {
  console.log("***********************");
  console.log("*******ERROR***********");
  console.log("***********************");
  res.status(500).send("Error");
});

app.listen(port, () => {
  return console.log(`Express is listening at ${port} G!`);
});
