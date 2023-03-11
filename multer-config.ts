const multer = require("multer");

// Multer Config

let storage = multer.diskStorage({
  destination: (req: any, file: any, callback: any) => {
    callback(null, "./uploads");
  },
});

module.exports = storage;
