"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = (0, express_1.default)();
const fs = require("fs");
const db = require("./database");
const multer = require("multer");
const csv = require("fast-csv");
// const upload = require("./multer-config");
const path = require("path");
// var storage = require("./multer-config");
const port = 3000;
app.use(express_1.default.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, path.join(__dirname, "/uploads/"));
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
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
    var _a;
    if (!req.file) {
        console.log("No file upload");
    }
    else {
        function uploadCsv(path) {
            // console.log(path);
            let stream = fs.createReadStream(path);
            let csvDataCol = [];
            let fileStream = csv
                .parse()
                .on("data", function (data) {
                csvDataCol.push(data);
            })
                .on("end", function () {
                csvDataCol.shift();
                const email = csvDataCol[0][1];
                // console.log(email);
                const doesArrayContainPassword = csvDataCol[0].includes("password");
                const query = "INSERT INTO Auth_users (name,email,password) VALUES ?";
                db.query(query, [csvDataCol], (error, result) => {
                    if (error) {
                        console.log("This is the error", error);
                        res.send(error);
                    }
                    // console.log(result);
                });
            });
            stream.pipe(fileStream);
        }
        uploadCsv(__dirname + "/uploads/" + ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename));
    }
});
app.use((req, res) => {
    res.status(404).send("Not found");
});
app.use((err, req, res, next) => {
    console.log("***********************");
    console.log("*******ERROR***********");
    console.log("***********************");
    res.status(500).send("Error");
});
app.listen(port, () => {
    return console.log(`Express is listening at ${port} G!`);
});
//# sourceMappingURL=index.js.map