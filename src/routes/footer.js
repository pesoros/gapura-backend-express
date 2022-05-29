const express = require('express')
const Footer = require('../controllers/footer')
const jwtCheck = require('../helper/jwt')
const randomguy = require('../helper/randomguy')
const Route = express.Router()

Route.get('/', Footer.getAll)
    .patch('/', jwtCheck.CheckToken, Footer.updateFooter)

module.exports = Route
 