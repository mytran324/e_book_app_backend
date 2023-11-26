const express = require('express');
const {getAllAuthor} = require('../controllers/authorController');

const router = express.Router();

router.get('/author', getAllAuthor);

module.exports = {
    routes: router
}
