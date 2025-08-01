// src/server/routes/chat.js
import express from 'express';
import { getConversationResponse } from '../controllers/conversation.js';
import { updateNodeWithSummaries } from '../controllers/summarization.js';
import { 
  getOrCreateDefaultUser, 
  getOrCreateDefaultConversation, 
  createMainNode,
  assemblingChatContext
} from '../controllers/nodes.js';
import prisma from '../db.js';

const router = express.Router();

router.post('/chat', async (req, res) => {
  const { message: userInput, conversationId } = req.body;
  
  try {
    // Get the specified conversation, or create default if not provided
    let conversation;
    if (conversationId) {
      // Try to find the provided conversation ID
      conversation = await prisma.conversation.findUnique({
        where: { id: parseInt(conversationId) }
      });
      
      // If conversation doesn't exist, fall back to creating default
      if (!conversation) {
        console.log(`Conversation ${conversationId} not found, creating default conversation`);
        const user = await getOrCreateDefaultUser();
        conversation = await getOrCreateDefaultConversation(user.id);
      }
    } else {
      // Fallback: create default user and conversation if no ID provided
      const user = await getOrCreateDefaultUser();
      conversation = await getOrCreateDefaultConversation(user.id);
    }

    // Find the latest node in this conversation to use as parent
    const latestNode = await prisma.node.findFirst({
      where: { 
        conversationId: conversation.id,
        branchType: 'MAIN'  // Only continue from main thread nodes
      },
      orderBy: { createdAt: 'desc' }
    });

    // Build conversation context for LLM
    const compiledChatContext = latestNode 
      ? await assemblingChatContext(conversation.id, latestNode.id)
      : [];

    // Step 1: Get natural conversation response (no JSON constraints!)
    const aiResponse = await getConversationResponse(userInput, compiledChatContext, 'default');

    // Step 2: Create node immediately with response (summaries will be added later)
    const newNode = await createMainNode(
      conversation.id,
      userInput,
      aiResponse,
      null,  // summaryShort - will be updated later
      null,  // summaryLong - will be updated later
      latestNode?.id || null  // Use latest main node as parent, or null for first message
    );

    // Step 3: Send immediate response to user (don't wait for summaries)
    res.json({
      response: aiResponse,
      shortSummary: "Generating summary...",  // Placeholder
      longSummary: "Summary being generated in background...",  // Placeholder
      nodeId: newNode.id
    });

    // Step 4: Generate summaries in background (async, don't block response)
    updateNodeWithSummaries(newNode.id, userInput, aiResponse);

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to process your request'
    });
  }
});

export default router;