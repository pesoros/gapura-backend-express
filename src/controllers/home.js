const Home = require('../models/Home')
const fs = require('fs-extra')
const misc = require('../helper/misc')
const randomguy = require('../helper/randomguy')

module.exports = {

    getAll: async (request, response) => {
        try {
            const data = await Home.getAll()

            if (data.length == 0) {
                return misc.response(response, 400, false, 'Data not found')
            }

            misc.responsePagination(response, 200, false, 'Successfull get all data', [], data, request.originalUrl)
        } catch (error) {
            console.error(error)
            misc.response(response, 500, true, 'Server error')
        }

    },
    getSingle: async (request, response) => {
        const position = request.params.position

        try {
            const data = await Home.getSingle(position)
            if (!data) {
                return misc.response(response, 400, false, 'Data not found')
            }
            if (data.image == null) {
                data.imagelink = null
            } else {
                data.imagelink = request.get('host')+ '/images/home/' + data.image
            }
            
            misc.response(response, 200, false, 'Successfull get single Home', data, request.originalUrl)

        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server error')
        }

    },
    updateHome: async (request, response) => {

        let error = false

        const copyright = request.body.copyright
        const address = request.body.address
        const phone = request.body.phone
        const dinas = request.body.dinas
        const timestamp = request.timestamp

        try {
            if(error === false) {
                await Home.updateHome(copyright, address, phone, dinas, timestamp) 

                const data = {
                    copyright,
                    address,
                    phone,
                    dinas 
                }
                misc.response(response, 200, false, 'Successfull update Home', data)
            }
        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server Error')
        }
 
    },
}
