const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const OrderDetail = require('../models/order_detail');
const Product = require('../models/product');
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");



router.post('/', async (req, res) => {
    try{
        console.log("post /order success");
        console.log(req.body);
        console.log(req.body[0].user_id);
        console.log(req.body[0].totalPrice)
        console.log(req.body[0].order_state)
        console.log(req.body[0].coupon_id)
        let order = await Order.create({
            user_id: req.body[0].user_id,
            totalPrice : req.body[0].totalPrice,
            order_state: req.body[0].order_state,
            coupon_id : req.body[0].coupon_id,
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        })
        console.log("3");
        let order_detail = req.body[0].order_detail;
        for(var a in order_detail){
            let product = await Product.findOne({where : {p_id : order_detail[a].p_id}})
            await OrderDetail.create({
                order_id : order.order_id,
                p_id : product.p_id,
                p_name : product.p_name,
                p_price : product.price,
                order_quantity : order_detail[a].order_quantity
            })
        }
        return res.status(200).json(order);
    }catch (err){
        return res.status(400).json(err);
    }
})

router.get('/', async (req, res) => {
    try {
        console.log('get order/');
        let orders = await Order.findAll({where : {}});
        return res.status(200).json(orders);
    }catch (err){
        return res.status(400).json(err);
    }
})

router.get('/:order_id', async (req, res) => {
    try {
        console.log("get order/order_id");
        let order = await Order.findOne({
            where : {order_id : req.params.order_id},
            include : [
                {
                    model: OrderDetail
                }
            ]
        })
        return res.status(200).json(order);
    }catch (err){
        return res.status(400).json(err);
    }
})


router.get('/order_detail/:order_detail_id', async (req, res) => {
    try {
        let orderDetail =  await OrderDetail.findAll({
            where : {order_detail_id : req.params.order_detail_id},
            include : [
                {
                    model : Product
                }
            ]});
        return res.status(200).json(orderDetail);
    }catch (err){
        return res.status(400).json(err);
    }
})



module.exports = router;