const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const QnA = require('../models/qna');

//QnA 답글 등록
router.post('/', async (req,res,next) => {
    console.log('post /comment OK');
    try {
        const comment = await Comment.create({
            comment: req.body.comment,
            qna_id: req.body.qna_id,
        });
        await QnA.update({
            isAnswer: true,
        },
        {
            where: {qna_id: comment.qna_id},
        });
        return res.status(200).json(comment);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//QnA 답글 목록
router.get('/:qna_id', async (req,res,next) => {
    console.log('get /comment OK');
    try {
        const qna = await Comment.findAll({
            where: {qna_id: req.params.qna_id},
        });
        return res.json(qna);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//QnA 답글 수정
router.patch('/:comment_id', async (req,res,next) => {
    console.log('patch /comment OK');
    try {
        const comment = await Comment.update({
            comment: req.body.comment,
        },
        {
            where: {comment_id: req.params.comment_id},
        });
        return res.status(200).json(qna);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//QnA 답글 삭제
router.delete('/:comment_id', async (req,res,next) => {
    console.log('delete /comment OK')
    try {
        const comment = await Comment.findOne({
            where: {comment_id: req.params.comment_id},
        })
        await Comment.destroy({
            where: {comment_id: req.params.comment_id},
        });
        await QnA.update({
            isAnswer: false,
        },
        {
            where: {qna_id: comment.qna_id},
        });
        return res.status(200).send(`답글이 삭제되었습니다.`);
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;