const express = require('express')
const multer = require('multer')
const Article = require('../controllers/article')
const jwtCheck = require('../helper/jwt')
const Route = express.Router()

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, './public/images/products')
    },
    filename: (request, file, callback) => {
        callback(null, file.originalname)
    }
})

const upload = multer({
    storage
})

Route.get('/', Article.getAll)

module.exports = Route
