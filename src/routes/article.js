const express = require('express')
const multer = require('multer')
const Article = require('../controllers/article')
const jwtCheck = require('../helper/jwt')
const randomguy = require('../helper/randomguy')
const Route = express.Router()

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, './public/images/articles')
    },
    filename: (request, file, callback) => {
        const fileoriname = file.originalname
        const fileSplit = fileoriname.split('.')
        const fileExtension = fileSplit[fileSplit.length - 1]
        const fileName = randomguy.randNumb('gapura')+'.'+fileExtension

        callback(null, fileName)
    }
})

const upload = multer({
    storage
})

Route.get('/', Article.getAll)
    .get('/show/:article_id', Article.getSingleArticle)

    .post('/add',upload.single('image'), Article.addArticle)
     .patch('/update', upload.single('image'), Article.updateArticle)
     .delete('delete/:article_id', Article.deleteArticle)

module.exports = Route
