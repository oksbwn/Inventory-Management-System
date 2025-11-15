<template>
  <v-container fluid class="pa-6 projects-page">
    <!-- Page Header -->
    <v-row class="mb-8">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-4">
          <div class="d-flex align-center ga-3">
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
          <BaseButton 
            variant="contained" 
            color="primary" 
            size="large" 
            class="add-btn" 
            @click="openAddDialog"
          >
            <v-icon class="mr-2">mdi-plus</v-icon>
            Add Project
          </BaseButton>
        </div>
      </v-col>
    </v-row>

    <!-- Stats Cards - Using BaseStatCard ✅ -->
    <v-row class="mb-8" dense>
      <v-col cols="12" sm="6" md="3">
        <BaseStatCard
          icon="mdi-briefcase"
          label="Total"
          :value="projectStore.totalProjects || 0"
          subtitle="All Projects"
          color="primary"
          gradient="primary"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <div @click="applyStatusFilter('In Progress')" class="clickable-stat">
          <BaseStatCard
            icon="mdi-play-circle"
            label="Active"
            :value="projectStore.activeProjects || 0"
            subtitle="In Progress"
            color="success"
            gradient="success"
          />
        </div>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <div @click="applyStatusFilter('Completed')" class="clickable-stat">
          <BaseStatCard
            icon="mdi-check-circle"
            label="Done"
            :value="projectStore.completedProjects || 0"
            subtitle="Completed"
            color="info"
            gradient="info"
          />
        </div>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <BaseStatCard
          icon="mdi-youtube"
          label="YouTube"
          :value="projects.filter(p => p.is_yt_project).length"
          subtitle="YT Projects"
          color="error"
          gradient="error"
        />
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
          <BaseButton 
            variant="contained" 
            color="primary" 
            @click="onSearch" 
            size="large" 
            class="search-btn"
            aria-label="Search"
          >
            <v-icon>mdi-magnify</v-icon>
          </BaseButton>
        </div>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end align-center ga-2">
        <v-btn-toggle 
          v-model="viewMode" 
          mandatory 
          density="comfortable" 
          variant="outlined" 
          divided 
          class="view-toggle"
        >
          <v-btn value="grid" aria-label="Grid view">
            <v-icon>mdi-view-grid</v-icon>
          </v-btn>
          <v-btn value="list" aria-label="List view">
            <v-icon>mdi-view-list</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- Main Content -->
    <BaseCard elevation="0" class="main-card">
      <!-- Loading State -->
      <BaseLoading 
        v-if="projectStore.loading && projects.length === 0" 
        type="skeleton" 
        :count="8" 
        label="Loading projects..." 
      />

      <!-- Empty State -->
      <BaseEmpty 
        v-else-if="projects.length === 0"
        icon="mdi-briefcase-outline"
        title="No projects found"
        :description="searchQuery ? 'Try adjusting your search' : 'Get started by adding your first project'"
      >
        <template #action>
          <BaseButton 
            v-if="!searchQuery"
            variant="contained" 
            color="primary" 
            size="large" 
            @click="openAddDialog"
          >
            <v-icon class="mr-2">mdi-plus</v-icon>
            Add Your First Project
          </BaseButton>
          <BaseButton 
            v-else
            variant="outlined" 
            color="secondary" 
            size="large" 
            @click="clearFilters"
          >
            <v-icon class="mr-2">mdi-filter-off-outline</v-icon>
            Clear Search
          </BaseButton>
        </template>
      </BaseEmpty>

      <!-- Grid View - Using BaseCard ✅ -->
      <v-row v-else-if="viewMode === 'grid'" class="pa-4">
        <v-col v-for="project in projects" :key="project.project_id" cols="12" sm="6" md="4" lg="3">
          <BaseCard 
            variant="default" 
            elevation="0" 
            class="project-card" 
            @click="viewProjectDetails(project)"
          >
            <div class="pa-4">
              <!-- Avatar & Title -->
              <div class="d-flex align-center mb-3">
                <v-avatar 
                  :color="project.is_yt_project ? 'red' : 'indigo'" 
                  size="56" 
                  class="mr-3"
                >
                  <v-icon size="28" color="white">
                    {{ project.is_yt_project ? 'mdi-youtube' : 'mdi-briefcase' }}
                  </v-icon>
                </v-avatar>
                <div class="flex-grow-1 min-width-0">
                  <h3 class="text-subtitle-1 font-weight-bold text-truncate mb-1">
                    {{ project.project_name }}
                  </h3>
                  <v-chip 
                    :color="getStatusColor(project.status)" 
                    size="x-small" 
                    variant="tonal"
                  >
                    {{ project.status || 'Not Set' }}
                  </v-chip>
                </div>
              </div>

              <!-- Description -->
              <div v-if="project.description" class="description-preview mb-3">
                {{ truncateText(project.description, 80) }}
              </div>

              <!-- Stats -->
              <div class="d-flex flex-wrap ga-2 mb-3">
                <v-chip size="x-small" variant="outlined" color="indigo">
                  <v-icon size="14" class="mr-1">mdi-chip</v-icon>
                  {{ getComponentCount(project) }}
                </v-chip>
                <v-chip size="x-small" variant="outlined" color="green">
                  <v-icon size="14" class="mr-1">mdi-currency-inr</v-icon>
                  {{ formatCurrency(getTotalCost(project)) }}
                </v-chip>
              </div>

              <v-divider class="mb-3" />

              <!-- Footer -->
              <div class="d-flex align-center justify-space-between">
                <div class="text-caption text-medium-emphasis">
                  <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
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
                  <v-icon size="18" color="grey-darken-1">mdi-github</v-icon>
                </v-btn>
              </div>
            </div>
          </BaseCard>
        </v-col>
      </v-row>

      <!-- List View - Using BaseCard ✅ -->
      <div v-else class="pa-4">
        <BaseCard 
          v-for="project in projects" 
          :key="project.project_id" 
          variant="default" 
          elevation="0" 
          class="project-list-card mb-3"
          @click="viewProjectDetails(project)"
        >
          <div class="pa-4 d-flex align-center justify-space-between flex-wrap ga-3">
            <!-- Left: Avatar + Info -->
            <div class="d-flex align-center ga-3 flex-grow-1 min-width-0">
              <v-avatar 
                :color="project.is_yt_project ? 'red' : 'indigo'" 
                size="56"
              >
                <v-icon size="28" color="white">
                  {{ project.is_yt_project ? 'mdi-youtube' : 'mdi-briefcase' }}
                </v-icon>
              </v-avatar>
              
              <div class="flex-grow-1 min-width-0">
                <h3 class="text-subtitle-1 font-weight-bold mb-1 text-truncate">
                  {{ project.project_name }}
                </h3>
                <div class="d-flex flex-wrap align-center ga-2">
                  <v-chip 
                    :color="getStatusColor(project.status)" 
                    size="x-small" 
                    variant="tonal"
                  >
                    {{ project.status || 'Not Set' }}
                  </v-chip>
                  <span class="text-caption text-medium-emphasis">
                    <v-icon size="12" class="mr-1">mdi-calendar</v-icon>
                    {{ formatDate(project.start_date) }}
                  </span>
                  <v-chip size="x-small" variant="outlined" color="indigo">
                    <v-icon size="12" class="mr-1">mdi-chip</v-icon>
                    {{ getComponentCount(project) }}
                  </v-chip>
                  <v-chip size="x-small" variant="outlined" color="green">
                    <v-icon size="12" class="mr-1">mdi-currency-inr</v-icon>
                    {{ formatCurrency(getTotalCost(project)) }}
                  </v-chip>
                  <v-btn
                    v-if="project.git_repository"
                    icon
                    size="x-small"
                    variant="text"
                    :href="project.git_repository"
                    target="_blank"
                    @click.stop
                  >
                    <v-icon size="16" color="grey-darken-1">mdi-github</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>

            <!-- Right: Arrow -->
            <v-icon size="24" color="grey-lighten-1" class="flex-shrink-0">
              mdi-chevron-right
            </v-icon>
          </div>
        </BaseCard>
      </div>

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
    </BaseCard>

    <!-- Dialog -->
    <ProjectFormDialog 
      v-model="showAddEditDialog" 
      :project-item="selectedProject" 
      @success="handleProjectSuccess" 
    />

    <!-- Notifications -->
    <BaseSnackbar 
      v-model="showSuccessSnackbar" 
      :message="successMessage" 
      type="success" 
      :timeout="3000"
    />
    
    <BaseSnackbar 
      v-model="showError" 
      :message="errorMessage" 
      type="error" 
      :timeout="5000"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import ProjectFormDialog from '@/components/dialogs/ProjectFormDialog.vue'
import BaseStatCard from '@/components/base/BaseStatCard.vue'

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

const getComponentCount = (project) => {
  if (project.component_count !== undefined) return project.component_count
  if (project.components && Array.isArray(project.components)) return project.components.length
  return 0
}

const getTotalCost = (project) => {
  if (project.total_cost !== undefined) return project.total_cost
  if (project.total_component_cost !== undefined) return project.total_component_cost
  
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

/* Clickable Stats */
.clickable-stat {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.clickable-stat:hover {
  transform: scale(1.02);
}

.clickable-stat:active {
  transform: scale(0.98);
}

/* Search */
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
  min-width: 46px;
  width: 46px;
  height: 46px;
  padding: 0;
}

.view-toggle {
  border-radius: 12px;
  overflow: hidden;
}

/* Main Card */
.main-card {
  border: 1px solid #e8edf2;
  border-radius: 16px;
  background: white;
}

/* Project Card - Grid View */
.project-card {
  border: 1px solid #e8edf2;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  height: 100%;
  cursor: pointer;
  position: relative;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: 12px;
}

.project-card:hover::before {
  opacity: 1;
}

.project-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.project-card:active {
  transform: translateY(-3px);
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

/* Project List Card */
.project-list-card {
  border: 1px solid #e8edf2;
  border-radius: 12px;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.project-list-card:hover {
  background: #f7f9fc;
  border-color: #667eea;
  transform: translateX(6px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.project-list-card:active {
  transform: translateX(3px);
}

/* Responsive helpers */
.min-width-0 {
  min-width: 0;
}

.flex-shrink-0 {
  flex-shrink: 0;
}

/* Animations */
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
.project-list-card {
  animation: fadeIn 0.5s ease-out;
}

/* Responsive */
@media (max-width: 960px) {
  .search-wrapper {
    flex-direction: column;
  }
  
  .search-btn {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .projects-page {
    padding: 16px !important;
  }
}
</style>
