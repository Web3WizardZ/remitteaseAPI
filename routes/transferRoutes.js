const express = require('express');
const router = express.Router();

router.post('/send', async (req, res) => {
  try {
    const { amount, fromCurrency, toCurrency, recipientDetails } = req.body;
    
    const fees = {
      network: amount * 0.001,
      service: amount * 0.005,
      total: (amount * 0.001) + (amount * 0.005)
    };

    const transactionId = `TX-${Date.now()}`;

    res.json({
      success: true,
      transactionId,
      fees,
      amount,
      message: 'Transfer complete'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;