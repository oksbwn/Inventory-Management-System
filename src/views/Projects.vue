<template>
  <v-container fluid class="pa-6">
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-3">
          <div>
            <div class="d-flex align-center ga-3 mb-2">
              <v-avatar size="40" color="primary" variant="tonal">
                <v-icon size="24">mdi-briefcase</v-icon>
              </v-avatar>
              <div>
                <h1 class="text-h5 font-weight-bold mb-0">Projects</h1>
                <p class="text-caption text-medium-emphasis mb-0">
                  {{ projectStore.totalProjects }} total projects
                </p>
              </div>
            </div>
          </div>
          <div class="d-flex ga-2">
            <v-btn color="success" prepend-icon="mdi-export" elevation="2" @click="exportData">
              Export
            </v-btn>
            <v-btn color="primary" prepend-icon="mdi-plus" elevation="2" @click="openAddDialog">
              Add Project
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Enhanced Metadata Cards - Fixed Layout -->
    <v-row class="mb-6" dense>
      <v-col 
        v-for="item in stats" 
        :key="item.label" 
        cols="12" 
        sm="6" 
        md="4" 
        lg="2" 
        xl="2"
        class="d-flex"
      >
        <v-card 
          class="metadata-card flex-fill" 
          elevation="2" 
          :class="{ 'metadata-card--clickable': item.filterable }"
          @click="item.filterable ? applyStatusFilter(item.statusFilter) : null"
        >
          <v-card-text class="text-center pa-4 d-flex flex-column justify-center align-center h-100">
            <v-icon :color="item.color" size="36" class="mb-2">{{ item.icon }}</v-icon>
            <div class="text-h5 font-weight-bold mb-1">{{ item.value }}</div>
            <div class="text-caption text-uppercase font-weight-medium mb-1">{{ item.label }}</div>
            <!-- <div v-if="item.percentage !== undefined" class="text-caption text-medium-emphasis">
              {{ item.percentage }}%
            </div> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Enhanced Filter/Search Controls -->
    <v-row class="mb-5" align="center">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchQuery"
          label="Search projects"
          prepend-inner-icon="mdi-magnify"
          clearable
          density="comfortable"
          variant="outlined"
          @keyup.enter="onSearch"
          @click:clear="onSearch"
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          v-model="statusFilter"
          :items="statusOptions"
          label="Filter by Status"
          clearable
          density="comfortable"
          variant="outlined"
          @update:model-value="onSearch"
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          v-model="ytProjectFilter"
          :items="ytProjectOptions"
          label="Project Type"
          clearable
          density="comfortable"
          variant="outlined"
          @update:model-value="onSearch"
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          v-model="sortBy"
          :items="sortOptions"
          label="Sort by"
          density="comfortable"
          variant="outlined"
          @update:model-value="onSearch"
        />
      </v-col>
      <v-col cols="12" md="2" class="d-flex justify-end ga-1">
        <v-btn-toggle v-model="viewMode" mandatory>
          <v-btn value="grid" icon size="small" aria-label="Grid view">
            <v-icon>mdi-view-grid</v-icon>
          </v-btn>
          <v-btn value="list" icon size="small" aria-label="List view">
            <v-icon>mdi-view-list</v-icon>
          </v-btn>
          <v-btn value="kanban" icon size="small" aria-label="Kanban view">
            <v-icon>mdi-view-column</v-icon>
          </v-btn>
        </v-btn-toggle>
        <v-btn icon @click="refreshData" :loading="projectStore.loading" aria-label="Refresh">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Main Content -->
    <v-card elevation="1" class="pa-4">
      <!-- Loading State -->
      <v-row v-if="projectStore.loading && projects.length === 0" justify="center">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate size="48" color="primary" />
          <div class="mt-3">Loading projects...</div>
        </v-col>
      </v-row>
      
      <!-- Empty State -->
      <v-row v-else-if="projects.length === 0">
        <v-col cols="12" class="text-center">
          <v-icon size="80" color="grey lighten-2">mdi-briefcase-outline</v-icon>
          <div class="mt-3">
            {{ searchQuery || statusFilter ? 'No projects match your filters' : 'No projects found' }}
          </div>
          <v-btn v-if="!searchQuery && !statusFilter" color="primary" class="mt-3" @click="openAddDialog" prepend-icon="mdi-plus">
            Add Project
          </v-btn>
          <v-btn v-else color="grey" class="mt-3" @click="clearFilters" prepend-icon="mdi-filter-off-outline">
            Clear Filters
          </v-btn>
        </v-col>
      </v-row>

      <!-- Kanban View -->
      <div v-else-if="viewMode === 'kanban'" class="kanban-container">
        <v-row dense>
          <v-col v-for="statusGroup in kanbanColumns" :key="statusGroup.status" cols="12" sm="6" md="4" lg="3">
            <div class="kanban-column">
              <div class="kanban-header">
                <v-chip :color="statusGroup.color" variant="elevated" size="small">
                  {{ statusGroup.status }}
                </v-chip>
                <v-chip variant="outlined" size="small">{{ statusGroup.projects.length }}</v-chip>
              </div>
              <div class="kanban-cards">
                <v-card
                  v-for="project in statusGroup.projects"
                  :key="project.project_id"
                  class="kanban-card mb-3"
                  elevation="2"
                  @click="viewProject(project)"
                >
                  <v-card-text class="pa-3">
                    <div class="d-flex align-center mb-2">
                      <v-avatar :color="project.is_yt_project ? 'red' : 'indigo'" size="32" class="mr-2">
                        <v-icon size="18" color="white">
                          {{ project.is_yt_project ? 'mdi-youtube' : 'mdi-briefcase' }}
                        </v-icon>
                      </v-avatar>
                      <div class="flex-1-1">
                        <div class="text-subtitle-2 font-weight-bold text-truncate">
                          {{ project.project_name }}
                        </div>
                      </div>
                    </div>
                    
                    <!-- Clipped Description -->
                    <div v-if="project.description" class="mb-2">
                      <div class="description-text text-caption text-medium-emphasis">
                        {{ truncateText(project.description, 60) }}
                        <v-btn
                          v-if="project.description.length > 60"
                          variant="text"
                          size="x-small"
                          class="pa-0 ml-1"
                          @click.stop="viewProject(project)"
                        >
                          Read more
                        </v-btn>
                      </div>
                    </div>
                    
                    <div class="d-flex justify-space-between align-center">
                      <div class="text-caption">
                        {{ formatDate(project.start_date) }}
                      </div>
                      <div class="d-flex ga-1">
                        <v-btn size="x-small" icon @click.stop="editProject(project)">
                          <v-icon size="16">mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn size="x-small" icon @click.stop="deleteProject(project)">
                          <v-icon size="16">mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Grid View -->
      <v-row v-else-if="viewMode === 'grid'" dense>
        <v-col v-for="project in projects" :key="project.project_id" cols="12" sm="6" md="4" lg="3">
          <v-card elevation="2" class="project-card hoverable h-100" @click="viewProject(project)">
            <v-card-text class="d-flex flex-column h-100 pa-4">
              <div class="d-flex align-center mb-3">
                <v-avatar :color="project.is_yt_project ? 'red' : 'indigo'" size="48" class="mr-3">
                  <v-icon size="28" color="white">
                    {{ project.is_yt_project ? 'mdi-youtube' : 'mdi-briefcase' }}
                  </v-icon>
                </v-avatar>
                <div class="flex-1-1">
                  <div class="text-subtitle-1 font-weight-bold">{{ project.project_name }}</div>
                  <v-chip 
                    :color="getStatusColor(project.status)" 
                    size="small" 
                    variant="elevated"
                    class="mt-1"
                  >
                    {{ project.status || 'Not Set' }}
                  </v-chip>
                </div>
              </div>
              
              <!-- Expandable Description -->
              <div v-if="project.description" class="description-container mb-3 flex-1-1">
                <div 
                  :class="[
                    'description-text text-body-2 text-medium-emphasis',
                    expandedDescriptions[project.project_id] ? '' : 'description-clipped'
                  ]"
                >
                  {{ project.description }}
                </div>
                <v-btn
                  v-if="project.description.length > 100"
                  variant="text"
                  size="small"
                  class="pa-0 mt-1"
                  @click.stop="toggleDescription(project.project_id)"
                >
                  {{ expandedDescriptions[project.project_id] ? 'Show less' : 'Read more' }}
                </v-btn>
              </div>
              
              <div class="project-dates mb-3">
                <div class="text-caption d-flex align-center mb-1">
                  <v-icon size="14" class="mr-1">mdi-calendar-start</v-icon>
                  Start: {{ formatDate(project.start_date) }}
                </div>
                <div class="text-caption d-flex align-center">
                  <v-icon size="14" class="mr-1">mdi-calendar-end</v-icon>
                  End: {{ formatDate(project.end_date) }}
                </div>
              </div>
              
              <div v-if="project.git_repository" class="mb-3">
                <v-btn
                  size="small"
                  variant="outlined"
                  prepend-icon="mdi-git"
                  :href="project.git_repository"
                  target="_blank"
                  @click.stop
                >
                  Repository
                </v-btn>
              </div>
            </v-card-text>
            
            <v-divider></v-divider>
            
            <v-card-actions class="pa-2">
              <v-spacer />
              <v-btn color="primary" variant="flat" icon size="small" @click.stop="editProject(project)">
                <v-icon size="18">mdi-pencil</v-icon>
              </v-btn>
              <v-btn color="success" variant="flat" icon size="small" @click.stop="duplicateProject(project)">
                <v-icon size="18">mdi-content-copy</v-icon>
              </v-btn>
              <v-btn color="error" variant="flat" icon size="small" @click.stop="deleteProject(project)">
                <v-icon size="18">mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Enhanced List View -->
      <v-data-table
        v-else
        :headers="tableHeaders"
        :items="projects"
        :loading="projectStore.loading"
        class="elevation-0"
        item-key="project_id"
        show-select
        v-model="selectedProjects"
      >
        <template #item.project_name="{ item }">
          <div class="d-flex align-center">
            <v-avatar :color="item.is_yt_project ? 'red' : 'indigo'" size="32" class="mr-3">
              <v-icon size="18" color="white">
                {{ item.is_yt_project ? 'mdi-youtube' : 'mdi-briefcase' }}
              </v-icon>
            </v-avatar>
            <div style="max-width: 250px;">
              <div class="font-weight-bold">{{ item.project_name }}</div>
              <div v-if="item.description" class="description-text-table text-caption">
                {{ truncateText(item.description, 80) }}
                <v-btn
                  v-if="item.description.length > 80"
                  variant="text"
                  size="x-small"
                  class="pa-0 ml-1"
                  @click.stop="viewProject(item)"
                >
                  ...more
                </v-btn>
              </div>
            </div>
          </div>
        </template>

        <template #item.status="{ item }">
          <v-chip 
            :color="getStatusColor(item.status)" 
            size="small" 
            variant="elevated"
          >
            {{ item.status || 'Not Set' }}
          </v-chip>
        </template>

        <template #item.start_date="{ item }">
          {{ formatDate(item.start_date) }}
        </template>

        <template #item.end_date="{ item }">
          {{ formatDate(item.end_date) }}
        </template>

        <template #item.is_yt_project="{ item }">
          <v-chip 
            :color="item.is_yt_project ? 'red' : 'grey'" 
            variant="outlined"
            size="small"
          >
            {{ item.is_yt_project ? 'YouTube' : 'Regular' }}
          </v-chip>
        </template>

        <template #item.git_repository="{ item }">
          <v-btn
            v-if="item.git_repository"
            size="small"
            variant="outlined"
            icon
            :href="item.git_repository"
            target="_blank"
          >
            <v-icon size="16">mdi-git</v-icon>
          </v-btn>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex ga-1">
            <v-btn color="info" variant="flat" icon size="small" @click="viewProject(item)">
              <v-icon size="18">mdi-eye</v-icon>
            </v-btn>
            <v-btn color="primary" variant="flat" icon size="small" @click="editProject(item)">
              <v-icon size="18">mdi-pencil</v-icon>
            </v-btn>
            <v-btn color="success" variant="flat" icon size="small" @click="duplicateProject(item)">
              <v-icon size="18">mdi-content-copy</v-icon>
            </v-btn>
            <v-btn color="error" variant="flat" icon size="small" @click="deleteProject(item)">
              <v-icon size="18">mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>

      <!-- Bulk Actions for selected items -->
      <div v-if="selectedProjects.length > 0" class="bulk-actions mt-4 pa-3 bg-grey-lighten-4 rounded">
        <div class="d-flex align-center justify-space-between">
          <span class="text-subtitle-2">{{ selectedProjects.length }} project(s) selected</span>
          <div class="d-flex ga-2">
            <v-btn color="primary" size="small" @click="bulkEditStatus">
              Change Status
            </v-btn>
            <v-btn color="success" size="small" @click="bulkExport">
              Export Selected
            </v-btn>
            <v-btn color="error" size="small" @click="bulkDelete">
              Delete Selected
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <v-row justify="center" v-if="totalPages > 1" class="mt-4">
        <v-pagination 
          v-model="page" 
          :length="totalPages" 
          @update:model-value="onPageChange" 
          :total-visible="7" 
        />
      </v-row>
    </v-card>

    <!-- Dialogs -->
    <ProjectFormDialog 
      v-model="showAddEditDialog" 
      :project-item="selectedProject" 
      @success="handleProjectSuccess" 
      @error="handleError" 
    />
    
    <ProjectDetailDialog
      v-model="showDetailDialog"
      :project-item="selectedProject"
      @edit="editFromDetail"
      @delete="deleteFromDetail"
    />
    
    <DeleteConfirmDialog 
      v-model="showDeleteDialog" 
      :item-name="selectedProject?.project_name" 
      @confirm="handleProjectDelete" 
    />

    <BulkStatusDialog
      v-model="showBulkStatusDialog"
      :selected-count="selectedProjects.length"
      @confirm="handleBulkStatusChange"
    />

    <!-- Notifications -->
    <v-snackbar v-model="showSuccessSnackbar" color="success" :timeout="3000">
      <v-icon class="mr-2">mdi-check-circle</v-icon> 
      {{ successMessage }}
    </v-snackbar>
    
    <v-snackbar v-model="showError" color="error" :timeout="5000">
      <v-icon class="mr-2">mdi-alert-circle</v-icon> 
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn text @click="showError = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import ProjectFormDialog from '@/components/ProjectFormDialog.vue'
import ProjectDetailDialog from '@/components/ProjectDetailDialog.vue'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue'
import BulkStatusDialog from '@/components/BulkStatusDialog.vue'

const projectStore = useProjectStore()

// Reactive state
const page = ref(1)
const itemsPerPage = ref(12)
const searchQuery = ref('')
const statusFilter = ref(null)
const ytProjectFilter = ref(null)
const sortBy = ref('project_id')
const viewMode = ref('grid')
const selectedProjects = ref([])
const expandedDescriptions = ref({}) // Track expanded descriptions in grid view

// Dialog states
const showAddEditDialog = ref(false)
const showDetailDialog = ref(false)
const selectedProject = ref(null)
const showDeleteDialog = ref(false)
const showBulkStatusDialog = ref(false)

// Notification states
const showSuccessSnackbar = ref(false)
const successMessage = ref('')
const showError = ref(false)
const errorMessage = ref('')

// Filter options
const statusOptions = [
  'Planning',
  'In Progress', 
  'Testing',
  'Completed',
  'On Hold',
  'Cancelled'
]

const ytProjectOptions = [
  { title: 'YouTube Projects', value: true },
  { title: 'Regular Projects', value: false }
]

const sortOptions = [
  { title: 'Newest First', value: 'project_id' },
  { title: 'Name A-Z', value: 'project_name' },
  { title: 'Status', value: 'status' },
  { title: 'Start Date', value: 'start_date' },
  { title: 'End Date', value: 'end_date' }
]

// Table headers for list view
const tableHeaders = [
  { title: 'Project', key: 'project_name', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Start Date', key: 'start_date', sortable: false },
  { title: 'End Date', key: 'end_date', sortable: false },
  { title: 'Type', key: 'is_yt_project', sortable: false },
  { title: 'Repository', key: 'git_repository', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, width: '200' }
]

// Computed properties
const projects = computed(() => projectStore.projects || [])

const totalPages = computed(() => {
  const total = projectStore.totalProjects || 0
  return Math.ceil(total / itemsPerPage.value) || 1
})

const stats = computed(() => {
  const total = projectStore.totalProjects
  const active = projectStore.activeProjects
  const completed = projectStore.completedProjects
  const onHold = projects.value.filter(p => p.status === 'On Hold').length
  const ytProjects = projects.value.filter(p => p.is_yt_project).length

  return [
    { 
      label: 'Total', 
      value: total || 0, 
      icon: 'mdi-briefcase', 
      color: 'primary',
      filterable: false
    },
    { 
      label: 'Active', 
      value: active || 0, 
      icon: 'mdi-play-circle', 
      color: 'success',
      percentage: total > 0 ? Math.round((active / total) * 100) : 0,
      filterable: true,
      statusFilter: 'In Progress'
    },
    { 
      label: 'Completed', 
      value: completed || 0, 
      icon: 'mdi-check-circle', 
      color: 'blue',
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      filterable: true,
      statusFilter: 'Completed'
    },
    { 
      label: 'On Hold', 
      value: onHold || 0, 
      icon: 'mdi-pause-circle', 
      color: 'orange',
      filterable: true,
      statusFilter: 'On Hold'
    },
    { 
      label: 'YouTube', 
      value: ytProjects || 0, 
      icon: 'mdi-youtube', 
      color: 'red',
      filterable: false
    }
  ]
})

const kanbanColumns = computed(() => {
  const statusColors = {
    'Planning': 'blue',
    'In Progress': 'orange', 
    'Testing': 'purple',
    'Completed': 'green',
    'On Hold': 'grey',
    'Cancelled': 'red'
  }

  const columns = statusOptions.map(status => ({
    status,
    color: statusColors[status] || 'grey',
    projects: projects.value.filter(p => p.status === status)
  }))

  // Add projects without status
  const noStatus = projects.value.filter(p => !p.status || !statusOptions.includes(p.status))
  if (noStatus.length > 0) {
    columns.push({
      status: 'Not Set',
      color: 'grey',
      projects: noStatus
    })
  }

  return columns.filter(col => col.projects.length > 0)
})

// Helper functions for text truncation
const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const toggleDescription = (projectId) => {
  expandedDescriptions.value[projectId] = !expandedDescriptions.value[projectId]
}

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

// Data loading
const loadProjects = async () => {
  try {
    await projectStore.fetchProjects({
      page: page.value,
      pageSize: itemsPerPage.value,
      search: searchQuery.value,
      status: statusFilter.value,
      is_yt_project: ytProjectFilter.value,
      sortBy: sortBy.value
    })
  } catch (err) {
    errorMessage.value = err.message || 'Failed to load projects'
    showError.value = true
  }
}

// Event handlers
const onSearch = async () => {
  page.value = 1
  await loadProjects()
}

const onPageChange = async () => {
  await loadProjects()
}

const refreshData = async () => {
  selectedProjects.value = []
  expandedDescriptions.value = {}
  await loadProjects()
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = null
  ytProjectFilter.value = null
  sortBy.value = 'project_id'
  onSearch()
}

const applyStatusFilter = (status) => {
  statusFilter.value = status
  onSearch()
}

// CRUD operations
const openAddDialog = () => {
  selectedProject.value = null
  showAddEditDialog.value = true
}

const viewProject = (project) => {
  selectedProject.value = { ...project }
  showDetailDialog.value = true
}

const editProject = (project) => {
  selectedProject.value = { ...project }
  showAddEditDialog.value = true
}

const editFromDetail = (project) => {
  showDetailDialog.value = false
  setTimeout(() => {
    selectedProject.value = { ...project }
    showAddEditDialog.value = true
  }, 100)
}

const duplicateProject = (project) => {
  const duplicated = { 
    ...project, 
    project_name: `${project.project_name} (Copy)`,
    project_id: undefined,
    start_date: null,
    end_date: null,
    status: 'Planning'
  }
  selectedProject.value = duplicated
  showAddEditDialog.value = true
}

const deleteProject = (project) => {
  selectedProject.value = project
  showDeleteDialog.value = true
}

const deleteFromDetail = (project) => {
  showDetailDialog.value = false
  setTimeout(() => {
    selectedProject.value = project
    showDeleteDialog.value = true
  }, 100)
}

const handleProjectDelete = async () => {
  try {
    await projectStore.deleteProject(selectedProject.value.project_id)
    showDeleteDialog.value = false
    successMessage.value = 'Project deleted successfully'
    showSuccessSnackbar.value = true
    await loadProjects()
  } catch (error) {
    errorMessage.value = error.message || 'Failed to delete project'
    showError.value = true
  }
}

const handleProjectSuccess = ({ message }) => {
  successMessage.value = message || 'Operation successful'
  showAddEditDialog.value = false
  showSuccessSnackbar.value = true
  loadProjects()
}

const handleError = ({ message }) => {
  errorMessage.value = message || 'An error occurred'
  showError.value = true
}

// Bulk operations
const bulkEditStatus = () => {
  showBulkStatusDialog.value = true
}

const handleBulkStatusChange = async (newStatus) => {
  try {
    for (const project of selectedProjects.value) {
      await projectStore.updateProject(project.project_id, { 
        ...project, 
        status: newStatus 
      })
    }
    successMessage.value = `Updated ${selectedProjects.value.length} project(s)`
    showSuccessSnackbar.value = true
    selectedProjects.value = []
    await loadProjects()
  } catch (error) {
    errorMessage.value = 'Failed to update projects'
    showError.value = true
  }
}

const bulkDelete = async () => {
  if (confirm(`Delete ${selectedProjects.value.length} selected project(s)?`)) {
    try {
      for (const project of selectedProjects.value) {
        await projectStore.deleteProject(project.project_id)
      }
      successMessage.value = `Deleted ${selectedProjects.value.length} project(s)`
      showSuccessSnackbar.value = true
      selectedProjects.value = []
      await loadProjects()
    } catch (error) {
      errorMessage.value = 'Failed to delete projects'
      showError.value = true
    }
  }
}

const exportData = () => {
  const exportProjects = selectedProjects.value.length > 0 ? selectedProjects.value : projects.value
  const csv = convertToCSV(exportProjects)
  downloadCSV(csv, 'projects-export.csv')
}

const bulkExport = () => {
  const csv = convertToCSV(selectedProjects.value)  
  downloadCSV(csv, 'selected-projects-export.csv')
}

const convertToCSV = (data) => {
  const headers = ['ID', 'Name', 'Status', 'Start Date', 'End Date', 'Description', 'YouTube Project', 'Git Repository']
  const rows = data.map(project => [
    project.project_id,
    project.project_name,
    project.status || '',
    project.start_date || '',
    project.end_date || '',
    project.description || '',
    project.is_yt_project ? 'Yes' : 'No',
    project.git_repository || ''
  ])
  
  return [headers, ...rows].map(row => 
    row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
  ).join('\n')
}

const downloadCSV = (csv, filename) => {
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

// Watchers
watch(() => projectStore.error, (val) => {
  if (val) {
    errorMessage.value = val
    showError.value = true
  }
})

// Lifecycle
onMounted(() => loadProjects())
</script>

<style scoped>
/* Fixed Metadata Cards */
.metadata-card {
  border-radius: 12px;
  height: 120px;
  transition: all 0.3s ease;
  border: 1px solid #e3e6ed;
}

.metadata-card--clickable {
  cursor: pointer;
}

.metadata-card--clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #1976d2;
}

.metadata-card .v-card-text {
  height: 100%;
  min-height: 120px;
}

.project-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  border: 1.2px solid #e3e6ed;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #1976d2;
}

.project-dates {
  background-color: rgba(0, 0, 0, 0.04);
  padding: 8px;
  border-radius: 6px;
}

/* Description styles */
.description-container {
  position: relative;
}

.description-text {
  line-height: 1.4;
  word-break: break-word;
}

.description-clipped {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: 4.2em; /* 3 lines × 1.4 line-height */
}

.description-text-table {
  line-height: 1.3;
  word-break: break-word;
  color: rgba(0, 0, 0, 0.6);
}

.kanban-container {
  max-height: 70vh;
  overflow-y: auto;
}

.kanban-column {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  min-height: 500px;
}

.kanban-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e9ecef;
}

.kanban-cards {
  max-height: 450px;
  overflow-y: auto;
}

.kanban-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #dee2e6;
}

.kanban-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bulk-actions {
  border: 1px solid #e0e0e0;
}

.action-btn {
  margin-right: 4px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.05);
}

/* Ensure all columns have equal height */
.d-flex {
  display: flex;
}

.flex-fill {
  flex: 1 1 auto;
}
</style>