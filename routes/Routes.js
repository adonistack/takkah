const express = require('express');
const router = express.Router();

// Import routes
const userRoute = require('./userRoute');
const deliveryRoute = require('./deliveryRoute');
const authRoute = require('./authRoute');
// Use routes
router.use('/user', userRoute);
router.use('/delivery', deliveryRoute);
router.use('/auth', authRoute);

module.exports = router;
