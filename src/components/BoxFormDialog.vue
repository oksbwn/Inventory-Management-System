<template>
  <v-dialog v-model="show" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h6">{{ boxItem ? 'Edit Box' : 'Add New Box' }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="valid" lazy-validation>
          <v-text-field
            v-model="form.box_label"
            :rules="[v => !!v || 'Box label is required']"
            label="Box Label"
            required
          />
          <v-text-field
            v-model="form.box_code"
            :rules="[v => !!v || 'Box code is required']"
            label="Box Code"
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close" :disabled="saving">Cancel</v-btn>
        <v-btn :disabled="!valid || saving" color="primary" @click="submit">
          <span v-if="saving">Saving...</span>
          <span v-else>Save</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
import { useBoxStore } from '@/stores/boxStore'

const props = defineProps({
  boxItem: Object,
  modelValue: Boolean
})
const emits = defineEmits(['update:modelValue', 'success', 'error'])

const show = ref(props.modelValue)
const form = reactive({
  box_label: '',
  box_code: ''
})
const valid = ref(false)
const saving = ref(false)
const formRef = ref(null)

const boxStore = useBoxStore()

// Initialize form fields when dialog opens or boxItem changes
watch(
  () => props.modelValue,
  (val) => {
    show.value = val
    if (val && props.boxItem) {
      form.box_label = props.boxItem.box_label || ''
      form.box_code = props.boxItem.box_code || ''
    } else {
      form.box_label = ''
      form.box_code = ''
    }
  }
)

// Emit modelValue changes on show state change
watch(show, (val) => {
  emits('update:modelValue', val)
})

function close() {
  show.value = false
}

async function submit() {
  if (!(await formRef.value.validate())) return

  saving.value = true
  try {
    if (props.boxItem && props.boxItem.box_id) {
      await boxStore.updateBox(props.boxItem.box_id, {
        box_label: form.box_label,
        box_code: form.box_code
      })
      emits('success', { message: 'Box updated successfully' })
    } else {
      await boxStore.createBox({
        box_label: form.box_label,
        box_code: form.box_code
      })
      emits('success', { message: 'Box created successfully' })
    }
  } catch (err) {
    console.error(err)
    emits('error', { message: 'Failed to save box' })
  } finally {
    saving.value = false
  }
  close()
}
</script>
