const express = require('express');
const { ethers } = require('ethers');
const { MongoClient } = require('mongodb');
const crypto = require('crypto');

const router = express.Router();

// MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function createWallet(req, res) {
  try {
    const { fullName, email, currency } = req.body;

    // Validate required fields
    if (!fullName || !email || !currency) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Create Ethereum wallet
    const wallet = ethers.Wallet.createRandom();
    const walletAddress = wallet.address;
    const privateKey = wallet.privateKey;
    const mnemonic = wallet.mnemonic.phrase;

    // Generate a unique user ID
    const userId = crypto.randomBytes(16).toString('hex');

    // Connect to MongoDB
    await client.connect();
    const db = client.db('remittease');
    const users = db.collection('users');

    // Check if email already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Create user document
    const user = {
      _id: userId,
      fullName,
      email,
      currency,
      walletAddress,
      // Store encrypted private key in production
      privateKey: privateKey,
      createdAt: new Date(),
      lastLogin: new Date()
    };

    // Insert user into database
    await users.insertOne(user);

    // Return success response
    res.status(201).json({
      success: true,
      user: {
        id: userId,
        name: fullName,
        email,
        currency
      },
      wallet: {
        address: walletAddress,
        balance: "0.00",
        seed: mnemonic
      }
    });

  } catch (error) {
    console.error('Wallet creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create wallet'
    });
  } finally {
    await client.close();
  }
}

// Route handler
router.post('/create', createWallet);

module.exports = router;