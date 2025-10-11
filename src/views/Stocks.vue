<template>
  <v-container fluid class="pa-6">
    <!-- Compact Page Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-3">
          <div>
            <h1 class="text-h5 font-weight-bold mb-1">
              <v-icon size="28" class="mr-2" color="primary">mdi-cube-outline</v-icon>
              Stock Management
            </h1>
            <p class="text-body-2 text-medium-emphasis">
              Monitor and manage your inventory
            </p>
          </div>
          <v-btn
            color="primary"
            size="default"
            prepend-icon="mdi-plus"
            elevation="0"
            @click="openAddDialog"
          >
            Add Stock
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Compact Stats Cards -->
<!-- Beautiful Stats Cards -->
<v-row class="mb-4">
  <v-col cols="6" sm="3">
    <v-card class="stat-card-modern" elevation="0">
      <v-card-text class="pa-4">
        <div class="d-flex justify-space-between align-center mb-3">
          <div class="stat-icon-modern blue-modern">
            <v-icon color="blue" size="24">mdi-package-variant</v-icon>
          </div>
          <v-chip size="x-small" color="blue" variant="tonal">
            All
          </v-chip>
        </div>
        <div class="stat-value-modern text-blue-darken-2 mb-1">
          {{ stockStore.stockGist.total_items || 0 }}
        </div>
        <div class="stat-label-modern">Total Items</div>
        <div class="stat-progress">
          <v-progress-linear
            :model-value="100"
            color="blue"
            height="4"
            rounded
          ></v-progress-linear>
        </div>
      </v-card-text>
    </v-card>
  </v-col>

  <v-col cols="6" sm="3">
    <v-card class="stat-card-modern" elevation="0">
      <v-card-text class="pa-4">
        <div class="d-flex justify-space-between align-center mb-3">
          <div class="stat-icon-modern green-modern">
            <v-icon color="green" size="24">mdi-check-circle</v-icon>
          </div>
          <v-chip size="x-small" color="green" variant="tonal">
            Available
          </v-chip>
        </div>
        <div class="stat-value-modern text-green-darken-2 mb-1">
          {{ stockStore.stockGist.in_stock || 0 }}
        </div>
        <div class="stat-label-modern">In Stock</div>
        <div class="stat-progress">
          <v-progress-linear
            :model-value="stockStore.stockGist.total_items ? (stockStore.stockGist.in_stock / stockStore.stockGist.total_items * 100) : 0"
            color="green"
            height="4"
            rounded
          ></v-progress-linear>
        </div>
      </v-card-text>
    </v-card>
  </v-col>

  <v-col cols="6" sm="3">
    <v-card class="stat-card-modern" elevation="0">
      <v-card-text class="pa-4">
        <div class="d-flex justify-space-between align-center mb-3">
          <div class="stat-icon-modern orange-modern">
            <v-icon color="orange" size="24">mdi-alert</v-icon>
          </div>
          <v-chip size="x-small" color="orange" variant="tonal">
            Alert
          </v-chip>
        </div>
        <div class="stat-value-modern text-orange-darken-2 mb-1">
          {{ stockStore.stockGist.low_stock || 0 }}
        </div>
        <div class="stat-label-modern">Low Stock</div>
        <div class="stat-progress">
          <v-progress-linear
            :model-value="stockStore.stockGist.total_items ? (stockStore.stockGist.low_stock / stockStore.stockGist.total_items * 100) : 0"
            color="orange"
            height="4"
            rounded
          ></v-progress-linear>
        </div>
      </v-card-text>
    </v-card>
  </v-col>

  <v-col cols="6" sm="3">
    <v-card class="stat-card-modern" elevation="0">
      <v-card-text class="pa-4">
        <div class="d-flex justify-space-between align-center mb-3">
          <div class="stat-icon-modern red-modern">
            <v-icon color="red" size="24">mdi-close-circle</v-icon>
          </div>
          <v-chip size="x-small" color="red" variant="tonal">
            Empty
          </v-chip>
        </div>
        <div class="stat-value-modern text-red-darken-2 mb-1">
          {{ stockStore.stockGist.no_stock || 0 }}
        </div>
        <div class="stat-label-modern">Out of Stock</div>
        <div class="stat-progress">
          <v-progress-linear
            :model-value="stockStore.stockGist.total_items ? (stockStore.stockGist.no_stock / stockStore.stockGist.total_items * 100) : 0"
            color="red"
            height="4"
            rounded
          ></v-progress-linear>
        </div>
      </v-card-text>
    </v-card>
  </v-col>
</v-row>

    <!-- Compact Table Card -->
    <v-card elevation="0" class="table-card">
      <!-- Compact Toolbar -->
      <v-card-title class="pa-4 pb-3 bg-transparent">
        <v-row dense align="center">
          <v-col cols="12" md="7">
            <v-text-field
              v-model="searchQuery"
              density="compact"
              placeholder="Search by name, category, location..."
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
                  size="x-small"
                  elevation="0"
                  @click="onSearch"
                >
                  Search
                </v-btn>
              </template>
            </v-text-field>
          </v-col>

          <v-col cols="12" md="5" class="d-flex justify-end align-center flex-wrap ga-1">
            <v-chip
              :color="stockStore.isCacheValid ? 'success' : 'grey'"
              variant="tonal"
              size="x-small"
            >
              <v-icon start size="12">mdi-database</v-icon>
              {{ stockStore.isCacheValid ? 'Cached' : 'Live' }}
            </v-chip>

            <v-btn
              variant="tonal"
              size="x-small"
              icon="mdi-refresh"
              @click="refreshData"
              :loading="stockStore.loading"
            >
              <v-tooltip activator="parent">Refresh</v-tooltip>
            </v-btn>

            <v-btn
              variant="tonal"
              size="x-small"
              icon="mdi-filter-variant"
            >
              <v-tooltip activator="parent">Filters</v-tooltip>
            </v-btn>

            <v-btn
              variant="tonal"
              size="x-small"
              icon="mdi-download"
            >
              <v-tooltip activator="parent">Export</v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Compact Data Table -->
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        v-model:sort-by="sortBy"
        :headers="headers"
        :items="stockStore.stocks"
        :items-length="stockStore.totalItems"
        :loading="stockStore.loading"
        item-value="id"
        @update:options="loadStocks"
        class="compact-table"
        density="comfortable"
        hover
      >
        <!-- ID Column -->
        <template v-slot:item.id="{ item }">
          <span class="id-badge-compact">#{{ item.id }}</span>
        </template>

        <!-- Name Column with Image -->
        <template v-slot:item.name="{ item }">
          <div class="name-cell-compact">
            <v-avatar size="36" rounded="lg">
              <v-img v-if="item.filename" :src="item.filename" cover />
              <v-icon v-else size="20" color="grey-lighten-1">mdi-image-off</v-icon>
            </v-avatar>
            <span class="item-name-compact">{{ item.name }}</span>
          </div>
        </template>

        <!-- Category Column -->
        <template v-slot:item.category="{ item }">
          <v-chip size="x-small" variant="tonal" color="primary">
            {{ item.category_name }}
          </v-chip>
        </template>

        <!-- Quantity Column -->
        <template v-slot:item.quantity="{ item }">
          <v-chip
            :color="getQuantityColor(item.stock)"
            size="x-small"
            variant="flat"
          >
            <v-icon start size="14">
              {{ getQuantityIcon(item.stock) }}
            </v-icon>
            {{ item.stock }}
          </v-chip>
        </template>

        <!-- Price Column -->
        <template v-slot:item.price="{ item }">
          <span class="price-text-compact">{{ formatPrice(item.avg_unit_price) }}</span>
        </template>

        <!-- Status Column -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="x-small"
            variant="flat"
          >
            <v-icon start size="14">
              {{ getStatusIcon(item.status) }}
            </v-icon>
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Improved Location Column -->
        <template v-slot:item.location="{ item }">
          <v-chip
            size="x-small"
            variant="outlined"
            color="indigo"
            prepend-icon="mdi-package-variant"
          >
            {{ item.box_label || 'Unassigned' }}
          </v-chip>
        </template>

        <!-- Actions Column -->
<!-- Actions Column - Compact with smaller icons -->
<template v-slot:item.actions="{ item }">
  <div class="action-cell-compact-fixed">
    <v-btn
      size="x-small"
      variant="tonal"
      color="info"
      icon
      @click="viewItem(item)"
    >
      <v-icon size="16">mdi-eye-outline</v-icon>
      <v-tooltip activator="parent" location="top">View</v-tooltip>
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
        {{ stockStore.error }}
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="showError = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStockStore } from '@/stores/stockStore'
import StockFormDialog from '@/components/StockFormDialog.vue'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue'

const router = useRouter()
const stockStore = useStockStore()

const page = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref([])
const searchQuery = ref('')
const showError = ref(false)

const showFormDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedStock = ref(null)
const successMessage = ref('')
const showSuccessSnackbar = ref(false)

const headers = ref([
  { title: 'ID', key: 'id', align: 'start', sortable: true, width: '70px' },
  { title: 'Product Name', key: 'name', align: 'start', sortable: true },
  { title: 'Category', key: 'category', align: 'center', sortable: true, width: '140px' },
  { title: 'Qty', key: 'quantity', align: 'center', sortable: true, width: '100px' },
  { title: 'Price', key: 'price', align: 'end', sortable: true, width: '100px' },
  { title: 'Status', key: 'status', align: 'center', sortable: true, width: '120px' },
  { title: 'Location', key: 'location', align: 'center', sortable: false, width: '140px' },
  { title: 'Actions', key: 'actions', align: 'center', sortable: false, width: '120px' },
])

const loadStocks = async ({ page: p, itemsPerPage: ipp, sortBy: sb }) => {
  try {
    await stockStore.fetchStocks({
      page: p,
      itemsPerPage: ipp,
      sortBy: sb,
      search: searchQuery.value
    })
    await stockStore.fetchStockGist()
  } catch (error) {
    console.error('Failed to load stocks:', error)
    showError.value = true
  }
}

const onSearch = async () => {
  page.value = 1
  await loadStocks({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value
  })
}

const refreshData = async () => {
  stockStore.clearCache()
  await loadStocks({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value
  })
}

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

const getStatusColor = (status) => {
  return status === 'In Stock' ? 'success' : 'error'
}

const getStatusIcon = (status) => {
  return status === 'In Stock' ? 'mdi-check-circle' : 'mdi-alert-circle'
}

const formatPrice = (price) => {
  return price ? `₹${parseFloat(price).toLocaleString('en-IN', { maximumFractionDigits: 2 })}` : 'N/A'
}

const openAddDialog = () => {
  selectedStock.value = null
  showFormDialog.value = true
}

const viewItem = (item) => {
  const itemId = item.id || item._id || item.stockId
  if (!itemId) {
    console.error('Item has no ID:', item)
    stockStore.error = 'Cannot view item: Missing ID'
    showError.value = true
    return
  }
  router.push({ name: 'StockDetail', params: { id: String(itemId) } })
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

watch(() => stockStore.error, (newError) => {
  if (newError) showError.value = true
})

onMounted(() => {
  loadStocks({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value
  })
})
</script>

<style scoped>
/* Modern Stat Cards with Borders */
.stat-card-modern {
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  background: white;
  border: 2px solid rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.stat-card-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--card-accent-color) 0%, var(--card-accent-light) 100%);
}

.stat-card-modern:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15) !important;
  border-color: var(--card-accent-color);
  border-width: 2px;
}

.stat-card-modern:nth-child(1) {
  --card-accent-color: #2196F3;
  --card-accent-light: #64B5F6;
}

.stat-card-modern:nth-child(2) {
  --card-accent-color: #4CAF50;
  --card-accent-light: #81C784;
}

.stat-card-modern:nth-child(3) {
  --card-accent-color: #FF9800;
  --card-accent-light: #FFB74D;
}

.stat-card-modern:nth-child(4) {
  --card-accent-color: #F44336;
  --card-accent-light: #E57373;
}

.stat-icon-modern {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 2px solid rgba(0, 0, 0, 0.05);
}

.blue-modern { 
  background: rgba(33, 150, 243, 0.1); 
  border-color: rgba(33, 150, 243, 0.2);
}
.green-modern { 
  background: rgba(76, 175, 80, 0.1); 
  border-color: rgba(76, 175, 80, 0.2);
}
.orange-modern { 
  background: rgba(255, 152, 0, 0.1); 
  border-color: rgba(255, 152, 0, 0.2);
}
.red-modern { 
  background: rgba(244, 67, 54, 0.1); 
  border-color: rgba(244, 67, 54, 0.2);
}

.stat-card-modern:hover .stat-icon-modern {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-value-modern {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.5px;
}

.stat-label-modern {
  font-size: 0.813rem;
  color: rgb(var(--v-theme-on-surface-variant));
  font-weight: 600;
  margin-bottom: 8px;
}

.stat-progress {
  margin-top: 12px;
}

/* Table Card */
.table-card {
  border-radius: 16px;
  border: 2px solid rgba(var(--v-theme-on-surface), 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* Compact Table */
.compact-table {
  font-size: 0.875rem;
}

.compact-table :deep(thead th) {
  background: linear-gradient(180deg, rgb(var(--v-theme-surface)) 0%, rgba(var(--v-theme-surface-variant), 0.2) 100%) !important;
  font-weight: 600 !important;
  font-size: 0.75rem !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 12px 8px !important;
  border-bottom: 2px solid rgba(var(--v-theme-primary), 0.1) !important;
}

.compact-table :deep(tbody tr) {
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

.compact-table :deep(tbody tr:hover) {
  background: rgba(var(--v-theme-primary), 0.04) !important;
}

.compact-table :deep(tbody td) {
  padding: 10px 8px !important;
}

/* Compact Cell Styles */
.id-badge-compact {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
}

.name-cell-compact {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-name-compact {
  font-weight: 600;
  font-size: 0.875rem;
}

.price-text-compact {
  font-weight: 700;
  font-size: 0.875rem;
}

/* Action Buttons - Make them visible */
.action-cell-compact {
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;
}

.action-cell-compact .v-btn {
  background: rgba(var(--v-theme-surface), 0.8);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  transition: all 0.2s ease;
}

.action-cell-compact .v-btn:hover {
  transform: scale(1.15);
  border-color: currentColor;
  background: rgba(var(--v-theme-surface), 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Make icons in action buttons more visible */
.action-cell-compact .v-btn :deep(.v-icon) {
  opacity: 0.8;
}

.action-cell-compact .v-btn:hover :deep(.v-icon) {
  opacity: 1;
}

/* Color-specific hover effects */
.action-cell-compact .v-btn.text-info:hover {
  background: rgba(33, 150, 243, 0.1);
}

.action-cell-compact .v-btn.text-primary:hover {
  background: rgba(103, 58, 183, 0.1);
}

.action-cell-compact .v-btn.text-error:hover {
  background: rgba(244, 67, 54, 0.1);
}

/* Responsive */
@media (max-width: 600px) {
  .stat-value-modern {
    font-size: 1.5rem;
  }
  
  .action-cell-compact .v-btn {
    min-width: 32px !important;
  }
}
</style>
