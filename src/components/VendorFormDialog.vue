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
          {{ isEditMode ? 'Edit Vendor' : 'Add Vendor' }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="valid">
          <v-text-field
            v-model="form.vendorname"
            :rules="[rules.required]"
            label="Vendor Name"
            required
            dense
          />
          <v-text-field
            v-model="form.website"
            label="Website"
            dense
          />
          <v-text-field
            v-model="form.contactemail"
            label="Contact Email"
            dense
          />
          <v-text-field
            v-model="form.phonenumber"
            label="Phone Number"
            dense
          />
          <!-- Add file upload or icon input for vendor icon if needed -->

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
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  vendorItem: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:modelValue', 'success', 'error']);

const form = ref({
  vendorname: '',
  website: '',
  contactemail: '',
  phonenumber: ''
  // vendoriconname, vendoricontype, vendoriconcontent can be added later
});

const valid = ref(false);
const formRef = ref(null);

const rules = {
  required: value => !!value || 'Required.'
};

const isEditMode = computed(() => !!props.vendorItem);

watch(() => props.vendorItem, (newVal) => {
  if (newVal) {
    form.value = {
      vendorname: newVal.vendor_name || '',
      website: newVal.website || '',
      contactemail: newVal.contact_email  || '',
      phonenumber: newVal.phone_number || ''
    };
  } else {
    resetForm();
  }
});

const resetForm = () => {
  form.value = {
    vendorname: '',
    website: '',
    contactemail: '',
    phonenumber: ''
  };
  if (formRef.value) {
    formRef.value.resetValidation();
  }
};

const closeDialog = () => {
  emit('update:modelValue', false);
  resetForm();
};

const submitForm = async () => {
  if (!formRef.value.validate()) return;

  try {
    let response;
    if (isEditMode.value) {
      response = await $api.updateVendor(props.vendorItem.vendorid, form.value);
    } else {
      response = await $api.createVendor(form.value);
    }
    emit('success', { message: response.data.message, data: response.data.data });
  } catch (error) {
    emit('error', { message: error.message || 'Failed to save vendor' });
  }
};
</script>
