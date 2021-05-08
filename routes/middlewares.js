const User = require('../models/user');

//토큰 정보는 req.headers["x-access-token"]

exports.accessToken = (req, res) => {
  const user_token = req.headers["x-access-token"];
  const userInfo = User.findOne({
    where: {token: user_token},
  })
  return res.json(userInfo)
};