<template>
  <v-container fluid class="pa-6">
    <!-- Loading State -->
    <v-row v-if="loading" justify="center" class="my-12">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p class="mt-4 text-body-1">Loading dashboard...</p>
      </v-col>
    </v-row>

    <!-- Main Content -->
    <template v-else>
      <!-- Page Header -->
      <v-row class="mb-8">
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between flex-wrap ga-4">
            <div>
              <h1 class="text-h3 font-weight-bold mb-2"
                style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                Dashboard
              </h1>
              <p class="text-h6 text-medium-emphasis">
                Welcome back! Here's your inventory overview.
              </p>
            </div>
            <v-btn color="primary" prepend-icon="mdi-refresh" @click="refreshAll" :loading="isRefreshing" size="large"
              elevation="2">
              Refresh Data
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Key Metrics Row -->
      <v-row class="mb-8">
        <!-- Total Components -->
        <v-col cols="12" sm="6" lg="3">
          <v-card class="metric-card blue-card" elevation="4">
            <v-card-text class="pa-6">
              <div class="d-flex justify-space-between align-center mb-4">
                <div class="metric-icon">
                  <v-icon color="white" size="32">mdi-chip</v-icon>
                </div>
                <div class="metric-value mb-2">{{ formatNumber(dashboardStats.total_components) }}</div>
              </div>
              <div class="metric-label">Total Components</div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Total Categories -->
        <v-col cols="12" sm="6" lg="3">
          <v-card class="metric-card purple-card" elevation="4">
            <v-card-text class="pa-6">
              <div class="d-flex justify-space-between align-center mb-4">
                <div class="metric-icon">
                  <v-icon color="white" size="32">mdi-shape</v-icon>
                </div>
                <div class="metric-value mb-2">{{ formatNumber(dashboardStats.total_categories) }}</div>
              </div>
              <div class="metric-label">Categories</div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Active Projects -->
        <v-col cols="12" sm="6" lg="3">
          <v-card class="metric-card orange-card" elevation="4">
            <v-card-text class="pa-6">
              <div class="d-flex justify-space-between align-center mb-4">
                <div class="metric-icon">
                  <v-icon color="white" size="32">mdi-briefcase</v-icon>
                </div>
                <div class="metric-value mb-2">{{ formatNumber(dashboardStats.active_projects) }}</div>
              </div>
              <div class="metric-label">Active Projects</div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- YouTube Projects -->
        <v-col cols="12" sm="6" lg="3">
          <v-card class="metric-card red-card" elevation="4">
            <v-card-text class="pa-6">
              <div class="d-flex justify-space-between align-center mb-4">
                <div class="metric-icon">
                  <v-icon color="white" size="32">mdi-youtube</v-icon>
                </div>
                <div class="metric-value mb-2">{{ formatNumber(dashboardStats.youtube_projects) }}</div>
              </div>
              <div class="metric-label">YouTube Projects</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Secondary Metrics Row -->
      <v-row class="mb-8">
        <v-col cols="6" sm="3">
          <v-card class="stat-card" elevation="3" hover>
            <v-card-text class="pa-5">
              <div class="d-flex align-center ga-3">
                <v-avatar size="48" color="indigo-lighten-5">
                  <v-icon color="indigo" size="28">mdi-package-variant</v-icon>
                </v-avatar>
                <div>
                  <div class="stat-value">{{ formatNumber(dashboardStats.total_storage_boxes) }}</div>
                  <div class="stat-label">Storage Boxes</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="6" sm="3">
          <v-card class="stat-card" elevation="3" hover>
            <v-card-text class="pa-5">
              <div class="d-flex align-center ga-3">
                <v-avatar size="48" color="teal-lighten-5">
                  <v-icon color="teal" size="28">mdi-account-group</v-icon>
                </v-avatar>
                <div>
                  <div class="stat-value">{{ formatNumber(dashboardStats.total_vendors) }}</div>
                  <div class="stat-label">Vendors</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="6" sm="3">
          <v-card class="stat-card" elevation="3" hover>
            <v-card-text class="pa-5">
              <div class="d-flex align-center ga-3">
                <v-avatar size="48" color="amber-lighten-5">
                  <v-icon color="amber-darken-2" size="28">mdi-cart</v-icon>
                </v-avatar>
                <div>
                  <div class="stat-value">{{ formatNumber(dashboardStats.total_orders) }}</div>
                  <div class="stat-label">Total Orders</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="6" sm="3">
          <v-card class="stat-card" elevation="3" hover>
            <v-card-text class="pa-5">
              <div class="d-flex align-center ga-3">
                <v-avatar size="48" color="green-lighten-5">
                  <v-icon color="green" size="28">mdi-currency-inr</v-icon>
                </v-avatar>
                <div>
                  <div class="stat-value">₹{{ formatNumber(dashboardStats.total_order_value) }}</div>
                  <div class="stat-label">Order Value</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Content Grid -->
      <v-row class="mb-8">
        <!-- Quick Actions -->
        <v-col cols="12" md="4">
          <v-card elevation="3" class="content-card">
            <v-card-title class="pa-5 d-flex align-center bg-gradient">
              <v-icon class="mr-3" color="primary" size="28">mdi-lightning-bolt</v-icon>
              <span class="text-h6 font-weight-bold">Quick Actions</span>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-4">
              <v-list class="py-0 bg-transparent">
                <v-list-item v-for="action in quickActions" :key="action.title" :to="action.route"
                  class="mb-2 rounded-lg action-item" :prepend-icon="action.icon" elevation="1">
                  <v-list-item-title class="font-weight-bold">{{ action.title }}</v-list-item-title>
                  <v-list-item-subtitle class="text-caption">{{ action.subtitle }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Category Distribution -->
        <v-col cols="12" md="4">
          <v-card elevation="3" class="content-card">
            <v-card-title class="pa-5 d-flex align-center bg-gradient">
              <v-icon class="mr-3" color="purple" size="28">mdi-chart-pie</v-icon>
              <span class="text-h6 font-weight-bold">Top Categories</span>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-5">
              <div v-if="categoryDistribution.length > 0">
                <div v-for="(cat, index) in categoryDistribution.slice(0, 5)" :key="index" class="mb-4">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-body-2 font-weight-bold">{{ cat.category_name }}</span>
                    <v-chip size="x-small" :color="getCategoryColor(index)" variant="flat">
                      {{ cat.component_count }}
                    </v-chip>
                  </div>
                  <v-progress-linear
                    :model-value="cat.percentage || (cat.component_count / categoryDistribution[0].component_count) * 100"
                    :color="getCategoryColor(index)" height="10" rounded class="progress-bar" />
                </div>
              </div>
              <div v-else class="text-center py-12">
                <v-icon size="80" color="grey-lighten-2">mdi-shape-outline</v-icon>
                <p class="mt-4 text-body-2 text-medium-emphasis">No categories available</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Recent Activities -->
        <v-col cols="12" md="4">
          <v-card elevation="3" class="content-card">
            <v-card-title class="pa-5 d-flex align-center bg-gradient">
              <v-icon class="mr-3" color="info" size="28">mdi-history</v-icon>
              <span class="text-h6 font-weight-bold">Recent Activity</span>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-4">
              <v-timeline v-if="recentActivity.length > 0" density="compact" align="start" class="custom-timeline">
                <v-timeline-item v-for="(activity, index) in recentActivity.slice(0, 3)" :key="index"
                  :dot-color="activity.color" size="small">
                  <div class="text-body-2 font-weight-bold mb-1">{{ activity.activity_title }}</div>
                  <div class="text-caption text-medium-emphasis">{{ activity.time_ago }}</div>
                </v-timeline-item>
              </v-timeline>
              <div v-else class="text-center py-12">
                <v-icon size="80" color="grey-lighten-2">mdi-history</v-icon>
                <p class="mt-4 text-body-2 text-medium-emphasis">No recent activity</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Module Cards -->
      <v-row>
        <v-col cols="12" class="mb-4">
          <h2 class="text-h4 font-weight-bold">Manage Inventory</h2>
          <p class="text-body-1 text-medium-emphasis">Access your inventory management modules</p>
        </v-col>

        <!-- Components -->
        <v-col cols="12" sm="6" lg="4">
          <v-card class="module-card" elevation="3" hover :to="{ name: 'Stocks' }">
            <v-card-text class="pa-6">
              <v-avatar size="72" class="mb-4 module-avatar blue-bg">
                <v-icon color="white" size="40">mdi-chip</v-icon>
              </v-avatar>
              <h3 class="text-h6 font-weight-bold mb-2">Components</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">Manage electronic components and parts</p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Categories -->
        <v-col cols="12" sm="6" lg="4">
          <v-card class="module-card" elevation="3" hover :to="{ name: 'Categories' }">
            <v-card-text class="pa-6">
              <v-avatar size="72" class="mb-4 module-avatar purple-bg">
                <v-icon color="white" size="40">mdi-shape</v-icon>
              </v-avatar>
              <h3 class="text-h6 font-weight-bold mb-2">Categories</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">Organize components by categories</p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Storage Boxes -->
        <v-col cols="12" sm="6" lg="4">
          <v-card class="module-card" elevation="3" hover :to="{ name: 'Boxes' }">
            <v-card-text class="pa-6">
              <v-avatar size="72" class="mb-4 module-avatar indigo-bg">
                <v-icon color="white" size="40">mdi-package-variant</v-icon>
              </v-avatar>
              <h3 class="text-h6 font-weight-bold mb-2">Storage Boxes</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">Manage storage boxes and locations</p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Projects -->
        <v-col cols="12" sm="6" lg="4">
          <v-card class="module-card" elevation="3" hover :to="{ name: 'Projects' }">
            <v-card-text class="pa-6">
              <v-avatar size="72" class="mb-4 module-avatar orange-bg">
                <v-icon color="white" size="40">mdi-briefcase</v-icon>
              </v-avatar>
              <h3 class="text-h6 font-weight-bold mb-2">Projects</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">Track projects and component usage</p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Vendors -->
        <v-col cols="12" sm="6" lg="4">
          <v-card class="module-card" elevation="3" hover :to="{ name: 'Vendors' }">
            <v-card-text class="pa-6">
              <v-avatar size="72" class="mb-4 module-avatar teal-bg">
                <v-icon color="white" size="40">mdi-account-group</v-icon>
              </v-avatar>
              <h3 class="text-h6 font-weight-bold mb-2">Vendors</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">Manage vendor relationships</p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Orders -->
        <v-col cols="12" sm="6" lg="4">
          <v-card class="module-card" elevation="3" hover href="#">
            <v-card-text class="pa-6">
              <v-avatar size="72" class="mb-4 module-avatar amber-bg">
                <v-icon color="white" size="40">mdi-cart</v-icon>
              </v-avatar>
              <h3 class="text-h6 font-weight-bold mb-2">Orders</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">Track component orders and deliveries</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Error Snackbar -->
    <v-snackbar v-model="showError" :timeout="5000" color="error" location="top right">
      <div class="d-flex align-center">
        <v-icon class="mr-3">mdi-alert-circle</v-icon>
        {{ errorMessage }}
      </div>
      <template #actions>
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
  total_orders: 0,
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
/* Metric Cards with Enhanced Gradients */
.metric-card {
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.metric-card:hover::before {
  opacity: 1;
}

.metric-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) !important;
}

.blue-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.purple-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.orange-card {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.red-card {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
}

.metric-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
}

.metric-label {
  font-size: 1rem;
  opacity: 0.95;
  font-weight: 500;
}

/* Stat Cards Enhanced */
.stat-card {
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.8rem;
  color: #150b0b;
  margin-top: 4px;
  font-weight: 600;
}

/* Content Cards */
.content-card {
  border-radius: 20px;
  height: 100%;
  overflow: hidden;
}

.bg-gradient {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.action-item {
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.action-item:hover {
  background: rgba(102, 126, 234, 0.08);
  border-color: rgba(102, 126, 234, 0.2);
  transform: translateX(4px);
}

.progress-bar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Module Cards Enhanced */
.module-card {
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.module-card:hover {
  transform: translateY(-10px) scale(1.03);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
}

.module-avatar {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.blue-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.purple-bg {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.indigo-bg {
  background: linear-gradient(135deg, #5f72e4 0%, #9921e8 100%);
}

.orange-bg {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.teal-bg {
  background: linear-gradient(135deg, #13b0b9 0%, #05dfa2 100%);
}

.amber-bg {
  background: linear-gradient(135deg, #fdbb2d 0%, #f7971e 100%);
}

/* Timeline Custom Styling */
.custom-timeline {
  padding-left: 0;
}
</style>
