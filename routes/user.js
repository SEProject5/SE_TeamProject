const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Jwt = require('../models/jwt');
const router = express.Router();

// 비밀번호 정규식 설정 (영문(소문자), 숫자, 특수문자 조합, 8~16자리)
const chk_password = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/;

//유저 생성 하기
router.post('/', async (req, res, next) => {
    try {
        console.log(req.body.id);
        const exUser = await User.findOne({ 
            where: { id: req.body.id } 
        });
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
            token: user_token.user_token,
            user_type: "normal",
        });
        const user = await User.findOne({
            attributes: ['id','name','email','user_type'],
            where: {id: req.body.id},
        });
        return res.status(200).json(user);
    } catch (err) {
        return res.status(400).json(err);
    }
});

//전체 유저 목록보기
router.get('/', async (req,res,next) => {
    console.log('get /user OK')
    try {
        users = await User.findAll({
            attributes: ['id','name','email','user_type'],
        });
        return res.status(200).json(users);
    } catch (err) {
        return res.status(400).json(err);
    }
});
//특정 유저 목록보기
router.get('/:id', async (req, res, next) => {
    console.log('get /user/:id OK');
    try {
        const user = await User.findOne({
            attributes: ['id','name','email','user_type'],
            where: {id: req.params.id},
        });
        return res.status(200).json(user);
    } catch (err) {
        return res.status(400).json(err);
    }
});

//유저 정보 수정하기
router.patch('/:id', async (req, res, next) => {
    console.log('patch /user OK');
    try {
        if (chk_password.test(req.body.password) === false) {
            throw Error("비밀번호는 영문(소문자), 숫자, 특수문자 조합의 8~16자리여야 합니다."); 
        }
        await User.update({
            id: req.params.id,
            password: req.body.password,
            name: req.body.name,
            email: req.body.email,
        }, {
            where: {id: req.params.id},
        });
        const user = await User.findOne({
            attributes: ['id','name','email','user_type'],
            where: {id: req.params.id}})
        return res.status(200).json(user);
    } catch (err) {
        return res.status(400).json(err);
    }
});

//유저 삭제하기
router.delete('/:id', async (req,res,next) => {
    console.log('delete /user OK')
    try {
        user = await User.findOne({where: {id: req.params.id}})
        console.log(user);
        if(user) {
            await User.destroy({
                where: {id: req.params.id},
            });
            return res.status(200).send(`${req.params.id}님의 계정이 삭제되었습니다.`);
        } else {
            return res.status(401).send(`id가 ${req.params.id}인 계정이 존재하지 않습니다.`);
        }
    } catch (err) {
        return res.status(400).json(err);
    }
});

module.exports = router;