const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config();
const { sequelize } = require('./models');
const router = express.Router();

const app = express();
app.set('port', process.env.PORT || 3000);
sequelize.sync({ force: true }) //force가 True이면 서버 실행 시마다 테이블 재생성
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.get('/s3', function(req, res){
  console.log(1);
  res.send('Hello s3');
});

//이미지 관련
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  }),
});
app.post('/uploads/img', upload.array('img'), (req, res) => {
  console.log(req.files);
});
app.post('/uploads/img', upload.fields([{ name: 'img' }, { name: 'photos' }]), (req, res) => {
  console.log(req.files);
});
app.get('/uploads/img/:filename', (req, res) => {
  const { filename } = req.params;
  const dirname = path.resolve();
  const fullfilepath = path.join(dirname, 'uploads/img/' + filename);
  return res.sendFile(fullfilepath);
});


const indexRouter = require('./routes/index');
const s3Router = require('./routes/s3');
const usersRouter = require('./routes/user');
const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
const cartRouter = require('./routes/cart');
const authRouter = require('./routes/auth');
const bannerRouter = require('./routes/banner');
const deliverAddressRouter = require('./routes/deliver_address');


app.use('/', indexRouter);
app.use('/s3', s3Router);
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