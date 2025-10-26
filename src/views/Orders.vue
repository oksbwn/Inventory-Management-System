<template>
  <v-container fluid class="pa-6 purchase-orders-page">
    <!-- Page Header -->
    <v-row class="mb-8">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-3">
          <div>
            <div class="d-flex align-center ga-3 mb-2">
              <v-avatar size="48" color="primary" class="header-avatar">
                <v-icon size="28">mdi-truck-delivery</v-icon>
              </v-avatar>
              <div>
                <h1 class="text-h4 font-weight-bold mb-1">Purchase Orders</h1>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Manage your {{ orderStore.meta[0]?.metadata?.totalOrders || 0 }} purchase orders
                </p>
              </div>
            </div>
          </div>
          <v-btn color="primary" prepend-icon="mdi-plus" size="large" class="add-btn" :to="{ name: 'PurchaseOrder' }">
            Create Purchase
          </v-btn>
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
                <v-icon color="white" size="24">mdi-file-document</v-icon>
              </div>
              <v-chip size="small" color="primary" variant="tonal">Total</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ orderStore.meta[0]?.metadata?.totalOrders || 0 }}</div>
            <div class="text-caption text-medium-emphasis">All Orders</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stats-card hoverable" elevation="0" @click="applyStatusFilter('Pending')">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper warning-gradient">
                <v-icon color="white" size="24">mdi-clock-outline</v-icon>
              </div>
              <v-chip size="small" color="warning" variant="tonal">Pending</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ orderStore.meta[0]?.metadata?.pendingOrders || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Awaiting Delivery</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stats-card hoverable" elevation="0" @click="applyStatusFilter('Delivered')">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper success-gradient">
                <v-icon color="white" size="24">mdi-check-circle</v-icon>
              </div>
              <v-chip size="small" color="success" variant="tonal">Delivered</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ orderStore.meta[0]?.metadata?.deliveredOrders || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Completed</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stats-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper info-gradient">
                <v-icon color="white" size="24">mdi-currency-inr</v-icon>
              </div>
              <v-chip size="small" color="blue" variant="tonal">Total Spent</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ formatCurrency(orderStore.meta[0]?.metadata?.totalSpent || 0)
              }}</div>
            <div class="text-caption text-medium-emphasis">Total Value</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Search and View Controls -->
    <v-row class="mb-6" align="center">
      <v-col cols="12" md="8">
        <div class="search-wrapper">
          <v-text-field v-model="searchQuery" placeholder="Search orders..." prepend-inner-icon="mdi-magnify" clearable
            density="comfortable" variant="outlined" @keyup.enter="onSearch" @click:clear="onSearch" hide-details
            class="search-field" />
          <v-btn color="primary" @click="onSearch" height="46" width="46" class="search-btn">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </div>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end align-center ga-2">
        <v-select v-model="filterVendor" :items="vendorList" item-title="vendor_name" item-value="vendor_id"
          label="Filter by Vendor" variant="outlined" density="comfortable" clearable hide-details
          class="vendor-filter" />
      </v-col>
    </v-row>

    <!-- Main Content -->
    <v-card elevation="0" class="main-card">
      <!-- Loading State -->
      <v-row v-if="orderStore.loading && orders.length === 0" justify="center" class="py-12">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate size="64" color="primary" width="3" />
          <div class="mt-4 text-h6 text-medium-emphasis">Loading orders...</div>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-row v-else-if="orders.length === 0" class="py-12">
        <v-col cols="12" class="text-center">
          <div class="empty-state">
            <v-icon size="120" color="grey-lighten-2">mdi-file-document-outline</v-icon>
            <h3 class="text-h5 font-weight-bold mt-4 mb-2">No purchase orders found</h3>
            <p class="text-body-2 text-medium-emphasis mb-6">
              {{ searchQuery ? 'Try adjusting your search' : 'Get started by creating your first purchase order' }}
            </p>
            <v-btn v-if="!searchQuery" color="primary" size="large" :to="{ name: 'PurchaseOrder' }"
              prepend-icon="mdi-plus">
              Create Your First Order
            </v-btn>
            <v-btn v-else color="grey" size="large" @click="clearFilters" prepend-icon="mdi-filter-off-outline">
              Clear Search
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Table View -->
      <v-data-table v-else :headers="headers" :items="orders" :loading="orderStore.loading" class="elevation-0"
        :items-per-page="10" disable-sort>
        <template #item.vendor_name="{ item }">
          <div class="d-flex align-center ga-2">
            <v-avatar size="32" class="vendor-avatar">
              <img v-if="item.filename" :src="item.filename" :alt="item.vendor_name" class="vendor-icon-img" />
              <v-icon v-else color="indigo-darken-1" size="18">mdi-truck-delivery</v-icon>
            </v-avatar>
            <span class="font-weight-medium">{{ item.vendor_name }}</span>
          </div>
        </template>

        <template #item.order_date="{ item }">
          <div class="text-caption">{{ formatDate(item.order_date) }}</div>
        </template>

        <template #item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" size="small" variant="tonal">
            {{ item.status || 'Not Set' }}
          </v-chip>
        </template>

        <template #item.total_value="{ item }">
          <span class="font-weight-bold text-success">{{ formatCurrency(item.total_value) }}</span>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex align-center ga-2">
            <v-btn size="x-small" color="primary" variant="tonal" @click="viewOrder(item)" class="action-btn">
              <v-icon size="16">mdi-eye</v-icon>
            </v-btn>
            <v-btn size="x-small" color="error" variant="tonal" @click="deleteOrder(item)" class="action-btn">
              <v-icon size="16">mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>

      </v-data-table>
    </v-card>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="confirmDeleteDialog" max-width="480">
      <v-card>
        <v-card-title class="pa-5 d-flex align-center">
          <v-icon color="error" size="28" class="mr-2">mdi-alert-circle</v-icon>
          Confirm Delete
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          Are you sure you want to delete this order?
          <p class="text-body-2 text-medium-emphasis mt-2">This action cannot be undone.</p>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4 justify-end">
          <v-btn variant="outlined" @click="confirmDeleteDialog = false">Cancel</v-btn>
          <v-btn color="error" :loading="deleting" @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Order Detail Dialog -->
    <v-dialog v-model="detailDialog" max-width="800px">
      <v-card>
        <v-card-title class="pa-5 d-flex align-center">
          <v-avatar size="40" color="indigo-lighten-4" class="mr-4 vendor-avatar">
            <img v-if="selectedOrderDetail.vendor_icon_filename"
              :src="`/vendor-icons/${selectedOrderDetail.vendor_icon_filename}`" :alt="selectedOrderDetail.vendor_name"
              class="vendor-icon-img" />
            <v-icon v-else color="indigo-darken-1" size="28">mdi-truck-delivery</v-icon>
          </v-avatar>

          <div class="order-header-text">
            <div class="text-h6 font-weight-bold mb-1">Order #{{ selectedOrderDetail.order_id }}</div>
            <div class="text-caption">Placed on {{ formatDate(selectedOrderDetail.order_date) }}</div>
          </div>

          <v-spacer />

          <v-chip :color="getStatusColor(selectedOrderDetail.status)" small variant="tonal" class="order-status-chip">
            {{ selectedOrderDetail.status || 'Not Set' }}
          </v-chip>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-6">
          <!-- Vendor Info and Order Summary -->
          <v-row dense class="py-4 pb-6 border-bottom">
            <v-col cols="12" md="6" class="d-flex align-center">
              <v-avatar size="56" class="mr-4 vendor-avatar">
                <img v-if="selectedOrderDetail.filename" :src="selectedOrderDetail.filename"
                  :alt="selectedOrderDetail.vendor_name" class="vendor-icon-img" />
                <v-icon v-else color="indigo-darken-1" size="28">mdi-truck-delivery</v-icon>
              </v-avatar>
              <div class="vendor-info">
                <h3 class="font-weight-bold mb-1">{{ selectedOrderDetail.vendor_name }}</h3>
                <p class="text-body-1 text-medium-emphasis mb-0">{{ selectedOrderDetail.contact_email }}</p>
                <p class="text-body-1 text-medium-emphasis mb-0">{{ selectedOrderDetail.phone_number || '—' }}</p>
              </div>
            </v-col>

            <v-col cols="12" md="6" class="d-flex justify-end align-center">
              <div class="d-flex flex-column text-right">
                <span class="text-body-2 text-medium-emphasis">Grand Total</span>
                <span class="text-h5 font-weight-bold mt-1">{{ formatCurrency(selectedOrderDetail.total_cost) }}</span>
              </div>
              <div class="d-flex flex-column text-right ml-8">
                <span class="text-body-2 text-medium-emphasis">Items</span>
                <span class="text-h5 font-weight-bold mt-1">{{ selectedOrderDetail.order_items?.length || 0 }}</span>
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <!-- Items Table -->
          <v-data-table :headers="itemHeaders" :items="selectedOrderDetail.order_items || []" hide-default-footer dense
            disable-sort>
            <template #item.component_name="{ item }">
              <div class="d-flex align-center ga-2">
                <v-avatar size="40" color="indigo-lighten-4" class="mr-4 vendor-avatar">
                  <img v-if="item.file_name" :src="item.file_name" :alt="item.component_name"
                    class="vendor-icon-img" />
                  <v-icon v-else color="indigo-darken-1" size="28">mdi-truck-delivery</v-icon>
                </v-avatar>
                <span>{{ item.component_name }}</span>
              </div>
            </template>
            <template #item.total="{ item }">
              {{ formatCurrency(item.total) }}
            </template>
          </v-data-table>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-4 justify-end">
          <v-btn variant="outlined" @click="detailDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Notifications -->
    <v-snackbar v-model="showSuccess" color="success" :timeout="3000" location="top right">
      <v-icon class="mr-2">mdi-check-circle</v-icon> {{ successMessage }}
    </v-snackbar>
    <v-snackbar v-model="showError" color="error" :timeout="4000" location="top right">
      <v-icon class="mr-2">mdi-alert-circle</v-icon> {{ errorMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showError = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'

const router = useRouter()
const orderStore = useOrderStore()

const page = ref(1)
const itemsPerPage = ref(12)
const searchQuery = ref('')
const statusFilter = ref(null)
const filterVendor = ref(null)

const confirmDeleteDialog = ref(false)
const deleting = ref(false)
const detailDialog = ref(false)
const selectedOrderDetail = ref({})

const showSuccess = ref(false)
const successMessage = ref('')
const showError = ref(false)
const errorMessage = ref('')

const orders = computed(() => orderStore.orders || [])

const headers = [
  { title: 'Order ID', key: 'order_id' },
  { title: 'Vendor', key: 'vendor_name' },
  { title: 'Date', key: 'order_date' },
  { title: 'Items', key: 'item_count' },
  { title: 'Status', key: 'status' },
  { title: 'Total Value', key: 'total_value' },
  { title: 'Actions', key: 'actions' }
]

const itemHeaders = [
  { title: 'Component', key: 'component_name' },
  { title: 'Category', key: 'category_name' },
  { title: 'Quantity', key: 'quantity_ordered' },
  { title: 'Unit Cost', key: 'unit_cost' },
  { title: 'Total', key: 'total' }
]

const vendorList = computed(() => {
  const map = {}
  orders.value.forEach(o => {
    if (o.vendor_id && o.vendor_name && !map[o.vendor_id]) {
      map[o.vendor_id] = { vendor_id: o.vendor_id, vendor_name: o.vendor_name }
    }
  })
  return Object.values(map)
})

const getStatusColor = (status) => {
  const colors = {
    'Pending': 'warning',
    'Processing': 'orange',
    'Delivered': 'success',
    'Cancelled': 'error',
    'On Hold': 'grey'
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

const formatCurrency = (amount) => {
  if (!amount || amount === 0) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

const loadOrders = async () => {
  try {
    await orderStore.fetchOrders({
      page: page.value,
      pageSize: itemsPerPage.value,
      search: searchQuery.value,
      status: statusFilter.value,
      vendor: filterVendor.value
    })
    await orderStore.fetchOrdersMeta()
  } catch (err) {
    errorMessage.value = err.message || 'Failed to load orders'
    showError.value = true
  }
}

const onSearch = () => {
  page.value = 1
  loadOrders()
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = null
  filterVendor.value = null
  onSearch()
}

const applyStatusFilter = (status) => {
  statusFilter.value = status
  onSearch()
}

const viewOrder = async (order) => {
  try {
    const response = await orderStore.fetchOrder(order.order_id)
    selectedOrderDetail.value = Array.isArray(response) ? response[0] : response
    detailDialog.value = true
  } catch (err) {
    errorMessage.value = err.message || 'Failed to load order details'
    showError.value = true
  }
}

let orderToDelete = null
const deleteOrder = (order) => {
  orderToDelete = order
  confirmDeleteDialog.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    await orderStore.deleteOrder(orderToDelete.order_id)
    successMessage.value = 'Order deleted successfully'
    showSuccess.value = true
    await loadOrders()
  } catch (err) {
    errorMessage.value = err.message || 'Failed to delete order'
    showError.value = true
  } finally {
    deleting.value = false
    confirmDeleteDialog.value = false
  }
}

watch(() => orderStore.error, (val) => {
  if (val) {
    errorMessage.value = val
    showError.value = true
  }
})

onMounted(() => loadOrders())
</script>

<style scoped>
.purchase-orders-page {
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

.stats-card {
  border: 1px solid #e8edf2;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
}

.vendor-avatar {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.vendor-icon-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  display: block;
}

.order-header-text {
  min-width: 0;
}

.order-status-chip {
  white-space: nowrap;
  font-weight: 600;
  user-select: none;
}

.stats-card.hoverable {
  cursor: pointer;
}

.stats-card.hoverable:hover {
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

.vendor-avatar {
  background-color: white !important;
  border: 1px solid #e0e0e0 !important;
  box-shadow: none !important;
  overflow: hidden !important;
}

.vendor-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 6px;
}

.primary-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.border-bottom {
  border-bottom: 1px solid #e8edf2;
}

.vendor-avatar {
  background: white !important;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
}

.vendor-icon-img {
  width: 56px;
  height: 56px;
  object-fit: contain;
}

.vendor-info h3 {
  font-size: 1.25rem;
  color: rgba(0, 0, 0, 0.85);
}

.vendor-info p {
  font-size: 1rem;
  margin: 0;
  color: rgba(0, 0, 0, 0.6);
}

.ml-8 {
  margin-left: 3rem;
}

.action-btn {
  border-radius: 8px !important;
  min-width: 36px !important;
  width: 36px !important;
  height: 36px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-btn:active {
  transform: translateY(0);
}

.success-gradient {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.warning-gradient {
  background: linear-gradient(135deg, #ff9a56 0%, #ff7e5f 100%);
}

.info-gradient {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
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

.vendor-filter {
  max-width: 280px;
}

.main-card {
  border: 1px solid #e8edf2;
  border-radius: 16px;
  background: white;
  overflow: hidden;
}

.empty-state {
  padding: 60px 20px;
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

@media (max-width: 960px) {
  .vendor-filter {
    max-width: 100%;
  }
}

@media (max-width: 600px) {
  .purchase-orders-page {
    padding: 16px !important;
  }

  .stats-card {
    margin-bottom: 12px;
  }

  .search-wrapper {
    flex-direction: column;
  }

  .search-btn {
    width: 100%;
  }
}
</style>
