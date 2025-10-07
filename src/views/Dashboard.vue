<template>
  <v-container fluid class="pa-6">
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold mb-1">Dashboard</h1>
            <p class="text-body-2 text-medium-emphasis">
              Welcome back! Here's what's happening with your inventory today.
            </p>
          </div>
          <div class="d-flex align-center gap-3">
            <v-chip variant="flat" color="success" prepend-icon="mdi-clock-outline">
              {{ currentTime }}
            </v-chip>
            <v-btn
              color="primary"
              prepend-icon="mdi-refresh"
              @click="refreshAll"
              :loading="isRefreshing"
            >
              Refresh
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Key Metrics Row -->
    <v-row class="mb-6">
      <!-- Total Inventory Value -->
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="3">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <v-avatar size="56" color="blue-lighten-5">
                <v-icon size="32" color="blue">mdi-currency-inr</v-icon>
              </v-avatar>
              <v-chip size="small" color="success" variant="flat">
                <v-icon start size="x-small">mdi-trending-up</v-icon>
                +12.5%
              </v-chip>
            </div>
            <div class="text-h4 font-weight-bold mb-1">₹{{ formatNumber(totalInventoryValue) }}</div>
            <div class="text-body-2 text-medium-emphasis">Total Inventory Value</div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Total Stock Items -->
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="3">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <v-avatar size="56" color="green-lighten-5">
                <v-icon size="32" color="green">mdi-package-variant</v-icon>
              </v-avatar>
              <v-chip size="small" color="info" variant="flat">
                {{ stockStore.totalItems || 0 }}
              </v-chip>
            </div>
            <div class="text-h4 font-weight-bold mb-1">{{ formatNumber(totalStockItems) }}</div>
            <div class="text-body-2 text-medium-emphasis">Total Stock Items</div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Low Stock Alerts -->
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="3">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <v-avatar size="56" color="orange-lighten-5">
                <v-icon size="32" color="orange">mdi-alert</v-icon>
              </v-avatar>
              <v-chip size="small" color="warning" variant="flat">
                Alert
              </v-chip>
            </div>
            <div class="text-h4 font-weight-bold mb-1">{{ lowStockCount }}</div>
            <div class="text-body-2 text-medium-emphasis">Low Stock Alerts</div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Active Projects -->
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="3">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <v-avatar size="56" color="purple-lighten-5">
                <v-icon size="32" color="purple">mdi-briefcase</v-icon>
              </v-avatar>
              <v-chip size="small" color="primary" variant="flat">
                Active
              </v-chip>
            </div>
            <div class="text-h4 font-weight-bold mb-1">{{ activeProjects }}</div>
            <div class="text-body-2 text-medium-emphasis">Active Projects</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Secondary Metrics Row -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="metric-card" elevation="1" hover>
          <v-card-text class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="primary" size="large" class="mr-3">mdi-shape</v-icon>
              <div>
                <div class="text-h6 font-weight-bold">{{ categoryStore.totalItems || 0 }}</div>
                <div class="text-caption text-medium-emphasis">Categories</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="metric-card" elevation="1" hover>
          <v-card-text class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="indigo" size="large" class="mr-3">mdi-package-variant-closed</v-icon>
              <div>
                <div class="text-h6 font-weight-bold">{{ boxStore.totalItems || 0 }}</div>
                <div class="text-caption text-medium-emphasis">Storage Boxes</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="metric-card" elevation="1" hover>
          <v-card-text class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="teal" size="large" class="mr-3">mdi-account-group</v-icon>
              <div>
                <div class="text-h6 font-weight-bold">{{ vendorStore.totalItems || 0 }}</div>
                <div class="text-caption text-medium-emphasis">Vendors</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="metric-card" elevation="1" hover>
          <v-card-text class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="red" size="large" class="mr-3">mdi-package-variant-remove</v-icon>
              <div>
                <div class="text-h6 font-weight-bold">{{ outOfStockCount }}</div>
                <div class="text-caption text-medium-emphasis">Out of Stock</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions & Recent Activity -->
    <v-row class="mb-6">
      <!-- Quick Actions -->
      <v-col cols="12" md="4">
        <v-card elevation="2" class="rounded-lg">
          <v-card-title class="pa-5 pb-3">
            <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
            Quick Actions
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <v-list class="py-0">
              <v-list-item
                v-for="action in quickActions"
                :key="action.title"
                :to="action.route"
                class="px-3 mb-2 rounded"
              >
                <template v-slot:prepend>
                  <v-avatar :color="action.color + '-lighten-5'" size="40">
                    <v-icon :color="action.color" size="20">{{ action.icon }}</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium">
                  {{ action.title }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ action.subtitle }}
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-icon>mdi-chevron-right</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Stock Status Overview -->
      <v-col cols="12" md="4">
        <v-card elevation="2" class="rounded-lg">
          <v-card-title class="pa-5 pb-3">
            <v-icon class="mr-2">mdi-chart-donut</v-icon>
            Stock Status
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-5">
            <div class="status-item mb-4">
              <div class="d-flex justify-space-between mb-2">
                <span class="text-body-2">In Stock</span>
                <span class="text-body-2 font-weight-bold">{{ inStockPercentage }}%</span>
              </div>
              <v-progress-linear
                :model-value="inStockPercentage"
                color="success"
                height="8"
                rounded
              ></v-progress-linear>
            </div>

            <div class="status-item mb-4">
              <div class="d-flex justify-space-between mb-2">
                <span class="text-body-2">Low Stock</span>
                <span class="text-body-2 font-weight-bold">{{ lowStockPercentage }}%</span>
              </div>
              <v-progress-linear
                :model-value="lowStockPercentage"
                color="warning"
                height="8"
                rounded
              ></v-progress-linear>
            </div>

            <div class="status-item">
              <div class="d-flex justify-space-between mb-2">
                <span class="text-body-2">Out of Stock</span>
                <span class="text-body-2 font-weight-bold">{{ outOfStockPercentage }}%</span>
              </div>
              <v-progress-linear
                :model-value="outOfStockPercentage"
                color="error"
                height="8"
                rounded
              ></v-progress-linear>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Recent Activities -->
      <v-col cols="12" md="4">
        <v-card elevation="2" class="rounded-lg">
          <v-card-title class="pa-5 pb-3">
            <v-icon class="mr-2">mdi-history</v-icon>
            Recent Activity
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <v-timeline density="compact" align="start" class="activity-timeline">
              <v-timeline-item
                v-for="(activity, index) in recentActivities"
                :key="index"
                :dot-color="activity.color"
                size="small"
              >
                <div class="text-body-2 font-weight-medium mb-1">{{ activity.title }}</div>
                <div class="text-caption text-medium-emphasis">{{ activity.time }}</div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Module Cards Row -->
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">Manage Inventory</h2>
      </v-col>

      <!-- Stocks Card -->
      <v-col cols="12" md="6" lg="4">
        <v-card elevation="2" hover class="module-card">
          <v-card-text class="pa-5">
            <v-avatar size="64" color="blue-lighten-5" class="mb-4">
              <v-icon color="blue" size="36">mdi-cube-outline</v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-bold mb-2">Stocks</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Manage component stocks and inventory levels
            </p>
            <v-btn
              color="primary"
              variant="flat"
              :to="{ name: 'Stocks' }"
              block
            >
              View Stocks
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Categories Card -->
      <v-col cols="12" md="6" lg="4">
        <v-card elevation="2" hover class="module-card">
          <v-card-text class="pa-5">
            <v-avatar size="64" color="purple-lighten-5" class="mb-4">
              <v-icon color="purple" size="36">mdi-shape</v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-bold mb-2">Categories</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Browse and manage component categories
            </p>
            <v-btn
              color="success"
              variant="flat"
              :to="{ name: 'Categories' }"
              block
            >
              View Categories
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Boxes Card -->
      <v-col cols="12" md="6" lg="4">
        <v-card elevation="2" hover class="module-card">
          <v-card-text class="pa-5">
            <v-avatar size="64" color="indigo-lighten-5" class="mb-4">
              <v-icon color="indigo" size="36">mdi-package-variant</v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-bold mb-2">Storage Boxes</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Manage storage boxes and locations
            </p>
            <v-btn
              color="indigo"
              variant="flat"
              :to="{ name: 'Boxes' }"
              block
            >
              View Boxes
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Projects Card -->
      <v-col cols="12" md="6" lg="4">
        <v-card elevation="2" hover class="module-card">
          <v-card-text class="pa-5">
            <v-avatar size="64" color="orange-lighten-5" class="mb-4">
              <v-icon color="orange" size="36">mdi-briefcase</v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-bold mb-2">Projects</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Track and manage your projects
            </p>
            <v-btn
              color="orange"
              variant="flat"
              :to="{ name: 'Projects' }"
              block
            >
              View Projects
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Vendors Card -->
      <v-col cols="12" md="6" lg="4">
        <v-card elevation="2" hover class="module-card">
          <v-card-text class="pa-5">
            <v-avatar size="64" color="teal-lighten-5" class="mb-4">
              <v-icon color="teal" size="36">mdi-account-group</v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-bold mb-2">Vendors</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Manage vendor relationships
            </p>
            <v-btn
              color="teal"
              variant="flat"
              :to="{ name: 'Vendors' }"
              block
            >
              View Vendors
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStockStore } from '@/stores/stockStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useBoxStore } from '@/stores/boxStore'
import { useProjectStore } from '@/stores/projectStore'
import { useVendorStore } from '@/stores/vendorStore'

const stockStore = useStockStore()
const categoryStore = useCategoryStore()
const boxStore = useBoxStore()
const projectStore = useProjectStore()
const vendorStore = useVendorStore()

const currentTime = ref('')
const isRefreshing = ref(false)
let timeInterval = null

// Quick Actions
const quickActions = ref([
  {
    title: 'Add Stock Item',
    subtitle: 'Add new inventory',
    icon: 'mdi-plus-circle',
    color: 'blue',
    route: '/stocks'
  },
  {
    title: 'Create Project',
    subtitle: 'Start new project',
    icon: 'mdi-briefcase-plus',
    color: 'orange',
    route: '/projects'
  },
  {
    title: 'Add Vendor',
    subtitle: 'New supplier',
    icon: 'mdi-account-plus',
    color: 'teal',
    route: '/vendors'
  },
  {
    title: 'Storage Box',
    subtitle: 'Add location',
    icon: 'mdi-package-variant-plus',
    color: 'indigo',
    route: '/boxes'
  }
])

// Recent Activities
const recentActivities = ref([
  { title: 'Stock item added: Resistor 1K', time: '2 mins ago', color: 'success' },
  { title: 'Low stock alert: LED Blue', time: '15 mins ago', color: 'warning' },
  { title: 'Project updated: IoT Device', time: '1 hour ago', color: 'info' },
  { title: 'Vendor added: TechSupply Co.', time: '2 hours ago', color: 'primary' },
  { title: 'Box relocated: Box A-12', time: '3 hours ago', color: 'secondary' }
])

// Computed values
const totalInventoryValue = computed(() => {
  return stockStore.stocks.reduce((sum, item) => {
    return sum + (item.price || 0) * (item.quantity || 0)
  }, 0)
})

const totalStockItems = computed(() => {
  return stockStore.stocks.reduce((sum, item) => sum + (item.quantity || 0), 0)
})

const lowStockCount = computed(() => {
  return stockStore.stocks.filter(item => item.quantity > 0 && item.quantity < 10).length
})

const outOfStockCount = computed(() => {
  return stockStore.stocks.filter(item => item.quantity === 0).length
})

const activeProjects = computed(() => {
  return projectStore.projects.filter(p => p.status === 'In Progress').length
})

const inStockPercentage = computed(() => {
  const total = stockStore.totalItems || 1
  const inStock = stockStore.stocks.filter(item => item.status === 'In Stock').length
  return Math.round((inStock / total) * 100)
})

const lowStockPercentage = computed(() => {
  const total = stockStore.totalItems || 1
  return Math.round((lowStockCount.value / total) * 100)
})

const outOfStockPercentage = computed(() => {
  const total = stockStore.totalItems || 1
  return Math.round((outOfStockCount.value / total) * 100)
})

// Methods
const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num)
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const refreshAll = async () => {
  isRefreshing.value = true
  try {
    await Promise.all([
      stockStore.fetchStocks({ page: 1, itemsPerPage: 100 }),
      categoryStore.fetchCategories({ page: 1, itemsPerPage: 100 }),
      boxStore.fetchBoxes({ page: 1, itemsPerPage: 100 }),
      projectStore.fetchProjects({ page: 1, itemsPerPage: 100 }),
      vendorStore.fetchVendors({ page: 1, itemsPerPage: 100 })
    ])
  } catch (error) {
    console.error('Failed to refresh dashboard:', error)
  } finally {
    isRefreshing.value = false
  }
}

// Lifecycle
onMounted(async () => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  await refreshAll()
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.stat-card {
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 4px solid transparent;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15) !important;
}

.metric-card {
  border-radius: 12px;
  transition: all 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
}

.module-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  height: 100%;
}

.module-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12) !important;
}

.activity-timeline :deep(.v-timeline-item__body) {
  padding-top: 0;
}

.status-item {
  padding: 8px 0;
}

.gap-3 {
  gap: 12px;
}
</style>
