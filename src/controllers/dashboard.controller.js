const { dashboardService } = require("../services/dashboard.service")


module.exports = {
    getUser: async (req, res) => {

        try {
            const dashboardController = await dashboardService(req);

            res.status(200).json({ dashboardController })
        } catch (error) {
            res.status(410).json({ errorMessage: 'loi' })
        }

    }
}