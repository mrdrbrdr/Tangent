// src/server/routes/fork.js
import express from 'express';
import { getConversationResponse } from '../controllers/conversation.js';
import { updateNodeWithSummaries } from '../controllers/summarization.js';
import { createTangentNode, assemblingChatContext } from '../controllers/nodes.js';
import prisma from '../db.js';

const router = express.Router();

router.post('/fork', async (req, res) => {
  const { parentNodeId, userInput } = req.body;
  
  try {
    // 1) Validate parentNode
    const parentNode = await prisma.node.findUnique({
      where: { id: parseInt(parentNodeId) },
    });
    
    if (!parentNode) {
      return res.status(404).json({ error: "Parent node not found" });
    }

    // 2) Extract the conversationId from the parent
    const conversationId = parentNode.conversationId;

    // 3) Build conversation context from the fork point
    const compiledChatContext = await assemblingChatContext(conversationId, parentNodeId);

    // 4) Get natural conversation response (no JSON constraints!)
    const aiResponse = await getConversationResponse(userInput, compiledChatContext, 'default');

    // 5) Create the new tangent node immediately with response (summaries will be added later)
    const newNode = await createTangentNode(
      conversationId,
      parentNodeId,
      userInput,
      aiResponse,
      null,  // summaryShort - will be updated later
      null   // summaryLong - will be updated later
    );

    // 6) Send immediate response to client (don't wait for summaries)
    res.json({
      response: aiResponse,
      shortSummary: "Generating summary...",  // Placeholder
      longSummary: "Summary being generated in background...",  // Placeholder
      nodeId: newNode.id,
      branchType: 'TANGENT'
    });

    // 7) Generate summaries in background (async, don't block response)
    updateNodeWithSummaries(newNode.id, userInput, aiResponse);
  } catch (error) {
    console.error("Error creating fork:", error);
    res.status(500).json({ error: error.message || "Failed to fork from parent node" });
  }
});

export default router;