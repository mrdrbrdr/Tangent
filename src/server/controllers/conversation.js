// src/server/controllers/conversation.js
import { callLLM, SYSTEM_PROMPTS } from './llm.js';

/**
 * Get a natural conversation response from the LLM
 * @param {string} userInput - The user's message
 * @param {Array} conversationContext - Array of previous messages in OpenAI format
 * @param {string} personality - Personality type (default, creative, technical, casual)
 * @returns {Promise<string>} - The AI's natural response
 */
export async function getConversationResponse(userInput, conversationContext = [], personality = 'default') {
  try {
    // Build messages array with system prompt, context, and new user input
    const messages = [
      { role: 'system', content: SYSTEM_PROMPTS[personality] },
      ...conversationContext,
      { role: 'user', content: userInput }
    ];

    // Call the main conversation model
    const response = await callLLM(messages, 'conversation');
    
    // Extract the response content
    const aiResponse = response.choices[0].message.content.trim();
    
    return aiResponse;
  } catch (error) {
    console.error('Error getting conversation response:', error);
    throw new Error('Failed to get conversation response');
  }
}

/**
 * Get available personality options
 * @returns {Array<string>} - List of available personalities
 */
export function getAvailablePersonalities() {
  return Object.keys(SYSTEM_PROMPTS);
}