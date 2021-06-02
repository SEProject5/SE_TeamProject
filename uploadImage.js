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
  console.log("이미지 저장 후 바디 : ",req.body)
  req.body.file = req.file.path
  next();
});

router.patch("/product/:p_id", upload.single('img'), async(req, res, next) => {
  console.log('img middle OK');
  console.log(req.body);
  if( req.body.img ) {
      let product = await Product.update({
        p_name: req.body.p_name,
        description: req.body.description,
        categoryName: req.body.categoryName,
        price: req.body.price,
        stock: req.body.stock,
        file: req.body.file,
        delivery_cost: req.body.delivery_cost,
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

// /*
// router.post("/product", upload.array('img'), async(req, res, next) => {
//   console.log('img middle OK');
//   console.log(req.files);
//   req.body.file1 = req.files[0].path
//   req.body.file2 = req.files[1].path
//   req.body.file3 = req.files[2].path
//   if(req.files[1].path === undefined) {
//     req.body.file2 = null
//   } else {
//     req.body.file2 = req.files[1].path
//   }
//   if(req.files[2].path === undefined) {
//     req.body.file3 = null
//   } else {
//     req.body.file3 = req.files[2].path
//   }
//   next();
// });
//
// router.patch("/product/:p_id", upload.array('img', 3), async(req, res, next) => {
//   console.log('img middle OK');
//   if( req.body.img ) {
//     console.log("이미지 수정X")
//       let product = await Product.update({
//         p_name: req.body.p_name,
//         description: req.body.description,
//         categoryName: req.body.categoryName,
//         price: req.body.price,
//         stock: req.body.stock,
//         exist : 1,
//         updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
//     }, {
//         where : {p_id : req.params.p_id}
//     })
//     return res.status(200).json(product);
//   }
//   else {
//     req.body.file1 = req.files[0].path
//     req.body.file2 = req.files[1].path
//     req.body.file3 = req.files[2].path
//   }
//   next();
// });*/
/*
router.post("/product", upload.array('img'), async(req, res, next) => {
  console.log('img middle OK');
  console.log(req.files);
  console.log(req.files);
  if(!req.files[0]) {
    req.body.file1 = null
  } else {
    req.body.file1 = req.files[0].path
  }
  if(!req.files[1]) {
    req.body.file2 = null
  } else {
    req.body.file2 = req.files[1].path
  }
  if(!req.files[2]) {
    req.body.file3 = null
  } else {
    req.body.file3 = req.files[2].path
  }
  next();
}); 

router.patch("/product/:p_id", upload.array('img', 3), async(req, res, next) => {
  console.log('img middle OK');
  if( req.body.img ) { 
    console.log("이미지 수정X")
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
    if(!req.files[0]) {
      req.body.file1 = null
    } else {
      req.body.file1 = req.files[0].path
    }
    if(!req.files[1]) {
      req.body.file2 = null
    } else {
      req.body.file2 = req.files[1].path
    }
    if(!req.files[2]) {
      req.body.file3 = null
    } else {
      req.body.file3 = req.files[2].path
    }
  }
  next();
}); */

module.exports = router;