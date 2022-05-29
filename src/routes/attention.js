const express = require('express')
const Attention = require('../controllers/attention')
const jwtCheck = require('../helper/jwt')
const Route = express.Router()

Route.get('/', Attention.getAll)
    .patch('/update', Attention.updateAttention)

module.exports = Route
 