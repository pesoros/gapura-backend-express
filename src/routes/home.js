const express = require('express')
const multer = require('multer')
const Home = require('../controllers/home')
const jwtCheck = require('../helper/jwt')
const randomguy = require('../helper/randomguy')
const Route = express.Router()

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, './public/images/home')
    },
    filename: (request, file, callback) => {
        const fileoriname = file.originalname
        const fileSplit = fileoriname.split('.')
        const fileExtension = fileSplit[fileSplit.length - 1]
        const fileName = randomguy.randNumb('gapura')+'.'+fileExtension

        callback(null, fileoriname)
    }
})

const upload = multer({
    storage
})

Route.get('/', Home.getAll)
    .get('/show/:position', Home.getSingle)
    .patch('/', upload.single('image'), Home.updateHome)

module.exports = Route
 