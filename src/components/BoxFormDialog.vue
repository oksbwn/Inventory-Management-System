<template>
  <v-dialog v-model="dialog" max-width="700px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="pa-6 pb-4 bg-primary text-white">
        <div class="d-flex align-center">
          <v-icon class="mr-3" color="white">
            {{ isEditMode ? 'mdi-pencil' : 'mdi-plus-circle' }}
          </v-icon>
          <span class="text-h5 font-weight-bold">
            {{ isEditMode ? 'Edit Storage Box' : 'Add New Storage Box' }}
          </span>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="valid" @submit.prevent="handleSubmit">
          <v-row>
            <!-- Box Name/Label -->
            <v-col cols="12" md="8">
              <v-text-field
                v-model="formData.name"
                label="Box Name/Label"
                :rules="nameRules"
                prepend-inner-icon="mdi-package-variant"
                variant="outlined"
                density="comfortable"
                required
                clearable
              ></v-text-field>
            </v-col>

            <!-- Box Number -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.boxNumber"
                label="Box Number"
                :rules="boxNumberRules"
                prepend-inner-icon="mdi-numeric"
                variant="outlined"
                density="comfortable"
                required
                clearable
              ></v-text-field>
            </v-col>

            <!-- Location/Warehouse -->
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.warehouse"
                :items="warehouses"
                label="Warehouse"
                :rules="warehouseRules"
                prepend-inner-icon="mdi-warehouse"
                variant="outlined"
                density="comfortable"
                required
              ></v-select>
            </v-col>

            <!-- Zone/Section -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.zone"
                label="Zone/Section"
                prepend-inner-icon="mdi-grid"
                variant="outlined"
                density="comfortable"
                clearable
                hint="e.g., A-1, B-3, Zone-A"
                persistent-hint
              ></v-text-field>
            </v-col>

            <!-- Row -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.row"
                label="Row"
                prepend-inner-icon="mdi-table-row"
                variant="outlined"
                density="comfortable"
                clearable
              ></v-text-field>
            </v-col>

            <!-- Shelf -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.shelf"
                label="Shelf"
                prepend-inner-icon="mdi-bookshelf"
                variant="outlined"
                density="comfortable"
                clearable
              ></v-text-field>
            </v-col>

            <!-- Bin/Position -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.bin"
                label="Bin/Position"
                prepend-inner-icon="mdi-box"
                variant="outlined"
                density="comfortable"
                clearable
              ></v-text-field>
            </v-col>

            <!-- Capacity -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model.number="formData.capacity"
                label="Capacity (items)"
                type="number"
                :rules="capacityRules"
                prepend-inner-icon="mdi-counter"
                variant="outlined"
                density="comfortable"
                min="0"
              ></v-text-field>
            </v-col>

            <!-- Current Occupancy -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model.number="formData.currentOccupancy"
                label="Current Occupancy"
                type="number"
                prepend-inner-icon="mdi-inbox-full"
                variant="outlined"
                density="comfortable"
                min="0"
                readonly
                disabled
              ></v-text-field>
            </v-col>

            <!-- Status -->
            <v-col cols="12" md="4">
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

            <!-- Box Type -->
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.boxType"
                :items="boxTypes"
                label="Box Type"
                prepend-inner-icon="mdi-shape"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>

            <!-- Temperature Controlled -->
            <v-col cols="12" md="6">
              <v-switch
                v-model="formData.isTemperatureControlled"
                label="Temperature Controlled"
                color="info"
                hide-details
              ></v-switch>
            </v-col>

            <!-- Barcode/QR Code -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.barcode"
                label="Barcode/QR Code"
                prepend-inner-icon="mdi-barcode"
                variant="outlined"
                density="comfortable"
                clearable
              ></v-text-field>
            </v-col>

            <!-- Access Level -->
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.accessLevel"
                :items="accessLevels"
                label="Access Level"
                prepend-inner-icon="mdi-shield-lock"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>

            <!-- Notes -->
            <v-col cols="12">
              <v-textarea
                v-model="formData.notes"
                label="Notes"
                prepend-inner-icon="mdi-note-text"
                variant="outlined"
                density="comfortable"
                rows="2"
                clearable
              ></v-textarea>
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
import { useBoxStore } from '@/stores/boxStore'

const props = defineProps({
  modelValue: Boolean,
  boxItem: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const boxStore = useBoxStore()
const formRef = ref(null)
const valid = ref(false)
const loading = ref(false)

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEditMode = computed(() => !!props.boxItem?.id)

const formData = ref({
  name: '',
  boxNumber: '',
  warehouse: '',
  zone: '',
  row: '',
  shelf: '',
  bin: '',
  capacity: 100,
  currentOccupancy: 0,
  status: 'Active',
  boxType: 'Standard',
  isTemperatureControlled: false,
  barcode: '',
  accessLevel: 'Standard',
  notes: ''
})

const warehouses = ref([
  'Main Warehouse',
  'Warehouse A',
  'Warehouse B',
  'Distribution Center',
  'Storage Facility 1'
])

const statusOptions = ref([
  'Active',
  'Inactive',
  'Maintenance',
  'Full',
  'Reserved'
])

const boxTypes = ref([
  'Standard',
  'Oversized',
  'Small Parts',
  'Bulk Storage',
  'Hazardous Materials',
  'Refrigerated'
])

const accessLevels = ref([
  'Standard',
  'Restricted',
  'High Security',
  'Management Only'
])

const nameRules = [
  v => !!v || 'Box name is required',
  v => (v && v.length >= 2) || 'Name must be at least 2 characters'
]

const boxNumberRules = [
  v => !!v || 'Box number is required'
]

const warehouseRules = [
  v => !!v || 'Warehouse is required'
]

const statusRules = [
  v => !!v || 'Status is required'
]

const capacityRules = [
  v => v !== null && v !== '' || 'Capacity is required',
  v => v >= 0 || 'Capacity must be 0 or greater'
]

const resetForm = () => {
  formData.value = {
    name: '',
    boxNumber: '',
    warehouse: '',
    zone: '',
    row: '',
    shelf: '',
    bin: '',
    capacity: 100,
    currentOccupancy: 0,
    status: 'Active',
    boxType: 'Standard',
    isTemperatureControlled: false,
    barcode: '',
    accessLevel: 'Standard',
    notes: ''
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
      await boxStore.updateBox(props.boxItem.id, formData.value)
    } else {
      await boxStore.createBox(formData.value)
    }

    emit('success', {
      type: isEditMode.value ? 'update' : 'create',
      message: `Storage box ${isEditMode.value ? 'updated' : 'created'} successfully!`
    })
    
    dialog.value = false
    resetForm()
  } catch (error) {
    console.error('Failed to save box:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  dialog.value = false
  resetForm()
}

watch(() => props.boxItem, (newItem) => {
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
