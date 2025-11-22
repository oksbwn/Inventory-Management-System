<template>
  <v-container fluid class="pa-6 stock-detail-page">
    <!-- Loading State -->
    <v-row v-if="loading" justify="center" class="my-12">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="64" width="3" />
        <div class="mt-4 text-h6 text-medium-emphasis">Loading stock details...</div>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="error" justify="center" class="my-12">
      <v-col cols="12" md="6" class="text-center">
        <v-icon size="120" color="error">mdi-alert-circle</v-icon>
        <h2 class="text-h5 font-weight-bold mt-4 mb-2">Error Loading Stock</h2>
        <p class="text-body-1 text-medium-emphasis mb-6">{{ error }}</p>
        <v-btn color="primary" size="large" :to="{ name: 'Components' }" prepend-icon="mdi-arrow-left">
          Back to Components
        </v-btn>
      </v-col>
    </v-row>

    <!-- Main Content -->
    <template v-else-if="stock">
      <!-- Back Button -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-btn variant="text" prepend-icon="mdi-arrow-left" :to="{ name: 'Components' }">
            Back to Stocks
          </v-btn>
        </v-col>
      </v-row>

      <!-- Header Section -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card elevation="0" class="header-card">
            <v-card-text class="pa-6">
              <div class="d-flex align-center ga-4">
                <v-avatar color="primary" size="72">
                  <v-img v-if="stock.filename" :src="stock.filename" cover />
                  <v-icon v-else size="40" color="white">mdi-cube-outline</v-icon>
                </v-avatar>
                <div class="flex-1-1">
                  <!-- Editable Product Name -->
                  <div v-if="editingField === 'name'" class="mb-2">
                    <v-text-field v-model="editForm.name" density="comfortable" variant="outlined" hide-details
                      autofocus @blur="saveField('name')" @keyup.enter="saveField('name')" @keyup.esc="cancelEdit" />
                  </div>
                  <h1 v-else class="text-h4 font-weight-bold mb-2 editable-field" @click="startEdit('name')"
                    tabindex="0">
                    {{ stock.name }}
                    <v-icon size="20" class="ml-2 edit-icon">mdi-pencil</v-icon>
                  </h1>

                  <div class="d-flex align-center ga-2 flex-wrap">
                    <v-chip :color="getStatusColor(stock.status)" size="small" variant="elevated">
                      <v-icon start size="14">{{ getStatusIcon(stock.status) }}</v-icon>
                      {{ stock.status }}
                    </v-chip>

                    <v-chip size="small" variant="tonal" color="primary">
                      {{ stock.category_name }}
                    </v-chip>

                    <v-chip color="green" size="small" variant="outlined">
                      <v-icon size="16" class="mr-1">mdi-package-variant</v-icon>
                      {{ stock.stock }} Units
                    </v-chip>

                    <v-chip color="blue" size="small" variant="outlined">
                      <v-icon size="16" class="mr-1">mdi-currency-inr</v-icon>
                      {{ formatCurrency(totalValue) }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Stats Cards -->
      <v-row class="mb-8" dense>
        <v-col cols="12" sm="6" md="3">
          <v-card class="stats-card" elevation="0">
            <v-card-text class="pa-5">
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="stats-icon-wrapper primary-gradient">
                  <v-icon color="white" size="24">mdi-package-variant</v-icon>
                </div>
                <v-chip size="small" color="primary" variant="tonal">Stock</v-chip>
              </div>
              <div class="text-h5 font-weight-bold mb-1">{{ stock.stock }}</div>
              <div class="text-caption text-medium-emphasis">Units in Stock</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="stats-card" elevation="0">
            <v-card-text class="pa-5">
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="stats-icon-wrapper success-gradient">
                  <v-icon color="white" size="24">mdi-currency-inr</v-icon>
                </div>
                <v-chip size="small" color="success" variant="tonal">Price</v-chip>
              </div>
              <div class="text-h5 font-weight-bold mb-1">{{ formatCurrency(stock.avg_unit_price) }}</div>
              <div class="text-caption text-medium-emphasis">Avg Unit Price</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="stats-card" elevation="0">
            <v-card-text class="pa-5">
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="stats-icon-wrapper info-gradient">
                  <v-icon color="white" size="24">mdi-chart-line</v-icon>
                </div>
                <v-chip size="small" color="blue" variant="tonal">Value</v-chip>
              </div>
              <div class="text-h5 font-weight-bold mb-1">{{ formatCurrency(totalValue) }}</div>
              <div class="text-caption text-medium-emphasis">Total Value</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="stats-card" elevation="0">
            <v-card-text class="pa-5">
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="stats-icon-wrapper warning-gradient">
                  <v-icon color="white" size="24">mdi-alert</v-icon>
                </div>
                <v-chip size="small" color="warning" variant="tonal">Minimum</v-chip>
              </div>
              <div class="text-h5 font-weight-bold mb-1">{{ stock.min_stock_level || 10 }}</div>
              <div class="text-caption text-medium-emphasis">Min Stock Level</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Main Content -->
      <v-row>
        <!-- Left Column -->
        <v-col cols="12" md="8">
          <!-- Description Section -->
          <!-- Description Section -->
          <v-card elevation="0" class="content-card mb-6">
            <v-card-title class="pa-6 pb-4">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-icon size="24" class="mr-2">mdi-text-box</v-icon>
                  Description
                </div>
                <v-btn v-if="!editingField || editingField !== 'description'" size="small" variant="text"
                  prepend-icon="mdi-pencil" @click="startEdit('description')">
                  Edit
                </v-btn>
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <div v-if="editingField === 'description'">
                <v-textarea v-model="editForm.description" variant="outlined" rows="6"
                  placeholder="Enter component description..." hide-details />
                <div class="d-flex ga-2 mt-4">
                  <v-btn color="primary" @click="saveField('description')" :loading="saving">Save</v-btn>
                  <v-btn variant="outlined" @click="cancelEdit">Cancel</v-btn>
                </div>
              </div>
              <div v-else>
                <div v-if="stock.description" class="description-content">
                  {{ stock.description }}
                </div>
                <div v-else class="text-medium-emphasis">No description provided</div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Purchase History -->
          <!-- Purchase History -->
          <v-card elevation="0" class="content-card mb-6">
            <v-card-title class="pa-6 pb-4">
              <div class="d-flex align-center">
                <v-icon size="24" class="mr-2">mdi-cart</v-icon>
                Purchase History
              </div>
            </v-card-title>
            <v-divider />
            <!-- Loading State -->
            <v-card-text v-if="loadingPurchaseHistory" class="pa-8 text-center">
              <v-progress-circular indeterminate color="primary" />
              <p class="text-body-2 text-medium-emphasis mt-3">Loading purchase history...</p>
            </v-card-text>

            <!-- Purchase History List -->
            <v-card-text v-else-if="purchaseHistory && purchaseHistory.length > 0" class="pa-0">
              <v-list lines="three">
                <v-list-item v-for="(item, index) in purchaseHistory" :key="item.order_part_id">
                  <template #prepend>
                    <v-avatar color="primary" variant="tonal" size="48">
                      <v-icon size="24">mdi-package-variant</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="font-weight-medium mb-1">
                    Order #{{ item.order_id }} - {{ item.quantity_ordered }} units @ ₹{{ item.unit_cost }}
                  </v-list-item-title>

                  <v-list-item-subtitle class="mb-1">
                    <v-icon size="14" class="mr-1">mdi-store</v-icon>
                    {{ item.vendor_name }}
                    <v-chip size="x-small" :color="item.order_status === 'Delivered' ? 'success' : 'warning'"
                      variant="tonal" class="ml-2">
                      {{ item.order_status }}
                    </v-chip>
                  </v-list-item-subtitle>

                  <v-list-item-subtitle>
                    <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
                    Ordered: {{ formatDate(item.order_date) }}
                    <span v-if="item.delivery_date" class="ml-3">
                      <v-icon size="14" class="mr-1">mdi-truck-delivery</v-icon>
                      Delivered: {{ formatDate(item.delivery_date) }}
                    </span>
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="text-right">
                      <div class="text-h6 font-weight-bold text-success">
                        {{ formatCurrency(item.total_cost) }}
                      </div>
                      <v-btn v-if="item.url" size="x-small" variant="tonal" color="primary" :href="item.url"
                        target="_blank" rel="noopener" class="mt-1">
                        <v-icon size="14" class="mr-1">mdi-link</v-icon>
                        View Link
                      </v-btn>
                    </div>
                  </template>

                  <v-divider v-if="index < purchaseHistory.length - 1" class="mt-3" />
                </v-list-item>
              </v-list>
            </v-card-text>

            <!-- Empty State -->
            <v-card-text v-else class="pa-8 text-center">
              <v-icon size="64" color="grey-lighten-2">mdi-package-variant-closed</v-icon>
              <p class="text-body-2 text-medium-emphasis mt-3">No purchase history available</p>
            </v-card-text>
          </v-card>

          <!-- Project Usage History -->
          <v-card elevation="0" class="content-card mb-6">
            <v-card-title class="pa-6 pb-4">
              <div class="d-flex align-center">
                <v-icon size="24" class="mr-2">mdi-briefcase</v-icon>
                Project Usage History
              </div>
            </v-card-title>
            <v-divider />

            <!-- Loading State -->
            <v-card-text v-if="loadingProjectUsage" class="pa-8 text-center">
              <v-progress-circular indeterminate color="primary" />
              <p class="text-body-2 text-medium-emphasis mt-3">Loading project usage...</p>
            </v-card-text>

            <!-- Project Usage List -->
            <v-card-text v-else-if="projectUsage && projectUsage[0].component_id" class="pa-0">
              <v-list lines="three">
                <v-list-item v-for="(item, index) in projectUsage" :key="`${item.project_id}-${item.date}`">
                  <template #prepend>
                    <v-avatar :color="item.is_yt_project ? 'red' : 'success'" variant="tonal" size="48">
                      <v-icon size="24">{{ item.is_yt_project ? 'mdi-youtube' : 'mdi-briefcase' }}</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="font-weight-medium mb-1">
                    {{ item.project_name }} - {{ item.quantity_used }} units used
                  </v-list-item-title>

                  <v-list-item-subtitle class="mb-1">
                    <v-chip size="x-small" :color="item.project_status === 'Completed' ? 'success' : 'warning'"
                      variant="tonal">
                      {{ item.project_status }}
                    </v-chip>
                    <span v-if="item.is_yt_project" class="ml-2">
                      <v-icon size="14" class="mr-1">mdi-youtube</v-icon>
                      YouTube Project
                    </span>
                  </v-list-item-subtitle>

                  <v-list-item-subtitle>
                    <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
                    Used on: {{ formatDate(item.date) }}
                    <span v-if="item.git_repository" class="ml-3">
                      <v-icon size="14" class="mr-1">mdi-git</v-icon>
                      <a :href="item.git_repository" target="_blank" rel="noopener" class="text-primary">
                        View Repository
                      </a>
                    </span>
                  </v-list-item-subtitle>

                  <template #append>
                    <v-btn size="small" variant="tonal" color="primary"
                      :to="{ name: 'ProjectDetail', params: { id: item.project_id } }">
                      <v-icon size="16" class="mr-1">mdi-eye</v-icon>
                      View Project
                    </v-btn>
                  </template>

                  <v-divider v-if="index < projectUsage.length - 1" class="mt-3" />
                </v-list-item>
              </v-list>
            </v-card-text>

            <!-- Empty State -->
            <v-card-text v-else class="pa-8 text-center">
              <v-icon size="64" color="grey-lighten-2">mdi-briefcase-outline</v-icon>
              <p class="text-body-2 text-medium-emphasis mt-3">No project usage recorded</p>
            </v-card-text>
          </v-card>

          <!-- General Usage History -->
          <v-card elevation="0" class="content-card mb-6">
            <v-card-title class="pa-6 pb-4">
              <div class="d-flex align-center">
                <v-icon size="24" class="mr-2">mdi-cog</v-icon>
                General Usage History
              </div>
            </v-card-title>
            <v-divider />

            <!-- Loading State -->
            <v-card-text v-if="loadingGeneralUsage" class="pa-8 text-center">
              <v-progress-circular indeterminate color="primary" />
              <p class="text-body-2 text-medium-emphasis mt-3">Loading general usage...</p>
            </v-card-text>

            <!-- General Usage List -->

            <v-card-text v-else-if="generalUsage && generalUsage[0].component_id > 0" class="pa-0">
              <v-list lines="two">
                <v-list-item v-for="(item, index) in generalUsage" :key="item.usage_id">
                  <template #prepend>
                    <v-avatar color="info" variant="tonal" size="48">
                      <v-icon size="24">mdi-cog</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-medium mb-1">
                    {{ item.purpose || 'General usage' }} - {{ item.quantity_used }} units
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
                    Used on: {{ formatDate(item.usage_date) }}
                  </v-list-item-subtitle>

                  <template #append>
                    <v-chip size="small" color="info" variant="tonal">
                      {{ item.quantity_used }} units
                    </v-chip>
                  </template>

                  <v-divider v-if="index < generalUsage.length - 1" class="mt-3" />
                </v-list-item>
              </v-list>
            </v-card-text>

            <!-- Empty State -->
            <v-card-text v-else class="pa-8 text-center">
              <v-icon size="64" color="grey-lighten-2">mdi-cog-outline</v-icon>
              <p class="text-body-2 text-medium-emphasis mt-3">No general usage recorded</p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column -->
        <v-col cols="12" md="4">
          <!-- Stock Info Card -->
          <v-card elevation="0" class="content-card mb-6">
            <v-card-title class="pa-6 pb-4">
              <div class="d-flex align-center">
                <v-icon size="24" class="mr-2">mdi-information</v-icon>
                Stock Information
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <div class="info-list">
                <div class="info-item mb-4">
                  <div class="info-label text-caption text-medium-emphasis mb-1">Product ID</div>
                  <div class="info-value font-weight-medium">#{{ stock.id }}</div>
                </div>


                <div class="info-item mb-4">
                  <div class="info-label text-caption text-medium-emphasis mb-1">Category</div>
                  <div v-if="editingField === 'category_id'">
                    <v-select v-model="editForm.category_id" :items="categories" item-title="category_name"
                      item-value="category_id" density="comfortable" variant="outlined" hide-details
                      @blur="saveField('category_id')" @update:model-value="saveField('category_id')" />
                  </div>
                  <v-chip v-else size="small" variant="tonal" color="primary" class="editable-chip"
                    @click="startEdit('category_id')" tabindex="0">
                    {{ stock.category_name }}
                    <v-icon size="14" class="ml-1">mdi-pencil</v-icon>
                  </v-chip>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label text-caption text-medium-emphasis mb-1">Min Stock Level</div>
                  <div class="info-value font-weight-medium">{{ stock.min_stock_level || 10 }} units</div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label text-caption text-medium-emphasis mb-1">Container / Box</div>
                  <div v-if="editingField === 'box_id'">
                    <v-select v-model="editForm.box_id" :items="boxes" item-title="box_label" item-value="box_id"
                      density="comfortable" variant="outlined" hide-details @blur="saveField('box_id')"
                      @update:model-value="saveField('box_id')" />
                  </div>
                  <div v-else class="info-value editable-date font-weight-medium" @click="startEdit('box_id')"
                    tabindex="0">
                    <v-icon size="16" class="mr-1">mdi-package</v-icon>
                    {{ stock.box_label || 'Not Set' }}
                    <v-icon size="14" class="ml-1">mdi-pencil</v-icon>
                  </div>
                </div>

              </div>
            </v-card-text>
          </v-card>

          <!-- Stock Level Card -->
          <v-card elevation="0" class="content-card mb-6">
            <v-card-title class="pa-6 pb-4">
              <div class="d-flex align-center">
                <v-icon size="24" class="mr-2">mdi-gauge</v-icon>
                Stock Level
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <div class="text-center mb-4">
                <div class="text-h2 font-weight-bold mb-2" :class="`text-${getStockLevelColor()}`">
                  {{ stockPercentage }}%
                </div>
                <v-progress-linear :model-value="stockPercentage" :color="getStockLevelColor()" height="8" rounded />
              </div>
              <div class="text-body-2 text-medium-emphasis text-center">
                {{ stock.stock }} of {{ stock.stock + (stock.min_stock_level || 10) }} units
              </div>
            </v-card-text>
          </v-card>

          <!-- Image Card with Upload -->
          <v-card elevation="0" class="content-card mb-6">
            <v-card-title class="pa-6 pb-4">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-icon size="24" class="mr-2">mdi-image</v-icon>
                  Product Image
                </div>
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-5">
              <div class="image-upload-wrapper" @click="triggerImageUpload" @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false" @drop.prevent="handleImageDrop"
                :class="{ 'dragging': isDragging }">
                <!-- Existing Image -->
                <v-img v-if="stock.filename && !imagePreview" :src="stock.filename" :alt="stock.name" cover
                  class="rounded-lg component-image" />

                <!-- Image Preview -->
                <v-img v-else-if="imagePreview" :src="imagePreview" cover class="rounded-lg component-image" />

                <!-- No Image Placeholder -->
                <div v-else class="no-image-placeholder">
                  <v-icon size="64" color="grey-lighten-2">mdi-image-off</v-icon>
                  <p class="text-caption text-medium-emphasis mt-2">No image uploaded</p>
                </div>

                <!-- Hover Overlay -->
                <div class="image-overlay">
                  <v-icon size="48" color="white">mdi-cloud-upload</v-icon>
                  <p class="text-body-2 text-white mt-2">Click or drag to upload</p>
                </div>
              </div>

              <!-- Hidden file input -->
              <input ref="imageInput" type="file" accept="image/*" style="display: none" @change="handleImageSelect" />

              <!-- Image Actions -->
              <div v-if="imagePreview" class="d-flex ga-2 mt-4">
                <v-btn color="primary" block @click="uploadImage" :loading="uploadingImage">
                  Save Image
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

        </v-col>
      </v-row>
    </template>
    <!-- Notifications -->
    <v-snackbar v-model="showSuccess" color="success" :timeout="3000" location="top right">
      <v-icon class="mr-2">mdi-check-circle</v-icon> {{ successMessage }}
    </v-snackbar>
    <v-snackbar v-model="showError" color="error" :timeout="5000" location="top right">
      <v-icon class="mr-2">mdi-alert-circle</v-icon> {{ errorMessage }}
    </v-snackbar>

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStockStore } from '@/stores/stockStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useBoxStore } from '@/stores/boxStore'

const route = useRoute()
const router = useRouter()
const stockStore = useStockStore()
const categoryStore = useCategoryStore()
const boxStore = useBoxStore()

const stock = ref(null)
const loading = ref(true)
const error = ref(null)
const saving = ref(false)

const purchaseHistory = ref([])
const projectUsage = ref([])
const generalUsage = ref([])

const imageInput = ref(null)
const selectedImage = ref(null)
const imagePreview = ref(null)
const uploadingImage = ref(false)
const isDragging = ref(false)


// Inline editing state
const editingField = ref(null)
const editForm = ref({})
const originalValues = ref({})

// Snackbar notifications
const showSuccess = ref(false)
const successMessage = ref('')
const showError = ref(false)
const errorMessage = ref('')

// Computed properties
const loadingProjectUsage = computed(() => stockStore.projectUsageLoading)
const loadingGeneralUsage = computed(() => stockStore.generalUsageLoading)
const loadingPurchaseHistory = computed(() => stockStore.purchaseHistoryLoading)
const categories = computed(() => categoryStore.categories)
const boxes = computed(() => boxStore.boxes)

const totalValue = computed(() => {
  if (!stock.value) return 0
  return stock.value.stock * (stock.value.avg_unit_price || 0)
})

const stockPercentage = computed(() => {
  if (!stock.value) return 0
  const max = stock.value.stock + (stock.value.min_stock_level || 10)
  return Math.round((stock.value.stock / max) * 100)
})

// Helper functions
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
const triggerImageUpload = () => {
  imageInput.value?.click()
}

const cancelImageUpload = () => {
  selectedImage.value = null
  imagePreview.value = null
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

// Update handleImageSelect
const handleImageSelect = (event) => {
  const file = event.target.files[0]

  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

  if (file && allowedTypes.includes(file.type)) {
    selectedImage.value = file
    imagePreview.value = URL.createObjectURL(file)
  } else {
    errorMessage.value = 'Please select a PNG image file only'
    showError.value = true
    // Clear the input
    if (imageInput.value) {
      imageInput.value.value = ''
    }
  }
}

// Update handleImageDrop
const handleImageDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]

  // Only accept PNG images
  if (file && file.type === 'image/png') {
    selectedImage.value = file
    imagePreview.value = URL.createObjectURL(file)
  } else {
    errorMessage.value = 'Please drop a PNG image file only'
    showError.value = true
  }
}

// Update uploadImage - force PNG type
const uploadImage = async () => {
  if (!selectedImage.value) return

  try {
    uploadingImage.value = true

    const reader = new FileReader()

    reader.onloadend = async () => {
      try {
        const base64String = reader.result
        const base64Content = base64String.split(',')[1]

        // Extract just the extension from MIME type
        // "image/png" -> "png"
        // "image/jpeg" -> "jpg" (normalize jpeg to jpg)
        let imageExt = selectedImage.value.type.split('/')[1]
        if (imageExt === 'jpeg') imageExt = 'jpg'  // Normalize

        const updateData = {
          image_content: base64Content,
          image_type: imageExt,  // Just "png", "jpg", "webp"
          imaeg_name: selectedImage.value.name
        }

        await stockStore.updateComponent(stock.value.id, updateData)

        // Update local stock
        stock.value.image_content = base64Content
        stock.value.image_type = imageExt
        stock.value.imaeg_name = selectedImage.value.name
        stock.value.filename = `data:image/${imageExt};base64,${base64Content}`

        successMessage.value = 'Image uploaded successfully'
        showSuccess.value = true
        cancelImageUpload()
      } catch (err) {
        console.error('❌ Upload failed:', err)
        errorMessage.value = err.message || 'Failed to upload image'
        showError.value = true
      } finally {
        uploadingImage.value = false
      }
    }

    reader.onerror = () => {
      errorMessage.value = 'Failed to read image file'
      showError.value = true
      uploadingImage.value = false
    }

    reader.readAsDataURL(selectedImage.value)
  } catch (err) {
    console.error('❌ Error:', err)
    errorMessage.value = err.message || 'Failed to process image'
    showError.value = true
    uploadingImage.value = false
  }
}


const getStatusColor = (status) => {
  const colors = {
    'In Stock': 'success',
    'Out of Stock': 'error',
    'On Order': 'warning',
    'Discontinued': 'grey'
  }
  return colors[status] || 'grey'
}

const getStatusIcon = (status) => {
  const icons = {
    'In Stock': 'mdi-check-circle',
    'Out of Stock': 'mdi-close-circle',
    'On Order': 'mdi-clock-outline',
    'Discontinued': 'mdi-cancel'
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
  if (!value || value === 0) return '₹0'
  const formatted = parseFloat(value).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  })
  return `₹${formatted}`
}

// Inline editing handlers
const startEdit = (field) => {
  editingField.value = field
  editForm.value = {
    ...stock.value,
    category_id: stock.value.category_id,
    box_id: stock.value.box_id
  }
  originalValues.value[field] = stock.value[field]
}

const cancelEdit = () => {
  editingField.value = null
  editForm.value = {}
}

const saveField = async (field) => {
  if (editForm.value[field] === originalValues.value[field]) {
    cancelEdit()
    return
  }

  try {
    saving.value = true
    const updateData = { [field]: editForm.value[field] }

    await stockStore.updateComponent(stock.value.id, updateData)

    // Update local stock object
    stock.value[field] = editForm.value[field]

    // Update category/box name if those were changed
    if (field === 'category_id') {
      const category = categories.value.find(c => c.category_id === editForm.value[field])
      if (category) stock.value.category_name = category.category_name
    }
    if (field === 'box_id') {
      const box = boxes.value.find(b => b.box_id === editForm.value[field])
      if (box) stock.value.box_label = box.box_label
    }

    successMessage.value = 'Updated successfully'
    showSuccess.value = true
    cancelEdit()
  } catch (err) {
    errorMessage.value = err.message || 'Failed to update'
    showError.value = true
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  const stockId = parseInt(route.params.id)

  try {
    // Load categories and boxes
    await Promise.all([
      categoryStore.allCategories(),
      boxStore.fetchBoxes({
        page: 1,
        pageSize: 10000000
      })
    ])

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

    // Load purchase history after stock is loaded
    if (stockId) {
      purchaseHistory.value = await stockStore.fetchPurchaseHistory(stockId)
      projectUsage.value = await stockStore.fetchProjectUsage(stockId)
      generalUsage.value = await stockStore.fetchGeneralUsage(stockId)
    }
  } catch (err) {
    error.value = err.message || 'Failed to load stock details'
  } finally {
    loading.value = false
  }
})
</script>


<style scoped>
.stock-detail-page {
  background: #fafbfc;
  min-height: 100vh;
}

.header-card,
.content-card {
  border: 1px solid #e8edf2;
  border-radius: 16px;
  background: white;
  animation: fadeIn 0.5s ease-out;
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

/* Image Upload Styles */
.image-upload-wrapper {
  position: relative;
  min-height: 300px;
  border: 2px dashed #e8edf2;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.image-upload-wrapper:hover {
  border-color: #667eea;
}

.image-upload-wrapper.dragging {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.component-image {
  width: 100%;
  height: 300px;
}

.no-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  background: #fafbfc;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-upload-wrapper:hover .image-overlay {
  opacity: 1;
}

/* Inline Editing Styles */
.editable-field,
.editable-date,
.editable-chip {
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.editable-field:hover,
.editable-date:hover,
.editable-chip:hover {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  padding: 2px 4px;
}

.edit-icon {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.editable-field:hover .edit-icon,
.editable-date:hover .edit-icon,
.editable-chip:hover .edit-icon {
  opacity: 0.6;
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
  background: linear-gradient(135deg, #ff9a56 0%, #ff7e5f 100%);
}

.info-gradient {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.description-content {
  line-height: 1.8;
  white-space: pre-wrap;
}

.info-list {
  display: flex;
  flex-direction: column;
}

.info-label {
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 0.95rem;
  display: flex;
  align-items: center;
}

.text-success {
  color: #16a34a;
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

/* Responsive */
@media (max-width: 600px) {
  .stock-detail-page {
    padding: 16px !important;
  }
}
</style>
