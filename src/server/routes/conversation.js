const express = require('express');
const router = express.Router();
const prisma = require('../db');

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

module.exports = router; 