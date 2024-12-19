import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Form, Input, Button } from './components';

export const WalletUI = ({ onSuccess, onError }) => {
  const [mode, setMode] = useState('create');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const sdk = new RemitteaseSDK();
      const result = mode === 'create' 
        ? await sdk.wallet.create(data)
        : await sdk.wallet.login(data);
      onSuccess?.(result);
    } catch (error) {
      onError?.(error);
    }
    setLoading(false);
  };

  return (
    <Card>
      <Tabs value={mode} onChange={setMode}>
        <Tab value="create">Create Wallet</Tab>
        <Tab value="login">Access Wallet</Tab>
      </Tabs>

      <Form onSubmit={handleSubmit}>
        {mode === 'create' ? (
          <>
            <Input name="fullName" label="Full Name" required />
            <Input name="email" type="email" label="Email" required />
            <CurrencySelect name="currency" label="Currency" required />
          </>
        ) : (
          <>
            <Input name="walletAddress" label="Wallet Address" required />
            <Input name="seed" label="Secret Key" type="password" required />
          </>
        )}
        <Button loading={loading}>
          {mode === 'create' ? 'Create Wallet' : 'Access Wallet'}
        </Button>
      </Form>
    </Card>
  );
};