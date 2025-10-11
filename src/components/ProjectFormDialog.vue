<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600px"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="text-h6 font-weight-bold">
          {{ isEditMode ? 'Edit Project' : 'Add Project' }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="form.projectname"
            :rules="[rules.required]"
            label="Project Name"
            required
            dense
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            rows="3"
            dense
          />
          <v-text-field
            v-model="form.status"
            label="Status"
            dense
          />
          <v-text-field
            v-model="form.startdate"
            label="Start Date"
            type="date"
            dense
          />
          <v-text-field
            v-model="form.enddate"
            label="End Date"
            type="date"
            dense
          />
          <v-checkbox
            v-model="form.isytproject"
            label="Is YT Project"
            dense
          />
          <v-text-field
            v-model="form.gitrepository"
            label="Git Repository URL"
            dense
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">Cancel</v-btn>
        <v-btn :disabled="!valid" color="primary" @click="submitForm">
          {{ isEditMode ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  projectItem: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success', 'error'])

const form = ref({
  projectname: '',
  description: '',
  status: '',
  startdate: '',
  enddate: '',
  isytproject: false,
  gitrepository: ''
})

const valid = ref(false)
const formRef = ref(null)

const rules = {
  required: value => !!value || 'Required.'
}

const isEditMode = computed(() => !!props.projectItem)

watch(() => props.projectItem, (newVal) => {
  if (newVal) {
    form.value = {
      projectname: newVal.projectname || '',
      description: newVal.description || '',
      status: newVal.status || '',
      startdate: newVal.startdate || '',
      enddate: newVal.enddate || '',
      isytproject: newVal.isytproject || false,
      gitrepository: newVal.gitrepository || ''
    }
  } else {
    resetForm()
  }
})

const resetForm = () => {
  form.value = {
    projectname: '',
    description: '',
    status: '',
    startdate: '',
    enddate: '',
    isytproject: false,
    gitrepository: ''
  }
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const closeDialog = () => {
  emit('update:modelValue', false)
  resetForm()
}

const submitForm = async () => {
  if (!formRef.value.validate()) return

  try {
    let response
    if (isEditMode.value) {
      // Update existing project
      response = await $api.updateProject(props.projectItem.projectid, form.value)
    } else {
      // Create new project
      response = await $api.createProject(form.value)
    }
    emit('success', { message: response.data.message, data: response.data.data })
  } catch (error) {
    emit('error', { message: error.message || 'Failed to save project' })
  }
}
</script>
