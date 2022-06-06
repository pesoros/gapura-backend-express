const express = require('express')
const Categories = require('../controllers/categories')
const jwtCheck = require('../helper/jwt')
const Route = express.Router()

Route.get('/', Categories.getAll)
    .get('/show/:categories_id', Categories.getSingleCategories)
    .post('/add',  Categories.addCategories)
    .patch('/update',  Categories.updateCategories)
    .delete('/delete/:categories_id',  Categories.deleteCategories)

module.exports = Route
