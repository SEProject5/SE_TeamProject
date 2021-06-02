const express = require('express');
const router = express.Router();
const QnA = require('../models/qna');

//QnA 등록
router.post('/', async (req,res,next) => {
    console.log('post /qna OK');
    try {
        const qna = await QnA.create({
            user_id: req.body.user_id,
            title: req.body.title,
            contents: req.body.contents,
            isAnswer: req.body.qna,
        });
        return res.status(200).json(qna);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//QnA 목록
router.get('/:user_id', async (req,res,next) => {
    console.log('get /qna OK');
    try {
        const qna = await Review.findAll({
            where: {user_id: req.params.user_id},
        });
        return res.json(qna);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//QnA 수정
router.patch('/:qna_id', async (req,res,next) => {
    console.log('patch /qna OK');
    try {
        const qna = await QnA.update({
            title: req.body.title,
            contents: req.body.contents,
            isAnswer: req.body.qna,
        },
        {
            where: {qna_id: req.params.qna_id},
        });
        return res.status(200).json(qna);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//QnA 삭제
router.delete('/:qna_id', async (req,res,next) => {
    console.log('delete /qna OK')
    try {
        await QnA.destroy({
            where: {qna_id: req.params.qna_id},
        });
        return res.status(200).send(`QnA가 삭제되었습니다.`);
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;