let express = require('express');
let app = express();
let router = express.Router();
let mysql = require('mysql2');
const { IsAdmin } = require('./middlewares');
var moment = require('moment');
require('moment-timezone');

// let product = require('../models/product')

var pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'sprout3082!',
    database:'test'
});
pool.getConnection(function (err, connection){
    if(err){
        if(connection){
            connection.release();
        }
        callback(err.null);
        return;
    }
})
/**
 * @api {get} /product 상품 목록 요청
 * @apiName GetProductList
 * @apiGroup Product
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *       "id": 0,
 *       "name": "Noah",
 *       "price": 35000
 *      },
 *      {
 *         "id": 1,
 *       "name": "Seorin",
 *       "price": 30000
 *       }
 *     ]
 *
 */
// 등록된 product 보기
router.get('/', function (req, res, next){
    pool.query('SELECT * FROM product WHERE exist=1', function (err, products){
        if(err) throw err;
        return res.status(200).send(products);
        res.end();
    });
})

//가격 차순 : ?order=ASC/오름 DESC/내림
router.get('/sort', (req, res, next) => {
    let order = req.query.order;
    //가격
    switch (order) {
        case "priceASC":
            pool.query('SELECT p_name,price FROM product WHERE exist=1 ORDER BY price ASC', (err, result) => {
                return res.status(200).send(result);
                res.end();
            })
            break;
        case "priceDESC":
            pool.query('SELECT p_name,price FROM product WHERE exist=1 ORDER BY price DESC;', (err, result) => {
                return res.status(200).send(result);
                res.end();
            })
            break;
        default :
            console.log("err price");
            break;
    }
    //이름
    switch (order) {
        case "nameASC":
            pool.query('SELECT p_name,price FROM product WHERE exist=1 ORDER BY p_name ASC', (err, result) => {
                return res.status(200).send(result);
                res.end();
            })
            break;
        case "nameDESC":
            pool.query('SELECT p_name,price FROM product WHERE exist=1 ORDER BY p_name DESC;', (err, result) => {
                return res.status(200).send(result);
                res.end();
            })
            break;
        default :
            console.log("err name");
            break;
    }

    let lowRange = req.body.lowRange, highRange = req.body.highRange;
    console.log(lowRange, highRange);
    pool.query('SELECT p_name,price FROM product WHERE price>=? && price<=? &&exist=1', [lowRange, highRange], (err, result) => {
        return res.status(200).send(result);
    })
})

//product 상세 페에지
router.get('/:p_id', (req, res, next) => {
    console.log(req.params.p_id)
    pool.query('SELECT * FROM product WHERE p_id=?', req.params.p_id, (err2, product) => {
        console.log(product);
        if (err2) throw err2;
        return res.send(product);
        res.end();
    });
})

//product 카테고리 별로 정
router.get('/category/:categoryID', (req, res, next) => {
    let categoryID = req.params.categoryID;
    pool.query('SELECT * FROM category WHERE cat_id=? ', categoryID, (err, category) => {
        // console.log(category[0].cat_pid);
        if (category[0].cat_pid === 0) {
            pool.query('SELECT * FROM category AS cat INNER JOIN product AS pro ON cat.cat_id=pro.cat_id WHERE cat_pid=? && pro.exist=1', categoryID,
                (err, result) => {
                    console.log(result)
                    if (err) throw err;
                    res.status(200).send(result);
                    res.end();
                })
        } else {
            // console.log("result != 0");
            pool.query('SELECT * FROM product WHERE cat_id=? && exist=1', categoryID, (err, products) => {
                if (err) throw err;
                return res.send(products);
                res.end();
            })
        }
    })
})

//post
router.post('/', function (req, res, next) {
    let {p_name, description, cat_id, price, stock} = req.body;
    pool.query('INSERT INTO product (p_name, description, cat_id, price, stock, regist_time) VALUES(?, ?, ?, ?, ?,?)',
        [p_name, description, cat_id, price, stock, moment().format('YYYY-MM-DD HH:mm:ss')], function (err, product) {
            if (err) throw err;
            return res.status(200).send(product);
            res.end();
        });
})
//patch
router.patch('/:p_id', IsAdmin, function (req, res, next) {
    let {p_name, description, cat_id, price, stock} = req.body;
    pool.query('UPDATE product SET p_name=?, description=?, cat_id=?, price=?, stock=? WHERE p_id=?',
        [p_name, description, cat_id, price, stock, req.params.p_id],
        function (error, product) {
            if (error) {
                throw(error);
            }
            return res.status(200).send(product);
            res.end();
        })
})
//delete
router.delete('/:p_id', IsAdmin, function (req, res, next) {
    pool.query('UPDATE product SET exist=0 WHERE p_id = ?', req.params.p_id, function (error, result) {
        if (error) {
            throw error;
        }
        return res.status(200).send(result);
        res.end();
    });
});

module.exports = router;
