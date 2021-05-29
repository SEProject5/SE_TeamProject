const express = require('express');
const router = express.Router();
const multer = require("multer");
const Banner = require('./models/banner');
const Product = require('./models/product');
var moment = require('moment');

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
  console.log("이미지 저장 후 바디 : ",req.body)
  req.body.file = req.file.path
  next();
});

router.patch("/banner/:id", upload.single('img'), async(req, res, next) => {
  console.log('img middle OK');
  console.log(req.body);
  if( req.body.img ) {
      await Banner.update({
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        banner_type: req.body.banner_type,
        title: req.body.title,
        description: req.body.description,
      },
      {
          where: {id: req.params.id},
      });
      banner = await Banner.findOne({
          attributes: ['id','startDate','endDate','banner_type','title', 'description','file'],
          where: {id: req.params.id}})
      return res.json(banner);
    }
  else { 
    req.body.file = req.file.path
  }
  next();
});

router.post("/product", upload.single('img'), async(req, res, next) => {
  console.log('img middle OK');
  console.log(req.file)
  req.body.file = req.file.path
  next();
});

router.patch("/product/:p_id", upload.single('img'), async(req, res, next) => {
  console.log('img middle OK');
  if( req.body.img ) {
      let product = await Product.update({
        p_name: req.body.p_name,
        description: req.body.description,
        categoryName: req.body.categoryName,
        price: req.body.price,
        stock: req.body.stock,
        exist : 1,
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }, {
        where : {p_id : req.params.p_id}
    })
    return res.status(200).json(product);
  }
  else { 
    req.body.file = req.file.path
  }
  next();
});

module.exports = router;