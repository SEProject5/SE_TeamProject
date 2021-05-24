//배송지 관련 라우터
const express = require('express');
const DeliverAddress = require('../models/deliver_address');
const { IsAdmin } = require('./middlewares');
const router = express.Router();
 
//배송지 등록
router.post('/', async (req,res,next) => {
    console.log('post /deliver_address OK');
    try {
        await DeliverAddress.create({
            user_id: req.body.user_id,
            address_name: req.body.address_name,
            receiver_phone: req.body.receiver_phone,
            zip_code: req.body.zip_code,
            address: req.body.address,
            address_detail: req.body.address_detail,
            address_type: req.body.address_type,
        });
        return res.status(200).send({message: `배송지를 등록하였습니다:)`});
    } catch (err) {
        return res.status(500).json(err);
    }
});

//배송지 목록
router.get('/:user_id', async (req,res,next) => {
    console.log('get /deliver_address OK');
    try {
        const deliver_address = await DeliverAddress.findAll({
            where: {user_id: req.params.user_id},
        });
        return res.json(deliver_address);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//배송지 수정
router.patch('/:id', async (req,res,next) => {
    console.log('patch /deliver_address OK');
    try {
        let deliver_address = await DeliverAddress.update({
            user_id: req.body.user_id,
            address_name: req.body.address_name,
            receiver_phone: req.body.receiver_phone,
            zip_code: req.body.zip_code,
            address: req.body.address,
            address_detail: req.body.address_detail,
            address_type: req.body.address_type,
        },
        {
            where: {id: req.params.id},
        });
        return res.json(deliver_address);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//배송지 삭제
router.delete('/:id', /*IsAdmin,*/ async (req,res,next) => {
    console.log('delete /deliver_address OK')
    try {
        await DeliverAddress.destroy({
            where: {id: req.params.id},
        });
        return res.status(200).send(`배송지가 삭제되었습니다.`);
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;