let express = require('express');
let app = express();
let router = express.Router();
const { ASCSortOrder, DESCSortOrder} = require('../middlewares');
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
const Product = require('../models/product')
const Category = require('../models/category');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const multer = require('multer');
// const ProductKind = require('../models/product_kind');

router.get('/search', async (req, res, next) => {
    let keyword = req.query.keyword;
    let category = req.query.category;
    try{
        if(category){
            var products = await Product.findAll({where : {[Op.and] :
                        [{categoryName :category},{p_name : {[Op.like] : "%" + keyword + "%"}}]}})
        }else{
            var products = await Product.findAll({where : {p_name : {[Op.like] : "%" + keyword + "%"}}})
        }
        return res.status(200).json(products);
    }catch (err){
        return res.status(500).json(err);
    }
})

// let product = req.body;
router.get('/sort', async (req, res, next) => {
    let orderPrice = req.query.orderPrice;   //order~~ : "ASC", "DESC"   or 0;
    let orderName = req.query.orderName;
    let orderTime = req.query.orderTime;
    let lowPrice = req.params.lowPrice;       //defult 0~~ 큰값
    let highPrice = req.params.highPrice;
    console.log("lowPrice : " + lowPrice);
    console.log("highPrice : " +highPrice);
    let product;
    try{ 
        let keyword = req.query.keyword;
        if(keyword){
            product = await Product.findAll({where : {[Op.and] :
                        [{p_name : {[Op.like] : "%" + keyword + "%"}} ,
                            {[Op.and] : [{price: {[Op.gte]: lowPrice}},{price : {[Op.lte]:highPrice}}]}]}})
            if(orderName){
                if(orderName == "ASC")product.sort(ASCSortOrder("p_name"));
                else product.sort(DESCSortOrder("p_name"));
            }else if(orderPrice){
                if(orderPrice == "ASC")product.sort(ASCSortOrder("price"));
                else product.sort(DESCSortOrder("price"));
            }else if(orderTime){
                if(orderTime == "ASC")product.sort(ASCSortOrder("createdAt"));
                else product.sort(DESCSortOrder("createdAt"));
            }
        }else{
            if(orderName){
                product = await Product.findAll( {where :{[Op.and] : [{price: {[Op.gte]: lowPrice}},{price : {[Op.lte]:highPrice}}]},
                    order: [["p_name", orderName]]})
            }else if(orderPrice){
                product = await Product.findAll( {where :{[Op.and] : [{price: {[Op.gte]: lowPrice}},{price : {[Op.lte]:highPrice}}]},
                    order: [["price", orderPrice]]})
            }else if(orderTime){
                product = await Product.findAll( {where :{[Op.and] : [{price: {[Op.gte]: lowPrice}},{price : {[Op.lte]:highPrice}}]},
                    order: [["createdAt", orderTime]]})
            }else {
                product = await Product.findAll({where: {[Op.and]: [{price: {[Op.gte]: lowPrice}}, {price: {[Op.lte]: highPrice}}]}})
            }
        }
        return res.status(200).json(product);
    }catch (err){
        return res.status(500).json(err);
    }
})
// 등록된 product 보기
router.get('/', async (req, res, next) => {
    console.log("get success");
    try{
        let products = await Product.findAll({where : {exist : 1}});
        return res.status(200).json(products);
    }catch (err){
        return res.status(500).json(err);
    }
})



//product 상세 페에지
router.get('/:p_id', async (req, res, next) => {
    let productID = req.params.p_id;
    try {
        let product = await Product.findOne({where: {p_id: productID}});
        return res.status(200).json(product);
    }catch (err){
        return res.status(500).json(err);
    }
})

// product 카테고리 별로 정리
router.get('/category/:categoryName', async (req, res, next) => {
    console.log('product/category/');
    let products
    try {
        if(req.params.categoryName === "all"){
            products = await  Product.findAll({where : {exist : 1}});
        }else {
            products = await Product.findAll({where: {categoryName: req.params.categoryName}});
        }
        return res.status(200).json(products);
    }catch (err){
        return res.status(500).json(err);
    }
});

//post
router.post('/', async (req, res, next) => {
    // console.log("post exceed");
    // console.log("1");
    // console.log(req.body.p_name)
    // console.log(req.body,productKind);
    // console.log("2");
    // let productKind = req.body.productKind;
    // for (let a in productKind){
    //     var product_kind = await ProductKind.create({
    //         p_id : productKind[a].p_id,
    //         color : productKind[a].color,
    //         size : productKind[a].size,
    //         stock : productKind[a].stock,
    //     })
    //     console.log(product_kind);
    // }
    try {
        var product = await Product.create({
            p_name: req.body.p_name,
            description: req.body.description,
            categoryName: req.body.categoryName,
            price: req.body.price,
            stock: req.body.stock,
            file1: req.body.file1,
            file2: req.body.file2,
            file3: req.body.file3,
            exist : 1,
        });
        console.log(product);
        return res.status(200).json(product);
    } catch (err) {
        return res.status(500).json(err);
    }
})

//patch
router.patch('/:p_id', async (req, res, next)=> {
    let {p_name, description, cat_id, price, stock} = req.body;
    try{
        let product = await Product.update({
                p_name: req.body.p_name,
                description: req.body.description,
                categoryName: req.body.categoryName,
                price: req.body.price,
                stock: req.body.stock,
                file1: req.body.file1,
                file2: req.body.file2,
                file3: req.body.file3,
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
router.delete('/:p_id', async (req, res, next) => {
    try{
        let product = await Product.update({
            p_name: req.body.p_name,
            description: req.body.description,
            categoryName: req.body.categoryName,
            price: req.body.price,
            stock: req.body.stock,
            file1: req.body.file1,
            file2: req.body.file2,
            file3: req.body.file3,
            exist : 0,
            deletedAt: moment().format('YYYY-MM-DD HH:mm:ss')
        },{
            where : {p_id : req.params.p_id}
        })
        console.log(product);
        return res.status(200).json(product);
    }catch (err){
        return res.status(400).json(err);
    }
});

module.exports = router;