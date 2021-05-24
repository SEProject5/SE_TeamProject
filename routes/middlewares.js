const User = require('../models/user');

//토큰 정보는 req.headers["x-access-token"]

exports.IsAdmin = async(req, res, next) => {
  const user_token = await req.headers["x-access-token"];
  console.log('user_token:', user_token);
  const userInfo = await User.findOne({
    attributes: ['user_token'],
    where: {token: user_token},
  })
  console.log('userInfo: ', userInfo.user_type);
  console.log('userInfo: ', userInfo.user_type === "admin");
  if(userInfo.user_type === "admin") { next();
  } else res.status(401).send({ message: "접근 권한이 없습니다."});
};

/*exports.getUserId =  async(req, res, next) => {
  const user_token = await req.headers["x-access-token"];
  console.log('user_token:', user_token);
  const userInfo = await User.findOne({
    attributes: ['id'],
    where: {token: user_token},
  })
  console.log('userInfo: ', userInfo.id);
  next();
};*/

exports.ASCSortOrder = function (prop){
  return function(a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  }
}

exports.DESCSortOrder = function (prop){
  return function(a, b) {
    if (a[prop] > b[prop]) {
      return -1;
    } else if (a[prop] < b[prop]) {
      return 1;
    }
    return 0;
  }
}
