let express = require('express');
let app = express();
let router = express.Router();
const { IsAdmin } = require('./middlewares');
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
const Product = require('../models/product')
const Category = require('../models/category');


// router.get('/sort', async (req, res, next) => {
//     // let product = req.body;
//     console.log("product/sort exceed");
//     // console.log(product);
//     console.log("1");
//     // let order = req.query.order;
//     // if(!product){
//         let product = [
//                 {price : 'b'},
//                 {price : 'a'},
//                 {price : 'c'},
//         ]
//     // }
//     console.log("2");
//     console.log(product[0].price);
//     console.log(product[1]);
//     console.log(product[2]);
//     console.log("3");
//     product.sort(price);
//     let productSorted = product.sort(<price>);
//     console.log(product);
//     console.log(productSorted);
//
//     // switch (order){
//     //     case "priceASC":
//     //         break;
//     //     case "priceDESC":
//     //         break;
//     //     case "nameASC":
//     //         break;
//     //     case "nameDESC":
//     //         break;
//     //     case "timeASC":
//     //         break;
//     //     case "timeDESC":
//     //         break;
//     //     default :
//     //         break;
//     // }
// })
// 등록된 product 보기
router.get('/', async (req, res, next) => {
    console.log("get /products");
    try{
        console.log(Product.findAll({}));
        let products = await Product.findAll({});
        return res.status(200).json(products);
    }catch (err){
        return res.status(400).json(err);
    }
})



//product 상세 페에지
router.get('/:p_id', async (req, res, next) => {
    let productID = req.params.p_id;
    try {
        let product = await Product.findOne({where: {p_id: productID}});
        return res.status(200).json(product);
    }catch (err){
        return res.status(400).json(err);
    }
})

// product 카테고리 별로 정리
router.get('/category/:categoryID', async (req, res, next) => {
    let categoryID = req.params.categoryID;
    try {
        let category = await Category.findOne({where : {cat_id : categoryID}});
        console.log(category);
        console.log(category[0]);
        if (category[0].cat_pid === 0) {
            // pool.query('SELECT * FROM category AS cat INNER JOIN product AS pro ON cat.cat_id=pro.cat_id WHERE cat_pid=? && pro.exist=1', categoryID,
            let categories = await Category.findAll({where : {cat_pid : categoryID}});
            console.log(categories);
            // for(let cat : categories){
            //     console.log(cat);
            // }
            //수정하기
        }else {
            let products = await Product.findAll({where: {cat_id: categoryID}});
            return res.status(200).json(products);
        }
    }catch (err){
        return res.status(400).json(err);
    }
});

//post
router.post('/', async (req, res, next) => {
    try {
        let product = await Product.create({
            p_name: req.body.p_name,
            description: req.body.description,
            cat_id: req.body.cat_id,
            price: req.body.price,
            stock: req.body.stock,
            file: req.body.file,
            exist : 1,
            regist_time : moment().format('YYYY-MM-DD HH:mm:ss'),
            createdAt : moment().format('YYYY-MM-DD HH:mm:ss')
        });
        return res.status(200).send(product);
    } catch (err) {
        return res.status(400).json(err);
    }
})

//patch
router.patch('/:p_id', IsAdmin, async (req, res, next)=> {
    let {p_name, description, cat_id, price, stock} = req.body;
    try{
        let product = await Product.update({
                p_name: req.body.p_name,
                description: req.body.description,
                cat_id: req.body.cat_id,
                price: req.body.price,
                stock: req.body.stock,
                file: req.body.file,
                exist : 1,
                updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            }, {
                where : {p_id : req.params.p_id}
            }
        )
        return res.status(200).json(product);
    }catch (err){
        return res.status(400).json(err);
    }
})

//delete
router.delete('/:p_id', IsAdmin, async (req, res, next) => {
    let productID = req.params.p_id;
    try{
        let product = await Product.update({
            p_name: req.body.p_name,
            description: req.body.description,
            cat_id: req.body.cat_id,
            price: req.body.price,
            stock: req.body.stock,
            file: req.body.file,
            exist : 0,
            deletedAt: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        return res.status(200).json(product);
    }catch (err){
        return res.status(400).json(err);
    }
});

module.exports = router;