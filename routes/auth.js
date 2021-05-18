const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Jwt = require('../models/jwt');

// 비밀번호 정규식 설정 (영문(소문자), 숫자, 특수문자 조합, 8~16자리)
const chk_password = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/;

const router = express.Router();

//회원가입 라우터
router.post('/join', async (req, res, next) => {
  console.log('post /join OK');
  try {
    const exUser = await User.findOne({ where: { id: req.body.id } });
    if (exUser) { //id가 존재하면 
      return res.status(400).send({message: "이미 존재하는 id 입니다."});
    } else {
      // 비밀번호 정규식 확인 
      if (chk_password.test(req.body.password) === false) {
          return res.status(400).send({message: "비밀번호는 영문(소문자), 숫자, 특수문자 조합의 8~16자리여야 합니다."}); 
      }
    }
    const user_token = await Jwt.create(req.body.id);
    console.log(user_token.user_token);
    const hash = bcrypt.hashSync(req.body.password, 10) //비밀번호 암호화
    console.log(hash);
    await User.create({
      id: req.body.id,
      password: hash,
      name: req.body.name,
      email: req.body.email,
      zip_code: null,
      address: null,
      addressDetail: null,
      phone: null,
      token: user_token.user_token,
      user_type: "normal",
    });
    return res.status(200).send({message: "회원가입이 완료되었습니다:)"});
  } catch (error) {
      return res.status(400).json(error);
  }
});

//로그인 라우터
router.post('/login', async (req, res) => {
  console.log('post /login OK');
  try {
    const exUser = await User.findOne({ where: { id: req.body.id } });
    if (exUser) { //id일치
      const isSame = bcrypt.compareSync(req.body.password, exUser.password);
      console.log(isSame);
      if(isSame){
          res.json(exUser); //로그인 성공! 유저 정보 전송!
      }else{
          res.status(403).send({message : "비밀번호가 일치하지 않습니다."});
      }
    }else{
        res.status(403).send({message : "이메일 또는 비밀번호가 일치하지 않습니다."});
    }
  } catch (err) {
      console.log(err);
      res.status(400).json(err);
  }
});

/*
router.get('/logout', (req, res) => {
  console.log('post /login OK');
  req.logout();
  return res.status(200).send({message: 'logout success'});
});*/

module.exports = router;