import express from 'express';
import { getOrCreateDefaultUser } from '../controllers/nodes.js';

const router = express.Router();

// GET /api/user - Get current user (for MVP, the default user)
router.get('/user', async (req, res) => {
  try {
    const user = await getOrCreateDefaultUser();
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch user'
    });
  }
});

export default router;