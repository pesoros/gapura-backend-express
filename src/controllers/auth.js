const Auth = require('../models/Auth')
const misc = require('../helper/misc')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const expir = '1h'

module.exports = {
    
    login: async (request, response) => {

        const { email, password } = request.body

        try {

            const user = await Auth.login(email)

            if (user.length === 0) {
                return response.status(400).json({ errors: [{ msg: 'User not found in our database' }] })
            }

            const isMatch = await bcrypt.compareSync(password, user[0].password);
            
            if (!isMatch) {
                return response.status(400).json({ errors: [{ msg: 'Password do not match' }] })
            }

            let role = 'admin'
            if (user[0].superAdmin === 1) {
                role = 'superadmin'
            }

            const payload = {
                user: {
                    id: user[0].id,
                    email: user[0].email
                },
                role: role
            }

            const token = await jwt.sign(payload, process.env.JWT_KEY, { expiresIn: expir })

            const data = {
                token,
                expired: expir,
                fullname: user[0].fullname,
                username: user[0].username,
                email: user[0].email,
                role: role
            }

            misc.response(response, 200, false, 'Successfull login', data)

        } catch(error) {
            console.error(error.message)
            misc.response(response, 500, true, 'Server error')
        }

    },
}
