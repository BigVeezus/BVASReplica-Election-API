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

app.post("/import-csv", upload.single("file"), (req, res) => {
  if (!req.file) {
    console.log("No file upload");
  } else {
    // console.log(req.file?.filename);

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

          db.getConnection((error: any, connection: any) => {
            if (error) {
              console.log(error);
            } else {
              const query =
                "INSERT INTO Auth_users (name,email,password) VALUES ?";
              connection.query(
                query,
                [csvDataCol],
                (error: any, res: any) => {}
              );
            }
          });
        });
      stream.pipe(fileStream);
    }

    uploadCsv(__dirname + "/uploads/" + req.file?.filename);
    res.send("success");
  }
});

app.listen(port, () => {
  return console.log(`Express is listening at ${port} G!`);
});
