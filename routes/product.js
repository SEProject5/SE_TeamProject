let express = require('express');
let app = express();
let router = express.Router();
const { IsAdmin, ASCSortOrder, DESCSortOrder} = require('./middlewares');
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
const Product = require('../models/product')
const Category = require('../models/category');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.get('/search', async (req, res, next) => {
    let keyword = req.query.keyword;
    try{
        let products = await Product.findAll({where : {p_name : {[Op.like] : "%" + keyword + "%"}}})
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
    let lowPrice = req.body.lowPrice;       //defult 0~~ 큰값
    let highPrice = req.body.highPrice;
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
                // product = await product.findAll( {where :{[Op.and] : [{price: {[Op.gte]: lowPrice}},{price : {[Op.lte]:highPrice}}]},
                //     order: [["p_name", orderName]]})
            }else if(orderPrice){
                if(orderPrice == "ASC")product.sort(ASCSortOrder("price"));
                else product.sort(DESCSortOrder("price"));
                // product = await product.findAll( {where :{[Op.and] : [{price: {[Op.gte]: lowPrice}},{price : {[Op.lte]:highPrice}}]},
                //     order: [["price", orderPrice]]})
                // console.log(product);
            }else if(orderTime){
                if(orderTime == "ASC")product.sort(ASCSortOrder("createdAt"));
                else product.sort(DESCSortOrder("createdAt"));
                // product = await product.findAll( {where :{[Op.and] : [{price: {[Op.gte]: lowPrice}},{price : {[Op.lte]:highPrice}}]},
                //     order: [["createdAt", orderTime]]})
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
    try{
        let products = await Product.findAll({});
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
router.get('/category/:categoryID', async (req, res, next) => {
    let categoryID = req.params.categoryID;
    try {
        let category = await Category.findOne({where : {cat_id : categoryID}});
        if (category.cat_pid === 0) {
            console.log("1");
            let categories = await Category.findAll({where : {cat_pid : category.cat_id}})
            console.log(categories);
            let products = {};
            let product= {};
            let i=0
            for (let a of categories){
                products[a.cat_id] = await Product.findAll({where : {cat_id : a.cat_id}});
                for (let key in products){
                    product[key] = products[key];
                }
            }
            return res.status(200).json(product);
        }else {
            let products = await Product.findAll({where: {cat_id: categoryID}});
            return res.status(200).json(products);
        }
    }catch (err){
        return res.status(500).json(err);
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
            createdAt : moment().format('YYYY-MM-DD HH:mm:ss')
        });
        return res.status(200).send(product);
    } catch (err) {
        return res.status(500).json(err);
    }
})

//patch
router.patch('/:p_id', /*IsAdmin,*/ async (req, res, next)=> {
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
router.delete('/:p_id'/*, IsAdmin*/, async (req, res, next) => {
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