const express = require('express')
const Home = require('../controllers/home')
const jwtCheck = require('../helper/jwt')
const Route = express.Router()

Route.get('/', Home.getAll)
    .get('/show/:position', Home.getSingle)
    .patch('/',  Home.updateHome)

module.exports = Route
 