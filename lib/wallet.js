const ethers = require('ethers');

class WalletManager {
  constructor(config = {}) {
    this.apiUrl = config.apiUrl || 'https://remittease-api.vercel.app/api/v1';
    this.provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
  }

  async create(userData) {
    const wallet = ethers.Wallet.createRandom();
    
    const response = await fetch(`${this.apiUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...userData,
        walletAddress: wallet.address,
        seed: wallet.mnemonic.phrase
      })
    });

    const result = await response.json();
    return { wallet, user: result };
  }

  async getBalance(address) {
    return await this.provider.getBalance(address);
  }

  async validateSeed(seed) {
    try {
      return ethers.utils.HDNode.fromMnemonic(seed);
    } catch {
      return false;
    }
  }
}

module.exports = WalletManager;