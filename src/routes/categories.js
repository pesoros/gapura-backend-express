const express = require('express')
const multer = require('multer')
const Categories = require('../controllers/categories')
const jwtCheck = require('../helper/jwt')
const randomguy = require('../helper/randomguy')
const Route = express.Router()

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, './public/images/categories')
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

Route.get('/', Categories.getAll)
    .get('/show/:categories_id', Categories.getSingleCategories)
    .post('/add', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'background', maxCount: 1 }]), Categories.addCategories)
    .patch('/update', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'background', maxCount: 1 }]), Categories.updateCategories)
    .delete('/delete/:categories_id', Categories.deleteCategories)

module.exports = Route
