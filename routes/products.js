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

router.get('/:p_id', function (req, res, next){
    pool.query('SELECT * FROM product WHERE p_id=?', req.params.p_id,
        function (err2, product){
        if(err2) throw err2;
        return res.send(product);
        res.end();
    });

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

