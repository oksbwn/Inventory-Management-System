<template>
  <v-dialog v-model="dialog" max-width="800px" persistent scrollable>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon color="primary" class="mr-2">
          {{ isEdit ? 'mdi-pencil' : 'mdi-plus' }}
        </v-icon>
        {{ isEdit ? 'Edit Project' : 'Add New Project' }}
      </v-card-title>

      <v-divider />

      <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
        <v-card-text class="pa-6">
          <v-row>
            <!-- Project Name -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.project_name"
                label="Project Name"
                prepend-icon="mdi-briefcase"
                variant="outlined"
                :rules="nameRules"
                required
                counter="255"
                placeholder="Enter project name..."
              />
            </v-col>

            <!-- Description with Character Counter and Preview -->
            <v-col cols="12">
              <v-textarea
                v-model="formData.description"
                label="Description"
                prepend-icon="mdi-text"
                variant="outlined"
                rows="6"
                placeholder="Describe your project in detail..."
                counter
                auto-grow
                :rules="descriptionRules"
              />
              
              <!-- Description Preview -->
              <v-card 
                v-if="formData.description && formData.description.length > 100" 
                variant="outlined" 
                class="mt-2"
              >
                <v-card-subtitle class="text-caption">
                  <v-icon size="16" class="mr-1">mdi-eye</v-icon>
                  Grid View Preview (first 100 characters)
                </v-card-subtitle>
                <v-card-text class="pt-0 pb-2">
                  <div class="text-body-2 text-medium-emphasis">
                    {{ truncateText(formData.description, 100) }}
                  </div>
                </v-card-text>
              </v-card>
              
              <!-- Description Statistics -->
              <div v-if="formData.description" class="mt-2 d-flex justify-space-between align-center text-caption text-medium-emphasis">
                <div>
                  Characters: {{ formData.description.length }} 
                  | Words: {{ getWordCount(formData.description) }}
                  | Lines: {{ getLineCount(formData.description) }}
                </div>
                <div v-if="formData.description.length > 1000" class="text-warning">
                  Long description - consider summarizing key points
                </div>
              </div>
            </v-col>

            <!-- Status and Project Type -->
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.status"
                :items="statusOptions"
                label="Status"
                prepend-icon="mdi-format-list-bulleted"
                variant="outlined"
                clearable
              >
                <template #item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-icon :color="getStatusColor(item.value)">
                        {{ getStatusIcon(item.value) }}
                      </v-icon>
                    </template>
                  </v-list-item>
                </template>
                <template #selection="{ item }">
                  <v-chip :color="getStatusColor(item.value)" size="small" variant="elevated">
                    {{ item.value }}
                  </v-chip>
                </template>
              </v-select>
            </v-col>

            <v-col cols="12" md="6">
              <v-switch
                v-model="formData.is_yt_project"
                label="YouTube Project"
                color="red"
                prepend-icon="mdi-youtube"
                inset
              />
            </v-col>

            <!-- Date Range -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.start_date"
                label="Start Date"
                type="date"
                prepend-icon="mdi-calendar-start"
                variant="outlined"
                :rules="startDateRules"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.end_date"
                label="End Date"
                type="date"
                prepend-icon="mdi-calendar-end"
                variant="outlined"
                :rules="endDateRules"
              />
            </v-col>

            <!-- Git Repository -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.git_repository"
                label="Git Repository URL"
                prepend-icon="mdi-git"
                variant="outlined"
                :rules="gitRepoRules"
                placeholder="https://github.com/username/repository"
              >
                <template #append-inner>
                  <v-btn
                    v-if="formData.git_repository"
                    icon
                    size="small"
                    :href="formData.git_repository"
                    target="_blank"
                  >
                    <v-icon size="16">mdi-open-in-new</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <!-- Enhanced Project Preview Card -->
          <v-card v-if="formData.project_name" variant="outlined" class="mt-4">
            <v-card-title class="text-subtitle-1">
              <v-icon class="mr-2">mdi-eye</v-icon>
              Project Preview
            </v-card-title>
            <v-card-text>
              <!-- Grid View Preview -->
              <div class="mb-4">
                <div class="text-subtitle-2 mb-2">Grid View:</div>
                <v-card variant="outlined" class="preview-card">
                  <v-card-text class="pa-3">
                    <div class="d-flex align-center mb-2">
                      <v-avatar :color="formData.is_yt_project ? 'red' : 'indigo'" size="32" class="mr-3">
                        <v-icon size="18" color="white">
                          {{ formData.is_yt_project ? 'mdi-youtube' : 'mdi-briefcase' }}
                        </v-icon>
                      </v-avatar>
                      <div class="flex-1-1">
                        <div class="font-weight-bold text-truncate">{{ formData.project_name }}</div>
                        <v-chip 
                          v-if="formData.status"
                          :color="getStatusColor(formData.status)" 
                          size="small" 
                          variant="elevated"
                          class="mt-1"
                        >
                          {{ formData.status }}
                        </v-chip>
                      </div>
                    </div>
                    <div v-if="formData.description" class="text-body-2 text-medium-emphasis mb-2">
                      {{ truncateText(formData.description, 100) }}
                      <span v-if="formData.description.length > 100" class="text-primary">...more</span>
                    </div>
                    <div class="d-flex gap-4 text-caption">
                      <div v-if="formData.start_date">
                        <v-icon size="12" class="mr-1">mdi-calendar-start</v-icon>
                        Start: {{ formatDate(formData.start_date) }}
                      </div>
                      <div v-if="formData.end_date">
                        <v-icon size="12" class="mr-1">mdi-calendar-end</v-icon>
                        End: {{ formatDate(formData.end_date) }}
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>

              <!-- List View Preview -->
              <div class="mb-4">
                <div class="text-subtitle-2 mb-2">List View:</div>
                <v-card variant="outlined" class="preview-card">
                  <v-card-text class="pa-3">
                    <div class="d-flex align-center">
                      <v-avatar :color="formData.is_yt_project ? 'red' : 'indigo'" size="32" class="mr-3">
                        <v-icon size="18" color="white">
                          {{ formData.is_yt_project ? 'mdi-youtube' : 'mdi-briefcase' }}
                        </v-icon>
                      </v-avatar>
                      <div style="max-width: 250px;">
                        <div class="font-weight-bold">{{ formData.project_name }}</div>
                        <div v-if="formData.description" class="text-caption text-medium-emphasis text-truncate">
                          {{ truncateText(formData.description, 80) }}
                          <span v-if="formData.description.length > 80" class="text-primary">...more</span>
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>

              <!-- Kanban View Preview -->
              <div>
                <div class="text-subtitle-2 mb-2">Kanban View:</div>
                <v-card variant="outlined" class="preview-card">
                  <v-card-text class="pa-3">
                    <div class="d-flex align-center mb-2">
                      <v-avatar :color="formData.is_yt_project ? 'red' : 'indigo'" size="24" class="mr-2">
                        <v-icon size="14" color="white">
                          {{ formData.is_yt_project ? 'mdi-youtube' : 'mdi-briefcase' }}
                        </v-icon>
                      </v-avatar>
                      <div class="flex-1-1">
                        <div class="text-subtitle-2 font-weight-bold text-truncate">
                          {{ formData.project_name }}
                        </div>
                      </div>
                    </div>
                    <div v-if="formData.description" class="text-caption text-medium-emphasis mb-2">
                      {{ truncateText(formData.description, 60) }}
                      <span v-if="formData.description.length > 60" class="text-primary">...more</span>
                    </div>
                    <div class="text-caption">
                      {{ formatDate(formData.start_date) }}
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </v-card-text>
          </v-card>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn 
            color="primary" 
            type="submit"
            :loading="loading"
            :disabled="!valid"
          >
            {{ isEdit ? 'Update Project' : 'Create Project' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useProjectStore } from '@/stores/projectStore'

const props = defineProps({
  modelValue: Boolean,
  projectItem: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success', 'error'])

const projectStore = useProjectStore()
const form = ref(null)
const valid = ref(false)
const loading = ref(false)

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isEdit = computed(() => props.projectItem && props.projectItem.project_id)

// Form data
const formData = ref({
  project_name: '',
  description: '',
  status: null,
  start_date: '',
  end_date: '',
  is_yt_project: false,
  git_repository: ''
})

// Status options
const statusOptions = [
  'Planning',
  'In Progress', 
  'Testing',
  'Completed',
  'On Hold',
  'Cancelled'
]

// Validation rules
const nameRules = [
  v => !!v || 'Project name is required',
  v => (v && v.length <= 255) || 'Project name must be 255 characters or less',
  v => (v && v.length >= 2) || 'Project name must be at least 2 characters'
]

const descriptionRules = [
  v => !v || v.length <= 10000 || 'Description must be 10,000 characters or less'
]

const startDateRules = [
  v => !v || !formData.value.end_date || new Date(v) <= new Date(formData.value.end_date) || 'Start date must be before end date'
]

const endDateRules = [
  v => !v || !formData.value.start_date || new Date(v) >= new Date(formData.value.start_date) || 'End date must be after start date'
]

const gitRepoRules = [
  v => !v || isValidUrl(v) || 'Please enter a valid URL',
  v => !v || isGitUrl(v) || 'Please enter a valid Git repository URL'
]

// Helper functions
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

const formatDate = (dateString) => {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString()
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const getWordCount = (text) => {
  if (!text) return 0
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

const getLineCount = (text) => {
  if (!text) return 0
  return text.split('\n').length
}

const isValidUrl = (string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

const isGitUrl = (url) => {
  if (!url) return true
  const gitPatterns = [
    /^https:\/\/github\.com\//,
    /^https:\/\/gitlab\.com\//,
    /^https:\/\/bitbucket\.org\//,
    /^git@/,
    /\.git$/
  ]
  return gitPatterns.some(pattern => pattern.test(url))
}

// Event handlers
const closeDialog = () => {
  resetForm()
  dialog.value = false
}

const resetForm = () => {
  formData.value = {
    project_name: '',
    description: '',
    status: null,
    start_date: '',
    end_date: '',
    is_yt_project: false,
    git_repository: ''
  }
  if (form.value) {
    form.value.resetValidation()
  }
}

const populateForm = () => {
  if (props.projectItem) {
    formData.value = {
      project_name: props.projectItem.project_name || '',
      description: props.projectItem.description || '',
      status: props.projectItem.status || null,
      start_date: props.projectItem.start_date || '',
      end_date: props.projectItem.end_date || '',
      is_yt_project: props.projectItem.is_yt_project || false,
      git_repository: props.projectItem.git_repository || ''
    }
  } else {
    resetForm()
  }
}

const handleSubmit = async () => {
  if (!valid.value) return

  loading.value = true
  try {
    const projectData = { ...formData.value }
    
    // Clean up empty strings
    Object.keys(projectData).forEach(key => {
      if (projectData[key] === '') {
        projectData[key] = null
      }
    })

    let result
    if (isEdit.value) {
      result = await projectStore.updateProject(props.projectItem.project_id, projectData)
      emit('success', { 
        message: 'Project updated successfully',
        project: result 
      })
    } else {
      result = await projectStore.createProject(projectData)
      emit('success', { 
        message: 'Project created successfully',
        project: result 
      })
    }
  } catch (error) {
    console.error('Error saving project:', error)
    emit('error', { 
      message: error.message || 'Failed to save project' 
    })
  } finally {
    loading.value = false
  }
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    nextTick(() => {
      populateForm()
    })
  }
})

watch(() => props.projectItem, () => {
  if (props.modelValue) {
    populateForm()
  }
})
</script>

<style scoped>
.preview-card {
  background-color: #fafafa;
  border: 1px dashed #ccc;
}

.v-card-text {
  max-height: 70vh;
  overflow-y: auto;
}

/* Custom scrollbar */
.v-card-text::-webkit-scrollbar {
  width: 6px;
}

.v-card-text::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.v-card-text::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.v-card-text::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>