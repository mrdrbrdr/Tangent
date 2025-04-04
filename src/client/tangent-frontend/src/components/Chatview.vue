<template>
  <div class="chat-view">
    <!-- Messages container -->
    <div class="messages-container">
      <!-- Display each message stored in local state -->
      <div v-for="(msg, idx) in messages" :key="idx" class="message-bubble">
        <p>User: {{ msg.userInput }}</p>
        <p>AI: {{ msg.aiResponse }}</p>
        <small>Short Summary: {{ msg.summaryShort }}</small>
        <small>Long Summary: {{ msg.summaryLong }}</small>
        
        <!-- Fork button -->
        <button @click="startFork(msg.nodeId)" class="fork-button">
          Fork This Response
        </button>
      </div>
    </div>
    
    <!-- Chat Input -->
    <div class="chat-input">
      <ChatInput @send-message="handleSendMessage" />
    </div>

    <!-- Fork form -->
    <div v-if="forkingFromId" class="fork-section">
      <p>Creating a tangent from previous response</p>
      <form @submit.prevent="createFork">
        <input
          v-model="forkPrompt"
          placeholder="Enter your tangent question"
          class="prompt-input"
        />
        <button type="submit">Send Tangent</button>
        <button type="button" @click="cancelFork" class="cancel-button">Cancel</button>
      </form>
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
      // Handle the message from ChatInput
      console.log('Message to send:', message);
      this.userPrompt = message;
      this.sendMessage();
    },
    async sendMessage() {
      try {
        if (!this.userPrompt) return;
        
        // 1) Send the prompt to the server
        const res = await axios.post('http://localhost:3000/api/chat', {
          message: this.userPrompt
        });

        // 2) The server returns an object with response, shortSummary, etc.
        const { response, shortSummary, longSummary, nodeId } = res.data;

        // 3) Store it in local state so we can display it
        const newMessage = {
          userInput: this.userPrompt,
          aiResponse: response,
          summaryShort: shortSummary,
          summaryLong: longSummary,
          nodeId: nodeId
        };
        this.messages.push(newMessage);

        // 4) Reset the user prompt
        this.userPrompt = '';
      } catch (err) {
        console.error('Error sending message:', err);
        console.error('Error details:', err.response?.data || err.message);
      }
    },
    
    // Start the forking process
    startFork(nodeId) {
      this.forkingFromId = nodeId;
      this.forkPrompt = '';
    },
    
    // Cancel forking
    cancelFork() {
      this.forkingFromId = null;
      this.forkPrompt = '';
    },
    
    // Create a new fork/tangent
    async createFork() {
      try {
        if (!this.forkPrompt) return;
        
        // 1) Send the fork request to the server
        const res = await axios.post('http://localhost:3000/api/fork', {
          parentNodeId: this.forkingFromId,
          userInput: this.forkPrompt
        });

        // 2) The server returns data similar to the chat endpoint
        const { response, shortSummary, longSummary, nodeId } = res.data;

        // 3) Store the new tangent in our messages
        const newTangent = {
          userInput: this.forkPrompt,
          aiResponse: response,
          summaryShort: shortSummary,
          summaryLong: longSummary,
          nodeId: nodeId,
          isTangent: true,
          parentId: this.forkingFromId
        };
        this.messages.push(newTangent);

        // 4) Reset the forking state
        this.forkingFromId = null;
        this.forkPrompt = '';
      } catch (err) {
        console.error('Error creating fork:', err);
        console.error('Error details:', err.response?.data || err.message);
      }
    }
  }
};
</script>

<style scoped>
.chat-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: calc(100vh - 40px); /* Reduce height to avoid overflow */
  position: relative;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.chat-input {
  position: sticky;
  bottom: 20px;
  padding: 16px 0;
  background: var(--background-color, #242424); /* Match app background */
}

.message-bubble {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}
.prompt-input {
  width: 80%;
  padding: 10px;
}
.fork-button {
  margin-top: 10px;
  background-color: #e0e0e0;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}
.fork-section {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
}
.cancel-button {
  margin-left: 5px;
  background-color: #ffeded;
}
</style>
