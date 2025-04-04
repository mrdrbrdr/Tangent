<template>
  <button 
    @click="$emit('toggle')" 
    class="toggle-button"
  >
    {{ isOverview ? "Return to Chat" : "Show Overview" }}
  </button>
</template>

<script>
export default {
  name: 'ViewToggleButton',
  props: {
    isOverview: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped>
.toggle-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.toggle-button:hover {
  background-color: #45a049;
}
</style> 