<template>
  <div class="chat-container">
    <div class="messages">
      <!-- Display each message stored in local state -->
      <div 
        v-for="(msg, idx) in messages" 
        :key="msg.nodeId || idx" 
        class="message-bubble"
      >
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

    <!-- Replace form with div for regular chat -->
    <div class="chat-input-container">
      <input
        v-model="userPrompt"
        placeholder="Type your message"
        class="prompt-input"
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">Send</button>
    </div>

    <!-- Replace form with div for fork -->
    <div v-if="forkingFromId" class="fork-section">
      <p>Creating a tangent from previous response</p>
      <div class="chat-input-container">
        <input
          v-model="forkPrompt"
          placeholder="Enter your tangent question"
          class="prompt-input"
          @keyup.enter="createFork"
        />
        <button @click="createFork">Send Tangent</button>
        <button @click="cancelFork" class="cancel-button">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ChatView',
  data() {
    return {
      userPrompt: '',
      messages: [],
      forkingFromId: null,
      forkPrompt: ''
    };
  },
  methods: {
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
          nodeId: nodeId || Date.now()
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
          nodeId: nodeId || Date.now(),
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
.chat-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
.messages {
  margin-bottom: 20px;
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
