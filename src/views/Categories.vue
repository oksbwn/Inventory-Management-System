<template>
  <v-container fluid class="pa-6">
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-3">
          <div>
            <div class="d-flex align-center ga-3 mb-2">
              <v-avatar size="40" color="primary" variant="tonal">
                <v-icon size="24">mdi-shape</v-icon>
              </v-avatar>
              <div>
                <h1 class="text-h5 font-weight-bold mb-0">Categories</h1>
                <p class="text-caption text-medium-emphasis mb-0">
                  {{ categoryMetaStore.totalCategories }} total categories
                </p>
              </div>
            </div>
          </div>
          <v-btn color="primary" prepend-icon="mdi-plus" elevation="2" @click="openAddDialog">
            Add Category
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Metadata Cards -->
    <v-row class="mb-6">
      <v-col cols="6" sm="2">
        <v-card class="metadata-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon size="35" color="primary">mdi-format-list-bulleted</v-icon>
            <div class="text-h6 font-weight-bold mt-1">{{ categoryMetaStore.totalCategories }}</div>
            <div class="caption">Categories</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="2">
        <v-card class="metadata-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon size="35" color="success">mdi-check-circle</v-icon>
            <div class="text-h6 font-weight-bold mt-1">{{ categoryMetaStore.activeCategories }}</div>
            <div class="caption">Active</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="2">
        <v-card class="metadata-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon size="35" color="grey">mdi-package-variant-closed</v-icon>
            <div class="text-h6 font-weight-bold mt-1">{{ categoryMetaStore.emptyCategories }}</div>
            <div class="caption">Empty</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card class="metadata-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon size="35" color="blue">mdi-database</v-icon>
            <div class="text-h6 font-weight-bold mt-1">{{ categoryMetaStore.totalComponents }}</div>
            <div class="caption">Components</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card class="metadata-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon size="35" color="orange">mdi-trending-up</v-icon>
            <div class="text-h6 font-weight-bold mt-1">{{ categoryMetaStore.recentAdditions }}</div>
            <div class="caption">New (30d)</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filter Bar and View Toggle -->
    <v-row class="mb-5" align="center">
      <v-col cols="12" md="8">
        <v-text-field v-model="searchQuery" label="Search categories" prepend-inner-icon="mdi-magnify" clearable
          density="comfortable" outlined @keyup.enter="onSearch" @click:clear="onSearch" />
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end">
        <v-btn :color="viewMode === 'grid' ? 'primary' : ''" icon @click="viewMode = 'grid'">
          <v-icon>mdi-view-grid</v-icon>
        </v-btn>
        <v-btn :color="viewMode === 'list' ? 'primary' : ''" icon @click="viewMode = 'list'">
          <v-icon>mdi-view-list</v-icon>
        </v-btn>
        <v-btn icon @click="refreshData" :loading="categoryStore.loading">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Main Card -->
    <v-card elevation="1" class="pa-4">
      <!-- Loading State -->
      <v-row v-if="categoryStore.loading && categories.length === 0" justify="center">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate size="48" color="primary" />
          <div class="mt-3">Loading categories...</div>
        </v-col>
      </v-row>

      <!-- Empty -->
      <v-row v-else-if="categories.length === 0">
        <v-col cols="12" class="text-center">
          <v-icon size="80" color="grey lighten-2">mdi-shape-outline</v-icon>
          <div class="mt-3">No categories found</div>
          <v-btn color="primary" class="mt-3" @click="openAddDialog" prepend-icon="mdi-plus">
            Add Category
          </v-btn>
        </v-col>
      </v-row>

      <!-- Grid View -->
      <v-row v-else-if="viewMode === 'grid'">
        <v-col v-for="category in categories" :key="category.category_id" cols="12" sm="6" md="4" lg="3">
          <v-card elevation="2" class="category-card" hover>
            <v-card-text>
              <div class="d-flex align-center mb-3">
                <v-avatar color="primary" size="48" class="mr-3">
                  <v-icon size="28" color="white">mdi-shape</v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">{{ category.category_name }}</div>
                  <v-chip :color="category.component_count > 0 ? 'success' : 'grey'" size="small" class="mt-1" flat>
                    {{ category.component_count || 0 }} items
                  </v-chip>
                </div>
              </div>
              <div class="caption mb-1">
                <v-icon size="16" color="green" v-if="category.recent_additions > 0">mdi-plus-circle</v-icon>
                {{ category.recent_additions || 0 }} new (last 30d)
              </div>
              <div class="caption" v-if="category.first_component_date">Added since: {{
                formatDate(category.first_component_date) }}</div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" class="action-btn" variant="flat" icon size="large" @click="editItem(category)">
                <v-icon size="22">mdi-pencil</v-icon>
              </v-btn>
              <v-btn color="error" class="action-btn" variant="flat" icon size="large" @click="deleteItem(category)">
                <v-icon size="22">mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- List View -->
      <v-list v-else>
        <v-list-item v-for="category in categories" :key="category.category_id" class="category-list-item px-2 py-2">
          <template #prepend>
            <v-avatar color="primary" size="48" class="mr-4">
              <v-icon size="28" color="white">mdi-shape</v-icon>
            </v-avatar>
          </template>
          <v-list-item-title>
            <span class="font-weight-bold">{{ category.category_name }}</span>
          </v-list-item-title>
          <v-list-item-subtitle>
            <v-chip :color="category.component_count > 0 ? 'success' : 'grey'" size="small" flat class="mr-2">
              {{ category.component_count || 0 }} items
            </v-chip>
            <span v-if="category.recent_additions > 0" class="caption green--text">+{{ category.recent_additions }}
              new</span>
          </v-list-item-subtitle>
          <template #append>
            <v-btn color="primary" class="action-btn" variant="flat" icon size="large" @click="editItem(category)">
              <v-icon size="22">mdi-pencil</v-icon>
            </v-btn>
            <v-btn color="error" class="action-btn" variant="flat" icon size="large" @click="deleteItem(category)">
              <v-icon size="22">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>

      <!-- Pagination -->
      <v-row justify="center" v-if="totalPages > 1">
        <v-pagination v-model="page" :length="totalPages" @update:model-value="onPageChange" :total-visible="7" />
      </v-row>
    </v-card>

    <!-- Dialogs -->
    <category-form-dialog v-model="showAddEditDialog" :category-item="selectedCategory" @success="handleSuccess" />
    <delete-confirm-dialog v-model="showDeleteDialog" :item-name="selectedCategory?.category_name"
      @confirm="handleDelete" />

    <!-- Notifications -->
    <v-snackbar v-model="showSuccessSnackbar" color="success" :timeout="3000" top right>
      <v-icon left>mdi-check-circle</v-icon> {{ successMessage }}
    </v-snackbar>
    <v-snackbar v-model="showError" color="error" :timeout="5000" top right>
      <v-icon left>mdi-alert-circle</v-icon> {{ categoryStore.error }}
      <template v-slot:actions>
        <v-btn text @click="showError = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'
import { useCategoryMetaStore } from '@/stores/categoryMetaStore'
import CategoryFormDialog from '@/components/CategoryFormDialog.vue'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue'

const categoryStore = useCategoryStore()
const categoryMetaStore = useCategoryMetaStore()

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
  // Use metadata for pagination count!
  const total = categoryMetaStore.totalCategories || 0
  return Math.ceil(total / itemsPerPage.value) || 1
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

const loadCategories = async () => {
  try {
    await categoryStore.fetchCategories({
      page: page.value,
      pageSize: itemsPerPage.value,
      search: searchQuery.value
    })
    // Now metadata is always refreshed with category list
    await categoryMetaStore.fetchMetadata()
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
  refreshData();
}

const handleDelete = async () => {
  try {
    await categoryStore.deleteCategory(selectedCategory.value.category_id)
    showDeleteDialog.value = false
    successMessage.value = 'Category deleted successfully'
    showSuccessSnackbar.value = true
    await loadCategories()
  } catch (error) {
    console.log(error);
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
.metadata-card {
  text-align: center;
  border-radius: 12px;
  min-height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metadata-card .v-icon {
  font-size: 32px;
  margin-bottom: 5px;
}

.category-card {
  cursor: pointer;
  transition: box-shadow 0.3s, border-color 0.3s;
  border-radius: 12px;
  border: 1.2px solid #e3e6ed;
}

.category-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.11);
  border-color: #1976d2;
}

.category-list-item {
  border-radius: 6px;
  border: 1px solid #ececec;
  margin-bottom: 8px;
  transition: background 0.18s;
}

.category-list-item:hover {
  background-color: #f3f8fa;
}

.action-btn {
  margin-right: 6px;
  background-color: #f2f4ff !important;
  color: #1976d2 !important;
  border-radius: 8px !important;
  padding: 5px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: background-color 0.2s, box-shadow 0.2s;
}

.action-btn:last-child {
  margin-right: 0;
}

.action-btn[aria-pressed='true'],
.action-btn:hover {
  background-color: #e3e0fa !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.10) !important;
}
</style>
