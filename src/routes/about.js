const express = require('express')
const multer = require('multer')
const About = require('../controllers/about')
const jwtCheck = require('../helper/jwt')
const randomguy = require('../helper/randomguy')
const Route = express.Router()

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, './public/images/about')
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

Route.get('/', About.getAll)
    .get('/show/:about_id', About.getSingleAbout)
    .patch('/update', upload.single('image'), About.updateAbout)

module.exports = Route
 