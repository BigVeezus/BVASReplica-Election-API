const multer = require("multer");
const path = require("path");

// Multer Config
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

module.exports = storage;
module.exports = upload;
