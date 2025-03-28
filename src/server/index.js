require('dotenv').config();
const express = require('express');

const { getLLMResponse } = require('./controllers/llm');

const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/api/chat', async (req, res) => {
  const userInput = req.body.message;
  try {
    const llmResponse = await getLLMResponse(userInput);
    res.json({ response: llmResponse });
  } catch (error) {
    res.status(500).json({ error: "Failed to get response from LLM" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});