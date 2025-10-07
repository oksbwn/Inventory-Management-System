<template>
  <v-container fluid class="pa-6">
    <!-- Page Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-primary mb-1">
              <v-icon size="32" class="mr-2">mdi-shape</v-icon>
              Categories
            </h1>
            <p class="text-body-2 text-medium-emphasis ml-11">
              Organize your inventory with categories
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
            Add Category
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="6" sm="4">
        <v-card class="stat-card" elevation="0" color="purple-lighten-5">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-purple-darken-2 mb-1">Total Categories</div>
                <div class="text-h5 font-weight-bold text-purple-darken-3">
                  {{ categoryStore.totalItems || 0 }}
                </div>
              </div>
              <v-avatar size="48" color="purple-lighten-4">
                <v-icon color="purple-darken-2" size="28">mdi-shape-outline</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" sm="4">
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
                <v-icon color="green-darken-2" size="28">mdi-check-circle</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="stat-card" elevation="0" color="grey-lighten-4">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey-darken-2 mb-1">Inactive</div>
                <div class="text-h5 font-weight-bold text-grey-darken-3">
                  {{ inactiveCount }}
                </div>
              </div>
              <v-avatar size="48" color="grey-lighten-3">
                <v-icon color="grey-darken-2" size="28">mdi-close-circle</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Categories Grid -->
    <v-card elevation="2" class="rounded-lg">
      <v-card-title class="pa-6 pb-4">
        <v-row dense align="center">
          <v-col cols="12" md="7">
            <v-text-field
              v-model="searchQuery"
              density="comfortable"
              placeholder="Search categories..."
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

          <v-col cols="12" md="5" class="d-flex justify-end">
            <v-btn-group variant="outlined" density="comfortable">
              <v-btn @click="refreshData" :loading="categoryStore.loading">
                <v-icon>mdi-refresh</v-icon>
                <v-tooltip activator="parent" location="top">Refresh</v-tooltip>
              </v-btn>
              <v-btn @click="viewMode = 'grid'" :variant="viewMode === 'grid' ? 'flat' : 'outlined'">
                <v-icon>mdi-view-grid</v-icon>
                <v-tooltip activator="parent" location="top">Grid View</v-tooltip>
              </v-btn>
              <v-btn @click="viewMode = 'list'" :variant="viewMode === 'list' ? 'flat' : 'outlined'">
                <v-icon>mdi-view-list</v-icon>
                <v-tooltip activator="parent" location="top">List View</v-tooltip>
              </v-btn>
            </v-btn-group>
          </v-col>
        </v-row>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="pa-6">
        <v-row v-if="categoryStore.loading && categoryStore.categories.length === 0">
          <v-col cols="12" class="text-center pa-12">
            <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
            <p class="mt-4 text-medium-emphasis">Loading categories...</p>
          </v-col>
        </v-row>

        <v-row v-else-if="!categoryStore.loading && categoryStore.categories.length === 0">
          <v-col cols="12" class="text-center pa-12">
            <v-icon size="80" color="grey-lighten-1">mdi-shape-outline</v-icon>
            <p class="mt-4 text-h6 text-medium-emphasis">No categories found</p>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col 
            v-for="category in categoryStore.categories" 
            :key="category.id"
            cols="12" 
            sm="6" 
            md="4" 
            lg="3"
          >
            <v-card class="category-card" elevation="1" hover>
              <v-card-text class="pa-5">
                <div class="d-flex align-center mb-3">
                  <v-avatar :color="category.color || 'primary'" size="48" class="mr-3">
                    <v-icon color="white" size="28">{{ category.icon || 'mdi-shape' }}</v-icon>
                  </v-avatar>
                  <div class="flex-grow-1">
                    <h3 class="text-h6 font-weight-bold">{{ category.name }}</h3>
                    <v-chip 
                      :color="category.isActive ? 'success' : 'grey'" 
                      size="x-small" 
                      variant="flat"
                      class="mt-1"
                    >
                      {{ category.isActive ? 'Active' : 'Inactive' }}
                    </v-chip>
                  </div>
                </div>

                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{ category.description || 'No description' }}
                </p>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions class="pa-3">
                <v-spacer></v-spacer>
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  color="primary"
                  @click="editItem(category)"
                >
                  <v-icon size="20">mdi-pencil-outline</v-icon>
                  <v-tooltip activator="parent">Edit</v-tooltip>
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  color="error"
                  @click="deleteItem(category)"
                >
                  <v-icon size="20">mdi-delete-outline</v-icon>
                  <v-tooltip activator="parent">Delete</v-tooltip>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- List View -->
      <v-list v-else class="pa-4">
        <v-list-item
          v-for="category in categoryStore.categories"
          :key="category.id"
          class="mb-2 rounded"
        >
          <template v-slot:prepend>
            <v-avatar :color="category.color || 'primary'" size="56">
              <v-icon color="white" size="32">{{ category.icon || 'mdi-shape' }}</v-icon>
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-bold">
            {{ category.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ category.description || 'No description' }}
          </v-list-item-subtitle>

          <template v-slot:append>
            <v-chip 
              :color="category.isActive ? 'success' : 'grey'" 
              size="small" 
              class="mr-4"
            >
              {{ category.isActive ? 'Active' : 'Inactive' }}
            </v-chip>
            <v-btn
              icon
              variant="text"
              size="small"
              color="primary"
              @click="editItem(category)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              size="small"
              color="error"
              @click="deleteItem(category)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>

      <!-- Pagination -->
      <v-divider></v-divider>
      <v-card-actions class="justify-center pa-4">
        <v-pagination
          v-model="page"
          :length="totalPages"
          :total-visible="7"
          rounded="circle"
          @update:model-value="onPageChange"
        ></v-pagination>
      </v-card-actions>
    </v-card>

    <!-- Category Form Dialog -->
    <category-form-dialog
      v-model="showFormDialog"
      :category-item="selectedCategory"
      @success="handleFormSuccess"
    />

    <!-- Delete Confirmation Dialog -->
    <delete-confirm-dialog
      v-model="showDeleteDialog"
      :item-name="selectedCategory?.name"
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
        {{ categoryStore.error }}
      </div>
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
const showError = ref(false)
const viewMode = ref('grid')

const showFormDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedCategory = ref(null)
const successMessage = ref('')
const showSuccessSnackbar = ref(false)

const activeCount = computed(() => {
  return categoryStore.categories.filter(c => c.isActive).length
})

const inactiveCount = computed(() => {
  return categoryStore.categories.filter(c => !c.isActive).length
})

const totalPages = computed(() => {
  return Math.ceil(categoryStore.totalItems / itemsPerPage.value) || 1
})

const loadCategories = async () => {
  try {
    await categoryStore.fetchCategories({
      page: page.value,
      itemsPerPage: itemsPerPage.value,
      search: searchQuery.value
    })
  } catch (error) {
    console.error('Failed to load categories:', error)
    showError.value = true
  }
}

const onSearch = async () => {
  page.value = 1
  await loadCategories()
}

const refreshData = async () => {
  categoryStore.clearCache()
  await loadCategories()
}

const onPageChange = async () => {
  await loadCategories()
}

const openAddDialog = () => {
  selectedCategory.value = null
  showFormDialog.value = true
}

const editItem = (item) => {
  selectedCategory.value = { ...item }
  showFormDialog.value = true
}

const deleteItem = (item) => {
  selectedCategory.value = item
  showDeleteDialog.value = true
}

const handleDeleteConfirm = async () => {
  try {
    await categoryStore.deleteCategory(selectedCategory.value.id)
    showDeleteDialog.value = false
    successMessage.value = 'Category deleted successfully!'
    showSuccessSnackbar.value = true
    await refreshData()
  } catch (error) {
    console.error('Failed to delete category:', error)
    showError.value = true
  }
}

const handleFormSuccess = async (data) => {
  successMessage.value = data.message
  showSuccessSnackbar.value = true
  await refreshData()
}

watch(() => categoryStore.error, (newError) => {
  if (newError) {
    showError.value = true
  }
})

onMounted(() => {
  loadCategories()
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

.category-card {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 12px;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}
</style>
