const express = require('express')
const article = require('./routes/article')
const categories = require('./routes/categories')
const about = require('./routes/about')
const footer = require('./routes/footer')
const home = require('./routes/home')
const user = require('./routes/user')
const assets = require('./routes/assets')
const auth = require('./routes/auth')
const Route = express.Router()

Route
    .use('/api/v1/article', article)
    .use('/api/v1/categories', categories)
    .use('/api/v1/about', about)
    .use('/api/v1/footer', footer)
    .use('/api/v1/home', home)
    .use('/api/v1/user', user)
    .use('/api/v1/assets', assets)
    .use('/api/v1/auth', auth)

module.exports = Route
