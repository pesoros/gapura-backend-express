const express = require('express')
const Article = require('../controllers/article')
const jwtCheck = require('../helper/jwt')
const Route = express.Router()

Route.get('/', Article.getAll)
    .get('/show/:article_id', Article.getSingleArticle)
    .get('/slug/:slug', Article.getSingleArticleSlug)
    .post('/add', jwtCheck.CheckToken, Article.addArticle)
    .patch('/update', jwtCheck.CheckToken, Article.updateArticle)
    .delete('/delete/:article_id', jwtCheck.CheckToken, Article.deleteArticle)

module.exports = Route
