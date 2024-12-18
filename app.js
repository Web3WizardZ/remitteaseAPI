const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Import routes
const transferRoutes = require('./routes/transferRoutes');
const withdrawRoutes = require('./routes/withdrawRoutes');

// Register routes
app.use('/api/v1/transfer', transferRoutes);
app.use('/api/v1/withdraw', withdrawRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Handle root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'RemittEase API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`API is running on port ${PORT}`));
}

// For Vercel
module.exports = app;