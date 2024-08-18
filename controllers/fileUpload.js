const multer = require("multer");
const path = require("path");
const uploadDir = "./uploads/";
const fs = require("fs");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = req.body["folderName"].split("@")[0];
    const folderPath = path.join(uploadDir, folderName);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const filename = file.fieldname + path.extname(file.originalname);
    cb(null, filename);
  },
});

const uploadFiles = multer({ storage: storage }).fields([
  { name: "file1", maxCount: 1 },
  { name: "file2", maxCount: 1 },
  { name: "file5", maxCount: 1 },
  { name: "file4", maxCount: 1 },
]);

const checkForCropping = async (files) => {
  const croppedFiles = [];
  for (const key in files) {
    if (key == "file1" && Object.hasOwnProperty.call(files, key)) {
      // Updated line
      const file = files[key][0];
      try {
        const { stdout } = await exec(`python detect_crop.py "${file.path}"`);
        if (stdout.trim() === "True") {
          croppedFiles.push(key);
        }
      } catch (e) {
        croppedFiles.push(key);
      }
    }
  }
  return croppedFiles;
};

const uploadFilesFunction = (req, res) => {
  uploadFiles(req, res, async (err) => {
    if (err) {
      console.error("Error uploading files:", err);
      return res.status(500).json({ error: "Error uploading files." });
    }
    if (!req.files) {
      return res.status(400).json({ error: "No files selected." });
    }

    res.status(200).json({ message: "Success" });
  });
};

module.exports = uploadFilesFunction;

// const multer = require('multer');
// const path = require('path');
// const uploadDir = './public/uploads/';
// const fs = require('fs');
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       const folderName = req.body['folderName'];
//       const folderPath = path.join(uploadDir, folderName);
//       if (!fs.existsSync(folderPath)) {
//         fs.mkdirSync(folderPath);
//       }
//       cb(null, folderPath);
//     },
//     filename: (req, file, cb) => {
//       const filename = file.fieldname + path.extname(file.originalname);
//       cb(null, filename);
//     }
//   });
//   const uploadFiles = multer({ storage: storage }).fields([
//     { name: 'file1', maxCount: 1 },
//     { name: 'file2', maxCount: 1 },
//     { name: 'file5', maxCount: 1 },
//     { name: 'file4', maxCount: 1 },
//   ]);
//   const uploadFilesFunction=(req, res) => {
//     uploadFiles(req, res, (err) => {
//       if (err) {
//         console.error('Error uploading files:', err);
//         return res.status(500).json({ error: 'Error uploading files.' });
//       }
//       if (!req.files) {
//         return res.status(400).json({ error: 'No files selected.' });
//       }
//       res.redirect(`https://${req.headers.host}/video?name=${req.body['folderName']}`);
//     });
//   }
//   module.exports=uploadFilesFunction
