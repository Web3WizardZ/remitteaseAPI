// remittease-sdk/index.js
class RemitteaseSDK {
    constructor(config = {}) {
      this.apiUrl = config.apiUrl || 'https://remittease-api.vercel.app/api/v1';
    }
  
    async transfer({ amount, fromCurrency, toCurrency, recipientDetails }) {
      try {
        const response = await fetch(`${this.apiUrl}/transfer/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            fromCurrency,
            toCurrency,
            recipientDetails
          })
        });
  
        return await response.json();
      } catch (error) {
        throw error;
      }
    }
  
    async withdraw({ amount, currency, recipientAddress }) {
      try {
        const response = await fetch(`${this.apiUrl}/withdraw`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            currency,
            recipientAddress
          })
        });
  
        return await response.json();
      } catch (error) {
        throw error;
      }
    }
  }
  
  module.exports = RemitteaseSDK;