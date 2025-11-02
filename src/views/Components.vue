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
          <BaseButton variant="contained" color="primary" size="large" class="add-component-btn" @click="openAddDialog">
            <v-icon class="mr-2">mdi-plus</v-icon>
            Add Component
          </BaseButton>
        </div>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-8" dense>
      <v-col cols="12" sm="6" md="3">
        <BaseCard variant="default" elevation="0" class="stats-card">
          <div class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper primary-gradient">
                <v-icon color="white" size="24">mdi-package-variant</v-icon>
              </div>
              <v-chip size="small" color="primary" variant="tonal">Total</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ stockStore.stockGist.total_items || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Components</div>
          </div>
        </BaseCard>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <BaseCard variant="default" elevation="0" class="stats-card">
          <div class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper success-gradient">
                <v-icon color="white" size="24">mdi-check-circle</v-icon>
              </div>
              <v-chip size="small" color="success" variant="tonal">In Stock</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ stockStore.stockGist.in_stock || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Available</div>
          </div>
        </BaseCard>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <BaseCard variant="default" elevation="0" class="stats-card">
          <div class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper warning-gradient">
                <v-icon color="white" size="24">mdi-alert</v-icon>
              </div>
              <v-chip size="small" color="warning" variant="tonal">Low Stock</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ stockStore.stockGist.low_stock || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Need Reorder</div>
          </div>
        </BaseCard>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <BaseCard variant="default" elevation="0" class="stats-card">
          <div class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper error-gradient">
                <v-icon color="white" size="24">mdi-close-circle</v-icon>
              </div>
              <v-chip size="small" color="error" variant="tonal">Out of Stock</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ stockStore.stockGist.no_stock || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Unavailable</div>
          </div>
        </BaseCard>
      </v-col>
    </v-row>

    <!-- Search and Filters -->
    <v-row class="mb-6" align="center">
      <v-col cols="12" md="8">
        <v-text-field 
          v-model="searchQuery" 
          placeholder="Search by name, category, location..."
          prepend-inner-icon="mdi-magnify" 
          clearable 
          density="comfortable" 
          variant="outlined" 
          hide-details
          @keyup.enter="onSearch" 
          @click:clear="onSearch"
        >
          <template #append-inner>
            <BaseButton 
              variant="contained" 
              color="primary" 
              size="small" 
              @click="onSearch" 
              :loading="stockStore.loading"
              class="search-inner-btn"
            >
              Search
            </BaseButton>
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <!-- Main Content -->
    <BaseCard elevation="0" class="main-card">
      <v-data-table-server 
        v-model:items-per-page="itemsPerPage" 
        v-model:page="page" 
        :headers="headers"
        :items="stockStore.stocks" 
        :items-length="stockStore.totalItems" 
        :loading="stockStore.loading" 
        item-value="id"
        @update:options="onPageChange" 
        density="comfortable" 
        hover
      >
        <template #item.name="{ item }">
          <div class="d-flex align-center ga-2">
            <v-avatar size="36" rounded="lg" class="component-avatar">
              <v-img v-if="item.filename" :src="item.filename" cover loading="lazy" />
              <v-icon v-else size="20" color="grey-lighten-1">mdi-image-off</v-icon>
            </v-avatar>
            <span class="font-weight-medium">{{ item.name }}</span>
          </div>
        </template>

        <template #item.category="{ item }">
          <v-chip size="small" variant="tonal" color="primary">
            {{ item.category_name }}
          </v-chip>
        </template>

        <template #item.quantity="{ item }">
          <v-chip :color="getQuantityColor(item.stock)" size="small" variant="tonal">
            <v-icon start size="14">{{ getQuantityIcon(item.stock) }}</v-icon>
            {{ item.stock }}
          </v-chip>
        </template>

        <template #item.price="{ item }">
          <span class="font-weight-bold text-success">{{ formatPrice(item.avg_unit_price) }}</span>
        </template>

        <template #item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" size="small" variant="tonal">
            <v-icon start size="14">{{ getStatusIcon(item.status) }}</v-icon>
            {{ item.status }}
          </v-chip>
        </template>

        <template #item.location="{ item }">
          <v-chip size="small" variant="outlined" color="indigo" prepend-icon="mdi-package-variant">
            {{ item.box_label || 'Unassigned' }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex align-center justify-center">
            <BaseButton 
              size="small" 
              color="primary" 
              variant="tonal" 
              class="action-btn-square" 
              @click="viewItem(item)"
              aria-label="View component details"
            >
              <v-icon>mdi-eye</v-icon>
            </BaseButton>
          </div>
        </template>
      </v-data-table-server>
    </BaseCard>

    <component-form-dialog 
      v-model="showFormDialog" 
      :component-item="selectedComponent" 
      :categories="categories"
      :boxes="boxes" 
      @success="handleFormSuccess" 
      @category-added="loadCategories" 
      @box-added="loadBoxes" 
    />

    <delete-confirm-dialog 
      v-model="showDeleteDialog" 
      :item-name="selectedComponent?.name"
      @confirm="handleDeleteConfirm" 
    />

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
      :timeout="4000" 
    />
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStockStore } from '@/stores/stockStore'
import { useBoxStore } from '@/stores/boxStore'
import { useCategoryStore } from '@/stores/categoryStore'
import ComponentFormDialog from '@/components/ComponentFormDialog.vue'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue'

const router = useRouter()
const stockStore = useStockStore()
const boxStore = useBoxStore()
const categoryStore = useCategoryStore()

const page = ref(1)
const itemsPerPage = ref(10)
const searchQuery = ref('')
const showError = ref(false)
const errorMessage = ref('')

const showFormDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedComponent = ref(null)
const successMessage = ref('')
const showSuccessSnackbar = ref(false)

const categories = ref([])
const boxes = ref([])

const headers = ref([
  { title: 'Product Name', key: 'name', align: 'start' },
  { title: 'Category', key: 'category', align: 'center', width: '140px' },
  { title: 'Qty', key: 'quantity', align: 'center', width: '100px' },
  { title: 'Price', key: 'price', align: 'end', width: '100px' },
  { title: 'Status', key: 'status', align: 'center', width: '120px' },
  { title: 'Location', key: 'location', align: 'center', width: '140px' },
  { title: 'Actions', key: 'actions', align: 'center', width: '100px' }
])

const loadStocks = async (forceRefresh = false) => {
  try {
    await stockStore.fetchStocks({
      page: page.value,
      itemsPerPage: itemsPerPage.value,
      search: searchQuery.value
    }, forceRefresh)
    await stockStore.fetchStockGist()
  } catch (error) {
    errorMessage.value = error.message || 'Failed to load components'
    showError.value = true
  }
}

const loadCategories = async () => {
  try {
    await categoryStore.fetchCategories({ pageSize: 1000000, page: 1 })
    categories.value = categoryStore.categories || []
  } catch (error) {
    errorMessage.value = 'Failed to load categories'
    showError.value = true
  }
}

const loadBoxes = async () => {
  try {
    await boxStore.fetchBoxes({ pageSize: 1000000, page: 1 })
    boxes.value = boxStore.boxes || []
  } catch (error) {
    errorMessage.value = 'Failed to load boxes'
    showError.value = true
  }
}

const onSearch = async () => {
  page.value = 1
  await loadStocks(true)
}

const onPageChange = async (options) => {
  const { page: currentPage, itemsPerPage: perPage } = options
  page.value = currentPage
  itemsPerPage.value = perPage
  await loadStocks()
}

const refreshData = async () => {
  await loadStocks(true)
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
  selectedComponent.value = null
  showFormDialog.value = true
}

const viewItem = (item) => {
  const itemId = item.id || item._id || item.stockId
  if (!itemId) {
    errorMessage.value = 'Cannot view item: Missing ID'
    showError.value = true
    return
  }
  router.push({ name: 'StockDetail', params: { id: String(itemId) } })
}

const handleDeleteConfirm = async () => {
  try {
    await stockStore.deleteStock(selectedComponent.value.id)
    showDeleteDialog.value = false
    successMessage.value = 'Component deleted successfully!'
    showSuccessSnackbar.value = true
    await refreshData()
  } catch (error) {
    errorMessage.value = error.message || 'Failed to delete component'
    showError.value = true
  }
}

const handleFormSuccess = async (data) => {
  successMessage.value = data.message || 'Component saved successfully!'
  showSuccessSnackbar.value = true
  await refreshData()
}

watch(() => stockStore.error, (newError) => {
  if (newError) {
    errorMessage.value = newError
    showError.value = true
  }
})

onMounted(async () => {
  await loadStocks()
  await loadCategories()
  await loadBoxes()
})
</script>

<style scoped>
.add-component-btn {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-transform: none;
  letter-spacing: 0.5px;
}

.components-page {
  background: #fafbfc;
  min-height: 100vh;
}

.header-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
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

.warning-gradient {
  background: linear-gradient(135deg, #ff9a56 0%, #ff7e5f 100%);
}

.error-gradient {
  background: linear-gradient(135deg, #f44336 0%, #e57373 100%);
}

.component-avatar {
  background-color: white !important;
  border: 1px solid #e0e0e0 !important;
  overflow: hidden;
}

.search-inner-btn {
  margin-right: -8px;
}

.action-btn-square {
  min-width: 32px !important;
  width: 32px;
  height: 32px;
  padding: 0 !important;
  border-radius: 6px;
}

.action-btn-square :deep(.v-btn__content) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn-square :deep(.v-icon) {
  margin: 0 !important;
  opacity: 1 !important;
}

.main-card {
  border: 1px solid #e8edf2;
  border-radius: 16px;
  background: white;
  overflow: hidden;
}

.text-success {
  color: #16a34a;
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

.v-data-table {
  animation: fadeIn 0.5s ease-out;
}

@media (max-width: 600px) {
  .components-page {
    padding: 16px !important;
  }
}
</style>
