<template>
  <v-dialog v-model="dialog" max-width="400px" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon color="primary" class="mr-2">mdi-swap-vertical</v-icon>
        Change Status
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <p class="text-body-2 mb-4">
          Change status for {{ selectedCount }} selected project{{ selectedCount > 1 ? 's' : '' }}:
        </p>

        <v-select
          v-model="selectedStatus"
          :items="statusOptions"
          label="New Status"
          variant="outlined"
          prepend-icon="mdi-format-list-bulleted"
          :rules="[v => !!v || 'Status is required']"
        />

        <v-alert
          v-if="selectedStatus"
          :color="getStatusColor(selectedStatus)"
          variant="tonal"
          class="mt-3"
        >
          <template #prepend>
            <v-icon>{{ getStatusIcon(selectedStatus) }}</v-icon>
          </template>
          Projects will be marked as <strong>{{ selectedStatus }}</strong>
        </v-alert>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="outlined" @click="closeDialog">
          Cancel
        </v-btn>
        <v-btn 
          color="primary" 
          :disabled="!selectedStatus"
          @click="confirmChange"
        >
          Update Status
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  selectedCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectedStatus = ref('')

const statusOptions = [
  'Planning',
  'In Progress', 
  'Testing',
  'Completed',
  'On Hold',
  'Cancelled'
]

const getStatusColor = (status) => {
  const colors = {
    'Planning': 'blue',
    'In Progress': 'orange',
    'Testing': 'purple', 
    'Completed': 'green',
    'On Hold': 'grey',
    'Cancelled': 'red'
  }
  return colors[status] || 'grey'
}

const getStatusIcon = (status) => {
  const icons = {
    'Planning': 'mdi-clipboard-text',
    'In Progress': 'mdi-play-circle',
    'Testing': 'mdi-test-tube',
    'Completed': 'mdi-check-circle',
    'On Hold': 'mdi-pause-circle',
    'Cancelled': 'mdi-close-circle'
  }
  return icons[status] || 'mdi-help-circle'
}

const closeDialog = () => {
  selectedStatus.value = ''
  dialog.value = false
}

const confirmChange = () => {
  if (selectedStatus.value) {
    emit('confirm', selectedStatus.value)
    closeDialog()
  }
}
</script>