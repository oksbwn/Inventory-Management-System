<template>
  <v-dialog 
    :model-value="modelValue" 
    @update:model-value="$emit('update:modelValue', $event)" 
    max-width="450px"
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
              {{ isEdit ? 'Update category information' : 'Create a new category' }}
            </p>
          </div>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <!-- Form Fields -->
          <v-row dense>
            <v-col cols="12">
              <BaseFormField
                label="Category Name"
                required
                helper-text="Enter a descriptive category name"
              >
                <v-text-field 
                  v-model="form.category_name" 
                  :rules="[rules.required]"
                  prepend-inner-icon="mdi-shape"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  autofocus
                  placeholder="e.g., Electronics, Hardware, Software"
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
          {{ isEdit ? 'Update Category' : 'Create Category' }}
        </BaseButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'
import { useNotification } from '@/composables/useNotification'

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

const categoryStore = useCategoryStore()
const { success, error } = useNotification()

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
    if (isEdit.value) {
      await categoryStore.updateCategory(
        props.categoryItem.category_id,
        form.value
      )
      success('Category updated successfully!')
    } else {
      await categoryStore.createCategory(form.value)
      success('Category created successfully!')
    }

    await categoryStore.fetchCategories()
    
    emit('success', {
      message: isEdit.value ? 'Category updated successfully!' : 'Category created successfully!',
      isEdit: isEdit.value,
      id: props.categoryItem?.category_id
    })
    
    handleClose()
  } catch (err) {
    console.error('Error submitting category:', err)
    
    const errorMessage = err?.response?.data?.message || 
                        err?.message || 
                        `Failed to ${isEdit.value ? 'update' : 'create'} category`
    
    error(errorMessage, 5000) // Show error for 5 seconds
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
</style>
