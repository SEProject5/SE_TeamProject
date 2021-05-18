const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config();
const { sequelize } = require('./models');
const router = express.Router();;

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

//app.use('/', router);
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/banner', require('./routes/banner'));
app.use('/deliver_address', require('./routes/deliver_address'));
app.use('/products', require('./routes/products'));
app.use('/category', require('./routes/category'));
app.use('/cart', require('./routes/cart'));

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