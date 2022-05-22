const express = require('express')
const article = require('./routes/article')
const Route = express.Router()

Route
    .use('/api/v1/article', article)

module.exports = Route
