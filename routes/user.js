const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Jwt = require('../models/jwt');
const { IsAdmin } = require('./middlewares');
const router = express.Router();

// 비밀번호 정규식 설정 (영문(소문자), 숫자, 특수문자 조합, 8~16자리)
const chk_password = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/;

//유저 생성 하기
router.post('/', IsAdmin, async (req, res, next) => {
    try {
        console.log(req.body.id);
        const exUser = await User.findOne({ where: { id: req.body.id } });
        if (exUser) { //id가 존재하면 
        return res.status(400).send({message: "이미 존재하는 id 입니다."});
        } else {
        // 비밀번호 정규식 확인 
        if (chk_password.test(req.body.password) === false) {
            throw Error("비밀번호는 영문(소문자), 숫자, 특수문자 조합의 8~16자리여야 합니다."); 
        }
        }
        const user_token = await Jwt.create(req.body.id);
        console.log(user_token);
        const hash = bcrypt.hashSync(req.body.password, 10) //비밀번호 암호화
        console.log(hash);
        await User.create({
            id: req.body.id,
            password: hash,
            name: req.body.name,
            email: req.body.email,
            zip_code: req.body.zip_code,
            address: req.body.address,
            addressDetail: req.body.addressDetail,
            phone: req.body.phone,
            token: user_token.user_token,
            user_type: "normal",
        });
        return res.status(200).send({message: `${req.body.id}유저를 생성하였습니다:)`});
    } catch (err) {
        return res.status(400).json(err);
    }
});

//전체 유저 목록보기
router.get('/', async (req,res,next) => {
    console.log('get /user OK')
    try {
        users = await User.findAll({});
        return res.json(users);
    } catch (err) {
        return res.status(400).json(err);
    }
});
//특정 유저 목록보기
router.get('/:id', async (req, res, next) => {
    console.log('get /user/:id OK')
    try {
        const user = await User.findOne({where: {id: req.body.id},});
        return res.json(user);
    } catch (err) {
        return res.status(400).json(err);
    }
});

//유저 정보 수정하기
router.patch('/', async (req, res, next) => {
    console.log('patch /user OK')
    try {
        if (chk_password.test(req.body.password) === false) {
            throw Error("비밀번호는 영문(소문자), 숫자, 특수문자 조합의 8~16자리여야 합니다."); 
        }
        await User.update({
            id: req.body.id,
            password: req.body.password,
            name: req.body.name,
            email: req.body.email,
            zip_code: req.body.zip_code,
            address: req.body.address,
            addressDetail: req.body.addressDetail,
            phone: req.body.addressDetail,
        }, {
            where: {id: req.body.id},
        });
        user = await User.findOne({where: {id: req.body.id}})
        return res.json(user);
    } catch (err) {
        return res.status(400).json(err);
    }
});

//유저 삭제하기
router.delete('/', async (req,res,next) => {
    console.log('delete /user OK')
    try {
        await User.destroy({
            where: {id: req.body.id},
        });
        user = await User.findOne({where: {id: req.body.id}})
        return res.status(200).send(`${req.body.id}님의 계정이 삭제되었습니다.`);
    } catch (err) {
        return res.status(400).json(err);
    }
});

module.exports = router;