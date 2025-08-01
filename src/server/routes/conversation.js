import express from 'express';
import prisma from '../db.js';

const router = express.Router();

router.get('/conversation/:id/nodes', async (req, res) => {
  try {
    const conversationId = parseInt(req.params.id);
    
    const nodes = await prisma.node.findMany({
      where: {
        conversationId: conversationId
      },
      select: {
        id: true,
        parentNodeId: true,
        userInput: true,
        aiResponse: true,
        summaryShort: true,
        summaryLong: true,
        branchType: true,
        childNodes: {
          select: {
            id: true
          }
        }
      }
    });

    const rootNode = nodes.find(node => !node.parentNodeId);
    
    res.json({ 
      nodes,
      rootNodeId: rootNode?.id 
    });
  } catch (error) {
    console.error('Error fetching conversation nodes:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch conversation nodes'
    });
  }
});

// GET /api/conversations - List all conversations for default user
router.get('/conversations', async (req, res) => {
  try {
    const { getOrCreateDefaultUser } = await import('../controllers/nodes.js');
    const user = await getOrCreateDefaultUser();
    
    const conversations = await prisma.conversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' }
    });
    
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch conversations'
    });
  }
});

// POST /api/conversations - Create new conversation  
router.post('/conversations', async (req, res) => {
  try {
    const { getOrCreateDefaultUser } = await import('../controllers/nodes.js');
    const user = await getOrCreateDefaultUser();
    
    const conversation = await prisma.conversation.create({
      data: { 
        userId: user.id,
        title: req.body.title || 'New Conversation'
      }
    });
    
    res.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create conversation'
    });
  }
});

// Function to fetch and sort conversations
export async function getSortedConversations(userId) {
  const conversations = await prisma.conversation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }, // Sort by date descending
  });

  // Group conversations
  const today = [];
  const yesterday = [];
  const previous7Days = [];
  const previous30Days = [];

  const now = new Date();
  conversations.forEach(convo => {
    const diffTime = Math.abs(now - new Date(convo.createdAt));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) today.push(convo);
    else if (diffDays === 1) yesterday.push(convo);
    else if (diffDays <= 7) previous7Days.push(convo);
    else if (diffDays <= 30) previous30Days.push(convo);
  });

  return { today, yesterday, previous7Days, previous30Days };
}

export default router; 