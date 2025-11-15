<template>
  <v-container fluid class="pa-6 categories-page">
    <!-- Page Header -->
    <v-row class="mb-8">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-4">
          <div class="d-flex align-center ga-3">
            <v-avatar size="48" color="primary" class="header-avatar">
              <v-icon size="28">mdi-shape</v-icon>
            </v-avatar>
            <div>
              <h1 class="text-h4 font-weight-bold mb-1">Categories</h1>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Manage {{ categoryStore.totalCategories || 0 }} categories
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
    <v-row class="mb-8" dense>
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

    <!-- Search and View Controls -->
    <v-row class="mb-6" align="center">
      <v-col cols="12" md="8">
        <div class="search-wrapper">
          <v-text-field 
            v-model="searchQuery" 
            placeholder="Search categories..." 
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
        description="Get started by adding your first category"
        :action-button="true"
        action-text="Add Your First Category"
        @action="openAddDialog"
      />

      <!-- Grid View - Using BaseCard ✅ -->
      <v-row v-else-if="viewMode === 'grid'" class="pa-4">
        <v-col v-for="category in categories" :key="category.category_id" cols="12" sm="6" md="4" lg="3">
          <BaseCard variant="default" elevation="0" class="category-card">
            <div class="pa-4 text-center">
              <v-avatar color="primary" size="72" variant="tonal" class="category-avatar mx-auto mb-3">
                <v-icon size="36">mdi-shape</v-icon>
              </v-avatar>

              <h3 class="text-h6 font-weight-bold mb-2 text-truncate">
                {{ category.category_name }}
              </h3>

              <v-chip 
                :color="category.component_count > 0 ? 'success' : 'grey'" 
                size="small" 
                variant="tonal"
                class="mb-2"
              >
                <v-icon size="14" class="mr-1">mdi-package-variant</v-icon>
                {{ category.component_count || 0 }} items
              </v-chip>
            </div>

            <template #actions>
              <div class="w-100 d-flex ga-2 pa-3">
                <BaseButton 
                  variant="tonal" 
                  color="primary" 
                  size="small"
                  @click="editItem(category)" 
                  class="flex-grow-1 action-btn-compact"
                >
                  <v-icon size="16" class="mr-1">mdi-pencil</v-icon>
                  Edit
                </BaseButton>
                <BaseButton 
                  variant="tonal" 
                  color="error" 
                  size="small"
                  @click="deleteItem(category)" 
                  class="flex-grow-1 action-btn-compact"
                >
                  <v-icon size="16" class="mr-1">mdi-delete</v-icon>
                  Delete
                </BaseButton>
              </div>
            </template>
          </BaseCard>
        </v-col>
      </v-row>

      <!-- List View - Using BaseCard ✅ -->
      <div v-else class="pa-4">
        <BaseCard 
          v-for="category in categories" 
          :key="category.category_id" 
          variant="default" 
          elevation="0" 
          class="category-list-card mb-3"
        >
          <div class="pa-4 d-flex align-center justify-space-between flex-wrap ga-3">
            <!-- Left: Avatar + Info -->
            <div class="d-flex align-center ga-3 flex-grow-1 min-width-0">
              <v-avatar color="primary" size="56" variant="tonal">
                <v-icon size="28">mdi-shape</v-icon>
              </v-avatar>
              
              <div class="flex-grow-1 min-width-0">
                <h3 class="text-subtitle-1 font-weight-bold mb-1 text-truncate">
                  {{ category.category_name }}
                </h3>
                <v-chip 
                  :color="category.component_count > 0 ? 'success' : 'grey'" 
                  size="small" 
                  variant="tonal"
                >
                  {{ category.component_count || 0 }} items
                </v-chip>
              </div>
            </div>

            <!-- Right: Actions -->
            <div class="d-flex ga-2 flex-shrink-0">
              <BaseButton 
                variant="tonal" 
                color="primary" 
                size="small"
                class="action-btn-square-list"
                @click="editItem(category)"
                aria-label="Edit category"
              >
                <v-icon>mdi-pencil</v-icon>
              </BaseButton>
              <BaseButton 
                variant="tonal" 
                color="error" 
                size="small"
                class="action-btn-square-list"
                @click="deleteItem(category)"
                aria-label="Delete category"
              >
                <v-icon>mdi-delete</v-icon>
              </BaseButton>
            </div>
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

    <!-- Notifications -->
    <BaseSnackbar 
      v-model="showSuccessSnackbar" 
      :message="successMessage" 
      type="success" 
      :timeout="3000"
    />
    
    <BaseSnackbar 
      v-model="showError" 
      :message="categoryStore.error || 'An error occurred'" 
      type="error" 
      :timeout="5000"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'
import CategoryFormDialog from '@/components/dialogs/CategoryFormDialog.vue'
import DeleteConfirmDialog from '@/components/dialogs/DeleteConfirmDialog.vue'
import BaseStatCard from '@/components/base/BaseStatCard.vue'

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
    showError.value = true
  }
}

const handleSuccess = async ({ message }) => {
  try {
    successMessage.value = message || 'Operation completed successfully'
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

/* Category Card - Grid View */
.category-card {
  border: 1px solid #e8edf2;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
}

.category-avatar {
  border: 2px solid #f0f3f7;
  transition: all 0.3s ease;
}

.category-card:hover .category-avatar {
  border-color: #667eea;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.2);
}

/* Action Buttons - Grid View */
.action-btn-compact {
  min-width: auto !important;
  height: 34px !important;
  padding: 0 10px !important;
  border-radius: 6px;
  text-transform: none;
  font-size: 0.85rem;
  flex: 1;
}

.action-btn-compact :deep(.v-icon) {
  margin: 0 !important;
  opacity: 1 !important;
}

/* Action Buttons - List View */
.action-btn-square-list {
  min-width: 32px !important;
  width: 32px;
  height: 32px;
  padding: 0 !important;
  border-radius: 6px;
}

.action-btn-square-list :deep(.v-icon) {
  margin: 0 !important;
  opacity: 1 !important;
}

/* Category List Card */
.category-list-card {
  border: 1px solid #e8edf2;
  border-radius: 12px;
  background: white;
  transition: all 0.3s ease;
}

.category-list-card:hover {
  background: #f7f9fc;
  border-color: #d0d7de;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
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

.category-card,
.category-list-card {
  animation: fadeIn 0.5s ease-out;
}
</style>
