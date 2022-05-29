const User = require('../models/User')
const fs = require('fs-extra')
const misc = require('../helper/misc')
const randomguy = require('../helper/randomguy')
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10);

module.exports = {

    getAll: async (request, response) => {

            const page = parseInt(request.query.page) || 1
            const search = request.query.search || ''
            const limit = request.query.limit || 10
            const sort = request.query.sort || 'DESC'
            const sortBy = request.query.sortBy || 'createdAt'
            const offset = (page - 1) * limit
        try {
            const total = await User.getUserCount()
            const prevPage = page === 1 ? 1 : page - 1
            const nextPage = page === total[0].total ? total[0].total : page + 1
            const data = await User.getAll(offset, limit, sort, sortBy, search)

            if (data.length == 0) {
                return misc.response(response, 400, false, 'Data not found')
            }

            let pageDetail = {
                total: Math.ceil(total[0].total),
                per_page: limit,
                current_page: page,
                nextLink: `${request.get('host')}${request.originalUrl.replace('page=' + page, 'page=' + nextPage)}`,
                prevLink: `${request.get('host')}${request.originalUrl.replace('page=' + page, 'page=' + prevPage)}`
            }

            misc.responsePagination(response, 200, false, 'Successfull get all data', pageDetail, data, request.originalUrl)
        } catch (error) {
            console.error(error)
            misc.response(response, 500, true, 'Server error')
        }

    },

    getSingleUser: async (request, response) => {

        const user_id = request.params.user_id

        try {
            const data = await User.getSingleUser(user_id)
            if (!data) {
                return misc.response(response, 400, false, 'Data not found')
            }
            
            misc.response(response, 200, false, 'Successfull get single User', data, request.originalUrl)

        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server error')
        }

    },

    addUser: async (request, response) => {

        let error = false

        const fullname = request.body.fullname
        const username = request.body.username
        const email = request.body.email
        const phone = request.body.phone
        const password = request.body.password
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ')

        const passwordHash = await bcrypt.hashSync(password, salt);

        try {
            if(error === false) {
                const response_addUser = await User.addUser(fullname, username, email, phone, passwordHash, timestamp)
                const data = {
                    fullname,
                    username,
                    email,
                    phone
                }
                misc.response(response, 200, false, 'Successfull create User', data)
            }
        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server Error')
        }

    },
    updateUser: async (request, response) => {

        let error = false

        const user_id = request.body.user_id
        const fullname = request.body.fullname
        const username = request.body.username
        const email = request.body.email
        const phone = request.body.phone
        const password = request.body.password
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ')

        const passwordHash = await bcrypt.hashSync(password, salt);

        try {
            if(error === false) {
                await User.updateUser(user_id, fullname, username, email, phone, passwordHash, timestamp)

                const data = {
                    fullname,
                    username,
                    email,
                    phone
                }
                misc.response(response, 200, false, 'Successfull update User', data)
            }
        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server Error')
        }

    },
    deleteUser: async (request, response) => {

        const user_id = request.params.user_id

        try {
            await User.deleteUser(user_id)
            misc.response(response, 200, false, 'Successfull delete User')
        } catch(error) {
            console.error(error)
            misc.response(response, 500, true, 'Server error')
        }

    },
}
