// src/server/controllers/nodes.js
import prisma from '../db.js';

// Get or create default user
async function getOrCreateDefaultUser() {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'default@example.com',
      },
    });
  }
  return user;
}


// Get or create default conversation
async function getOrCreateDefaultConversation(userId) {
  let conversation = await prisma.conversation.findFirst();
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        userId: userId,
        title: 'Default Conversation',
      },
    });
  }
  return conversation;
}

// Create a main node (regular chat message)
async function createMainNode(conversationId, userInput, aiResponse, summaryShort, summaryLong, parentNodeId = null) {
  return await prisma.node.create({
    data: {
      conversationId,
      parentNodeId,
      userInput,
      aiResponse,
      summaryShort,
      summaryLong,
      branchType: 'MAIN',
    },
  });
}

// Create a tangent node (forked from another node)
async function createTangentNode(conversationId, parentNodeId, userInput, aiResponse, summaryShort, summaryLong) {
  return await prisma.node.create({
    data: {
      conversationId,
      parentNodeId,
      userInput,
      aiResponse,
      summaryShort,
      summaryLong,
      branchType: 'TANGENT',
    },
  });
}

// Build conversation history from root to latest for LLM context
async function assemblingChatContext(conversationId, latestNodeId) {
  if (!latestNodeId) {
    return []; // No context for first message
  }

  const conversationPath = [];
  let currentNode = await prisma.node.findUnique({
    where: { id: latestNodeId },
    select: {
      id: true,
      parentNodeId: true,
      userInput: true,
      aiResponse: true
    }
  });
  
  // Trace back to root node
  while (currentNode) {
    conversationPath.unshift(currentNode); // Add to beginning of array
    if (currentNode.parentNodeId) {
      currentNode = await prisma.node.findUnique({
        where: { id: currentNode.parentNodeId },
        select: {
          id: true,
          parentNodeId: true,
          userInput: true,
          aiResponse: true
        }
      });
    } else {
      break; // Reached root
    }
  }
  
  // Convert to LLM-formatted messages with full context
  const compiledChatContext = [];
  for (const node of conversationPath) {
    compiledChatContext.push(
      { role: 'user', content: node.userInput },
      { role: 'assistant', content: node.aiResponse }
    );
  }
  
  return compiledChatContext;
}

export {
  getOrCreateDefaultUser,
  getOrCreateDefaultConversation,
  createMainNode,
  createTangentNode,
  assemblingChatContext
};