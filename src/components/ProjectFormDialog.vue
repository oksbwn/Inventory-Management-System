<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <!-- Header -->
      <v-card-title class="text-h5 pa-5">
        <div class="d-flex align-center">
          <v-avatar size="40" :color="isEdit ? 'primary' : 'success'" class="mr-3">
            <v-icon color="white">{{ isEdit ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
          </v-avatar>
          <div>
            <div class="text-h6 font-weight-bold">{{ isEdit ? 'Edit Project' : 'New Project' }}</div>
            <div class="text-caption text-medium-emphasis">{{ isEdit ? 'Update project details' : 'Create a new project' }}</div>
          </div>
        </div>
      </v-card-title>
      <v-divider />

      <!-- Form -->
      <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
        <v-card-text class="pa-6">
          <v-row>
            <!-- Project Name -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.project_name"
                label="Project Name"
                prepend-inner-icon="mdi-briefcase"
                variant="outlined"
                :rules="nameRules"
                required
                counter="255"
                placeholder="Enter project name..."
                autofocus
              />
            </v-col>

            <!-- YouTube Toggle -->
            <v-col cols="12">
              <div class="d-flex align-center" style="height: 56px; border: 1px solid rgba(0,0,0,0.23); border-radius: 4px; padding: 0 16px;">
                <v-icon color="red" class="mr-2">mdi-youtube</v-icon>
                <v-switch
                  v-model="formData.is_yt_project"
                  label="YouTube Project"
                  color="red"
                  density="compact"
                  hide-details
                  inset
                />
              </div>
            </v-col>

            <!-- Start & End Date -->
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.start_date"
                label="Start Date"
                type="date"
                prepend-inner-icon="mdi-calendar-start"
                variant="outlined"
                :rules="startDateRules"
                clearable
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.end_date"
                label="End Date"
                type="date"
                prepend-inner-icon="mdi-calendar-end"
                variant="outlined"
                :rules="endDateRules"
                clearable
              />
            </v-col>

            <!-- Git Repository URL -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.git_repository"
                label="Git Repository URL"
                prepend-inner-icon="mdi-git"
                variant="outlined"
                :rules="gitRepoRules"
                placeholder="https://github.com/username/repository"
                clearable
              >
                <template #append-inner>
                  <v-btn
                    v-if="formData.git_repository && isValidUrl(formData.git_repository)"
                    icon
                    size="small"
                    variant="text"
                    :href="formData.git_repository"
                    target="_blank"
                    @click.stop
                  >
                    <v-icon size="20">mdi-open-in-new</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <!-- Actions -->
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn 
            variant="outlined" 
            @click="closeDialog"
            :disabled="loading"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            :loading="loading"
            :disabled="!valid"
            prepend-icon="mdi-content-save"
          >
            {{ isEdit ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useProjectStore } from '@/stores/projectStore'

// Props & Emits
const props = defineProps({
  modelValue: Boolean,
  projectItem: { type: Object, default: null }
})
const emit = defineEmits(['update:modelValue', 'success', 'error'])

// Store
const projectStore = useProjectStore()

// State
const form = ref(null)
const valid = ref(false)
const loading = ref(false)

const dialog = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const isEdit = computed(() => !!props.projectItem?.project_id)

// Form Data
const formData = ref({
  project_name: '',
  description: '',
  status: 'Created',
  start_date: '',
  end_date: '',
  is_yt_project: false,
  git_repository: ''
})

// Validation Rules
const nameRules = [
  v => !!v || 'Project name is required',
  v => (v && v.length >= 2) || 'Minimum 2 characters',
  v => (v && v.length <= 255) || 'Maximum 255 characters'
]

const startDateRules = [
  v => {
    if (!v || !formData.value.end_date) return true
    return new Date(v) <= new Date(formData.value.end_date) || 'Start date must be before end date'
  }
]

const endDateRules = [
  v => {
    if (!v || !formData.value.start_date) return true
    return new Date(v) >= new Date(formData.value.start_date) || 'End date must be after start date'
  }
]

const gitRepoRules = [
  v => {
    if (!v) return true
    return isValidUrl(v) || 'Invalid URL format'
  },
  v => {
    if (!v) return true
    return isGitUrl(v) || 'Must be a valid Git repository URL'
  }
]

// Helper Functions
function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

function isGitUrl(url) {
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

function toDateString(value) {
  if (!value) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  
  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Form Management
function resetForm() {
  formData.value = {
    project_name: '',
    description: '',
    status: 'Created',
    start_date: '',
    end_date: '',
    is_yt_project: false,
    git_repository: ''
  }
  form.value?.resetValidation()
}

function populateForm() {
  if (props.projectItem) {
    const p = props.projectItem
    formData.value = {
      project_name: p.project_name || '',
      description: p.description || p.project_name || '',
      status: p.status || 'Created',
      start_date: toDateString(p.start_date),
      end_date: toDateString(p.end_date),
      is_yt_project: p.is_yt_project || false,
      git_repository: p.git_repository || ''
    }
  } else {
    resetForm()
  }
}

function closeDialog() {
  resetForm()
  dialog.value = false
}

// Submit Handler
async function handleSubmit() {
  if (!valid.value) return
  
  loading.value = true
  try {
    const data = {
      ...formData.value,
      // Auto-set description to project name if empty
      description: formData.value.project_name,
      // Always set status to 'Created' for new projects
      status: isEdit.value ? formData.value.status : 'Created',
      start_date: formData.value.start_date 
        ? new Date(formData.value.start_date).toISOString() 
        : null,
      end_date: formData.value.end_date 
        ? new Date(formData.value.end_date).toISOString() 
        : null
    }

    const result = isEdit.value
      ? await projectStore.updateProject(props.projectItem.project_id, data)
      : await projectStore.createProject(data)

    emit('success', {
      message: isEdit.value ? 'Project updated successfully' : 'Project created successfully',
      project: result
    })
    closeDialog()
  } catch (error) {
    emit('error', {
      message: error.message || 'An error occurred'
    })
  } finally {
    loading.value = false
  }
}

// Watchers
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    nextTick(() => populateForm())
  }
})

watch(() => props.projectItem, () => {
  if (props.modelValue) {
    populateForm()
  }
}, { deep: true })
</script>

<style scoped>
/* Responsive */
@media (max-width: 600px) {
  :deep(.v-dialog) {
    margin: 16px;
  }
}
</style>
