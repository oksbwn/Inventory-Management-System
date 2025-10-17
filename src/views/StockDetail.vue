<template>
  <v-container fluid class="pa-6">
    <!-- Loading State -->
    <v-row v-if="loading" justify="center" class="my-12">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p class="mt-4 text-body-1">Loading stock details...</p>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="error" justify="center" class="my-12">
      <v-col cols="12" md="6" class="text-center">
        <v-icon size="80" color="error">mdi-alert-circle</v-icon>
        <h2 class="text-h5 mt-4 mb-2">Error Loading Stock</h2>
        <p class="text-body-1 text-medium-emphasis mb-6">{{ error }}</p>
        <v-btn color="primary" :to="{ name: 'Stocks' }">Back to Stocks</v-btn>
      </v-col>
    </v-row>

    <!-- Main Content -->
    <template v-else-if="stock">
      <!-- Header with Breadcrumbs -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-breadcrumbs :items="breadcrumbs" class="pa-0 mb-4">
            <template #divider>
              <v-icon>mdi-chevron-right</v-icon>
            </template>
          </v-breadcrumbs>
          <div class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold mb-2">{{ stock.name }}</h1>
              <div class="d-flex align-center gap-3">
                <v-chip :color="getStatusColor(stock.status)" size="small" variant="flat">
                  <v-icon start size="x-small">{{ getStatusIcon(stock.status) }}</v-icon>
                  {{ stock.status }}
                </v-chip>
                <v-chip size="small" variant="tonal" color="primary">{{ stock.category_name }}</v-chip>
                <span class="text-body-2 text-medium-emphasis">
                  SKU: <strong>{{ stock.sku || 'N/A' }}</strong>
                </span>
              </div>
            </div>
            <div class="d-flex gap-2">
              <v-btn color="primary" variant="outlined" prepend-icon="mdi-pencil" @click="handleEdit">Edit</v-btn>
              <v-btn color="error" variant="outlined" prepend-icon="mdi-delete" @click="handleDelete">Delete</v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Main Info Cards -->
      <v-row class="mb-6">
        <v-col cols="12" md="3">
          <v-card elevation="2" class="text-center pa-5">
            <v-avatar size="56" color="blue-lighten-5" class="mb-3">
              <v-icon color="blue" size="32">mdi-package-variant</v-icon>
            </v-avatar>
            <div class="text-h4 font-weight-bold">{{ stock.stock }}</div>
            <div class="text-body-2 text-medium-emphasis">Units in Stock</div>
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card elevation="2" class="text-center pa-5">
            <v-avatar size="56" color="green-lighten-5" class="mb-3">
              <v-icon color="green" size="32">mdi-currency-inr</v-icon>
            </v-avatar>
            <div class="text-h4 font-weight-bold">{{ formatCurrency(stock.avg_unit_price) }}</div>
            <div class="text-body-2 text-medium-emphasis">Average Unit Price</div>
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
            <div class="text-h4 font-weight-bold">{{ stock.min_stock_level || 10 }}</div>
            <div class="text-body-2 text-medium-emphasis">Min Stock Level</div>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="8">
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
                    <v-chip size="small" variant="tonal" color="primary">{{ stock.category_name }}</v-chip>
                  </div>
                </v-col>

                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="text-caption text-medium-emphasis mb-1">Status</div>
                    <v-chip :color="getStatusColor(stock.status)" size="small" variant="flat">{{ stock.status }}</v-chip>
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

          <v-card v-if="stock.description" elevation="2" class="mb-6">
            <v-card-title class="pa-5 d-flex align-center">
              <v-icon class="mr-3" color="primary">mdi-text</v-icon>
              <span class="text-h6">Description</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-5">
              <p class="text-body-1" v-html="stock.description"></p>
            </v-card-text>
          </v-card>

          <!-- PURCHASE HISTORY -->
          <v-card elevation="2" class="mb-6">
            <v-card-title class="pa-5 d-flex align-center">
              <v-icon class="mr-3" color="primary">mdi-package-variant</v-icon>
              <span class="text-h6">Purchase History</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text v-if="stock.purchase_history?.length" class="pa-5">
              <v-list dense>
                <v-list-item v-for="item in stock.purchase_history" :key="item.order_id">
                  <v-list-item-content>
                    <v-list-item-title>
                      Order #{{ item.order_id }} - {{ item.quantity_ordered }} units @ ₹{{ item.unit_cost }}
                    </v-list-item-title>
                    <v-list-item-subtitle><a :href="item.url" target="_blank" rel="noopener">Supplier Link</a></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-text v-else class="pa-5 text-center">No purchase history available.</v-card-text>
          </v-card>

          <!-- PROJECT USAGE HISTORY -->
          <v-card elevation="2" class="mb-6">
            <v-card-title class="pa-5 d-flex align-center">
              <v-icon class="mr-3" color="primary">mdi-briefcase-check</v-icon>
              <span class="text-h6">Project Usage History</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text v-if="stock.project_usage_history?.length" class="pa-5">
              <v-list dense>
                <v-list-item v-for="item in stock.project_usage_history" :key="item.project_id">
                  <v-list-item-content>
                    <v-list-item-title>
                      Project #{{ item.project_id }} - {{ item.quantity_used }} units
                    </v-list-item-title>
                    <v-list-item-subtitle>Used on {{ formatDate(item.date) }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-text v-else class="pa-5 text-center">No project usage recorded.</v-card-text>
          </v-card>

          <!-- GENERAL USAGE HISTORY -->
          <v-card elevation="2" class="mb-6">
            <v-card-title class="pa-5 d-flex align-center">
              <v-icon class="mr-3" color="primary">mdi-trending-flat</v-icon>
              <span class="text-h6">General Usage History</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text v-if="stock.general_usage_history?.length" class="pa-5">
              <v-list dense>
                <v-list-item v-for="item in stock.general_usage_history" :key="item.usage_id">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.purpose || 'General usage' }} - {{ item.quantity_used }} units
                    </v-list-item-title>
                    <v-list-item-subtitle>Used on {{ formatDate(item.usage_date) }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-text v-else class="pa-5 text-center">No general usage recorded.</v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <!-- Stock Level Indicator Card (unchanged) -->
          <!-- Quick Actions Card (unchanged) -->
          <!-- Additional Info Card (unchanged) -->
        </v-col>
      </v-row>
    </template>
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

// Breadcrumbs and computed properties (totalValue, stockPercentage) unchanged

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getStatusColor = (status) => {
  const colors = {
    'In Stock': 'success',
    'Out of Stock': 'error',
    'On Order': 'warning',
    'Discontinued': 'grey',
  }
  return colors[status] || 'grey'
}

const getStatusIcon = (status) => {
  const icons = {
    'In Stock': 'mdi-check-circle',
    'Out of Stock': 'mdi-close-circle',
    'On Order': 'mdi-clock-outline',
    'Discontinued': 'mdi-cancel',
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

// Actions: handleEdit, handleDelete, confirmDelete unchanged

// Load stock data
onMounted(async () => {
  const stockId = parseInt(route.params.id)

  try {
    const existingStock = stockStore.stocks.find((s) => s.id === stockId)

    if (existingStock) {
      stock.value = existingStock
    } else {
      await stockStore.fetchStocks({ page: 1, itemsPerPage: 100 })
      stock.value = stockStore.stocks.find((s) => s.id === stockId)

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
