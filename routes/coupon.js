const express = require('express');
const app = express();
const router = express.Router();
const Coupon = require('../models/coupon');

//쿠폰 등록
router.post('/', async (req,res,next) => {
    console.log('post /coupon OK');
    try {
        const coupon = await Coupon.create({
            coupon_type: req.body.coupon_type,
            sale_price: req.body.sale_price,
            sale_percent: req.body.sale_percent,
            sale_price_limit: req.body.sale_price_limit,
            sale_condition_price: req.body.sale_condition_price,
            sale_condition_cat: req.body.sale_condition_cat,
        });
        if(coupon.coupon_type == 1) {
            coupon = await Coupon.findOne({
                attributes: ['coupon_id','coupon_type','sale_price','sale_condition_price'],
                where: {coupon_id: coupon.coupon_id},
            });
        } else {
            coupon = await Coupon.findOne({
                attributes: ['coupon_id', 'coupon_type', 'sale_percent', 'sale_price_limit', 'sale_condition_cat'],
                where: {coupon_id: coupon.coupon_id},
            });
        }
        return res.status(200).json(coupon);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//쿠폰 목록
router.get('/', async (req,res,next) => {
    console.log('get /coupon OK');
    try {
        const coupon = await Coupon.findAll({
            attributes: ['coupon_id','coupon_type','sale_price','sale_percent','sale_price_limit', 'sale_condition_price','sale_condition_cat'],
        });
        return res.json(coupon);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//쿠폰 수정
router.patch('/:coupon_id', async (req,res,next) => {
    console.log('patch /coupon/:coupon_id OK');
    try {
        const coupon = await Coupon.update({
            coupon_type: req.body.coupon_type,
            sale_price: req.body.sale_price,
            sale_percent: req.body.sale_percent,
            sale_price_limit: req.body.sale_price_limit,
            sale_condition_price: req.body.sale_condition_price,
            sale_condition_cat: req.body.sale_condition_cat,
        },
        {
            where: {coupon_id: req.params.coupon_id},
        });
        if(coupon.coupon_type == 1) {
            coupon = await Coupon.findOne({
                attributes: ['coupon_id','coupon_type','sale_price','sale_condition_price'],
                where: {coupon_id: coupon.coupon_id},
            });
        } else {
            coupon = await Coupon.findOne({
                attributes: ['coupon_id', 'coupon_type', 'sale_percent', 'sale_price_limit', 'sale_condition_cat'],
                where: {coupon_id: coupon.coupon_id},
            });
        }
        return res.status(200).json(coupon);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//쿠폰 삭제
router.delete('/:coupon_id', async (req,res,next) => {
    console.log('delete /coupon OK')
    try {
        await Coupon.destroy({
            where: {coupon_id: req.params.coupon_id},
        });
        return res.status(200).send(`배송지가 삭제되었습니다.`);
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;