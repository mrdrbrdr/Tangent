// The core Express setup, route definitions.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getLLMResponseWithSummaries } = require('./controllers/llm');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/api/chat', async (req, res) => {
  const userInput = req.body.message;
  
  // For MVP, we'll use default IDs
  const userId = 1;  // Assuming we have a user with ID 1
  const conversationId = 1;

  try {
    // 1. Get LLM response with summaries
    const { mainAnswer, summaryShort, summaryLong } = 
      await getLLMResponseWithSummaries(userInput);

    // 2. Save to database with separated user input and AI response
    const newMessage = await prisma.message.create({
      data: {
        userInput,
        aiResponse: mainAnswer,
        summaryShort,
        summaryLong,
        messageType: 'MAIN',
        conversationId,
        // parentMessageId remains null for main thread messages
      }
    });

    // 3. Send response back to client
    res.json({
      response: mainAnswer,
      shortSummary: summaryShort,
      longSummary: summaryLong,
      messageId: newMessage.id
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to process your request.' 
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});