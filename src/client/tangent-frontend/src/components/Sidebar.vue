<template>
  <div class="sidebar-container">
    <!-- Toggle button -->
    <button 
      class="sidebar-toggle"
      @click="toggleSidebar"
      :class="{ 'sidebar-expanded': isExpanded }"
    >
      {{ isExpanded ? '←' : '→' }}
    </button>

    <!-- Sidebar content -->
    <div 
      class="sidebar"
      :class="{ 'sidebar-expanded': isExpanded }"
    >
      <div class="sidebar-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      isExpanded: false
    }
  },
  methods: {
    toggleSidebar() {
      this.isExpanded = !this.isExpanded
    }
  }
}
</script>

<style scoped>
.sidebar-container {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 1000;
}

.sidebar {
  position: absolute;
  left: -250px; /* Start hidden */
  top: 0;
  width: 250px;
  height: 100%;
  background-color: #2c3e50;
  transition: transform 0.3s ease;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar.sidebar-expanded {
  transform: translateX(250px);
}

.sidebar-content {
  padding: 20px;
  color: white;
}

.sidebar-toggle {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: left 0.3s ease;
  z-index: 1001;
}

.sidebar-toggle.sidebar-expanded {
  left: 250px;
}

.sidebar-toggle:hover {
  background-color: #34495e;
}
</style> 