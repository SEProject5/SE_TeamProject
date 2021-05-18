const express = require('express');
const app = express();
// const bcrypt = require('bcrypt');
const router = express.Router();
let mysql = require('mysql2');
const { IsAdmin } = require('./middlewares');



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
    pool.query('SELECT * FROM category', function (err, categories){
        if(err) throw err;
        return res.status(200).send(categories);
        res.end();
    });
})

router.get('/:cat_id', function (req, res, next){
    pool.query('SELECT * FROM category WHERE cat_pid=?', req.params.cat_id,
        function (err2, category){
            if(err2) throw err2;
            return res.send(category);
            res.end();
        });

})

router.post('/',IsAdmin , function (req, res, next){
    let { cat_name} = req.body;
    pool.query('INSERT INTO category (cat_name,cat_pid) VALUES(?, ?)',
        [cat_name,0], function (err, result){       //[]
            if(err) throw err;
            return res.status(200).send(result);
            res.end();
        });
})

router.patch('/:cat_id',IsAdmin , function (req, res, next){
    let { cat_name,cat_pid } = req.body;
    pool.query('UPDATE category SET cat_name=?,cat_pid=? WHERE cat_id=?',
        [cat_name,cat_pid, req.params.cat_id],
        function(error, result){
            if(error){
                throw(error);
            }
            return res.status(200).send(result);
            res.end();
        })
})
router.delete('/:cat_id',IsAdmin , function (req, res, next){
    pool.query('DELETE FROM category WHERE cat_id = ?', req.params.cat_id, function(error, result){
        if(error){ throw error;}
        return res.status(200).send(result);
        res.end();
    });
})
module.exports = router;
