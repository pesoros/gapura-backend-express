const express = require('express')
const Categories = require('../controllers/categories')
const jwtCheck = require('../helper/jwt')
const Route = express.Router()

Route.get('/', Categories.getAll)
    .get('/show/:categories_id', Categories.getSingleCategories)
    .post('/add', jwtCheck.CheckToken, Categories.addCategories)
    .patch('/update', jwtCheck.CheckToken, Categories.updateCategories)
    .delete('/delete/:categories_id', jwtCheck.CheckToken, Categories.deleteCategories)

module.exports = Route
