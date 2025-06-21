<template>
  <div
    class="fixed inset-0 flex items-center justify-center z-50" 
    :class="zIndex"
  >
    <!-- Overlay with background styling -->
    <transition-group
      enter-active-class="transition duration-150 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        class="absolute inset-0 bg-black opacity-70"
        :class="styleStore.overlayStyle"
        @click="overlayClick"
      />
    </transition-group>

    <!-- Modal content (slot for dynamic content) -->
    <transition-group
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="animate-fade-out"
    >
      <div class="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <slot /> <!-- Content of the modal goes here -->
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useStyleStore } from '@/stores/style.js'

defineProps({
  zIndex: {
    type: String,
    default: 'z-50'  // Default z-index value to ensure modal is above other elements
  }
})

const emit = defineEmits(['overlay-click'])

const overlayClick = event => {
  emit('overlay-click', event)
}

const styleStore = useStyleStore()
</script>

<style scoped>
/* Ensure modal content has proper styling */
.fixed {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;  /* Ensures modal appears above other content */
}

/* Optional: Styling for modal background */
.bg-black {
  background: rgba(0, 0, 0, 0.7); /* Semi-transparent black background */
}

/* Optional: Add styling to modal content */
.relative {
  position: relative;
  background-color: white;
  max-width: 500px;
  width: 100%;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
