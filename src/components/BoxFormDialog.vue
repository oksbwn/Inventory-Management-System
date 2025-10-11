<template>
  <v-dialog v-model="show" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h6">{{ boxItem ? 'Edit Box' : 'Add New Box' }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
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
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn :disabled="!valid" color="primary" @click="submit">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, reactive, toRefs } from 'vue'
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  boxItem: Object,
  modelValue: Boolean
})
const emits = defineEmits(['update:modelValue', 'success'])

const show = ref(props.modelValue)
const form = reactive({
  box_label: '',
  box_code: ''
})
const valid = ref(false)
const formRef = ref(null)

watch(() => props.modelValue, val => {
  show.value = val
  if (val && props.boxItem) {
    form.box_label = props.boxItem.box_label
    form.box_code = props.boxItem.box_code
  } else {
    form.box_label = ''
    form.box_code = ''
  }
})

watch(show, val => {
  emits('update:modelValue', val)
})

function close() {
  show.value = false
}

async function submit() {
  if (!(await formRef.value.validate())) return

  try {
    if (props.boxItem && props.boxItem.box_id) {
      await $pinia.store('box').updateBox(props.boxItem.box_id, {
        box_label: form.box_label,
        box_code: form.box_code
      })
      emits('success', { message: 'Box updated successfully' })
    } else {
      await $pinia.store('box').createBox({
        box_label: form.box_label,
        box_code: form.box_code
      })
      emits('success', { message: 'Box created successfully' })
    }
  } catch (err) {
    console.error(err)
  }
  close()
}
</script>
