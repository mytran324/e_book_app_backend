const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/profile/', adminController.getProfile);
router.post('/login/', adminController.loginAdmin);

module.exports = router;
