<template>
  <v-container fluid class="pa-6">
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">Create Purchase Order</h1>
            <p class="text-body-1 text-medium-emphasis">Add new component purchase to inventory</p>
          </div>
          <v-btn color="grey" variant="outlined" :to="{ name: 'Orders' }">
            <v-icon start>mdi-arrow-left</v-icon>
            Back to Orders
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-form ref="orderForm" v-model="valid" @submit.prevent="handleSubmit">
      <v-card elevation="2" class="mb-6">
        <v-card-title class="pa-5 d-flex align-center bg-gradient">
          <v-icon class="mr-3" color="primary">mdi-information</v-icon>
          <span class="text-h6">Order Information</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row>
            <!-- Vendor Selection -->
            <v-col cols="12" md="6">
              <div class="d-flex align-center ga-2">
                <v-autocomplete
                  v-model="form.vendor_id"
                  :items="vendors"
                  item-title="vendor_name"
                  item-value="vendor_id"
                  label="Vendor *"
                  placeholder="Select vendor"
                  :loading="loadingVendors"
                  :rules="[(v) => !!v || 'Vendor is required']"
                  variant="outlined"
                  density="comfortable"
                  clearable
                >
                  <template #prepend-inner>
                    <v-icon>mdi-account-group</v-icon>
                  </template>
                </v-autocomplete>
                <v-btn color="primary" icon size="small" @click="openVendorDialog">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-col>

            <!-- Purchase Date -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.order_date"
                label="Purchase Date *"
                type="date"
                :rules="[(v) => !!v || 'Date is required']"
                variant="outlined"
                density="comfortable"
              >
                <template #prepend-inner>
                  <v-icon>mdi-calendar</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <!-- Order URL/Invoice -->
            <v-col cols="12">
              <v-text-field
                v-model="form.order_url"
                label="Order URL / Invoice Link"
                placeholder="https://..."
                variant="outlined"
                density="comfortable"
              >
                <template #prepend-inner>
                  <v-icon>mdi-link</v-icon>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Order Items -->
      <v-card elevation="2" class="mb-6">
        <v-card-title class="pa-5 d-flex align-center justify-space-between bg-gradient">
          <div class="d-flex align-center">
            <v-icon class="mr-3" color="primary">mdi-cart</v-icon>
            <span class="text-h6">Order Items</span>
          </div>
          <v-btn color="primary" variant="tonal" size="small" @click="addOrderItem">
            <v-icon start>mdi-plus</v-icon>
            Add Item
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row v-for="(item, index) in form.items" :key="index" class="mb-4 order-item-row" align="center">
            <!-- Component Selection -->
            <v-col cols="12" md="3">
              <div class="d-flex align-center ga-2">
                <v-autocomplete
                  v-model="item.component_id"
                  :items="components"
                  item-title="name"
                  item-value="component_id"
                  label="Component *"
                  placeholder="Select or create"
                  :loading="loadingComponents"
                  :rules="[(v) => !!v || 'Component required']"
                  variant="outlined"
                  density="compact"
                  @update:model-value="(val) => onComponentChange(val, index)"
                >
                  <template #prepend-inner>
                    <v-icon size="small">mdi-chip</v-icon>
                  </template>
                </v-autocomplete>
                <v-btn color="primary" icon size="x-small" @click="openComponentDialog(index)">
                  <v-icon size="small">mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-col>

            <!-- Category -->
            <v-col cols="12" md="2">
              <v-text-field
                :model-value="item.category_name"
                label="Category"
                readonly
                variant="outlined"
                density="compact"
                placeholder="Auto-filled"
              />
            </v-col>

            <!-- Quantity -->
            <v-col cols="6" md="2">
              <v-text-field
                v-model.number="item.quantity"
                label="Quantity *"
                type="number"
                min="1"
                :rules="[(v) => v > 0 || 'Quantity must be > 0']"
                variant="outlined"
                density="compact"
                @input="calculateItemTotal(index)"
              />
            </v-col>

            <!-- Unit Cost -->
            <v-col cols="6" md="2">
              <v-text-field
                v-model.number="item.unit_cost"
                label="Unit Cost *"
                type="number"
                min="0"
                step="0.01"
                :rules="[(v) => v >= 0 || 'Cost must be >= 0']"
                variant="outlined"
                density="compact"
                prefix="₹"
                @input="calculateItemTotal(index)"
              />
            </v-col>

            <!-- Total -->
            <v-col cols="6" md="2">
              <v-text-field
                :model-value="formatCurrency(item.total)"
                label="Total"
                readonly
                variant="outlined"
                density="compact"
              />
            </v-col>

            <!-- Delete Button -->
            <v-col cols="6" md="1" class="text-center">
              <v-btn
                color="error"
                icon
                size="small"
                variant="text"
                @click="removeOrderItem(index)"
                :disabled="form.items.length === 1"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>

            <v-col cols="12">
              <v-divider v-if="index < form.items.length - 1" />
            </v-col>
          </v-row>

          <!-- Empty State -->
          <div v-if="form.items.length === 0" class="text-center py-12">
            <v-icon size="80" color="grey-lighten-2">mdi-cart-outline</v-icon>
            <p class="mt-4 text-body-1 text-medium-emphasis">No items added yet</p>
            <v-btn color="primary" @click="addOrderItem" class="mt-4">
              <v-icon start>mdi-plus</v-icon>
              Add First Item
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- Order Summary -->
      <v-card elevation="2" class="mb-6">
        <v-card-title class="pa-5 d-flex align-center bg-gradient">
          <v-icon class="mr-3" color="success">mdi-calculator</v-icon>
          <span class="text-h6">Order Summary</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="8">
              <v-textarea
                v-model="form.notes"
                label="Notes (Optional)"
                placeholder="Add any additional notes about this purchase..."
                rows="3"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-card color="success-lighten-5" elevation="0">
                <v-card-text class="pa-4">
                  <div class="d-flex justify-space-between mb-2">
                    <span class="text-body-1">Total Items:</span>
                    <span class="text-body-1 font-weight-bold">{{ form.items.length }}</span>
                  </div>
                  <div class="d-flex justify-space-between mb-2">
                    <span class="text-body-1">Total Quantity:</span>
                    <span class="text-body-1 font-weight-bold">{{ totalQuantity }}</span>
                  </div>
                  <v-divider class="my-3" />
                  <div class="d-flex justify-space-between">
                    <span class="text-h6 font-weight-bold">Grand Total:</span>
                    <span class="text-h6 font-weight-bold text-success">{{ formatCurrency(grandTotal) }}</span>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Action Buttons -->
      <v-card elevation="2">
        <v-card-actions class="pa-6 justify-end">
          <v-btn variant="outlined" size="large" @click="handleCancel">Cancel</v-btn>
          <v-btn color="primary" type="submit" size="large" :loading="saving" :disabled="!valid || form.items.length === 0">
            <v-icon start>mdi-check</v-icon>
            Save Purchase Order
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>

    <!-- Add Vendor Dialog -->
    <v-dialog v-model="vendorDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="pa-5">
          <v-icon class="mr-3" color="primary">mdi-account-plus</v-icon>
          Add New Vendor
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-text-field
            v-model="newVendor.vendor_name"
            label="Vendor Name *"
            variant="outlined"
            :rules="[(v) => !!v || 'Name is required']"
          />
          <v-text-field v-model="newVendor.contact_email" label="Email" type="email" variant="outlined" />
          <v-text-field v-model="newVendor.contact_phone" label="Phone" variant="outlined" />
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="vendorDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveVendor" :loading="savingVendor">Save Vendor</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Component Dialog -->
    <v-dialog v-model="componentDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="pa-5">
          <v-icon class="mr-3" color="primary">mdi-chip</v-icon>
          Add New Component
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-text-field
            v-model="newComponent.name"
            label="Component Name *"
            variant="outlined"
            :rules="[(v) => !!v || 'Name is required']"
            class="mb-4"
          />
          <div class="d-flex align-center ga-2 mb-4">
            <v-autocomplete
              v-model="newComponent.category_id"
              :items="categories"
              item-title="category_name"
              item-value="category_id"
              label="Category *"
              variant="outlined"
              :loading="loadingCategories"
              :rules="[(v) => !!v || 'Category required']"
            />
            <v-btn color="primary" icon size="small" @click="openCategoryDialog">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>
          <div class="d-flex align-center ga-2 mb-4">
            <v-autocomplete
              v-model="newComponent.box_id"
              :items="boxes"
              item-title="box_label"
              item-value="box_id"
              label="Storage Box *"
              variant="outlined"
              :loading="loadingBoxes"
              :rules="[(v) => !!v || 'Box required']"
            />
            <v-btn color="primary" icon size="small" @click="openBoxDialog">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>
          <v-textarea v-model="newComponent.description" label="Description" rows="3" variant="outlined" />
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="componentDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveComponent" :loading="savingComponent">Save Component</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Category Dialog -->
    <v-dialog v-model="categoryDialog" max-width="400px" persistent>
      <v-card>
        <v-card-title class="pa-5">
          <v-icon class="mr-3" color="primary">mdi-shape</v-icon>
          Add New Category
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-text-field
            v-model="newCategory.category_name"
            label="Category Name *"
            variant="outlined"
            :rules="[(v) => !!v || 'Name is required']"
          />
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="categoryDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveCategory" :loading="savingCategory">Save Category</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Box Dialog -->
    <v-dialog v-model="boxDialog" max-width="400px" persistent>
      <v-card>
        <v-card-title class="pa-5">
          <v-icon class="mr-3" color="primary">mdi-package-variant</v-icon>
          Add New Storage Box
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-text-field
            v-model="newBox.box_label"
            label="Box Label *"
            variant="outlined"
            :rules="[(v) => !!v || 'Label is required']"
            class="mb-4"
          />
          <v-text-field v-model="newBox.box_code" label="Box Code" variant="outlined" />
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="boxDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveBox" :loading="savingBox">Save Box</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar v-model="showSuccess" color="success" location="top right" :timeout="3000">
      <v-icon class="mr-2">mdi-check-circle</v-icon>
      {{ successMessage }}
    </v-snackbar>

    <!-- Error Snackbar -->
    <v-snackbar v-model="showError" color="error" location="top right" :timeout="5000">
      <v-icon class="mr-2">mdi-alert-circle</v-icon>
      {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const orderForm = ref(null)
const valid = ref(false)
const saving = ref(false)

// Loading states
const loadingVendors = ref(false)
const loadingComponents = ref(false)
const loadingCategories = ref(false)
const loadingBoxes = ref(false)

// Data lists
const vendors = ref([])
const components = ref([])
const categories = ref([])
const boxes = ref([])

// Form data
const form = ref({
  vendor_id: null,
  order_date: new Date().toISOString().split('T')[0],
  order_url: '',
  notes: '',
  items: [
    {
      component_id: null,
      category_name: '',
      quantity: 1,
      unit_cost: 0,
      total: 0
    }
  ]
})

// Dialog states
const vendorDialog = ref(false)
const componentDialog = ref(false)
const categoryDialog = ref(false)
const boxDialog = ref(false)
const currentItemIndex = ref(null)

// Saving states for dialogs
const savingVendor = ref(false)
const savingComponent = ref(false)
const savingCategory = ref(false)
const savingBox = ref(false)

// New entity forms
const newVendor = ref({ vendor_name: '', contact_email: '', contact_phone: '' })
const newComponent = ref({ name: '', category_id: null, box_id: null, description: '' })
const newCategory = ref({ category_name: '' })
const newBox = ref({ box_label: '', box_code: '' })

// Snackbar states
const showSuccess = ref(false)
const showError = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Computed
const totalQuantity = computed(() => {
  return form.value.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
})

const grandTotal = computed(() => {
  return form.value.items.reduce((sum, item) => sum + (item.total || 0), 0)
})

// Methods
const formatCurrency = (value) => {
  return `₹${(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const calculateItemTotal = (index) => {
  const item = form.value.items[index]
  item.total = (item.quantity || 0) * (item.unit_cost || 0)
}

const addOrderItem = () => {
  form.value.items.push({
    component_id: null,
    category_name: '',
    quantity: 1,
    unit_cost: 0,
    total: 0
  })
}

const removeOrderItem = (index) => {
  form.value.items.splice(index, 1)
}

const onComponentChange = (componentId, index) => {
  const component = components.value.find((c) => c.component_id === componentId)
  if (component) {
    form.value.items[index].category_name = component.category_name || ''
  }
}

const openVendorDialog = () => {
  newVendor.value = { vendor_name: '', contact_email: '', contact_phone: '' }
  vendorDialog.value = true
}

const openComponentDialog = (index) => {
  currentItemIndex.value = index
  newComponent.value = { name: '', category_id: null, box_id: null, description: '' }
  componentDialog.value = true
}

const openCategoryDialog = () => {
  newCategory.value = { category_name: '' }
  categoryDialog.value = true
}

const openBoxDialog = () => {
  newBox.value = { box_label: '', box_code: '' }
  boxDialog.value = true
}

const saveVendor = async () => {
  if (!newVendor.value.vendor_name) return
  savingVendor.value = true
  try {
    // TODO: Call API to create vendor
    // const response = await vendorService.create(newVendor.value)
    // vendors.value.push(response.data)
    // form.value.vendor_id = response.data.vendor_id
    successMessage.value = 'Vendor created successfully'
    showSuccess.value = true
    vendorDialog.value = false
  } catch (error) {
    errorMessage.value = 'Failed to create vendor'
    showError.value = true
  } finally {
    savingVendor.value = false
  }
}

const saveComponent = async () => {
  if (!newComponent.value.name || !newComponent.value.category_id || !newComponent.value.box_id) return
  savingComponent.value = true
  try {
    // TODO: Call API to create component
    // const response = await componentService.create(newComponent.value)
    // components.value.push(response.data)
    // if (currentItemIndex.value !== null) {
    //   form.value.items[currentItemIndex.value].component_id = response.data.component_id
    // }
    successMessage.value = 'Component created successfully'
    showSuccess.value = true
    componentDialog.value = false
  } catch (error) {
    errorMessage.value = 'Failed to create component'
    showError.value = true
  } finally {
    savingComponent.value = false
  }
}

const saveCategory = async () => {
  if (!newCategory.value.category_name) return
  savingCategory.value = true
  try {
    // TODO: Call API to create category
    // const response = await categoryService.create(newCategory.value)
    // categories.value.push(response.data)
    // newComponent.value.category_id = response.data.category_id
    successMessage.value = 'Category created successfully'
    showSuccess.value = true
    categoryDialog.value = false
  } catch (error) {
    errorMessage.value = 'Failed to create category'
    showError.value = true
  } finally {
    savingCategory.value = false
  }
}

const saveBox = async () => {
  if (!newBox.value.box_label) return
  savingBox.value = true
  try {
    // TODO: Call API to create box
    // const response = await boxService.create(newBox.value)
    // boxes.value.push(response.data)
    // newComponent.value.box_id = response.data.box_id
    successMessage.value = 'Storage box created successfully'
    showSuccess.value = true
    boxDialog.value = false
  } catch (error) {
    errorMessage.value = 'Failed to create box'
    showError.value = true
  } finally {
    savingBox.value = false
  }
}

const handleSubmit = async () => {
  const { valid: isValid } = await orderForm.value.validate()
  if (!isValid || form.value.items.length === 0) return

  saving.value = true
  try {
    // TODO: Call API to create purchase order
    // const orderData = {
    //   vendor_id: form.value.vendor_id,
    //   order_date: form.value.order_date,
    //   order_url: form.value.order_url,
    //   notes: form.value.notes,
    //   items: form.value.items
    // }
    // await purchaseOrderService.create(orderData)
    
    successMessage.value = 'Purchase order created successfully!'
    showSuccess.value = true
    setTimeout(() => {
      router.push({ name: 'Orders' })
    }, 1500)
  } catch (error) {
    errorMessage.value = 'Failed to create purchase order'
    showError.value = true
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  router.push({ name: 'Orders' })
}

// Load initial data
onMounted(async () => {
  loadingVendors.value = true
  loadingComponents.value = true
  loadingCategories.value = true
  loadingBoxes.value = true

  try {
    // TODO: Load data from APIs
    // vendors.value = await vendorService.getAll()
    // components.value = await componentService.getAll()
    // categories.value = await categoryService.getAll()
    // boxes.value = await boxService.getAll()
  } catch (error) {
    errorMessage.value = 'Failed to load form data'
    showError.value = true
  } finally {
    loadingVendors.value = false
    loadingComponents.value = false
    loadingCategories.value = false
    loadingBoxes.value = false
  }
})
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.order-item-row {
  border-left: 3px solid transparent;
  padding-left: 12px;
  transition: all 0.2s ease;
}

.order-item-row:hover {
  border-left-color: rgb(var(--v-theme-primary));
  background: rgba(102, 126, 234, 0.02);
}
</style>
