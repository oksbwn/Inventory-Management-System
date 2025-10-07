<template>
  <v-container fluid class="pa-6">
    <!-- Page Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-primary mb-1">
              <v-icon size="32" class="mr-2">mdi-briefcase</v-icon>
              Projects
            </h1>
            <p class="text-body-2 text-medium-emphasis ml-11">
              Track and manage inventory-related projects
            </p>
          </div>
          <v-btn
            color="primary"
            size="large"
            prepend-icon="mdi-plus"
            elevation="2"
            class="text-none"
            @click="openAddDialog"
          >
            New Project
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="6" sm="3">
        <v-card class="stat-card" elevation="0" color="blue-lighten-5">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-blue-darken-2 mb-1">Total Projects</div>
                <div class="text-h5 font-weight-bold text-blue-darken-3">
                  {{ projectStore.totalItems || 0 }}
                </div>
              </div>
              <v-avatar size="48" color="blue-lighten-4">
                <v-icon color="blue-darken-2" size="28">mdi-briefcase</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" sm="3">
        <v-card class="stat-card" elevation="0" color="green-lighten-5">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-green-darken-2 mb-1">Active</div>
                <div class="text-h5 font-weight-bold text-green-darken-3">
                  {{ activeCount }}
                </div>
              </div>
              <v-avatar size="48" color="green-lighten-4">
                <v-icon color="green-darken-2" size="28">mdi-progress-check</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" sm="3">
        <v-card class="stat-card" elevation="0" color="orange-lighten-5">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-orange-darken-2 mb-1">On Hold</div>
                <div class="text-h5 font-weight-bold text-orange-darken-3">
                  {{ onHoldCount }}
                </div>
              </div>
              <v-avatar size="48" color="orange-lighten-4">
                <v-icon color="orange-darken-2" size="28">mdi-pause-circle</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" sm="3">
        <v-card class="stat-card" elevation="0" color="cyan-lighten-5">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-cyan-darken-2 mb-1">Completed</div>
                <div class="text-h5 font-weight-bold text-cyan-darken-3">
                  {{ completedCount }}
                </div>
              </div>
              <v-avatar size="48" color="cyan-lighten-4">
                <v-icon color="cyan-darken-2" size="28">mdi-check-circle</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Data Table Card -->
    <v-card elevation="2" class="rounded-lg">
      <v-card-title class="pa-6 pb-4">
        <v-row dense align="center">
          <v-col cols="12" md="7">
            <v-text-field
              v-model="searchQuery"
              density="comfortable"
              placeholder="Search projects..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              clearable
              @click:clear="onSearch"
              @keyup.enter="onSearch"
            >
              <template v-slot:append-inner>
                <v-btn
                  color="primary"
                  variant="flat"
                  size="small"
                  class="text-none"
                  @click="onSearch"
                >
                  Search
                </v-btn>
              </template>
            </v-text-field>
          </v-col>

          <v-col cols="12" md="5" class="d-flex justify-end align-center">
            <v-chip
              :color="projectStore.isCacheValid ? 'success' : 'grey'"
              variant="tonal"
              size="small"
              class="mr-3"
            >
              <v-icon start size="small">mdi-database</v-icon>
              {{ projectStore.isCacheValid ? 'Cached' : 'Live' }}
            </v-chip>

            <v-btn-group variant="outlined" density="comfortable">
              <v-btn @click="refreshData" :loading="projectStore.loading">
                <v-icon>mdi-refresh</v-icon>
                <v-tooltip activator="parent">Refresh</v-tooltip>
              </v-btn>
              <v-btn>
                <v-icon>mdi-filter-variant</v-icon>
                <v-tooltip activator="parent">Filters</v-tooltip>
              </v-btn>
              <v-btn>
                <v-icon>mdi-download</v-icon>
                <v-tooltip activator="parent">Export</v-tooltip>
              </v-btn>
            </v-btn-group>
          </v-col>
        </v-row>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Data Table -->
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        v-model:sort-by="sortBy"
        :headers="headers"
        :items="projectStore.projects"
        :items-length="projectStore.totalItems"
        :loading="projectStore.loading"
        item-value="id"
        @update:options="loadProjects"
        class="elevation-0 professional-table"
        hover
      >
        <!-- Project Name Column -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="40" color="blue-lighten-5" class="mr-3">
              <v-icon color="blue" size="20">mdi-briefcase</v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-medium">{{ item.name }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.code }}</div>
            </div>
          </div>
        </template>

        <!-- Priority Column -->
        <template v-slot:item.priority="{ item }">
          <v-chip
            :color="getPriorityColor(item.priority)"
            size="small"
            variant="flat"
          >
            <v-icon start size="x-small">mdi-flag</v-icon>
            {{ item.priority }}
          </v-chip>
        </template>

        <!-- Status Column -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
            variant="flat"
          >
            <v-icon start size="x-small">{{ getStatusIcon(item.status) }}</v-icon>
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Progress Column -->
        <template v-slot:item.completionPercentage="{ item }">
          <div class="progress-cell">
            <div class="d-flex align-center mb-1">
              <span class="text-body-2 font-weight-medium">{{ item.completionPercentage }}%</span>
            </div>
            <v-progress-linear
              :model-value="item.completionPercentage"
              :color="getProgressColor(item.completionPercentage)"
              height="6"
              rounded
            ></v-progress-linear>
          </div>
        </template>

        <!-- Dates Column -->
        <template v-slot:item.dates="{ item }">
          <div class="dates-cell">
            <div class="text-body-2">
              <v-icon size="small" class="mr-1">mdi-calendar-start</v-icon>
              {{ formatDate(item.startDate) }}
            </div>
            <div class="text-caption text-medium-emphasis">
              <v-icon size="small" class="mr-1">mdi-calendar-end</v-icon>
              {{ formatDate(item.endDate) }}
            </div>
          </div>
        </template>

        <!-- Budget Column -->
        <template v-slot:item.budget="{ item }">
          <span class="font-weight-medium">{{ formatCurrency(item.budget) }}</span>
        </template>

        <!-- Actions Column -->
        <template v-slot:item.actions="{ item }">
          <div class="action-buttons">
            <v-btn icon variant="text" size="small" color="info" @click="viewItem(item)">
              <v-icon size="20">mdi-eye-outline</v-icon>
              <v-tooltip activator="parent">View</v-tooltip>
            </v-btn>
            <v-btn icon variant="text" size="small" color="primary" @click="editItem(item)">
              <v-icon size="20">mdi-pencil-outline</v-icon>
              <v-tooltip activator="parent">Edit</v-tooltip>
            </v-btn>
            <v-btn icon variant="text" size="small" color="error" @click="deleteItem(item)">
              <v-icon size="20">mdi-delete-outline</v-icon>
              <v-tooltip activator="parent">Delete</v-tooltip>
            </v-btn>
          </div>
        </template>
      </v-data-table-server>
    </v-card>

    <!-- Project Form Dialog -->
    <project-form-dialog
      v-model="showFormDialog"
      :project-item="selectedProject"
      @success="handleFormSuccess"
    />

    <!-- Delete Confirmation Dialog -->
    <delete-confirm-dialog
      v-model="showDeleteDialog"
      :item-name="selectedProject?.name"
      @confirm="handleDeleteConfirm"
    />

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccessSnackbar"
      :timeout="3000"
      color="success"
      location="top right"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-check-circle</v-icon>
        {{ successMessage }}
      </div>
    </v-snackbar>

    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showError"
      :timeout="5000"
      color="error"
      location="top right"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-3">mdi-alert-circle</v-icon>
        {{ projectStore.error }}
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="showError = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import ProjectFormDialog from '@/components/ProjectFormDialog.vue'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue'

const projectStore = useProjectStore()

const page = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref([])
const searchQuery = ref('')
const showError = ref(false)

const showFormDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedProject = ref(null)
const successMessage = ref('')
const showSuccessSnackbar = ref(false)

const headers = ref([
  { title: 'Project Name', key: 'name', align: 'start', sortable: true },
  { title: 'Priority', key: 'priority', align: 'center', sortable: true, width: '120px' },
  { title: 'Status', key: 'status', align: 'center', sortable: true, width: '140px' },
  { title: 'Progress', key: 'completionPercentage', align: 'start', sortable: true, width: '150px' },
  { title: 'Timeline', key: 'dates', align: 'start', sortable: false, width: '200px' },
  { title: 'Budget', key: 'budget', align: 'end', sortable: true, width: '130px' },
  { title: 'Actions', key: 'actions', align: 'center', sortable: false, width: '150px' },
])

const activeCount = computed(() => {
  return projectStore.projects.filter(p => p.status === 'In Progress').length
})

const onHoldCount = computed(() => {
  return projectStore.projects.filter(p => p.status === 'On Hold').length
})

const completedCount = computed(() => {
  return projectStore.projects.filter(p => p.status === 'Completed').length
})

const loadProjects = async ({ page: p, itemsPerPage: ipp, sortBy: sb }) => {
  try {
    await projectStore.fetchProjects({
      page: p,
      itemsPerPage: ipp,
      sortBy: sb,
      search: searchQuery.value
    })
  } catch (error) {
    console.error('Failed to load projects:', error)
    showError.value = true
  }
}

const onSearch = async () => {
  page.value = 1
  await loadProjects({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value
  })
}

const refreshData = async () => {
  projectStore.clearCache()
  await loadProjects({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value
  })
}

const getPriorityColor = (priority) => {
  const colors = {
    'Low': 'grey',
    'Medium': 'info',
    'High': 'warning',
    'Critical': 'error'
  }
  return colors[priority] || 'grey'
}

const getStatusColor = (status) => {
  const colors = {
    'Planning': 'info',
    'In Progress': 'primary',
    'On Hold': 'warning',
    'Completed': 'success',
    'Cancelled': 'error'
  }
  return colors[status] || 'grey'
}

const getStatusIcon = (status) => {
  const icons = {
    'Planning': 'mdi-pencil-ruler',
    'In Progress': 'mdi-progress-check',
    'On Hold': 'mdi-pause-circle',
    'Completed': 'mdi-check-circle',
    'Cancelled': 'mdi-close-circle'
  }
  return icons[status] || 'mdi-help-circle'
}

const getProgressColor = (percentage) => {
  if (percentage >= 75) return 'success'
  if (percentage >= 50) return 'info'
  if (percentage >= 25) return 'warning'
  return 'error'
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatCurrency = (amount) => {
  return amount ? `₹${amount.toLocaleString('en-IN')}` : 'N/A'
}

const openAddDialog = () => {
  selectedProject.value = null
  showFormDialog.value = true
}

const viewItem = (item) => {
  console.log('View project:', item)
}

const editItem = (item) => {
  selectedProject.value = { ...item }
  showFormDialog.value = true
}

const deleteItem = (item) => {
  selectedProject.value = item
  showDeleteDialog.value = true
}

const handleDeleteConfirm = async () => {
  try {
    await projectStore.deleteProject(selectedProject.value.id)
    showDeleteDialog.value = false
    successMessage.value = 'Project deleted successfully!'
    showSuccessSnackbar.value = true
    await refreshData()
  } catch (error) {
    console.error('Failed to delete project:', error)
    showError.value = true
  }
}

const handleFormSuccess = async (data) => {
  successMessage.value = data.message
  showSuccessSnackbar.value = true
  await refreshData()
}

watch(() => projectStore.error, (newError) => {
  if (newError) {
    showError.value = true
  }
})

onMounted(() => {
  loadProjects({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value
  })
})
</script>

<style scoped>
.stat-card {
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.professional-table :deep(thead th) {
  background-color: rgb(var(--v-theme-surface-variant)) !important;
  font-weight: 600 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.75rem;
  padding: 16px 12px !important;
}

.professional-table :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.03) !important;
}

.professional-table :deep(tbody td) {
  padding: 12px !important;
}

.action-buttons {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.progress-cell {
  min-width: 130px;
}

.dates-cell {
  max-width: 200px;
}
</style>
