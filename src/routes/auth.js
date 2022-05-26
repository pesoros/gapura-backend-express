const express = require('express')
const Auth = require('../controllers/auth')
const randomguy = require('../helper/randomguy')
const Route = express.Router()

Route.post('/check', Auth.checkToken)
        .post('/login', Auth.login)

module.exports = Route
