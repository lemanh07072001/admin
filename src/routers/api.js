const express = require('express');

const dashboardController = require('../controllers/dashboard.controller');
const { isAuthorized } = require('../middlewares/authMiddleware');
const authController = require('../controllers/auth.controller');
const router = express.Router()

router.post('/api/login', authController.login)
router.post('/api/register', authController.register)
router.get('/api/dashboard/access', isAuthorized, dashboardController.getUser)
router.post('/api/logout', authController.logout)
router.put('/api/refresh_token', authController.refreshToken)
module.exports = router;