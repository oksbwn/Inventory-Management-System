<template>
  <v-dialog 
    :model-value="modelValue" 
    @update:model-value="$emit('update:modelValue', $event)" 
    max-width="600px"
    persistent
    scrollable
  >
    <v-card class="category-dialog">
      <v-card-title class="dialog-header pa-6">
        <div class="d-flex align-center">
          <v-avatar 
            :color="isEdit ? 'primary' : 'success'" 
            size="40" 
            class="mr-3"
          >
            <v-icon color="white" size="24">
              {{ isEdit ? 'mdi-pencil' : 'mdi-plus' }}
            </v-icon>
          </v-avatar>
          <div>
            <h2 class="text-h6 font-weight-bold mb-0">
              {{ isEdit ? 'Edit Category' : 'Add New Category' }}
            </h2>
            <p class="text-caption text-medium-emphasis mb-0">
              {{ isEdit ? 'Update category information' : 'Create a new category entry' }}
            </p>
          </div>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <!-- Category Icon Display -->
          <div class="text-center mb-6">
            <v-avatar color="primary" size="80" variant="tonal" class="category-icon-display">
              <v-icon size="40">mdi-shape</v-icon>
            </v-avatar>
            <p class="text-caption text-medium-emphasis mt-3 mb-0">
              Category Icon
            </p>
          </div>

          <!-- Form Fields -->
          <v-row dense>
            <v-col cols="12">
              <v-text-field 
                v-model="form.category_name" 
                label="Category Name *" 
                :rules="[rules.required]"
                prepend-inner-icon="mdi-shape"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                autofocus
                placeholder="e.g., Electronics, Hardware, Software"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-6">
        <v-spacer />
        <v-btn 
          variant="text" 
          @click="handleClose"
          size="large"
          :disabled="loading"
        >
          Cancel
        </v-btn>
        <v-btn 
          color="primary" 
          @click="handleSubmit" 
          :loading="loading"
          size="large"
          variant="flat"
          class="px-6"
        >
          {{ isEdit ? 'Update Category' : 'Create Category' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  categoryItem: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const formRef = ref(null)
const loading = ref(false)

const form = ref({
  category_name: ''
})

const rules = {
  required: value => !!value || 'This field is required'
}

const isEdit = computed(() => !!props.categoryItem?.category_id)

const resetForm = () => {
  form.value = {
    category_name: ''
  }
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

watch(() => props.categoryItem, (newVal) => {
  if (newVal) {
    form.value = {
      category_name: newVal.category_name || ''
    }
  } else {
    resetForm()
  }
}, { immediate: true })

const handleClose = () => {
  emit('update:modelValue', false)
  setTimeout(resetForm, 300)
}

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  
  if (!valid) return

  loading.value = true

  try {
    emit('success', {
      data: form.value,
      isEdit: isEdit.value,
      id: props.categoryItem?.category_id
    })
    
    handleClose()
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.category-dialog {
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

.category-icon-display {
  border: 3px dashed rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.category-icon-display:hover {
  border-color: rgba(102, 126, 234, 0.6);
  transform: scale(1.05);
}
</style>
