const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(express.json()); // Parse incoming requests as JSON
app.use(cors()); // Allow API access from other applications

// Import routes
const transferRoutes = require('./routes/transferRoutes');
const withdrawRoutes = require('./routes/withdrawRoutes');

// Register routes
app.use('/api/v1/transfer', transferRoutes);
app.use('/api/v1/withdraw', withdrawRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API is running on port ${PORT}`));
