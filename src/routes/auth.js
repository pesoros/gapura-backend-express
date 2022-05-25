const express = require('express')
const Auth = require('../controllers/auth')
const jwtCheck = require('../helper/jwt')
const randomguy = require('../helper/randomguy')
const Route = express.Router()

Route.post('/login', Auth.login)

module.exports = Route
