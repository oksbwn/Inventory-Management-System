<template>
  <v-dialog v-model="dialog" max-width="800px" persistent scrollable>
    <v-card class="rounded-lg">
      <v-card-title class="pa-6 pb-4 bg-primary text-white">
        <div class="d-flex align-center">
          <v-icon class="mr-3" color="white">
            {{ isEditMode ? 'mdi-pencil' : 'mdi-plus-circle' }}
          </v-icon>
          <span class="text-h5 font-weight-bold">
            {{ isEditMode ? 'Edit Project' : 'Create New Project' }}
          </span>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="valid" @submit.prevent="handleSubmit">
          <v-row>
            <!-- Project Name -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.name"
                label="Project Name"
                :rules="nameRules"
                prepend-inner-icon="mdi-briefcase"
                variant="outlined"
                density="comfortable"
                required
                clearable
              ></v-text-field>
            </v-col>

            <!-- Project Code -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.code"
                label="Project Code"
                :rules="codeRules"
                prepend-inner-icon="mdi-barcode"
                variant="outlined"
                density="comfortable"
                required
                clearable
                hint="Unique identifier"
                persistent-hint
              ></v-text-field>
            </v-col>

            <!-- Priority -->
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.priority"
                :items="priorities"
                label="Priority"
                :rules="priorityRules"
                prepend-inner-icon="mdi-flag"
                variant="outlined"
                density="comfortable"
                required
              >
                <template v-slot:item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-icon :color="getPriorityColor(item.value)">mdi-flag</v-icon>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>

            <!-- Status -->
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.status"
                :items="statusOptions"
                label="Status"
                :rules="statusRules"
                prepend-inner-icon="mdi-timeline-check"
                variant="outlined"
                density="comfortable"
                required
              ></v-select>
            </v-col>

            <!-- Project Type -->
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.type"
                :items="projectTypes"
                label="Project Type"
                prepend-inner-icon="mdi-shape"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>

            <!-- Start Date -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.startDate"
                label="Start Date"
                type="date"
                :rules="startDateRules"
                prepend-inner-icon="mdi-calendar-start"
                variant="outlined"
                density="comfortable"
                required
              ></v-text-field>
            </v-col>

            <!-- End Date -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.endDate"
                label="End Date"
                type="date"
                :rules="endDateRules"
                prepend-inner-icon="mdi-calendar-end"
                variant="outlined"
                density="comfortable"
                required
              ></v-text-field>
            </v-col>

            <!-- Budget -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formData.budget"
                label="Budget (₹)"
                type="number"
                prepend-inner-icon="mdi-currency-inr"
                variant="outlined"
                density="comfortable"
                min="0"
                step="1000"
              ></v-text-field>
            </v-col>

            <!-- Project Manager -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.projectManager"
                label="Project Manager"
                prepend-inner-icon="mdi-account-tie"
                variant="outlined"
                density="comfortable"
                clearable
              ></v-text-field>
            </v-col>

            <!-- Client/Department -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.client"
                label="Client/Department"
                prepend-inner-icon="mdi-domain"
                variant="outlined"
                density="comfortable"
                clearable
              ></v-text-field>
            </v-col>

            <!-- Completion Percentage -->
            <v-col cols="12">
              <label class="text-caption text-medium-emphasis mb-2 d-block">
                Completion: {{ formData.completionPercentage }}%
              </label>
              <v-slider
                v-model="formData.completionPercentage"
                :min="0"
                :max="100"
                :step="5"
                thumb-label
                color="primary"
                track-color="grey-lighten-2"
              >
                <template v-slot:append>
                  <v-text-field
                    v-model.number="formData.completionPercentage"
                    type="number"
                    style="width: 80px"
                    density="compact"
                    variant="outlined"
                    hide-details
                    min="0"
                    max="100"
                  ></v-text-field>
                </template>
              </v-slider>
            </v-col>

            <!-- Description -->
            <v-col cols="12">
              <v-textarea
                v-model="formData.description"
                label="Project Description"
                prepend-inner-icon="mdi-text"
                variant="outlined"
                density="comfortable"
                rows="3"
                clearable
              ></v-textarea>
            </v-col>

            <!-- Tags -->
            <v-col cols="12">
              <v-combobox
                v-model="formData.tags"
                label="Tags"
                prepend-inner-icon="mdi-tag-multiple"
                variant="outlined"
                density="comfortable"
                multiple
                chips
                closable-chips
                hint="Press Enter to add tags"
                persistent-hint
              ></v-combobox>
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
import { useProjectStore } from '@/stores/projectStore'

const props = defineProps({
  modelValue: Boolean,
  projectItem: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const projectStore = useProjectStore()
const formRef = ref(null)
const valid = ref(false)
const loading = ref(false)

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEditMode = computed(() => !!props.projectItem?.id)

const formData = ref({
  name: '',
  code: '',
  priority: 'Medium',
  status: 'Planning',
  type: 'Internal',
  startDate: '',
  endDate: '',
  budget: 0,
  projectManager: '',
  client: '',
  completionPercentage: 0,
  description: '',
  tags: []
})

const priorities = ref(['Low', 'Medium', 'High', 'Critical'])
const statusOptions = ref(['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'])
const projectTypes = ref(['Internal', 'Client', 'R&D', 'Maintenance', 'Upgrade'])

const nameRules = [
  v => !!v || 'Project name is required',
  v => (v && v.length >= 3) || 'Name must be at least 3 characters'
]

const codeRules = [
  v => !!v || 'Project code is required',
  v => (v && v.length >= 2) || 'Code must be at least 2 characters'
]

const priorityRules = [v => !!v || 'Priority is required']
const statusRules = [v => !!v || 'Status is required']
const startDateRules = [v => !!v || 'Start date is required']
const endDateRules = [
  v => !!v || 'End date is required',
  v => !formData.value.startDate || v >= formData.value.startDate || 'End date must be after start date'
]

const getPriorityColor = (priority) => {
  const colors = {
    'Low': 'grey',
    'Medium': 'info',
    'High': 'warning',
    'Critical': 'error'
  }
  return colors[priority] || 'grey'
}

const resetForm = () => {
  formData.value = {
    name: '',
    code: '',
    priority: 'Medium',
    status: 'Planning',
    type: 'Internal',
    startDate: '',
    endDate: '',
    budget: 0,
    projectManager: '',
    client: '',
    completionPercentage: 0,
    description: '',
    tags: []
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
      await projectStore.updateProject(props.projectItem.id, formData.value)
    } else {
      await projectStore.createProject(formData.value)
    }

    emit('success', {
      type: isEditMode.value ? 'update' : 'create',
      message: `Project ${isEditMode.value ? 'updated' : 'created'} successfully!`
    })
    
    dialog.value = false
    resetForm()
  } catch (error) {
    console.error('Failed to save project:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  dialog.value = false
  resetForm()
}

watch(() => props.projectItem, (newItem) => {
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
