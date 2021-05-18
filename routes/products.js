const express = require('express');
const Product = require('../models/product');
const router = express.Router();


router.post('/', async (req, res, next) => {
        try {
            await Product.create({
                p_name: req.body.p_name,
                description: req.body.description,
                cat_id: req.body.cat_id,
                price: req.body.price,
                stock: req.body.stock,
                file: req.body.file,
            });
            return res.status(200).send({message: `상품을 생성하였습니다:)`});
        } catch (err) {
            return res.status(500).json(err);
        }
})

// 등록된 product 보기
router.get('/', async (req, res, next) => {
    pool.query('SELECT * FROM product WHERE exist=1', function (err, products){
        if(err) throw err;
        return res.status(200).send(products);
        res.end();
    });
})

//가격 차순 : ?order=ASC/오름 DESC/내림
router.get('/sort', async (req, res, next) => {
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
router.get('/:p_id', async (req, res, next) => {
    console.log(req.params.p_id)
    pool.query('SELECT * FROM product WHERE p_id=?', req.params.p_id, (err2, product) => {
        console.log(product);
        if (err2) throw err2;
        return res.send(product);
        res.end();
    });
})

//product 카테고리 별로 정
router.get('/category/:categoryID', async (req, res, next) => {
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

//patch
router.patch('/:p_id', /*IsAdmin,*/ async (req, res, next) => {
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
        try {
            await Product.update({
                p_name: req.body.p_name,
                description: req.body.description,
                cat_id: req.body.cat_id,
                price: req.body.price,
                stock: req.body.stock,
                file: req.body.file,
            },
            {
                where: {p_id: req.params.p_id},
            });
            product = await Product.findOne({where: {id: req.params.p_id}})
            return res.json(product);
        } catch (err) {
            return res.status(500).json(err);
        }
})

//delete
router.delete('/:p_id', /*IsAdmin,*/ async (req, res, next) => {
    try {
        await Product.destroy({
            where: {p_id: req.params.p_id},
        });
        return res.status(200).send(`${req.params.cat_id} 배너가 삭제되었습니다.`);
    } catch (err) {
        return res.status(500).json(err);
    }
});


module.exports = router;