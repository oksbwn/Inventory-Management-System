<template>
  <v-container fluid class="pa-6 boxes-page">
    <!-- Page Header -->
    <v-row class="mb-8">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-4">
          <div>
            <div class="d-flex align-center ga-3 mb-2">
              <v-avatar size="48" color="primary" class="header-avatar">
                <v-icon size="28">mdi-package-variant</v-icon>
              </v-avatar>
              <div>
                <h1 class="text-h4 font-weight-bold mb-1">Storage Boxes</h1>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Manage your {{ boxStore.totalBoxes || 0 }} storage boxes
                </p>
              </div>
            </div>
          </div>
          <BaseButton variant="contained" color="primary" size="large" class="add-box-btn" @click="openAddDialog">
            <v-icon class="mr-2">mdi-plus</v-icon>
            Add Box
          </BaseButton>
        </div>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-8" dense>
      <v-col cols="12" sm="3" md="3" lg="2-4">
        <BaseCard variant="default" elevation="0" class="stats-card">
          <div class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper primary-gradient">
                <v-icon color="white" size="24">mdi-shape</v-icon>
              </div>
              <v-chip size="small" color="primary" variant="tonal">Total</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ boxStore.totalBoxes || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Boxes</div>
          </div>
        </BaseCard>
      </v-col>

      <v-col cols="12" sm="3" md="3" lg="2-4">
        <BaseCard variant="default" elevation="0" class="stats-card">
          <div class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper success-gradient">
                <v-icon color="white" size="24">mdi-check-circle</v-icon>
              </div>
              <v-chip size="small" color="success" variant="tonal">Active</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ boxStore.activeBoxes || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Active</div>
          </div>
        </BaseCard>
      </v-col>

      <v-col cols="12" sm="3" md="3" lg="2-4">
        <BaseCard variant="default" elevation="0" class="stats-card">
          <div class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper grey-gradient">
                <v-icon color="white" size="24">mdi-package-variant-closed</v-icon>
              </div>
              <v-chip size="small" color="grey" variant="tonal">Empty</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ boxStore.emptyBoxes || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Empty</div>
          </div>
        </BaseCard>
      </v-col>

      <v-col cols="12" sm="3" md="3" lg="2-4">
        <BaseCard variant="default" elevation="0" class="stats-card">
          <div class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stats-icon-wrapper info-gradient">
                <v-icon color="white" size="24">mdi-database</v-icon>
              </div>
              <v-chip size="small" color="info" variant="tonal">Items</v-chip>
            </div>
            <div class="text-h5 font-weight-bold mb-1">{{ boxStore.totalComponents || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Components</div>
          </div>
        </BaseCard>
      </v-col>
    </v-row>

    <!-- Search and View Controls -->
    <v-row class="mb-6" align="center">
      <v-col cols="12" md="8">
        <div class="search-wrapper">
          <v-text-field v-model="searchQuery" placeholder="Search boxes..." prepend-inner-icon="mdi-magnify" clearable
            density="comfortable" variant="outlined" @keyup.enter="onSearch" @click:clear="onSearch" hide-details
            class="search-field" />
          <BaseButton variant="contained" color="primary" @click="onSearch" size="large" class="search-btn"
            aria-label="Search">
            <v-icon>mdi-magnify</v-icon>
          </BaseButton>
        </div>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end align-center ga-2">
        <v-btn-toggle v-model="viewMode" mandatory density="comfortable" variant="outlined" divided class="view-toggle">
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
    <BaseCard elevation="0" class="main-card">
      <!-- Loading State -->
      <BaseLoading v-if="boxStore.loading && boxes.length === 0" type="skeleton" :count="8" label="Loading boxes..." />

      <!-- Empty State -->
      <BaseEmpty v-else-if="boxes.length === 0" icon="mdi-package-variant-closed-plus" title="No boxes found"
        description="Get started by adding your first storage box" :action-button="true"
        action-text="Add Your First Box" @action="openAddDialog" />

      <!-- Grid View -->
      <v-row v-else-if="viewMode === 'grid'" class="pa-4">
        <v-col v-for="box in boxes" :key="box.box_id" cols="12" sm="6" md="4" lg="3">
          <BaseCard variant="default" elevation="0" class="box-card">
            <div class="pa-3">
              <!-- QR Code -->
              <div class="qr-code-wrapper mx-auto mb-3">
                <v-img :src="box.filename" class="qr-code-image" alt="Box QR Code" cover />
              </div>

              <!-- Box Info -->
              <div class="text-center">
                <v-chip :color="getSizeColor(box.box_size)" size="small" variant="tonal" class="font-weight-bold mb-2">
                  {{ box.box_size || 'N/A' }}
                </v-chip>

                <h3 class="text-subtitle-2 font-weight-bold mb-1 text-truncate">{{ box.box_label }}</h3>
                <p class="text-caption text-medium-emphasis mb-3">{{ box.box_code }}</p>

                <!-- Stats -->
                <div class="box-details">
                  <v-chip :color="box.component_count > 0 ? 'success' : 'grey'" size="x-small" variant="tonal"
                    class="mb-1">
                    <v-icon size="12" class="mr-1">mdi-cube</v-icon>
                    {{ box.component_count || 0 }}
                  </v-chip>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <template #actions>
              <div class="w-100 d-flex ga-2 pa-2">
                <BaseButton variant="tonal" color="primary" size="x-small" @click="editBox(box)" aria-label="Edit box"
                  class="flex-grow-1 action-btn-compact">
                  <v-icon size="16" class="mr-1">mdi-pencil</v-icon>
                  Edit
                </BaseButton>
                <BaseButton variant="tonal" color="error" size="x-small" @click="deleteBox(box)" aria-label="Delete box"
                  class="flex-grow-1 action-btn-compact">
                  <v-icon size="16" class="mr-1">mdi-delete</v-icon>
                  Delete
                </BaseButton>
              </div>
            </template>
          </BaseCard>
        </v-col>
      </v-row>

      <!-- List View -->
      <v-list v-else class="pa-4">
        <v-list-item v-for="box in boxes" :key="box.box_id" class="box-list-item mb-3" rounded="lg">
          <template #prepend>
            <div class="qr-code-wrapper-list">
              <v-img :src="box.filename" class="qr-code-image" alt="Box QR Code" cover />
            </div>
          </template>

          <v-list-item-title class="font-weight-bold mb-1">
            {{ box.box_label }}
          </v-list-item-title>

          <v-list-item-subtitle>
            <div class="d-flex flex-wrap ga-3 mt-1">
              <v-chip :color="getSizeColor(box.box_size)" size="x-small" variant="tonal" class="font-weight-bold">
                Size: {{ box.box_size || 'N/A' }}
              </v-chip>
              <span class="text-caption text-medium-emphasis">{{ box.box_code }}</span>
              <v-chip :color="box.component_count > 0 ? 'success' : 'grey'" size="x-small" variant="tonal">
                {{ box.component_count || 0 }} components
              </v-chip>
              <span v-if="box.recent_additions > 0" class="text-caption">
                <v-icon size="12" color="success" class="mr-1">mdi-plus-circle</v-icon>
                {{ box.recent_additions }} new
              </span>
            </div>
          </v-list-item-subtitle>

          <template #append>
            <div class="d-flex ga-2 align-center">
              <BaseButton variant="tonal" color="primary" size="small" class="action-btn-square-list"
                @click="editBox(box)" aria-label="Edit box">
                <v-icon>mdi-pencil</v-icon>
              </BaseButton>
              <BaseButton variant="tonal" color="error" size="small" class="action-btn-square-list"
                @click="deleteBox(box)" aria-label="Delete box">
                <v-icon>mdi-delete</v-icon>
              </BaseButton>
            </div>
          </template>
        </v-list-item>
      </v-list>

      <!-- Pagination -->
      <v-divider v-if="totalPages > 1" class="mt-4" />
      <div v-if="totalPages > 1" class="pa-4 d-flex justify-center">
        <v-pagination v-model="page" :length="totalPages" @update:model-value="onPageChange" :total-visible="7"
          size="small" rounded="circle" />
      </div>
    </BaseCard>

    <!-- Dialogs -->
    <box-form-dialog v-model="showAddEditDialog" :box-item="selectedBox" @success="handleBoxSuccess" />
    <delete-confirm-dialog v-model="showDeleteDialog" :item-name="selectedBox?.box_label" @confirm="handleBoxDelete" />

    <!-- Notifications -->
    <BaseSnackbar v-model="showSuccessSnackbar" :message="successMessage" type="success" :timeout="3000" />

    <BaseSnackbar v-model="showError" :message="errorMessage" type="error" :timeout="5000" />
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useBoxStore } from '@/stores/boxStore'
import BoxFormDialog from '@/components/dialogs/BoxFormDialog.vue'
import DeleteConfirmDialog from '@/components/dialogs/DeleteConfirmDialog.vue'

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

const loadBoxes = async () => {
  try {
    await boxStore.fetchBoxes({
      page: page.value,
      pageSize: itemsPerPage.value,
      search: searchQuery.value,
    })
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

const handleBoxSuccess = async ({ message, }) => {
  try {
    successMessage.value = message || 'Operation completed successfully'
    showAddEditDialog.value = false
    showSuccessSnackbar.value = true

    await loadBoxes()
  } catch (error) {
    errorMessage.value = error.message || 'Failed to refresh data'
    showError.value = true
  }
}

watch(() => boxStore.error, (val) => {
  if (val) {
    errorMessage.value = val
    showError.value = true
  }
})

// Helper to get size color
const getSizeColor = (size) => {
  const colorMap = {
    'X': 'blue',
    'XL': 'purple',
    'XXL': 'orange',
    'XXXL': 'red'
  }
  return colorMap[size] || 'grey'
}

onMounted(() => loadBoxes())
</script>

<style scoped>
.boxes-page {
  background: #fafbfc;
  min-height: 100vh;
}

.header-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.add-box-btn {
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

/* Gradients */
.primary-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.success-gradient {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.grey-gradient {
  background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%);
}

.info-gradient {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

/* QR Code Wrappers */
.qr-code-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  border: 2px solid #e8edf2;
  overflow: hidden;
  background: white;
  padding: 6px;
  transition: all 0.3s ease;
  margin: 0 auto;
}

.qr-code-wrapper:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: scale(1.03);
}

.qr-code-wrapper-list {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  border: 2px solid #e8edf2;
  overflow: hidden;
  background: white;
  padding: 4px;
  margin-right: 16px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.qr-code-wrapper-list:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  transform: scale(1.1);
}

.qr-code-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
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
  min-width: 46px;
  width: 46px;
  height: 46px;
  padding: 0;
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

/* Box Card - Compact Grid View */
.box-card {
  border: 1px solid #e8edf2;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.box-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
}

.box-details {
  min-height: 24px;
  display: flex;
  justify-content: center;
}

/* Action Buttons - Grid View (Compact) */
.action-btn-compact {
  min-width: auto !important;
  height: 32px !important;
  padding: 0 8px !important;
  border-radius: 6px;
  text-transform: none;
  letter-spacing: 0.3px;
  font-size: 0.75rem;
  flex: 1;
}

.action-btn-compact :deep(.v-btn__content) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 4px;
}

.action-btn-compact :deep(.v-icon) {
  margin: 0 !important;
  opacity: 1 !important;
}

/* Action Buttons - List View (Square Icons) */
.action-btn-square-list {
  min-width: 32px !important;
  width: 32px;
  height: 32px;
  padding: 0 !important;
  border-radius: 6px;
}

.action-btn-square-list :deep(.v-btn__content) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn-square-list :deep(.v-icon) {
  margin: 0 !important;
  opacity: 1 !important;
}

/* Box List Item */
.box-list-item {
  border: 1px solid #e8edf2;
  background: white;
  transition: all 0.3s ease;
}

.box-list-item:hover {
  background: #f7f9fc;
  border-color: #d0d7de;
  transform: translateX(4px);
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

.box-card,
.box-list-item {
  animation: fadeIn 0.5s ease-out;
}
</style>
