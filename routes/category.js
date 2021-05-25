const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const router = express.Router();
let mysql = require('mysql2');
const { IsAdmin } = require('./middlewares');
const Category = require('../models/category');

router.get('/', async (req, res, next) =>{
    try{
        let categories = await Category.findAll({});
        return res.status(200).json(categories);
    }catch (err){
        return res.status(500).json(err);
    }
})

router.get('/:cat_name', async (req, res, next)=>{
    let categoryName = req.params.cat_name;
    try{
        let category = await Category.findOne({where : { cat_name : categoryName}});
        return res.status(200).json(category);
    }catch (err){
        return res.status(500).json(err);
    }
})

router.post('/',/*IsAdmin ,*/ async (req, res, next)=>{
    let cat_name = req.body.cat_name;
    try{
        let category = await Category.create({
            cat_name: cat_name
        })
        return res.status(200).json(category);
    }catch (err){
        return res.status(500).json(err);
    }
})

router.patch('/:cat_name', /*IsAdmin,*/ async (req, res, next) => {
    let categoryName = req.body.cat_name;
    try{
        let category = await Category.update({
            cat_name : categoryName
        },{
            where : {cat_name: req.params.cat_name}
        })
        return res.status(200).json(category);
    }catch (err){
        return res.status(500).json(err);
    }
})
router.delete('/:cat_name',/*IsAdmin ,*/ async (req, res, next)=>{
    let categoryName = req.params.cat_name;
    try{
        let category = await Category.destroy({where : {cat_name : categoryName}});
        return res.status(200).json(category);
    }catch (err){
        return res.status(500).json(err);
    }
})

module.exports = router;

