<template>
  <div class="chat-view">
    <div class="messages-container">
      <!-- User messages are right-aligned, AI messages left-aligned -->
      <div v-for="(msg, idx) in messages" :key="idx" class="message-row">
        <!-- User message -->
        <div v-if="msg.userInput && !msg.aiResponse" class="user-message">
          <div class="message-content">{{ msg.userInput }}</div>
        </div>
        
        <!-- AI message -->
        <div v-if="msg.aiResponse" class="ai-message">
          <div class="message-content">
            <div>{{ msg.aiResponse }}</div>
            
            <div class="message-actions">
              <a @click="startFork(msg.nodeId)" class="fork-link">
                Make a tangent →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Fork form dialog -->
    <div v-if="forkingFromId" class="fork-dialog">
      <div class="fork-dialog-content">
        <h3>Create a tangent</h3>
        <form @submit.prevent="createFork">
          <input
            v-model="forkPrompt"
            placeholder="Ask a follow-up question..."
            class="fork-input"
          />
          <div class="fork-actions">
            <button type="button" @click="cancelFork" class="cancel-button">Cancel</button>
            <button type="submit" class="submit-button">Create Tangent</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Chat Input -->
    <div class="chat-input">
      <ChatInput @send-message="handleSendMessage" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ChatInput from './ChatInput.vue';

export default {
  name: 'ChatView',
  components: {
    ChatInput
  },
  data() {
    return {
      userPrompt: '',
      messages: [],
      forkingFromId: null,
      forkPrompt: ''
    };
  },
  methods: {
    handleSendMessage(message) {
      this.userPrompt = message;
      this.sendMessage();
    },
    async sendMessage() {
      try {
        if (!this.userPrompt) return;
        
        // Add user message immediately
        this.messages.push({
          userInput: this.userPrompt
        });
        
        // Send to server
        const res = await axios.post('http://localhost:3000/api/chat', {
          message: this.userPrompt
        });

        // We still need to receive the summaries and nodeId from the server
        // Even though we don't display the summaries in the chat view
        const { response, shortSummary, longSummary, nodeId } = res.data;

        // Add AI response
        this.messages.push({
          aiResponse: response,
          summaryShort: shortSummary, // Store but don't display
          summaryLong: longSummary,   // Store but don't display
          nodeId: nodeId
        });

        this.userPrompt = '';
      } catch (err) {
        console.error('Error sending message:', err);
      }
    },
    
    startFork(nodeId) {
      this.forkingFromId = nodeId;
    },
    
    cancelFork() {
      this.forkingFromId = null;
      this.forkPrompt = '';
    },
    
    async createFork() {
      try {
        if (!this.forkPrompt) return;
        
        // Add user message
        this.messages.push({
          userInput: this.forkPrompt,
          isTangent: true
        });
        
        // Send request
        const res = await axios.post('http://localhost:3000/api/fork', {
          parentNodeId: this.forkingFromId,
          userInput: this.forkPrompt
        });

        const { response, shortSummary, longSummary, nodeId } = res.data;

        // Add AI response
        this.messages.push({
          aiResponse: response,
          summaryShort: shortSummary, // Store but don't display
          summaryLong: longSummary,   // Store but don't display
          nodeId: nodeId,
          isTangent: true,
          parentId: this.forkingFromId
        });

        this.forkingFromId = null;
        this.forkPrompt = '';
      } catch (err) {
        console.error('Error creating fork:', err);
      }
    }
  }
};
</script>

<style scoped>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #242424; /* Dark background */
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.message-row {
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
  margin-bottom: 20px;
}

.message-content {
  padding: 12px 16px;
  border-radius: 8px;
  line-height: 1.5;
  position: relative;
}

.user-message {
  display: flex;
  justify-content: flex-end;
}

.user-message .message-content {
  background-color: #3b4d63; /* Darker blue for user in dark mode */
  color: white;
  max-width: 80%;
  border-bottom-right-radius: 2px;
}

.ai-message .message-content {
  background-color: #343541; /* Dark gray for AI in dark mode */
  color: white;
  max-width: 80%;
  border-bottom-left-radius: 2px;
}

.message-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.fork-link {
  color: #7ba7d9; /* Subtle blue color */
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: normal;
  text-decoration: none;
  transition: color 0.15s ease;
}

.fork-link:hover {
  color: #a0c0e8; /* Lighter blue on hover */
  text-decoration: underline;
}

.fork-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.fork-dialog-content {
  background-color: #343541;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  color: white;
}

.fork-input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #555;
  border-radius: 4px;
  background-color: #444654;
  color: white;
}

.fork-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.cancel-button {
  background-color: #444654;
  border: 1px solid #555;
  color: white;
}

.submit-button {
  background-color: #2196F3;
  color: white;
  border: none;
}

.cancel-button, .submit-button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.chat-input {
  padding: 10px 0;
  border-top: 1px solid #444;
  background-color: #242424; /* Dark background */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .user-message .message-content, 
  .ai-message .message-content {
    max-width: 90%;
  }
}
</style>
