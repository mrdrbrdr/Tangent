<template>
  <div class="chat-container">
    <div class="messages">
      <!-- Display each message stored in local state -->
      <div v-for="(msg, idx) in messages" :key="idx" class="message-bubble">
        <p>User: {{ msg.userInput }}</p>
        <p>AI: {{ msg.aiResponse }}</p>
        <small>Short Summary: {{ msg.summaryShort }}</small>
        <small>Long Summary: {{ msg.summaryLong }}</small>
      </div>
    </div>

    <form @submit.prevent="sendMessage">
      <input
        v-model="userPrompt"
        placeholder="Type your message"
        class="prompt-input"
      />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ChatView',
  data() {
    return {
      userPrompt: '',
      messages: []
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

        // 2) The server returns an object with mainAnswer, shortSummary, etc.
        const { response, shortSummary, longSummary } = res.data;

        // 3) Store it in local state so we can display it
        const newMessage = {
          userInput: this.userPrompt,
          aiResponse: response,
          summaryShort: shortSummary,
          summaryLong: longSummary
        };
        this.messages.push(newMessage);

        // 4) Reset the user prompt
        this.userPrompt = '';
      } catch (err) {
        console.error('Error sending message:', err);
        // Add this to see the actual error in the console
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
</style>
