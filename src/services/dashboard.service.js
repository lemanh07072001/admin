require('dotenv').config()
const { User } = require('../models');


module.exports = {
    dashboardService: async (req) => {

        try {
            // const userInfo = {
            //     id: req.jwtDecoded.id,
            //     email: req.jwtDecoded.email,

            // }
            if (!req.jwtDecoded.id) {
                throw new Error('User id không tồn tại')
            }

            const user = await User.findByPk(req.jwtDecoded.id);

            const userInfo = user.dataValues

            return userInfo;
        } catch (error) {

        }

    }
}