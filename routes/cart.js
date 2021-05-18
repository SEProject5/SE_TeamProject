const express = require('express');
// const app = express();
const router = express.Router();
let mysql = require('mysql2');
const app = require('../app');


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
router.get('/:user_id', (req, res, next) => {
    let user_id = req.params.user_id;
    pool.query('SELECT * FROM cart WHERE userSeq=?', user_id, (err, result) => {
        res.status(200).send(result);
    })
})

router.post('/',(req, res, next) => {
    let {productSeq, userSeq, price, image, p_name, productNum} = req.body
    console.log(req.body);
    console.log(productSeq, userSeq, price, image, p_name, productNum);
    pool.query('INSERT INTO cart (productSeq, userSeq, price, image, p_name, productNum) VALUES (?,?,?,?,?,?)',
        [productSeq, userSeq, price, image, p_name, productNum],(err, result) => {
        console.log("2");
        console.log(result);
        res.status(200).send(result);
        })
})



module.exports = router;
