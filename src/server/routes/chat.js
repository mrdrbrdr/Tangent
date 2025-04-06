// src/server/routes/chat.js
import express from 'express';
import { getLLMResponseWithSummaries } from '../controllers/llm.js';
import { 
  getOrCreateDefaultUser, 
  getOrCreateDefaultConversation, 
  createMainNode 
} from '../controllers/nodes.js';

const router = express.Router();

router.post('/chat', async (req, res) => {
  const userInput = req.body.message;
  
  try {
    // For MVP, create default user and conversation if they don't exist
    const user = await getOrCreateDefaultUser();
    const conversation = await getOrCreateDefaultConversation(user.id);

    // Get LLM response with summaries
    const { mainAnswer, summaryShort, summaryLong } = 
      await getLLMResponseWithSummaries(userInput);

    // Create new node
    const newNode = await createMainNode(
      conversation.id,
      userInput,
      mainAnswer,
      summaryShort,
      summaryLong
    );

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

export default router;