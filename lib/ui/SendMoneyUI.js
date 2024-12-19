import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Stepper, Form, Input, Select } from './components';

export const SendMoneyUI = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const sdk = new RemitteaseSDK();
      const result = await sdk.transfer.send({
        ...formData,
        ...data
      });
      onComplete?.(result);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Card>
      <Stepper steps={['Amount', 'Recipient', 'Review']} current={step} />
      
      {step === 1 && (
        <Form onSubmit={(data) => {
          setFormData({ ...formData, ...data });
          setStep(2);
        }}>
          <CurrencySelect name="fromCurrency" label="From" />
          <CurrencySelect name="toCurrency" label="To" />
          <Input 
            name="amount" 
            type="number" 
            label="Amount"
            onChange={(e) => calculateFees(e.target.value)}
          />
          {formData.amount && <FeesSummary amount={formData.amount} />}
        </Form>
      )}

      {step === 2 && (
        <RecipientForm
          onBack={() => setStep(1)}
          onSubmit={(data) => {
            setFormData({ ...formData, recipientDetails: data });
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <TransactionReview
          data={formData}
          onBack={() => setStep(2)}
          onConfirm={handleSubmit}
          loading={loading}
        />
      )}
    </Card>
  );
};