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
  
  try {
    // For MVP, we'll create a default user and conversation if they don't exist
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'default@example.com',
        },
      });
    }

    let conversation = await prisma.conversation.findFirst();
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: user.id,
          title: 'Default Conversation',
        },
      });
    }

    // Get LLM response with summaries
    const { mainAnswer, summaryShort, summaryLong } = 
      await getLLMResponseWithSummaries(userInput);

    // Create new node
    const newNode = await prisma.node.create({
      data: {
        conversationId: conversation.id,
        userInput,
        aiResponse: mainAnswer,
        summaryShort,
        summaryLong,
        branchType: 'MAIN', // For now, all messages are MAIN
      },
    });

    // Send response back to client
    res.json({
      response: mainAnswer,
      shortSummary: summaryShort,
      longSummary: summaryLong,
      nodeId: newNode.id
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to process your request'
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});