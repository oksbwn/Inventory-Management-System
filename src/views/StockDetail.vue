<template>
  <v-container fluid class="pa-6">
    <!-- Loading State -->
    <v-row v-if="loading" justify="center" class="my-12">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="mt-4 text-body-1">Loading stock details...</p>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="error" justify="center" class="my-12">
      <v-col cols="12" md="6" class="text-center">
        <v-icon size="80" color="error">mdi-alert-circle</v-icon>
        <h2 class="text-h5 mt-4 mb-2">Error Loading Stock</h2>
        <p class="text-body-1 text-medium-emphasis mb-6">{{ error }}</p>
        <v-btn color="primary" :to="{ name: 'Stocks' }">
          Back to Stocks
        </v-btn>
      </v-col>
    </v-row>

    <!-- Main Content -->
    <template v-else-if="stock">
      <!-- Header with Breadcrumbs -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-breadcrumbs :items="breadcrumbs" class="pa-0 mb-4">
            <template v-slot:divider>
              <v-icon>mdi-chevron-right</v-icon>
            </template>
          </v-breadcrumbs>

          <div class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold mb-2">{{ stock.name }}</h1>
              <div class="d-flex align-center gap-3">
                <v-chip
                  :color="getStatusColor(stock.status)"
                  size="small"
                  variant="flat"
                >
                  <v-icon start size="x-small">{{ getStatusIcon(stock.status) }}</v-icon>
                  {{ stock.status }}
                </v-chip>
                <v-chip size="small" variant="tonal" color="primary">
                  {{ stock.category }}
                </v-chip>
                <span class="text-body-2 text-medium-emphasis">
                  SKU: <strong>{{ stock.sku || 'N/A' }}</strong>
                </span>
              </div>
            </div>

            <div class="d-flex gap-2">
              <v-btn
                color="primary"
                variant="outlined"
                prepend-icon="mdi-pencil"
                @click="handleEdit"
              >
                Edit
              </v-btn>
              <v-btn
                color="error"
                variant="outlined"
                prepend-icon="mdi-delete"
                @click="handleDelete"
              >
                Delete
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Main Info Cards -->
      <v-row class="mb-6">
        <!-- Quick Stats -->
        <v-col cols="12" md="3">
          <v-card elevation="2" class="text-center pa-5">
            <v-avatar size="56" color="blue-lighten-5" class="mb-3">
              <v-icon color="blue" size="32">mdi-package-variant</v-icon>
            </v-avatar>
            <div class="text-h4 font-weight-bold">{{ stock.quantity }}</div>
            <div class="text-body-2 text-medium-emphasis">Units in Stock</div>
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card elevation="2" class="text-center pa-5">
            <v-avatar size="56" color="green-lighten-5" class="mb-3">
              <v-icon color="green" size="32">mdi-currency-inr</v-icon>
            </v-avatar>
            <div class="text-h4 font-weight-bold">{{ formatCurrency(stock.price) }}</div>
            <div class="text-body-2 text-medium-emphasis">Unit Price</div>
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card elevation="2" class="text-center pa-5">
            <v-avatar size="56" color="purple-lighten-5" class="mb-3">
              <v-icon color="purple" size="32">mdi-chart-line</v-icon>
            </v-avatar>
            <div class="text-h4 font-weight-bold">{{ formatCurrency(totalValue) }}</div>
            <div class="text-body-2 text-medium-emphasis">Total Value</div>
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card elevation="2" class="text-center pa-5">
            <v-avatar size="56" color="orange-lighten-5" class="mb-3">
              <v-icon color="orange" size="32">mdi-alert</v-icon>
            </v-avatar>
            <div class="text-h4 font-weight-bold">{{ stock.minStockLevel || 10 }}</div>
            <div class="text-body-2 text-medium-emphasis">Min Stock Level</div>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <!-- Left Column - Details -->
        <v-col cols="12" md="8">
          <!-- Basic Information -->
          <v-card elevation="2" class="mb-6">
            <v-card-title class="pa-5 d-flex align-center">
              <v-icon class="mr-3" color="primary">mdi-information</v-icon>
              <span class="text-h6">Basic Information</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-5">
              <v-row>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="text-caption text-medium-emphasis mb-1">Product Name</div>
                    <div class="text-body-1 font-weight-medium">{{ stock.name }}</div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="text-caption text-medium-emphasis mb-1">SKU</div>
                    <div class="text-body-1 font-weight-medium">{{ stock.sku || 'Not Set' }}</div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="text-caption text-medium-emphasis mb-1">Category</div>
                    <v-chip size="small" variant="tonal" color="primary">
                      {{ stock.category }}
                    </v-chip>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="text-caption text-medium-emphasis mb-1">Status</div>
                    <v-chip :color="getStatusColor(stock.status)" size="small" variant="flat">
                      {{ stock.status }}
                    </v-chip>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="text-caption text-medium-emphasis mb-1">Storage Location</div>
                    <div class="text-body-1 font-weight-medium">
                      <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
                      {{ stock.location || 'Not Specified' }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="text-caption text-medium-emphasis mb-1">Supplier</div>
                    <div class="text-body-1 font-weight-medium">
                      <v-icon size="small" class="mr-1">mdi-truck</v-icon>
                      {{ stock.supplier || 'Not Specified' }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Description -->
          <v-card v-if="stock.description" elevation="2" class="mb-6">
            <v-card-title class="pa-5 d-flex align-center">
              <v-icon class="mr-3" color="primary">mdi-text</v-icon>
              <span class="text-h6">Description</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-5">
              <p class="text-body-1">{{ stock.description }}</p>
            </v-card-text>
          </v-card>

          <!-- Stock History (Mock) -->
          <v-card elevation="2">
            <v-card-title class="pa-5 d-flex align-center">
              <v-icon class="mr-3" color="primary">mdi-history</v-icon>
              <span class="text-h6">Recent Activity</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-5">
              <v-timeline density="compact" align="start">
                <v-timeline-item
                  v-for="(activity, index) in mockActivities"
                  :key="index"
                  :dot-color="activity.color"
                  size="small"
                >
                  <div class="d-flex justify-space-between align-center mb-2">
                    <div class="text-body-2 font-weight-medium">{{ activity.action }}</div>
                    <div class="text-caption text-medium-emphasis">{{ activity.time }}</div>
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ activity.details }}
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column - Actions & Metrics -->
        <v-col cols="12" md="4">
          <!-- Stock Level Indicator -->
          <v-card elevation="2" class="mb-6">
            <v-card-title class="pa-5 d-flex align-center">
              <v-icon class="mr-3" color="primary">mdi-gauge</v-icon>
              <span class="text-h6">Stock Level</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-5">
              <div class="text-center mb-4">
                <v-progress-circular
                  :model-value="stockPercentage"
                  :size="120"
                  :width="12"
                  :color="getStockLevelColor()"
                  class="mb-3"
                >
                  <div class="text-h5 font-weight-bold">{{ stockPercentage }}%</div>
                </v-progress-circular>
                <div class="text-body-2 text-medium-emphasis">
                  {{ stock.quantity }} / {{ stock.minStockLevel * 10 || 100 }}
                </div>
              </div>

              <v-alert
                v-if="stock.quantity < stock.minStockLevel"
                type="warning"
                variant="tonal"
                density="compact"
                icon="mdi-alert"
                text="Stock level is below minimum threshold"
              ></v-alert>
            </v-card-text>
          </v-card>

          <!-- Quick Actions -->
          <v-card elevation="2" class="mb-6">
            <v-card-title class="pa-5 d-flex align-center">
              <v-icon class="mr-3" color="primary">mdi-lightning-bolt</v-icon>
              <span class="text-h6">Quick Actions</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-5">
              <v-btn
                block
                variant="tonal"
                color="success"
                prepend-icon="mdi-plus-circle"
                class="mb-3 text-none"
                size="large"
              >
                Add Stock
              </v-btn>
              <v-btn
                block
                variant="tonal"
                color="warning"
                prepend-icon="mdi-minus-circle"
                class="mb-3 text-none"
                size="large"
              >
                Remove Stock
              </v-btn>
              <v-btn
                block
                variant="tonal"
                color="info"
                prepend-icon="mdi-swap-horizontal"
                class="mb-3 text-none"
                size="large"
              >
                Transfer Location
              </v-btn>
              <v-btn
                block
                variant="tonal"
                color="primary"
                prepend-icon="mdi-cart"
                class="text-none"
                size="large"
              >
                Order More
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- Additional Info -->
          <v-card elevation="2">
            <v-card-title class="pa-5 d-flex align-center">
              <v-icon class="mr-3" color="primary">mdi-information-outline</v-icon>
              <span class="text-h6">Additional Details</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-4">
              <v-list class="py-0 bg-transparent">
                <v-list-item class="px-0">
                  <template v-slot:prepend>
                    <v-icon>mdi-calendar-plus</v-icon>
                  </template>
                  <v-list-item-title class="text-body-2 text-medium-emphasis">
                    Added On
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-body-2 font-weight-medium">
                    {{ formatDate(stock.createdAt) }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="px-0">
                  <template v-slot:prepend>
                    <v-icon>mdi-calendar-edit</v-icon>
                  </template>
                  <v-list-item-title class="text-body-2 text-medium-emphasis">
                    Last Updated
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-body-2 font-weight-medium">
                    {{ formatDate(stock.updatedAt) }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="px-0">
                  <template v-slot:prepend>
                    <v-icon>mdi-identifier</v-icon>
                  </template>
                  <v-list-item-title class="text-body-2 text-medium-emphasis">
                    Item ID
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-body-2 font-weight-medium">
                    #{{ stock.id }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="450px" persistent>
      <v-card class="rounded-lg">
        <v-card-title class="pa-6 pb-4">
          <div class="d-flex align-center">
            <v-icon color="error" size="32" class="mr-3">mdi-alert-circle</v-icon>
            <span class="text-h5 font-weight-bold">Confirm Delete</span>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          <p class="text-body-1 mb-3">
            Are you sure you want to delete <strong>{{ stock?.name }}</strong>?
          </p>
          <v-alert type="warning" variant="tonal" density="compact">
            This action cannot be undone.
          </v-alert>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-6 pt-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="showDeleteDialog = false"
            class="text-none px-6"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            @click="confirmDelete"
            :loading="deleting"
            class="text-none px-6"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStockStore } from '@/stores/stockStore'

const route = useRoute()
const router = useRouter()
const stockStore = useStockStore()

const stock = ref(null)
const loading = ref(true)
const error = ref(null)
const showDeleteDialog = ref(false)
const deleting = ref(false)

// Breadcrumbs
const breadcrumbs = computed(() => [
  {
    title: 'Dashboard',
    disabled: false,
    to: { name: 'Dashboard' }
  },
  {
    title: 'Stocks',
    disabled: false,
    to: { name: 'Stocks' }
  },
  {
    title: stock.value?.name || 'Loading...',
    disabled: true
  }
])

// Computed values
const totalValue = computed(() => {
  if (!stock.value) return 0
  return (stock.value.price || 0) * (stock.value.quantity || 0)
})

const stockPercentage = computed(() => {
  if (!stock.value) return 0
  const maxStock = stock.value.minStockLevel * 10 || 100
  return Math.min(Math.round((stock.value.quantity / maxStock) * 100), 100)
})

// Mock activities
const mockActivities = ref([
  {
    action: 'Stock Added',
    details: '+50 units received from supplier',
    time: '2 days ago',
    color: 'success'
  },
  {
    action: 'Stock Removed',
    details: '-20 units used in Project #123',
    time: '5 days ago',
    color: 'warning'
  },
  {
    action: 'Price Updated',
    details: 'Price changed from ₹450 to ₹500',
    time: '1 week ago',
    color: 'info'
  },
  {
    action: 'Item Created',
    details: 'Stock item added to inventory',
    time: '2 weeks ago',
    color: 'primary'
  }
])

// Helper functions
const getStatusColor = (status) => {
  const colors = {
    'In Stock': 'success',
    'Out of Stock': 'error',
    'On Order': 'warning',
    'Discontinued': 'grey'
  }
  return colors[status] || 'grey'
}

const getStatusIcon = (status) => {
  const icons = {
    'In Stock': 'mdi-check-circle',
    'Out of Stock': 'mdi-close-circle',
    'On Order': 'mdi-clock-outline',
    'Discontinued': 'mdi-cancel'
  }
  return icons[status] || 'mdi-help-circle'
}

const getStockLevelColor = () => {
  if (stockPercentage.value >= 75) return 'success'
  if (stockPercentage.value >= 50) return 'info'
  if (stockPercentage.value >= 25) return 'warning'
  return 'error'
}

const formatCurrency = (value) => {
  if (!value) return '₹0'
  return `₹${value.toLocaleString('en-IN')}`
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Actions
const handleEdit = () => {
  // Navigate back to stocks page with edit dialog open
  router.push({ name: 'Stocks', query: { edit: stock.value.id } })
}

const handleDelete = () => {
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    await stockStore.deleteStock(stock.value.id)
    router.push({ name: 'Stocks' })
  } catch (err) {
    console.error('Failed to delete stock:', err)
  } finally {
    deleting.value = false
    showDeleteDialog.value = false
  }
}

// Load stock data
onMounted(async () => {
  const stockId = parseInt(route.params.id)
  
  try {
    // First try to find in store
    const existingStock = stockStore.stocks.find(s => s.id === stockId)
    
    if (existingStock) {
      stock.value = existingStock
    } else {
      // If not in store, fetch from API
      await stockStore.fetchStocks({ page: 1, itemsPerPage: 100 })
      stock.value = stockStore.stocks.find(s => s.id === stockId)
      
      if (!stock.value) {
        error.value = 'Stock item not found'
      }
    }
  } catch (err) {
    error.value = err.message || 'Failed to load stock details'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.info-item {
  padding: 12px 0;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}
</style>
