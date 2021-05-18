const express = require('express');
const Cart = require('../models/cart');
const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        await Cart.create({
            productSeq: req.body.productSeq,
            userSeq: req.body.userSeq,
            price: req.body.price,
            userSeq: req.body.userSeq,
            image: req.body.image,
            p_name: req.body.p_name,
            productNum: req.body.productNum,
        });
        return res.status(200).send({message: `장바구니를 생성하였습니다:)`});
    } catch (err) {
        return res.status(500).json(err);
    }
})

router.get('/:user_id', async (req, res, next) => {
    try {
        const cart = await Cart.findOne({where: {userSeq: req.params.user_id},});
        return res.json(cart);
    } catch (err) {
        return res.status(500).json(err);
    }
})

router.patch('/:user_id', async (req, res, next) => {
    try {
        await Cart.update({
            productSeq: req.body.productSeq,
            userSeq: req.body.userSeq,
            price: req.body.price,
            userSeq: req.body.userSeq,
            image: req.body.image,
            p_name: req.body.p_name,
            productNum: req.body.productNum,
        },
        {
            where: {userSeq: req.params.user_id},
        });
        cart = await Cart.findOne({where: {userSeq: req.params.user_id}})
        return res.json(cart);
    } catch (err) {
        return res.status(500).json(err);
    }
})

router.delete('/:user_id', async (req, res, next) => {
    try {
        await Cart.destroy({
            where: {userSeq: req.params.user_id},
        });
        return res.status(200).send(`장바구니를 비웠습니다.`);
    } catch (err) {
        return res.status(500).json(err);
    }
})




module.exports = router;