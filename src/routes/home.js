const express = require('express')
const Home = require('../controllers/home')
const jwtCheck = require('../helper/jwt')
const Route = express.Router()

Route.get('/', Home.getAll)
    .get('/show/:position', jwtCheck.CheckToken, Home.getSingle)
    .patch('/', jwtCheck.CheckToken, Home.updateHome)

module.exports = Route
 