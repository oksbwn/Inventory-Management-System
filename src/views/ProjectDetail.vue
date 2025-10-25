<template>
  <v-container fluid class="pa-6 project-detail-page">
    <!-- Back Button -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">
          Back to Projects
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading" justify="center" class="py-12">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate size="64" color="primary" width="3" />
        <div class="mt-4 text-h6 text-medium-emphasis">Loading project...</div>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="error" class="py-12">
      <v-col cols="12" class="text-center">
        <v-icon size="120" color="error">mdi-alert-circle-outline</v-icon>
        <h3 class="text-h5 font-weight-bold mt-4 mb-2">Project Not Found</h3>
        <p class="text-body-2 text-medium-emphasis mb-6">{{ error }}</p>
        <v-btn color="primary" @click="goBack">Go Back</v-btn>
      </v-col>
    </v-row>

    <!-- Project Details -->
    <div v-else-if="project">
      <!-- Header Section -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card elevation="0" class="header-card">
            <v-card-text class="pa-6">
              <div class="d-flex align-center justify-space-between flex-wrap ga-4">
                <div class="d-flex align-center ga-4 flex-1-1">
                  <v-avatar :color="project.is_yt_project ? 'red' : 'indigo'" size="72">
                    <v-icon size="40" color="white">
                      {{ project.is_yt_project ? 'mdi-youtube' : 'mdi-briefcase' }}
                    </v-icon>
                  </v-avatar>
                  <div class="flex-1-1">
                    <!-- Editable Project Name -->
                    <div v-if="editingField === 'project_name'" class="mb-2">
                      <v-text-field
                        v-model="editForm.project_name"
                        density="comfortable"
                        variant="outlined"
                        hide-details
                        autofocus
                        @blur="saveField('project_name')"
                        @keyup.enter="saveField('project_name')"
                        @keyup.esc="cancelEdit"
                      />
                    </div>
                    <h1 
                      v-else 
                      class="text-h4 font-weight-bold mb-2 editable-field" 
                      @click="startEdit('project_name')"
                    >
                      {{ project.project_name }}
                      <v-icon size="20" class="ml-2 edit-icon">mdi-pencil</v-icon>
                    </h1>

                    <div class="d-flex align-center ga-2 flex-wrap">
                      <!-- Editable Status -->
                      <div v-if="editingField === 'status'">
                        <v-select
                          v-model="editForm.status"
                          :items="statusOptions"
                          density="comfortable"
                          variant="outlined"
                          hide-details
                          style="min-width: 150px"
                          @blur="saveField('status')"
                          @update:model-value="saveField('status')"
                        />
                      </div>
                      <v-chip 
                        v-else
                        :color="getStatusColor(project.status)" 
                        size="small" 
                        variant="elevated"
                        class="editable-chip"
                        @click="startEdit('status')"
                      >
                        {{ project.status || 'Not Set' }}
                        <v-icon size="14" class="ml-1">mdi-pencil</v-icon>
                      </v-chip>

                      <v-chip v-if="project.is_yt_project" color="red" size="small" variant="outlined">
                        <v-icon size="16" class="mr-1">mdi-youtube</v-icon>
                        YouTube Project
                      </v-chip>
                      
                      <!-- Component Count -->
                      <v-chip color="indigo" size="small" variant="outlined">
                        <v-icon size="16" class="mr-1">mdi-chip</v-icon>
                        {{ project.component_count || 0 }} Components
                      </v-chip>
                      
                      <!-- Total Cost -->
                      <v-chip color="green" size="small" variant="outlined">
                        <v-icon size="16" class="mr-1">mdi-currency-inr</v-icon>
                        {{ formatCurrency(project.total_cost || 0) }}
                      </v-chip>
                    </div>
                  </div>
                </div>

                <div class="d-flex ga-2">
                  <v-btn color="error" prepend-icon="mdi-delete" variant="outlined" @click="deleteProject">
                    Delete
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Main Content -->
      <v-row>
        <!-- Left Column -->
        <v-col cols="12" md="8">
          <!-- Description Section -->
          <v-card elevation="0" class="content-card mb-6">
            <v-card-title class="pa-6 pb-4">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-icon size="24" class="mr-2">mdi-text-box</v-icon>
                  Description
                </div>
                <v-btn 
                  size="small" 
                  variant="text" 
                  prepend-icon="mdi-pencil"
                  @click="startEdit('description')"
                >
                  Edit
                </v-btn>
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <div v-if="editingField === 'description'">
                <v-textarea
                  v-model="editForm.description"
                  variant="outlined"
                  rows="6"
                  placeholder="Enter project description..."
                  hide-details
                />
                <div class="d-flex ga-2 mt-4">
                  <v-btn color="primary" @click="saveField('description')">Save</v-btn>
                  <v-btn variant="outlined" @click="cancelEdit">Cancel</v-btn>
                </div>
              </div>
              <div v-else>
                <div v-if="project.description" class="description-content">{{ project.description }}</div>
                <div v-else class="text-medium-emphasis">No description provided</div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Timeline Section -->
          <v-card elevation="0" class="content-card mb-6">
            <v-card-title class="pa-6 pb-4">
              <div class="d-flex align-center">
                <v-icon size="24" class="mr-2">mdi-timeline-clock</v-icon>
                Project Timeline
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <v-timeline side="end" density="compact" class="custom-timeline">
                <v-timeline-item 
                  dot-color="primary" 
                  size="small"
                  icon="mdi-calendar-start"
                >
                  <div class="d-flex justify-space-between align-center">
                    <strong>Project Started</strong>
                    <span 
                      class="text-caption text-medium-emphasis editable-date"
                      @click="startEdit('start_date')"
                    >
                      {{ formatDate(project.start_date) }}
                      <v-icon size="14" class="ml-1">mdi-pencil</v-icon>
                    </span>
                  </div>
                </v-timeline-item>
                
                <v-timeline-item 
                  v-if="project.status === 'Completed'"
                  dot-color="success" 
                  size="small"
                  icon="mdi-check-circle"
                >
                  <div class="d-flex justify-space-between align-center">
                    <strong>Project Completed</strong>
                    <span 
                      class="text-caption text-medium-emphasis editable-date"
                      @click="startEdit('end_date')"
                    >
                      {{ formatDate(project.end_date) }}
                      <v-icon size="14" class="ml-1">mdi-pencil</v-icon>
                    </span>
                  </div>
                </v-timeline-item>

                <v-timeline-item 
                  v-else
                  dot-color="orange" 
                  size="small"
                  icon="mdi-calendar-end"
                >
                  <div class="d-flex justify-space-between align-center">
                    <strong>Target End Date</strong>
                    <span 
                      class="text-caption text-medium-emphasis editable-date"
                      @click="startEdit('end_date')"
                    >
                      {{ formatDate(project.end_date) }}
                      <v-icon size="14" class="ml-1">mdi-pencil</v-icon>
                    </span>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column -->
        <v-col cols="12" md="4">
          <!-- Project Info Card -->
          <v-card elevation="0" class="content-card mb-6">
            <v-card-title class="pa-6 pb-4">
              <div class="d-flex align-center">
                <v-icon size="24" class="mr-2">mdi-information</v-icon>
                Project Information
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <div class="info-list">
                <div class="info-item mb-4">
                  <div class="info-label text-caption text-medium-emphasis mb-1">Project ID</div>
                  <div class="info-value font-weight-medium">#{{ project.project_id }}</div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label text-caption text-medium-emphasis mb-1">Components Used</div>
                  <div class="info-value font-weight-medium">
                    <v-icon size="18" class="mr-1" color="indigo">mdi-chip</v-icon>
                    {{ project.component_count || 0 }} items
                  </div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label text-caption text-medium-emphasis mb-1">Total Cost</div>
                  <div class="info-value font-weight-bold text-h6" style="color: #2e7d32;">
                    {{ formatCurrency(project.total_cost || 0) }}
                  </div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label text-caption text-medium-emphasis mb-1">Start Date</div>
                  <div v-if="editingField === 'start_date'">
                    <v-text-field
                      v-model="editForm.start_date"
                      type="date"
                      density="comfortable"
                      variant="outlined"
                      hide-details
                      @blur="saveField('start_date')"
                    />
                  </div>
                  <div v-else class="info-value editable-date" @click="startEdit('start_date')">
                    <v-icon size="16" class="mr-1">mdi-calendar-start</v-icon>
                    {{ formatDateShort(project.start_date) }}
                    <v-icon size="14" class="ml-1">mdi-pencil</v-icon>
                  </div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label text-caption text-medium-emphasis mb-1">End Date</div>
                  <div v-if="editingField === 'end_date'">
                    <v-text-field
                      v-model="editForm.end_date"
                      type="date"
                      density="comfortable"
                      variant="outlined"
                      hide-details
                      @blur="saveField('end_date')"
                    />
                  </div>
                  <div v-else class="info-value editable-date" @click="startEdit('end_date')">
                    <v-icon size="16" class="mr-1">mdi-calendar-end</v-icon>
                    {{ formatDateShort(project.end_date) }}
                    <v-icon size="14" class="ml-1">mdi-pencil</v-icon>
                  </div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label text-caption text-medium-emphasis mb-1">Repository</div>
                  <div v-if="editingField === 'git_repository'">
                    <v-text-field
                      v-model="editForm.git_repository"
                      density="comfortable"
                      variant="outlined"
                      hide-details
                      placeholder="https://github.com/..."
                      @blur="saveField('git_repository')"
                      @keyup.enter="saveField('git_repository')"
                    />
                  </div>
                  <v-btn 
                    v-else-if="project.git_repository"
                    variant="outlined" 
                    size="small" 
                    prepend-icon="mdi-git" 
                    :href="project.git_repository"
                    target="_blank"
                    block
                  >
                    View Repository
                  </v-btn>
                  <v-btn 
                    v-else
                    variant="outlined" 
                    size="small" 
                    prepend-icon="mdi-plus" 
                    block
                    @click="startEdit('git_repository')"
                  >
                    Add Repository
                  </v-btn>
                </div>

                <div class="info-item">
                  <div class="info-label text-caption text-medium-emphasis mb-1">Project Type</div>
                  <v-chip :color="project.is_yt_project ? 'red' : 'grey'" size="small" variant="outlined">
                    {{ project.is_yt_project ? 'YouTube Project' : 'Regular Project' }}
                  </v-chip>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Delete Confirm Dialog -->
    <DeleteConfirmDialog 
      v-model="showDeleteDialog" 
      :item-name="project?.project_name" 
      @confirm="handleDeleteConfirm" 
    />

    <!-- Notifications -->
    <v-snackbar v-model="showSuccess" color="success" :timeout="3000" location="top right">
      <v-icon class="mr-2">mdi-check-circle</v-icon> {{ successMessage }}
    </v-snackbar>
    <v-snackbar v-model="showError" color="error" :timeout="5000" location="top right">
      <v-icon class="mr-2">mdi-alert-circle</v-icon> {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()

const project = ref(null)
const loading = ref(true)
const error = ref(null)
const saving = ref(false)

const editingField = ref(null)
const editForm = ref({})
const originalValues = ref({})

const showDeleteDialog = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')
const showError = ref(false)
const errorMessage = ref('')

const statusOptions = ['Planning', 'In Progress', 'Testing', 'Completed', 'On Hold', 'Cancelled']

const getStatusColor = (status) => {
  const colors = {
    'Planning': 'blue',
    'In Progress': 'orange',
    'Testing': 'purple',
    'Completed': 'green',
    'On Hold': 'grey',
    'Cancelled': 'red',
    'Created': 'blue-grey'
  }
  return colors[status] || 'grey'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatDateShort = (dateString) => {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatCurrency = (amount) => {
  if (!amount || amount === 0) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

const toDateInputFormat = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const startEdit = (field) => {
  editingField.value = field
  editForm.value = { 
    ...project.value,
    start_date: toDateInputFormat(project.value.start_date),
    end_date: toDateInputFormat(project.value.end_date)
  }
  originalValues.value[field] = project.value[field]
}

const cancelEdit = () => {
  editingField.value = null
  editForm.value = {}
}

const saveField = async (field) => {
  if (editForm.value[field] === originalValues.value[field]) {
    cancelEdit()
    return
  }

  try {
    saving.value = true
    
    const updateData = { [field]: editForm.value[field] }
    
    // Convert dates to ISO format
    if (field === 'start_date' || field === 'end_date') {
      if (editForm.value[field]) {
        updateData[field] = new Date(editForm.value[field]).toISOString()
      } else {
        updateData[field] = null
      }
    }
    
    await projectStore.updateProject(project.value.project_id, updateData)
    
    // Reload project to get fresh data
    await loadProject()
    
    successMessage.value = 'Updated successfully'
    showSuccess.value = true
    cancelEdit()
  } catch (err) {
    errorMessage.value = err.message || 'Failed to update'
    showError.value = true
  } finally {
    saving.value = false
  }
}

const loadProject = async () => {
  loading.value = true
  error.value = null
  
  try {
    const projectId = parseInt(route.params.id)
    const fetchedProject = await projectStore.fetchProjectById(projectId)
    project.value = fetchedProject
    console.log(fetchedProject)
  } catch (err) {
    error.value = err.message || 'Project not found'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push({ name: 'Projects' })
}

const deleteProject = () => {
  showDeleteDialog.value = true
}

const handleDeleteConfirm = async () => {
  try {
    await projectStore.deleteProject(project.value.project_id)
    successMessage.value = 'Project deleted successfully'
    showSuccess.value = true
    setTimeout(() => {
      router.push({ name: 'Projects' })
    }, 1000)
  } catch (err) {
    errorMessage.value = err.message || 'Failed to delete project'
    showError.value = true
  }
}

onMounted(() => loadProject())
</script>

<style scoped>
.project-detail-page {
  background: #fafbfc;
  min-height: 100vh;
}

.header-card,
.content-card {
  border: 1px solid #e8edf2;
  border-radius: 16px;
  background: white;
}

.editable-field,
.editable-date,
.editable-chip {
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.editable-field:hover,
.editable-date:hover,
.editable-chip:hover {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  padding: 2px 4px;
}

.edit-icon {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.editable-field:hover .edit-icon,
.editable-date:hover .edit-icon,
.editable-chip:hover .edit-icon {
  opacity: 0.6;
}

.description-content {
  line-height: 1.8;
  white-space: pre-wrap;
}

.info-list {
  display: flex;
  flex-direction: column;
}

.info-label {
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 0.95rem;
  display: flex;
  align-items: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-card,
.content-card {
  animation: fadeIn 0.5s ease-out;
}
</style>
