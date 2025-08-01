<template>
  <div id="app">
    <Sidebar />

    <main class="main-content">
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
    </main>
  </div>
</template>

<script>
import { useTangentStore } from './stores/useTangentStore.js'
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
  async mounted() {
    // Initialize the Pinia store when app starts
    const store = useTangentStore();
    await store.initializeApp();
  },
  computed: {
    showOverview() {
      // Get showOverview from Pinia store instead of local data
      const store = useTangentStore();
      return store.showOverview;
    },
    currentConversationId() {
      // Get currentConversationId from Pinia store
      const store = useTangentStore();
      return store.currentConversationId;
    }
  },
  methods: {
    toggleView() {
      // Use store's toggleOverview method instead of local logic
      const store = useTangentStore();
      store.toggleOverview();
    },
    jumpToNode(nodeId) {
      const store = useTangentStore();
      store.showOverview = false;
      // TODO: implement scrollToNode later
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  display: flex;
  height: 100vh;
  margin: 0;
  padding: 0;
}

.main-content {
  flex: 1;
  margin-left: 18rem;
  transition: margin-left 0.2s ease;
  overflow: hidden;
}

/* Handle collapsed sidebar */
.sidebar-nav.sidebar-collapsed + .main-content {
  margin-left: 3rem;
}
</style>
