const express = require('express')
const article = require('./routes/article')
const categories = require('./routes/categories')
const about = require('./routes/about')
const footer = require('./routes/footer')
const Route = express.Router()

Route
    .use('/api/v1/article', article)
    .use('/api/v1/categories', categories)
    .use('/api/v1/about', about)
    .use('/api/v1/footer', footer)

module.exports = Route
