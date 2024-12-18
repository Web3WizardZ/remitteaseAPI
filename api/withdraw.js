module.exports = async (req, res) => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
      }
  
      const { amount, currency, recipientAddress } = req.body;
  
      if (!amount || !currency || !recipientAddress) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      const transactionId = `WD-${Date.now()}`;
  
      res.status(200).json({
        status: 'success',
        transactionId,
        message: 'Funds have been withdrawn successfully.'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while processing your request',
        error: error.message
      });
    }
  };
  