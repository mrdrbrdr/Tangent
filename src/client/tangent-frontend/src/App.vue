<template>
  <div id="app">
    <Sidebar>
      <!-- Sidebar content goes here -->
      <h3>Navigation</h3>
      <p>Sidebar content will go here</p>
    </Sidebar>

    <ViewToggleButton 
      :isOverview="showOverview"
      @toggle="toggleView"
    />
    
    <Overview 
      v-if="showOverview" 
      :conversationId="currentConversationId" 
      @nodeClick="jumpToNode"
    />
    <ChatView 
      v-else 
      ref="chatView"
    />
  </div>
</template>

<script>
import ChatView from './components/ChatView.vue'
import Overview from './components/Overview.vue'
import ViewToggleButton from './components/ViewToggleButton.vue'
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'App',
  components: {
    ChatView,
    Overview,
    ViewToggleButton,
    Sidebar
  },
  data() {
    return {
      showOverview: false,
      currentConversationId: 1
    }
  },
  methods: {
    toggleView() {
      this.showOverview = !this.showOverview
    },
    jumpToNode(nodeId) {
      this.showOverview = false
      // this.$refs.chatView.scrollToNode(nodeId)
    }
  }
}
</script>
