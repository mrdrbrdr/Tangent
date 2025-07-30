import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

export const useTangentStore = defineStore('tangent', {
  state: () => ({
    // User state
    user: null,

    // Conversation state
    conversations: [],
    currentConversationId: 1, // Default for MVP

    // Node/Message state (matches your current ChatView structure)
    messages: [],

    // UI state
    showOverview: false,
    isLoading: false,
    forkingFromId: null
  }),

  getters: {
    currentConversation: (state) =>
      state.conversations.find(c => c.id === state.currentConversationId),

    // Convert nodes to message format for compatibility
    formattedMessages: (state) => state.messages
  },

  actions: {
    // Initialize app - load user and default conversation
    async initializeApp() {
      this.isLoading = true;
      try {
        await this.loadUser();
        await this.loadConversations();
        await this.loadMessages();
      } finally {
        this.isLoading = false;
      }
    },

    async loadUser() {
      const res = await axios.get(`${API_BASE}/user`);
      this.user = res.data;
    },

    async loadConversations() {
      const res = await axios.get(`${API_BASE}/conversations`);
      this.conversations = res.data;
    },

    // Load messages for current conversation
    async loadMessages() {
      try {
        const res = await
axios.get(`${API_BASE}/conversation/${this.currentConversationId}/nodes`);
        // Convert nodes to message format
        this.messages = this.convertNodesToMessages(res.data.nodes);
      } catch (error) {
        console.error('Failed to load messages from database, checking localStorage');
        this.loadFromLocalStorage();
      }
    },

    // Send message using existing /api/chat endpoint
    async sendMessage(userInput) {
      if (this.forkingFromId) {
        return this.createFork(userInput);
      }

      this.isLoading = true;
      try {
        // Add user message optimistically
        this.messages.push({ userInput });

        const res = await axios.post(`${API_BASE}/chat`, {
          message: userInput
        });

        const { response, shortSummary, longSummary, nodeId } = res.data;

        // Add AI response
        this.messages.push({
          aiResponse: response,
          summaryShort: shortSummary,
          summaryLong: longSummary,
          nodeId: nodeId
        });

        // Backup to localStorage for offline resilience
        this.saveToLocalStorage();

      } catch (error) {
        console.error('Send message failed:', error);
        // Remove optimistic user message on failure
        this.messages.pop();
      } finally {
        this.isLoading = false;
      }
    },

    // Fork using existing /api/fork endpoint
    async createFork(userInput) {
      this.isLoading = true;
      try {
        this.messages.push({
          userInput,
          isTangent: true
        });

        const res = await axios.post(`${API_BASE}/fork`, {
          parentNodeId: this.forkingFromId,
          userInput
        });

        const { response, nodeId } = res.data;

        this.messages.push({
          aiResponse: response,
          nodeId,
          isTangent: true,
          parentId: this.forkingFromId
        });

        this.forkingFromId = null;
        this.saveToLocalStorage();

      } catch (error) {
        console.error('Fork creation failed:', error);
        this.messages.pop();
      } finally {
        this.isLoading = false;
      }
    },

    // UI actions
    toggleOverview() {
      this.showOverview = !this.showOverview;
    },

    startFork(nodeId) {
      this.forkingFromId = nodeId;
    },

    // Migration helpers
    convertNodesToMessages(nodes) {
      return nodes.map(node => ({
        userInput: node.userInput,
        aiResponse: node.aiResponse,
        summaryShort: node.summaryShort,
        summaryLong: node.summaryLong,
        nodeId: node.id,
        isTangent: node.branchType === 'TANGENT',
        parentId: node.parentNodeId
      }));
    },

    // localStorage compatibility (during transition)
    saveToLocalStorage() {
      localStorage.setItem('chatMessages', JSON.stringify(this.messages));
    },

    loadFromLocalStorage() {
      const saved = localStorage.getItem('chatMessages');
      if (saved) {
        this.messages = JSON.parse(saved);
      }
    },

    clearLocalStorage() {
      localStorage.removeItem('chatMessages');
    }
  }
});