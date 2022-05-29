const express = require('express')
const User = require('../controllers/user')
const jwtCheck = require('../helper/jwt')
const randomguy = require('../helper/randomguy')
const Route = express.Router()

Route.get('/', User.getAll)
    .get('/show/:user_id', User.getSingleUser)
    .post('/add', jwtCheck.CheckToken, User.addUser)
    .patch('/update', jwtCheck.CheckToken, User.updateUser)
    .delete('/delete/:user_id', jwtCheck.CheckToken, User.deleteUser)

module.exports = Route
