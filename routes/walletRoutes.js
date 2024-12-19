const express = require('express');
const router = express.Router();
const ethers = require('ethers');

// Create wallet
router.post('/create', async (req, res) => {
  try {
    const { fullName, email, currency } = req.body;
    const wallet = ethers.Wallet.createRandom();
    
    res.json({
      success: true,
      wallet: {
        address: wallet.address,
        balance: "0.00",
        seed: wallet.mnemonic.phrase
      },
      user: { fullName, email, currency }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get balance
router.get('/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const balance = await provider.getBalance(address);
    
    res.json({
      success: true,
      balance: ethers.utils.formatEther(balance)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;