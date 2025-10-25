<template>
  <v-container fluid class="pa-6 categories-page">
    <!-- Page Header -->
    <v-row class="mb-8">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-4">
          <div>
            <div class="d-flex align-center ga-3 mb-2">
              <v-avatar size="48" color="primary" class="header-avatar">
                <v-icon size="28">mdi-shape</v-icon>
              </v-avatar>
              <div>
                <h1 class="text-h4 font-weight-bold mb-1">Categories</h1>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Manage your {{ categoryStore.totalCategories || 0 }} component categories
                </p>
              </div>
            </div>
          </div>
          <v-btn color="primary" prepend-icon="mdi-plus" size="large" class="add-category-btn" @click="openAddDialog">
            Add Category
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <!-- Stats Cards -->
    <v-row class="mb-8" dense>
      <v-col cols="12" sm="3" md="3" lg="2-4">
        <v-card class="stats-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper primary-gradient">
                <v-icon color="white" size="24">mdi-format-list-bulleted</v-icon>
              </div>
              <v-chip size="small" color="primary" variant="tonal">Total</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ categoryStore.totalCategories || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Categories</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="3" md="3" lg="2-4">
        <v-card class="stats-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper success-gradient">
                <v-icon color="white" size="24">mdi-check-circle</v-icon>
              </div>
              <v-chip size="small" color="success" variant="tonal">
                {{ categoryStore.statistics?.categoryCompleteness || 0 }}%
              </v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ categoryStore.activeCategories || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Active</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="3" md="3" lg="2-4">
        <v-card class="stats-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper grey-gradient">
                <v-icon color="white" size="24">mdi-package-variant-closed</v-icon>
              </div>
              <v-chip size="small" :color="categoryStore.insights?.emptyPercentage > 20 ? 'error' : 'grey'"
                variant="tonal">
                {{ categoryStore.insights?.emptyPercentage || 0 }}%
              </v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ categoryStore.emptyCategories || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Empty</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="3" md="3" lg="2-4">
        <v-card class="stats-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper info-gradient">
                <v-icon color="white" size="24">mdi-database</v-icon>
              </div>
              <v-chip size="small" color="info" variant="tonal">Items</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ categoryStore.totalComponents || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Components</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>


    <!-- Additional Insights Row -->
    <v-row class="mb-8" dense>
      <v-col cols="12" md="4">
        <v-card class="insight-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="d-flex align-center mb-3">
              <div class="insight-icon-badge primary-gradient mr-3">
                <v-icon color="white" size="20">mdi-chart-box</v-icon>
              </div>
              <div>
                <div class="text-subtitle-2 text-medium-emphasis">Average Size</div>
                <div class="text-caption text-medium-emphasis">Items per category</div>
              </div>
            </div>
            <div class="text-h4 font-weight-bold mb-2">{{ categoryStore.statistics?.averageCategorySize || 0 }}</div>
            <v-progress-linear :model-value="categoryCompletionPercentage" color="primary" height="6" rounded />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="insight-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="d-flex align-center mb-3">
              <div class="insight-icon-badge success-gradient mr-3">
                <v-icon color="white" size="20">mdi-trophy</v-icon>
              </div>
              <div>
                <div class="text-subtitle-2 text-medium-emphasis">Largest Category</div>
                <div class="text-caption text-medium-emphasis">Most components</div>
              </div>
            </div>
            <div class="text-h6 font-weight-bold mb-1">{{ categoryStore.statistics?.largestCategoryName || 'N/A' }}
            </div>
            <v-chip size="small" color="success" variant="tonal">
              {{ categoryStore.statistics?.largestCategorySize || 0 }} items
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="insight-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="d-flex align-center mb-3">
              <div class="insight-icon-badge info-gradient mr-3">
                <v-icon color="white" size="20">mdi-information</v-icon>
              </div>
              <div>
                <div class="text-subtitle-2 text-medium-emphasis">Status</div>
                <div class="text-caption text-medium-emphasis">Overall health</div>
              </div>
            </div>
            <v-chip :color="getStatusColor(categoryStore.insights?.status)" size="large" variant="tonal"
              class="font-weight-bold">
              {{ categoryStore.insights?.status || 'N/A' }}
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Search and View Controls -->
    <v-row class="mb-6" align="center">
      <v-col cols="12" md="8">
        <div class="search-wrapper">
          <v-text-field v-model="searchQuery" placeholder="Search categories..." prepend-inner-icon="mdi-magnify"
            clearable density="comfortable" variant="outlined" @keyup.enter="onSearch" @click:clear="onSearch"
            hide-details class="search-field" />
          <v-btn color="primary" @click="onSearch" height="46" width="46" class="search-btn" aria-label="Search">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </div>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end align-center ga-2">
        <v-btn-toggle v-model="viewMode" mandatory density="comfortable" variant="outlined" divided class="view-toggle">
          <v-btn value="grid" aria-label="Grid view">
            <v-icon>mdi-view-grid</v-icon>
          </v-btn>
          <v-btn value="list" aria-label="List view">
            <v-icon>mdi-view-list</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <v-card elevation="0" class="main-card">
      <!-- Loading State -->
      <v-row v-if="categoryStore.loading && categories.length === 0" justify="center" class="py-12">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate size="64" color="primary" width="3" />
          <div class="mt-4 text-h6 text-medium-emphasis">Loading categories...</div>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-row v-else-if="categories.length === 0" class="py-12">
        <v-col cols="12" class="text-center">
          <div class="empty-state">
            <v-icon size="120" color="grey-lighten-2">mdi-shape-outline</v-icon>
            <h3 class="text-h5 font-weight-bold mt-4 mb-2">No categories found</h3>
            <p class="text-body-2 text-medium-emphasis mb-6">Get started by adding your first category</p>
            <v-btn color="primary" size="large" @click="openAddDialog" prepend-icon="mdi-plus">
              Add Your First Category
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Grid View -->
      <v-row v-else-if="viewMode === 'grid'" class="pa-4">
        <v-col v-for="category in categories" :key="category.category_id" cols="12" sm="6" md="4" lg="3">
          <v-card class="category-card" elevation="0">
            <v-card-text class="pa-4">
              <div class="text-center mb-4">
                <v-avatar color="primary" size="80" class="category-card-avatar mx-auto" variant="tonal">
                  <v-icon size="40">mdi-shape</v-icon>
                </v-avatar>
              </div>
              <div class="text-center">
                <h3 class="text-h6 font-weight-bold mb-2">{{ category.category_name }}</h3>
                <div class="category-details">
                  <v-chip :color="category.component_count > 0 ? 'success' : 'grey'" size="small" variant="tonal"
                    class="mb-2">
                    <v-icon size="14" class="mr-1">mdi-package-variant</v-icon>
                    {{ category.component_count || 0 }} items
                  </v-chip>
                  <div class="text-caption text-medium-emphasis" v-if="category.recent_additions > 0">
                    <v-icon size="14" color="success" class="mr-1">mdi-plus-circle</v-icon>
                    {{ category.recent_additions }} new (30d)
                  </div>
                  <div class="text-caption text-medium-emphasis" v-if="category.first_component_date">
                    Added: {{ formatDate(category.first_component_date) }}
                  </div>
                </div>
              </div>
            </v-card-text>
            <v-divider />
            <v-card-actions class="pa-3 justify-center">
              <v-btn color="primary" variant="tonal" size="small" @click="editItem(category)">
                <v-icon size="18" class="mr-1">mdi-pencil</v-icon>
                Edit
              </v-btn>
              <v-btn color="error" variant="tonal" size="small" @click="deleteItem(category)">
                <v-icon size="18" class="mr-1">mdi-delete</v-icon>
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- List View -->
      <v-list v-else class="pa-4">
        <v-list-item v-for="category in categories" :key="category.category_id" class="category-list-item mb-3"
          rounded="lg">
          <template #prepend>
            <v-avatar color="primary" size="56" class="mr-4" variant="tonal">
              <v-icon size="28">mdi-shape</v-icon>
            </v-avatar>
          </template>
          <v-list-item-title class="font-weight-bold mb-1">
            {{ category.category_name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <div class="d-flex flex-wrap ga-3 mt-1">
              <v-chip :color="category.component_count > 0 ? 'success' : 'grey'" size="x-small" variant="tonal">
                {{ category.component_count || 0 }} items
              </v-chip>
              <span v-if="category.recent_additions > 0" class="text-caption">
                <v-icon size="12" color="success" class="mr-1">mdi-plus-circle</v-icon>
                {{ category.recent_additions }} new
              </span>
              <span v-if="category.first_component_date" class="text-caption text-medium-emphasis">
                Since {{ formatDate(category.first_component_date) }}
              </span>
            </div>
          </v-list-item-subtitle>
          <template #append>
            <div class="d-flex ga-2">
              <v-btn color="primary" variant="tonal" size="small" @click="editItem(category)">
                <v-icon size="18">mdi-pencil</v-icon>
              </v-btn>
              <v-btn color="error" variant="tonal" size="small" @click="deleteItem(category)">
                <v-icon size="18">mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-list-item>
      </v-list>

      <!-- Pagination -->
      <v-divider v-if="totalPages > 1" class="mt-4" />
      <div v-if="totalPages > 1" class="pa-4 d-flex justify-center">
        <v-pagination v-model="page" :length="totalPages" @update:model-value="onPageChange" :total-visible="7"
          size="small" rounded="circle" />
      </div>
    </v-card>

    <!-- Dialogs -->
    <category-form-dialog v-model="showAddEditDialog" :category-item="selectedCategory" @success="handleSuccess" />
    <delete-confirm-dialog v-model="showDeleteDialog" :item-name="selectedCategory?.category_name"
      @confirm="handleDelete" />

    <!-- Notifications -->
    <v-snackbar v-model="showSuccessSnackbar" color="success" :timeout="3000" location="top right">
      <v-icon class="mr-2">mdi-check-circle</v-icon> {{ successMessage }}
    </v-snackbar>
    <v-snackbar v-model="showError" color="error" :timeout="5000" location="top right">
      <v-icon class="mr-2">mdi-alert-circle</v-icon> {{ categoryStore.error }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showError = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'
import CategoryFormDialog from '@/components/CategoryFormDialog.vue'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue'

const categoryStore = useCategoryStore()

const page = ref(1)
const itemsPerPage = ref(12)
const searchQuery = ref('')
const viewMode = ref('grid')

const showAddEditDialog = ref(false)
const selectedCategory = ref(null)
const showDeleteDialog = ref(false)
const showSuccessSnackbar = ref(false)
const successMessage = ref('')
const showError = ref(false)

const categories = computed(() => categoryStore.categories || [])

const totalPages = computed(() => {
  const total = categoryStore.totalCategories || 0
  return Math.ceil(total / itemsPerPage.value) || 1
})

const categoryCompletionPercentage = computed(() => {
  const avg = categoryStore.statistics?.averageCategorySize || 0
  const max = categoryStore.statistics?.largestCategorySize || 1
  return Math.round((avg / max) * 100)
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getStatusColor = (status) => {
  if (!status) return 'grey'
  if (status.includes('All categories')) return 'success'
  if (status.includes('unused')) return 'warning'
  return 'info'
}

const loadCategories = async () => {
  try {
    await categoryStore.fetchCategories({
      page: page.value,
      pageSize: itemsPerPage.value,
      search: searchQuery.value
    })
  } catch (err) {
    showError.value = true
  }
}

const onSearch = async () => {
  page.value = 1
  await loadCategories()
}

const onPageChange = async () => {
  await loadCategories()
}

const refreshData = async () => {
  categoryStore.clearCache()
  await loadCategories()
}

const openAddDialog = () => {
  selectedCategory.value = null
  showAddEditDialog.value = true
}

const editItem = (category) => {
  selectedCategory.value = category
  showAddEditDialog.value = true
}

const deleteItem = (category) => {
  selectedCategory.value = category
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  try {
    await categoryStore.deleteCategory(selectedCategory.value.category_id)
    showDeleteDialog.value = false
    successMessage.value = 'Category deleted successfully'
    showSuccessSnackbar.value = true
    await loadCategories()
  } catch (error) {
    console.log(error)
    showError.value = true
  }
}

const handleSuccess = async ({ data, isEdit }) => {
  try {
    if (isEdit) {
      await categoryStore.updateCategory(selectedCategory.value.category_id, data)
      successMessage.value = 'Category updated successfully'
    } else {
      await categoryStore.createCategory(data)
      successMessage.value = 'Category created successfully'
    }
    showAddEditDialog.value = false
    showSuccessSnackbar.value = true
    await loadCategories()
  } catch (error) {
    showError.value = true
  }
}

watch(() => categoryStore.error, (val) => {
  if (val) showError.value = true
})

onMounted(() => loadCategories())
</script>
<style scoped>
/* Same styles as before */
.categories-page {
  background: #fafbfc;
  min-height: 100vh;
}

.header-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.add-category-btn {
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

.stats-card:hover {
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

.grey-gradient {
  background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%);
}

.info-gradient {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.warning-gradient {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.insight-card {
  border: 1px solid #e8edf2;
  border-radius: 16px;
  background: white;
  transition: all 0.3s ease;
}

.insight-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.insight-icon-badge {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
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

.category-card {
  border: 1px solid #e8edf2;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  height: 100%;
}

.category-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.category-card-avatar {
  border: 2px solid #f0f3f7;
  transition: all 0.3s ease;
}

.category-card:hover .category-card-avatar {
  border-color: #667eea;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.2);
}

.category-details {
  min-height: 60px;
}

.category-list-item {
  border: 1px solid #e8edf2;
  background: white;
  transition: all 0.3s ease;
}

.category-list-item:hover {
  background: #f7f9fc;
  border-color: #d0d7de;
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

.category-card,
.category-list-item {
  animation: fadeIn 0.5s ease-out;
}
</style>
