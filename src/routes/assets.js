const express = require('express')
const Assets = require('../controllers/assets')
const jwtCheck = require('../helper/jwt')
const Route = express.Router()

Route.get('/', Assets.getAll)
    .get('/show/:assets_id', Assets.getSingleAssets)
    .post('/add',  Assets.addAssets)
    .patch('/update',  Assets.updateAssets)
    .delete('/delete/:assets_id',  Assets.deleteAssets)

module.exports = Route
