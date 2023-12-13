const express = require('express');
const router = express.Router();
const adminRoutes = require('./adminRoute');
const authorRoutes = require('./authorRoute');
const bookRoutes = require('./bookRoute');
const categoryRoutes = require('./categoryRoute');
const userRoutes = require('./userRoute');

router.use('/admin', adminRoutes);
router.use('/author', authorRoutes);
router.use('/book', bookRoutes);
router.use('/category', categoryRoutes);
router.use('/user', userRoutes);

module.exports = router;