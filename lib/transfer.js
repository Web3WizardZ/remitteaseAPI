class TransferManager {
    constructor(config = {}) {
      this.apiUrl = config.apiUrl || 'https://remittease-api.vercel.app/api/v1';
    }
  
    async send(transferData) {
      const fees = this.calculateFees(transferData.amount);
      const rate = this.getExchangeRate(transferData.fromCurrency, transferData.toCurrency);
  
      const response = await fetch(`${this.apiUrl}/transfer/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...transferData,
          fees,
          exchangeRate: rate
        })
      });
  
      return await response.json();
    }
  
    calculateFees(amount) {
      const networkFee = amount * 0.001;
      const serviceFee = amount * 0.005;
      return {
        network: networkFee,
        service: serviceFee,
        total: networkFee + serviceFee
      };
    }
  
    getExchangeRate(fromCurrency, toCurrency) {
      const rates = {
        USD: 1,
        ZAR: 18.5,
        NGN: 755,
        KES: 130,
        GHS: 11
      };
      return rates[toCurrency] / rates[fromCurrency];
    }
  }
  
  module.exports = TransferManager;