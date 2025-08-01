<template>
  <div class="chat-view">
    <div class="messages-container">
      <!-- User messages are right-aligned, AI messages left-aligned -->
      <div v-for="(msg, idx) in messages" :key="idx" class="message-row">
        <!-- User message -->
        <div v-if="msg.userInput" class="user-message">
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
import { useTangentStore } from '../stores/useTangentStore.js'
import ChatInput from './ChatInput.vue';

export default {
  name: 'ChatView',
  components: {
    ChatInput
  },
  computed: {
    messages() {
      // Get messages from Pinia store instead of local data
      const store = useTangentStore();
      return store.messages;
    },
    forkingFromId() {
      // Get forking state from Pinia store
      const store = useTangentStore();
      return store.forkingFromId;
    },
    isLoading() {
      // Get loading state from Pinia store for potential spinner
      const store = useTangentStore();
      return store.isLoading;
    }
  },
  methods: {
    async handleSendMessage(message) {
      // Use store's sendMessage method instead of local logic
      const store = useTangentStore();
      await store.sendMessage(message);
    },
    startFork(nodeId) {
      // Use store's startFork method
      const store = useTangentStore();
      store.startFork(nodeId);
    }
    // Removed: sendMessage(), createFork(), saveMessages(), loadMessages()
    // All this logic is now in the Pinia store!
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
