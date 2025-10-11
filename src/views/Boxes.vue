<template>
  <v-container fluid class="pa-6">
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-3">
          <div>
            <div class="d-flex align-center ga-3 mb-2">
              <v-avatar size="40" color="primary" variant="tonal">
                <v-icon size="24">mdi-shape</v-icon>
              </v-avatar>
              <div>
                <h1 class="text-h5 font-weight-bold mb-0">Storage Boxes</h1>
                <p class="text-caption text-medium-emphasis mb-0">
                  {{ boxStore.totalBoxes }} total boxes
                </p>
              </div>
            </div>
          </div>
          <v-btn 
            color="primary" 
            prepend-icon="mdi-plus"
            elevation="2"
            @click="openAddDialog"
          >
            Add Box
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Metadata Cards -->
    <v-row class="mb-6" dense>
      <v-col v-for="item in stats" :key="item.label" cols="12" sm="2">
        <v-card class="metadata-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon :color="item.color" size="35">{{ item.icon }}</v-icon>
            <div class="text-h6 font-weight-bold mt-1">{{ item.value }}</div>
            <div class="caption">{{ item.label }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filter/Search and View Toggle -->
    <v-row class="mb-5" align="center">
      <v-col cols="12" md="8">
        <v-text-field
          v-model="searchQuery"
          label="Search boxes"
          prepend-inner-icon="mdi-magnify"
          clearable
          density="comfortable"
          outlined
          @keyup.enter="onSearch"
          @click:clear="onSearch"
        />
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end">
        <v-btn :color="viewMode === 'grid' ? 'primary' : ''" icon @click="viewMode = 'grid'" aria-label="Grid view">
          <v-icon>mdi-view-grid</v-icon>
        </v-btn>
        <v-btn :color="viewMode === 'list' ? 'primary' : ''" icon @click="viewMode = 'list'" aria-label="List view">
          <v-icon>mdi-view-list</v-icon>
        </v-btn>
        <v-btn icon @click="refreshData" :loading="boxStore.loading" aria-label="Refresh">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Main Card -->
    <v-card elevation="1" class="pa-4">
      <!-- Loading State -->
      <v-row v-if="boxStore.loading && boxes.length === 0" justify="center">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate size="48" color="primary"/>
          <div class="mt-3">Loading boxes...</div>
        </v-col>
      </v-row>
      <!-- Empty State -->
      <v-row v-else-if="boxes.length === 0">
        <v-col cols="12" class="text-center">
          <v-icon size="80" color="grey lighten-2">mdi-shape-outline</v-icon>
          <div class="mt-3">No boxes found</div>
          <v-btn color="primary" class="mt-3" @click="openAddDialog" prepend-icon="mdi-plus">Add Box</v-btn>
        </v-col>
      </v-row>

      <!-- Grid View -->
      <v-row v-else-if="viewMode === 'grid'" dense>
        <v-col v-for="box in boxes" :key="box.box_id" cols="12" sm="6" md="4" lg="3">
          <v-card elevation="2" class="box-card hoverable">
            <v-card-text>
              <div class="d-flex align-center mb-3">
                <v-avatar color="indigo" size="48" class="mr-3">
                  <v-icon size="28" color="white">mdi-package-variant</v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">{{ box.box_label }}</div>
                  <div class="text-caption grey--text">{{ box.box_code }}</div>
                  <v-chip :color="box.component_count > 0 ? 'success' : 'grey'" size="small" class="mt-2" flat>
                    {{ box.component_count || 0 }} components
                  </v-chip>
                </div>
              </div>
              <div class="caption mb-1">
                <v-icon size="16" color="green" v-if="box.recent_additions > 0">mdi-plus-circle</v-icon>
                {{ box.recent_additions || 0 }} new (last 30d)
              </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" class="action-btn" variant="flat" icon size="large" @click="editBox(box)">
                <v-icon size="22">mdi-pencil</v-icon>
              </v-btn>
              <v-btn color="error" class="action-btn" variant="flat" icon size="large" @click="deleteBox(box)">
                <v-icon size="22">mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- List View -->
      <v-list v-else>
        <v-list-item v-for="box in boxes" :key="box.box_id" class="box-list-item px-2 py-2">
          <template #prepend>
            <v-avatar color="indigo" size="48" class="mr-4">
              <v-icon size="28" color="white">mdi-package-variant</v-icon>
            </v-avatar>
          </template>
          <v-list-item-title>
            <span class="font-weight-bold">{{ box.box_label }}</span>
            <span class="text-caption grey--text ml-2">{{ box.box_code }}</span>
          </v-list-item-title>
          <v-list-item-subtitle>
            <v-chip :color="box.component_count > 0 ? 'success' : 'grey'" size="small" flat class="mr-2">
              {{ box.component_count || 0 }} components
            </v-chip>
            <span v-if="box.recent_additions > 0" class="caption green--text">+{{ box.recent_additions }} new</span>
          </v-list-item-subtitle>
          <template #append>
            <v-btn color="primary" class="action-btn" variant="flat" icon size="large" @click="editBox(box)">
              <v-icon size="22">mdi-pencil</v-icon>
            </v-btn>
            <v-btn color="error" class="action-btn" variant="flat" icon size="large" @click="deleteBox(box)">
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
    <BoxFormDialog v-model="showAddEditDialog" :box-item="selectedBox" @success="handleBoxSuccess" @error="handleError" />
    <DeleteConfirmDialog v-model="showDeleteDialog" :item-name="selectedBox?.box_label" @confirm="handleBoxDelete" />

    <!-- Notifications -->
    <v-snackbar v-model="showSuccessSnackbar" color="success" :timeout="3000" top right>
      <v-icon left>mdi-check-circle</v-icon> {{ successMessage }}
    </v-snackbar>
    <v-snackbar v-model="showError" color="error" :timeout="5000" top right>
      <v-icon left>mdi-alert-circle</v-icon> {{ errorMessage }}
      <template v-slot:actions>
        <v-btn text @click="showError = false">Close</v-btn>
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
const itemsPerPage = ref(12)
const searchQuery = ref('')
const viewMode = ref('grid')

const showAddEditDialog = ref(false)
const selectedBox = ref(null)
const showDeleteDialog = ref(false)
const showSuccessSnackbar = ref(false)
const successMessage = ref('')
const showError = ref(false)
const errorMessage = ref('')

const boxes = computed(() => boxStore.boxes || [])
const totalPages = computed(() => {
  const total = boxStore.totalBoxes || 0
  return Math.ceil(total / itemsPerPage.value) || 1
})

const stats = computed(() => [
  { label: 'Total', value: boxStore.totalBoxes, icon: 'mdi-shape', color: 'primary' },
  { label: 'Active', value: boxStore.activeBoxes, icon: 'mdi-check-circle', color: 'success' },
  { label: 'Empty', value: boxStore.emptyBoxes, icon: 'mdi-package-variant-closed', color: 'grey' },
  { label: 'Components', value: boxStore.totalComponents, icon: 'mdi-database', color: 'blue' },
  { label: 'New (30d)', value: boxStore.recentAdditions, icon: 'mdi-trending-up', color: 'orange' },
])

const loadBoxes = async () => {
  try {
    await boxStore.fetchBoxes({
      page: page.value,
      pageSize: itemsPerPage.value,
      search: searchQuery.value,
    })
    await boxStore.fetchBoxesMeta()
  } catch (err) {
    errorMessage.value = err.message || 'Failed to load boxes'
    showError.value = true
  }
}

const onSearch = async () => {
  page.value = 1
  await loadBoxes()
}

const onPageChange = async () => {
  await loadBoxes()
}

const refreshData = async () => {
  boxStore.clearCache()
  await loadBoxes()
}

const openAddDialog = () => {
  selectedBox.value = null
  showAddEditDialog.value = true
}

const editBox = (box) => {
  selectedBox.value = box
  showAddEditDialog.value = true
}

const deleteBox = (box) => {
  selectedBox.value = box
  showDeleteDialog.value = true
}

const handleBoxDelete = async () => {
  try {
    await boxStore.deleteBox(selectedBox.value.box_id)
    showDeleteDialog.value = false
    successMessage.value = 'Box deleted successfully'
    showSuccessSnackbar.value = true
    await loadBoxes()
  } catch (error) {
    errorMessage.value = error.message || 'Failed to delete box'
    showError.value = true
  }
}

const handleBoxSuccess = ({ message }) => {
  successMessage.value = message || 'Operation successful'
  showAddEditDialog.value = false
  showSuccessSnackbar.value = true
  loadBoxes()
}

const handleError = ({ message }) => {
  errorMessage.value = message || 'An error occurred'
  showError.value = true
}

watch(() => boxStore.error, (val) => {
  if (val) {
    errorMessage.value = val
    showError.value = true
  }
})

onMounted(() => loadBoxes())
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
.box-card {
  cursor: pointer;
  transition: box-shadow 0.3s, border-color 0.3s;
  border-radius: 12px;
  border: 1.2px solid #e3e6ed;
}
.box-card:hover {
  box-shadow: 0 6px 20px rgba(0,0,0,0.11);
  border-color: #1976d2;
}
.box-list-item {
  border-radius: 6px;
  border: 1px solid #ececec;
  margin-bottom: 8px;
  transition: background 0.18s;
}
.box-list-item:hover {
  background-color: #f3f8fa;
}
.action-btn {
  margin-right: 6px;
  background-color: #f2f4ff !important;
  color: #1976d2 !important;
  border-radius: 8px !important;
  padding: 5px !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: background-color 0.2s, box-shadow 0.2s;
}
.action-btn:last-child {
  margin-right: 0;
}
.action-btn[aria-pressed='true'], .action-btn:hover {
  background-color: #e3e0fa !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.10) !important;
}
</style>
