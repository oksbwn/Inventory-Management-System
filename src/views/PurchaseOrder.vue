<template>
  <v-container fluid class="pa-6 create-order-page">
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-4">
          <div class="d-flex align-center ga-4">
            <v-avatar size="48" color="primary" class="header-avatar">
              <v-icon size="28">mdi-cart-plus</v-icon>
            </v-avatar>
            <div>
              <h1 class="text-h4 font-weight-bold mb-1">Create Purchase Order</h1>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Add new component purchase to inventory
              </p>
            </div>
          </div>
          <v-btn variant="outlined" prepend-icon="mdi-arrow-left" @click="goBack" rounded="0">
            Back to Orders
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-form ref="orderForm" v-model="valid" @submit.prevent="handleSubmit" lazy-validation>
      <!-- Order Information Card -->
      <v-card elevation="1" class="content-card mb-4" rounded="lg">
        <v-card-title class="pa-4 bg-grey-lighten-5">
          <div class="d-flex align-center ga-2">
            <v-icon size="20" color="primary">mdi-information</v-icon>
            <span class="text-subtitle-1 font-weight-bold">Order Information</span>
          </div>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <v-row>
            <!-- Vendor Selection -->
            <v-col cols="12" md="6">
              <div class="d-flex ga-2 align-center">
                <v-autocomplete v-model="form.vendor_id" :items="vendors" item-title="vendor_name"
                  item-value="vendor_id" label="Select Vendor *" :loading="vendorStore.loading"
                  :rules="[v => !!v || 'Vendor is required']" variant="outlined" density="comfortable" clearable
                  style="flex: 1" placeholder="Choose a vendor..." hide-details="auto">
                  <template #prepend-inner>
                    <v-icon size="20" color="primary">mdi-account-group</v-icon>
                  </template>

                  <template #item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-avatar size="32">
                          <v-img v-if="item.raw.filename" :src="item.raw.filename" cover />
                          <v-icon v-else size="18">mdi-account</v-icon>
                        </v-avatar>
                      </template>
                    </v-list-item>
                  </template>

                  <template #selection="{ item }">
                    <div class="d-flex align-center ga-2">
                      <v-avatar size="24">
                        <v-img v-if="item.raw.filename" :src="item.raw.filename" cover />
                        <v-icon v-else size="14">mdi-account</v-icon>
                      </v-avatar>
                      <span>{{ item.raw.vendor_name }}</span>
                    </div>
                  </template>
                </v-autocomplete>

                <v-btn icon="mdi-plus" color="primary" @click="openVendorDialog" rounded="0" density="comfortable" />
              </div>
            </v-col>

            <!-- Order Date -->
            <v-col cols="12" md="6">
              <v-text-field v-model="form.order_date" label="Purchase Date *" type="date"
                :rules="[v => !!v || 'Date is required']" variant="outlined" density="comfortable"
                :max="new Date().toISOString().split('T')[0]" hide-details="auto">
                <template #prepend-inner>
                  <v-icon size="20" color="primary">mdi-calendar</v-icon>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Order Items Card -->
      <v-card elevation="1" class="content-card mb-4" rounded="lg">
        <v-card-title class="pa-4 bg-grey-lighten-5">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center ga-2">
              <v-icon size="20" color="primary">mdi-cart</v-icon>
              <span class="text-subtitle-1 font-weight-bold">Order Items</span>
            </div>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="addOrderItem" rounded="0">
              Add Item
            </v-btn>
          </div>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <!-- Empty state -->
          <div v-if="form.items.length === 0" class="empty-state">
            <v-icon size="64" color="grey-lighten-2">mdi-cart-outline</v-icon>
            <p class="text-h6 text-medium-emphasis mt-4 mb-2">No Items Added</p>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Start adding components to your purchase order
            </p>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="addOrderItem" rounded="0">
              Add First Item
            </v-btn>
          </div>

          <!-- Item rows -->
          <div v-else>
            <v-row v-for="(item, i) in form.items" :key="i" class="mb-3 order-item-row align-center">
              <!-- Component Selection -->
              <v-col cols="12" md="5">
                <div class="d-flex ga-2 align-center">
                  <v-autocomplete v-model="item.id" :items="components" item-title="name" item-value="id"
                    label="Component *" :loading="stockStore.loading" :rules="[v => !!v || 'Component required']"
                    variant="outlined" density="comfortable" clearable style="flex: 1" placeholder="Select component..."
                    @update:model-value="val => onComponentChange(val, i)" hide-details="auto">
                    <template #prepend-inner>
                      <v-icon size="20" color="primary">mdi-chip</v-icon>
                    </template>

                    <template #item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template #prepend>
                          <v-avatar size="32" rounded="lg">
                            <v-img v-if="item.raw.filename" :src="item.raw.filename" cover />
                            <v-icon v-else size="18">mdi-chip</v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-subtitle class="text-caption">
                          {{ item.raw.category_name }}
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>

                    <template #selection="{ item }">
                      <div class="d-flex align-center ga-2">
                        <v-avatar size="24" rounded="lg">
                          <v-img v-if="item.raw.filename" :src="item.raw.filename" cover />
                          <v-icon v-else size="14">mdi-chip</v-icon>
                        </v-avatar>
                        <span class="text-truncate">{{ item.raw.name }}</span>
                      </div>
                    </template>
                  </v-autocomplete>

                  <v-btn icon="mdi-plus" color="primary" @click="openComponentDialog(i)" rounded="0"
                    density="comfortable" />
                </div>
              </v-col>

              <!-- Quantity -->
              <v-col cols="6" md="2">
                <v-text-field v-model.number="item.quantity" label="Quantity *" type="number" min="1"
                  :rules="[v => v > 0 || 'Quantity must be > 0']" variant="outlined" density="comfortable"
                  @input="calculateFromQuantityOrUnitCost(i)" hide-details="auto">
                  <template #prepend-inner>
                    <v-icon size="20" color="primary">mdi-counter</v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <!-- Unit Cost -->
              <v-col cols="6" md="2">
                <v-text-field v-model.number="item.unit_cost" label="Unit Cost *" type="number" min="0" step="0.01"
                  :rules="[v => v >= 0 || 'Cost must be >= 0']" variant="outlined" density="comfortable" prefix="₹"
                  @input="calculateFromQuantityOrUnitCost(i)" hide-details="auto">
                  <template #prepend-inner>
                    <v-icon size="20" color="primary">mdi-currency-inr</v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <!-- Total - Editable -->
              <v-col cols="9" md="2">
                <v-text-field v-model.number="item.total" label="Total *" type="number" min="0" step="0.01"
                  variant="outlined" density="comfortable" prefix="₹" @input="calculateFromTotal(i)"
                  hide-details="auto">
                  <template #prepend-inner>
                    <v-icon size="20" color="success">mdi-calculator</v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <!-- Delete button -->
              <v-col cols="3" md="1" class="d-flex justify-center">
                <v-btn icon="mdi-delete" color="error" :disabled="form.items.length === 1" @click="removeOrderItem(i)"
                  rounded="0" variant="text" density="comfortable" />
              </v-col>

              <v-col v-if="i < form.items.length - 1" cols="12">
                <v-divider class="my-2" />
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>

      <!-- Order Summary Card -->
      <v-card elevation="1" class="content-card mb-4" rounded="lg">
        <v-card-title class="pa-4 bg-grey-lighten-5">
          <div class="d-flex align-center ga-2">
            <v-icon size="20" color="primary">mdi-calculator</v-icon>
            <span class="text-subtitle-1 font-weight-bold">Order Summary</span>
          </div>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12" md="8">
              <v-textarea v-model="form.notes" label="Order Notes (Optional)" rows="4" variant="outlined"
                density="comfortable" placeholder="Add any additional notes about this order..." counter maxlength="500"
                hide-details="auto">
                <template #prepend-inner>
                  <v-icon size="20" color="primary">mdi-note-text</v-icon>
                </template>
              </v-textarea>
            </v-col>
            <v-col cols="12" md="4">
              <v-card color="primary" variant="tonal" elevation="0" class="summary-card" rounded="lg">
                <v-card-text class="pa-4">
                  <div class="summary-row">
                    <span class="text-body-2">Total Items:</span>
                    <v-chip size="small" color="primary">{{ form.items.length }}</v-chip>
                  </div>
                  <div class="summary-row">
                    <span class="text-body-2">Total Quantity:</span>
                    <v-chip size="small" color="primary">{{ totalQuantity }}</v-chip>
                  </div>
                  <v-divider class="my-3" />
                  <div class="summary-row">
                    <span class="text-h6 font-weight-bold">Grand Total:</span>
                    <span class="text-h6 font-weight-bold text-primary">
                      {{ formatCurrency(grandTotal) }}
                    </span>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Action Buttons -->
      <v-card elevation="1" class="content-card" rounded="lg">
        <v-card-actions class="pa-4 justify-end ga-3">
          <v-btn color="primary" type="submit" :loading="saving" :disabled="!valid || form.items.length === 0"
            prepend-icon="mdi-check" rounded="0">
            Save Purchase Order
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>

    <!-- Dialogs -->
    <vendor-form-dialog v-model="vendorDialog" :vendor-item="selectedVendor" @success="handleVendorSuccess" />

    <component-form-dialog v-model="componentDialog" :component-item="selectedComponent" :categories="categories"
      :boxes="boxes" @success="handleComponentSuccess" @add-category="categoryDialog = true"
      @add-box="boxDialog = true" />

    <category-form-dialog v-model="categoryDialog" @success="handleCategorySuccess" />

    <box-form-dialog v-model="boxDialog" @success="handleBoxSuccess" />
    <!-- Confirmation Dialog -->
    <confirm-dialog v-model="confirmDialog" title="Confirm Purchase Order" subtitle="Please review your order details"
      :message="`You are about to create a purchase order for ${selectedVendorName} with ${form.items.length} item(s) totaling ${formatCurrency(grandTotal)}.`"
      icon="mdi-cart-check" color="primary" confirm-text="Create Order" cancel-text="Review Order"
      @confirm="handleConfirmSave">
      <template #details>
        <v-card variant="tonal" color="primary" class="mt-4" rounded="lg">
          <v-card-text class="pa-4">
            <div class="d-flex justify-space-between mb-2">
              <span class="text-body-2">Vendor:</span>
              <span class="text-body-2 font-weight-bold">{{ selectedVendorName }}</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span class="text-body-2">Order Date:</span>
              <span class="text-body-2 font-weight-bold">
                {{ new Date(form.order_date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) }}
              </span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span class="text-body-2">Total Items:</span>
              <span class="text-body-2 font-weight-bold">{{ form.items.length }}</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span class="text-body-2">Total Quantity:</span>
              <span class="text-body-2 font-weight-bold">{{ totalQuantity }}</span>
            </div>
            <v-divider class="my-3" />
            <div class="d-flex justify-space-between">
              <span class="text-subtitle-1 font-weight-bold">Grand Total:</span>
              <span class="text-h6 font-weight-bold text-primary">
                {{ formatCurrency(grandTotal) }}
              </span>
            </div>
          </v-card-text>
        </v-card>
      </template>
    </confirm-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVendorStore } from '@/stores/vendorStore'
import { useStockStore } from '@/stores/stockStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useBoxStore } from '@/stores/boxStore'
import { useOrderStore } from '@/stores/orderStore'
import { useNotification } from '@/composables/useNotification'
import VendorFormDialog from '@/components/dialogs/VendorFormDialog.vue'
import ComponentFormDialog from '@/components/dialogs/ComponentFormDialog.vue'
import CategoryFormDialog from '@/components/dialogs/CategoryFormDialog.vue'
import BoxFormDialog from '@/components/dialogs/BoxFormDialog.vue'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'

const router = useRouter()
const vendorStore = useVendorStore()
const stockStore = useStockStore()
const categoryStore = useCategoryStore()
const boxStore = useBoxStore()
const orderStore = useOrderStore()
const { success, error, info } = useNotification()

const orderForm = ref(null)
const valid = ref(false)
const saving = ref(false)
const components = ref([])
const vendors = ref([])

// Reactive lists from stores
const categories = computed(() => categoryStore.categories)
const boxes = computed(() => boxStore.boxes)

// Form data
const form = ref({
  vendor_id: null,
  order_date: new Date().toISOString().slice(0, 10),
  order_url: '',
  notes: '',
  items: [{ id: null, category_name: '', quantity: 1, unit_cost: 0, total: 0 }]
})

// Dialogs
const vendorDialog = ref(false)
const componentDialog = ref(false)
const categoryDialog = ref(false)
const boxDialog = ref(false)
const confirmDialog = ref(false)
const currentItemIndex = ref(null)

// Selected items for editing
const selectedVendor = ref(null)
const selectedComponent = ref(null)

// Computed totals
const totalQuantity = computed(() => form.value.items.reduce((s, i) => s + (i.quantity || 0), 0))
const grandTotal = computed(() => form.value.items.reduce((s, i) => s + (i.total || 0), 0))
const formatCurrency = v => `₹${(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

// Get selected vendor name for confirmation
const selectedVendorName = computed(() => {
  const vendor = vendors.value.find(v => v.vendor_id === form.value.vendor_id)
  return vendor?.vendor_name || 'Unknown Vendor'
})

const fetchData = async () => {
  try {
    const [componentsData, vendorsData] = await Promise.all([
      stockStore.allComponents(),
      vendorStore.allVendors()
    ])
    components.value = componentsData
    vendors.value = vendorsData
  } catch (err) {
    console.error('Error fetching data:', err)
    error('Failed to load data. Please refresh the page.')
  }
}

// Bidirectional calculation methods
const calculateFromQuantityOrUnitCost = i => {
  const item = form.value.items[i]
  item.total = (item.quantity || 0) * (item.unit_cost || 0)
}

const calculateFromTotal = i => {
  const item = form.value.items[i]
  if (item.quantity > 0) {
    item.unit_cost = (item.total || 0) / item.quantity
  }
}

// Methods
const addOrderItem = () => {
  form.value.items.push({ id: null, category_name: '', quantity: 1, unit_cost: 0, total: 0 })
}

const removeOrderItem = i => {
  form.value.items.splice(i, 1)
  info('Item removed from order')
}

const onComponentChange = (cid, i) => {
  const c = components.value.find(x => x.id === cid)
  if (c) {
    form.value.items[i].category_name = c.category_name
    form.value.items[i].component_id = c.id
  } else {
    form.value.items[i].category_name = ''
  }
}

const goBack = () => router.push({ name: 'Orders' })

// Dialog handlers
const openVendorDialog = () => {
  selectedVendor.value = null
  vendorDialog.value = true
}

const openComponentDialog = (index) => {
  currentItemIndex.value = index
  selectedComponent.value = null
  componentDialog.value = true
}

// Success handlers for dialogs
const handleVendorSuccess = async ({ data }) => {
  try {
    await vendorStore.createVendor({
      vendorname: data.vendor_name,
      contactemail: data.contact_email,
      phonenumber: data.contact_phone,
      vendoriconname: data.vendor_icon_name,
      vendoricontype: data.vendor_icon_type,
      vendoriconcontent: data.vendor_icon_content,
      website: data.website
    })
    await fetchData()
    success('Vendor created successfully!')
  } catch (err) {
    console.error('Error creating vendor:', err)
    error(
      err?.response?.data?.message ||
      err?.message ||
      'Failed to create vendor. Please try again.'
    )
  }
}

const handleComponentSuccess = async ({ data }) => {
  try {
    await stockStore.createComponent(data)
    await fetchData()

    // Auto-select the new component in the current item
    if (currentItemIndex.value !== null) {
      const latestComponent = components.value[components.value.length - 1]
      if (latestComponent) {
        form.value.items[currentItemIndex.value].id = latestComponent.id
        form.value.items[currentItemIndex.value].component_id = latestComponent.id
        form.value.items[currentItemIndex.value].category_name = latestComponent.category_name
      }
    }

    success('Component created and added to order!')
  } catch (err) {
    console.error('Error creating component:', err)
    error(
      err?.response?.data?.message ||
      err?.message ||
      'Failed to create component. Please try again.'
    )
  }
}

const handleCategorySuccess = async ({ data }) => {
  try {
    await categoryStore.createCategory(data)
    await categoryStore.fetchCategories()
    success('Category created successfully!')
  } catch (err) {
    console.error('Error creating category:', err)
    error(
      err?.response?.data?.message ||
      err?.message ||
      'Failed to create category. Please try again.'
    )
  }
}

const handleBoxSuccess = async ({ data }) => {
  try {
    await boxStore.createBox(data)
    await boxStore.fetchBoxes({
      pageSize: 1000000,
      page: 1
    })
    success('Storage box created successfully!')
  } catch (err) {
    console.error('Error creating box:', err)
    error(
      err?.response?.data?.message ||
      err?.message ||
      'Failed to create box. Please try again.'
    )
  }
}

const handleSubmit = async () => {
  const ok = await orderForm.value.validate()
  if (!ok || !form.value.items.length) {
    error('Please fill in all required fields correctly')
    return
  }

  // Show confirmation dialog instead of submitting directly
  confirmDialog.value = true
}

const handleConfirmSave = async () => {
  confirmDialog.value = false
  saving.value = true

  try {
    await orderStore.createOrder({
      vendor_id: form.value.vendor_id,
      order_date: form.value.order_date,
      order_url: form.value.order_url,
      notes: form.value.notes,
      items: form.value.items.map(item => ({
        component_id: item.id || item.component_id,
        quantity: item.quantity,
        unit_cost: item.unit_cost
      }))
    })

    // Clear the form
    form.value = {
      vendor_id: null,
      order_date: new Date().toISOString().slice(0, 10),
      order_url: '',
      notes: '',
      items: [{ id: null, category_name: '', quantity: 1, unit_cost: 0, total: 0 }]
    }

    // Reset form validation
    orderForm.value?.resetValidation()

    // Show success message
    success('Purchase order created successfully!')

    // Redirect after a delay
    setTimeout(() => {
      router.push({ name: 'Orders' })
    }, 1500)

  } catch (err) {
    console.error('Error creating order:', err)
    error(
      err?.response?.data?.message ||
      err?.message ||
      'Failed to create purchase order. Please try again.'
    )
  } finally {
    saving.value = false
  }
}

// Load initial data
onMounted(async () => {
  try {
    await Promise.all([
      categoryStore.fetchCategories(),
      boxStore.fetchBoxes({
        pageSize: 1000000,
        page: 1
      })
    ])
    await fetchData()
  } catch (err) {
    console.error('Error loading initial data:', err)
    error('Failed to load initial data. Please refresh the page.')
  }
})
</script>

<style scoped>
.create-order-page {
  background: #fafbfc;
  min-height: 100vh;
}

.header-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.content-card {
  border: 1px solid #e8edf2;
  background: white;
  transition: box-shadow 0.2s ease;
}

.content-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
}

.empty-state {
  text-align: center;
  padding: 48px 20px;
}

.order-item-row {
  transition: all 0.2s ease;
  padding: 8px;
  border-radius: 8px;
}

.order-item-row:hover {
  background: rgba(102, 126, 234, 0.03);
}

.summary-card {
  border: 2px solid rgba(102, 126, 234, 0.2);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.summary-row:last-child {
  margin-bottom: 0;
}

/* Ensure all icons are visible */
:deep(.v-icon) {
  opacity: 1;
}

/* Button and field height consistency */
:deep(.v-btn) {
  height: 40px !important;
}

:deep(.v-field__input) {
  min-height: 40px;
}

@media (max-width: 600px) {
  .create-order-page {
    padding: 16px !important;
  }
}
</style>
