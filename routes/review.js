const express = require('express');
const router = express.Router();
const Review = require('../models/review');

//리뷰 등록
router.post('/', async (req,res,next) => {
    console.log('post /review OK');
    try {
        const review = await Review.create({
            user_id: req.body.user_id,
            product_id: req.body.product_id,
            order_id: req.body.order_id,
            recomend: req.body.recomend,
            delivery: req.body.delivery,
            score: req.body.score,
            comment: req.body.comment,
        });
        return res.status(200).json(review);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//리뷰 목록
router.get('/:product_id', async (req,res,next) => {
    console.log('get /product_id OK');
    try {
        const review = await Review.findAll({
            where: {product_id: req.params.product_id},
        });
        return res.json(review);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//리뷰 수정
router.patch('/:review_id', async (req,res,next) => {
    console.log('patch /coupon/:coupon_id OK');
    try {
        const review = await Review.update({
            recomend: req.body.recomend,
            delivery: req.body.delivery,
            score: req.body.score,
            coment: req.body.coment,
        },
        {
            where: {review_id: req.params.review_id},
        });
        return res.status(200).json(review);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//리뷰 삭제
router.delete('/:review_id', async (req,res,next) => {
    console.log('delete /review OK')
    try {
        await Review.destroy({
            where: {review_id: req.params.review_id},
        });
        return res.status(200).send(`리뷰가 삭제되었습니다.`);
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;