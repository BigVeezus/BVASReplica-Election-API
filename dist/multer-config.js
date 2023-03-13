"use strict";
const multer = require("multer");
const path = require("path");
// Multer Config
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
module.exports = storage;
module.exports = upload;
//# sourceMappingURL=multer-config.js.map