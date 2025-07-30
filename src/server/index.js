// The core Express setup, route definitions.

import 'dotenv/config';  // New way to import dotenv in ESM
import express from 'express';
import cors from 'cors';

// Import route modules
import chatRoutes from './routes/chat.js';  // Note: .js extension required in ESM
import forkRoutes from './routes/fork.js';
import conversationRoutes from './routes/conversation.js';
import userRoutes from './routes/user.js';

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
app.use('/api', userRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});