<template>
  <v-container fluid class="pa-6">
    <!-- Page Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-primary mb-1">
              <v-icon size="32" class="mr-2">mdi-package-variant</v-icon>
              Storage Boxes
            </h1>
            <p class="text-body-2 text-medium-emphasis ml-11">
              Manage warehouse storage locations and boxes
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
            Add Storage Box
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="6" sm="3">
        <v-card class="stat-card" elevation="0" color="indigo-lighten-5">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-indigo-darken-2 mb-1">Total Boxes</div>
                <div class="text-h5 font-weight-bold text-indigo-darken-3">
                  {{ boxStore.totalItems || 0 }}
                </div>
              </div>
              <v-avatar size="48" color="indigo-lighten-4">
                <v-icon color="indigo-darken-2" size="28">mdi-package-variant</v-icon>
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
        <v-card class="stat-card" elevation="0" color="orange-lighten-5">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-orange-darken-2 mb-1">Near Full</div>
                <div class="text-h5 font-weight-bold text-orange-darken-3">
                  {{ nearFullCount }}
                </div>
              </div>
              <v-avatar size="48" color="orange-lighten-4">
                <v-icon color="orange-darken-2" size="28">mdi-alert</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" sm="3">
        <v-card class="stat-card" elevation="0" color="red-lighten-5">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-red-darken-2 mb-1">Full</div>
                <div class="text-h5 font-weight-bold text-red-darken-3">
                  {{ fullCount }}
                </div>
              </div>
              <v-avatar size="48" color="red-lighten-4">
                <v-icon color="red-darken-2" size="28">mdi-package-variant-closed</v-icon>
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
              placeholder="Search by box name, number, location..."
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
              :color="boxStore.isCacheValid ? 'success' : 'grey'"
              variant="tonal"
              size="small"
              class="mr-3"
            >
              <v-icon start size="small">mdi-database</v-icon>
              {{ boxStore.isCacheValid ? 'Cached' : 'Live Data' }}
            </v-chip>

            <v-btn-group variant="outlined" density="comfortable">
              <v-btn @click="refreshData" :loading="boxStore.loading">
                <v-icon>mdi-refresh</v-icon>
                <v-tooltip activator="parent" location="top">Refresh</v-tooltip>
              </v-btn>
              <v-btn>
                <v-icon>mdi-filter-variant</v-icon>
                <v-tooltip activator="parent" location="top">Filters</v-tooltip>
              </v-btn>
              <v-btn>
                <v-icon>mdi-download</v-icon>
                <v-tooltip activator="parent" location="top">Export</v-tooltip>
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
        :items="boxStore.boxes"
        :items-length="boxStore.totalItems"
        :loading="boxStore.loading"
        item-value="id"
        @update:options="loadBoxes"
        class="elevation-0 professional-table"
        hover
      >
        <!-- Box Name Column -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="40" color="indigo-lighten-5" class="mr-3">
              <v-icon color="indigo" size="20">mdi-package-variant</v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-medium">{{ item.name }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.boxNumber }}</div>
            </div>
          </div>
        </template>

        <!-- Location Column -->
        <template v-slot:item.location="{ item }">
          <div class="location-info">
            <div class="text-body-2">
              <v-icon size="small" class="mr-1">mdi-warehouse</v-icon>
              {{ item.warehouse }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ [item.zone, item.row, item.shelf, item.bin].filter(Boolean).join(' / ') || 'No specific location' }}
            </div>
          </div>
        </template>

        <!-- Capacity Column -->
        <template v-slot:item.capacity="{ item }">
          <div class="capacity-info">
            <div class="d-flex align-center mb-1">
              <span class="font-weight-medium">{{ item.currentOccupancy || 0 }} / {{ item.capacity }}</span>
            </div>
            <v-progress-linear
              :model-value="getOccupancyPercentage(item)"
              :color="getOccupancyColor(item)"
              height="6"
              rounded
            ></v-progress-linear>
          </div>
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

        <!-- Box Type Column -->
        <template v-slot:item.boxType="{ item }">
          <v-chip size="small" variant="tonal">
            {{ item.boxType }}
          </v-chip>
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

    <!-- Box Form Dialog -->
    <box-form-dialog
      v-model="showFormDialog"
      :box-item="selectedBox"
      @success="handleFormSuccess"
    />

    <!-- Delete Confirmation Dialog -->
    <delete-confirm-dialog
      v-model="showDeleteDialog"
      :item-name="selectedBox?.name"
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
        {{ boxStore.error }}
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="showError = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useBoxStore } from '@/stores/boxStore'
import BoxFormDialog from '@/components/BoxFormDialog.vue'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue'

const boxStore = useBoxStore()

const page = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref([])
const searchQuery = ref('')
const showError = ref(false)

const showFormDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedBox = ref(null)
const successMessage = ref('')
const showSuccessSnackbar = ref(false)

const headers = ref([
  { title: 'Box Name', key: 'name', align: 'start', sortable: true },
  { title: 'Location', key: 'location', align: 'start', sortable: false },
  { title: 'Capacity', key: 'capacity', align: 'start', sortable: true, width: '200px' },
  { title: 'Status', key: 'status', align: 'center', sortable: true, width: '130px' },
  { title: 'Type', key: 'boxType', align: 'center', sortable: true, width: '150px' },
  { title: 'Actions', key: 'actions', align: 'center', sortable: false, width: '150px' },
])

const activeCount = computed(() => {
  return boxStore.boxes.filter(b => b.status === 'Active').length
})

const nearFullCount = computed(() => {
  return boxStore.boxes.filter(b => {
    const percentage = (b.currentOccupancy / b.capacity) * 100
    return percentage >= 80 && percentage < 100
  }).length
})

const fullCount = computed(() => {
  return boxStore.boxes.filter(b => b.status === 'Full' || b.currentOccupancy >= b.capacity).length
})

const loadBoxes = async ({ page: p, itemsPerPage: ipp, sortBy: sb }) => {
  try {
    await boxStore.fetchBoxes({
      page: p,
      itemsPerPage: ipp,
      sortBy: sb,
      search: searchQuery.value
    })
  } catch (error) {
    console.error('Failed to load boxes:', error)
    showError.value = true
  }
}

const onSearch = async () => {
  page.value = 1
  await loadBoxes({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value
  })
}

const refreshData = async () => {
  boxStore.clearCache()
  await loadBoxes({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value
  })
}

const getOccupancyPercentage = (item) => {
  if (!item.capacity) return 0
  return Math.min((item.currentOccupancy / item.capacity) * 100, 100)
}

const getOccupancyColor = (item) => {
  const percentage = getOccupancyPercentage(item)
  if (percentage >= 100) return 'error'
  if (percentage >= 80) return 'warning'
  if (percentage >= 50) return 'info'
  return 'success'
}

const getStatusColor = (status) => {
  const colors = {
    'Active': 'success',
    'Inactive': 'grey',
    'Maintenance': 'warning',
    'Full': 'error',
    'Reserved': 'info'
  }
  return colors[status] || 'grey'
}

const getStatusIcon = (status) => {
  const icons = {
    'Active': 'mdi-check-circle',
    'Inactive': 'mdi-minus-circle',
    'Maintenance': 'mdi-wrench',
    'Full': 'mdi-package-variant-closed',
    'Reserved': 'mdi-lock'
  }
  return icons[status] || 'mdi-help-circle'
}

const openAddDialog = () => {
  selectedBox.value = null
  showFormDialog.value = true
}

const viewItem = (item) => {
  console.log('View box:', item)
}

const editItem = (item) => {
  selectedBox.value = { ...item }
  showFormDialog.value = true
}

const deleteItem = (item) => {
  selectedBox.value = item
  showDeleteDialog.value = true
}

const handleDeleteConfirm = async () => {
  try {
    await boxStore.deleteBox(selectedBox.value.id)
    showDeleteDialog.value = false
    successMessage.value = 'Storage box deleted successfully!'
    showSuccessSnackbar.value = true
    await refreshData()
  } catch (error) {
    console.error('Failed to delete box:', error)
    showError.value = true
  }
}

const handleFormSuccess = async (data) => {
  successMessage.value = data.message
  showSuccessSnackbar.value = true
  await refreshData()
}

watch(() => boxStore.error, (newError) => {
  if (newError) {
    showError.value = true
  }
})

onMounted(() => {
  loadBoxes({
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

.capacity-info {
  min-width: 150px;
}

.location-info {
  max-width: 300px;
}
</style>
