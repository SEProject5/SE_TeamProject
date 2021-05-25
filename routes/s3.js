const express = require('express');
const router = express.Router();
const path = require("path");
const multer = require("multer");
const multerS3 = require('multer-s3');
const app = require('../app');
const awsConfigRouter = require('../config/awsconfig.json');
const AWS = require("aws-sdk");
let s3 = new AWS.S3();
const asd = require('../')
AWS.config.loadFromPath("../config/awsconfig.json");

let upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "shoppers5", //버킷이름
    key: function (req, file, cb) {
      let extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension)
    }, //S3에 저장될 파일이름
    acl: 'public-read-write',
  })
})

router.post('/upload', /*upload.single("imgFile"),*/ function(req, res, next){
  console.log("1");
  // let imgFile = req.;
  console.log(imgFile);

  res.json(imgFile);
})

router.get('/upload', function(req, res, next) {
  res.render('upload');
});


module.exports = router;