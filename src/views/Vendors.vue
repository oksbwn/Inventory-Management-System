<template>
  <v-container fluid class="pa-6">
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-3">
          <div>
            <div class="d-flex align-center ga-3 mb-2">
              <v-avatar size="40" color="primary" variant="tonal">
                <v-icon size="24">mdi-store</v-icon>
              </v-avatar>
              <div>
                <h1 class="text-h5 font-weight-bold mb-0">Vendors</h1>
                <p class="text-caption text-medium-emphasis mb-0">
                  {{ vendorStore.totalVendors }} total vendors
                </p>
              </div>
            </div>
          </div>
          <v-btn color="primary" prepend-icon="mdi-plus" elevation="2" @click="openAddDialog">
            Add Vendor
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Metadata Cards -->
    <!-- Metadata Cards with Insights -->
    <v-row class="mb-6" dense>
      <v-col cols="12" sm="6" md="3">
        <v-card class="metadata-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon color="primary" size="35">mdi-store</v-icon>
            <div class="text-h6 font-weight-bold mt-1">{{ vendorsMetaData?.summary?.totalVendors || 0 }}</div>
            <div class="caption">Total Vendors</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="metadata-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon color="success" size="35">mdi-cart</v-icon>
            <div class="text-h6 font-weight-bold mt-1">{{ vendorsMetaData?.purchases?.totalOrders || 0 }}</div>
            <div class="caption">Total Orders</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="metadata-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon color="warning" size="35">mdi-currency-usd</v-icon>
            <div class="text-h6 font-weight-bold mt-1">₹{{ (vendorsMetaData?.purchases?.totalSpent || 0).toFixed(2) }}
            </div>
            <div class="caption">Total Spent</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="metadata-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon color="info" size="35">mdi-percent</v-icon>
            <div class="text-h6 font-weight-bold mt-1">{{ vendorsMetaData?.completeness?.iconCompletion || 0 }}%</div>
            <div class="caption">Icon Coverage</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Additional Insights Row -->
    <v-row class="mb-6" dense>
      <v-col cols="12" md="6">
        <v-card class="insight-card" elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-trophy</v-icon>
            Top Vendor
          </v-card-title>
          <v-card-text v-if="vendorsMetaData?.topVendor?.vendorName">
            <div class="d-flex align-center">
              <v-avatar v-if="vendorsMetaData?.topVendor?.vendorIcon" color="white" size="56" class="mr-3"
                elevation="1">
                <img :src="vendorsMetaData.topVendor.vendorIcon" alt="Top Vendor"
                  style="max-width: 100%; max-height: 100%; object-fit: contain; padding: 8px;">
              </v-avatar>
              <v-avatar v-else color="primary" size="56" class="mr-3">
                <v-icon size="32" color="white">mdi-store</v-icon>
              </v-avatar>
              <div>
                <div class="text-subtitle-1 font-weight-bold">{{ vendorsMetaData.topVendor.vendorName }}</div>
                <div class="text-caption text-medium-emphasis">
                  {{ vendorsMetaData.topVendor.orderCount }} orders • ₹{{ (vendorsMetaData.topVendor.totalSpent ||
                    0).toFixed(2) }}
                </div>
              </div>
            </div>
          </v-card-text>
          <v-card-text v-else class="text-center text-medium-emphasis">
            No order history yet
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="insight-card" elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon color="success" class="mr-2">mdi-clock-outline</v-icon>
            Recent Purchase
          </v-card-title>
          <v-card-text v-if="vendorsMetaData?.recentPurchase?.vendorName">
            <div class="d-flex align-center">
              <v-avatar v-if="vendorsMetaData?.recentPurchase?.vendorIcon" color="white" size="56" class="mr-3"
                elevation="1">
                <img :src="vendorsMetaData.recentPurchase.vendorIcon" alt="Recent Vendor"
                  style="max-width: 100%; max-height: 100%; object-fit: contain; padding: 8px;">
              </v-avatar>
              <v-avatar v-else color="success" size="56" class="mr-3">
                <v-icon size="32" color="white">mdi-store</v-icon>
              </v-avatar>
              <div>
                <div class="text-subtitle-1 font-weight-bold">{{ vendorsMetaData.recentPurchase.vendorName }}</div>
                <div class="text-caption text-medium-emphasis">
                  {{ new Date(vendorsMetaData.recentPurchase.orderDate).toLocaleDateString() }} • ₹{{
                    (vendorsMetaData.recentPurchase.totalCost || 0).toFixed(2) }}
                </div>
              </div>
            </div>
          </v-card-text>
          <v-card-text v-else class="text-center text-medium-emphasis">
            No purchases yet
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- Filter/Search and View Toggle -->
    <v-row class="mb-5" align="center">
      <v-col cols="12" md="8">
        <div class="d-flex align-center" style="gap: 8px;">
          <v-text-field v-model="searchQuery" label="Search vendors" prepend-inner-icon="mdi-magnify" clearable
            density="compact" variant="outlined" @keyup.enter="onSearch" @click:clear="onSearch" hide-details
            class="flex-grow-1" />
          <v-btn color="primary" @click="onSearch" height="40" width="40" min-width="40" class="pa-0"
            aria-label="Search">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </div>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end align-center">
        <v-btn-toggle v-model="viewMode" mandatory density="comfortable" variant="outlined" divided>
          <v-btn value="grid" aria-label="Grid view">
            <v-icon>mdi-view-grid</v-icon>
          </v-btn>
          <v-btn value="list" aria-label="List view">
            <v-icon>mdi-view-list</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- Main Card -->
    <v-card elevation="1" class="pa-4">
      <!-- Loading State -->
      <v-row v-if="vendorStore.loading && vendors.length === 0" justify="center">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate size="48" color="primary" />
          <div class="mt-3">Loading vendors...</div>
        </v-col>
      </v-row>
      <!-- Empty State -->
      <v-row v-else-if="vendors.length === 0">
        <v-col cols="12" class="text-center">
          <v-icon size="80" color="grey-lighten-2">mdi-store-outline</v-icon>
          <div class="mt-3">No vendors found</div>
          <v-btn color="primary" class="mt-3" @click="openAddDialog" prepend-icon="mdi-plus">Add Vendor</v-btn>
        </v-col>
      </v-row>

      <!-- Grid View -->
      <v-row v-else-if="viewMode === 'grid'" dense>
        <v-col v-for="vendor in vendors" :key="vendor.vendor_id" cols="12" sm="6" md="4" lg="3">
          <v-card elevation="2" class="vendor-card hoverable">
            <v-card-text>
              <div class="d-flex align-center mb-3">
                <v-avatar color="white" size="92" class="mr-3" elevation="1">
                  <div
                    style="padding: 8px; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                    <img :src="vendor.filename" alt="Vendor Icon"
                      style="max-width: 100%; max-height: 100%; object-fit: contain;" />
                  </div>
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">{{ vendor.vendor_name }}</div>
                  <div class="text-caption text-medium-emphasis">Website: {{ vendor.website }}</div>
                  <div class="text-caption text-medium-emphasis">Email: {{ vendor.contact_email }}</div>
                  <div class="text-caption text-medium-emphasis">Phone: {{ vendor.phone_number }}</div>
                </div>
              </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" class="action-btn" variant="flat" icon size="large" @click="editVendor(vendor)">
                <v-icon size="22">mdi-pencil</v-icon>
              </v-btn>
              <v-btn color="error" class="action-btn" variant="flat" icon size="large" @click="deleteVendor(vendor)">
                <v-icon size="22">mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- List View -->
      <v-list v-else>
        <v-list-item v-for="vendor in vendors" :key="vendor.vendor_id" class="vendor-list-item px-2 py-2">
          <template #prepend>
            <v-avatar color="indigo" size="48" class="mr-4">
              <v-icon size="28" color="white">mdi-store</v-icon>
            </v-avatar>
          </template>
          <v-list-item-title>
            <span class="font-weight-bold">{{ vendor.vendor_name }}</span>
            <span class="text-caption text-medium-emphasis ml-2">{{ vendor.website }}</span>
          </v-list-item-title>
          <v-list-item-subtitle>
            <span class="text-caption text-medium-emphasis">Email: {{ vendor.contact_email }}</span>
            <span class="text-caption text-medium-emphasis ml-3">Phone: {{ vendor.phone_number }}</span>
          </v-list-item-subtitle>
          <template #append>
            <v-btn color="primary" class="action-btn" variant="flat" icon size="large" @click="editVendor(vendor)">
              <v-icon size="22">mdi-pencil</v-icon>
            </v-btn>
            <v-btn color="error" class="action-btn" variant="flat" icon size="large" @click="deleteVendor(vendor)">
              <v-icon size="22">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>

      <!-- Pagination -->
      <v-row justify="center" v-if="totalPages > 1">
        <v-pagination v-model="page" :length="totalPages" @update:model-value="onPageChange" :total-visible="7" />
      </v-row>
    </v-card>

    <!-- Dialogs -->
    <VendorFormDialog v-model="showAddEditDialog" :vendor-item="selectedVendor" @success="handleVendorSuccess"
      @error="handleError" />
    <DeleteConfirmDialog v-model="showDeleteDialog" :item-name="selectedVendor?.vendor_name"
      @confirm="handleVendorDelete" />

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
.metadata-card {
  text-align: center;
  border-radius: 12px;
  min-height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metadata-card .v-icon {
  font-size: 32px;
  margin-bottom: 5px;
}

.vendor-card {
  cursor: pointer;
  transition: box-shadow 0.3s, border-color 0.3s;
  border-radius: 12px;
  border: 1.2px solid #e3e6ed;
}

.vendor-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.11);
  border-color: #1976d2;
}

.vendor-list-item {
  border-radius: 6px;
  border: 1px solid #ececec;
  margin-bottom: 8px;
  transition: background 0.18s;
}

.vendor-list-item:hover {
  background-color: #f3f8fa;
}

.action-btn {
  margin-right: 6px;
  background-color: #f2f4ff !important;
  color: #1976d2 !important;
  border-radius: 8px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: background-color 0.2s, box-shadow 0.2s;
}

.action-btn:last-child {
  margin-right: 0;
}

.action-btn:hover {
  background-color: #e3e0fa !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}
</style>
