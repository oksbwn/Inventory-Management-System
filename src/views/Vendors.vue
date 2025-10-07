<template>
  <v-container fluid class="pa-6">
    <!-- Page Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-primary mb-1">
              <v-icon size="32" class="mr-2">mdi-account-group</v-icon>
              Vendors
            </h1>
            <p class="text-body-2 text-medium-emphasis ml-11">
              Manage supplier and vendor relationships
            </p>
          </div>
          <v-btn
            color="primary"
            size="large"
            prepend-icon="mdi-plus"
            elevation="2"
            class="text-none"
            @click="openAddDialog"
          >
            Add Vendor
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="6" sm="3">
        <v-card class="stat-card" elevation="0" color="teal-lighten-5">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-teal-darken-2 mb-1">Total Vendors</div>
                <div class="text-h5 font-weight-bold text-teal-darken-3">
                  {{ vendorStore.totalItems || 0 }}
                </div>
              </div>
              <v-avatar size="48" color="teal-lighten-4">
                <v-icon color="teal-darken-2" size="28">mdi-account-group</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" sm="3">
        <v-card class="stat-card" elevation="0" color="green-lighten-5">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-green-darken-2 mb-1">Active</div>
                <div class="text-h5 font-weight-bold text-green-darken-3">
                  {{ activeCount }}
                </div>
              </div>
              <v-avatar size="48" color="green-lighten-4">
                <v-icon color="green-darken-2" size="28">mdi-check-circle</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" sm="3">
        <v-card class="stat-card" elevation="0" color="amber-lighten-5">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-amber-darken-2 mb-1">Preferred</div>
                <div class="text-h5 font-weight-bold text-amber-darken-3">
                  {{ preferredCount }}
                </div>
              </div>
              <v-avatar size="48" color="amber-lighten-4">
                <v-icon color="amber-darken-2" size="28">mdi-star</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" sm="3">
        <v-card class="stat-card" elevation="0" color="cyan-lighten-5">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-cyan-darken-2 mb-1">Avg Rating</div>
                <div class="text-h5 font-weight-bold text-cyan-darken-3">
                  {{ averageRating.toFixed(1) }}
                </div>
              </div>
              <v-avatar size="48" color="cyan-lighten-4">
                <v-icon color="cyan-darken-2" size="28">mdi-star-circle</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Data Table Card -->
    <v-card elevation="2" class="rounded-lg">
      <v-card-title class="pa-6 pb-4">
        <v-row dense align="center">
          <v-col cols="12" md="7">
            <v-text-field
              v-model="searchQuery"
              density="comfortable"
              placeholder="Search vendors..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              clearable
              @click:clear="onSearch"
              @keyup.enter="onSearch"
            >
              <template v-slot:append-inner>
                <v-btn
                  color="primary"
                  variant="flat"
                  size="small"
                  class="text-none"
                  @click="onSearch"
                >
                  Search
                </v-btn>
              </template>
            </v-text-field>
          </v-col>

          <v-col cols="12" md="5" class="d-flex justify-end align-center">
            <v-chip
              :color="vendorStore.isCacheValid ? 'success' : 'grey'"
              variant="tonal"
              size="small"
              class="mr-3"
            >
              <v-icon start size="small">mdi-database</v-icon>
              {{ vendorStore.isCacheValid ? 'Cached' : 'Live' }}
            </v-chip>

            <v-btn-group variant="outlined" density="comfortable">
              <v-btn @click="refreshData" :loading="vendorStore.loading">
                <v-icon>mdi-refresh</v-icon>
                <v-tooltip activator="parent">Refresh</v-tooltip>
              </v-btn>
              <v-btn>
                <v-icon>mdi-filter-variant</v-icon>
                <v-tooltip activator="parent">Filters</v-tooltip>
              </v-btn>
              <v-btn>
                <v-icon>mdi-download</v-icon>
                <v-tooltip activator="parent">Export</v-tooltip>
              </v-btn>
            </v-btn-group>
          </v-col>
        </v-row>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Data Table -->
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        v-model:sort-by="sortBy"
        :headers="headers"
        :items="vendorStore.vendors"
        :items-length="vendorStore.totalItems"
        :loading="vendorStore.loading"
        item-value="id"
        @update:options="loadVendors"
        class="elevation-0 professional-table"
        hover
      >
        <!-- Company Name Column -->
        <template v-slot:item.companyName="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="40" color="teal-lighten-5" class="mr-3">
              <v-icon color="teal" size="20">mdi-domain</v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-medium">{{ item.companyName }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.vendorCode }}</div>
            </div>
          </div>
        </template>

        <!-- Contact Column -->
        <template v-slot:item.contact="{ item }">
          <div class="contact-info">
            <div class="text-body-2">
              <v-icon size="small" class="mr-1">mdi-account</v-icon>
              {{ item.contactPerson || 'N/A' }}
            </div>
            <div class="text-caption text-medium-emphasis">
              <v-icon size="small" class="mr-1">mdi-phone</v-icon>
              {{ item.phone }}
            </div>
            <div class="text-caption text-medium-emphasis">
              <v-icon size="small" class="mr-1">mdi-email</v-icon>
              {{ item.email }}
            </div>
          </div>
        </template>

        <!-- Business Type Column -->
        <template v-slot:item.businessType="{ item }">
          <v-chip size="small" variant="tonal" color="primary">
            {{ item.businessType }}
          </v-chip>
        </template>

        <!-- Rating Column -->
        <template v-slot:item.rating="{ item }">
          <v-rating
            :model-value="item.rating"
            readonly
            density="compact"
            size="small"
            color="amber"
          ></v-rating>
        </template>

        <!-- Status Column -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
            variant="flat"
          >
            <v-icon start size="x-small">{{ getStatusIcon(item.status) }}</v-icon>
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Preferred Column -->
        <template v-slot:item.isPreferred="{ item }">
          <v-icon v-if="item.isPreferred" color="amber" size="24">mdi-star</v-icon>
          <v-icon v-else color="grey-lighten-1" size="24">mdi-star-outline</v-icon>
        </template>

        <!-- Actions Column -->
        <template v-slot:item.actions="{ item }">
          <div class="action-buttons">
            <v-btn icon variant="text" size="small" color="info" @click="viewItem(item)">
              <v-icon size="20">mdi-eye-outline</v-icon>
              <v-tooltip activator="parent">View</v-tooltip>
            </v-btn>
            <v-btn icon variant="text" size="small" color="primary" @click="editItem(item)">
              <v-icon size="20">mdi-pencil-outline</v-icon>
              <v-tooltip activator="parent">Edit</v-tooltip>
            </v-btn>
            <v-btn icon variant="text" size="small" color="error" @click="deleteItem(item)">
              <v-icon size="20">mdi-delete-outline</v-icon>
              <v-tooltip activator="parent">Delete</v-tooltip>
            </v-btn>
          </div>
        </template>
      </v-data-table-server>
    </v-card>

    <!-- Vendor Form Dialog -->
    <vendor-form-dialog
      v-model="showFormDialog"
      :vendor-item="selectedVendor"
      @success="handleFormSuccess"
    />

    <!-- Delete Confirmation Dialog -->
    <delete-confirm-dialog
      v-model="showDeleteDialog"
      :item-name="selectedVendor?.companyName"
      @confirm="handleDeleteConfirm"
    />

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccessSnackbar"
      :timeout="3000"
      color="success"
      location="top right"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-check-circle</v-icon>
        {{ successMessage }}
      </div>
    </v-snackbar>

    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showError"
      :timeout="5000"
      color="error"
      location="top right"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-3">mdi-alert-circle</v-icon>
        {{ vendorStore.error }}
      </div>
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
const itemsPerPage = ref(10)
const sortBy = ref([])
const searchQuery = ref('')
const showError = ref(false)

const showFormDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedVendor = ref(null)
const successMessage = ref('')
const showSuccessSnackbar = ref(false)

const headers = ref([
  { title: 'Company Name', key: 'companyName', align: 'start', sortable: true },
  { title: 'Contact', key: 'contact', align: 'start', sortable: false, width: '250px' },
  { title: 'Business Type', key: 'businessType', align: 'center', sortable: true, width: '150px' },
  { title: 'Rating', key: 'rating', align: 'center', sortable: true, width: '150px' },
  { title: 'Status', key: 'status', align: 'center', sortable: true, width: '120px' },
  { title: 'Preferred', key: 'isPreferred', align: 'center', sortable: true, width: '100px' },
  { title: 'Actions', key: 'actions', align: 'center', sortable: false, width: '150px' },
])

const activeCount = computed(() => {
  return vendorStore.vendors.filter(v => v.status === 'Active').length
})

const preferredCount = computed(() => {
  return vendorStore.vendors.filter(v => v.isPreferred).length
})

const averageRating = computed(() => {
  if (vendorStore.vendors.length === 0) return 0
  const sum = vendorStore.vendors.reduce((acc, v) => acc + (v.rating || 0), 0)
  return sum / vendorStore.vendors.length
})

const loadVendors = async ({ page: p, itemsPerPage: ipp, sortBy: sb }) => {
  try {
    await vendorStore.fetchVendors({
      page: p,
      itemsPerPage: ipp,
      sortBy: sb,
      search: searchQuery.value
    })
  } catch (error) {
    console.error('Failed to load vendors:', error)
    showError.value = true
  }
}

const onSearch = async () => {
  page.value = 1
  await loadVendors({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value
  })
}

const refreshData = async () => {
  vendorStore.clearCache()
  await loadVendors({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value
  })
}

const getStatusColor = (status) => {
  const colors = {
    'Active': 'success',
    'Inactive': 'grey',
    'Pending': 'warning',
    'Blacklisted': 'error'
  }
  return colors[status] || 'grey'
}

const getStatusIcon = (status) => {
  const icons = {
    'Active': 'mdi-check-circle',
    'Inactive': 'mdi-minus-circle',
    'Pending': 'mdi-clock-outline',
    'Blacklisted': 'mdi-cancel'
  }
  return icons[status] || 'mdi-help-circle'
}

const openAddDialog = () => {
  selectedVendor.value = null
  showFormDialog.value = true
}

const viewItem = (item) => {
  console.log('View vendor:', item)
}

const editItem = (item) => {
  selectedVendor.value = { ...item }
  showFormDialog.value = true
}

const deleteItem = (item) => {
  selectedVendor.value = item
  showDeleteDialog.value = true
}

const handleDeleteConfirm = async () => {
  try {
    await vendorStore.deleteVendor(selectedVendor.value.id)
    showDeleteDialog.value = false
    successMessage.value = 'Vendor deleted successfully!'
    showSuccessSnackbar.value = true
    await refreshData()
  } catch (error) {
    console.error('Failed to delete vendor:', error)
    showError.value = true
  }
}

const handleFormSuccess = async (data) => {
  successMessage.value = data.message
  showSuccessSnackbar.value = true
  await refreshData()
}

watch(() => vendorStore.error, (newError) => {
  if (newError) {
    showError.value = true
  }
})

onMounted(() => {
  loadVendors({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value
  })
})
</script>

<style scoped>
.stat-card {
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.professional-table :deep(thead th) {
  background-color: rgb(var(--v-theme-surface-variant)) !important;
  font-weight: 600 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.75rem;
  padding: 16px 12px !important;
}

.professional-table :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.03) !important;
}

.professional-table :deep(tbody td) {
  padding: 12px !important;
}

.action-buttons {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.contact-info {
  max-width: 250px;
}
</style>
