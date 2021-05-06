const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

// 비밀번호 정규식 설정 (영문, 숫자, 특수문자 조합, 8~16자리)
const chk_password = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,16}$/;

const router = express.Router();

//회원가입 라우터
router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { name, id, password, email } = req.body;
  try {
    const exUser = await User.findOne({ where: { id } });
    if (exUser) { //id가 존재하면 /login으로 라우팅
      return res.redirect('/login?error=exist');
    } else {
      // 비밀번호 정규식 확인 
      if (chk_password.test(password) === false) {
          throw Error("비밀번호는 영문, 숫자, 특수문자 조합의 8~16자리여야 합니다."); 
      }
    }
    const hash = await bcrypt.hash(password, 12); //비밀번호 암호화
    await User.create({ //사용자 정보 생성
      name,
      id,
      password: hash,
      email,
    });
    return res.redirect('/login');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
//로그인 라우터
router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});
//로그아웃 라우터
router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;