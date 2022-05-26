const Attention = require('../models/Attention')
const misc = require('../helper/misc')

module.exports = {

    getAll: async (request, response) => {
        try {
            const data = await Attention.getAll()

            if (data.length == 0) {
                return misc.response(response, 400, false, 'Data not found')
            }

            misc.responsePagination(response, 200, false, 'Successfull get all data', [], data, request.originalUrl)
        } catch (error) {
            console.error(error)
            misc.response(response, 500, true, 'Server error')
        }

    },
    updateAttention: async (request, response) => {

        let error = false

        const content = request.body.content

        try {
            if(error === false) {
                await Attention.updateAttention(content) 

                const data = {
                    content,
                }
                misc.response(response, 200, false, 'Successfull update Attention', data)
            }
        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server Error')
        }
 
    },
}
