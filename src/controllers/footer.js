const Footer = require('../models/Footer')
const fs = require('fs-extra')
const misc = require('../helper/misc')
const randomguy = require('../helper/randomguy')

module.exports = {

    getAll: async (request, response) => {
        try {
            const data = await Footer.getAll()

            if (data.length == 0) {
                return misc.response(response, 400, false, 'Data not found')
            }

            misc.responsePagination(response, 200, false, 'Successfull get all data', [], data, request.originalUrl)
        } catch (error) {
            console.error(error)
            misc.response(response, 500, true, 'Server error')
        }

    },
    updateFooter: async (request, response) => {

        let error = false

        const copyright = request.body.copyright
        const address = request.body.address
        const phone = request.body.phone
        const dinas = request.body.dinas
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ')

        try {
            if(error === false) {
                await Footer.updateFooter(copyright, address, phone, dinas, timestamp) 

                const data = {
                    copyright,
                    address,
                    phone,
                    dinas 
                }
                misc.response(response, 200, false, 'Successfull update footer', data)
            }
        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server Error')
        }
 
    },
}
