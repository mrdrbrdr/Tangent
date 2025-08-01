// src/server/controllers/summarization.js
import { callLLM } from './llm.js';

/**
 * Generate summaries for a conversation exchange
 * @param {string} userInput - The user's original message
 * @param {string} aiResponse - The AI's response
 * @returns {Promise<{summaryShort: string, summaryLong: string}>} - Generated summaries
 */
export async function generateSummaries(userInput, aiResponse) {
  try {
    // Simple, focused system prompt for summarization
    const summarySystemPrompt = `
      You are a summarization assistant. Generate two summaries of the conversation exchange below.
      
      Respond with ONLY valid JSON in this exact format:
      {"summaryShort":"40-80 character summary","summaryLong":"200-350 character detailed summary"}
      
      Focus on:
      - What the user asked or wanted
      - What the AI provided or explained
      - Key topics or concepts discussed
    `;

    // Build the conversation exchange for summarization
    const conversationExchange = `User: ${userInput}\n\nAI: ${aiResponse}`;

    const messages = [
      { role: 'system', content: summarySystemPrompt },
      { role: 'user', content: conversationExchange }
    ];

    // Use cheaper model for summarization
    const response = await callLLM(messages, 'summarization', {
      temperature: 0.3  // Lower temperature for more consistent summaries
    });

    const rawSummaryResponse = response.choices[0].message.content.trim();

    // Parse the JSON response with error handling
    let summaries;
    try {
      // Try to extract JSON from response
      const jsonMatch = rawSummaryResponse.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : rawSummaryResponse;
      
      summaries = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse summary JSON:', rawSummaryResponse);
      
      // Fallback summaries
      summaries = {
        summaryShort: "Conversation exchange",
        summaryLong: "User asked a question and AI provided a helpful response."
      };
    }

    // Validate and ensure required fields exist
    if (!summaries.summaryShort) {
      summaries.summaryShort = "AI conversation";
    }
    if (!summaries.summaryLong) {
      summaries.summaryLong = "User and AI had a conversation exchange.";
    }

    return {
      summaryShort: summaries.summaryShort,
      summaryLong: summaries.summaryLong
    };

  } catch (error) {
    console.error('Error generating summaries:', error);
    
    // Return fallback summaries on any error
    return {
      summaryShort: "Conversation exchange",  
      summaryLong: "User asked a question and AI provided a response."
    };
  }
}

/**
 * Generate summaries and update the database node
 * @param {number} nodeId - The database node ID to update
 * @param {string} userInput - The user's message
 * @param {string} aiResponse - The AI's response
 */
export async function updateNodeWithSummaries(nodeId, userInput, aiResponse) {
  try {
    console.log(`Generating summaries for node ${nodeId} in background...`);
    
    // Generate summaries using cheap model
    const { summaryShort, summaryLong } = await generateSummaries(userInput, aiResponse);
    
    // Import prisma for database update
    const { default: prisma } = await import('../db.js');
    
    // Update the existing node with summaries
    await prisma.node.update({
      where: { id: nodeId },
      data: {
        summaryShort,
        summaryLong
      }
    });
    
    console.log(`Summaries completed for node ${nodeId}`);
  } catch (error) {
    console.error(`Failed to generate summaries for node ${nodeId}:`, error);
    // Don't throw - this is background operation
  }
}