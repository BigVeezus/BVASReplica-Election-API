"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const AppError = require("./appError");
const multer = require("multer");
const csv = require("fast-csv");
const upload = require("./multer-config");
const path = require("path");
var storage = require("./multer-config");
const port = 3000;
app.set("view engine", "ejs");
app.use(express_1.default.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
    // res.send("Hello World!");
});
app.get("/error", (req, res) => {
    res.render("error");
});
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
        const query = "INSERT INTO LG_votes (APC,PDP,LP,NNPP) VALUES ?";
        db.query(query, [csvDataCol], (error, result) => {
            if (error) {
                console.log("This is the error", error);
                throw new AppError("ERROR DB");
            }
            // console.log(result);
        });
    });
    stream.pipe(fileStream);
}
app.post("/import-csv", upload.single("file"), (req, res, error) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    console.log(username);
    if (!req.file) {
        console.log("No file upload");
        return res.send("NO FILE UPLOADED");
    }
    else {
        if (!username) {
            return res.send("INPUT USERNAME");
        }
        const query = `SELECT * FROM Auth_users WHERE name = '${username}';`;
        db.query(query, (error, result) => {
            var _a;
            if (error) {
                throw new AppError("ERROR DB", 400);
            }
            else {
                if (result.length > 0) {
                    uploadCsv(__dirname + "/uploads/" + ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename));
                    res.send("DONE");
                }
                else {
                    return res.send("USER NOT ALLOWED");
                }
            }
        });
    }
}));
app.use((req, res) => {
    res.status(404).send("Not found");
});
app.use((err, req, res, next) => {
    console.log("***********************");
    console.log("*******ERROR***********");
    const { status = 500, message = "something went wrong" } = err;
    res.status(500).send(message);
    // next(err);
});
app.listen(port, () => {
    return console.log(`Express is listening at ${port} G!`);
});
//# sourceMappingURL=index.js.map