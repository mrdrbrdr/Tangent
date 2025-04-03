// src/server/controllers/llm.js
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// We'll build a single function that returns all 3 items:
async function getLLMResponseWithSummaries(userInput) {
  try {
    // Build a prompt that requests the main answer, plus short & long summaries
    const systemInstructions = `
      You are an AI assistant. You will receive a user input.
      1) Provide a response ("mainAnswer").
      2) Then provide a short summary of your answer (40–80 chars) labeled "summaryShort".
      3) Then provide a longer summary (~350 chars) labeled "summaryLong".
      IMPORTANT: Format your response in JSON only, e.g.:
      {
        "mainAnswer": "...",
        "summaryShort": "...",
        "summaryLong": "..."
      }
      Do NOT include any additional keys or text besides that JSON.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemInstructions },
        { role: 'user', content: userInput }
      ],
      temperature: 0.7, // adjust as desired
    });

    const rawText = response.choices[0].message.content.trim();

    // Parse the JSON response
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      console.error('Failed to parse LLM JSON:', rawText);
      throw new Error('LLM did not return valid JSON');
    }

    // Validate that all required fields exist and are non-empty
    if (!parsed.mainAnswer || !parsed.summaryShort || !parsed.summaryLong) {
      console.error('Incomplete LLM response:', parsed);
      throw new Error('LLM response missing required fields');
    }

    // Return with our expected field names
    return {
      mainAnswer: parsed.mainAnswer,
      summaryShort: parsed.summaryShort,
      summaryLong: parsed.summaryLong
    };
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;  // This will be caught by the Express error handler
  }
}

module.exports = { getLLMResponseWithSummaries };