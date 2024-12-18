const { calculateFees } = require('../utils/calculateFees');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    const { amount, fromCurrency, toCurrency, recipientDetails } = req.body;

    if (!amount || !fromCurrency || !toCurrency || !recipientDetails) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const fees = calculateFees(amount);
    const totalAmount = amount + fees.total;
    const transactionId = `TX-${Date.now()}`;

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
