<template>
  <v-dialog v-model="dialog" max-width="900px" persistent scrollable>
    <v-card>
      <v-card-title class="d-flex align-center sticky-header">
        <v-avatar :color="projectItem?.is_yt_project ? 'red' : 'indigo'" size="40" class="mr-3">
          <v-icon color="white">
            {{ projectItem?.is_yt_project ? 'mdi-youtube' : 'mdi-briefcase' }}
          </v-icon>
        </v-avatar>
        <div class="flex-1-1">
          <div class="text-h6">{{ projectItem?.project_name }}</div>
          <v-chip 
            v-if="projectItem?.status"
            :color="getStatusColor(projectItem.status)" 
            size="small" 
            variant="elevated"
            class="mt-1"
          >
            {{ projectItem.status }}
          </v-chip>
        </div>
        <v-spacer />
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" md="8">
            <!-- Full Project Description -->
            <div v-if="projectItem?.description" class="mb-4">
              <h3 class="text-h6 mb-3 d-flex align-center">
                <v-icon class="mr-2">mdi-text-long</v-icon>
                Description
              </h3>
              <v-card variant="outlined" class="description-card">
                <v-card-text class="pa-4">
                  <div class="description-full-text text-body-1">
                    {{ projectItem.description }}
                  </div>
                  <div class="text-caption text-medium-emphasis mt-3">
                    {{ projectItem.description.length }} characters
                  </div>
                </v-card-text>
              </v-card>
            </div>

            <!-- Project Details -->
            <h3 class="text-h6 mb-3 d-flex align-center">
              <v-icon class="mr-2">mdi-information</v-icon>
              Project Details
            </h3>
            
            <v-row class="mb-4">
              <v-col cols="6">
                <div class="detail-item">
                  <v-icon size="20" class="mr-2" color="primary">mdi-calendar-start</v-icon>
                  <div>
                    <div class="text-caption text-medium-emphasis">Start Date</div>
                    <div class="text-body-2">{{ formatDate(projectItem?.start_date) }}</div>
                  </div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="detail-item">
                  <v-icon size="20" class="mr-2" color="primary">mdi-calendar-end</v-icon>
                  <div>
                    <div class="text-caption text-medium-emphasis">End Date</div>
                    <div class="text-body-2">{{ formatDate(projectItem?.end_date) }}</div>
                  </div>
                </div>
              </v-col>
            </v-row>

            <!-- Project Type -->
            <div class="detail-item mb-4">
              <v-icon size="20" class="mr-2" color="primary">mdi-tag</v-icon>
              <div>
                <div class="text-caption text-medium-emphasis">Project Type</div>
                <v-chip 
                  :color="projectItem?.is_yt_project ? 'red' : 'grey'" 
                  variant="outlined"
                  size="small"
                  class="mt-1"
                >
                  {{ projectItem?.is_yt_project ? 'YouTube Project' : 'Regular Project' }}
                </v-chip>
              </div>
            </div>

            <!-- Git Repository -->
            <div v-if="projectItem?.git_repository" class="detail-item mb-4">
              <v-icon size="20" class="mr-2" color="primary">mdi-git</v-icon>
              <div>
                <div class="text-caption text-medium-emphasis">Git Repository</div>
                <div class="mt-1">
                  <v-btn
                    :href="projectItem.git_repository"
                    target="_blank"
                    variant="outlined"
                    size="small"
                    prepend-icon="mdi-open-in-new"
                    class="mr-2"
                  >
                    Open Repository
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    size="small"
                    prepend-icon="mdi-content-copy"
                    @click="copyToClipboard(projectItem.git_repository)"
                  >
                    Copy URL
                  </v-btn>
                </div>
                <div class="text-caption text-medium-emphasis mt-1 font-mono">
                  {{ projectItem.git_repository }}
                </div>
              </div>
            </div>

            <!-- Project Timeline (if dates exist) -->
            <div v-if="projectItem?.start_date || projectItem?.end_date" class="mb-4">
              <h3 class="text-h6 mb-3 d-flex align-center">
                <v-icon class="mr-2">mdi-timeline</v-icon>
                Project Timeline
              </h3>
              <v-card variant="outlined">
                <v-card-text class="pa-4">
                  <div class="d-flex align-center">
                    <div class="timeline-item flex-1-1">
                      <div class="text-subtitle-2">Start Date</div>
                      <div>{{ formatDate(projectItem.start_date) }}</div>
                    </div>
                    <v-icon class="mx-4" color="grey">mdi-arrow-right</v-icon>
                    <div class="timeline-item flex-1-1">
                      <div class="text-subtitle-2">End Date</div>
                      <div>{{ formatDate(projectItem.end_date) }}</div>
                    </div>
                    <div v-if="getProjectDuration()" class="ml-4">
                      <div class="text-subtitle-2">Duration</div>
                      <div>{{ getProjectDuration() }}</div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <!-- Project Stats Card -->
            <v-card variant="outlined" class="mb-4">
              <v-card-title class="text-subtitle-1">
                <v-icon class="mr-2">mdi-chart-box</v-icon>
                Project Stats
              </v-card-title>
              <v-card-text>
                <div class="stat-item mb-3">
                  <div class="text-caption text-medium-emphasis">Components Used</div>
                  <div class="text-h6">{{ projectStats.componentsCount || 0 }}</div>
                </div>
                <div class="stat-item mb-3">
                  <div class="text-caption text-medium-emphasis">Files Attached</div>
                  <div class="text-h6">{{ projectStats.filesCount || 0 }}</div>
                </div>
                <div class="stat-item mb-3">
                  <div class="text-caption text-medium-emphasis">Description Length</div>
                  <div class="text-body-2">{{ projectItem?.description?.length || 0 }} chars</div>
                </div>
                <div class="stat-item">
                  <div class="text-caption text-medium-emphasis">Project ID</div>
                  <div class="text-body-2">#{{ projectItem?.project_id }}</div>
                </div>
              </v-card-text>
            </v-card>

            <!-- Quick Actions -->
            <v-card variant="outlined">
              <v-card-title class="text-subtitle-1">
                <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
                Quick Actions
              </v-card-title>
              <v-card-text class="pa-2">
                <v-btn 
                  block 
                  variant="outlined" 
                  prepend-icon="mdi-pencil"
                  class="mb-2"
                  @click="editProject"
                >
                  Edit Project
                </v-btn>
                <v-btn 
                  block 
                  variant="outlined" 
                  prepend-icon="mdi-content-copy"
                  class="mb-2"
                  @click="duplicateProject"
                >
                  Duplicate Project
                </v-btn>
                <v-btn 
                  v-if="projectItem?.git_repository"
                  block 
                  variant="outlined" 
                  prepend-icon="mdi-git"
                  class="mb-2"
                  :href="projectItem.git_repository"
                  target="_blank"
                >
                  View Repository
                </v-btn>
                <v-btn 
                  block 
                  variant="outlined" 
                  color="success"
                  prepend-icon="mdi-export"
                  class="mb-2"
                  @click="exportProject"
                >
                  Export Project
                </v-btn>
                <v-btn 
                  block 
                  variant="outlined" 
                  color="error"
                  prepend-icon="mdi-delete"
                  @click="deleteProject"
                >
                  Delete Project
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Components Section -->
        <div v-if="projectComponents.length > 0" class="mt-6">
          <h3 class="text-h6 mb-3 d-flex align-center">
            <v-icon class="mr-2">mdi-chip</v-icon>
            Components Used ({{ projectComponents.length }})
          </h3>
          <v-row dense>
            <v-col 
              v-for="component in projectComponents" 
              :key="component.component_id"
              cols="12" sm="6" md="4"
            >
              <v-card variant="outlined" size="small">
                <v-card-text class="pa-3">
                  <div class="d-flex align-center">
                    <v-avatar size="32" color="blue-grey" class="mr-2">
                      <v-icon size="16" color="white">mdi-chip</v-icon>
                    </v-avatar>
                    <div class="flex-1-1">
                      <div class="text-body-2 font-weight-medium">
                        {{ component.name }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        Qty: {{ component.quantity_used }}
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Files Section -->
        <div v-if="projectFiles.length > 0" class="mt-6">
          <h3 class="text-h6 mb-3 d-flex align-center">
            <v-icon class="mr-2">mdi-file-multiple</v-icon>
            Project Files ({{ projectFiles.length }})
          </h3>
          <v-list dense>
            <v-list-item 
              v-for="file in projectFiles" 
              :key="file.file_id"
              class="file-item"
            >
              <template #prepend>
                <v-avatar size="32" color="grey">
                  <v-icon size="16" color="white">{{ getFileIcon(file.minio_file_type) }}</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title>{{ file.minio_file_name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ file.description || 'No description' }} • 
                {{ formatDate(file.uploaded_at) }}
              </v-list-item-subtitle>
              <template #append>
                <v-btn size="small" icon variant="outlined">
                  <v-icon size="16">mdi-download</v-icon>
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  projectItem: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'edit', 'delete'])

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Mock data - replace with actual API calls
const projectStats = ref({
  componentsCount: 0,
  filesCount: 0
})

const projectComponents = ref([])
const projectFiles = ref([])

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

const formatDate = (dateString) => {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString()
}

const getProjectDuration = () => {
  if (!props.projectItem?.start_date || !props.projectItem?.end_date) {
    return null
  }
  
  const start = new Date(props.projectItem.start_date)
  const end = new Date(props.projectItem.end_date)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 30) return `${diffDays} days`
  if (diffDays < 365) return `${Math.round(diffDays / 30)} months`
  return `${Math.round(diffDays / 365)} years`
}

const getFileIcon = (fileType) => {
  const iconMap = {
    'pdf': 'mdi-file-pdf-box',
    'doc': 'mdi-file-word-box',
    'docx': 'mdi-file-word-box',
    'xls': 'mdi-file-excel-box',
    'xlsx': 'mdi-file-excel-box',
    'ppt': 'mdi-file-powerpoint-box',
    'pptx': 'mdi-file-powerpoint-box',
    'jpg': 'mdi-file-image-box',
    'jpeg': 'mdi-file-image-box',
    'png': 'mdi-file-image-box',
    'gif': 'mdi-file-image-box',
    'mp4': 'mdi-file-video-box',
    'avi': 'mdi-file-video-box',
    'zip': 'mdi-folder-zip',
    'rar': 'mdi-folder-zip'
  }
  return iconMap[fileType?.toLowerCase()] || 'mdi-file'
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    // You could add a toast notification here
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}

// Event handlers
const closeDialog = () => {
  dialog.value = false
}

const editProject = () => {
  emit('edit', props.projectItem)
}

const duplicateProject = () => {
  const duplicated = { 
    ...props.projectItem, 
    project_name: `${props.projectItem.project_name} (Copy)`,
    project_id: undefined,
    start_date: null,
    end_date: null,
    status: 'Planning'
  }
  emit('edit', duplicated)
}

const deleteProject = () => {
  emit('delete', props.projectItem)
}

const exportProject = () => {
  if (!props.projectItem) return
  
  const projectData = {
    id: props.projectItem.project_id,
    name: props.projectItem.project_name,
    status: props.projectItem.status || '',
    start_date: props.projectItem.start_date || '',
    end_date: props.projectItem.end_date || '',
    description: props.projectItem.description || '',
    is_youtube_project: props.projectItem.is_yt_project ? 'Yes' : 'No',
    git_repository: props.projectItem.git_repository || ''
  }

  const csv = Object.entries(projectData)
    .map(([key, value]) => `"${key.replace(/_/g, ' ').toUpperCase()}","${String(value).replace(/"/g, '""')}"`)
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `project-${props.projectItem.project_id}-${props.projectItem.project_name.replace(/[^a-zA-Z0-9]/g, '-')}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

// Load project details when dialog opens
const loadProjectDetails = async () => {
  if (!props.projectItem?.project_id) return
  
  try {
    // Mock API calls - replace with actual service calls
    projectStats.value = {
      componentsCount: Math.floor(Math.random() * 20),
      filesCount: Math.floor(Math.random() * 10)
    }
    
    projectComponents.value = [
      // Mock data - replace with actual API call
      { component_id: 1, name: 'ESP32 DevKit', quantity_used: 2 },
      { component_id: 2, name: 'Resistor 220Ω', quantity_used: 5 },
      { component_id: 3, name: 'LED Red', quantity_used: 3 }
    ]
    
    projectFiles.value = [
      // Mock data - replace with actual API call
      { 
        file_id: 1, 
        minio_file_name: 'project-schematic.pdf',
        minio_file_type: 'pdf',
        description: 'Main circuit schematic',
        uploaded_at: new Date().toISOString()
      }
    ]
  } catch (error) {
    console.error('Failed to load project details:', error)
  }
}

watch(() => props.modelValue, (newValue) => {
  if (newValue && props.projectItem) {
    loadProjectDetails()
  }
})
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
}

.detail-item {
  display: flex;
  align-items: flex-start;
}

.stat-item {
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.stat-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.file-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 4px;
}

.description-card {
  max-height: 400px;
  overflow-y: auto;
}

.description-full-text {
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-wrap; /* Preserve line breaks from the database */
}

.timeline-item {
  text-align: center;
}

.font-mono {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.875rem;
  background-color: rgba(0, 0, 0, 0.04);
  padding: 4px 8px;
  border-radius: 4px;
  word-break: break-all;
}

/* Custom scrollbar for description */
.description-card ::-webkit-scrollbar {
  width: 6px;
}

.description-card ::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.description-card ::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.description-card ::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>