const express = require('express');
const { sendMoney } = require('../controllers/transferController');

const router = express.Router();

router.post('/send', sendMoney); // POST request to send money

module.exports = router;
