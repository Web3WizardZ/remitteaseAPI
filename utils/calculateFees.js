exports.calculateFees = (amount) => {
    const networkFee = amount * 0.001; // 0.1% fee
    const serviceFee = amount * 0.005; // 0.5% fee
    return {
      network: parseFloat(networkFee.toFixed(2)),
      service: parseFloat(serviceFee.toFixed(2)),
      total: parseFloat((networkFee + serviceFee).toFixed(2))
    };
  };
  