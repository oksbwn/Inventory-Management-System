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
        <p class="mt-4 text-body-1">Loading dashboard...</p>
      </v-col>
    </v-row>

    <!-- Main Content -->
    <template v-else>
      <!-- Page Header -->
      <v-row class="mb-6">
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between flex-wrap ga-4">
            <div>
              <h1 class="text-h4 font-weight-bold mb-2">Dashboard</h1>
              <p class="text-body-1 text-medium-emphasis">
                Welcome back! Here's your inventory overview.
              </p>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Key Metrics Row -->
      <v-row class="mb-6">
        <!-- Total Components -->
        <v-col cols="12" sm="6" lg="3">
          <v-card class="metric-card blue-card" elevation="2">
            <v-card-text class="pa-6">
              <div class="d-flex justify-space-between align-center mb-4">
                <div class="metric-icon blue-icon">
                  <v-icon color="white" size="28">mdi-chip</v-icon>
                </div>
                <v-chip size="small" color="blue-lighten-4" variant="flat">
                  Total
                </v-chip>
              </div>
              <div class="metric-value mb-1">{{ formatNumber(dashboardStats.total_components) }}</div>
              <div class="metric-label">Components</div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Total Categories -->
        <v-col cols="12" sm="6" lg="3">
          <v-card class="metric-card purple-card" elevation="2">
            <v-card-text class="pa-6">
              <div class="d-flex justify-space-between align-center mb-4">
                <div class="metric-icon purple-icon">
                  <v-icon color="white" size="28">mdi-shape</v-icon>
                </div>
                <v-chip size="small" color="purple-lighten-4" variant="flat">
                  Active
                </v-chip>
              </div>
              <div class="metric-value mb-1">{{ formatNumber(dashboardStats.total_categories) }}</div>
              <div class="metric-label">Categories</div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Active Projects -->
        <v-col cols="12" sm="6" lg="3">
          <v-card class="metric-card orange-card" elevation="2">
            <v-card-text class="pa-6">
              <div class="d-flex justify-space-between align-center mb-4">
                <div class="metric-icon orange-icon">
                  <v-icon color="white" size="28">mdi-briefcase</v-icon>
                </div>
                <v-chip size="small" color="orange-lighten-4" variant="flat">
                  {{ dashboardStats.active_projects || 0 }}
                </v-chip>
              </div>
              <div class="metric-value mb-1">{{ formatNumber(dashboardStats.active_projects) }}</div>
              <div class="metric-label">Active Projects</div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- YouTube Projects -->
        <v-col cols="12" sm="6" lg="3">
          <v-card class="metric-card red-card" elevation="2">
            <v-card-text class="pa-6">
              <div class="d-flex justify-space-between align-center mb-4">
                <div class="metric-icon red-icon">
                  <v-icon color="white" size="28">mdi-youtube</v-icon>
                </div>
                <v-chip size="small" color="red-lighten-4" variant="flat">
                  YT
                </v-chip>
              </div>
              <div class="metric-value mb-1">{{ formatNumber(dashboardStats.youtube_projects) }}</div>
              <div class="metric-label">YouTube Projects</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Secondary Metrics Row -->
      <v-row class="mb-6">
        <v-col cols="6" sm="3">
          <v-card class="stat-card" elevation="1" hover>
            <v-card-text class="pa-4">
              <div class="d-flex align-center ga-3">
                <v-icon color="indigo" size="32">mdi-package-variant</v-icon>
                <div>
                  <div class="stat-value">{{ formatNumber(dashboardStats.total_storage_boxes) }}</div>
                  <div class="stat-label">Boxes</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="6" sm="3">
          <v-card class="stat-card" elevation="1" hover>
            <v-card-text class="pa-4">
              <div class="d-flex align-center ga-3">
                <v-icon color="teal" size="32">mdi-account-group</v-icon>
                <div>
                  <div class="stat-value">{{ formatNumber(dashboardStats.total_vendors) }}</div>
                  <div class="stat-label">Vendors</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="6" sm="3">
          <v-card class="stat-card" elevation="1" hover>
            <v-card-text class="pa-4">
              <div class="d-flex align-center ga-3">
                <v-icon color="amber" size="32">mdi-cart</v-icon>
                <div>
                  <div class="stat-value">{{ formatNumber(dashboardStats.total_orders) }}</div>
                  <div class="stat-label">Orders</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="6" sm="3">
          <v-card class="stat-card" elevation="1" hover>
            <v-card-text class="pa-4">
              <div class="d-flex align-center ga-3">
                <v-icon color="green" size="32">mdi-currency-inr</v-icon>
                <div>
                  <div class="stat-value">₹{{ formatNumber(dashboardStats.total_order_value) }}</div>
                  <div class="stat-label">Value</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Content Grid -->
      <v-row class="mb-6">
        <!-- Quick Actions -->
        <v-col cols="12" md="4">
          <v-card elevation="2" class="content-card">
            <v-card-title class="pa-5 d-flex align-center">
              <v-icon class="mr-3" color="primary">mdi-lightning-bolt</v-icon>
              <span class="text-h6">Quick Actions</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-4">
              <v-list class="py-0">
                <v-list-item
                  v-for="action in quickActions"
                  :key="action.title"
                  :to="action.route"
                  class="mb-2 rounded"
                  :prepend-icon="action.icon"
                >
                  <v-list-item-title class="font-weight-medium">
                    {{ action.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ action.subtitle }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Category Distribution -->
        <v-col cols="12" md="4">
          <v-card elevation="2" class="content-card">
            <v-card-title class="pa-5 d-flex align-center">
              <v-icon class="mr-3" color="purple">mdi-chart-pie</v-icon>
              <span class="text-h6">Top Categories</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-5">
              <div v-if="categoryDistribution.length > 0">
                <div 
                  v-for="(cat, index) in categoryDistribution.slice(0, 5)" 
                  :key="index"
                  class="mb-4"
                >
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-body-2 font-weight-medium">{{ cat.category_name }}</span>
                    <span class="text-body-2 font-weight-bold text-primary">{{ cat.component_count }}</span>
                  </div>
                  <v-progress-linear
                    :model-value="cat.percentage || ((cat.component_count / categoryDistribution[0].component_count) * 100)"
                    :color="getCategoryColor(index)"
                    height="8"
                    rounded
                  ></v-progress-linear>
                </div>
              </div>
              <div v-else class="text-center py-8">
                <v-icon size="64" color="grey-lighten-2">mdi-shape-outline</v-icon>
                <p class="mt-3 text-body-2 text-medium-emphasis">No categories</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Recent Activities -->
        <v-col cols="12" md="4">
          <v-card elevation="2" class="content-card">
            <v-card-title class="pa-5 d-flex align-center">
              <v-icon class="mr-3" color="info">mdi-history</v-icon>
              <span class="text-h6">Recent Activity</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-4">
              <v-timeline v-if="recentActivity.length > 0" density="compact" align="start">
                <v-timeline-item
                  v-for="(activity, index) in recentActivity.slice(0, 5)"
                  :key="index"
                  :dot-color="activity.color"
                  size="small"
                >
                  <div class="text-body-2 font-weight-medium mb-1">
                    {{ activity.activity_title }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ activity.time_ago }}
                  </div>
                </v-timeline-item>
              </v-timeline>
              <div v-else class="text-center py-8">
                <v-icon size="64" color="grey-lighten-2">mdi-history</v-icon>
                <p class="mt-3 text-body-2 text-medium-emphasis">No activity</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Module Cards -->
      <v-row>
        <v-col cols="12">
          <h2 class="text-h5 font-weight-bold mb-4">Manage Inventory</h2>
        </v-col>

        <!-- Components -->
        <v-col cols="12" sm="6" lg="4">
          <v-card class="module-card" elevation="2" hover :to="{ name: 'Stocks' }">
            <v-card-text class="pa-6">
              <v-avatar size="64" color="blue-lighten-5" class="mb-4">
                <v-icon color="blue" size="36">mdi-chip</v-icon>
              </v-avatar>
              <h3 class="text-h6 font-weight-bold mb-2">Components</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Manage electronic components and parts
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Categories -->
        <v-col cols="12" sm="6" lg="4">
          <v-card class="module-card" elevation="2" hover :to="{ name: 'Categories' }">
            <v-card-text class="pa-6">
              <v-avatar size="64" color="purple-lighten-5" class="mb-4">
                <v-icon color="purple" size="36">mdi-shape</v-icon>
              </v-avatar>
              <h3 class="text-h6 font-weight-bold mb-2">Categories</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Organize components by categories
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Storage Boxes -->
        <v-col cols="12" sm="6" lg="4">
          <v-card class="module-card" elevation="2" hover :to="{ name: 'Boxes' }">
            <v-card-text class="pa-6">
              <v-avatar size="64" color="indigo-lighten-5" class="mb-4">
                <v-icon color="indigo" size="36">mdi-package-variant</v-icon>
              </v-avatar>
              <h3 class="text-h6 font-weight-bold mb-2">Storage Boxes</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Manage storage boxes and locations
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Projects -->
        <v-col cols="12" sm="6" lg="4">
          <v-card class="module-card" elevation="2" hover :to="{ name: 'Projects' }">
            <v-card-text class="pa-6">
              <v-avatar size="64" color="orange-lighten-5" class="mb-4">
                <v-icon color="orange" size="36">mdi-briefcase</v-icon>
              </v-avatar>
              <h3 class="text-h6 font-weight-bold mb-2">Projects</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Track projects and component usage
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Vendors -->
        <v-col cols="12" sm="6" lg="4">
          <v-card class="module-card" elevation="2" hover :to="{ name: 'Vendors' }">
            <v-card-text class="pa-6">
              <v-avatar size="64" color="teal-lighten-5" class="mb-4">
                <v-icon color="teal" size="36">mdi-account-group</v-icon>
              </v-avatar>
              <h3 class="text-h6 font-weight-bold mb-2">Vendors</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Manage vendor relationships
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Orders -->
        <v-col cols="12" sm="6" lg="4">
          <v-card class="module-card" elevation="2" hover href="#">
            <v-card-text class="pa-6">
              <v-avatar size="64" color="amber-lighten-5" class="mb-4">
                <v-icon color="amber" size="36">mdi-cart</v-icon>
              </v-avatar>
              <h3 class="text-h6 font-weight-bold mb-2">Orders</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Track component orders and deliveries
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showError"
      :timeout="5000"
      color="error"
      location="top right"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-3">mdi-alert-circle</v-icon>
        {{ errorMessage }}
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="showError = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import dashboardService from '@/api/services/dashboardService'

const currentTime = ref('')
const isRefreshing = ref(false)
const loading = ref(true)
const showError = ref(false)
const errorMessage = ref('')
let timeInterval = null

const dashboardStats = ref({
  total_components: 0,
  total_categories: 0,
  total_storage_boxes: 0,
  active_projects: 0,
  youtube_projects: 0,
  total_vendors: 0,
  pending_orders: 0,
  total_order_value: 0
})

const categoryDistribution = ref([])
const recentActivity = ref([])

const quickActions = ref([
  {
    title: 'Add Component',
    subtitle: 'New inventory item',
    icon: 'mdi-plus-circle',
    route: '/stocks'
  },
  {
    title: 'Create Project',
    subtitle: 'Start new project',
    icon: 'mdi-briefcase-plus',
    route: '/projects'
  },
  {
    title: 'Add Vendor',
    subtitle: 'New supplier',
    icon: 'mdi-account-plus',
    route: '/vendors'
  },
  {
    title: 'Place Order',
    subtitle: 'Order components',
    icon: 'mdi-cart-plus',
    route: '#'
  }
])

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num || 0)
}

const getCategoryColor = (index) => {
  const colors = ['primary', 'success', 'info', 'warning', 'error']
  return colors[index % colors.length]
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const fetchDashboardStats = async () => {
  try {
    const response = await dashboardService.getStats()
    dashboardStats.value = Array.isArray(response) ? response[0] || {} : response
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    errorMessage.value = 'Failed to load dashboard statistics'
    showError.value = true
  }
}

const fetchCategoryDistribution = async () => {
  try {
    const response = await dashboardService.getCategories()
    categoryDistribution.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to fetch category distribution:', error)
  }
}

const fetchRecentActivity = async () => {
  try {
    const response = await dashboardService.getActivities()
    recentActivity.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Failed to fetch recent activity:', error)
  }
}

const refreshAll = async () => {
  isRefreshing.value = true
  try {
    await Promise.all([
      fetchDashboardStats(),
      fetchCategoryDistribution(),
      fetchRecentActivity()
    ])
  } catch (error) {
    console.error('Failed to refresh dashboard:', error)
  } finally {
    isRefreshing.value = false
  }
}

onMounted(async () => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  try {
    await refreshAll()
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
/* Metric Cards */
.metric-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12) !important;
}

.blue-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
.purple-card { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; }
.orange-card { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; }
.red-card { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; }

.metric-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.metric-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Stat Cards */
.stat-card {
  border-radius: 12px;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-top: 2px;
}

/* Content Cards */
.content-card {
  border-radius: 16px;
  height: 100%;
}

/* Module Cards */
.module-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.module-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12) !important;
}
</style>
