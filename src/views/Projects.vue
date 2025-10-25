<template>
  <v-container fluid class="pa-6 projects-page">
    <!-- Page Header -->
    <v-row class="mb-8">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-3">
          <div>
            <div class="d-flex align-center ga-3 mb-2">
              <v-avatar size="48" color="primary" class="header-avatar">
                <v-icon size="28">mdi-briefcase</v-icon>
              </v-avatar>
              <div>
                <h1 class="text-h4 font-weight-bold mb-1">Projects</h1>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Manage your {{ projectStore.totalProjects || 0 }} projects
                </p>
              </div>
            </div>
          </div>
          <v-btn color="primary" prepend-icon="mdi-plus" size="large" class="add-btn" @click="openAddDialog">
            Add Project
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Stats Cards - Optimized to 4 -->
    <v-row class="mb-8" dense>
      <v-col cols="12" sm="6" md="3">
        <v-card class="stats-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper primary-gradient">
                <v-icon color="white" size="24">mdi-briefcase</v-icon>
              </div>
              <v-chip size="small" color="primary" variant="tonal">Total</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ projectStore.totalProjects || 0 }}</div>
            <div class="text-caption text-medium-emphasis">All Projects</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stats-card hoverable" elevation="0" @click="applyStatusFilter('In Progress')">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper success-gradient">
                <v-icon color="white" size="24">mdi-play-circle</v-icon>
              </div>
              <v-chip size="small" color="success" variant="tonal">Active</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ projectStore.activeProjects || 0 }}</div>
            <div class="text-caption text-medium-emphasis">In Progress</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stats-card hoverable" elevation="0" @click="applyStatusFilter('Completed')">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper info-gradient">
                <v-icon color="white" size="24">mdi-check-circle</v-icon>
              </div>
              <v-chip size="small" color="blue" variant="tonal">Done</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ projectStore.completedProjects || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Completed</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stats-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper youtube-gradient">
                <v-icon color="white" size="24">mdi-youtube</v-icon>
              </div>
              <v-chip size="small" color="red" variant="tonal">YouTube</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ projects.filter(p => p.is_yt_project).length }}</div>
            <div class="text-caption text-medium-emphasis">YT Projects</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Search and View Controls -->
    <v-row class="mb-6" align="center">
      <v-col cols="12" md="8">
        <div class="search-wrapper">
          <v-text-field 
            v-model="searchQuery" 
            placeholder="Search projects..." 
            prepend-inner-icon="mdi-magnify" 
            clearable
            density="comfortable" 
            variant="outlined" 
            @keyup.enter="onSearch" 
            @click:clear="onSearch" 
            hide-details
            class="search-field" 
          />
          <v-btn color="primary" @click="onSearch" height="46" width="46" class="search-btn">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </div>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end align-center ga-2">
        <v-btn-toggle v-model="viewMode" mandatory density="comfortable" variant="outlined" divided class="view-toggle">
          <v-btn value="grid">
            <v-icon>mdi-view-grid</v-icon>
          </v-btn>
          <v-btn value="list">
            <v-icon>mdi-view-list</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- Main Content -->
    <v-card elevation="0" class="main-card">
      <!-- Loading State -->
      <v-row v-if="projectStore.loading && projects.length === 0" justify="center" class="py-12">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate size="64" color="primary" width="3" />
          <div class="mt-4 text-h6 text-medium-emphasis">Loading projects...</div>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-row v-else-if="projects.length === 0" class="py-12">
        <v-col cols="12" class="text-center">
          <div class="empty-state">
            <v-icon size="120" color="grey-lighten-2">mdi-briefcase-outline</v-icon>
            <h3 class="text-h5 font-weight-bold mt-4 mb-2">No projects found</h3>
            <p class="text-body-2 text-medium-emphasis mb-6">
              {{ searchQuery ? 'Try adjusting your search' : 'Get started by adding your first project' }}
            </p>
            <v-btn v-if="!searchQuery" color="primary" size="large" @click="openAddDialog" prepend-icon="mdi-plus">
              Add Your First Project
            </v-btn>
            <v-btn v-else color="grey" size="large" @click="clearFilters" prepend-icon="mdi-filter-off-outline">
              Clear Search
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Grid View -->
      <v-row v-else-if="viewMode === 'grid'" class="pa-4">
        <v-col v-for="project in projects" :key="project.project_id" cols="12" sm="6" md="4" lg="3">
          <v-card class="project-card" elevation="0" @click="viewProjectDetails(project)">
            <v-card-text class="pa-5">
              <div class="d-flex align-center mb-4">
                <v-avatar :color="project.is_yt_project ? 'red' : 'indigo'" size="56" class="mr-3">
                  <v-icon size="28" color="white">
                    {{ project.is_yt_project ? 'mdi-youtube' : 'mdi-briefcase' }}
                  </v-icon>
                </v-avatar>
                <div class="flex-1-1">
                  <div class="text-h6 font-weight-bold text-truncate mb-1">{{ project.project_name }}</div>
                  <v-chip :color="getStatusColor(project.status)" size="small" variant="tonal">
                    {{ project.status || 'Not Set' }}
                  </v-chip>
                </div>
              </div>

              <div v-if="project.description" class="description-preview mb-3">
                {{ truncateText(project.description, 80) }}
              </div>

              <!-- Component Stats -->
              <div class="component-stats mb-3">
                <div class="d-flex flex-wrap ga-2">
                  <v-chip size="small" variant="outlined" color="indigo">
                    <v-icon start size="16">mdi-chip</v-icon>
                    {{ getComponentCount(project) }} Components
                  </v-chip>
                  <v-chip size="small" variant="outlined" color="green">
                    <v-icon start size="16">mdi-currency-inr</v-icon>
                    {{ formatCurrency(getTotalCost(project)) }}
                  </v-chip>
                </div>
              </div>

              <v-divider class="mb-3" />

              <div class="project-meta">
                <div class="d-flex align-center justify-space-between">
                  <div class="text-caption d-flex align-center text-medium-emphasis">
                    <v-icon size="16" class="mr-1">mdi-calendar</v-icon>
                    {{ formatDate(project.start_date) }}
                  </div>
                  <v-btn
                    v-if="project.git_repository"
                    icon
                    size="x-small"
                    variant="text"
                    :href="project.git_repository"
                    target="_blank"
                    @click.stop
                  >
                    <v-icon size="20" color="grey-darken-1">mdi-github</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-card-text>

            <v-overlay
              :model-value="false"
              contained
              class="align-center justify-center"
              scrim="transparent"
            >
              <div class="overlay-content">
                <v-icon size="40" color="white">mdi-arrow-right-circle</v-icon>
                <div class="text-white mt-2 text-caption">View Details</div>
              </div>
            </v-overlay>
          </v-card>
        </v-col>
      </v-row>

      <!-- List View -->
      <v-list v-else class="pa-4">
        <v-list-item 
          v-for="project in projects" 
          :key="project.project_id" 
          class="project-list-item mb-3"
          rounded="lg"
          @click="viewProjectDetails(project)"
        >
          <template #prepend>
            <v-avatar :color="project.is_yt_project ? 'red' : 'indigo'" size="56" class="mr-4">
              <v-icon size="28" color="white">
                {{ project.is_yt_project ? 'mdi-youtube' : 'mdi-briefcase' }}
              </v-icon>
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-bold mb-1">
            {{ project.project_name }}
          </v-list-item-title>

          <v-list-item-subtitle>
            <div class="d-flex flex-wrap align-center ga-3 mt-2">
              <v-chip :color="getStatusColor(project.status)" size="x-small" variant="tonal">
                {{ project.status || 'Not Set' }}
              </v-chip>
              <div class="d-flex align-center text-caption text-medium-emphasis">
                <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
                {{ formatDate(project.start_date) }}
              </div>
              
              <!-- Component Count -->
              <v-chip size="x-small" variant="outlined" color="indigo">
                <v-icon start size="14">mdi-chip</v-icon>
                {{ getComponentCount(project) }}
              </v-chip>
              
              <!-- Total Cost -->
              <v-chip size="x-small" variant="outlined" color="green">
                <v-icon start size="14">mdi-currency-inr</v-icon>
                {{ formatCurrency(getTotalCost(project)) }}
              </v-chip>
              
              <!-- Git Link -->
              <v-btn
                v-if="project.git_repository"
                icon
                size="x-small"
                variant="text"
                :href="project.git_repository"
                target="_blank"
                @click.stop
              >
                <v-icon size="18" color="grey-darken-1">mdi-github</v-icon>
              </v-btn>
              
              <span v-if="project.description" class="text-caption text-medium-emphasis">
                {{ truncateText(project.description, 60) }}
              </span>
            </div>
          </v-list-item-subtitle>

          <template #append>
            <v-icon size="24" color="grey-lighten-1">mdi-chevron-right</v-icon>
          </template>
        </v-list-item>
      </v-list>

      <!-- Pagination -->
      <v-divider v-if="totalPages > 1" class="mt-4" />
      <div v-if="totalPages > 1" class="pa-4 d-flex justify-center">
        <v-pagination 
          v-model="page" 
          :length="totalPages" 
          @update:model-value="onPageChange" 
          :total-visible="7"
          size="small"
          rounded="circle"
        />
      </div>
    </v-card>

    <!-- Add Dialog Only -->
    <ProjectFormDialog v-model="showAddEditDialog" :project-item="selectedProject" @success="handleProjectSuccess" />

    <!-- Notifications -->
    <v-snackbar v-model="showSuccessSnackbar" color="success" :timeout="3000" location="top right">
      <v-icon class="mr-2">mdi-check-circle</v-icon> {{ successMessage }}
    </v-snackbar>
    <v-snackbar v-model="showError" color="error" :timeout="5000" location="top right">
      <v-icon class="mr-2">mdi-alert-circle</v-icon> {{ errorMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showError = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import ProjectFormDialog from '@/components/ProjectFormDialog.vue'

const router = useRouter()
const projectStore = useProjectStore()

const page = ref(1)
const itemsPerPage = ref(12)
const searchQuery = ref('')
const statusFilter = ref(null)
const viewMode = ref('grid')

const showAddEditDialog = ref(false)
const selectedProject = ref(null)

const showSuccessSnackbar = ref(false)
const successMessage = ref('')
const showError = ref(false)
const errorMessage = ref('')

const projects = computed(() => projectStore.projects || [])
const totalPages = computed(() => Math.ceil((projectStore.totalProjects || 0) / itemsPerPage.value) || 1)

// Helper functions
const stripHtml = (html) => {
  if (!html) return ''
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  const plainText = stripHtml(text)
  return plainText.length <= maxLength ? plainText : plainText.substring(0, maxLength) + '...'
}

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
  return new Date(dateString).toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

// Component and Cost helpers
const getComponentCount = (project) => {
  // Assuming project has components array or component_count property
  if (project.component_count !== undefined) return project.component_count
  if (project.components && Array.isArray(project.components)) return project.components.length
  return 0
}

const getTotalCost = (project) => {
  // Assuming project has total_cost or we calculate from components
  if (project.total_cost !== undefined) return project.total_cost
  if (project.total_component_cost !== undefined) return project.total_component_cost
  
  // Calculate from components array if available
  if (project.components && Array.isArray(project.components)) {
    return project.components.reduce((sum, comp) => {
      const quantity = comp.quantity_used || comp.quantity || 0
      const price = comp.unit_price || comp.price || 0
      return sum + (quantity * price)
    }, 0)
  }
  
  return 0
}

const formatCurrency = (amount) => {
  if (!amount || amount === 0) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

const loadProjects = async () => {
  try {
    await projectStore.fetchProjects({
      page: page.value,
      pageSize: itemsPerPage.value,
      search: searchQuery.value,
      status: statusFilter.value
    })
  } catch (err) {
    errorMessage.value = err.message || 'Failed to load projects'
    showError.value = true
  }
}

const onSearch = () => {
  page.value = 1
  loadProjects()
}

const onPageChange = () => loadProjects()

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = null
  onSearch()
}

const applyStatusFilter = (status) => {
  statusFilter.value = status
  onSearch()
}

const openAddDialog = () => {
  selectedProject.value = null
  showAddEditDialog.value = true
}

const viewProjectDetails = (project) => {
  router.push({ name: 'ProjectDetail', params: { id: project.project_id } })
}

const handleProjectSuccess = async () => {
  successMessage.value = 'Project saved successfully'
  showAddEditDialog.value = false
  showSuccessSnackbar.value = true
  await loadProjects()
}

watch(() => projectStore.error, (val) => {
  if (val) {
    errorMessage.value = val
    showError.value = true
  }
})

onMounted(() => loadProjects())
</script>

<style scoped>
.projects-page {
  background: #fafbfc;
  min-height: 100vh;
}

.header-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.add-btn {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-transform: none;
  letter-spacing: 0.5px;
}

.stats-card {
  border: 1px solid #e8edf2;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
}

.stats-card.hoverable {
  cursor: pointer;
}

.stats-card.hoverable:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  border-color: #d0d7de;
}

.stats-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.success-gradient {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.info-gradient {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.youtube-gradient {
  background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
}

.search-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-field {
  flex: 1;
}

.search-btn {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.view-toggle {
  border-radius: 12px;
  overflow: hidden;
}

.main-card {
  border: 1px solid #e8edf2;
  border-radius: 16px;
  background: white;
}

.project-card {
  border: 1px solid #e8edf2;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  height: 100%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.project-card:hover::before {
  opacity: 1;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  border-color: #667eea;
}

.project-card:active {
  transform: translateY(-4px);
}

.description-preview {
  color: rgba(0, 0, 0, 0.65);
  font-size: 0.875rem;
  line-height: 1.5;
  min-height: 2.5em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.component-stats {
  min-height: 32px;
}

.project-list-item {
  border: 1px solid #e8edf2;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 16px;
}

.project-list-item:hover {
  background: #f7f9fc;
  border-color: #667eea;
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.project-list-item:active {
  transform: translateX(4px);
}

.empty-state {
  padding: 60px 20px;
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

.project-card,
.project-list-item {
  animation: fadeIn 0.5s ease-out;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .project-card {
    margin-bottom: 16px;
  }
  
  .search-wrapper {
    flex-direction: column;
  }
  
  .search-btn {
    width: 100%;
  }
  
  .stats-card {
    margin-bottom: 12px;
  }
}

@media (max-width: 600px) {
  .projects-page {
    padding: 16px !important;
  }
  
  .component-stats .v-chip {
    font-size: 0.7rem;
  }
}
</style>
