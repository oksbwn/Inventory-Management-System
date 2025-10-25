<template>
  <v-container fluid class="pa-6 vendors-page">
    <!-- Page Header -->
    <v-row class="mb-8">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-4">
          <div>
            <div class="d-flex align-center ga-3 mb-2">
              <v-avatar size="48" color="primary" class="header-avatar">
                <v-icon size="28">mdi-store</v-icon>
              </v-avatar>
              <div>
                <h1 class="text-h4 font-weight-bold mb-1">Vendors</h1>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Manage your {{ vendorsMetaData?.summary?.totalVendors || 0 }} vendor relationships
                </p>
              </div>
            </div>
          </div>
          <v-btn 
            color="primary" 
            prepend-icon="mdi-plus" 
            size="large"
            class="add-vendor-btn"
            @click="openAddDialog"
          >
            Add Vendor
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
                <v-icon color="white" size="24">mdi-store</v-icon>
              </div>
              <v-chip size="small" color="primary" variant="tonal">Active</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ vendorsMetaData?.summary?.totalVendors || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Total Vendors</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stats-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper success-gradient">
                <v-icon color="white" size="24">mdi-cart</v-icon>
              </div>
              <v-chip size="small" color="success" variant="tonal">Orders</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ vendorsMetaData?.purchases?.totalOrders || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Total Orders</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stats-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper warning-gradient">
                <v-icon color="white" size="24">mdi-currency-inr</v-icon>
              </div>
              <v-chip size="small" color="warning" variant="tonal">Spent</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">₹{{ formatCurrency(vendorsMetaData?.purchases?.totalSpent || 0) }}</div>
            <div class="text-caption text-medium-emphasis">Total Spent</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stats-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper info-gradient">
                <v-icon color="white" size="24">mdi-image</v-icon>
              </div>
              <v-chip size="small" color="info" variant="tonal">{{ vendorsMetaData?.completeness?.iconCompletion || 0 }}%</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ vendorsMetaData?.summary?.vendorsWithIcon || 0 }}</div>
            <div class="text-caption text-medium-emphasis">With Icons</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Insights Cards -->
    <v-row class="mb-8" dense>
      <v-col cols="12" md="6">
        <v-card class="insight-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="d-flex align-center mb-4">
              <div class="insight-icon-badge primary-gradient mr-3">
                <v-icon color="white" size="20">mdi-trophy</v-icon>
              </div>
              <div>
                <div class="text-subtitle-2 text-medium-emphasis">Top Vendor</div>
                <div class="text-caption text-medium-emphasis">Most orders placed</div>
              </div>
            </div>
            <div v-if="vendorsMetaData?.topVendor?.vendorName" class="d-flex align-center">
              <v-avatar 
                v-if="vendorsMetaData?.topVendor?.vendorIcon" 
                color="white" 
                size="64" 
                class="mr-4 vendor-avatar"
              >
                <img 
                  :src="vendorsMetaData.topVendor.vendorIcon" 
                  alt="Top Vendor"
                  style="max-width: 85%; max-height: 85%; object-fit: contain;"
                />
              </v-avatar>
              <v-avatar v-else color="primary" size="64" class="mr-4" variant="tonal">
                <v-icon size="32">mdi-store</v-icon>
              </v-avatar>
              <div class="flex-grow-1">
                <div class="text-h6 font-weight-bold mb-1">{{ vendorsMetaData.topVendor.vendorName }}</div>
                <div class="d-flex align-center ga-3">
                  <v-chip size="x-small" color="primary" variant="tonal">
                    {{ vendorsMetaData.topVendor.orderCount }} orders
                  </v-chip>
                  <v-chip size="x-small" color="success" variant="tonal">
                    ₹{{ formatCurrency(vendorsMetaData.topVendor.totalSpent || 0) }}
                  </v-chip>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-6 text-medium-emphasis">
              <v-icon size="48" color="grey-lighten-1">mdi-trophy-outline</v-icon>
              <div class="mt-2">No order history yet</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="insight-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="d-flex align-center mb-4">
              <div class="insight-icon-badge success-gradient mr-3">
                <v-icon color="white" size="20">mdi-clock-outline</v-icon>
              </div>
              <div>
                <div class="text-subtitle-2 text-medium-emphasis">Recent Purchase</div>
                <div class="text-caption text-medium-emphasis">Latest transaction</div>
              </div>
            </div>
            <div v-if="vendorsMetaData?.recentPurchase?.vendorName" class="d-flex align-center">
              <v-avatar 
                v-if="vendorsMetaData?.recentPurchase?.vendorIcon" 
                color="white" 
                size="64" 
                class="mr-4 vendor-avatar"
              >
                <img 
                  :src="vendorsMetaData.recentPurchase.vendorIcon" 
                  alt="Recent Vendor"
                  style="max-width: 85%; max-height: 85%; object-fit: contain;"
                />
              </v-avatar>
              <v-avatar v-else color="success" size="64" class="mr-4" variant="tonal">
                <v-icon size="32">mdi-store</v-icon>
              </v-avatar>
              <div class="flex-grow-1">
                <div class="text-h6 font-weight-bold mb-1">{{ vendorsMetaData.recentPurchase.vendorName }}</div>
                <div class="d-flex align-center ga-3">
                  <v-chip size="x-small" color="info" variant="tonal">
                    {{ formatDate(vendorsMetaData.recentPurchase.orderDate) }}
                  </v-chip>
                  <v-chip size="x-small" color="success" variant="tonal">
                    ₹{{ formatCurrency(vendorsMetaData.recentPurchase.totalCost || 0) }}
                  </v-chip>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-6 text-medium-emphasis">
              <v-icon size="48" color="grey-lighten-1">mdi-cart-outline</v-icon>
              <div class="mt-2">No purchases yet</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Search and View Controls -->
    <v-row class="mb-6" align="center">
      <v-col cols="12" md="8">
        <div class="search-wrapper">
          <v-text-field 
            v-model="searchQuery" 
            placeholder="Search by name, email, or website..." 
            prepend-inner-icon="mdi-magnify" 
            clearable
            density="comfortable" 
            variant="outlined" 
            @keyup.enter="onSearch" 
            @click:clear="onSearch"
            hide-details
            class="search-field"
          />
          <v-btn 
            color="primary" 
            @click="onSearch" 
            height="46"
            width="46"
            class="search-btn"
            aria-label="Search"
          >
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </div>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end align-center">
        <v-btn-toggle 
          v-model="viewMode" 
          mandatory 
          density="comfortable"
          variant="outlined"
          divided
          class="view-toggle"
        >
          <v-btn value="grid" aria-label="Grid view">
            <v-icon>mdi-view-grid</v-icon>
          </v-btn>
          <v-btn value="list" aria-label="List view">
            <v-icon>mdi-view-list</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <v-card elevation="0" class="main-card">
      <!-- Loading State -->
      <v-row v-if="vendorStore.loading && vendors.length === 0" justify="center" class="py-12">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate size="64" color="primary" width="3" />
          <div class="mt-4 text-h6 text-medium-emphasis">Loading vendors...</div>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-row v-else-if="vendors.length === 0" class="py-12">
        <v-col cols="12" class="text-center">
          <div class="empty-state">
            <v-icon size="120" color="grey-lighten-2">mdi-store-outline</v-icon>
            <h3 class="text-h5 font-weight-bold mt-4 mb-2">No vendors found</h3>
            <p class="text-body-2 text-medium-emphasis mb-6">Get started by adding your first vendor</p>
            <v-btn 
              color="primary" 
              size="large"
              @click="openAddDialog" 
              prepend-icon="mdi-plus"
            >
              Add Your First Vendor
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Grid View -->
      <v-row v-else-if="viewMode === 'grid'" class="pa-4">
        <v-col v-for="vendor in vendors" :key="vendor.vendor_id" cols="12" sm="6" md="4" lg="3">
          <v-card class="vendor-card" elevation="0">
            <v-card-text class="pa-4">
              <div class="text-center mb-4">
                <v-avatar color="white" size="80" class="vendor-card-avatar mx-auto">
                  <img 
                    :src="vendor.filename" 
                    alt="Vendor Icon"
                    style="max-width: 85%; max-height: 85%; object-fit: contain;"
                  />
                </v-avatar>
              </div>
              <div class="text-center">
                <h3 class="text-h6 font-weight-bold mb-2">{{ vendor.vendor_name }}</h3>
                <div class="vendor-details">
                  <div class="text-caption text-medium-emphasis mb-1" v-if="vendor.website">
                    <v-icon size="14" class="mr-1">mdi-web</v-icon>
                    {{ truncate(vendor.website, 25) }}
                  </div>
                  <div class="text-caption text-medium-emphasis mb-1" v-if="vendor.contact_email">
                    <v-icon size="14" class="mr-1">mdi-email</v-icon>
                    {{ truncate(vendor.contact_email, 25) }}
                  </div>
                  <div class="text-caption text-medium-emphasis" v-if="vendor.phone_number">
                    <v-icon size="14" class="mr-1">mdi-phone</v-icon>
                    {{ vendor.phone_number }}
                  </div>
                </div>
              </div>
            </v-card-text>
            <v-divider />
            <v-card-actions class="pa-3 justify-center">
              <v-btn 
                color="primary" 
                variant="tonal" 
                size="small"
                @click="editVendor(vendor)"
              >
                <v-icon size="18" class="mr-1">mdi-pencil</v-icon>
                Edit
              </v-btn>
              <v-btn 
                color="error" 
                variant="tonal" 
                size="small"
                @click="deleteVendor(vendor)"
              >
                <v-icon size="18" class="mr-1">mdi-delete</v-icon>
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- List View -->
      <v-list v-else class="pa-4">
        <v-list-item 
          v-for="vendor in vendors" 
          :key="vendor.vendor_id" 
          class="vendor-list-item mb-3"
          rounded="lg"
        >
          <template #prepend>
            <v-avatar color="white" size="56" class="mr-4 list-avatar">
              <img 
                :src="vendor.filename" 
                alt="Vendor Icon"
                style="max-width: 85%; max-height: 85%; object-fit: contain;"
              />
            </v-avatar>
          </template>
          <v-list-item-title class="font-weight-bold mb-1">
            {{ vendor.vendor_name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <div class="d-flex flex-wrap ga-3 mt-1">
              <span v-if="vendor.website" class="text-caption">
                <v-icon size="12" class="mr-1">mdi-web</v-icon>
                {{ vendor.website }}
              </span>
              <span v-if="vendor.contact_email" class="text-caption">
                <v-icon size="12" class="mr-1">mdi-email</v-icon>
                {{ vendor.contact_email }}
              </span>
              <span v-if="vendor.phone_number" class="text-caption">
                <v-icon size="12" class="mr-1">mdi-phone</v-icon>
                {{ vendor.phone_number }}
              </span>
            </div>
          </v-list-item-subtitle>
          <template #append>
            <div class="d-flex ga-2">
              <v-btn 
                color="primary" 
                variant="tonal" 
                size="small"
                @click="editVendor(vendor)"
              >
                <v-icon size="18">mdi-pencil</v-icon>
              </v-btn>
              <v-btn 
                color="error" 
                variant="tonal" 
                size="small"
                @click="deleteVendor(vendor)"
              >
                <v-icon size="18">mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-list-item>
      </v-list>

      <!-- Pagination -->
      <v-divider v-if="totalPages > 1" class="mt-4" />
      <div v-if="totalPages > 1" class="pa-4 d-flex justify-center">
        <v-pagination 
          v-model="page" 
          :length="totalPages" 
          @update:model-value="onPageChange" 
          :total-visible="7"
          size="small"
          rounded="circle"
        />
      </div>
    </v-card>

    <!-- Dialogs -->
    <VendorFormDialog 
      v-model="showAddEditDialog" 
      :vendor-item="selectedVendor" 
      @success="handleVendorSuccess"
      @error="handleError" 
    />
    <DeleteConfirmDialog 
      v-model="showDeleteDialog" 
      :item-name="selectedVendor?.vendor_name"
      @confirm="handleVendorDelete" 
    />

    <!-- Notifications -->
    <v-snackbar v-model="showSuccessSnackbar" color="success" :timeout="3000" location="top right">
      <v-icon class="mr-2">mdi-check-circle</v-icon> {{ successMessage }}
    </v-snackbar>
    <v-snackbar v-model="showError" color="error" :timeout="5000" location="top right">
      <v-icon class="mr-2">mdi-alert-circle</v-icon> {{ errorMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showError = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useVendorStore } from '@/stores/vendorStore'
import VendorFormDialog from '@/components/VendorFormDialog.vue'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue'

const vendorStore = useVendorStore()
const page = ref(1)
const itemsPerPage = ref(12)
const searchQuery = ref('')
const viewMode = ref('grid')
const vendorsMetaData = ref(null)

const showAddEditDialog = ref(false)
const selectedVendor = ref(null)
const showDeleteDialog = ref(false)
const showSuccessSnackbar = ref(false)
const successMessage = ref('')
const showError = ref(false)
const errorMessage = ref('')

const vendors = computed(() => vendorStore.vendors || [])
const totalPages = computed(() => {
  const total = vendorStore.totalVendors || 0
  return Math.ceil(total / itemsPerPage.value) || 1
})

// Helper functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN').format(value)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  })
}

const truncate = (str, length) => {
  return str && str.length > length ? str.substring(0, length) + '...' : str
}

const loadVendors = async () => {
  try {
    await vendorStore.fetchVendors({
      page: page.value,
      pageSize: itemsPerPage.value,
      search: searchQuery.value,
    })
    const metaResponse = await vendorStore.fetchVendorsMeta()
    vendorsMetaData.value = metaResponse
  } catch (err) {
    errorMessage.value = err.message || 'Failed to load vendors'
    showError.value = true
  }
}

const onSearch = async () => {
  page.value = 1
  await loadVendors()
}

const onPageChange = async () => {
  await loadVendors()
}

const openAddDialog = () => {
  selectedVendor.value = null
  showAddEditDialog.value = true
}

const editVendor = (vendor) => {
  selectedVendor.value = vendor
  showAddEditDialog.value = true
}

const deleteVendor = (vendor) => {
  selectedVendor.value = vendor
  showDeleteDialog.value = true
}

const handleVendorDelete = async () => {
  try {
    await vendorStore.deleteVendor(selectedVendor.value.vendor_id)
    showDeleteDialog.value = false
    successMessage.value = 'Vendor deleted successfully'
    showSuccessSnackbar.value = true
    await loadVendors()
  } catch (error) {
    errorMessage.value = error.message || 'Failed to delete vendor'
    showError.value = true
  }
}

const handleVendorSuccess = ({ message }) => {
  successMessage.value = message || 'Operation successful'
  showAddEditDialog.value = false
  showSuccessSnackbar.value = true
  loadVendors()
}

const handleError = ({ message }) => {
  errorMessage.value = message || 'An error occurred'
  showError.value = true
}

watch(() => vendorStore.error, (val) => {
  if (val) {
    errorMessage.value = val
    showError.value = true
  }
})

onMounted(() => {
  loadVendors()
})
</script>

<style scoped>
.vendors-page {
  background: #fafbfc;
  min-height: 100vh;
}

/* Header */
.header-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.add-vendor-btn {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-transform: none;
  letter-spacing: 0.5px;
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
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.info-gradient {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

/* Insight Cards */
.insight-card {
  border: 1px solid #e8edf2;
  border-radius: 16px;
  background: white;
  transition: all 0.3s ease;
}

.insight-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.insight-icon-badge {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vendor-avatar {
  border: 2px solid #e8edf2;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

/* Search */
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

.view-toggle {
  border-radius: 12px;
  overflow: hidden;
}

/* Main Card */
.main-card {
  border: 1px solid #e8edf2;
  border-radius: 16px;
  background: white;
}

/* Vendor Cards */
.vendor-card {
  border: 1px solid #e8edf2;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  height: 100%;
}

.vendor-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.vendor-card-avatar {
  border: 2px solid #f0f3f7;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.vendor-card:hover .vendor-card-avatar {
  border-color: #667eea;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.2);
}

.vendor-details {
  min-height: 60px;
}

/* List View */
.vendor-list-item {
  border: 1px solid #e8edf2;
  background: white;
  transition: all 0.3s ease;
}

.vendor-list-item:hover {
  background: #f7f9fc;
  border-color: #d0d7de;
  transform: translateX(4px);
}

.list-avatar {
  border: 2px solid #f0f3f7;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* Empty State */
.empty-state {
  padding: 60px 20px;
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

.vendor-card,
.vendor-list-item {
  animation: fadeIn 0.5s ease-out;
}
</style>
