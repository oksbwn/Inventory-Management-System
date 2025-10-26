<template>
  <v-container fluid class="pa-6 components-page">
    <!-- Page Header -->
    <v-row class="mb-8">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-3">
          <div class="d-flex align-center ga-3">
            <v-avatar size="48" color="primary" class="header-avatar">
              <v-icon size="28">mdi-cube-outline</v-icon>
            </v-avatar>
            <div>
              <h1 class="text-h4 font-weight-bold mb-1">Components</h1>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Inventory of all components
              </p>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-8" dense>
      <v-col cols="12" sm="6" md="3">
        <v-card class="stats-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper primary-gradient">
                <v-icon color="white" size="24">mdi-package-variant</v-icon>
              </div>
              <v-chip size="small" color="primary" variant="tonal">Total</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ stockStore.stockGist.total_items || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Components</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stats-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper success-gradient">
                <v-icon color="white" size="24">mdi-check-circle</v-icon>
              </div>
              <v-chip size="small" color="success" variant="tonal">In Stock</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ stockStore.stockGist.in_stock || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Available</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stats-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper warning-gradient">
                <v-icon color="white" size="24">mdi-alert</v-icon>
              </div>
              <v-chip size="small" color="warning" variant="tonal">Low Stock</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ stockStore.stockGist.low_stock || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Need Reorder</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stats-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper error-gradient">
                <v-icon color="white" size="24">mdi-close-circle</v-icon>
              </div>
              <v-chip size="small" color="error" variant="tonal">Out of Stock</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ stockStore.stockGist.no_stock || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Unavailable</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Search and Filters -->
    <v-row class="mb-6" align="center">
      <v-col cols="12" md="8">
        <v-text-field v-model="searchQuery" placeholder="Search by name, category, location..."
          prepend-inner-icon="mdi-magnify" clearable density="comfortable" variant="outlined" hide-details
          @keyup.enter="onSearch" @click:clear="onSearch">
          <template #append-inner>
            <v-btn color="primary" variant="flat" @click="onSearch" :loading="stockStore.loading">
              Search
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <!-- Main Content -->
    <v-card elevation="0" class="main-card">
      <v-data-table-server v-model:items-per-page="itemsPerPage" v-model:page="page" :headers="headers"
        :items="stockStore.stocks" :items-length="stockStore.totalItems" :loading="stockStore.loading" item-value="id"
        @update:options="onPageChange" density="comfortable" hover>
        <!-- Name Column with Image -->
        <template #item.name="{ item }">
          <div class="d-flex align-center ga-2">
            <v-avatar size="36" rounded="lg" class="component-avatar">
              <v-img v-if="item.filename" :src="item.filename" cover loading="lazy" />
              <v-icon v-else size="20" color="grey-lighten-1">mdi-image-off</v-icon>
            </v-avatar>
            <span class="font-weight-medium">{{ item.name }}</span>
          </div>
        </template>

        <!-- Category Column -->
        <template #item.category="{ item }">
          <v-chip size="small" variant="tonal" color="primary">
            {{ item.category_name }}
          </v-chip>
        </template>

        <!-- Quantity Column -->
        <template #item.quantity="{ item }">
          <v-chip :color="getQuantityColor(item.stock)" size="small" variant="tonal">
            <v-icon start size="14">{{ getQuantityIcon(item.stock) }}</v-icon>
            {{ item.stock }}
          </v-chip>
        </template>

        <!-- Price Column -->
        <template #item.price="{ item }">
          <span class="font-weight-bold text-success">{{ formatPrice(item.avg_unit_price) }}</span>
        </template>

        <!-- Status Column -->
        <template #item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" size="small" variant="tonal">
            <v-icon start size="14">{{ getStatusIcon(item.status) }}</v-icon>
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Location Column -->
        <template #item.location="{ item }">
          <v-chip size="small" variant="outlined" color="indigo" prepend-icon="mdi-package-variant">
            {{ item.box_label || 'Unassigned' }}
          </v-chip>
        </template>

        <!-- Actions Column -->
        <template #item.actions="{ item }">
          <div class="d-flex align-center justify-center">
            <v-btn size="x-small" color="primary" variant="tonal" icon="mdi-eye" @click="viewItem(item)" />
          </div>
        </template>
      </v-data-table-server>
    </v-card>

    <!-- Stock Form Dialog -->
    <stock-form-dialog v-model="showFormDialog" :stock-item="selectedStock" @success="handleFormSuccess" />

    <!-- Delete Confirmation Dialog -->
    <delete-confirm-dialog v-model="showDeleteDialog" :item-name="selectedStock?.name" @confirm="handleDeleteConfirm" />

    <!-- Notifications -->
    <v-snackbar v-model="showSuccessSnackbar" color="success" :timeout="3000" location="top right">
      <v-icon class="mr-2">mdi-check-circle</v-icon> {{ successMessage }}
    </v-snackbar>

    <v-snackbar v-model="showError" color="error" :timeout="4000" location="top right">
      <v-icon class="mr-2">mdi-alert-circle</v-icon> {{ stockStore.error }}
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
const searchQuery = ref('')
const showError = ref(false)

const showFormDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedStock = ref(null)
const successMessage = ref('')
const showSuccessSnackbar = ref(false)

const headers = ref([
  { title: 'Product Name', key: 'name', align: 'start' },
  { title: 'Category', key: 'category', align: 'center', width: '140px' },
  { title: 'Qty', key: 'quantity', align: 'center', width: '100px' },
  { title: 'Price', key: 'price', align: 'end', width: '100px' },
  { title: 'Status', key: 'status', align: 'center', width: '120px' },
  { title: 'Location', key: 'location', align: 'center', width: '140px' },
  { title: 'Actions', key: 'actions', align: 'center', width: '100px' }
])

// Simple load function - force refresh when search changes
const loadStocks = async (forceRefresh = false) => {
  try {
    await stockStore.fetchStocks({
      page: page.value,
      itemsPerPage: itemsPerPage.value,
      search: searchQuery.value
    }, forceRefresh)
    await stockStore.fetchStockGist()
  } catch (error) {
    console.error('Failed to load stocks:', error)
    showError.value = true
  }
}

// Search handler - FORCE REFRESH to bypass cache
const onSearch = async () => {
  page.value = 1
  await loadStocks(true) // Force refresh
}

// For data table pagination
const onPageChange = async (options) => {
  const { page: currentPage, itemsPerPage: perPage } = options
  page.value = currentPage
  itemsPerPage.value = perPage
  await loadStocks()
}

const refreshData = async () => {
  await loadStocks(true) // Force refresh
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

onMounted(() => loadStocks())
</script>


<style scoped>
.components-page {
  background: #fafbfc;
  min-height: 100vh;
}

.header-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Stats Cards */
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

.warning-gradient {
  background: linear-gradient(135deg, #ff9a56 0%, #ff7e5f 100%);
}

.error-gradient {
  background: linear-gradient(135deg, #f44336 0%, #e57373 100%);
}

/* Component Avatar */
.component-avatar {
  background-color: white !important;
  border: 1px solid #e0e0e0 !important;
  overflow: hidden;
}

/* Main Card */
.main-card {
  border: 1px solid #e8edf2;
  border-radius: 16px;
  background: white;
  overflow: hidden;
}

.text-success {
  color: #16a34a;
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

.v-data-table {
  animation: fadeIn 0.5s ease-out;
}

/* Responsive */
@media (max-width: 600px) {
  .components-page {
    padding: 16px !important;
  }
}
</style>
