<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600px"
    persistent
  >
    <v-card>
      <v-card-title class="pa-6 pb-4">
        <span class="text-h5 font-weight-bold">
          {{ isEdit ? 'Edit Category' : 'Add New Category' }}
        </span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.category_name"
            label="Category Name *"
            :rules="[v => !!v || 'Category name is required']"
            variant="outlined"
            density="comfortable"
            required
            autofocus
            class="mb-4"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          @click="handleClose"
          :disabled="loading"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="handleSubmit"
          :loading="loading"
        >
          {{ isEdit ? 'Update' : 'Create' }}
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

const isEdit = computed(() => !!props.categoryItem?.category_id)

// Define resetForm BEFORE watch
const resetForm = () => {
  form.value = {
    category_name: ''
  }
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

// Now watch can use resetForm
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

  emit('success', {
    data: form.value,
    isEdit: isEdit.value,
    id: props.categoryItem?.category_id
  })
  
  handleClose()
}
</script>
