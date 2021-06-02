const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');
const app = express();


router.post('/', async (req, res, next) => {
    try {
        let cart = await Cart.create({
            userSeq: req.body.userSeq,
            productSeq: req.body.productSeq,
            productNum: req.body.productNum,
        });
        return res.status(200).json(cart);
    } catch (err) {
        return res.status(500).json(err);
    }
})

router.get('/:user_id', async (req, res, next) => {
    try {
        let cart = await Cart.findAll({
            where: {userSeq: req.params.user_id},
            include: [
                {
                    model: Product,
                    attributes: ['p_name','categoryName','price','file'],
                }
            ],
        });
        return res.status(200).json(cart);
    } catch (err) {
        return res.status(500).json(err);
    }
})

router.patch('/:cartSeq', async (req, res, next) => {
    try {
            let cart = await Cart.update({
                productNum: req.body.productNum,
            },
            {
                where: {cartSeq: req.params.cartSeq},
            });
        // cart = await Cart.findOne({where: {userSeq: req.params.user_id}})
        return res.status(200).json(cart);
    } catch (err) {
        return res.status(500).json(err);
    }
})

router.delete('/:cartSeq', async (req, res, next) => {
    let cartSeq = req.params.cartSeq;
    try {
        let cart = await Cart.destroy({where: {cartSeq: cartSeq}});
        console.log(cart);
        return res.status(200).json(cart);
    } catch (err) {
        return res.status(500).json(err);
    }
})

module.exports = router;
