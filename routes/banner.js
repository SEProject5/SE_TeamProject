const express = require('express');
const Banner = require('../models/banner');
const router = express.Router();
let moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//공지,이벤트 등록 
router.post('/', async (req,res,next) => {
    console.log('post /banner OK');
    try {
        console.log(req.body);
        await Banner.create({
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            banner_type: req.body.banner_type,
            title: req.body.title,
            description: req.body.description,
            image: req.body.image,
        });
        return res.status(200).send({message: `${req.body.title} 배너를 생성하였습니다:)`});
    } catch (err) {
        return res.status(500).json(err);
    }
});

//배너 검색/정렬
router.get('/', async (req,res,next) => {
    console.log('get /banner OK');
    let now = moment().format('YYYY-MM-DD');
    console.log(now);
    let { order } = req.query;
    order = Number(order)||0;
    console.log(order);
    try {
        if(order===0) {
            console.log('전체 배너');
            const banner = await Banner.findAll({});
            return res.json(banner);
        } else if(order===1) {
            console.log('기간 지난 배너');
            const banner = await Banner.findAll({
                where: {endDate: {[Op.lt]: now}},
            }); 
            return res.json(banner);
        } else if(order===2) {
            console.log('진행 중인 배너');
            const banner = await Banner.findAll({
            where: {
                [Op.and]: [{startDate: {[Op.lte]: now}}, {endDate: {[Op.gte]: now}}]
            }
            }); 
            return res.json(banner);
        } else if(order===3) {
            console.log('진행 예정인 배너');
            const banner = await Banner.findAll({
                where: {startDate: {[Op.gt]: now}}
            }); 
            res.json(banner);
        } else {
            console.log('배너를 조회할 수 없습니다.');
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

//공지,이벤트 수정
router.patch('/:id', async (req,res,next) => {
    console.log('patch /banner OK')
    try {
        await Banner.update({
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            banner_type: req.body.banner_type,
            title: req.body.title,
            description: req.body.description,
            image: req.body.image,
        },
        {
            where: {id: req.params.id},
        });
        banner = await Banner.findOne({where: {id: req.params.id}})
        return res.json(banner);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//공지 삭제
router.delete('/:id', async (req,res,next) => {
    console.log('delete /banner OK')
    try {
        await Banner.destroy({
            where: {id: req.params.id},
        });
        return res.status(200).send(`${req.params.id} 배너가 삭제되었습니다.`);
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;