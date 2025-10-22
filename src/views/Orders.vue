<template>
  <v-container fluid class="pa-6">
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-4">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">Purchase Orders</h1>
            <p class="text-body-1 text-medium-emphasis">
              View and manage all your component purchase records.
            </p>
          </div>
          <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'PurchaseOrder' }" elevation="2">
            Create Purchase
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Toolbar -->
    <v-card elevation="2" class="mb-6">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="searchTerm" label="Search orders" prepend-inner-icon="mdi-magnify" variant="outlined"
              dense hide-details clearable />
          </v-col>
          <v-col cols="6" md="3">
            <v-select v-model="filterVendor" :items="vendorList" item-title="vendor_name" item-value="vendor_id"
              label="Filter by Vendor" variant="outlined" dense clearable />
          </v-col>
          <v-col cols="6" md="3" class="text-right">
            <v-btn color="grey-lighten-1" variant="tonal" @click="refreshOrders" :loading="orderStore.loading">
              <v-icon start>mdi-refresh</v-icon> Refresh
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Orders Table -->
    <v-card elevation="2">
      <v-data-table :headers="headers" :items="filteredOrders" :loading="orderStore.loading" class="elevation-1"
        :items-per-page="10">
        <template #item.vendor="{ item }">
          <div class="d-flex align-center ga-2">
            <v-icon size="18" color="primary">mdi-truck-delivery</v-icon>
            <span>{{ item.vendor_name }}</span>
          </div>
        </template>

        <template #item.order_date="{ item }">
          {{ formatDate(item.order_date) }}
        </template>

        <template #item.total_value="{ item }">
          <span class="font-weight-medium text-success">
            {{ formatCurrency(item.total_value) }}
          </span>
        </template>

        <template #item.actions="{ item }">
          <v-btn variant="tonal" color="primary" icon size="small" @click="viewOrder(item)">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn variant="tonal" color="error" icon size="small" @click="deleteOrder(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>

        <template #no-data>
          <div class="text-center pa-12">
            <v-icon size="64" color="grey-lighten-2">
              mdi-file-document-outline
            </v-icon>
            <p class="text-body-1 text-medium-emphasis mt-3">
              No purchase orders found.
            </p>
            <v-btn color="primary" class="mt-3" :to="{ name: 'PurchaseOrder' }">
              <v-icon start>mdi-plus</v-icon>
              Create your first order
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="confirmDeleteDialog" max-width="500">
      <v-card>
        <v-card-title class="pa-5">
          <v-icon size="28" color="error" class="mr-2">mdi-alert-circle</v-icon>
          Confirm Delete
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          Are you sure you want to delete this order?
          <p class="text-body-2 text-medium-emphasis mt-2">
            This action cannot be undone.
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4 justify-end">
          <v-btn variant="outlined" @click="confirmDeleteDialog = false">
            Cancel
          </v-btn>
          <v-btn color="error" :loading="deleting" @click="confirmDelete">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Order Detail Dialog -->
    <v-dialog v-model="detailDialog" max-width="800px">
      <v-card>
        <v-card-title class="pa-5 d-flex align-center">
          <v-avatar size="40" color="primary-lighten4" class="mr-3">
            <v-icon color="primary">mdi-truck-delivery</v-icon>
          </v-avatar>
          <div>
            <div class="text-h6 mb-1">Order #{{ detail.order_id }}</div>
            <div class="text-caption">Placed on {{ formatDate(detail.order_date) }}</div>
          </div>
          <v-spacer />
          <v-chip :color="detail.status === 'Delivered' ? 'success' : 'warning'" small>
            {{ detail.status }}
          </v-chip>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-6">
          <v-row dense>
            <!-- Vendor Info -->
            <v-col cols="12" md="6">
              <div class="d-flex align-center mb-3">
                <v-avatar size="32" color="blue-lighten-4" class="mr-2">
                  <v-icon color="blue">mdi-account-group</v-icon>
                </v-avatar>
                <div>
                  <div class="font-weight-medium">{{ detail.vendor_name }}</div>
                  <div class="text-body-2 text--secondary">{{ detail.contact_email }}</div>
                  <div class="text-body-2 text--secondary">{{ detail.phone_number || '—' }}</div>
                </div>
              </div>
            </v-col>

            <!-- Order Summary -->
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="6">
                  <div class="text-body-2 text--secondary">Grand Total</div>
                  <div class="text-h6 font-weight-bold text-success">{{ formatCurrency(detail.total_cost) }}</div>
                </v-col>
                <v-col cols="6">
                  <div class="text-body-2 text--secondary">Items</div>
                  <div class="text-h6 font-weight-bold">{{ detail.order_items.length }}</div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <!-- Items Table -->
          <v-data-table :headers="itemHeaders" :items="detail.order_items" hide-default-footer dense>
            <template #item.component_name="{ item }">
              <div class="d-flex align-center">
                <v-avatar size="28" color="grey-lighten-3" class="mr-2">
                  <v-icon color="grey-darken-1">mdi-chip</v-icon>
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

    <!-- Snackbars -->
    <v-snackbar v-model="showSuccess" color="success" location="top right">
      <v-icon class="mr-2">mdi-check-circle</v-icon>{{ successMessage }}
    </v-snackbar>

    <v-snackbar v-model="showError" color="error" location="top right">
      <v-icon class="mr-2">mdi-alert-circle</v-icon>{{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '@/stores/orderStore'

const orderStore = useOrderStore()

const searchTerm = ref('')
const filterVendor = ref(null)
const confirmDeleteDialog = ref(false)
const deleting = ref(false)
let orderToDelete = null
const showSuccess = ref(false)
const showError = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Detail dialog
const detailDialog = ref(false)
const detail = ref({})

// Table headers
const headers = [
  { title: 'Order ID', key: 'order_id', sortable: true },
  { title: 'Vendor', key: 'vendor', sortable: true },
  { title: 'Date', key: 'order_date', sortable: true },
  { title: 'Items', key: 'item_count', sortable: false },
  { title: 'Total Value', key: 'total_value', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

const itemHeaders = [
  { title: 'Component', key: 'component_name' },
  { title: 'Category', key: 'category_name' },
  { title: 'Quantity', key: 'quantity_ordered' },
  { title: 'Unit Cost', key: 'unit_cost' },
  { title: 'Total', key: 'total' }
]
const vendorList = computed(() => {
  // Extract unique vendors from orders
  const map = {}
  orderStore.orders.forEach(o => {
    if (o.vendor_id && o.vendor_name && !map[o.vendor_id]) {
      map[o.vendor_id] = { vendor_id: o.vendor_id, vendor_name: o.vendor_name }
    }
  })
  return Object.values(map)
})

const formatCurrency = (val) =>
  `₹${(val || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2
  })}`

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

const filteredOrders = computed(() => {
  let list = [...orderStore.orders]
  if (filterVendor.value) {
    list = list.filter((o) => o.vendor_id === filterVendor.value)
  }
  if (searchTerm.value) {
    const q = searchTerm.value.toLowerCase()
    list = list.filter(
      (o) =>
        String(o.order_id).includes(q) ||
        o.vendor_name.toLowerCase().includes(q)
    )
  }
  return list
})

const refreshOrders = () => orderStore.fetchOrders()

const viewOrder = async (order) => {
  try {
    const response = await orderStore.fetchOrder(order.order_id)
    // response is an array: [{ … }]
    detail.value = Array.isArray(response) ? response[0] : response
    detailDialog.value = true
  } catch {
    showError.value = true
    errorMessage.value = 'Failed to load order details'
  }
}


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
  } catch {
    errorMessage.value = 'Failed to delete order'
    showError.value = true
  } finally {
    deleting.value = false
    confirmDeleteDialog.value = false
  }
}

onMounted(() => {
  orderStore.fetchOrders()
})
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg,
      rgba(102, 126, 234, 0.05) 0%,
      rgba(118, 75, 162, 0.05) 100%);
}
</style>
