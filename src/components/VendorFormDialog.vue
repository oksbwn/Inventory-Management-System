<template>
  <v-dialog v-model="dialog" max-width="900px" persistent scrollable>
    <v-card class="rounded-lg">
      <v-card-title class="pa-6 pb-4 bg-primary text-white">
        <div class="d-flex align-center">
          <v-icon class="mr-3" color="white">
            {{ isEditMode ? 'mdi-pencil' : 'mdi-plus-circle' }}
          </v-icon>
          <span class="text-h5 font-weight-bold">
            {{ isEditMode ? 'Edit Vendor' : 'Add New Vendor' }}
          </span>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="valid" @submit.prevent="handleSubmit">
          <v-row>
            <!-- Company Information -->
            <v-col cols="12">
              <h3 class="text-h6 mb-3">Company Information</h3>
            </v-col>

            <!-- Company Name -->
            <v-col cols="12" md="8">
              <v-text-field
                v-model="formData.companyName"
                label="Company Name"
                :rules="companyNameRules"
                prepend-inner-icon="mdi-domain"
                variant="outlined"
                density="comfortable"
                required
                clearable
              ></v-text-field>
            </v-col>

            <!-- Vendor Code -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.vendorCode"
                label="Vendor Code"
                :rules="vendorCodeRules"
                prepend-inner-icon="mdi-identifier"
                variant="outlined"
                density="comfortable"
                required
                clearable
              ></v-text-field>
            </v-col>

            <!-- Business Type -->
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.businessType"
                :items="businessTypes"
                label="Business Type"
                prepend-inner-icon="mdi-briefcase"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>

            <!-- Status -->
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.status"
                :items="statusOptions"
                label="Status"
                :rules="statusRules"
                prepend-inner-icon="mdi-flag"
                variant="outlined"
                density="comfortable"
                required
              ></v-select>
            </v-col>

            <!-- Contact Information -->
            <v-col cols="12">
              <h3 class="text-h6 mb-3 mt-4">Contact Information</h3>
            </v-col>

            <!-- Contact Person -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.contactPerson"
                label="Contact Person"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                density="comfortable"
                clearable
              ></v-text-field>
            </v-col>

            <!-- Email -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.email"
                label="Email"
                :rules="emailRules"
                type="email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                density="comfortable"
                required
                clearable
              ></v-text-field>
            </v-col>

            <!-- Phone -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.phone"
                label="Phone"
                :rules="phoneRules"
                prepend-inner-icon="mdi-phone"
                variant="outlined"
                density="comfortable"
                required
                clearable
              ></v-text-field>
            </v-col>

            <!-- Alternate Phone -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.alternatePhone"
                label="Alternate Phone"
                prepend-inner-icon="mdi-phone-outline"
                variant="outlined"
                density="comfortable"
                clearable
              ></v-text-field>
            </v-col>

            <!-- Website -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.website"
                label="Website"
                type="url"
                prepend-inner-icon="mdi-web"
                variant="outlined"
                density="comfortable"
                clearable
                hint="https://example.com"
              ></v-text-field>
            </v-col>

            <!-- Address Information -->
            <v-col cols="12">
              <h3 class="text-h6 mb-3 mt-4">Address</h3>
            </v-col>

            <!-- Street Address -->
            <v-col cols="12">
              <v-textarea
                v-model="formData.address"
                label="Street Address"
                prepend-inner-icon="mdi-map-marker"
                variant="outlined"
                density="comfortable"
                rows="2"
                clearable
              ></v-textarea>
            </v-col>

            <!-- City -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.city"
                label="City"
                prepend-inner-icon="mdi-city"
                variant="outlined"
                density="comfortable"
                clearable
              ></v-text-field>
            </v-col>

            <!-- State -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.state"
                label="State/Province"
                prepend-inner-icon="mdi-map"
                variant="outlined"
                density="comfortable"
                clearable
              ></v-text-field>
            </v-col>

            <!-- Postal Code -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.postalCode"
                label="Postal Code"
                prepend-inner-icon="mdi-mailbox"
                variant="outlined"
                density="comfortable"
                clearable
              ></v-text-field>
            </v-col>

            <!-- Country -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.country"
                label="Country"
                prepend-inner-icon="mdi-earth"
                variant="outlined"
                density="comfortable"
                clearable
              ></v-text-field>
            </v-col>

            <!-- Business Details -->
            <v-col cols="12">
              <h3 class="text-h6 mb-3 mt-4">Business Details</h3>
            </v-col>

            <!-- Tax ID / GST -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.taxId"
                label="Tax ID / GST Number"
                prepend-inner-icon="mdi-receipt-text"
                variant="outlined"
                density="comfortable"
                clearable
              ></v-text-field>
            </v-col>

            <!-- Payment Terms -->
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.paymentTerms"
                :items="paymentTermsOptions"
                label="Payment Terms"
                prepend-inner-icon="mdi-calendar-clock"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>

            <!-- Credit Limit -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formData.creditLimit"
                label="Credit Limit (₹)"
                type="number"
                prepend-inner-icon="mdi-currency-inr"
                variant="outlined"
                density="comfortable"
                min="0"
              ></v-text-field>
            </v-col>

            <!-- Rating -->
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.rating"
                :items="[1, 2, 3, 4, 5]"
                label="Vendor Rating"
                prepend-inner-icon="mdi-star"
                variant="outlined"
                density="comfortable"
              >
                <template v-slot:selection="{ item }">
                  <v-rating
                    :model-value="item.value"
                    readonly
                    density="compact"
                    size="small"
                  ></v-rating>
                </template>
              </v-select>
            </v-col>

            <!-- Categories -->
            <v-col cols="12">
              <v-combobox
                v-model="formData.categories"
                label="Product Categories"
                prepend-inner-icon="mdi-shape"
                variant="outlined"
                density="comfortable"
                multiple
                chips
                closable-chips
                hint="Categories this vendor supplies"
                persistent-hint
              ></v-combobox>
            </v-col>

            <!-- Notes -->
            <v-col cols="12">
              <v-textarea
                v-model="formData.notes"
                label="Notes"
                prepend-inner-icon="mdi-note-text"
                variant="outlined"
                density="comfortable"
                rows="3"
                clearable
              ></v-textarea>
            </v-col>

            <!-- Preferred Vendor -->
            <v-col cols="12">
              <v-switch
                v-model="formData.isPreferred"
                label="Preferred Vendor"
                color="success"
                hide-details
              ></v-switch>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-6 pt-4">
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          size="large"
          @click="handleCancel"
          :disabled="loading"
          class="text-none px-6"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          size="large"
          @click="handleSubmit"
          :loading="loading"
          :disabled="!valid"
          class="text-none px-6"
        >
          {{ isEditMode ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useVendorStore } from '@/stores/vendorStore'

const props = defineProps({
  modelValue: Boolean,
  vendorItem: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const vendorStore = useVendorStore()
const formRef = ref(null)
const valid = ref(false)
const loading = ref(false)

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEditMode = computed(() => !!props.vendorItem?.id)

const formData = ref({
  companyName: '',
  vendorCode: '',
  businessType: 'Manufacturer',
  status: 'Active',
  contactPerson: '',
  email: '',
  phone: '',
  alternatePhone: '',
  website: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  taxId: '',
  paymentTerms: 'Net 30',
  creditLimit: 0,
  rating: 3,
  categories: [],
  notes: '',
  isPreferred: false
})

const businessTypes = ref([
  'Manufacturer',
  'Distributor',
  'Wholesaler',
  'Retailer',
  'Service Provider'
])

const statusOptions = ref(['Active', 'Inactive', 'Pending', 'Blacklisted'])

const paymentTermsOptions = ref([
  'Immediate',
  'Net 15',
  'Net 30',
  'Net 45',
  'Net 60',
  'Net 90'
])

const companyNameRules = [
  v => !!v || 'Company name is required',
  v => (v && v.length >= 2) || 'Name must be at least 2 characters'
]

const vendorCodeRules = [
  v => !!v || 'Vendor code is required'
]

const statusRules = [v => !!v || 'Status is required']

const emailRules = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const phoneRules = [
  v => !!v || 'Phone is required',
  v => /^[0-9]{10,15}$/.test(v) || 'Phone must be valid'
]

const resetForm = () => {
  formData.value = {
    companyName: '',
    vendorCode: '',
    businessType: 'Manufacturer',
    status: 'Active',
    contactPerson: '',
    email: '',
    phone: '',
    alternatePhone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    taxId: '',
    paymentTerms: 'Net 30',
    creditLimit: 0,
    rating: 3,
    categories: [],
    notes: '',
    isPreferred: false
  }
  if (formRef.value) {
    formRef.value.reset()
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  const { valid: isValid } = await formRef.value.validate()
  
  if (!isValid) return

  loading.value = true

  try {
    if (isEditMode.value) {
      await vendorStore.updateVendor(props.vendorItem.id, formData.value)
    } else {
      await vendorStore.createVendor(formData.value)
    }

    emit('success', {
      type: isEditMode.value ? 'update' : 'create',
      message: `Vendor ${isEditMode.value ? 'updated' : 'created'} successfully!`
    })
    
    dialog.value = false
    resetForm()
  } catch (error) {
    console.error('Failed to save vendor:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  dialog.value = false
  resetForm()
}

watch(() => props.vendorItem, (newItem) => {
  if (newItem) {
    formData.value = { ...newItem }
  } else {
    resetForm()
  }
}, { immediate: true })
</script>

<style scoped>
.bg-primary {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-primary-darken-1)) 100%);
}
</style>
