<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="pa-6 pb-4 bg-primary text-white">
        <div class="d-flex align-center">
          <v-icon class="mr-3" color="white">
            {{ isEditMode ? 'mdi-pencil' : 'mdi-plus-circle' }}
          </v-icon>
          <span class="text-h5 font-weight-bold">
            {{ isEditMode ? 'Edit Category' : 'Add New Category' }}
          </span>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="valid" @submit.prevent="handleSubmit">
          <v-row>
            <!-- Category Name -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.name"
                label="Category Name"
                :rules="nameRules"
                prepend-inner-icon="mdi-shape"
                variant="outlined"
                density="comfortable"
                required
                clearable
              ></v-text-field>
            </v-col>

            <!-- Icon -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.icon"
                label="Icon (Material Design)"
                :rules="iconRules"
                prepend-inner-icon="mdi-icon"
                variant="outlined"
                density="comfortable"
                hint="e.g., mdi-cpu-64-bit"
                persistent-hint
                clearable
              ></v-text-field>
            </v-col>

            <!-- Color -->
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.color"
                :items="colorOptions"
                label="Color"
                prepend-inner-icon="mdi-palette"
                variant="outlined"
                density="comfortable"
              >
                <template v-slot:item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-avatar :color="item.value" size="24"></v-avatar>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>

            <!-- Description -->
            <v-col cols="12">
              <v-textarea
                v-model="formData.description"
                label="Description"
                prepend-inner-icon="mdi-text"
                variant="outlined"
                density="comfortable"
                rows="3"
                clearable
              ></v-textarea>
            </v-col>

            <!-- Active Status -->
            <v-col cols="12">
              <v-switch
                v-model="formData.isActive"
                label="Active"
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
import { useCategoryStore } from '@/stores/categoryStore'

const props = defineProps({
  modelValue: Boolean,
  categoryItem: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const categoryStore = useCategoryStore()
const formRef = ref(null)
const valid = ref(false)
const loading = ref(false)

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEditMode = computed(() => !!props.categoryItem?.id)

const formData = ref({
  name: '',
  icon: 'mdi-shape',
  color: 'primary',
  description: '',
  isActive: true
})

const colorOptions = ref([
  { title: 'Primary', value: 'primary' },
  { title: 'Secondary', value: 'secondary' },
  { title: 'Success', value: 'success' },
  { title: 'Warning', value: 'warning' },
  { title: 'Error', value: 'error' },
  { title: 'Info', value: 'info' }
])

const nameRules = [
  v => !!v || 'Category name is required',
  v => (v && v.length >= 2) || 'Name must be at least 2 characters',
  v => (v && v.length <= 50) || 'Name must be less than 50 characters'
]

const iconRules = [
  v => !v || v.startsWith('mdi-') || 'Icon must start with "mdi-"'
]

const resetForm = () => {
  formData.value = {
    name: '',
    icon: 'mdi-shape',
    color: 'primary',
    description: '',
    isActive: true
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
      await categoryStore.updateCategory(props.categoryItem.id, formData.value)
    } else {
      await categoryStore.createCategory(formData.value)
    }

    emit('success', {
      type: isEditMode.value ? 'update' : 'create',
      message: `Category ${isEditMode.value ? 'updated' : 'created'} successfully!`
    })
    
    dialog.value = false
    resetForm()
  } catch (error) {
    console.error('Failed to save category:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  dialog.value = false
  resetForm()
}

watch(() => props.categoryItem, (newItem) => {
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
