const express = require('express');
const bookController = require('../controllers/bookController');
const multer = require('multer');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', bookController.getAllBook);
router.post('/add/',upload.fields([{ name: 'bookReview' }, { name: 'imageUrl' }]), bookController.addBook);
router.get('/get/', bookController.getBook);
router.put('/delete/', bookController.deleteBook);

module.exports = router;
