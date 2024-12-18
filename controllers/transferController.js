const { calculateFees } = require('../utils/calculateFees');

exports.sendMoney = async (req, res) => {
  try {
    const { amount, fromCurrency, toCurrency, recipientDetails } = req.body;

    if (!amount || !fromCurrency || !toCurrency || !recipientDetails) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const fees = calculateFees(amount);
    const totalAmount = amount + fees.total;

    const transactionId = `TX-${Date.now()}`; // Simulate a unique transaction ID

    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate processing delay

    res.status(200).json({
      status: 'success',
      transactionId,
      fees,
      totalAmount,
      message: 'Transfer complete. The recipient will receive the funds shortly.'
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while processing your request',
      error: error.message
    });
  }
};
