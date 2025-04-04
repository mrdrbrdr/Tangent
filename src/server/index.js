// The core Express setup, route definitions.

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import route modules
const chatRoutes = require('./routes/chat');
const forkRoutes = require('./routes/fork');
const conversationRoutes = require('./routes/conversation');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Apply routes
app.use('/api', chatRoutes);
app.use('/api', forkRoutes);
app.use('/api', conversationRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});