let express = require('express');
let app = express();
let router = express.Router();
let mysql = require('mysql2');
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

router.get('/', function (req, res, next){
    pool.query('SELECT * FROM product', function (err, products){
        if(err) throw err;
        return res.status(200).send(products);
        res.end();
    });
})


//가격 차순 : sort_id : 1 = 오름차순 2 = 내림차순
router.get('/sort', (req, res, next) => {
    let order= req.query.order;

    switch(order){
        case "ASC": pool.query('SELECT * FROM product ORDER BY price ASC;', (err, result) => {
            return res.status(200).send(result);
            res.end();
        })
            break;
        case "DESC": pool.query('SELECT * FROM product ORDER BY price DESC;', (err, result) => {
            return res.status(200).send(result);
            res.end();
        })
            break;
        default : console.log("err");
    }
})

router.get('/:p_id', (req, res, next) => {
    console.log(req.params.p_id)
    pool.query('SELECT * FROM product WHERE p_id=?', req.params.p_id, (err2, product) => {
        console.log(product);
        if(err2) throw err2;
        return res.send(product);
        res.end();
    });
})
router.get('/category/:categoryID', (req, res, next) => {
    let categoryID = req.params.categoryID;
    pool.query('SELECT * FROM category WHERE cat_id=?', categoryID, (err, category) => {
        // console.log(category[0].cat_pid);
        if(category[0].cat_pid=== 0){
            pool.query('SELECT * FROM category AS cat INNER JOIN product AS pro ON cat.cat_id=pro.cat_id WHERE cat_pid=?',categoryID,
                (err, result) => {
                    console.log(result)
                    if (err) throw err;
                    res.status(200).send(result);
                    res.end();
                })
        }else{
            // console.log("result != 0");
            pool.query('SELECT * FROM product WHERE cat_id=?', categoryID, (err, products) => {
                if(err) throw err;
                return res.send(products);
                res.end();
            })
        }
    })
})


router.post('/', function (req, res, next){
    let { p_name, description, cat_id, price, stock} = req.body;
    pool.query('INSERT INTO product (p_name, description, cat_id, price, stock) VALUES(?, ?, ?, ?, ?)',
        [p_name, description, cat_id, price, stock], function (err, product){
            if(err) throw err;
            return res.status(200).send(product);
            res.end();
        });
})

router.patch('/:p_id', function (req, res, next){
    let { p_name, description, cat_id, price, stock} = req.body;
    pool.query('UPDATE product SET p_name=?, description=?, cat_id=?, price=?, stock=? WHERE p_id=?',
        [p_name, description, cat_id, price, stock, req.params.p_id],
        function(error, product){
            if(error){
                throw(error);
            }
            return res.status(200).send(product);
            res.end();
        })
})
router.delete('/:p_id', function (req, res, next){
    pool.query('DELETE FROM product WHERE p_id = ?', req.params.p_id, function(error, result){
        if(error){ throw error;}
        return res.status(200).send(result);
        res.end();
    });
})
module.exports = router;

