<template>
  <div class="chat-input-container">
    <form @submit.prevent="sendMessage">
      <div class="chat-input-wrapper">
        <div class="chat-input-inner">
          <!-- Text input area -->
          <div class="input-area">
            <textarea 
              ref="messageInput"
              v-model="message"
              class="message-textarea" 
              placeholder="Ask anything"
              rows="1"
              @input="autoResize"
              @keydown.enter.prevent="sendMessage"
            ></textarea>
          </div>
          
          <!-- Send button - always visible -->
          <div class="send-button-wrapper">
            <button 
              type="submit" 
              class="send-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 11L12 6M12 6L17 11M12 6V18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="rotate(90 12 12)"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ChatInput',
  data() {
    return {
      message: ''
    }
  },
  methods: {
    sendMessage() {
      if (!this.message.trim()) return;
      
      this.$emit('send-message', this.message);
      this.message = '';
      
      // Reset textarea height
      this.$nextTick(() => {
        this.autoResize();
      });
    },
    autoResize() {
      const textarea = this.$refs.messageInput;
      textarea.style.height = 'auto';
      
      // Limit max height to ~5 lines
      const maxHeight = 150;
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
    }
  },
  mounted() {
    this.autoResize();
  }
}
</script>

<style scoped>
.chat-input-container {
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
  padding: 0 16px;
  box-sizing: border-box;
}

.chat-input-wrapper {
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #343541;
  transition: box-shadow 0.3s ease;
  overflow: hidden;
}


.chat-input-inner {
  display: flex;
  align-items: flex-end;
  padding: 12px 16px;
  position: relative;
}

.input-area {
  flex-grow: 1;
  position: relative;
}

.message-textarea {
  width: 100%;
  resize: none;
  border: none;
  background: transparent;
  padding: 8px 0;
  font-size: 16px;
  line-height: 1.5;
  max-height: 150px;
  outline: none;
  color: rgba(255, 255, 255, 0.87);
}

.message-textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.send-button-wrapper {
  margin-left: 8px;
  display: flex;
  align-items: center;
}

.send-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-button:hover {
  background-color: #45a049;
}

.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style> 