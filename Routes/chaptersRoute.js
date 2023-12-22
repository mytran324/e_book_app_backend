const express = require('express');
const chaptersController = require('../controllers/chaptersController');
const router = express.Router();


router.get('/', chaptersController.getChapters);
router.post('/add/', chaptersController.addChapters);

module.exports = router;


