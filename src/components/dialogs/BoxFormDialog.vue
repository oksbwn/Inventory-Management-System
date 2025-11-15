<template>
  <v-dialog 
    :model-value="modelValue" 
    @update:model-value="$emit('update:modelValue', $event)" 
    max-width="600px"
    persistent 
    scrollable
  >
    <v-card class="box-dialog">
      <!-- Custom Header with Gradient -->
      <v-card-title class="dialog-header pa-6">
        <div class="d-flex align-center">
          <v-avatar :color="isEdit ? 'primary' : 'success'" size="40" class="mr-3">
            <v-icon color="white" size="24">
              {{ isEdit ? 'mdi-pencil' : 'mdi-plus' }}
            </v-icon>
          </v-avatar>
          <div>
            <h2 class="text-h6 font-weight-bold mb-0">
              {{ isEdit ? 'Edit Storage Box' : 'Add New Storage Box' }}
            </h2>
            <p class="text-caption text-medium-emphasis mb-0">
              {{ isEdit ? 'Update box information' : 'Create a new storage box with QR code' }}
            </p>
          </div>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <!-- QR Code Preview -->
          <div class="text-center mb-6">
            <div class="qr-code-preview mx-auto">
              <v-img v-if="displayQrCode" :src="displayQrCode" alt="Box QR Code" class="qr-image" />
              <div v-else class="qr-placeholder">
                <v-icon size="60" color="grey-lighten-1">mdi-qrcode</v-icon>
              </div>
            </div>
            <p class="text-caption text-medium-emphasis mt-3 mb-0">
              {{ isEdit ? 'Existing QR Code (cannot be changed)' : 'Auto-generated QR Code' }}
            </p>
          </div>

          <!-- Form Fields -->
          <v-row dense>
            <v-col cols="12">
              <BaseFormField
                label="Box Label"
                required
                helper-text="Enter a descriptive name for the box"
              >
                <v-text-field 
                  v-model="formData.box_label" 
                  :rules="[rules.required]"
                  prepend-inner-icon="mdi-label" 
                  variant="outlined" 
                  density="comfortable" 
                  hide-details
                  placeholder="e.g., Electronics Box"
                  @input="handleLabelChange"
                />
              </BaseFormField>
            </v-col>

            <v-col cols="12" class="mt-4">
              <BaseFormField
                label="Box Size"
                required
                helper-text="Select the physical size of the storage box"
              >
                <v-select 
                  v-model="formData.box_size" 
                  :items="boxSizes" 
                  :rules="[rules.required]"
                  prepend-inner-icon="mdi-resize" 
                  variant="outlined" 
                  density="comfortable" 
                  hide-details
                  @update:model-value="handleSizeChange"
                >
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-icon :size="getSizeIconSize(item.value)">mdi-package-variant</v-icon>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </BaseFormField>
            </v-col>

            <v-col cols="12" class="mt-4">
              <BaseFormField
                label="Box Code"
                helper-text="Auto-generated code based on size and ID"
              >
                <v-text-field 
                  v-model="formData.box_code" 
                  prepend-inner-icon="mdi-barcode" 
                  variant="outlined"
                  density="comfortable" 
                  hide-details
                  readonly
                  :placeholder="isEdit ? formData.box_code : 'Auto-generated: SIZE-ID'" 
                />
              </BaseFormField>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-6">
        <v-spacer />
        <BaseButton 
          variant="outlined" 
          color="secondary"
          @click="handleClose" 
          size="large" 
          :disabled="loading"
        >
          Cancel
        </BaseButton>
        <BaseButton 
          variant="contained"
          color="primary" 
          @click="handleSubmit" 
          :loading="loading" 
          size="large" 
          class="px-6"
        >
          {{ isEdit ? 'Update Box' : 'Create Box' }}
        </BaseButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useBoxStore } from '@/stores/boxStore'
import QRCode from 'qrcode'

const props = defineProps({
  modelValue: Boolean,
  boxItem: Object
})

const emit = defineEmits(['update:modelValue', 'success'])

const boxStore = useBoxStore()
const formRef = ref(null)
const loading = ref(false)
const qrCodeDataUrl = ref('')
const existingQrData = ref(null)
const nextBoxId = ref(null)

const boxSizes = [
  { title: 'X - Extra Small', value: 'X' },
  { title: 'XL - Large', value: 'XL' },
  { title: 'XXL - Extra Large', value: 'XXL' },
  { title: 'XXXL - Extra Extra Large', value: 'XXXL' }
]

const formData = ref({
  box_label: '',
  box_size: '',
  box_code: ''
})

const rules = {
  required: value => !!value || 'This field is required'
}

const isEdit = computed(() => !!props.boxItem?.box_id)

const displayQrCode = computed(() => {
  if (isEdit.value && existingQrData.value) {
    return existingQrData.value
  }
  return qrCodeDataUrl.value
})

const getSizeIconSize = (size) => {
  const sizeMap = { 'X': 20, 'XL': 28, 'XXL': 36, 'XXXL': 44 }
  return sizeMap[size] || 24
}

// Generate QR code with current data
const generateQRCode = async () => {
  if (isEdit.value || !nextBoxId.value) return

  try {
    const qrContent = JSON.stringify({
      type: 'Container',
      id: nextBoxId.value
    })

    qrCodeDataUrl.value = await QRCode.toDataURL(qrContent, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' }
    })
  } catch (error) {
    console.error('QR Generation Error:', error)
  }
}

// Fetch next box ID and immediately generate QR
const fetchNextBoxId = async () => {
  try {
    const response = await boxStore.getNextBoxId()
    nextBoxId.value = typeof response === 'number' ? response : (response?.next_id || 1)
    await generateQRCode()
  } catch (error) {
    console.error('Error fetching next box ID:', error)
    nextBoxId.value = 1
  }
}

// Handle size change
const handleSizeChange = async (newSize) => {
  if (!isEdit.value && newSize && nextBoxId.value) {
    formData.value.box_code = `${newSize}-${nextBoxId.value}`
    await generateQRCode()
  }
}

// Handle label change
const handleLabelChange = async () => {
  await generateQRCode()
}

// Watch dialog open
watch(() => props.modelValue, async (isOpen) => {
  if (isOpen && !isEdit.value) {
    await fetchNextBoxId()
  }
})

// Watch box item changes
watch(() => props.boxItem, (item) => {
  if (item) {
    formData.value = {
      box_label: item.box_label || '',
      box_size: item.box_size || '',
      box_code: item.box_code || ''
    }
    existingQrData.value = item.filename || null
  }
}, { immediate: true })

const handleClose = () => {
  emit('update:modelValue', false)
  setTimeout(() => {
    formData.value = { box_label: '', box_size: '', box_code: '' }
    qrCodeDataUrl.value = ''
    existingQrData.value = null
    nextBoxId.value = null
    formRef.value?.resetValidation()
  }, 300)
}

// ✅ UPDATED: Use boxStore to create/update box
const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true

  try {
    const boxData = { ...formData.value }

    if (!isEdit.value && qrCodeDataUrl.value) {
      boxData.box_qr_content = qrCodeDataUrl.value.split(',')[1]
      boxData.box_qr_file_type = 'png'
      boxData.box_qr_filename = 'QRCode'
    }

    if (isEdit.value) {
      // Update existing box
      await boxStore.updateBox(props.boxItem.box_id, boxData)
    } else {
      // Create new box
      await boxStore.createBox(boxData)
    }

    emit('success', {
      message: isEdit.value ? 'Storage box updated successfully!' : 'Storage box created successfully!',
      isEdit: isEdit.value,
      id: props.boxItem?.box_id
    })

    handleClose()
  } catch (error) {
    console.error('Error saving box:', error)
    throw error
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.box-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.dialog-header .text-medium-emphasis {
  color: rgba(255, 255, 255, 0.8) !important;
}

.qr-code-preview {
  width: 200px;
  height: 200px;
  border-radius: 12px;
  border: 2px solid #e8edf2;
  overflow: hidden;
  background: white;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qr-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
}
</style>
