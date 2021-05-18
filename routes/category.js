const express = require('express');
const Category = require('../models/category');
const router = express.Router();


router.post('/', /*IsAdmin,*/ async (req, res, next) => {
    console.log('post /categoriy OK');
    try {
        await Category.create({
            cat_name: req.body.cat_name,
            cat_pid: req.body.cat_pid,
        });
        return res.status(200).send({message: `${req.body.cat_name} 배너를 생성하였습니다:)`});
    } catch (err) {
        return res.status(500).json(err);
    }
})

router.get('/', async (req, res, next) => {
    console.log('get /categoriy OK');
    try {
        const categories = await Category.findAll({});
        return res.json(categories);
    } catch (err) {
        return res.status(500).json(err);
    }
})

router.get('/:cat_id', async (req, res, next) => {
    console.log('get /categoriy/:cat_id OK')
    try {
        const category = await Category.findOne({where: {cat_id: req.params.cat_id},});
        return res.json(category);
    } catch (err) {
        return res.status(400).json(err);
    }
})

router.patch('/:cat_id', /*IsAdmin ,*/ async (req, res, next) => {
        try {
            await Category.update({
                cat_name: req.body.cat_name,
                cat_pid: req.body.cat_pid,
            },
            {
                where: {cat_id: req.params.cat_id},
            });
            category = await Category.findOne({where: {id: req.params.cat_id}})
            return res.json(category);
        } catch (err) {
            return res.status(500).json(err);
        }
})

router.delete('/:cat_id', /*IsAdmin ,*/ async (req, res, next) => {
    try {
        await Category.destroy({
            where: {id: req.params.cat_id},
        });
        return res.status(200).send(`${req.params.cat_id} 배너가 삭제되었습니다.`);
    } catch (err) {
        return res.status(500).json(err);
    }
})

module.exports = router;