const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  //To Save in our disk
  destination: (req, file, cb) => {
    //Save in given destination
    let fileDestination = "public/uploads/";
    if (!fs.existsSync(fileDestination)) {
      //If file does not exists
      fs.mkdirSync(fileDestination, { recursive: true }); //recursive creates parent folder as well as sub folder
      cb(null, fileDestination);
    } else {
      cb(null, fileDestination);
    }
  },
  filename: (req, file, cb) => {
    //File name
    let filename = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    //Extension
    let ext = path.extname(file.originalname);
    cb(null, filename + "_" + Date.now() + ext);
  },
});

//Filter for type of file to be uploaded
let imageFilter = (req, file, cb) => {
  if (
    !file.originalname.match(/\.(jpg|png|pdf|jpeg|svg|JPG|PNG|PDF|JPEG|SVG)$/)
  ) {
    return cb(new Error("You can upload image file only"), false);
  } else {
    cb(null, true);
  }
};

let upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 9048000, //Max File Size i.e 9MB
  },
});

module.exports = upload;
