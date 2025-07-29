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
async function createMainNode(conversationId, userInput, aiResponse, summaryShort, summaryLong) {
  return await prisma.node.create({
    data: {
      conversationId,
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

export {
  getOrCreateDefaultUser,
  getOrCreateDefaultConversation,
  createMainNode,
  createTangentNode
};