// lib/RemitteaseSDK.js

const ethers = require('ethers');

class RemitteaseSDK {
  constructor(config = {}) {
    this.apiUrl = config.apiUrl || 'https://remittease-api.vercel.app/api/v1';
    this.provider = new ethers.providers.JsonRpcProvider(
      config.rpcUrl || 'https://opt-mainnet.g.alchemy.com/v2/your-api-key'
    );
  }

  // Wallet Management
  wallet = {
    create: async ({ fullName, email, currency }) => {
      try {
        const wallet = ethers.Wallet.createRandom();
        
        const response = await fetch(`${this.apiUrl}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName,
            email,
            currency,
            walletAddress: wallet.address,
            seed: wallet.mnemonic.phrase
          })
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.error);

        return {
          address: wallet.address,
          privateKey: wallet.privateKey,
          mnemonic: wallet.mnemonic.phrase,
          currency,
          balance: "0.00"
        };
      } catch (error) {
        throw new Error(`Wallet creation failed: ${error.message}`);
      }
    },

    getBalance: async (walletAddress) => {
      try {
        const balance = await this.provider.getBalance(walletAddress);
        return ethers.utils.formatEther(balance);
      } catch (error) {
        throw new Error(`Failed to get balance: ${error.message}`);
      }
    },

    login: async (walletAddress, secretKey) => {
      try {
        const response = await fetch(`${this.apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress, secretKey })
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.error);

        return result;
      } catch (error) {
        throw new Error(`Login failed: ${error.message}`);
      }
    }
  };

  // Transfer Management
  transfer = {
    calculateFees: (amount) => {
      const networkFee = amount * 0.001; // 0.1%
      const serviceFee = amount * 0.005; // 0.5%
      return {
        network: parseFloat(networkFee.toFixed(2)),
        service: parseFloat(serviceFee.toFixed(2)),
        total: parseFloat((networkFee + serviceFee).toFixed(2))
      };
    },

    getExchangeRate: (fromCurrency, toCurrency) => {
      const rates = {
        USD: 1,
        ZAR: 18.5,
        NGN: 755,
        KES: 130,
        GHS: 11
      };
      return rates[toCurrency] / rates[fromCurrency];
    },

    send: async ({ 
      amount, 
      fromCurrency, 
      toCurrency, 
      recipientDetails,
      senderWallet 
    }) => {
      try {
        const fees = this.transfer.calculateFees(amount);
        const rate = this.transfer.getExchangeRate(fromCurrency, toCurrency);
        const convertedAmount = amount * rate;

        // Create transaction data
        const transaction = {
          amount,
          fees,
          fromCurrency,
          toCurrency,
          convertedAmount,
          recipientDetails,
          timestamp: new Date().toISOString()
        };

        // Send to API
        const response = await fetch(`${this.apiUrl}/transfer/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transaction)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.error);

        return {
          ...result,
          fees,
          exchangeRate: rate,
          amountSent: amount,
          amountReceived: convertedAmount - (fees.total * rate)
        };
      } catch (error) {
        throw new Error(`Transfer failed: ${error.message}`);
      }
    }
  };

  // Utility Functions
  utils = {
    validateWalletAddress: (address) => {
      return ethers.utils.isAddress(address);
    },

    formatCurrency: (amount, currency) => {
      const symbols = {
        USD: '$', ZAR: 'R', NGN: '₦', KES: 'KSh', GHS: '₵'
      };
      return `${symbols[currency] || currency}${parseFloat(amount).toFixed(2)}`;
    },

    getSupportedCurrencies: () => {
      return [
        { code: 'USD', name: 'US Dollar', flag: '🇺🇸', rate: 1 },
        { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦', rate: 18.5 },
        { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬', rate: 755 },
        { code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪', rate: 130 },
        { code: 'GHS', name: 'Ghanaian Cedi', flag: '🇬🇭', rate: 11 }
      ];
    },

    getPaymentMethods: (countryCode) => {
      const methods = {
        USD: ['bank', 'card', 'wallet'],
        ZAR: ['bank', 'wallet', 'mobile'],
        NGN: ['bank', 'mobile'],
        KES: ['mobile', 'wallet'],
        GHS: ['mobile', 'bank']
      };
      return methods[countryCode] || ['bank'];
    }
  };

  // Events System
  events = {
    listeners: {},
    
    on: (event, callback) => {
      if (!this.events.listeners[event]) {
        this.events.listeners[event] = [];
      }
      this.events.listeners[event].push(callback);
    },

    emit: (event, data) => {
      if (this.events.listeners[event]) {
        this.events.listeners[event].forEach(callback => callback(data));
      }
    }
  };
}

// Export components separately for tree-shaking
RemitteaseSDK.WalletUI = require('./ui/WalletUI');
RemitteaseSDK.SendMoneyUI = require('./ui/SendMoneyUI');

module.exports = RemitteaseSDK;