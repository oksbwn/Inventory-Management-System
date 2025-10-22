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
          <v-btn color="grey" variant="outlined" @click="goBack">
            <v-icon start>mdi-arrow-left</v-icon> Back to Orders
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-form ref="orderForm" v-model="valid" @submit.prevent="handleSubmit" lazy-validation>

      <!-- Order Info -->
      <v-card elevation="2" class="mb-6">
        <v-card-title class="pa-5 d-flex align-center bg-gradient">
          <v-icon class="mr-3" color="primary">mdi-information</v-icon>
          <span class="text-h6">Order Information</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="6">
              <div class="d-flex align-center" style="gap: 8px;">
                <v-autocomplete v-model="form.vendor_id" :items="vendors" item-title="vendor_name"
                  item-value="vendor_id" label="Vendor *" :loading="vendorStore.loading" density="compact"
                  :rules="[v => !!v || 'Vendor is required']" variant="outlined" clearable dense style="flex-grow: 1;">
                  <template #prepend-inner>
                    <v-icon>mdi-account-group</v-icon>
                  </template>
                  <!-- Dropdown vendor with icon -->
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-avatar size="32" class="mr-2">
                          <v-img :src="item.raw.filename || '/default-vendor.png'" :alt="item.vendor_name" />
                        </v-avatar>
                      </template>
                      <v-list-item-content>
                        <v-list-item-title>{{ item.vendor_name }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>

                  <!-- Selected vendor with icon -->
                  <template #selection="{ item }">
                    <div v-if="item" class="d-flex align-center">
                      <v-avatar size="24" class="mr-2">
                        <v-img :src="item.raw.filename || '/default-vendor.png'" :alt="item.vendor_name" />
                      </v-avatar>
                      <span>{{ item.raw.vendor_name }}</span>
                    </div>
                  </template>
                  <template #append>
                    <v-btn icon small color="primary" @click="openVendorDialog" class="ma-0">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                </v-autocomplete>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.order_date" label="Purchase Date *" type="date"
                :rules="[v => !!v || 'Date is required']" variant="outlined" dense density="compact"
                style="max-width: 200px;">
                <template #prepend-inner>
                  <v-icon>mdi-calendar</v-icon>
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
          <v-btn color="primary" variant="tonal" small @click="addOrderItem">
            <v-icon start>mdi-plus</v-icon> Add Item
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row v-for="(item, i) in form.items" :key="i" class="mb-4 order-item-row" align="center">
            <v-col cols="12" md="5" class="d-flex align-center">
              <div class="d-flex align-center ga-2" style="width: 100%">
                <v-autocomplete v-model="item.id" :items="components" item-title="name" item-value="id"
                  label="Component *" :loading="stockStore.loading" :rules="[v => !!v || 'Component required']"
                  variant="outlined" dense clearable @update:model-value="val => onComponentChange(val, i)"
                  style="flex-grow: 1">
                  <template #prepend-inner>
                    <v-icon small>mdi-chip</v-icon>
                  </template>

                  <!-- Custom item slot -->
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props" :title="item.raw.name">
                      <template #prepend>
                        <v-avatar size="32" class="mr-2">
                          <v-img :src="item.raw.filename || '/default-component.png'" :alt="item.raw.name" />
                        </v-avatar>
                      </template>
                      <v-list-item-content>
                        <v-list-item-subtitle class="text--secondary">{{ item.raw.category_name
                          }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>

                  <!-- Selection slot -->
                  <template #selection="{ item }">
                    <div class="d-flex align-center">
                      <v-avatar size="24" class="mr-2">
                        <v-img :src="item.raw.filename || '/default-component.png'" :alt="item.raw.name" />
                      </v-avatar>
                      <span><small class="text--secondary">{{ item.raw.name }}({{ item.raw.category_name
                      }})</small></span>
                    </div>
                  </template>
                  <template #append>
                    <v-btn icon x-small color="primary" @click="openComponentDialog(i)" class="align-self-center ml-2">
                      <v-icon small>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                </v-autocomplete>


              </div>
            </v-col>

            <v-col cols="6" md="2" class="d-flex align-center">
              <v-text-field v-model.number="item.quantity" label="Quantity *" type="number" min="1"
                :rules="[v => v > 0 || 'Quantity must be > 0']" variant="outlined" dense style="flex-grow: 1"
                @input="calculateItemTotal(i)" />
            </v-col>

            <v-col cols="6" md="2" class="d-flex align-center">
              <v-text-field v-model.number="item.unit_cost" label="Unit Cost *" type="number" min="0" step="0.01"
                :rules="[v => v >= 0 || 'Cost must be >= 0']" variant="outlined" dense prefix="₹" style="flex-grow: 1"
                @input="calculateItemTotal(i)" />
            </v-col>

            <v-col cols="6" md="2" class="d-flex align-center">
              <v-text-field :value="formatCurrency(item.total)" label="Total" variant="outlined" dense
                style="flex-grow: 1" />
            </v-col>

            <v-col cols="6" md="1" class="d-flex align-center justify-center">
              <v-btn icon small color="error" :disabled="form.items.length === 1" @click="removeOrderItem(i)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>

            <v-col cols="12">
              <v-divider v-if="i < form.items.length - 1" />
            </v-col>
          </v-row>

          <div v-if="form.items.length === 0" class="text-center py-12">
            <v-icon size="80" color="grey-lighten-2">mdi-cart-outline</v-icon>
            <p class="mt-4 text-body-1 text-medium-emphasis">No items added yet</p>
            <v-btn color="primary" class="mt-4" @click="addOrderItem">
              <v-icon start>mdi-plus</v-icon> Add First Item
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
              <v-textarea v-model="form.notes" label="Notes (Optional)" rows="3" variant="outlined" density="dense" />
            </v-col>
            <v-col cols="12" md="4">
              <v-card color="success-lighten-5" elevation="0">
                <v-card-text class="pa-4">
                  <div class="d-flex justify-space-between mb-2">
                    <span>Total Items:</span>
                    <span>{{ form.items.length }}</span>
                  </div>
                  <div class="d-flex justify-space-between mb-2">
                    <span>Total Quantity:</span>
                    <span>{{ totalQuantity }}</span>
                  </div>
                  <v-divider class="my-3" />
                  <div class="d-flex justify-space-between">
                    <span class="font-weight-bold">Grand Total:</span>
                    <span class="font-weight-bold text-success">{{ formatCurrency(grandTotal) }}</span>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Action buttons -->
      <v-card elevation="2">
        <v-card-actions class="pa-6 justify-end">
          <v-btn outlined large @click="goBack">Cancel</v-btn>
          <v-btn color="primary" type="submit" large :loading="saving" :disabled="!valid || form.items.length === 0"
            elevation="2">
            <v-icon start>mdi-check</v-icon> Save Purchase Order
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>

    <!-- Add Vendor Dialog -->
    <v-dialog v-model="vendorDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="pa-5">
          <v-icon class="mr-3" color="primary">mdi-account-plus</v-icon>
          Add New Vendor
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-text-field v-model="newVendor.vendor_name" label="Vendor Name *"
            :rules="[v => !!v || 'Vendor name is required']" dense />
          <v-text-field v-model="newVendor.contact_email" label="Email" type="email" dense />
          <v-text-field v-model="newVendor.contact_phone" label="Phone" dense />
          <v-text-field v-model="newVendor.website" label="Website" type="url" dense />

          <!-- File input for icon -->
          <v-file-input label="Upload Icon" accept="image/*" dense @update:model-value="handleVendorIconUpload"  :show-size="true"
            prepend-icon="mdi-image" />
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn outlined @click="vendorDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveVendor" :loading="savingVendor" elevation="2">Save Vendor</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <!-- Add Component Dialog -->
    <v-dialog v-model="componentDialog" max-width="600" persistent>
      <v-card>
        <v-card-title class="pa-5">
          <v-icon class="mr-3" color="primary">mdi-chip</v-icon>
          Add New Component
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-text-field v-model="newComponent.name" label="Component Name *"
            :rules="[v => !!v || 'Component name is required']" dense class="mb-4" />
          <div class="d-flex align-center ga-2 mb-4">
            <v-autocomplete v-model="newComponent.category_id" :items="categories" item-title="category_name"
              item-value="category_id" label="Category *" :loading="categoryStore.loading"
              :rules="[v => !!v || 'Category is required']" dense />
            <v-btn icon small color="primary" @click="openCategoryDialog">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>
          <div class="d-flex align-center ga-2 mb-4">
            <v-autocomplete v-model="newComponent.box_id" :items="boxes" item-title="box_label" item-value="box_id"
              label="Storage Box *" :loading="boxStore.loading" :rules="[v => !!v || 'Box is required']" dense />
            <v-btn icon small color="primary" @click="openBoxDialog">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>
          <v-textarea v-model="newComponent.description" label="Description" rows="3" dense />
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn outlined @click="componentDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveComponent" :loading="savingComponent" elevation="2">Save Component</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Category Dialog -->
    <v-dialog v-model="categoryDialog" max-width="400" persistent>
      <v-card>
        <v-card-title class="pa-5">
          <v-icon class="mr-3" color="primary">mdi-shape</v-icon>
          Add New Category
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-text-field v-model="newCategory.category_name" label="Category Name *"
            :rules="[v => !!v || 'Category name is required']" dense />
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn outlined @click="categoryDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveCategory" :loading="savingCategory" elevation="2">Save Category</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Box Dialog -->
    <v-dialog v-model="boxDialog" max-width="400" persistent>
      <v-card>
        <v-card-title class="pa-5">
          <v-icon class="mr-3" color="primary">mdi-package-variant</v-icon>
          Add New Storage Box
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-text-field v-model="newBox.box_label" label="Box Label *" :rules="[v => !!v || 'Box label is required']"
            dense class="mb-4" />
          <v-text-field v-model="newBox.box_code" label="Box Code" dense />
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn outlined @click="boxDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveBox" :loading="savingBox" elevation="2">Save Box</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbars -->
    <v-snackbar v-model="showSuccess" color="success" location="top right" :timeout="3000">
      <v-icon class="mr-2">mdi-check-circle</v-icon> {{ successMessage }}
    </v-snackbar>

    <v-snackbar v-model="showError" color="error" location="top right" :timeout="5000">
      <v-icon class="mr-2">mdi-alert-circle</v-icon> {{ errorMessage }}
    </v-snackbar>
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

const router = useRouter()
const vendorStore = useVendorStore()
const stockStore = useStockStore()
const categoryStore = useCategoryStore()
const boxStore = useBoxStore()
const orderStore = useOrderStore()

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
  items: [{ component_id: null, category_name: '', quantity: 1, unit_cost: 0, total: 0 }]
})

// Dialogs
const vendorDialog = ref(false)
const componentDialog = ref(false)
const categoryDialog = ref(false)
const boxDialog = ref(false)
const currentItemIndex = ref(null)

// New entity forms
const newVendor = ref({
  vendor_name: '',
  contact_email: '',
  contact_phone: '',
  vendor_icon_name: '',
  vendor_icon_type: '',
  vendor_icon_content: '',
  website: ''
})
const newComponent = ref({ name: '', category_id: null, box_id: null, description: '' })
const newCategory = ref({ category_name: '' })
const newBox = ref({ box_label: '', box_code: '' })

// Snackbar
const showSuccess = ref(false)
const showError = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Computed totals
const totalQuantity = computed(() => form.value.items.reduce((s, i) => s + (i.quantity || 0), 0))
const grandTotal = computed(() => form.value.items.reduce((s, i) => s + (i.total || 0), 0))
const formatCurrency = v => `₹${(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

const fetchData = async () => {
  let components_ = await stockStore.allComponents();
  let vendors_ = await vendorStore.allVendors();
  components.value = components_;
  vendors.value = vendors_;
}

// Methods
const calculateItemTotal = i => {
  const it = form.value.items[i]
  it.total = (it.quantity || 0) * (it.unit_cost || 0)
}

const addOrderItem = () => {
  form.value.items.push({ component_id: null, category_name: '', quantity: 1, unit_cost: 0, total: 0 })
}

const removeOrderItem = i => {
  form.value.items.splice(i, 1)
}

const onComponentChange = (cid, i) => {
  const c = components.value.find(x => x.component_id === cid)
  if (c) form.value.items[i].category_name = c.category_name
  else form.value.items[i].category_name = ''
}

const goBack = () => router.push({ name: 'Orders' })

// Save handlers for dialogs
const savingVendor = ref(false)
const savingComponent = ref(false)
const savingCategory = ref(false)
const savingBox = ref(false)

const openVendorDialog = () => {
  newVendor.value = { vendor_name: '', contact_email: '', contact_phone: '' }
  vendorDialog.value = true
}

const openComponentDialog = (index) => {
  currentItemIndex.value = index
  newComponent.value = { name: '', category_id: null, box_id: null, description: '' }
  componentDialog.value = true
}


function handleVendorIconUpload(files) {
  // If multiple files allowed, files is an array or FileList
  // If only single file allowed it could be the file itself
  console.log(files)
  if (!files) {
    clearVendorIcon()
    return
  }

  // Extract single file from array or use directly
  const file = Array.isArray(files) ? files[0] : files

  if (!(file instanceof Blob)) {
    clearVendorIcon()
    return
  }

  newVendor.value.vendor_icon_name = file.name
  newVendor.value.vendor_icon_type = file.type

  const reader = new FileReader()
  reader.onload = e => {
    const base64String = e.target.result.split(',')[1]
    newVendor.value.vendor_icon_content = base64String
  }
  reader.readAsDataURL(file)
}

function clearVendorIcon() {
  newVendor.value.vendor_icon_name = ''
  newVendor.value.vendor_icon_type = ''
  newVendor.value.vendor_icon_content = ''
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
    await vendorStore.createVendor({
      vendorname: newVendor.value.vendor_name,
      contactemail: newVendor.value.contact_email,
      phonenumber: newVendor.value.contact_phone,
      vendoriconname: newVendor.value.vendor_icon_name,
      vendoricontype: newVendor.value.vendor_icon_type,
      vendoriconcontent: newVendor.value.vendor_icon_content,
      website: newVendor.value.website
    });
    vendorDialog.value = false
    fetchData();
    successMessage.value = 'Vendor created successfully'
  } catch (e) {
    showError.value = true
    errorMessage.value = 'Failed to create vendor'
    console.log(e)
  } finally {
    savingVendor.value = false
  }
}

const saveComponent = async () => {
  if (!newComponent.value.name || !newComponent.value.category_id || !newComponent.value.box_id) return
  savingComponent.value = true
  try {
    await stockStore.createComponent(newComponent.value)
    componentDialog.value = false
    await stockStore.fetchStocks()
    // Update category name on current item
    const c = categories.value.find(cat => cat.category_id === newComponent.value.category_id)
    if (currentItemIndex.value !== null && c) {
      form.value.items[currentItemIndex.value].category_name = c.category_name
      form.value.items[currentItemIndex.value].component_id = stockStore.stocks[stockStore.stocks.length - 1].component_id
    }
    showSuccess.value = true
    successMessage.value = 'Component created successfully'
  } catch {
    showError.value = true
    errorMessage.value = 'Failed to create component'
  } finally {
    savingComponent.value = false
  }
}

const saveCategory = async () => {
  if (!newCategory.value.category_name) return
  savingCategory.value = true
  try {
    await categoryStore.createCategory(newCategory.value)
    categoryDialog.value = false
    await categoryStore.fetchCategories()
    showSuccess.value = true
    successMessage.value = 'Category created successfully'
  } catch {
    showError.value = true
    errorMessage.value = 'Failed to create category'
  } finally {
    savingCategory.value = false
  }
}

const saveBox = async () => {
  if (!newBox.value.box_label) return
  savingBox.value = true
  try {
    await boxStore.createBox(newBox.value)
    boxDialog.value = false
    await boxStore.fetchBoxes()
    showSuccess.value = true
    successMessage.value = 'Storage box created successfully'
  } catch {
    showError.value = true
    errorMessage.value = 'Failed to create box'
  } finally {
    savingBox.value = false
  }
}

const handleSubmit = async () => {
  const ok = await orderForm.value.validate()
  if (!ok || !form.value.items.length) return
  saving.value = true
  try {
    const created = await orderStore.createOrder({
      vendor_id: form.value.vendor_id,
      order_date: form.value.order_date,
      order_url: form.value.order_url,
      notes: form.value.notes,
      items: form.value.items
    })
    showSuccess.value = true
    successMessage.value = 'Purchase order created successfully!'
    router.push({ name: 'OrderDetail', params: { order_id: created.order_id } })
  } catch {
    showError.value = true
    errorMessage.value = 'Failed to create purchase order'
  } finally {
    saving.value = false
  }
}

// Load all lists if empty when mounted
onMounted(async () => {
  if (!vendorStore.vendors.length) await vendorStore.fetchVendors()
  if (!stockStore.stocks.length) await stockStore.fetchStocks()

  if (!categoryStore.categories.length) await categoryStore.fetchCategories()
  if (!boxStore.boxes.length) await boxStore.fetchBoxes()

  fetchData()
})
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
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
