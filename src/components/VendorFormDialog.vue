<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600px"
    persistent>
    <v-card>
      <v-card-title>
        <span class="text-h6 font-weight-bold">{{ isEditMode ? 'Edit Vendor' : 'Add Vendor' }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="valid">
          <v-text-field v-model="form.vendorname" :rules="[rules.required]" label="Vendor Name" required dense />
          <v-text-field v-model="form.website" label="Website" dense />
          <v-text-field v-model="form.contactemail" label="Contact Email" dense />
          <v-text-field v-model="form.phonenumber" label="Phone Number" dense />
          <!-- Icon display, click to open file picker -->
          <div class="mb-4 text-center">
            <img :src="displayedIcon" alt="Vendor Icon"
              style="max-width: 100px; max-height: 100px; cursor: pointer; border-radius: 8px;"
              @click="openFilePicker" />
          </div>
          <!-- Hidden file input -->
          <input type="file" accept="image/*" ref="fileInput" @change="onFileChange" style="display: none" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">Cancel</v-btn>
        <v-btn :disabled="!valid" color="primary" @click="submitForm" :loading="isSubmitting">
          {{ isEditMode ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useVendorStore } from '@/stores/vendorStore';

const props = defineProps({
  modelValue: Boolean,
  vendorItem: Object
});

const emit = defineEmits(['update:modelValue', 'success', 'error']);

const vendorStore = useVendorStore();
const fileInput = ref(null);
const isSubmitting = ref(false);

const form = ref({
  vendorname: '',
  website: '',
  contactemail: '',
  phonenumber: '',
  vendor_icon_name: '',
  vendor_icon_type: '',
  vendor_icon_content: '',
  filename: ''
});

// Track original image data for updates
const originalImage = ref({
  vendor_icon_name: '',
  vendor_icon_type: '',
  vendor_icon_content: ''
});

const valid = ref(false);
const formRef = ref(null);

const rules = {
  required: value => !!value || 'Required.'
};

const isEditMode = computed(() => !!props.vendorItem);

function extractFilenameFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('filename') || url.split('/').pop();
  } catch {
    return url.split('/').pop();
  }
}

// Watch vendorItem for edit mode - fetch image from URL if available
watch(() => props.vendorItem, async (val) => {
  if (val) {
    form.value = {
      vendorname: val.vendor_name || '',
      website: val.website || '',
      contactemail: val.contact_email || '',
      phonenumber: val.phone_number || '',
      vendor_icon_name: val.vendor_icon_name || '',
      vendor_icon_type: val.vendor_icon_type || '',
      vendor_icon_content: val.vendor_icon_content || '',
      filename: val.filename || ''
    };

    // If filename exists but no content, fetch the image and convert to base64
    if (val.filename && !val.vendor_icon_content) {
      try {
        const response = await fetch(val.filename);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = (e) => {
          const filename = extractFilenameFromUrl(val.filename);
          form.value.vendor_icon_content = e.target.result.split(',')[1];
          form.value.vendor_icon_type = blob.type.split('/')[1] || blob.type;
          form.value.vendor_icon_name = filename;
          
          // Store for restoration if user cancels file upload
          originalImage.value = {
            vendor_icon_name: filename,
            vendor_icon_type: blob.type.split('/')[1] || blob.type,
            vendor_icon_content: form.value.vendor_icon_content
          };
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Failed to fetch vendor image:', error);
      }
    } else {
      // If content is already available, just store it
      originalImage.value = {
        vendor_icon_name: val.vendor_icon_name || '',
        vendor_icon_type: val.vendor_icon_type || '',
        vendor_icon_content: val.vendor_icon_content || ''
      };
    }
  } else {
    resetForm();
  }
});

// Show base64 image if available, otherwise fallback to vendorItem icon path, else default
const displayedIcon = computed(() => {
  if (form.value.vendor_icon_content && form.value.vendor_icon_type) {
    return `data:image/${form.value.vendor_icon_type};base64,${form.value.vendor_icon_content}`;
  }
  if (props.vendorItem && props.vendorItem.filename) {
    return props.vendorItem.filename;
  }
  return '/default-vendor.png';
});

function openFilePicker() {
  if (fileInput.value) fileInput.value.click();
}

// Handles <input type="file"> change event
function onFileChange(event) {
  const files = event.target.files;
  if (!files || !files.length) {
    // User cancelled - restore original image if in edit mode
    if (isEditMode.value) {
      form.value.vendor_icon_name = originalImage.value.vendor_icon_name;
      form.value.vendor_icon_type = originalImage.value.vendor_icon_type;
      form.value.vendor_icon_content = originalImage.value.vendor_icon_content;
    } else {
      form.value.vendor_icon_name = '';
      form.value.vendor_icon_type = '';
      form.value.vendor_icon_content = '';
    }
    return;
  }
  const file = files[0];
  form.value.vendor_icon_name = file.name;
  form.value.vendor_icon_type = file.type.split('/')[1] || file.type;
  const reader = new FileReader();
  reader.onload = (e) => {
    form.value.vendor_icon_content = e.target.result.split(',')[1];
  };
  reader.readAsDataURL(file);
}

function resetForm() {
  form.value = {
    vendorname: '',
    website: '',
    contactemail: '',
    phonenumber: '',
    vendor_icon_name: '',
    vendor_icon_type: '',
    vendor_icon_content: '',
    filename: ''
  };
  originalImage.value = {
    vendor_icon_name: '',
    vendor_icon_type: '',
    vendor_icon_content: ''
  };
  if (formRef.value) formRef.value.resetValidation();
}

function closeDialog() {
  emit('update:modelValue', false);
  resetForm();
}

// Updated submitForm function
async function submitForm() {
  if (!formRef.value.validate()) return;
  isSubmitting.value = true;
  try {
    const payload = {
      vendor_name: form.value.vendorname,
      website: form.value.website,
      contact_email: form.value.contactemail,
      phone_number: form.value.phonenumber,
      vendor_icon_name: form.value.vendor_icon_name,
      vendor_icon_type: form.value.vendor_icon_type,
      vendor_icon_content: form.value.vendor_icon_content
    };

    console.log('Submitting payload:', payload); // Debug

    let response;
    if (isEditMode.value) {
      response = await vendorStore.updateVendor(props.vendorItem.vendor_id, payload);
    } else {
      response = await vendorStore.createVendor(payload);
    }

    closeDialog();
    emit('success', { 
      message: isEditMode.value ? 'Vendor updated successfully' : 'Vendor created successfully', 
      data: response 
    });
  } catch (error) {
    emit('error', { message: error.message || 'Failed to save vendor' });
  } finally {
    isSubmitting.value = false;
  }
}
</script>
