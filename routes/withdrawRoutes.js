const express = require('express');
const { withdrawFunds } = require('../controllers/withdrawController');

const router = express.Router();

router.post('/', withdrawFunds); // POST request to withdraw funds

module.exports = router;
