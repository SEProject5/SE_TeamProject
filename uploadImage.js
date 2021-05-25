const express = require('express');
const router = express.Router();
const multer = require("multer");

// multer-optional
var storage = multer.diskStorage({
 destination: (req, file, cb) => {
   cb(null, "uploads/");
 },
 filename: (req, file, cb) => {
   cb(null, `${Date.now()}_${file.originalname}`);
 },
});

var upload = multer({ storage: storage });


// Router
router.post("/banner", upload.single('img'), async(req, res, next) => {
  console.log('img middle OK');
  console.log(req.file.path);
  req.body.image = req.file.path
  next();
});

module.exports = router;