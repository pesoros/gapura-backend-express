const express = require('express')
const Article = require('../controllers/article')
const jwtCheck = require('../helper/jwt')
const Route = express.Router()

Route.get('/', Article.getAll)
    .get('/show/:article_id', Article.getSingleArticle)
    .get('/slug/:slug', Article.getSingleArticleSlug)
    .post('/add',  Article.addArticle)
    .patch('/update',  Article.updateArticle)
    .delete('/delete/:article_id',  Article.deleteArticle)

module.exports = Route
