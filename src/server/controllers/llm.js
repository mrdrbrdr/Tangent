// src/server/controllers/llm.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Model definitions - centralized model management
export const MODELS = {
  conversation: 'gpt-4o-mini',
  summarization: 'gpt-3.5-turbo',
  // Future: 'claude-3-haiku', 'llama-2', etc.
};

// System prompts - centralized personality management
export const SYSTEM_PROMPTS = {
  default: "You are a helpful AI assistant. Respond naturally and conversationally. You can use markdown formatting if helpful.",
  creative: "You are a creative writing assistant. Help users with storytelling, poetry, and creative projects. Be imaginative and inspiring.",
  technical: "You are a technical expert. Provide precise, detailed explanations with code examples when relevant. Be thorough and accurate.",
  casual: "You are a friendly, casual AI assistant. Keep responses conversational and approachable, like talking to a good friend.",
  // Future: user-customizable prompts loaded from database
};

// Centralized OpenAI API caller
export async function callLLM(messages, modelType = 'conversation', options = {}) {
  try {
    const defaultOptions = {
      model: MODELS[modelType],
      messages: messages,
      temperature: 0.7,
    };

    const response = await openai.chat.completions.create({
      ...defaultOptions,
      ...options  // Allow overriding defaults
    });

    return response;
  } catch (error) {
    console.error(`Error calling ${modelType} LLM:`, error);
    throw error;
  }
}

// Helper to get available models
export function getAvailableModels() {
  return Object.keys(MODELS);
}

// Helper to get available personalities
export function getAvailablePersonalities() {
  return Object.keys(SYSTEM_PROMPTS);
}