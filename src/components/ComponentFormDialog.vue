<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600px"
    persistent scrollable>
    <v-card class="component-dialog" rounded="lg">
      <v-card-title class="dialog-header pa-5">
        <div class="d-flex align-center ga-3">
          <v-avatar :color="isEdit ? 'primary' : 'success'" size="48" rounded="lg">
            <v-icon color="white" size="28">
              {{ isEdit ? 'mdi-pencil' : 'mdi-plus' }}
            </v-icon>
          </v-avatar>
          <div>
            <h2 class="text-h6 font-weight-bold mb-1">
              {{ isEdit ? 'Edit Component' : 'Add New Component' }}
            </h2>
            <p class="text-caption text-medium-emphasis mb-0">
              {{ isEdit ? 'Update component information' : 'Create a new component entry' }}
            </p>
          </div>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6" style="max-height: 600px;">
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <!-- Component Icon Upload Section -->
          <div class="text-center mb-6">
            <div class="position-relative d-inline-block">
              <v-avatar size="96" color="grey-lighten-4" class="component-icon-display" rounded="lg">
                <v-img v-if="imagePreview" :src="imagePreview" cover />
                <v-icon v-else size="48" color="grey-lighten-1">
                  mdi-chip
                </v-icon>
              </v-avatar>

              <!-- Upload button overlay -->
              <v-btn icon size="small" color="primary" class="upload-btn" @click="triggerFileInput" elevation="2"
                rounded="circle">
                <v-icon size="16">mdi-camera</v-icon>
              </v-btn>
            </div>

            <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="handleFileUpload" />

            <p class="text-caption text-medium-emphasis mt-3 mb-0">
              {{ imagePreview ? 'Click camera icon to change' : 'Click camera icon to upload' }}
            </p>

            <v-btn v-if="imagePreview" variant="text" size="x-small" color="error" @click="clearImage" class="mt-2">
              Remove Image
            </v-btn>
          </div>

          <!-- Form Fields -->
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="form.name" label="Component Name *" :rules="[rules.required]" variant="outlined"
                density="comfortable" hide-details="auto" autofocus placeholder="e.g., Arduino Uno, Resistor 10k"
                rounded="0">
                <template #prepend-inner>
                  <v-icon size="20" color="primary">mdi-chip</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" class="mt-2">
              <div class="d-flex ga-2 align-center">
                <v-autocomplete v-model="form.category_id" :items="categories" item-title="category_name"
                  item-value="category_id" label="Category *" :rules="[rules.required]" variant="outlined"
                  density="comfortable" hide-details="auto" style="flex: 1" placeholder="Select a category" rounded="0">
                  <template #prepend-inner>
                    <v-icon size="20" color="primary">mdi-shape</v-icon>
                  </template>
                </v-autocomplete>
                <v-btn icon color="primary" density="comfortable" rounded="0" @click="$emit('add-category')">
                  <v-icon size="20">mdi-plus</v-icon>
                  <v-tooltip activator="parent" location="top">Add Category</v-tooltip>
                </v-btn>
              </div>
            </v-col>

            <v-col cols="12" class="mt-2">
              <div class="d-flex ga-2 align-center">
                <v-autocomplete v-model="form.box_id" :items="boxes" item-title="box_label" item-value="box_id"
                  label="Storage Box *" :rules="[rules.required]" variant="outlined" density="comfortable"
                  hide-details="auto" style="flex: 1" placeholder="Select storage location" rounded="0">
                  <template #prepend-inner>
                    <v-icon size="20" color="primary">mdi-package-variant</v-icon>
                  </template>
                </v-autocomplete>
                <v-btn icon color="primary" density="comfortable" rounded="0" @click="$emit('add-box')">
                  <v-icon size="20">mdi-plus</v-icon>
                  <v-tooltip activator="parent" location="top">Add Box</v-tooltip>
                </v-btn>
              </div>
            </v-col>
            <v-col cols="12" class="mt-2">
              <v-textarea v-model="form.description" label="Description (Optional)" variant="outlined"
                density="comfortable" rows="3" hide-details="auto"
                placeholder="Add any additional details about this component..." counter maxlength="500" rounded="0">
                <template #prepend-inner>
                  <v-icon size="20" color="primary">mdi-text</v-icon>
                </template>
              </v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4 justify-end ga-2">
        <v-btn variant="outlined" @click="handleClose" :disabled="loading" rounded="0">
          Cancel
        </v-btn>
        <v-btn color="primary" @click="handleSubmit" :loading="loading" variant="flat" prepend-icon="mdi-check"
          rounded="0">
          {{ isEdit ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  componentItem: Object,
  categories: Array,
  boxes: Array
})

const emit = defineEmits(['update:modelValue', 'success', 'add-category', 'add-box'])

const formRef = ref(null)
const fileInput = ref(null)
const loading = ref(false)
const imagePreview = ref(null)

const form = ref({
  name: '',
  category_id: null,
  box_id: null,
  description: '',
  image_content: null,
  image_type: null,
  imaeg_name: null
})

const rules = {
  required: value => !!value || 'This field is required'
}

const isEdit = computed(() => !!props.componentItem?.component_id)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file')
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size must be less than 5MB')
    return
  }

  const reader = new FileReader()

  reader.onload = (e) => {
    const base64String = e.target.result.split(',')[1]
    const imageType = file.type.split('/')[1]

    form.value.image_content = base64String
    form.value.image_type = imageType
    form.value.imaeg_name = file.name
    imagePreview.value = e.target.result
  }

  reader.readAsDataURL(file)
}

const clearImage = () => {
  form.value.image_content = null
  form.value.image_type = null
  form.value.imaeg_name = null
  imagePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    category_id: null,
    box_id: null,
    description: '',
    image_content: null,
    image_type: null,
    imaeg_name: null
  }
  imagePreview.value = null
  formRef.value?.resetValidation()
}

watch(() => props.componentItem, (item) => {
  if (item) {
    form.value = {
      name: item.name || '',
      category_id: item.category_id || null,
      box_id: item.box_id || null,
      description: item.description || '',
      image_content: null,
      image_type: item.image_type || null,
      imaeg_name: item.imaeg_name || null
    }
    // Show existing image
    if (item.filename) {
      imagePreview.value = item.filename
    }
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    setTimeout(resetForm, 300)
  }
})

const handleClose = () => {
  emit('update:modelValue', false)
}

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true

  try {
    // Prepare data - only include image fields if new image was uploaded
    const submitData = {
      name: form.value.name,
      category_id: form.value.category_id,
      box_id: form.value.box_id,
      description: form.value.description || ''
    }

    // Add image data only if a new image was uploaded
    if (form.value.image_content) {
      submitData.image_content = form.value.image_content
      submitData.image_type = form.value.image_type
      submitData.imaeg_name = form.value.imaeg_name
    }

    emit('success', {
      data: submitData,
      isEdit: isEdit.value,
      id: props.componentItem?.component_id
    })

    handleClose()
  } catch (error) {
    console.error('Form submission error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.component-dialog {
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.dialog-header .text-medium-emphasis {
  color: rgba(255, 255, 255, 0.9) !important;
}

.component-icon-display {
  border: 3px dashed rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  position: relative;
}

.component-icon-display:hover {
  border-color: rgba(102, 126, 234, 0.5);
  transform: scale(1.02);
}

.upload-btn {
  position: absolute;
  bottom: -4px;
  right: -4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Force icons to be visible - FIXED */
:deep(.v-icon) {
  opacity: 1 !important;
}

:deep(.v-field__prepend-inner .v-icon) {
  opacity: 1 !important;
}

:deep(.v-btn .v-icon) {
  opacity: 1 !important;
}

/* Scrollbar styling */
:deep(.v-card-text) {
  overflow-y: auto;
}

:deep(.v-card-text::-webkit-scrollbar) {
  width: 8px;
}

:deep(.v-card-text::-webkit-scrollbar-track) {
  background: #f1f1f1;
}

:deep(.v-card-text::-webkit-scrollbar-thumb) {
  background: #888;
  border-radius: 4px;
}

:deep(.v-card-text::-webkit-scrollbar-thumb:hover) {
  background: #555;
}
</style>
