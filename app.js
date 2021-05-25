const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const cors =require('cors');
const tokenMiddleWare = require('./tokenAuth');

const { sequelize } = require('./models');

const app = express();

app.set('port', process.env.PORT || 3000);
sequelize.sync({ force: false }) //force가 True이면 서버 실행 시마다 테이블 재생성
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads",express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(tokenMiddleWare);
app.use('/uploads',express.static('uploads'));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
const cartRouter = require('./routes/cart');
const authRouter = require('./routes/auth');
const bannerRouter = require('./routes/banner');
const deliverAddressRouter = require('./routes/deliver_address');
const uploadImg = require('./uploadImage');

app.use('/', uploadImg);
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/product', productRouter);
app.use('/category', categoryRouter);
app.use('/cart', cartRouter);
app.use('/auth',authRouter);
app.use('/banner',bannerRouter)
app.use('/deliver_address',deliverAddressRouter)

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});


module.exports = app;