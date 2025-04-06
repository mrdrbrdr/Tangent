// src/server/routes/fork.js
import express from 'express';
import { getLLMResponseWithSummaries } from '../controllers/llm.js';
import { createTangentNode } from '../controllers/nodes.js';
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

    // 3) Call LLM function to get the AI response & summaries
    const { mainAnswer, summaryShort, summaryLong } = 
      await getLLMResponseWithSummaries(userInput);

    // 4) Create the new tangent node
    const newNode = await createTangentNode(
      conversationId,
      parentNodeId,
      userInput,
      mainAnswer,
      summaryShort,
      summaryLong
    );

    // 5) Send response back to client
    res.json({
      response: mainAnswer,
      shortSummary: summaryShort,
      longSummary: summaryLong,
      nodeId: newNode.id,
      branchType: 'TANGENT'
    });
  } catch (error) {
    console.error("Error creating fork:", error);
    res.status(500).json({ error: error.message || "Failed to fork from parent node" });
  }
});

export default router;