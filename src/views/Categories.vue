<template>
  <v-container fluid class="pa-6 categories-page">
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-4">
          <div class="d-flex align-center ga-3">
            <v-avatar size="48" color="primary" class="header-avatar">
              <v-icon size="28">mdi-shape</v-icon>
            </v-avatar>
            <div>
              <h1 class="text-h4 font-weight-bold mb-1">Categories</h1>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Manage and organize your {{ categoryStore.totalCategories || 0 }} categories
              </p>
            </div>
          </div>
          <BaseButton 
            variant="contained" 
            color="primary" 
            size="large" 
            class="add-category-btn" 
            @click="openAddDialog"
          >
            <v-icon class="mr-2">mdi-plus</v-icon>
            Add Category
          </BaseButton>
        </div>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-6" dense>
      <v-col cols="12" sm="6" md="3">
        <BaseStatCard
          icon="mdi-shape"
          label="Total"
          :value="categoryStore.totalCategories || 0"
          subtitle="Categories"
          color="primary"
          gradient="primary"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <BaseStatCard
          icon="mdi-check-circle"
          label="Active"
          :value="categoryStore.activeCategories || 0"
          subtitle="Active"
          color="success"
          gradient="success"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <BaseStatCard
          icon="mdi-close-circle"
          label="Empty"
          :value="categoryStore.emptyCategories || 0"
          subtitle="Empty"
          color="grey"
          gradient="grey"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <BaseStatCard
          icon="mdi-database"
          label="Items"
          :value="categoryStore.totalComponents || 0"
          subtitle="Components"
          color="info"
          gradient="info"
        />
      </v-col>
    </v-row>

    <!-- Search Bar -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="search-wrapper">
          <v-text-field 
            v-model="searchQuery" 
            placeholder="Search categories by name..." 
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
            Search
          </BaseButton>
        </div>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <BaseCard elevation="0" class="main-card">
      <!-- Loading State -->
      <BaseLoading 
        v-if="categoryStore.loading && categories.length === 0" 
        type="skeleton" 
        :count="8" 
        label="Loading categories..." 
      />

      <!-- Empty State -->
      <BaseEmpty 
        v-else-if="categories.length === 0"
        icon="mdi-shape-outline"
        title="No categories found"
        :description="searchQuery ? 'Try adjusting your search terms' : 'Get started by adding your first category'"
        :action-button="!searchQuery"
        action-text="Add Your First Category"
        @action="openAddDialog"
      />

      <!-- Categories List -->
      <div v-else>
        <!-- Table Header -->
        <div class="table-header pa-4">
          <v-row align="center" no-gutters>
            <v-col cols="12" sm="6" md="5">
              <span class="text-subtitle-2 font-weight-bold text-medium-emphasis">
                CATEGORY NAME
              </span>
            </v-col>
            <v-col cols="12" sm="3" md="3" class="d-none d-sm-block text-center">
              <span class="text-subtitle-2 font-weight-bold text-medium-emphasis">
                COMPONENTS
              </span>
            </v-col>
            <v-col cols="12" sm="3" md="2" class="d-none d-sm-block text-center">
              <span class="text-subtitle-2 font-weight-bold text-medium-emphasis">
                STATUS
              </span>
            </v-col>
            <v-col cols="12" md="2" class="d-none d-md-block text-right">
              <span class="text-subtitle-2 font-weight-bold text-medium-emphasis">
                ACTIONS
              </span>
            </v-col>
          </v-row>
        </div>

        <v-divider />

        <!-- Table Rows -->
        <div class="table-body">
          <div 
            v-for="(category, index) in categories" 
            :key="category.category_id"
            class="table-row"
            :class="{ 'border-bottom': index < categories.length - 1 }"
          >
            <v-row align="center" no-gutters class="pa-4">
              <!-- Category Name -->
              <v-col cols="12" sm="6" md="5">
                <div class="d-flex align-center ga-3">
                  <v-avatar 
                    color="primary" 
                    size="40" 
                    variant="tonal"
                    class="category-icon"
                  >
                    <v-icon size="20">mdi-shape</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-1 font-weight-medium category-name">
                      {{ category.category_name }}
                    </div>
                    <div class="text-caption text-medium-emphasis d-sm-none">
                      {{ category.component_count || 0 }} items
                      <v-chip 
                        :color="category.component_count > 0 ? 'success' : 'grey'" 
                        size="x-small" 
                        variant="flat"
                        class="ml-2"
                      >
                        {{ category.component_count > 0 ? 'Active' : 'Empty' }}
                      </v-chip>
                    </div>
                  </div>
                </div>
              </v-col>

              <!-- Component Count (Desktop) -->
              <v-col cols="3" class="d-none d-sm-block text-center">
                <div class="d-flex align-center justify-center ga-1">
                  <v-icon size="18" color="primary">mdi-package-variant</v-icon>
                  <span class="text-body-1 font-weight-medium">
                    {{ category.component_count || 0 }}
                  </span>
                </div>
              </v-col>

              <!-- Status (Desktop) -->
              <v-col cols="3" md="2" class="d-none d-sm-flex justify-center">
                <v-chip 
                  :color="category.component_count > 0 ? 'success' : 'grey'" 
                  size="small" 
                  variant="tonal"
                >
                  {{ category.component_count > 0 ? 'Active' : 'Empty' }}
                </v-chip>
              </v-col>

              <!-- Actions -->
              <v-col cols="12" md="2" class="mt-3 mt-md-0">
                <div class="d-flex ga-2 justify-end">
                  <BaseButton 
                    variant="tonal" 
                    color="primary" 
                    size="small"
                    class="action-btn"
                    @click="editItem(category)"
                    aria-label="Edit category"
                  >
                    <v-icon size="18">mdi-pencil</v-icon>
                    <span class="d-none d-lg-inline ml-1">Edit</span>
                  </BaseButton>
                  <BaseButton 
                    variant="tonal" 
                    color="error" 
                    size="small"
                    class="action-btn"
                    @click="deleteItem(category)"
                    aria-label="Delete category"
                  >
                    <v-icon size="18">mdi-delete</v-icon>
                    <span class="d-none d-lg-inline ml-1">Delete</span>
                  </BaseButton>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>

        <!-- Pagination -->
        <template v-if="totalPages > 1">
          <v-divider />
          <div class="pa-4 d-flex justify-space-between align-center flex-wrap ga-3">
            <div class="text-body-2 text-medium-emphasis">
              Showing {{ ((page - 1) * itemsPerPage) + 1 }} to 
              {{ Math.min(page * itemsPerPage, categoryStore.totalCategories) }} 
              of {{ categoryStore.totalCategories }} categories
            </div>
            <v-pagination 
              v-model="page" 
              :length="totalPages" 
              @update:model-value="onPageChange" 
              :total-visible="5"
              size="small" 
              rounded="circle"
            />
          </div>
        </template>
      </div>
    </BaseCard>

    <!-- Dialogs -->
    <category-form-dialog 
      v-model="showAddEditDialog" 
      :category-item="selectedCategory" 
      @success="handleSuccess" 
    />
    
    <delete-confirm-dialog 
      v-model="showDeleteDialog" 
      :item-name="selectedCategory?.category_name"
      @confirm="handleDelete" 
    />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'
import { useNotification } from '@/composables/useNotification'
import CategoryFormDialog from '@/components/dialogs/CategoryFormDialog.vue'
import DeleteConfirmDialog from '@/components/dialogs/DeleteConfirmDialog.vue'
import BaseStatCard from '@/components/base/BaseStatCard.vue'

const categoryStore = useCategoryStore()
const { success, error } = useNotification()

const page = ref(1)
const itemsPerPage = ref(15)
const searchQuery = ref('')

const showAddEditDialog = ref(false)
const selectedCategory = ref(null)
const showDeleteDialog = ref(false)

const categories = computed(() => categoryStore.categories || [])

const totalPages = computed(() => {
  const total = categoryStore.totalCategories || 0
  return Math.ceil(total / itemsPerPage.value) || 1
})

const loadCategories = async () => {
  try {
    await categoryStore.fetchCategories({
      page: page.value,
      pageSize: itemsPerPage.value,
      search: searchQuery.value
    })
  } catch (err) {
    console.error('Error loading categories:', err)
    error('Failed to load categories. Please try again.')
  }
}

const onSearch = async () => {
  page.value = 1
  await loadCategories()
}

const onPageChange = async () => {
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
    success('Category deleted successfully!')
    await loadCategories()
  } catch (err) {
    console.error('Error deleting category:', err)
    error(
      err?.response?.data?.message || 
      err?.message || 
      'Failed to delete category. Please try again.'
    )
  }
}

const handleSuccess = async () => {
  try {
    showAddEditDialog.value = false
    await loadCategories()
  } catch (err) {
    console.error('Error refreshing categories:', err)
    error('Failed to refresh categories list.')
  }
}

onMounted(() => loadCategories())
</script>

<style scoped>
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
  min-height: 46px;
  padding: 0 24px;
  text-transform: none;
  letter-spacing: 0.5px;
}

/* Main Card */
.main-card {
  border: 1px solid #e8edf2;
  border-radius: 16px;
  background: white;
  overflow: hidden;
}

/* Table Header */
.table-header {
  background: #f8f9fa;
  border-bottom: 2px solid #e8edf2;
}

/* Table Body */
.table-body {
  background: white;
}

.table-row {
  transition: all 0.2s ease;
  cursor: pointer;
}

.table-row:hover {
  background: #f7f9fc;
}

.table-row.border-bottom {
  border-bottom: 1px solid #f0f3f7;
}

/* Category Icon */
.category-icon {
  flex-shrink: 0;
}

.category-name {
  color: #1e293b;
  line-height: 1.4;
}

/* Action Buttons */
.action-btn {
  min-width: 36px !important;
  height: 36px;
  border-radius: 8px;
  text-transform: none;
  font-size: 0.875rem;
}

.action-btn :deep(.v-icon) {
  margin: 0 !important;
}

/* Responsive */
@media (max-width: 959px) {
  .table-row {
    padding: 8px 0;
  }
}

@media (max-width: 599px) {
  .search-btn {
    min-width: 46px;
    width: 46px;
    padding: 0;
  }
  
  .search-btn span {
    display: none;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.table-row {
  animation: fadeIn 0.3s ease-out;
}
</style>
