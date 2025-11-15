<template>
  <v-overlay
    v-model="show"
    class="align-center justify-center"
    persistent
  >
    <v-progress-circular
      :size="70"
      :width="7"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div class="text-h6 mt-4 text-white">{{ message }}</div>
  </v-overlay>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'Loading...'
  }
})
</script>
