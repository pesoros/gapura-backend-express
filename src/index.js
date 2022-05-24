const express = require('express')
const article = require('./routes/article')
const categories = require('./routes/categories')
const about = require('./routes/about')
const Route = express.Router()

Route
    .use('/api/v1/article', article)
    .use('/api/v1/categories', categories)
    .use('/api/v1/about', about)

module.exports = Route
