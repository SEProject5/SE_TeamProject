const User = require('./models/user');

//토큰 정보는 req.headers["x-access-token"]
module.exports = async function (req, res, next) {
  console.log("tokenAuth Ok");
  let user_token = req.headers['x-access-token'];
  console.log(user_token);
  if (user_token) {
      try{
          const data = await User.findOne({
                attributes: ['id','user_type'],
                where: {token: user_token},
            });
          req.userInfo = data;
          console.log(data);
          next();
      } catch (err){
          res.status(500).json(err);
          next();
      }
  } else {
      next();
  }
}