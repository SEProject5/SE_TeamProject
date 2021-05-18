const express = require('express');
const app = express()
const bodyParser = require('body-parser');
// const compression = require('compression');
const router = express.Router();
var createError = require('http-errors');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');

const dotenv = require('dotenv');
// const { sequelize } = require('./models');
var qs = require('querystring');
// var sanitizeHtml = require('sanitize-html');
var path = require('path');


const session = require('express-session');

dotenv.config();

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let productsRouter = require('./routes/products');
let categoryRouter = require('./routes/categories');
let cartRouter = require('./routes/cart');
//app.set('port', process.env.PORT || 3000);
// sequelize.sync({ force: false })
//     .then(() => {
//         console.log('데이터베이스 연결 성공');
//     })
//     .catch((err) => {
//         console.error(err);
//     });
// app.use(morgan('dev'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoryRouter);
app.use('/cart', cartRouter);

app.use('/apidoc', express.static(__dirname + '/apidoc'));
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
    module.exports = router;

});

module.exports = app;
