<template>
  <nav 
    class="sidebar-nav"
    :class="{ 'sidebar-collapsed': !isExpanded }"
    aria-label="Sidebar"
  >
    <!-- Header with toggle and logo -->
    <div class="sidebar-header">
      <button 
        class="sidebar-toggle-btn"
        @click="toggleSidebar"
        :aria-expanded="isExpanded"
        aria-label="Toggle sidebar"
      >
        <div class="toggle-icon">
          <svg v-if="isExpanded" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M16.5 4C17.3284 4 18 4.67157 18 5.5V14.5C18 15.3284 17.3284 16 16.5 16H3.5C2.67157 16 2 15.3284 2 14.5V5.5C2 4.67157 2.67157 4 3.5 4H16.5ZM7 15H16.5C16.7761 15 17 14.7761 17 14.5V5.5C17 5.22386 16.7761 5 16.5 5H7V15ZM3.5 5C3.22386 5 3 5.22386 3 5.5V14.5C3 14.7761 3.22386 15 3.5 15H6V5H3.5Z"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3.5 3C3.77614 3 4 3.22386 4 3.5V16.5L3.99023 16.6006C3.94371 16.8286 3.74171 17 3.5 17C3.25829 17 3.05629 16.8286 3.00977 16.6006L3 16.5V3.5C3 3.22386 3.22386 3 3.5 3ZM11.2471 5.06836C11.4476 4.95058 11.7104 4.98547 11.8721 5.16504C12.0338 5.34471 12.0407 5.60979 11.9023 5.79688L11.835 5.87207L7.80371 9.5H16.5C16.7761 9.5 17 9.72386 17 10C17 10.2761 16.7761 10.5 16.5 10.5H7.80371L11.835 14.1279C12.0402 14.3127 12.0568 14.6297 11.8721 14.835C11.6873 15.0402 11.3703 15.0568 11.165 14.8721L6.16504 10.3721L6.09473 10.2939C6.03333 10.2093 6 10.1063 6 10C6 9.85828 6.05972 9.72275 6.16504 9.62793L11.165 5.12793L11.2471 5.06836Z"/>
          </svg>
        </div>
      </button>
      
      <div v-show="isExpanded" class="logo-container">
        <span class="logo-text">Tangent</span>
      </div>
    </div>

    <!-- Main content -->
    <div v-show="isExpanded" class="sidebar-content">
      <!-- New Chat Button -->
      <div class="new-chat-section">
        <button 
          class="new-chat-btn"
          @click="startNewConversation"
          aria-label="New chat"
        >
          <div class="new-chat-icon">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 3C10.4142 3 10.75 3.33579 10.75 3.75V9.25H16.25C16.6642 9.25 17 9.58579 17 10C17 10.3882 16.7051 10.7075 16.3271 10.7461L16.25 10.75H10.75V16.25C10.75 16.6642 10.4142 17 10 17C9.58579 17 9.25 16.6642 9.25 16.25V10.75H3.75C3.33579 10.75 3 10.4142 3 10C3 9.58579 3.33579 9.25 3.75 9.25H9.25V3.75C9.25 3.33579 9.58579 3 10 3Z"/>
            </svg>
          </div>
          <span class="new-chat-text">New chat</span>
        </button>
      </div>

      <!-- Conversations List -->
      <div class="conversations-section">
        <h3 class="conversations-header">Recents</h3>
        <ul class="conversations-list">
          <li 
            v-for="conversation in store.conversations" 
            :key="conversation.id"
            class="conversation-item"
          >
            <button 
              class="conversation-btn"
              :class="{ 'conversation-active': conversation.id === store.currentConversationId }"
              @click="selectConversation(conversation.id)"
            >
              <span class="conversation-title">
                {{ conversation.title || 'Untitled' }}
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useTangentStore } from '../stores/useTangentStore.js'

export default {
  name: 'Sidebar',
  data() {
    return {
      isExpanded: true
    }
  },
  computed: {
    store() {
      return useTangentStore()
    }
  },
  methods: {
    toggleSidebar() {
      this.isExpanded = !this.isExpanded
    },
    async startNewConversation() {
      await this.store.createNewConversation()
    },
    async selectConversation(conversationId) {
      this.store.currentConversationId = conversationId
      await this.store.loadMessages()
    }
  }
}
</script>

<style scoped>
.sidebar-nav {
  position: fixed;
  top: 0;
  left: 0 !important;
  height: 100vh;
  width: 18rem;
  background: #1a1a1a;
  border-right: 1px solid #333;
  box-shadow: inset -4px 0px 6px -4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 0;
  z-index: 1000;
  transition: all 0.2s ease;
  margin: 0 !important;
  margin-left: 0 !important;
}

.sidebar-nav.sidebar-collapsed {
  width: 3rem;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
}

.sidebar-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #888;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.sidebar-toggle-btn:hover {
  background: #333;
  color: #fff;
}

.sidebar-toggle-btn:active {
  transform: scale(0.95);
}

.logo-container {
  margin-left: 8px;
}

.logo-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.new-chat-section {
  padding: 0 8px;
  margin-bottom: 24px;
}

.new-chat-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 36px;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: #ff6b35;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.new-chat-btn:hover {
  background: rgba(255, 107, 53, 0.08);
}

.new-chat-btn:active {
  transform: scale(0.985);
}

.new-chat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #ff6b35;
  border-radius: 50%;
  color: white;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.new-chat-btn:hover .new-chat-icon {
  transform: scale(1.05) rotate(-2deg);
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
}

.new-chat-btn:active .new-chat-icon {
  transform: scale(0.98) rotate(3deg);
  background: #e55a2b;
}

.conversations-section {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
  margin-bottom: 8px;
}

.conversations-header {
  color: #888;
  font-size: 12px;
  font-weight: 400;
  margin: 0 0 8px 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.conversations-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.conversation-item {
  opacity: 1;
  height: auto;
}

.conversation-btn {
  display: flex;
  align-items: center;
  width: 100%;
  height: 32px;
  padding: 0 16px;
  border: none;
  background: transparent;
  color: #888;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 14px;
  overflow: hidden;
}

.conversation-btn:hover {
  background: #333;
  color: #fff;
}

.conversation-btn:active {
  transform: scale(0.99);
  background: #444;
}

.conversation-btn.conversation-active {
  background: #444;
  color: #fff;
}

.conversation-title {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
}

.conversation-title:empty::before {
  content: "Untitled";
  opacity: 0.6;
}

/* Scrollbar styling */
.conversations-section::-webkit-scrollbar {
  width: 4px;
}

.conversations-section::-webkit-scrollbar-track {
  background: transparent;
}

.conversations-section::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 2px;
}

.conversations-section::-webkit-scrollbar-thumb:hover {
  background: #444;
}
</style>