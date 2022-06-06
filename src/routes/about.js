const express = require('express')
const About = require('../controllers/about')
const jwtCheck = require('../helper/jwt')
const Route = express.Router()

Route.get('/', About.getAll)
    .get('/show/:about_id', About.getSingleAbout)
    .patch('/update',  About.updateAbout)

module.exports = Route
 