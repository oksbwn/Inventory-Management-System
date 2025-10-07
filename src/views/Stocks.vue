<template>
  <v-container fluid class="pa-6">
    <!-- Page Header with Stats -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-primary mb-1">
              <v-icon size="32" class="mr-2">mdi-cube-outline</v-icon>
              Stock Management
            </h1>
            <p class="text-body-2 text-medium-emphasis ml-11">
              Monitor and manage your inventory in real-time
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
            Add New Stock
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Quick Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="6" sm="3">
        <v-card class="stat-card" elevation="0" color="blue-lighten-5">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-blue-darken-2 mb-1">Total Items</div>
                <div class="text-h5 font-weight-bold text-blue-darken-3">
                  {{ stockStore.totalItems || 0 }}
                </div>
              </div>
              <v-avatar size="48" color="blue-lighten-4">
                <v-icon color="blue-darken-2" size="28">mdi-package-variant</v-icon>
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
                <div class="text-caption text-green-darken-2 mb-1">In Stock</div>
                <div class="text-h5 font-weight-bold text-green-darken-3">
                  {{ inStockCount }}
                </div>
              </div>
              <v-avatar size="48" color="green-lighten-4">
                <v-icon color="green-darken-2" size="28">mdi-check-circle</v-icon>
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
                <div class="text-caption text-orange-darken-2 mb-1">Low Stock</div>
                <div class="text-h5 font-weight-bold text-orange-darken-3">
                  {{ lowStockCount }}
                </div>
              </div>
              <v-avatar size="48" color="orange-lighten-4">
                <v-icon color="orange-darken-2" size="28">mdi-alert</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" sm="3">
        <v-card class="stat-card" elevation="0" color="red-lighten-5">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-red-darken-2 mb-1">Out of Stock</div>
                <div class="text-h5 font-weight-bold text-red-darken-3">
                  {{ outOfStockCount }}
                </div>
              </div>
              <v-avatar size="48" color="red-lighten-4">
                <v-icon color="red-darken-2" size="28">mdi-close-circle</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Data Table Card -->
    <v-card elevation="2" class="rounded-lg">
      <!-- Enhanced Toolbar -->
      <v-card-title class="pa-6 pb-4">
        <v-row dense align="center">
          <v-col cols="12" md="7">
            <v-text-field
              v-model="searchQuery"
              density="comfortable"
              placeholder="Search by name, category, location..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              clearable
              class="search-input"
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
              :color="stockStore.isCacheValid ? 'success' : 'grey'"
              variant="tonal"
              size="small"
              class="mr-3"
            >
              <v-icon start size="small">mdi-database</v-icon>
              {{ stockStore.isCacheValid ? 'Cached' : 'Live Data' }}
            </v-chip>

            <v-btn-group variant="outlined" density="comfortable">
              <v-btn @click="refreshData" :loading="stockStore.loading">
                <v-icon>mdi-refresh</v-icon>
                <v-tooltip activator="parent" location="top">Refresh Data</v-tooltip>
              </v-btn>
              <v-btn>
                <v-icon>mdi-filter-variant</v-icon>
                <v-tooltip activator="parent" location="top">Advanced Filters</v-tooltip>
              </v-btn>
              <v-btn>
                <v-icon>mdi-download</v-icon>
                <v-tooltip activator="parent" location="top">Export to CSV</v-tooltip>
              </v-btn>
            </v-btn-group>
          </v-col>
        </v-row>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Data Table with Enhanced Styling -->
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        v-model:sort-by="sortBy"
        :headers="headers"
        :items="stockStore.stocks"
        :items-length="stockStore.totalItems"
        :loading="stockStore.loading"
        :search="searchQuery"
        item-value="id"
        @update:options="loadStocks"
        class="elevation-0 professional-table"
        loading-text="Loading stocks... Please wait"
        no-data-text="No stocks found"
        hover
      >
        <!-- ID Column -->
        <template v-slot:item.id="{ item }">
          <span class="id-badge font-weight-medium">#{{ item.id }}</span>
        </template>

        <!-- Name Column with Icon -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="40" color="primary-lighten-5" class="mr-3">
              <v-icon color="primary" size="20">mdi-package-variant</v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-medium text-body-1">{{ item.name }}</div>
              <div class="text-caption text-medium-emphasis">
                SKU: {{ item.sku || 'N/A' }}
              </div>
            </div>
          </div>
        </template>

        <!-- Category Column -->
        <template v-slot:item.category="{ item }">
          <v-chip size="small" variant="tonal" color="primary">
            {{ item.category }}
          </v-chip>
        </template>

        <!-- Quantity Column with Color Coding -->
        <template v-slot:item.quantity="{ item }">
          <v-chip
            :color="getQuantityColor(item.quantity)"
            size="small"
            variant="flat"
            class="font-weight-bold"
          >
            <v-icon start size="x-small">
              {{ getQuantityIcon(item.quantity) }}
            </v-icon>
            {{ item.quantity }}
          </v-chip>
        </template>

        <!-- Price Column -->
        <template v-slot:item.price="{ item }">
          <span class="font-weight-medium">{{ formatPrice(item.price) }}</span>
        </template>

        <!-- Status Column -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="item.status === 'In Stock' ? 'success' : 'error'"
            size="small"
            variant="flat"
          >
            <v-icon start size="x-small">
              {{ item.status === 'In Stock' ? 'mdi-check-circle' : 'mdi-alert-circle' }}
            </v-icon>
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Location Column -->
        <template v-slot:item.location="{ item }">
          <div class="d-flex align-center">
            <v-icon size="small" class="mr-2" color="grey">mdi-map-marker</v-icon>
            <span class="text-body-2">{{ item.location }}</span>
          </div>
        </template>

        <!-- Actions Column -->
        <template v-slot:item.actions="{ item }">
          <div class="action-buttons">
            <v-btn
              icon
              variant="text"
              size="small"
              color="info"
              @click="viewItem(item)"
            >
              <v-icon size="20">mdi-eye-outline</v-icon>
              <v-tooltip activator="parent" location="top">View Details</v-tooltip>
            </v-btn>
            <v-btn
              icon
              variant="text"
              size="small"
              color="primary"
              @click="editItem(item)"
            >
              <v-icon size="20">mdi-pencil-outline</v-icon>
              <v-tooltip activator="parent" location="top">Edit Item</v-tooltip>
            </v-btn>
            <v-btn
              icon
              variant="text"
              size="small"
              color="error"
              @click="deleteItem(item)"
            >
              <v-icon size="20">mdi-delete-outline</v-icon>
              <v-tooltip activator="parent" location="top">Delete Item</v-tooltip>
            </v-btn>
          </div>
        </template>
      </v-data-table-server>
    </v-card>

    <!-- Stock Form Dialog -->
    <stock-form-dialog
      v-model="showFormDialog"
      :stock-item="selectedStock"
      @success="handleFormSuccess"
    />

    <!-- Delete Confirmation Dialog -->
    <delete-confirm-dialog
      v-model="showDeleteDialog"
      :item-name="selectedStock?.name"
      @confirm="handleDeleteConfirm"
    />

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccessSnackbar"
      :timeout="3000"
      color="success"
      location="top right"
      variant="elevated"
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
      variant="elevated"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-3">mdi-alert-circle</v-icon>
        <span>{{ stockStore.error }}</span>
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="showError = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStockStore } from '@/stores/stockStore'
import StockFormDialog from '@/components/StockFormDialog.vue'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue'

const stockStore = useStockStore()

// Table state
const page = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref([])
const searchQuery = ref('')
const showError = ref(false)

// Dialog state
const showFormDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedStock = ref(null)
const successMessage = ref('')
const showSuccessSnackbar = ref(false)

// Enhanced table headers
const headers = ref([
  { title: 'ID', key: 'id', align: 'start', sortable: true, width: '80px' },
  { title: 'Product Name', key: 'name', align: 'start', sortable: true },
  { title: 'Category', key: 'category', align: 'start', sortable: true, width: '150px' },
  { title: 'Quantity', key: 'quantity', align: 'center', sortable: true, width: '120px' },
  { title: 'Unit Price', key: 'price', align: 'end', sortable: true, width: '120px' },
  { title: 'Status', key: 'status', align: 'center', sortable: true, width: '130px' },
  { title: 'Location', key: 'location', align: 'start', sortable: false, width: '180px' },
  { title: 'Actions', key: 'actions', align: 'center', sortable: false, width: '150px' },
])

// Computed stats
const inStockCount = computed(() => {
  return stockStore.stocks.filter(item => item.status === 'In Stock').length
})

const lowStockCount = computed(() => {
  return stockStore.stocks.filter(item => item.quantity > 0 && item.quantity < 10).length
})

const outOfStockCount = computed(() => {
  return stockStore.stocks.filter(item => item.quantity === 0).length
})

// Load stocks function
const loadStocks = async ({ page: p, itemsPerPage: ipp, sortBy: sb }) => {
  try {
    await stockStore.fetchStocks({
      page: p,
      itemsPerPage: ipp,
      sortBy: sb,
      search: searchQuery.value
    })
  } catch (error) {
    console.error('Failed to load stocks:', error)
    showError.value = true
  }
}

// Search function
const onSearch = async () => {
  page.value = 1
  await loadStocks({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value
  })
}

// Refresh data
const refreshData = async () => {
  stockStore.clearCache()
  await loadStocks({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value
  })
}

// Helper functions
const getQuantityColor = (quantity) => {
  if (quantity === 0) return 'error'
  if (quantity < 10) return 'warning'
  if (quantity < 50) return 'info'
  return 'success'
}

const getQuantityIcon = (quantity) => {
  if (quantity === 0) return 'mdi-close-circle'
  if (quantity < 10) return 'mdi-alert'
  return 'mdi-check-circle'
}

const formatPrice = (price) => {
  return price ? `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'
}

// CRUD Action handlers
const openAddDialog = () => {
  selectedStock.value = null
  showFormDialog.value = true
}

const viewItem = (item) => {
  console.log('View item:', item)
  // TODO: Navigate to detail page or open view dialog
}

const editItem = (item) => {
  selectedStock.value = { ...item }
  showFormDialog.value = true
}

const deleteItem = (item) => {
  selectedStock.value = item
  showDeleteDialog.value = true
}

const handleDeleteConfirm = async () => {
  try {
    await stockStore.deleteStock(selectedStock.value.id)
    showDeleteDialog.value = false
    successMessage.value = 'Stock deleted successfully!'
    showSuccessSnackbar.value = true
    await refreshData()
  } catch (error) {
    console.error('Failed to delete stock:', error)
    showError.value = true
  }
}

const handleFormSuccess = async (data) => {
  successMessage.value = data.message
  showSuccessSnackbar.value = true
  await refreshData()
}

// Watch for error changes
watch(() => stockStore.error, (newError) => {
  if (newError) {
    showError.value = true
  }
})

// Load data on mount
onMounted(() => {
  loadStocks({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value
  })
})
</script>

<style scoped>
/* Stats Cards */
.stat-card {
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

/* Search Input */
.search-input {
  border-radius: 8px;
}

/* Professional Table Styling */
.professional-table {
  font-size: 0.875rem;
}

.professional-table :deep(thead th) {
  background-color: rgb(var(--v-theme-surface-variant)) !important;
  font-weight: 600 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.75rem;
  padding: 16px 12px !important;
}

.professional-table :deep(tbody tr) {
  transition: background-color 0.2s ease;
}

.professional-table :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.03) !important;
}

.professional-table :deep(tbody td) {
  padding: 12px !important;
}

/* ID Badge */
.id-badge {
  display: inline-block;
  padding: 4px 12px;
  background-color: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
  border-radius: 16px;
  font-size: 0.813rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 4px;
  justify-content: center;
}

/* Smooth Transitions */
.v-card,
.v-btn,
.v-chip {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover Effects */
.v-btn:hover {
  transform: scale(1.05);
}
</style>
