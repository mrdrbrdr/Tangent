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
        <div v-if="msg.aiResponse" :class="['ai-message', { 'highlighted': msg.nodeId === forkingFromId }]">
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
      forkingFromId: null
    };
  },
  mounted() {
    this.loadMessages();
  },
  methods: {
    handleSendMessage(message) {
      if (this.forkingFromId) {
        this.createFork(message);
      } else {
        this.userPrompt = message;
        this.sendMessage();
      }
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
        this.saveMessages(); // Save messages to local storage
      } catch (err) {
        console.error('Error sending message:', err);
      }
    },
    saveMessages() {
      localStorage.setItem('chatMessages', JSON.stringify(this.messages));
    },
    loadMessages() {
      const savedMessages = localStorage.getItem('chatMessages');
      if (savedMessages) {
        this.messages = JSON.parse(savedMessages);
      }
    },
    startFork(nodeId) {
      this.forkingFromId = nodeId;
    },
    
    async createFork(forkPrompt) {
      try {
        if (!forkPrompt) return;
        
        this.messages.push({
          userInput: forkPrompt,
          isTangent: true
        });
        
        const res = await axios.post('http://localhost:3000/api/fork', {
          parentNodeId: this.forkingFromId,
          userInput: forkPrompt
        });

        const { response, nodeId } = res.data;

        this.messages.push({
          aiResponse: response,
          nodeId: nodeId,
          isTangent: true,
          parentId: this.forkingFromId
        });

        this.forkingFromId = null;
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

.ai-message {
  display: flex;
  justify-content: flex-start;
}

.ai-message .message-content {
  background-color: #343541; /* Dark gray for AI in dark mode */
  color: white;
  max-width: 80%;
  border-bottom-left-radius: 2px;
}

.ai-message.highlighted .message-content {
  transform: scale(1.05); /* Expand by 5% */
  box-shadow: 0 0 10px rgba(123, 167, 217, 0.5); /* Back glow */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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
